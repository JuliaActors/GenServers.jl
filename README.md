# GenServers

A generic server [`Actors`](https://github.com/JuliaActors/Actors.jl) protocol

[![Stable](https://img.shields.io/badge/docs-stable-blue.svg)](https://pbayer.github.io/GenServers.jl/stable)
[![Dev](https://img.shields.io/badge/docs-dev-blue.svg)](https://pbayer.github.io/GenServers.jl/dev)
[![Build Status](https://github.com/pbayer/GenServers.jl/workflows/CI/badge.svg)](https://github.com/pbayer/GenServers.jl/actions)
[![Coverage](https://codecov.io/gh/pbayer/GenServers.jl/branch/master/graph/badge.svg)](https://codecov.io/gh/pbayer/GenServers.jl)

`GenServers` allows users to write servers by following three steps:

1. Choose a name for your callback module.
2. Write your interface functions, e.g. `start()`, `stop()`...
3. Write five required callback functions: `init`, `oncall`, `oncast`, `oninfo` and `terminate`.

`GenServers` provides a generic template for that.

## Example

...
