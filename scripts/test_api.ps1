# PowerShell script to test API endpoints
$coingecko = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
$exrate = 'https://api.exchangerate-api.com/v4/latest/USD'

Write-Host "Testing CoinGecko..."
try {
    $r = Invoke-WebRequest -Uri $coingecko -UseBasicParsing -TimeoutSec 10
    if ($r.StatusCode -eq 200) { Write-Host "CoinGecko: OK" } else { Write-Host "CoinGecko: HTTP $($r.StatusCode)" }
} catch {
    Write-Host "CoinGecko: FAILED - $($_.Exception.Message)"
}

Write-Host "Testing ExchangeRate API..."
try {
    $r = Invoke-WebRequest -Uri $exrate -UseBasicParsing -TimeoutSec 10
    if ($r.StatusCode -eq 200) { Write-Host "ExchangeRate: OK" } else { Write-Host "ExchangeRate: HTTP $($r.StatusCode)" }
} catch {
    Write-Host "ExchangeRate: FAILED - $($_.Exception.Message)"
}
