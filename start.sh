#!/bin/bash
# Start script for RealReal Estate CRM

cd "$(dirname "$0")/apps/miniapp"

echo "🚀 Starting RealReal Estate CRM..."
echo ""
echo "Production server will start on http://localhost:3000"
echo "Press Ctrl+C to stop"
echo ""

PORT=3000 pnpm start
