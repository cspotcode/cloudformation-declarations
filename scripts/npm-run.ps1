param(
    [Parameter(Position=1)]
    $script = $env:npm_lifecycle_event
)
$ErrorActionPreference = 'Stop'

Function run($script) {
    switch($script) {
        build {
            run generate
            run compile
        }
        compile {
            tsc -p .
        }
        generate {
            ts-node -F ./src/generator/index.ts
            # Push-Location ./src/declarations
            # typedoc --out ../../docs .
            # Pop-Location
        }
        test {
            # TODO
        }
    }
}

run $script
