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
