# Fix Windows file lock issues for Next.js development
# Run this script if you get EPERM errors when running `npm run dev`

Write-Host "Cleaning Next.js build cache and temporary files..." -ForegroundColor Green

# Kill any running Node processes from this folder (optional but recommended)
# Write-Host "Stopping Node processes..." -ForegroundColor Yellow
# Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Remove .next folder (Next.js build cache)
if (Test-Path ".next") {
    Write-Host "Removing .next folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
    if ($?) { Write-Host ".next removed successfully" -ForegroundColor Green }
    else { Write-Host "Warning: Could not remove .next (may be in use)" -ForegroundColor Yellow }
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
& npm cache clean --force

Write-Host "`nCleanup complete! You can now run:" -ForegroundColor Green
Write-Host "  npm run dev" -ForegroundColor Cyan
