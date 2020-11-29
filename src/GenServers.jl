#
# This file is part of the GenServers.jl Julia package, 
# MIT license, part of https://github.com/JuliaActors
#
"""
    GenServers

Implements a generic server Actor's protocol.

The current stable, registered version is installed with
```julia
pkg> add Actors
```

The development version is installed with:
```julia
pkg> add "https://github.com/JuliaActors/Actors.jl"
```
"""
module GenServers

"Gives the package version."
const version = v"0.1.0"

using Reexport, Distributed

@reexport using Actors
import Actors: spawn, _ACT, Init, Call, Cast

include("genserver.jl")
include("protocol.jl")

export genserver

end
