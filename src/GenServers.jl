#
# This file is part of the GenServers.jl Julia package, 
# MIT license, part of https://github.com/JuliaActors
#
"""
    GenServers

Implements a generic server `Actors` protocol.

It lets you write an implementation module with a
user API for a server and callback functions which 
are called by the server if certain requests are
issued.

It lets you write purely sequential code while the 
`:genserver` actor cares about the concurrency and 
distributed part. This simplifies greatly the
development of servers. 

The current stable, registered version is installed with
```julia
pkg> add GenServers
```

The development version is installed with:
```julia
pkg> add "https://github.com/JuliaActors/GenServers.jl"
```
"""
module GenServers

"Gives the package version."
const version = v"0.2.0"

using Reexport, Distributed

@reexport using Actors
import Actors: spawn, _ACT, Init, Call, Cast

include("genserver.jl")
include("protocol.jl")
include("callbacks.jl")

export genserver

end
