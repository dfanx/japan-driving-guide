$ErrorActionPreference = "Stop"

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Push-Location $ProjectRoot

try {
    npm run verify
    if ($LASTEXITCODE -ne 0) { throw "Verification failed" }
}
finally {
    Pop-Location
}

