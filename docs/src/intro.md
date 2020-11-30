# Introduction

Lets assume you write a small module `examples/stack.jl`:

```julia
module Stack
using GenServers
export start, push, pop, info

# Client (interface)

start(default) = genserver(@__MODULE__, default)
start(name, default) = genserver(@__MODULE__, default, name=name)

push(srv, element) = cast(srv, Val(:push), element)

pop(srv) = call(srv, Val(:pop))

info(srv) = first(query(srv))

reset(srv) = cast(srv, Val(:empty)) 

stop(srv) = exit!(srv)

# Server (callbacks)

init(stack) = stack

oncast(stack, ::Val{:push}, element) = push!(stack, element)
oncast(stack, ::Val{:empty}) = empty!(stack)

oncall(stack, ::Val{:pop}) = pop!(stack)

end
```

Your module contains only purely sequential code. Now you can do:

```julia
julia> include("examples/stack.jl")
Main.Stack

julia> using .Stack

julia> st = start([1,2,3])    # create a stack genserver
Actors.Link{Channel{Any}}(Channel{Any}(sz_max:32,sz_curr:0), 1, :genserver)

julia> info(st)
3-element Array{Int64,1}:
 1
 2
 3

julia> push(st, 4)
Actors.Cast((Val{:push}(), 4))

julia> info(st)
4-element Array{Int64,1}:
 1
 2
 3
 4

julia> pop(st)
4
```

This may not look like much, but you may be interested to learn that you just wrote concurrent, thread-safe and distributed code:

```julia
julia> Stack.reset(st)
Actors.Cast((Val{:empty}(),))

julia> info(st)
Int64[]

julia> using .Threads

julia> for _ in 1:1000    # push asynchronously
           Threads.@spawn begin
               push(st, threadid())
           end
       end

julia> length(info(st))
1000

julia> c = zeros(Int, nthreads());

julia> for i in info(st)  # compute the scheduled threads
           c[i] += 1
       end

julia> c                  # show them
8-element Array{Int64,1}:
  34
  49
 120
  65
 146
 201
  84
 301
```

Or with `Distributed`:

```julia
julia> using Distributed

julia> addprocs();

julia> nworkers()
16

julia> @everywhere include("examples/stack.jl")

julia> @everywhere using .Stack

julia> start(:stack, Int[])  # now we register the stack
:stack

julia> info(:stack)
Int64[]

julia> fetch(@spawnat 2 info(:stack))
Int64[]

julia> @everywhere push(:stack, myid())

julia> info(:stack)
17-element Array{Int64,1}:
  1
  2
  7
 10
  5
  ⋮
 12
 17
  4
 15
 14
```
