$productsDir = "C:\Users\HomePC\Desktop\opnmart\app\dashboards\vendor\[vendorId]\components\Products"
$refactoredFile = Join-Path $productsDir "Products-refactored.tsx"

if (Test-Path $refactoredFile) {
    Remove-Item $refactoredFile -Force
    Write-Host "✅ Products-refactored.tsx deleted successfully"
} else {
    Write-Host "❌ Products-refactored.tsx not found"
}

# Verify only Products.tsx remains
$files = Get-ChildItem $productsDir -Filter "*.tsx" -File
Write-Host "`n📦 Remaining files:"
$files | ForEach-Object { Write-Host "  - $($_.Name)" }
