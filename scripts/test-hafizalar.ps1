$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Push-Location $root
try {
  $node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $node) {
    throw "node is required for Hafizalar tests"
  }

  node --test test/hafizalar.test.mjs
  if ($LASTEXITCODE -ne 0) {
    throw "Hafizalar node tests failed"
  }
} finally {
  Pop-Location
}
