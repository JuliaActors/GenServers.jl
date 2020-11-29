#
# This file is part of the GenServers.jl Julia package, 
# MIT license, part of https://github.com/JuliaActors
#

id(m::Module) = m

function check(m::Module)
end

"""
```
genserver(m::Module, args...; name=nothing, 
    pid=myid(), thrd=false, 
    sticky=false, taskref=nothing)
```

Create an actor in `:genserver` mode. It uses the 
callbacks in a user provided module `m` when processing
messages.

# Arguments

- `m::Module`: a user provided module in current scope,
- `args...`: arguments to the user provided `init` callback.

# Keyword Arguments
- `name=nothing`: if a `name::Symbol` is provided the server 
    is registered and the name is returned,
- `pid=myid()`: worker pid to create the actor on,
- `thrd=false`: thread to create the actor on,
- `sticky=false`: if `true`, the actor is created in 
    the same thread,
- `taskref=nothing`: if a `Ref{Task}` variable is 
    provided, it gets the created `Task`.  
"""
function genserver(m::Module, args...; name=nothing, 
                pid=myid(), thrd=false, 
                sticky=false, taskref=nothing)
    s = spawn(Func(id, m); mode=:genserver, pid=pid,
            thrd=thrd, sticky=sticky, taskref=taskref)
    isnothing(name) || register(name, s)
    init!(s, m.init, args...)
    return isnothing(name) ? s : name
end
