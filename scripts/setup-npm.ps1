<#
  scripts/setup-npm.ps1
  Safe automation for npm-based cleanup and install.
  Run from repository root with PowerShell:
    powershell -ExecutionPolicy Bypass -File .\scripts\setup-npm.ps1

  NOTE: This script will delete `node_modules` and `.next` and may remove lockfiles.
  Close editors/terminals before running. Run as Administrator if you expect permission issues.
#>

function AbortIf([string]$msg) {
  Write-Host "ERROR: $msg" -ForegroundColor Red
  exit 1
}

Write-Host "Repository root: $(Get-Location)" -ForegroundColor Cyan

$confirm = Read-Host "This script will remove build artifacts and reinstall dependencies. Continue? (y/N)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') { AbortIf "User cancelled." }

Write-Host "Removing .next (if exists)" -ForegroundColor Cyan
if (Test-Path .next) { Remove-Item -Recurse -Force .next; Write-Host ".next removed" }

Write-Host "Removing node_modules (if exists)" -ForegroundColor Cyan
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules; Write-Host "node_modules removed" }

Write-Host "Removing pnpm artifacts and ignored folders (if present)" -ForegroundColor Cyan
if (Test-Path "node_modules/.ignored") { Remove-Item -Recurse -Force "node_modules/.ignored"; Write-Host "node_modules/.ignored removed" }

Write-Host "Removing other lockfiles (pnpm/yarn) if present" -ForegroundColor Cyan
if (Test-Path pnpm-lock.yaml) { Remove-Item -Force pnpm-lock.yaml; Write-Host "pnpm-lock.yaml removed" }
if (Test-Path yarn.lock) { Remove-Item -Force yarn.lock; Write-Host "yarn.lock removed" }

Write-Host "Cleaning npm cache (optional)" -ForegroundColor Cyan
npm cache clean --force

Write-Host "Installing dependencies with npm" -ForegroundColor Cyan
npm install

Write-Host "Starting dev server" -ForegroundColor Cyan
npm run dev
