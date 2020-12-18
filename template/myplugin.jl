module MyPlugin
using GenServers

export start   # export further interface functions

# Client (interface)
#
# start your server with a default... value. The server
# then executes the init callback with the provided
# default... 
#
start(default...) = genserver(@__MODULE__, default...)
# 
# start your server with a default value and give
# it a name (a name is a symbol, e.g. :myserver)
# 
start(name, default...) = genserver(@__MODULE__, default..., name=name)

# 
# write your further interface functions here
#

# Server (callbacks)

# this is called at server start
# the server passes in the default... value it got at startup.
function init(default...) 
    # write some initialization code here if needed
    return default  # the server state gets this return value
end

# this is called at a cast message
# the server passes in its state as default...
# dispatch on various msg...  delivered with Cast
function oncast(default..., msg...)
    # your code here
end

# this is called at a call message
# the server passes in its state as default...
# dispatch on various msg...  delivered with Call
function oncall(default..., msg...)
    # your code here
    # the return value is sent back to the caller
end

end
