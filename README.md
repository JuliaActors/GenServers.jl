# GenServers

A generic server [`Actors`](https://github.com/JuliaActors/Actors.jl) protocol

[![Stable](https://img.shields.io/badge/docs-stable-blue.svg)](https://JuliaActors.github.io/GenServers.jl/stable)
[![Dev](https://img.shields.io/badge/docs-dev-blue.svg)](https://JuliaActors.github.io/GenServers.jl/dev)
[![CI](https://github.com/JuliaActors/GenServers.jl/workflows/CI/badge.svg)](https://github.com/JuliaActors/GenServers.jl/actions)
[![Coverage](https://codecov.io/gh/JuliaActors/GenServers.jl/branch/master/graph/badge.svg)](https://codecov.io/gh/JuliaActors/GenServers.jl)

`GenServers` allows users to write servers by following three steps:

1. Choose a name for your callback module.
2. Write your interface functions, e.g. `start()`, `stop()`...
3. Write the required callback functions: `init`, `oncall`, `oncast`, `oninfo` and `terminate`.

`GenServers` provides a generic template for that.

## Example

Lets assume we have the following file `examples/stack.jl`:

```julia
module Stack

using GenServers

# Client (interface)

start(default) = genserver(@__MODULE__, default)

push(srv, element) = cast(srv, Val(:push), element)

pop(srv) = call(srv, Val(:pop))

# Server (callbacks)

init(stack) = stack

oncast(stack, ::Val{:push}, element) = push!(stack, element)

oncall(stack, ::Val{:pop}) = pop!(stack)

end
```

The module stack contains only purely sequential code. Now we can do:

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

`GenServers` is part of `JuliaActors`.

## Author(s)

- Paul Bayer

## License

MIT
