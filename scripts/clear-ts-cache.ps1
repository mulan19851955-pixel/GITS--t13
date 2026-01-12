# Clear TypeScript cache in Cursor/VS Code
Write-Host "Clearing TypeScript cache..." -ForegroundColor Cyan

# Clear workspaceStorage for current project
$workspaceStorage = "$env:APPDATA\Cursor\User\workspaceStorage"
if (Test-Path $workspaceStorage) {
    $folders = Get-ChildItem -Path $workspaceStorage -Directory
    foreach ($folder in $folders) {
        $workspaceJson = Join-Path $folder.FullName "workspace.json"
        if (Test-Path $workspaceJson) {
            try {
                $content = Get-Content $workspaceJson -Raw | ConvertFrom-Json -ErrorAction SilentlyContinue
                if ($content -and $content.folder) {
                    $folderPath = $content.folder -replace "file:///", "" -replace "%3A", ":"
                    if ($folderPath -like "*GITS*" -or $folderPath -like "*T13*" -or $folderPath -like "*Ghost*") {
                        Write-Host "Removing workspace cache: $($folder.Name)" -ForegroundColor Yellow
                        Remove-Item -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue
                    }
                }
            } catch {
                # Skip if JSON parsing fails
            }
        }
    }
}

# Clear TypeScript cache in node_modules
$tsCache = "node_modules\.cache\typescript"
if (Test-Path $tsCache) {
    Write-Host "Removing TypeScript cache from node_modules..." -ForegroundColor Yellow
    Remove-Item -Path $tsCache -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove tsbuildinfo files
$tsBuildInfo = Get-ChildItem -Path . -Recurse -Filter "*.tsbuildinfo" -ErrorAction SilentlyContinue
if ($tsBuildInfo) {
    Write-Host "Removing *.tsbuildinfo files..." -ForegroundColor Yellow
    $tsBuildInfo | Remove-Item -Force -ErrorAction SilentlyContinue
}

Write-Host "`nCache cleared!" -ForegroundColor Green
Write-Host "Now in Cursor:" -ForegroundColor Cyan
Write-Host "  1. Ctrl+Shift+P -> TypeScript: Restart TS Server" -ForegroundColor White
Write-Host "  2. Ctrl+Shift+P -> Developer: Reload Window" -ForegroundColor White
