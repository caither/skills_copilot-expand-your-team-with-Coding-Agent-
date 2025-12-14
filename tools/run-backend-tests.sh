#!/bin/bash
# Quick test runner script for backend tests

echo "==================================="
echo "Running Backend Tests with Pytest"
echo "==================================="
echo ""

# Run tests with coverage
python -m pytest tests/ -v --cov=backend --cov-report=term-missing --cov-report=html

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
    echo "📊 Coverage report generated in htmlcov/index.html"
else
    echo ""
    echo "❌ Some tests failed!"
    exit 1
fi
