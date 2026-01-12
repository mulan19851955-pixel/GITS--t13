# Aggressive cache clearing for Cursor/VS Code
Write-Host "=== AGGRESSIVE CACHE CLEARING ===" -ForegroundColor Red

$workspaceStorage = "$env:APPDATA\Cursor\User\workspaceStorage"
Write-Host "`n1. Clearing ALL workspace storage..." -ForegroundColor Yellow
if (Test-Path $workspaceStorage) {
    Get-ChildItem -Path $workspaceStorage -Directory | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   Workspace storage cleared!" -ForegroundColor Green
} else {
    Write-Host "   Workspace storage not found" -ForegroundColor Gray
}

$globalStorage = "$env:APPDATA\Cursor\User\globalStorage"
Write-Host "`n2. Clearing TypeScript-related cache from global storage..." -ForegroundColor Yellow
if (Test-Path $globalStorage) {
    # Find TypeScript related folders
    Get-ChildItem -Path $globalStorage -Directory -Recurse -ErrorAction SilentlyContinue | Where-Object {
        $_.Name -like "*typescript*" -or $_.Name -like "*ts-*" -or $_.Name -like "*tsserver*"
    } | ForEach-Object {
        Write-Host "   Removing: $($_.FullName)" -ForegroundColor Gray
        Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }
}

$cursorCache = "$env:APPDATA\Cursor\CachedData"
Write-Host "`n3. Clearing CachedData..." -ForegroundColor Yellow
if (Test-Path $cursorCache) {
    Get-ChildItem -Path $cursorCache -Directory | ForEach-Object {
        $tsFolder = Join-Path $_.FullName "cached_extensions\ms-vscode.vscode-typescript-next"
        if (Test-Path $tsFolder) {
            Write-Host "   Removing TypeScript extension cache" -ForegroundColor Gray
            Remove-Item -Path $tsFolder -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host "`n4. Clearing project TypeScript cache..." -ForegroundColor Yellow
$tsBuildInfo = Get-ChildItem -Path . -Recurse -Filter "*.tsbuildinfo" -ErrorAction SilentlyContinue
if ($tsBuildInfo) {
    $tsBuildInfo | Remove-Item -Force -ErrorAction SilentlyContinue
    Write-Host "   *.tsbuildinfo files removed" -ForegroundColor Green
}

$nodeCache = "node_modules\.cache"
if (Test-Path $nodeCache) {
    Remove-Item -Path $nodeCache -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   node_modules/.cache cleared" -ForegroundColor Green
}

Write-Host "`n=== CACHE CLEARED! ===" -ForegroundColor Green
Write-Host "`nNOW:" -ForegroundColor Cyan
Write-Host "  1. CLOSE Cursor completely" -ForegroundColor White
Write-Host "  2. Wait 5 seconds" -ForegroundColor White
Write-Host "  3. Open Cursor again" -ForegroundColor White
Write-Host "  4. Ctrl+Shift+P -> TypeScript: Restart TS Server" -ForegroundColor White
Write-Host "  5. Ctrl+Shift+P -> Developer: Reload Window" -ForegroundColor White
