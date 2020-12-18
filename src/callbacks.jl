#
# This file is part of the GenServers.jl Julia package, 
# MIT license, part of https://github.com/JuliaActors
#

"""
    init(default...)

This callback function is called on startup by a 
`:genserver` actor. It gets the `default...` argument 
provided with the [`genserver`](@ref) start function.

Its return value is saved in the `:genserver` actor's
state variable and then served to subsequent `call` and 
`cast` callbacks.
"""
function init end

"""
    oncast(default..., msg...)

This callback function is executed on the `default...` 
state variable with `msg...` message arguments from a
`cast` request. This can be used to modify the 
`default...` state variable(s).
"""
function oncast end

"""
    oncall(default..., msg...)

This callback function is executed on the `default...` 
state variable with `msg...` message arguments from a
`call` request. This can be used to modify the 
`default...` state variable(s). Its return value is
sent back to the caller.
"""
function oncall end
