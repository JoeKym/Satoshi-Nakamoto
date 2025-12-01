#!/usr/bin/env bash
COINGECKO="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
EXRATE="https://api.exchangerate-api.com/v4/latest/USD"

echo "Testing CoinGecko..."
if curl -sSf "$COINGECKO" >/dev/null; then
  echo "CoinGecko: OK"
else
  echo "CoinGecko: FAILED"
fi

echo "Testing ExchangeRate API..."
if curl -sSf "$EXRATE" >/dev/null; then
  echo "ExchangeRate: OK"
else
  echo "ExchangeRate: FAILED"
fi
