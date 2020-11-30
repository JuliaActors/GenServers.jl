# Understanding GenServers

`GenServers` uses a powerful technique invented around the creation of Erlang/OTP:

> Abstracting out concurrency is one of the most powerful means available for structuring large software systems. ...
> 
> The reason for this is that concurrent code cannot be written in a side-effect free manner, and as such, is more difficult to understand and analyze than purely sequential side-effect free code. In a system involving large numbers of processes, issues of message passing ordering and potential dead- or live-lock problems can make concurrent systems very difficult to understand and program. The most common abstraction used by applications ... is the client–server abstraction. [^1]

With `GenServers` a developer can write a module with purely sequential code which he then can plugin into an `Actors` protocol to get highly thread-safe, distributed and fault-tolerant code.

This keeps the concurrent code within Actors and its infrastructure modules and allows an application developer to focus on functionality.

[^1]: Joe Armstrong: [Making reliable distributed systems in the presence of software errors](https://erlang.org/download/armstrong_thesis_2003.pdf).- p. 87