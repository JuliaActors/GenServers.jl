var documenterSearchIndex = {"docs":
[{"location":"api/#GenServers-API","page":"GenServers API","title":"GenServers API","text":"","category":"section"},{"location":"api/","page":"GenServers API","title":"GenServers API","text":"CurrentModule = GenServers","category":"page"},{"location":"api/#Installation","page":"GenServers API","title":"Installation","text":"","category":"section"},{"location":"api/","page":"GenServers API","title":"GenServers API","text":"GenServers\nGenServers.version","category":"page"},{"location":"api/#GenServers.GenServers","page":"GenServers API","title":"GenServers.GenServers","text":"GenServers\n\nImplements a generic server Actors protocol.\n\nIt lets you write an implementation module with a user API for a server and callback functions which  are called by the server if certain requests are issued.\n\nIt lets you write purely sequential code while the  :genserver actor cares about the concurrency and  distributed part. This simplifies greatly the development of servers. \n\nThe current stable, registered version is installed with\n\npkg> add GenServers\n\nThe development version is installed with:\n\npkg> add \"https://github.com/JuliaActors/GenServers.jl\"\n\n\n\n\n\n","category":"module"},{"location":"api/#GenServers.version","page":"GenServers API","title":"GenServers.version","text":"Gives the package version.\n\n\n\n\n\n","category":"constant"},{"location":"api/","page":"GenServers API","title":"GenServers API","text":"using GenServers\nGenServers.version","category":"page"},{"location":"api/#Starting-a-Server","page":"GenServers API","title":"Starting a Server","text":"","category":"section"},{"location":"api/","page":"GenServers API","title":"GenServers API","text":"A :genserver actor usually is started with something it should serve, e.g. files, a printer, a dictionary ...","category":"page"},{"location":"api/","page":"GenServers API","title":"GenServers API","text":"genserver","category":"page"},{"location":"api/#GenServers.genserver","page":"GenServers API","title":"GenServers.genserver","text":"genserver(m::Module, args...; name=nothing, \n    pid=myid(), thrd=false, \n    sticky=false, taskref=nothing)\n\nCreate an actor in :genserver mode. It uses the  callbacks in a user provided module m when processing messages.\n\nArguments\n\nm::Module: a user provided module in current scope,\nargs...: arguments to the user provided init callback.\n\nKeyword Arguments\n\nname=nothing: if a name::Symbol is provided the server    is registered and the name is returned,\npid=myid(): worker pid to create the actor on,\nthrd=false: thread to create the actor on,\nsticky=false: if true, the actor is created in    the same thread,\ntaskref=nothing: if a Ref{Task} variable is    provided, it gets the created Task.  \n\n\n\n\n\n","category":"function"},{"location":"intro/#Introduction","page":"Introduction","title":"Introduction","text":"","category":"section"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"Lets assume you write a small module examples/stack.jl:","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"module Stack\nusing GenServers\nexport start, push, pop, info\n\n# Client (interface)\n\nstart(default) = genserver(@__MODULE__, default)\nstart(name, default) = genserver(@__MODULE__, default, name=name)\n\npush(srv, element) = cast(srv, Val(:push), element)\n\npop(srv) = call(srv, Val(:pop))\n\ninfo(srv) = first(query(srv))\n\nreset(srv) = cast(srv, Val(:empty)) \n\nstop(srv) = exit!(srv)\n\n# Server (callbacks)\n\ninit(stack) = stack\n\noncast(stack, ::Val{:push}, element) = push!(stack, element)\noncast(stack, ::Val{:empty}) = empty!(stack)\n\noncall(stack, ::Val{:pop}) = pop!(stack)\n\nend","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"Your module contains only purely sequential code. Now you can do:","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"julia> include(\"examples/stack.jl\")\nMain.Stack\n\njulia> using .Stack\n\njulia> st = start([1,2,3])    # create a stack genserver\nActors.Link{Channel{Any}}(Channel{Any}(sz_max:32,sz_curr:0), 1, :genserver)\n\njulia> info(st)\n3-element Array{Int64,1}:\n 1\n 2\n 3\n\njulia> push(st, 4)\nActors.Cast((Val{:push}(), 4))\n\njulia> info(st)\n4-element Array{Int64,1}:\n 1\n 2\n 3\n 4\n\njulia> pop(st)\n4","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"This may not look like much, but you may be interested to learn that you just wrote concurrent, thread-safe and distributed code:","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"julia> Stack.reset(st)\nActors.Cast((Val{:empty}(),))\n\njulia> info(st)\nInt64[]\n\njulia> using .Threads\n\njulia> for _ in 1:1000    # push asynchronously\n           Threads.@spawn begin\n               push(st, threadid())\n           end\n       end\n\njulia> length(info(st))\n1000\n\njulia> c = zeros(Int, nthreads());\n\njulia> for i in info(st)  # compute the scheduled threads\n           c[i] += 1\n       end\n\njulia> c                  # show them\n8-element Array{Int64,1}:\n  34\n  49\n 120\n  65\n 146\n 201\n  84\n 301","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"Or with Distributed:","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"julia> using Distributed\n\njulia> addprocs();\n\njulia> nworkers()\n16\n\njulia> @everywhere include(\"examples/stack.jl\")\n\njulia> @everywhere using .Stack\n\njulia> start(:stack, Int[])  # now we register the stack\n:stack\n\njulia> info(:stack)\nInt64[]\n\njulia> fetch(@spawnat 2 info(:stack))\nInt64[]\n\njulia> @everywhere push(:stack, myid())\n\njulia> info(:stack)\n17-element Array{Int64,1}:\n  1\n  2\n  7\n 10\n  5\n  ⋮\n 12\n 17\n  4\n 15\n 14","category":"page"},{"location":"template/#GenServers-Template","page":"GenServers Template","title":"GenServers Template","text":"","category":"section"},{"location":"template/","page":"GenServers Template","title":"GenServers Template","text":"In order to write your plugin to GenServers, you can use the following template:","category":"page"},{"location":"template/","page":"GenServers Template","title":"GenServers Template","text":"module MyPlugin\nusing GenServers\n\nexport start   # export further interface functions\n\n# Client (interface)\n#\n# start your server with a default... value. The server\n# then executes the init callback with the provided\n# default... \n#\nstart(default...) = genserver(@__MODULE__, default...)\n# \n# start your server with a default value and give\n# it a name (a name is a symbol, e.g. :myserver)\n# \nstart(name, default...) = genserver(@__MODULE__, default..., name=name)\n\n# \n# write your further interface functions here\n#\n\n# Server (callbacks)\n\n# this is called at server start\n# the server passes in the default... value it got at startup.\nfunction init(default...) \n    # write some initialization code here if needed\n    return default  # the server state gets this return value\nend\n\n# this is called at a cast message\n# the server passes in its state as default...\n# dispatch on various msg...  delivered with Cast\nfunction oncast(default..., msg...)\n    # your code here\nend\n\n# this is called at a call message\n# the server passes in its state as default...\n# dispatch on various msg...  delivered with Call\nfunction oncall(default..., msg...)\n    # your code here\n    # the return value is sent back to the caller\nend\n\nend","category":"page"},{"location":"callbacks/#GenServers-Callbacks","page":"GenServers Callbacks","title":"GenServers Callbacks","text":"","category":"section"},{"location":"callbacks/","page":"GenServers Callbacks","title":"GenServers Callbacks","text":"The callback functions are part of an implementation module and are called by the :genserver actor on startup or on cast and call requests:","category":"page"},{"location":"callbacks/","page":"GenServers Callbacks","title":"GenServers Callbacks","text":"init\noncast\noncall","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = GenServers","category":"page"},{"location":"#GenServers","page":"Home","title":"GenServers","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"GenServers is an Actors protocol. It abstracts the common client-server interaction. Developers are only required to implement the callbacks and functionality they are interested in.","category":"page"},{"location":"#Overview","page":"Home","title":"Overview","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Introduction\nUnderstanding GenServers\nGenservers API\nGenServer Callbacks\nGenServer Template","category":"page"},{"location":"","page":"Home","title":"Home","text":"Genservers is part of JuliaActors","category":"page"},{"location":"#Author(s)","page":"Home","title":"Author(s)","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Paul Bayer","category":"page"},{"location":"#License","page":"Home","title":"License","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"MIT","category":"page"},{"location":"genserver/#Understanding-GenServers","page":"Understanding GenServers","title":"Understanding GenServers","text":"","category":"section"},{"location":"genserver/","page":"Understanding GenServers","title":"Understanding GenServers","text":"GenServers uses a powerful technique invented around the creation of Erlang/OTP:","category":"page"},{"location":"genserver/","page":"Understanding GenServers","title":"Understanding GenServers","text":"Abstracting out concurrency is one of the most powerful means available for structuring large software systems. ...The reason for this is that concurrent code cannot be written in a side-effect free manner, and as such, is more difficult to understand and analyze than purely sequential side-effect free code. In a system involving large numbers of processes, issues of message passing ordering and potential dead- or live-lock problems can make concurrent systems very difficult to understand and program. The most common abstraction used by applications ... is the client–server abstraction. [1]","category":"page"},{"location":"genserver/#Generic-Server-code","page":"Understanding GenServers","title":"Generic Server code","text":"","category":"section"},{"location":"genserver/","page":"Understanding GenServers","title":"Understanding GenServers","text":"GenServers provides generic and concurrent server code for","category":"page"},{"location":"genserver/","page":"Understanding GenServers","title":"Understanding GenServers","text":"spawning a :genserver actor,\nsetting and maintaining its state,\nreacting to messages and\nresponding to the caller","category":"page"},{"location":"genserver/#Implementation-Code","page":"Understanding GenServers","title":"Implementation Code","text":"","category":"section"},{"location":"genserver/","page":"Understanding GenServers","title":"Understanding GenServers","text":"A developer writes an implementation module with purely sequential code consisting of interface and callback functions determining ","category":"page"},{"location":"genserver/","page":"Understanding GenServers","title":"Understanding GenServers","text":"initial server state,\nhandling of messages and\nwhat to respond to them.","category":"page"},{"location":"genserver/","page":"Understanding GenServers","title":"Understanding GenServers","text":"With the genserver function she starts the :genserver actor, which plugs in the implementation module. On startup or on messages the actor executes the provided callback functions.","category":"page"},{"location":"genserver/","page":"Understanding GenServers","title":"Understanding GenServers","text":"Two types of requests can be issued to a server process: call and cast:","category":"page"},{"location":"genserver/","page":"Understanding GenServers","title":"Understanding GenServers","text":"A Cast is a fire-and-forget type of communication. The caller sends a message and immediately moves on to do something else.\nA Call is a send-and-respond communication: The caller sends a message and either\nif he provides a link, he can read the response from that asynchronously or\nif not, he waits (synchronously) until the response or a timeout arrives.","category":"page"},{"location":"genserver/","page":"Understanding GenServers","title":"Understanding GenServers","text":"This keeps the concurrent code within the Actors infrastructure and allows an application developer to focus on functionality while getting highly thread-safe, distributed and fault-tolerant code.","category":"page"},{"location":"genserver/","page":"Understanding GenServers","title":"Understanding GenServers","text":"[1]: Joe Armstrong: Making reliable distributed systems in the presence of software errors.- p. 87","category":"page"}]
}
