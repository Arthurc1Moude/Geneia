#!/bin/bash
# Run Geneia program with GUI support

if [ $# -eq 0 ]; then
    echo "Usage: ./run_gui.sh <geneia_file.gn>"
    exit 1
fi

GENEIA_FILE=$1
UI_SCRIPT="_geneia_generated.ui"

echo "=== Running Geneia with GUI Support ==="
echo "File: $GENEIA_FILE"
echo ""

# Run the Geneia program
echo "Executing Geneia program..."
./compiler/geneia "$GENEIA_FILE"

# Check if UI script was generated
if [ -f "$UI_SCRIPT" ]; then
    echo ""
    echo "UI script generated! Launching GUI..."
    
    # Try different UI runtimes
    if [ -f "ui/bin/terminal/GeneiaUITerminal.dll" ]; then
        echo "Using Terminal UI (works everywhere)..."
        dotnet ui/bin/terminal/GeneiaUITerminal.dll "$UI_SCRIPT"
    elif [ -f "ui/bin/linux/GeneiaUILinux.dll" ]; then
        echo "Using GTK UI (Linux)..."
        dotnet ui/bin/linux/GeneiaUILinux.dll "$UI_SCRIPT"
    elif [ -f "ui/bin/generator/GeneiaUIGenerator.dll" ]; then
        echo "Using Windows Forms UI..."
        dotnet ui/bin/generator/GeneiaUIGenerator.dll "$UI_SCRIPT"
    else
        echo "No UI runtime found. Please build one:"
        echo "  cd ui && dotnet build GeneiaUITerminal.csproj -o bin/terminal/"
    fi
else
    echo "No UI components detected in program."
fi

echo ""
echo "=== Done ==="
