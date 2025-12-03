# Test Database Setup Script

Write-Host "Testing Mongoose Database Setup" -ForegroundColor Green

$baseUrl = "http://localhost:3000/api"

# Wait for server to be fully ready
Write-Host "Waiting for server to respond..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test 1: Check seeding status
Write-Host "[TEST 1] Check Seeding Status" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/seed" -Method Get -TimeoutSec 10 -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Seed database
Write-Host "`n[TEST 2] Seed Database with POST" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/seed" -Method Post -TimeoutSec 30 -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Error: $_" -ForegroundColor Yellow
}

# Test 3: Verify seeding
Write-Host "`n[TEST 3] Verify Seeding Status" -ForegroundColor Cyan
Start-Sleep -Seconds 2
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/seed" -Method Get -TimeoutSec 10 -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host "`nTesting complete!" -ForegroundColor Green
