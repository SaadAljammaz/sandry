#!/bin/bash

echo "Stopping dev server..."
kill -9 $(lsof -ti:3000) 2>/dev/null
pkill -9 -f "next dev" 2>/dev/null
sleep 1

echo "Regenerating Prisma client..."
npx prisma generate

echo "Starting dev server..."
npm run dev
