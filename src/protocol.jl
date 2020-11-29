#
# This file is part of the GenServers.jl Julia package, 
# MIT license, part of https://github.com/JuliaActors
#

function Actors.onmessage(A::_ACT, ::Val{:genserver}, msg::Init)
    A.init = msg.x       # save the init Func
    A.usr = A.bhv()      # put the module into A.usr
    A.sta = (A.init(),)  # exec the init function
end

function Actors.onmessage(A::_ACT, ::Val{:genserver}, msg::Call)
    A.res = A.usr.oncall(A.sta..., msg.x...)
    send(msg.from, Response(A.res, A.self))
end

function Actors.onmessage(A::_ACT, ::Val{:genserver}, msg::Cast)
    A.res = A.usr.oncast(A.sta..., msg.x...)
end
