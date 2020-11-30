using GenServers
using SafeTestsets, Test

@safetestset "GenServers.jl" begin
    include("../examples/stack.jl")
    using .Stack

    gs = start([1,2,3])
    @test info(gs) == [1,2,3]
    push(gs, 4)
    @test info(gs) == [1,2,3,4]
    @test pop(gs) == 4
    @test info(gs) == [1,2,3]
end
