# GenServer Template

In order to write your plugin to GenServers you can use the following template:

```julia
module MyPlugin
using GenServers

export start   # export further interface functions

# Client (interface)

start(default...) = genserver(@__MODULE__, default...)
start(name, default...) = genserver(@__MODULE__, default..., name=name)

# 
# write your further interface functions here
#

# Server (callbacks)

function init(default...) 
    # write some initialization code here if needed
    return default  # the server state gets this return value
end

function oncast(default..., msg...) 
    # dispatch on Cast messages
end

function oncall(default..., msg...)
    # dispatch on Call messages
end

end
```
