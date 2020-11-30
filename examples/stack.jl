module Stack

using GenServers

export start, push, pop, info

# Client (interface)

start(default) = genserver(@__MODULE__, default)
start(name, default) = genserver(@__MODULE__, default, name=name)

push(srv, element) = cast(srv, Val(:push), element)

pop(srv) = call(srv, Val(:pop))

info(srv) = first(query(srv))

reset(srv) = cast(srv, Val(:empty)) 

stop(srv) = exit!(srv)

# Server (callbacks)

init(stack) = stack

oncast(stack, ::Val{:push}, element) = push!(stack, element)
oncast(stack, ::Val{:empty}) = empty!(stack)

oncall(stack, ::Val{:pop}) = pop!(stack)

end
