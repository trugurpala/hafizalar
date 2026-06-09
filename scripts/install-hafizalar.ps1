param(
  [string]$Target = (Get-Location).Path,
  [ValidateSet("codex", "chatgpt", "both")]
  [string]$Surface = "both",
  [switch]$DryRun,
  [switch]$Force
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$installer = Join-Path $scriptRoot "install-hafizalar.mjs"

$argsList = @($installer, "--target", $Target, "--surface", $Surface)
if ($DryRun) {
  $argsList += "--dry-run"
}
if ($Force) {
  $argsList += "--force"
}

node @argsList
