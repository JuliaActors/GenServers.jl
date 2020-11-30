using GenServers
using Documenter

makedocs(;
    modules=[GenServers],
    authors="Paul Bayer",
    repo="https://github.com/JuliaActors/GenServers.jl/blob/{commit}{path}#L{line}",
    sitename="GenServers.jl",
    format=Documenter.HTML(;
        prettyurls=get(ENV, "CI", "false") == "true",
        canonical="https://JuliaActors.github.io/GenServers.jl",
        assets=String[],
    ),
    pages=[
        "Home" => "index.md",
        "intro.md",
        "genserver.md",
        "api.md",
        "callbacks.md",
    ],
)

deploydocs(
    repo="github.com/JuliaActors/GenServers.jl",
    target = "build",
    deps   = nothing,
    make   = nothing,
    devbranch = "master",
    devurl = "dev",
    versions = ["stable" => "v^", "v#.#", "dev" => "dev"]
)
