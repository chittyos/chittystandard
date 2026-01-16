#!/bin/bash
set -euo pipefail
echo "=== chittystandard Onboarding ==="
curl -s -X POST "${GETCHITTY_ENDPOINT:-https://get.chitty.cc/api/onboard}" \
  -H "Content-Type: application/json" \
  -d '{"service_name":"chittystandard","organization":"CHITTYOS","type":"library","tier":2,"domains":["standard.chitty.cc"]}' | jq .
