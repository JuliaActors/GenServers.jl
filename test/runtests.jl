using GenServers
using Test

@testset "GenServers.jl" begin
    include("../examples/stack.jl")
    gs = Stack.start([1,2,3])
    @test first(query(gs)) == [1,2,3]
    Stack.push(gs, 4)
    @test first(query(gs)) == [1,2,3,4]
    Stack.pop(gs)
    @test first(query(gs)) == [1,2,3]
end
