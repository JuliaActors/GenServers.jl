using GenServers
using Documenter

makedocs(;
    modules=[GenServers],
    authors="Paul Bayer",
    repo="https://github.com/pbayer/GenServers.jl/blob/{commit}{path}#L{line}",
    sitename="GenServers.jl",
    format=Documenter.HTML(;
        prettyurls=get(ENV, "CI", "false") == "true",
        canonical="https://pbayer.github.io/GenServers.jl",
        assets=String[],
    ),
    pages=[
        "Home" => "index.md",
    ],
)

deploydocs(;
    repo="github.com/pbayer/GenServers.jl",
)
