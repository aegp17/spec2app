#!/bin/bash

# Spec2App - Start Development Environment

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 STARTING SPEC2APP DEVELOPMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if API is running
echo "🔍 Checking API status..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ API is already running at http://localhost:3000"
else
    echo "❌ API is not running"
    echo "🐳 Starting API with Docker..."
    docker-compose up -d api
    echo "⏳ Waiting for API to be healthy..."
    sleep 5
    echo "✅ API started"
fi

echo ""

# Check if Web is running
echo "🔍 Checking Web status..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Web is already running at http://localhost:5173"
else
    echo "❌ Web is not running"
    echo "🌐 Starting Web dev server..."
    cd apps/web && pnpm dev > /dev/null 2>&1 &
    echo $! > /tmp/spec2app-web.pid
    cd ../..
    sleep 3
    echo "✅ Web started"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✨ SERVICES READY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 API:      http://localhost:3000"
echo ""
echo "📖 Quick Start:"
echo "   1. Open http://localhost:5173 in your browser"
echo "   2. Try an example or write your own specification"
echo "   3. Click 'Analyze Specification'"
echo "   4. See the generated Design Contract!"
echo ""
echo "🛑 To stop:"
echo "   docker-compose down"
echo "   kill \$(cat /tmp/spec2app-web.pid)"
echo ""
echo "🚀 Opening browser..."
open http://localhost:5173 2>/dev/null || echo "   Visit: http://localhost:5173"
echo ""

