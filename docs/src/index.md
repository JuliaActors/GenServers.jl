```@meta
CurrentModule = GenServers
```

# GenServers

The GenServer protocol abstracts the common client-server interaction. Developers are only required to implement the callbacks and functionality they are interested in.

## Example

Lets assume we have the following file `examples/stack.jl`:

```julia
module Stack

using GenServers

# Client

start(default) = genserver(@__MODULE__, default)

push(srv, element) = cast(srv, Val(:push), element)

pop(srv) = call(srv, Val(:pop))

# Server (callbacks)

init(stack) = stack

oncast(stack, ::Val{:push}, element) = push!(stack, element)

oncall(stack, ::Val{:pop}) = pop!(stack)

end
```

The module stack contains only purely sequential code. Now we can do

```julia
julia> using GenServers

julia> include("examples/stack.jl")
Main.Stack

julia> gs = Stack.start([1,2,3])
Link{Channel{Any}}(Channel{Any}(sz_max:32,sz_curr:0), 1, :genserver)

julia> query(gs)
([1, 2, 3],)

julia> Stack.push(gs, 4)
Actors.Cast((Val{:push}(), 4))

julia> query(gs)
([1, 2, 3, 4],)

julia> Stack.pop(gs)
4

julia> query(gs)
([1, 2, 3],)
```

```@autodocs
Modules = [GenServers]
```
