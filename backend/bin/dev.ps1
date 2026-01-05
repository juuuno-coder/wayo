$OutputEncoding = [Console]::InputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding
chcp 65001
$env:LC_ALL='en_US.UTF-8'
$env:LANG='en_US.UTF-8'

Write-Host "🚀 Starting Rails Server in Robust Mode (Korean Path Safe)..." -ForegroundColor Green
bundle exec rails server -p 3401
