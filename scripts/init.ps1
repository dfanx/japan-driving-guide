$ErrorActionPreference = "Stop"

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Push-Location $ProjectRoot

try {
    $env:npm_config_cache = Join-Path $ProjectRoot ".npm-cache"
    npm ci --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }

    npm run install:browsers
    if ($LASTEXITCODE -ne 0) { throw "Playwright browser installation failed" }

    Write-Host "Initialization complete. Run: npm run verify"
}
finally {
    Pop-Location
}

