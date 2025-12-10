# Start both frontend and backend servers simultaneously

Write-Host "🚀 Starting OpenMart Frontend and Backend..." -ForegroundColor Green
Write-Host ""

# Kill any existing Node processes
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Backend (NestJS on port 3001)
Write-Host "Starting Backend (NestJS on port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\HomePC\Desktop\opnmart\backend'; npm run start" -WindowStyle Normal

# Wait for backend to initialize
Start-Sleep -Seconds 5

# Start Frontend (Next.js on port 3000)
Write-Host "Starting Frontend (Next.js on port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\HomePC\Desktop\opnmart'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Both servers started!" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor Green
Write-Host ""
Write-Host "Note: Two new PowerShell windows have been opened." -ForegroundColor Yellow
Write-Host "   Keep both windows open to maintain the servers running." -ForegroundColor Yellow
