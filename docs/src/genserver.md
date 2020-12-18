# Understanding `GenServers`

`GenServers` uses a powerful technique invented around the creation of Erlang/OTP:

> Abstracting out concurrency is one of the most powerful means available for structuring large software systems. ...
> 
> The reason for this is that concurrent code cannot be written in a side-effect free manner, and as such, is more difficult to understand and analyze than purely sequential side-effect free code. In a system involving large numbers of processes, issues of message passing ordering and potential dead- or live-lock problems can make concurrent systems very difficult to understand and program. The most common abstraction used by applications ... is the client–server abstraction. [^1]

## Generic Server code

`GenServers` provides generic and concurrent server code for

- spawning a `:genserver` actor,
- setting and maintaining its state,
- reacting to messages and
- responding to the caller

## Implementation Code

A developer writes an *implementation module* with purely sequential code consisting of interface and
callback functions determining 

- initial server state,
- handling of messages and
- what to respond to them.

With the [`genserver`](@ref) function she starts the `:genserver` actor, which plugs in the implementation module. On startup or on messages the actor executes the provided callback functions.

Two types of requests can be issued to a server process: [`call`](https://juliaactors.github.io/Actors.jl/dev/api/#Actors.call) and [`cast`](https://juliaactors.github.io/Actors.jl/dev/api/#Actors.cast):

- A `Cast` is a fire-and-forget type of communication. The caller sends a message and immediately moves on to do something else.
- A `Call` is a send-and-respond communication: The caller sends a message and either
    - if he provides a link, he can read the response from that asynchronously or
    - if not, he waits (synchronously) until the response or a timeout arrives.

This keeps the concurrent code within the `Actors` infrastructure and allows an application developer to focus on functionality while getting highly thread-safe, distributed and fault-tolerant code.

[^1]: Joe Armstrong: [Making reliable distributed systems in the presence of software errors](https://erlang.org/download/armstrong_thesis_2003.pdf).- p. 87