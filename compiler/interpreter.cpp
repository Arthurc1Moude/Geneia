#include "interpreter.h"
#include "ui_bridge.h"
#include <iostream>
#include <fstream>
#include <cmath>
#include <cctype>
#include <cstdlib>
#include <sstream>
#include <map>
#include <algorithm>
#include <unistd.h>
#include <chrono>
#include <thread>
#include <ctime>

// Static variables for GeneiaUI script generation
static std::string geneiaUIScript = "";
static std::string geneiaUITitle = "Geneia Application";
static std::string geneiaUITheme = "default";
static std::string geneiaUIColor = "#3498db";
static int geneiaUIElementY = 20;
static int geneiaUIButtonCount = 0;
static int geneiaUILabelCount = 0;

// OpenGSL - Open Public Geneia Styling Library
static std::string openGSLScript = "";
static std::string openGSLTitle = "OpenGSL Canvas";
static int openGSLWidth = 800;
static int openGSLHeight = 600;
static std::string openGSLBackground = "#FFFFFF";
static std::string openGSLCurrentColor = "#3498db";
static int openGSLShapeCount = 0;

// OpenGSL Named Shapes storage
struct OpenGSLShape {
    std::string type;      // apple, cube, sphere, rect, circle, etc.
    std::string name;      // user-defined name
    int x, y, z;           // position
    int size;              // size
    int w, h, d;           // width, height, depth
    std::string color;     // color
};
static std::map<std::string, OpenGSLShape> openGSLShapes;
static std::string openGSLCurrentShapeName = "";

// G_Web.Kit - Web Module for generating websites (Geneia Web Kit)
static std::string webHTML = "";
static std::string webCSS = "";
static std::string webJS = "";
static std::string webTitle = "Geneia Website";
static std::string webBgColor = "#ffffff";
static std::string webTextColor = "#333333";
static std::string webAccentColor = "#3498db";
static std::string webFont = "Arial, sans-serif";
static int webElementCount = 0;

// G_Web.Kit Named Elements storage (like OpenGSL shapes)
struct WebElement {
    std::string type;      // nav, hero, sect, card, btn, etc.
    std::string name;      // user-defined name
    int x, y;              // position (for absolute positioning)
    int w, h;              // width, height
    std::string color;     // color
    std::string text;      // text content
    std::string link;      // link URL
};
static std::map<std::string, WebElement> webElements;
static std::string webCurrentElementName = "";

// OpenGWS - Open Public Geneia Web Server Services Kit
// Package manager (like npm) + Web server (like node)
// CLI: gwsl-get install <package>
// Server: .GWS.serve (port)
static std::vector<std::string> gwsInstalledPackages;
static std::string gwsRegistry = "https://gwsl.geneia.dev/packages";
static int gwsPort = 8080;
static std::vector<std::pair<std::string, std::string>> gwsRoutes;
static std::string gwsCurrentRoute = "/";

// OpenW2G - Open Public Web to Geneia Kit
// Converts HTML/Web to Geneia code
static std::string w2gInputHTML = "";
static std::string w2gOutputGeneia = "";

// G_Render - Universal Rendering Module
// Render same UI to web, desktop, terminal, or other platforms
struct RenderElement {
    std::string type;      // view, text, btn, img, nav, card, grid, list
    std::string id;        // element id
    std::string text;      // text content
    std::string style;     // style class
    int x, y, w, h;        // position and size
    std::string color;     // color
    std::string bg;        // background
    std::vector<std::string> children; // child element ids
};
static std::map<std::string, RenderElement> renderElements;
static std::string renderTarget = "web";  // web, desktop, term, json
static std::string renderTitle = "Geneia App";
static std::string renderTheme = "dark";
static std::string renderAccent = "#00d4ff";
static std::string renderBg = "#0a0a1a";
static std::string renderText = "#f0f0f0";
static std::string renderOutput = "";

// OpenGNEL - Open Geneia Element LanScript
// Command line scripting in Geneia syntax
static std::string gnelScript = "";
static std::string gnelWorkDir = ".";
static std::vector<std::string> gnelHistory;
static std::map<std::string, std::string> gnelAliases;
static std::map<std::string, std::string> gnelEnvVars;

void Interpreter::execute(std::shared_ptr<ASTNode> ast) {
    // Reset UI state
    geneiaUIScript = "";
    geneiaUITitle = "Geneia Application";
    geneiaUITheme = "default";
    geneiaUIColor = "#3498db";
    geneiaUIElementY = 20;
    geneiaUIButtonCount = 0;
    geneiaUILabelCount = 0;
    
    for (auto& child : ast->children) {
        if (shouldExit) break;
        executeNode(child);
    }
}

void Interpreter::executeNode(std::shared_ptr<ASTNode> node) {
    if (shouldExit) return;
    
    switch (node->type) {
        case AST_FUNCTION_CALL:
            executeFunctionCall(node);
            break;
        case AST_VAR_DECL:
            executeVarDecl(node);
            break;
        case AST_LOOP:
            executeLoop(node);
            break;
        case AST_EXIT:
            shouldExit = true;
            if (!node->value.empty()) {
                exitCode = std::stoi(node->value);
            }
            break;
        case AST_FUNC_DEF:
            executeFunctionDef(node);
            break;
        case AST_CONDITION:
            executeCondition(node);
            break;
        case AST_IMPORT:
            executeImport(node);
            break;
        case AST_EXPORT:
            executeExport(node);
            break;
        case AST_INT_CMD:
            executeIntCmd(node);
            break;
        default:
            break;
    }
}

Value Interpreter::evaluateExpression(std::shared_ptr<ASTNode> node) {
    switch (node->type) {
        case AST_NUMBER:
            if (node->value.find('.') != std::string::npos) {
                return std::stod(node->value);
            }
            try {
                return std::stoi(node->value);
            } catch (...) {
                return 0;
            }
        case AST_STRING:
            return node->value;
        case AST_IDENTIFIER:
            if (variables.find(node->value) != variables.end()) {
                return variables[node->value];
            }
            return std::string("undefined");
        default:
            return std::string("");
    }
}

void Interpreter::executeFunctionCall(std::shared_ptr<ASTNode> node) {
    if (node->value == "p" || node->value == "peat") {
        for (auto& arg : node->children) {
            Value val = evaluateExpression(arg);
            if (std::holds_alternative<int>(val)) {
                std::cout << std::get<int>(val);
            } else if (std::holds_alternative<double>(val)) {
                std::cout << std::get<double>(val);
            } else if (std::holds_alternative<std::string>(val)) {
                std::cout << std::get<std::string>(val);
            }
        }
        std::cout << std::endl;
    } else if (node->value == "tip") {
        // Running tips - displayed with special formatting
        std::cout << "[TIP] ";
        for (auto& arg : node->children) {
            Value val = evaluateExpression(arg);
            if (std::holds_alternative<std::string>(val)) {
                std::cout << std::get<std::string>(val);
            }
        }
        std::cout << std::endl;
    } else if (node->value == "str") {
        // str(U+XXXX) - Unicode string function - just output the character
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(val)) {
                std::string unicodeStr = std::get<std::string>(val);
                // Parse U+XXXX format
                if (unicodeStr.length() >= 2 && unicodeStr[0] == 'U' && unicodeStr[1] == '+') {
                    std::string hexPart = unicodeStr.substr(2);
                    try {
                        unsigned int codePoint = std::stoul(hexPart, nullptr, 16);
                        // Convert code point to UTF-8 character
                        std::string utf8Char;
                        if (codePoint < 0x80) {
                            utf8Char = static_cast<char>(codePoint);
                        } else if (codePoint < 0x800) {
                            utf8Char = static_cast<char>(0xC0 | (codePoint >> 6));
                            utf8Char += static_cast<char>(0x80 | (codePoint & 0x3F));
                        } else if (codePoint < 0x10000) {
                            utf8Char = static_cast<char>(0xE0 | (codePoint >> 12));
                            utf8Char += static_cast<char>(0x80 | ((codePoint >> 6) & 0x3F));
                            utf8Char += static_cast<char>(0x80 | (codePoint & 0x3F));
                        } else {
                            utf8Char = static_cast<char>(0xF0 | (codePoint >> 18));
                            utf8Char += static_cast<char>(0x80 | ((codePoint >> 12) & 0x3F));
                            utf8Char += static_cast<char>(0x80 | ((codePoint >> 6) & 0x3F));
                            utf8Char += static_cast<char>(0x80 | (codePoint & 0x3F));
                        }
                        std::cout << utf8Char << std::endl;
                    } catch (...) {
                        std::cout << "?" << std::endl;
                    }
                }
            }
        }
    } else if (node->value == "strRepeat") {
        if (node->children.size() >= 2) {
            Value str = evaluateExpression(node->children[0]);
            Value count = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(str) && std::holds_alternative<int>(count)) {
                std::string result = strRepeat(std::get<std::string>(str), std::get<int>(count));
                std::cout << result << std::endl;
            }
        }
    }
    // UI Functions - .Module.function syntax (with leading dot)
    else if (node->value == ".UI.window" || node->value == ".ui.window" || 
             node->value == "UI.window" || node->value == "ui.window") {
        if (!node->children.empty()) {
            Value title = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(title)) {
                std::cout << "[UI] Created window: " << std::get<std::string>(title) << std::endl;
            }
        } else {
            std::cout << "[UI] Created window" << std::endl;
        }
    } else if (node->value == ".UI.button" || node->value == ".ui.button" ||
               node->value == "UI.button" || node->value == "ui.button") {
        if (!node->children.empty()) {
            Value text = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(text)) {
                std::cout << "[UI] Created button: " << std::get<std::string>(text) << std::endl;
            }
        }
    } else if (node->value == ".UI.label" || node->value == ".ui.label" ||
               node->value == "UI.label" || node->value == "ui.label") {
        if (!node->children.empty()) {
            Value text = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(text)) {
                std::cout << "[UI] Created label: " << std::get<std::string>(text) << std::endl;
            }
        }
    } else if (node->value == ".UI.textbox" || node->value == ".ui.textbox" ||
               node->value == "UI.textbox" || node->value == "ui.textbox") {
        std::cout << "[UI] Created textbox" << std::endl;
    } else if (node->value == ".UI.show" || node->value == ".ui.show" ||
               node->value == "UI.show" || node->value == "ui.show") {
        std::cout << "[UI] Window shown" << std::endl;
    } else if (node->value == ".UI.message" || node->value == ".ui.message" ||
               node->value == "UI.message" || node->value == "ui.message") {
        if (!node->children.empty()) {
            Value msg = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(msg)) {
                std::cout << "[UI] Message: " << std::get<std::string>(msg) << std::endl;
            }
        }
    }
    // GeneiaUI Module - Full GUI with window, customized UI (generates real UI)
    else if (node->value == ".GeneiaUI.window" || node->value == ".geneiaui.window") {
        if (!node->children.empty()) {
            Value title = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(title)) {
                geneiaUITitle = std::get<std::string>(title);
                geneiaUIScript += "WINDOW|" + geneiaUITitle + "|800|600\n";
                std::cout << "[GeneiaUI] Window created: " << geneiaUITitle << std::endl;
            }
        } else {
            geneiaUIScript += "WINDOW|Geneia Application|800|600\n";
            std::cout << "[GeneiaUI] Window created" << std::endl;
        }
    } else if (node->value == ".GeneiaUI.panel" || node->value == ".geneiaui.panel") {
        geneiaUIScript += "PANEL|panel1|20|" + std::to_string(geneiaUIElementY) + "|760|100|LightGray\n";
        geneiaUIElementY += 110;
        std::cout << "[GeneiaUI] Panel created" << std::endl;
    } else if (node->value == ".GeneiaUI.button" || node->value == ".geneiaui.button") {
        if (!node->children.empty()) {
            Value text = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(text)) {
                std::string btnText = std::get<std::string>(text);
                std::string btnName = "btn" + std::to_string(++geneiaUIButtonCount);
                int btnX = 20 + ((geneiaUIButtonCount - 1) % 4) * 190;
                geneiaUIScript += "BUTTON|" + btnName + "|" + btnText + "|" + std::to_string(btnX) + "|" + std::to_string(geneiaUIElementY) + "|180|40\n";
                if (geneiaUIButtonCount % 4 == 0) geneiaUIElementY += 50;
                std::cout << "[GeneiaUI] Button: " << btnText << std::endl;
            }
        }
    } else if (node->value == ".GeneiaUI.label" || node->value == ".geneiaui.label") {
        if (!node->children.empty()) {
            Value text = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(text)) {
                std::string lblText = std::get<std::string>(text);
                std::string lblName = "lbl" + std::to_string(++geneiaUILabelCount);
                geneiaUIScript += "LABEL|" + lblName + "|" + lblText + "|20|" + std::to_string(geneiaUIElementY) + "|400|30\n";
                geneiaUIElementY += 35;
                std::cout << "[GeneiaUI] Label: " << lblText << std::endl;
            }
        }
    } else if (node->value == ".GeneiaUI.input" || node->value == ".geneiaui.input") {
        geneiaUIScript += "TEXTBOX|input1|20|" + std::to_string(geneiaUIElementY) + "|300|25\n";
        geneiaUIElementY += 35;
        std::cout << "[GeneiaUI] Input field created" << std::endl;
    } else if (node->value == ".GeneiaUI.text" || node->value == ".geneiaui.text") {
        geneiaUIScript += "TEXTAREA|text1|20|" + std::to_string(geneiaUIElementY) + "|400|100\n";
        geneiaUIElementY += 110;
        std::cout << "[GeneiaUI] Text area created" << std::endl;
    } else if (node->value == ".GeneiaUI.list" || node->value == ".geneiaui.list") {
        geneiaUIScript += "LISTBOX|list1|20|" + std::to_string(geneiaUIElementY) + "|300|120\n";
        geneiaUIElementY += 130;
        std::cout << "[GeneiaUI] List created" << std::endl;
    } else if (node->value == ".GeneiaUI.menu" || node->value == ".geneiaui.menu") {
        if (!node->children.empty()) {
            Value name = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(name)) {
                geneiaUIScript += "MENU|" + std::get<std::string>(name) + "\n";
                std::cout << "[GeneiaUI] Menu: " << std::get<std::string>(name) << std::endl;
            }
        }
    } else if (node->value == ".GeneiaUI.toolbar" || node->value == ".geneiaui.toolbar") {
        geneiaUIScript += "TOOLBAR|toolbar1\n";
        std::cout << "[GeneiaUI] Toolbar created" << std::endl;
    } else if (node->value == ".GeneiaUI.status" || node->value == ".geneiaui.status") {
        if (!node->children.empty()) {
            Value text = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(text)) {
                geneiaUIScript += "STATUSBAR|" + std::get<std::string>(text) + "\n";
                std::cout << "[GeneiaUI] Status: " << std::get<std::string>(text) << std::endl;
            }
        }
    } else if (node->value == ".GeneiaUI.dialog" || node->value == ".geneiaui.dialog") {
        if (!node->children.empty()) {
            Value msg = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(msg)) {
                geneiaUIScript += "DIALOG|" + std::get<std::string>(msg) + "\n";
                std::cout << "[GeneiaUI] Dialog: " << std::get<std::string>(msg) << std::endl;
            }
        }
    } else if (node->value == ".GeneiaUI.style" || node->value == ".geneiaui.style") {
        geneiaUIScript += "STYLE|custom\n";
        std::cout << "[GeneiaUI] Style applied" << std::endl;
    } else if (node->value == ".GeneiaUI.theme" || node->value == ".geneiaui.theme") {
        if (!node->children.empty()) {
            Value theme = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(theme)) {
                geneiaUITheme = std::get<std::string>(theme);
                geneiaUIScript += "THEME|" + geneiaUITheme + "\n";
                std::cout << "[GeneiaUI] Theme: " << geneiaUITheme << std::endl;
            }
        }
    } else if (node->value == ".GeneiaUI.color" || node->value == ".geneiaui.color") {
        if (!node->children.empty()) {
            Value color = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(color)) {
                geneiaUIColor = std::get<std::string>(color);
                geneiaUIScript += "COLOR|" + geneiaUIColor + "\n";
                std::cout << "[GeneiaUI] Color: " << geneiaUIColor << std::endl;
            }
        }
    } else if (node->value == ".GeneiaUI.font" || node->value == ".geneiaui.font") {
        if (!node->children.empty()) {
            Value font = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(font)) {
                geneiaUIScript += "FONT|" + std::get<std::string>(font) + "\n";
                std::cout << "[GeneiaUI] Font: " << std::get<std::string>(font) << std::endl;
            }
        }
    } else if (node->value == ".GeneiaUI.size" || node->value == ".geneiaui.size") {
        geneiaUIScript += "SIZE|800|600\n";
        std::cout << "[GeneiaUI] Size set" << std::endl;
    } else if (node->value == ".GeneiaUI.pos" || node->value == ".geneiaui.pos") {
        geneiaUIScript += "POSITION|100|100\n";
        std::cout << "[GeneiaUI] Position set" << std::endl;
    } else if (node->value == ".GeneiaUI.show" || node->value == ".geneiaui.show") {
        geneiaUIScript += "SHOW\n";
        std::cout << "[GeneiaUI] Window shown" << std::endl;
    } else if (node->value == ".GeneiaUI.hide" || node->value == ".geneiaui.hide") {
        geneiaUIScript += "HIDE\n";
        std::cout << "[GeneiaUI] Window hidden" << std::endl;
    } else if (node->value == ".GeneiaUI.close" || node->value == ".geneiaui.close") {
        geneiaUIScript += "CLOSE\n";
        std::cout << "[GeneiaUI] Window closed" << std::endl;
    } else if (node->value == ".GeneiaUI.run" || node->value == ".geneiaui.run") {
        // Write UI script to file
        std::ofstream uiFile("_geneia_generated.ui");
        uiFile << "// Generated by Geneia GeneiaUI Module\n";
        uiFile << "// Theme: " << geneiaUITheme << "\n";
        uiFile << "// Color: " << geneiaUIColor << "\n\n";
        uiFile << geneiaUIScript;
        uiFile.close();
        
        std::cout << "[GeneiaUI] UI script saved to _geneia_generated.ui" << std::endl;
        std::cout << "[GeneiaUI] Launching GUI..." << std::endl;
        
        // Try to launch the GUI - prefer real GTK window
        bool launched = false;
        
        if (system("which dotnet > /dev/null 2>&1") == 0) {
            // Try GTK UI first (real window with colors)
            if (system("test -f ui/bin/linux/GeneiaUILinux.dll") == 0) {
                std::cout << "[GeneiaUI] Opening real window..." << std::endl;
                system("dotnet ui/bin/linux/GeneiaUILinux.dll _geneia_generated.ui");
                launched = true;
            }
            // Fallback to Terminal UI
            else if (system("test -f ui/bin/terminal/GeneiaUITerminal.dll") == 0) {
                std::cout << "[GeneiaUI] Using Terminal UI..." << std::endl;
                system("dotnet ui/bin/terminal/GeneiaUITerminal.dll _geneia_generated.ui");
                launched = true;
            }
        }
        
        if (!launched) {
            // Fallback: show the generated script
            std::cout << "\n=== Generated UI Script ===\n" << geneiaUIScript << "==========================\n" << std::endl;
            std::cout << "[GeneiaUI] No UI runtime found. Build with:\n";
            std::cout << "  cd ui && dotnet build GeneiaUILinux.csproj -o bin/linux/\n" << std::endl;
        }
    }
    // ============================================================
    // OpenGSL - Open Public Geneia Styling Library
    // New syntax: .OpenGSL.shape.3d (x) (y) (z) & shape.n = name
    //             .OpenGSL.shape.apple -u (settings)
    // ============================================================
    else if (node->value == ".OpenGSL.canvas" || node->value == ".opengsl.canvas") {
        if (!node->children.empty()) {
            Value title = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(title)) {
                openGSLTitle = std::get<std::string>(title);
            }
        }
        if (node->children.size() >= 3) {
            Value w = evaluateExpression(node->children[1]);
            Value h = evaluateExpression(node->children[2]);
            if (std::holds_alternative<int>(w)) openGSLWidth = std::get<int>(w);
            if (std::holds_alternative<int>(h)) openGSLHeight = std::get<int>(h);
        }
        openGSLScript = "CANVAS|" + openGSLTitle + "|" + std::to_string(openGSLWidth) + "|" + std::to_string(openGSLHeight) + "\n";
        std::cout << "[OpenGSL] Canvas: " << openGSLTitle << " (" << openGSLWidth << "x" << openGSLHeight << ")" << std::endl;
    }
    else if (node->value == ".OpenGSL.bg" || node->value == ".opengsl.bg") {
        if (!node->children.empty()) {
            Value color = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(color)) {
                openGSLBackground = std::get<std::string>(color);
                openGSLScript += "BACKGROUND|" + openGSLBackground + "\n";
                std::cout << "[OpenGSL] Background: " << openGSLBackground << std::endl;
            }
        }
    }
    else if (node->value == ".OpenGSL.color" || node->value == ".opengsl.color") {
        if (!node->children.empty()) {
            Value color = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(color)) {
                openGSLCurrentColor = std::get<std::string>(color);
                std::cout << "[OpenGSL] Color: " << openGSLCurrentColor << std::endl;
            }
        }
    }
    // 2D Shapes
    else if (node->value == ".OpenGSL.rect" || node->value == ".opengsl.rect") {
        int x = 0, y = 0, w = 100, h = 100;
        if (node->children.size() >= 4) {
            Value vx = evaluateExpression(node->children[0]);
            Value vy = evaluateExpression(node->children[1]);
            Value vw = evaluateExpression(node->children[2]);
            Value vh = evaluateExpression(node->children[3]);
            if (std::holds_alternative<int>(vx)) x = std::get<int>(vx);
            if (std::holds_alternative<int>(vy)) y = std::get<int>(vy);
            if (std::holds_alternative<int>(vw)) w = std::get<int>(vw);
            if (std::holds_alternative<int>(vh)) h = std::get<int>(vh);
        }
        openGSLScript += "RECT|shape" + std::to_string(++openGSLShapeCount) + "|" + 
                         std::to_string(x) + "|" + std::to_string(y) + "|" +
                         std::to_string(w) + "|" + std::to_string(h) + "|" + openGSLCurrentColor + "\n";
        std::cout << "[OpenGSL] Rect: " << x << "," << y << " " << w << "x" << h << std::endl;
    }
    else if (node->value == ".OpenGSL.circle" || node->value == ".opengsl.circle") {
        int x = 0, y = 0, r = 50;
        if (node->children.size() >= 3) {
            Value vx = evaluateExpression(node->children[0]);
            Value vy = evaluateExpression(node->children[1]);
            Value vr = evaluateExpression(node->children[2]);
            if (std::holds_alternative<int>(vx)) x = std::get<int>(vx);
            if (std::holds_alternative<int>(vy)) y = std::get<int>(vy);
            if (std::holds_alternative<int>(vr)) r = std::get<int>(vr);
        }
        openGSLScript += "CIRCLE|shape" + std::to_string(++openGSLShapeCount) + "|" + 
                         std::to_string(x) + "|" + std::to_string(y) + "|" +
                         std::to_string(r) + "|" + openGSLCurrentColor + "\n";
        std::cout << "[OpenGSL] Circle: " << x << "," << y << " r=" << r << std::endl;
    }
    else if (node->value == ".OpenGSL.line" || node->value == ".opengsl.line") {
        int x1 = 0, y1 = 0, x2 = 100, y2 = 100;
        if (node->children.size() >= 4) {
            Value vx1 = evaluateExpression(node->children[0]);
            Value vy1 = evaluateExpression(node->children[1]);
            Value vx2 = evaluateExpression(node->children[2]);
            Value vy2 = evaluateExpression(node->children[3]);
            if (std::holds_alternative<int>(vx1)) x1 = std::get<int>(vx1);
            if (std::holds_alternative<int>(vy1)) y1 = std::get<int>(vy1);
            if (std::holds_alternative<int>(vx2)) x2 = std::get<int>(vx2);
            if (std::holds_alternative<int>(vy2)) y2 = std::get<int>(vy2);
        }
        openGSLScript += "LINE|shape" + std::to_string(++openGSLShapeCount) + "|" + 
                         std::to_string(x1) + "|" + std::to_string(y1) + "|" +
                         std::to_string(x2) + "|" + std::to_string(y2) + "|" + openGSLCurrentColor + "\n";
        std::cout << "[OpenGSL] Line: " << x1 << "," << y1 << " to " << x2 << "," << y2 << std::endl;
    }
    else if (node->value == ".OpenGSL.ellipse" || node->value == ".opengsl.ellipse") {
        int x = 0, y = 0, rx = 50, ry = 30;
        if (node->children.size() >= 4) {
            Value vx = evaluateExpression(node->children[0]);
            Value vy = evaluateExpression(node->children[1]);
            Value vrx = evaluateExpression(node->children[2]);
            Value vry = evaluateExpression(node->children[3]);
            if (std::holds_alternative<int>(vx)) x = std::get<int>(vx);
            if (std::holds_alternative<int>(vy)) y = std::get<int>(vy);
            if (std::holds_alternative<int>(vrx)) rx = std::get<int>(vrx);
            if (std::holds_alternative<int>(vry)) ry = std::get<int>(vry);
        }
        openGSLScript += "ELLIPSE|shape" + std::to_string(++openGSLShapeCount) + "|" + 
                         std::to_string(x) + "|" + std::to_string(y) + "|" +
                         std::to_string(rx) + "|" + std::to_string(ry) + "|" + openGSLCurrentColor + "\n";
        std::cout << "[OpenGSL] Ellipse: " << x << "," << y << " rx=" << rx << " ry=" << ry << std::endl;
    }
    else if (node->value == ".OpenGSL.text" || node->value == ".opengsl.text") {
        int x = 0, y = 0;
        std::string text = "Text";
        if (node->children.size() >= 3) {
            Value vx = evaluateExpression(node->children[0]);
            Value vy = evaluateExpression(node->children[1]);
            Value vt = evaluateExpression(node->children[2]);
            if (std::holds_alternative<int>(vx)) x = std::get<int>(vx);
            if (std::holds_alternative<int>(vy)) y = std::get<int>(vy);
            if (std::holds_alternative<std::string>(vt)) text = std::get<std::string>(vt);
        }
        openGSLScript += "TEXT|shape" + std::to_string(++openGSLShapeCount) + "|" + 
                         std::to_string(x) + "|" + std::to_string(y) + "|" + text + "|" + openGSLCurrentColor + "\n";
        std::cout << "[OpenGSL] Text: " << text << " at " << x << "," << y << std::endl;
    }
    // 2.5D Shapes
    else if (node->value == ".OpenGSL.iso" || node->value == ".opengsl.iso") {
        int x = 0, y = 0, w = 100, h = 100, d = 50;
        if (node->children.size() >= 5) {
            Value vx = evaluateExpression(node->children[0]);
            Value vy = evaluateExpression(node->children[1]);
            Value vw = evaluateExpression(node->children[2]);
            Value vh = evaluateExpression(node->children[3]);
            Value vd = evaluateExpression(node->children[4]);
            if (std::holds_alternative<int>(vx)) x = std::get<int>(vx);
            if (std::holds_alternative<int>(vy)) y = std::get<int>(vy);
            if (std::holds_alternative<int>(vw)) w = std::get<int>(vw);
            if (std::holds_alternative<int>(vh)) h = std::get<int>(vh);
            if (std::holds_alternative<int>(vd)) d = std::get<int>(vd);
        }
        openGSLScript += "ISO|shape" + std::to_string(++openGSLShapeCount) + "|" + 
                         std::to_string(x) + "|" + std::to_string(y) + "|" +
                         std::to_string(w) + "|" + std::to_string(h) + "|" +
                         std::to_string(d) + "|" + openGSLCurrentColor + "\n";
        std::cout << "[OpenGSL] Isometric: " << x << "," << y << " " << w << "x" << h << "x" << d << std::endl;
    }
    // 3D Shapes
    else if (node->value == ".OpenGSL.cube" || node->value == ".opengsl.cube") {
        int x = 0, y = 0, z = 0, size = 100;
        if (node->children.size() >= 4) {
            Value vx = evaluateExpression(node->children[0]);
            Value vy = evaluateExpression(node->children[1]);
            Value vz = evaluateExpression(node->children[2]);
            Value vs = evaluateExpression(node->children[3]);
            if (std::holds_alternative<int>(vx)) x = std::get<int>(vx);
            if (std::holds_alternative<int>(vy)) y = std::get<int>(vy);
            if (std::holds_alternative<int>(vz)) z = std::get<int>(vz);
            if (std::holds_alternative<int>(vs)) size = std::get<int>(vs);
        }
        openGSLScript += "CUBE|shape" + std::to_string(++openGSLShapeCount) + "|" + 
                         std::to_string(x) + "|" + std::to_string(y) + "|" +
                         std::to_string(z) + "|" + std::to_string(size) + "|" + openGSLCurrentColor + "\n";
        std::cout << "[OpenGSL] Cube: " << x << "," << y << "," << z << " size=" << size << std::endl;
    }
    else if (node->value == ".OpenGSL.sphere" || node->value == ".opengsl.sphere") {
        int x = 0, y = 0, z = 0, r = 50;
        if (node->children.size() >= 4) {
            Value vx = evaluateExpression(node->children[0]);
            Value vy = evaluateExpression(node->children[1]);
            Value vz = evaluateExpression(node->children[2]);
            Value vr = evaluateExpression(node->children[3]);
            if (std::holds_alternative<int>(vx)) x = std::get<int>(vx);
            if (std::holds_alternative<int>(vy)) y = std::get<int>(vy);
            if (std::holds_alternative<int>(vz)) z = std::get<int>(vz);
            if (std::holds_alternative<int>(vr)) r = std::get<int>(vr);
        }
        openGSLScript += "SPHERE|shape" + std::to_string(++openGSLShapeCount) + "|" + 
                         std::to_string(x) + "|" + std::to_string(y) + "|" +
                         std::to_string(z) + "|" + std::to_string(r) + "|" + openGSLCurrentColor + "\n";
        std::cout << "[OpenGSL] Sphere: " << x << "," << y << "," << z << " r=" << r << std::endl;
    }
    else if (node->value == ".OpenGSL.pyramid" || node->value == ".opengsl.pyramid") {
        int x = 0, y = 0, z = 0, base = 100, h = 150;
        if (node->children.size() >= 5) {
            Value vx = evaluateExpression(node->children[0]);
            Value vy = evaluateExpression(node->children[1]);
            Value vz = evaluateExpression(node->children[2]);
            Value vb = evaluateExpression(node->children[3]);
            Value vh = evaluateExpression(node->children[4]);
            if (std::holds_alternative<int>(vx)) x = std::get<int>(vx);
            if (std::holds_alternative<int>(vy)) y = std::get<int>(vy);
            if (std::holds_alternative<int>(vz)) z = std::get<int>(vz);
            if (std::holds_alternative<int>(vb)) base = std::get<int>(vb);
            if (std::holds_alternative<int>(vh)) h = std::get<int>(vh);
        }
        openGSLScript += "PYRAMID|shape" + std::to_string(++openGSLShapeCount) + "|" + 
                         std::to_string(x) + "|" + std::to_string(y) + "|" +
                         std::to_string(z) + "|" + std::to_string(base) + "|" +
                         std::to_string(h) + "|" + openGSLCurrentColor + "\n";
        std::cout << "[OpenGSL] Pyramid: " << x << "," << y << "," << z << " base=" << base << " h=" << h << std::endl;
    }
    else if (node->value == ".OpenGSL.cylinder" || node->value == ".opengsl.cylinder") {
        int x = 0, y = 0, z = 0, r = 50, h = 100;
        if (node->children.size() >= 5) {
            Value vx = evaluateExpression(node->children[0]);
            Value vy = evaluateExpression(node->children[1]);
            Value vz = evaluateExpression(node->children[2]);
            Value vr = evaluateExpression(node->children[3]);
            Value vh = evaluateExpression(node->children[4]);
            if (std::holds_alternative<int>(vx)) x = std::get<int>(vx);
            if (std::holds_alternative<int>(vy)) y = std::get<int>(vy);
            if (std::holds_alternative<int>(vz)) z = std::get<int>(vz);
            if (std::holds_alternative<int>(vr)) r = std::get<int>(vr);
            if (std::holds_alternative<int>(vh)) h = std::get<int>(vh);
        }
        openGSLScript += "CYLINDER|shape" + std::to_string(++openGSLShapeCount) + "|" + 
                         std::to_string(x) + "|" + std::to_string(y) + "|" +
                         std::to_string(z) + "|" + std::to_string(r) + "|" +
                         std::to_string(h) + "|" + openGSLCurrentColor + "\n";
        std::cout << "[OpenGSL] Cylinder: " << x << "," << y << "," << z << " r=" << r << " h=" << h << std::endl;
    }
    // ============================================================
    // NEW SYNTAX: .OpenGSL.shape.3d (x) (y) (z) & shape.n = myApple
    //             .OpenGSL.shape.myApple -u (size) (color)
    // The shape name becomes part of the path!
    // ============================================================
    else if (node->value == ".OpenGSL.shape.3d" || node->value == ".opengsl.shape.3d" ||
             node->value == ".OpenGSL.shape.d3" || node->value == ".opengsl.shape.d3") {
        int x = 0, y = 0, z = 0;
        std::string shapeName = "shape" + std::to_string(++openGSLShapeCount);
        
        if (node->children.size() >= 3) {
            Value vx = evaluateExpression(node->children[0]);
            Value vy = evaluateExpression(node->children[1]);
            Value vz = evaluateExpression(node->children[2]);
            if (std::holds_alternative<int>(vx)) x = std::get<int>(vx);
            if (std::holds_alternative<int>(vy)) y = std::get<int>(vy);
            if (std::holds_alternative<int>(vz)) z = std::get<int>(vz);
        }
        
        // Check for & shape.n = name (name is identifier, not string)
        for (size_t i = 3; i < node->children.size(); i++) {
            if (node->children[i]->type == AST_IDENTIFIER && node->children[i]->value == "shape.n") {
                if (i + 1 < node->children.size()) {
                    // Name can be identifier or string
                    if (node->children[i + 1]->type == AST_IDENTIFIER) {
                        shapeName = node->children[i + 1]->value;
                    } else {
                        Value nameVal = evaluateExpression(node->children[i + 1]);
                        if (std::holds_alternative<std::string>(nameVal)) {
                            shapeName = std::get<std::string>(nameVal);
                        }
                    }
                }
            }
        }
        
        // Store shape
        OpenGSLShape shape;
        shape.name = shapeName;
        shape.x = x; shape.y = y; shape.z = z;
        shape.size = 80;
        shape.color = openGSLCurrentColor;
        shape.type = "3d";
        openGSLShapes[shapeName] = shape;
        openGSLCurrentShapeName = shapeName;
        
        std::cout << "[OpenGSL] Shape.3d: " << shapeName << " at " << x << "," << y << "," << z << std::endl;
    }
    // .OpenGSL.shape.2d (x) (y) & shape.n = name
    else if (node->value == ".OpenGSL.shape.2d" || node->value == ".opengsl.shape.2d" ||
             node->value == ".OpenGSL.shape.d2" || node->value == ".opengsl.shape.d2") {
        int x = 0, y = 0;
        std::string shapeName = "shape" + std::to_string(++openGSLShapeCount);
        
        if (node->children.size() >= 2) {
            Value vx = evaluateExpression(node->children[0]);
            Value vy = evaluateExpression(node->children[1]);
            if (std::holds_alternative<int>(vx)) x = std::get<int>(vx);
            if (std::holds_alternative<int>(vy)) y = std::get<int>(vy);
        }
        
        // Check for & shape.n = name
        for (size_t i = 2; i < node->children.size(); i++) {
            if (node->children[i]->type == AST_IDENTIFIER && node->children[i]->value == "shape.n") {
                if (i + 1 < node->children.size()) {
                    if (node->children[i + 1]->type == AST_IDENTIFIER) {
                        shapeName = node->children[i + 1]->value;
                    } else {
                        Value nameVal = evaluateExpression(node->children[i + 1]);
                        if (std::holds_alternative<std::string>(nameVal)) {
                            shapeName = std::get<std::string>(nameVal);
                        }
                    }
                }
            }
        }
        
        OpenGSLShape shape;
        shape.name = shapeName;
        shape.x = x; shape.y = y; shape.z = 0;
        shape.size = 80;
        shape.color = openGSLCurrentColor;
        shape.type = "2d";
        openGSLShapes[shapeName] = shape;
        openGSLCurrentShapeName = shapeName;
        
        std::cout << "[OpenGSL] Shape.2d: " << shapeName << " at " << x << "," << y << std::endl;
    }
    // Dynamic shape usage: .OpenGSL.shape.{shapeName} -u (size) (color)
    // This handles .OpenGSL.shape.myApple, .OpenGSL.shape.myCube, etc.
    else if (node->value.substr(0, 16) == ".OpenGSL.shape." || node->value.substr(0, 16) == ".opengsl.shape.") {
        std::string shapeName = node->value.substr(16); // Get the shape name from path
        int size = 80;
        std::string color = openGSLCurrentColor;
        std::string shapeType = "apple"; // default type
        bool useFlag = false;
        
        // Parse arguments: -u (size) (color) or --use (size) (color)
        for (size_t i = 0; i < node->children.size(); i++) {
            Value val = evaluateExpression(node->children[i]);
            if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                if (s == "-u" || s == "--use") {
                    useFlag = true;
                } else if (s[0] == '#') {
                    color = s;
                } else if (s == "apple" || s == "cube" || s == "sphere" || s == "rect" || s == "circle" || s == "pyramid" || s == "cylinder") {
                    shapeType = s;
                }
            } else if (std::holds_alternative<int>(val)) {
                size = std::get<int>(val);
            }
        }
        
        // Check if shape exists
        if (openGSLShapes.find(shapeName) != openGSLShapes.end()) {
            auto& sh = openGSLShapes[shapeName];
            sh.size = size;
            sh.color = color;
            
            // Auto-detect shape type from name if not explicitly set
            std::string detectedType = "circle"; // default for custom shapes
            std::string lowerName = shapeName;
            for (auto& c : lowerName) c = tolower(c);
            
            if (lowerName.find("apple") != std::string::npos) detectedType = "apple";
            else if (lowerName.find("pizza") != std::string::npos) detectedType = "pizza";
            else if (lowerName.find("cube") != std::string::npos) detectedType = "cube";
            else if (lowerName.find("sphere") != std::string::npos) detectedType = "sphere";
            else if (lowerName.find("rect") != std::string::npos) detectedType = "rect";
            else if (lowerName.find("circle") != std::string::npos) detectedType = "circle";
            
            sh.type = detectedType;
            
            // Generate script based on type
            std::string typeUpper = detectedType;
            for (auto& c : typeUpper) c = toupper(c);
            
            if (detectedType == "apple" || detectedType == "pizza" || detectedType == "sphere" || detectedType == "cube") {
                openGSLScript += typeUpper + "|" + shapeName + "|" + 
                                 std::to_string(sh.x) + "|" + std::to_string(sh.y) + "|" +
                                 std::to_string(sh.z) + "|" + std::to_string(sh.size) + "|" + sh.color + "\n";
            } else if (detectedType == "rect") {
                openGSLScript += "RECT|" + shapeName + "|" + 
                                 std::to_string(sh.x) + "|" + std::to_string(sh.y) + "|" +
                                 std::to_string(sh.size) + "|" + std::to_string(sh.size) + "|" + sh.color + "\n";
            } else if (detectedType == "circle") {
                openGSLScript += "CIRCLE|" + shapeName + "|" + 
                                 std::to_string(sh.x) + "|" + std::to_string(sh.y) + "|" +
                                 std::to_string(sh.size) + "|" + sh.color + "\n";
            }
            
            std::cout << "[OpenGSL] Shape." << shapeName << " -u " << detectedType << " size=" << size << " color=" << color << std::endl;
        } else {
            std::cout << "[OpenGSL] Error: Shape '" << shapeName << "' not defined. Use .OpenGSL.shape.3d first" << std::endl;
        }
    }
    // Legacy: .OpenGSL.shape.apple (size) - for current shape
    else if (node->value == ".OpenGSL.shape.apple" || node->value == ".opengsl.shape.apple") {
        std::string shapeName = openGSLCurrentShapeName;
        int size = 80;
        std::string color = openGSLCurrentColor;
        bool useFlag = false;
        
        // Parse arguments
        for (size_t i = 0; i < node->children.size(); i++) {
            Value val = evaluateExpression(node->children[i]);
            if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                if (s == "-u" || s == "--use") {
                    useFlag = true;
                } else if (s[0] == '#') {
                    color = s;
                }
            } else if (std::holds_alternative<int>(val)) {
                size = std::get<int>(val);
            }
        }
        
        // Update or use existing shape
        if (openGSLShapes.find(shapeName) != openGSLShapes.end()) {
            openGSLShapes[shapeName].type = "apple";
            openGSLShapes[shapeName].size = size;
            openGSLShapes[shapeName].color = color;
            
            // Add to script
            auto& sh = openGSLShapes[shapeName];
            openGSLScript += "APPLE|" + shapeName + "|" + 
                             std::to_string(sh.x) + "|" + std::to_string(sh.y) + "|" +
                             std::to_string(sh.z) + "|" + std::to_string(sh.size) + "|" + sh.color + "\n";
            std::cout << "[OpenGSL] Shape.apple: " << shapeName << " size=" << size << " color=" << color << std::endl;
        } else {
            std::cout << "[OpenGSL] Error: No shape defined. Use .OpenGSL.shape.d3 first" << std::endl;
        }
    }
    // .OpenGSL.shape.cube -u (size)
    else if (node->value == ".OpenGSL.shape.cube" || node->value == ".opengsl.shape.cube") {
        std::string shapeName = openGSLCurrentShapeName;
        int size = 80;
        std::string color = openGSLCurrentColor;
        
        for (size_t i = 0; i < node->children.size(); i++) {
            Value val = evaluateExpression(node->children[i]);
            if (std::holds_alternative<int>(val)) {
                size = std::get<int>(val);
            } else if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                if (s[0] == '#') color = s;
            }
        }
        
        if (openGSLShapes.find(shapeName) != openGSLShapes.end()) {
            openGSLShapes[shapeName].type = "cube";
            openGSLShapes[shapeName].size = size;
            openGSLShapes[shapeName].color = color;
            
            auto& sh = openGSLShapes[shapeName];
            openGSLScript += "CUBE|" + shapeName + "|" + 
                             std::to_string(sh.x) + "|" + std::to_string(sh.y) + "|" +
                             std::to_string(sh.z) + "|" + std::to_string(sh.size) + "|" + sh.color + "\n";
            std::cout << "[OpenGSL] Shape.cube: " << shapeName << " size=" << size << std::endl;
        }
    }
    // .OpenGSL.shape.sphere -u (radius)
    else if (node->value == ".OpenGSL.shape.sphere" || node->value == ".opengsl.shape.sphere") {
        std::string shapeName = openGSLCurrentShapeName;
        int radius = 50;
        std::string color = openGSLCurrentColor;
        
        for (size_t i = 0; i < node->children.size(); i++) {
            Value val = evaluateExpression(node->children[i]);
            if (std::holds_alternative<int>(val)) {
                radius = std::get<int>(val);
            } else if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                if (s[0] == '#') color = s;
            }
        }
        
        if (openGSLShapes.find(shapeName) != openGSLShapes.end()) {
            openGSLShapes[shapeName].type = "sphere";
            openGSLShapes[shapeName].size = radius;
            openGSLShapes[shapeName].color = color;
            
            auto& sh = openGSLShapes[shapeName];
            openGSLScript += "SPHERE|" + shapeName + "|" + 
                             std::to_string(sh.x) + "|" + std::to_string(sh.y) + "|" +
                             std::to_string(sh.z) + "|" + std::to_string(sh.size) + "|" + sh.color + "\n";
            std::cout << "[OpenGSL] Shape.sphere: " << shapeName << " r=" << radius << std::endl;
        }
    }
    // .OpenGSL.shape.rect -u (w) (h)
    else if (node->value == ".OpenGSL.shape.rect" || node->value == ".opengsl.shape.rect") {
        std::string shapeName = openGSLCurrentShapeName;
        int w = 100, h = 80;
        std::string color = openGSLCurrentColor;
        
        int numIdx = 0;
        for (size_t i = 0; i < node->children.size(); i++) {
            Value val = evaluateExpression(node->children[i]);
            if (std::holds_alternative<int>(val)) {
                if (numIdx == 0) w = std::get<int>(val);
                else h = std::get<int>(val);
                numIdx++;
            } else if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                if (s[0] == '#') color = s;
            }
        }
        
        if (openGSLShapes.find(shapeName) != openGSLShapes.end()) {
            openGSLShapes[shapeName].type = "rect";
            openGSLShapes[shapeName].w = w;
            openGSLShapes[shapeName].h = h;
            openGSLShapes[shapeName].color = color;
            
            auto& sh = openGSLShapes[shapeName];
            openGSLScript += "RECT|" + shapeName + "|" + 
                             std::to_string(sh.x) + "|" + std::to_string(sh.y) + "|" +
                             std::to_string(sh.w) + "|" + std::to_string(sh.h) + "|" + sh.color + "\n";
            std::cout << "[OpenGSL] Shape.rect: " << shapeName << " " << w << "x" << h << std::endl;
        }
    }
    // .OpenGSL.shape.circle -u (radius)
    else if (node->value == ".OpenGSL.shape.circle" || node->value == ".opengsl.shape.circle") {
        std::string shapeName = openGSLCurrentShapeName;
        int r = 50;
        std::string color = openGSLCurrentColor;
        
        for (size_t i = 0; i < node->children.size(); i++) {
            Value val = evaluateExpression(node->children[i]);
            if (std::holds_alternative<int>(val)) {
                r = std::get<int>(val);
            } else if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                if (s[0] == '#') color = s;
            }
        }
        
        if (openGSLShapes.find(shapeName) != openGSLShapes.end()) {
            openGSLShapes[shapeName].type = "circle";
            openGSLShapes[shapeName].size = r;
            openGSLShapes[shapeName].color = color;
            
            auto& sh = openGSLShapes[shapeName];
            openGSLScript += "CIRCLE|" + shapeName + "|" + 
                             std::to_string(sh.x) + "|" + std::to_string(sh.y) + "|" +
                             std::to_string(sh.size) + "|" + sh.color + "\n";
            std::cout << "[OpenGSL] Shape.circle: " << shapeName << " r=" << r << std::endl;
        }
    }
    // .OpenGSL.shape.cylinder -u (radius) (height) 'color'
    else if (node->value == ".OpenGSL.shape.cylinder" || node->value == ".opengsl.shape.cylinder") {
        std::string shapeName = openGSLCurrentShapeName;
        int radius = 50, height = 20;
        std::string color = openGSLCurrentColor;
        
        int numIdx = 0;
        for (size_t i = 0; i < node->children.size(); i++) {
            Value val = evaluateExpression(node->children[i]);
            if (std::holds_alternative<int>(val)) {
                if (numIdx == 0) radius = std::get<int>(val);
                else height = std::get<int>(val);
                numIdx++;
            } else if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                if (s[0] == '#') color = s;
            }
        }
        
        if (openGSLShapes.find(shapeName) != openGSLShapes.end()) {
            openGSLShapes[shapeName].type = "cylinder";
            openGSLShapes[shapeName].size = radius;
            openGSLShapes[shapeName].h = height;
            openGSLShapes[shapeName].color = color;
            
            auto& sh = openGSLShapes[shapeName];
            openGSLScript += "CYLINDER|" + shapeName + "|" + 
                             std::to_string(sh.x) + "|" + std::to_string(sh.y) + "|" +
                             std::to_string(sh.z) + "|" + std::to_string(sh.size) + "|" +
                             std::to_string(sh.h) + "|" + sh.color + "\n";
            std::cout << "[OpenGSL] Shape.cylinder: " << shapeName << " r=" << radius << " h=" << height << std::endl;
        }
    }
    // .OpenGSL.shape.text -u 'text' 'color'
    else if (node->value == ".OpenGSL.shape.text" || node->value == ".opengsl.shape.text") {
        std::string shapeName = openGSLCurrentShapeName;
        std::string text = "Text";
        std::string color = openGSLCurrentColor;
        
        for (size_t i = 0; i < node->children.size(); i++) {
            Value val = evaluateExpression(node->children[i]);
            if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                if (s == "-u" || s == "--use") {
                    continue;
                } else if (s[0] == '#') {
                    color = s;
                } else {
                    text = s;
                }
            }
        }
        
        if (openGSLShapes.find(shapeName) != openGSLShapes.end()) {
            openGSLShapes[shapeName].type = "text";
            openGSLShapes[shapeName].color = color;
            
            auto& sh = openGSLShapes[shapeName];
            openGSLScript += "TEXT|" + shapeName + "|" + 
                             std::to_string(sh.x) + "|" + std::to_string(sh.y) + "|" + text + "|" + sh.color + "\n";
            std::cout << "[OpenGSL] Shape.text: " << shapeName << " '" << text << "'" << std::endl;
        }
    }
    // Legacy support: .OpenGSL.apple (x) (y) (z) (size)
    else if (node->value == ".OpenGSL.apple" || node->value == ".opengsl.apple") {
        int x = 0, y = 0, z = 0, size = 80;
        if (node->children.size() >= 4) {
            Value vx = evaluateExpression(node->children[0]);
            Value vy = evaluateExpression(node->children[1]);
            Value vz = evaluateExpression(node->children[2]);
            Value vs = evaluateExpression(node->children[3]);
            if (std::holds_alternative<int>(vx)) x = std::get<int>(vx);
            if (std::holds_alternative<int>(vy)) y = std::get<int>(vy);
            if (std::holds_alternative<int>(vz)) z = std::get<int>(vz);
            if (std::holds_alternative<int>(vs)) size = std::get<int>(vs);
        }
        openGSLScript += "APPLE|shape" + std::to_string(++openGSLShapeCount) + "|" + 
                         std::to_string(x) + "|" + std::to_string(y) + "|" +
                         std::to_string(z) + "|" + std::to_string(size) + "|" + openGSLCurrentColor + "\n";
        std::cout << "[OpenGSL] Apple: " << x << "," << y << "," << z << " size=" << size << std::endl;
    }
    // OpenGSL render/show
    else if (node->value == ".OpenGSL.render" || node->value == ".opengsl.render" ||
             node->value == ".OpenGSL.show" || node->value == ".opengsl.show") {
        // Save script
        std::ofstream uiFile("_opengsl_canvas.ui");
        uiFile << "// OpenGSL - Open Public Geneia Styling Library\n";
        uiFile << openGSLScript;
        uiFile.close();
        
        std::cout << "[OpenGSL] Rendered to _opengsl_canvas.ui" << std::endl;
        
        // Try to launch GUI
        if (system("which dotnet > /dev/null 2>&1") == 0) {
            if (system("test -f ui/bin/linux/GeneiaUILinux.dll") == 0) {
                std::cout << "[OpenGSL] Opening window..." << std::endl;
                system("dotnet ui/bin/linux/GeneiaUILinux.dll _opengsl_canvas.ui");
            }
        }
    }
    // ============================================================
    // G_Web.Kit - Geneia Web Kit for generating websites
    // Import: import G_Web.Kit
    // Syntax: .GWeb.page 'title'
    //         .GWeb.style 'property' 'value'
    //         .GWeb.nav 'item1' 'item2' ...
    //         .GWeb.hero 'title' 'subtitle'
    //         .GWeb.sect 'title'
    //         .GWeb.text 'content'
    //         .GWeb.btn 'text' 'link'
    //         .GWeb.img 'src' 'alt'
    //         .GWeb.card 'title' 'content'
    //         .GWeb.foot 'text'
    //         .GWeb.build
    // OpenGSL-style: .GWeb.elem.d2 (x) (y) & elem.n = myNav
    //                .GWeb.elem.myNav -u 'nav' 'Home' 'About'
    // ============================================================
    else if (node->value == ".GWeb.page" || node->value == ".gweb.page" ||
             node->value == ".Web.page" || node->value == ".web.page") {
        // Reset web state
        webHTML = "";
        webCSS = "";
        webJS = "";
        webElementCount = 0;
        
        if (!node->children.empty()) {
            Value title = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(title)) {
                webTitle = std::get<std::string>(title);
            }
        }
        std::cout << "[G_Web.Kit] Page created: " << webTitle << std::endl;
    }
    else if (node->value == ".GWeb.style" || node->value == ".gweb.style" ||
             node->value == ".Web.style" || node->value == ".web.style") {
        // .GWeb.style 'bg' '#color' or .GWeb.style 'text' '#color' or .GWeb.style 'accent' '#color'
        if (node->children.size() >= 2) {
            Value prop = evaluateExpression(node->children[0]);
            Value val = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(prop) && std::holds_alternative<std::string>(val)) {
                std::string p = std::get<std::string>(prop);
                std::string v = std::get<std::string>(val);
                if (p == "bg" || p == "background") webBgColor = v;
                else if (p == "text") webTextColor = v;
                else if (p == "accent") webAccentColor = v;
                else if (p == "font") webFont = v;
                std::cout << "[G_Web.Kit] Style: " << p << " = " << v << std::endl;
            }
        }
    }
    else if (node->value == ".GWeb.nav" || node->value == ".gweb.nav" ||
             node->value == ".Web.nav" || node->value == ".web.nav") {
        webHTML += "<nav class=\"gn-nav\">\n";
        webHTML += "  <div class=\"gn-nav-brand\">" + webTitle + "</div>\n";
        webHTML += "  <div class=\"gn-nav-links\">\n";
        for (auto& arg : node->children) {
            Value v = evaluateExpression(arg);
            if (std::holds_alternative<std::string>(v)) {
                std::string item = std::get<std::string>(v);
                webHTML += "    <a href=\"#\">" + item + "</a>\n";
            }
        }
        webHTML += "  </div>\n</nav>\n";
        std::cout << "[G_Web.Kit] Nav created with " << node->children.size() << " items" << std::endl;
    }
    else if (node->value == ".GWeb.hero" || node->value == ".gweb.hero" ||
             node->value == ".Web.hero" || node->value == ".web.hero") {
        std::string title = "Welcome";
        std::string subtitle = "";
        if (node->children.size() >= 1) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) title = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(v)) subtitle = std::get<std::string>(v);
        }
        webHTML += "<section class=\"gn-hero\">\n";
        webHTML += "  <h1>" + title + "</h1>\n";
        if (!subtitle.empty()) webHTML += "  <p>" + subtitle + "</p>\n";
        webHTML += "</section>\n";
        std::cout << "[G_Web.Kit] Hero: " << title << std::endl;
    }
    else if (node->value == ".GWeb.sect" || node->value == ".gweb.sect" ||
             node->value == ".GWeb.section" || node->value == ".gweb.section" ||
             node->value == ".Web.section" || node->value == ".web.section") {
        std::string title = "Section";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) title = std::get<std::string>(v);
        }
        webHTML += "<section class=\"gn-section\">\n";
        webHTML += "  <h2>" + title + "</h2>\n";
        std::cout << "[G_Web.Kit] Section: " << title << std::endl;
    }
    else if (node->value == ".GWeb.endsec" || node->value == ".gweb.endsec" ||
             node->value == ".Web.endsec" || node->value == ".web.endsec") {
        webHTML += "</section>\n";
    }
    else if (node->value == ".GWeb.text" || node->value == ".gweb.text" ||
             node->value == ".Web.text" || node->value == ".web.text") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                webHTML += "  <p>" + std::get<std::string>(v) + "</p>\n";
                std::cout << "[G_Web.Kit] Text added" << std::endl;
            }
        }
    }
    else if (node->value == ".GWeb.head" || node->value == ".gweb.head" ||
             node->value == ".GWeb.heading" || node->value == ".gweb.heading" ||
             node->value == ".Web.heading" || node->value == ".web.heading") {
        std::string text = "Heading";
        int level = 2;
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) text = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<int>(v)) level = std::get<int>(v);
        }
        webHTML += "  <h" + std::to_string(level) + ">" + text + "</h" + std::to_string(level) + ">\n";
        std::cout << "[G_Web.Kit] Heading: " << text << std::endl;
    }
    else if (node->value == ".GWeb.btn" || node->value == ".gweb.btn" ||
             node->value == ".GWeb.button" || node->value == ".gweb.button" ||
             node->value == ".Web.button" || node->value == ".web.button") {
        std::string text = "Click";
        std::string link = "#";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) text = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(v)) link = std::get<std::string>(v);
        }
        webHTML += "  <a href=\"" + link + "\" class=\"gn-btn\">" + text + "</a>\n";
        std::cout << "[G_Web.Kit] Button: " << text << std::endl;
    }
    else if (node->value == ".GWeb.img" || node->value == ".gweb.img" ||
             node->value == ".GWeb.image" || node->value == ".gweb.image" ||
             node->value == ".Web.image" || node->value == ".web.image") {
        std::string src = "";
        std::string alt = "Image";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) src = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(v)) alt = std::get<std::string>(v);
        }
        webHTML += "  <img src=\"" + src + "\" alt=\"" + alt + "\" class=\"gn-img\">\n";
        std::cout << "[G_Web.Kit] Image: " << src << std::endl;
    }
    else if (node->value == ".GWeb.card" || node->value == ".gweb.card" ||
             node->value == ".Web.card" || node->value == ".web.card") {
        std::string title = "Card";
        std::string content = "";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) title = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(v)) content = std::get<std::string>(v);
        }
        webHTML += "  <div class=\"gn-card\">\n";
        webHTML += "    <h3>" + title + "</h3>\n";
        if (!content.empty()) webHTML += "    <p>" + content + "</p>\n";
        webHTML += "  </div>\n";
        std::cout << "[G_Web.Kit] Card: " << title << std::endl;
    }
    else if (node->value == ".GWeb.grid" || node->value == ".gweb.grid" ||
             node->value == ".Web.grid" || node->value == ".web.grid") {
        int cols = 3;
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<int>(v)) cols = std::get<int>(v);
        }
        webHTML += "<div class=\"gn-grid gn-grid-" + std::to_string(cols) + "\">\n";
        std::cout << "[G_Web.Kit] Grid: " << cols << " columns" << std::endl;
    }
    else if (node->value == ".GWeb.endgrid" || node->value == ".gweb.endgrid" ||
             node->value == ".Web.endgrid" || node->value == ".web.endgrid") {
        webHTML += "</div>\n";
    }
    else if (node->value == ".GWeb.list" || node->value == ".gweb.list" ||
             node->value == ".Web.list" || node->value == ".web.list") {
        webHTML += "  <ul class=\"gn-list\">\n";
        for (auto& arg : node->children) {
            Value v = evaluateExpression(arg);
            if (std::holds_alternative<std::string>(v)) {
                webHTML += "    <li>" + std::get<std::string>(v) + "</li>\n";
            }
        }
        webHTML += "  </ul>\n";
        std::cout << "[G_Web.Kit] List with " << node->children.size() << " items" << std::endl;
    }
    else if (node->value == ".GWeb.foot" || node->value == ".gweb.foot" ||
             node->value == ".GWeb.footer" || node->value == ".gweb.footer" ||
             node->value == ".Web.footer" || node->value == ".web.footer") {
        std::string text = "Made with Geneia";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) text = std::get<std::string>(v);
        }
        webHTML += "<footer class=\"gn-footer\">\n";
        webHTML += "  <p>" + text + "</p>\n";
        webHTML += "</footer>\n";
        std::cout << "[G_Web.Kit] Footer: " << text << std::endl;
    }
    // Additional G_Web.Kit elements
    else if (node->value == ".GWeb.link" || node->value == ".gweb.link") {
        std::string text = "Link";
        std::string href = "#";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) text = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(v)) href = std::get<std::string>(v);
        }
        webHTML += "  <a href=\"" + href + "\" class=\"gn-link\">" + text + "</a>\n";
        std::cout << "[G_Web.Kit] Link: " << text << std::endl;
    }
    else if (node->value == ".GWeb.input" || node->value == ".gweb.input") {
        std::string placeholder = "";
        std::string type = "text";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) placeholder = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(v)) type = std::get<std::string>(v);
        }
        webHTML += "  <input type=\"" + type + "\" placeholder=\"" + placeholder + "\" class=\"gn-input\">\n";
        std::cout << "[G_Web.Kit] Input: " << placeholder << std::endl;
    }
    else if (node->value == ".GWeb.form" || node->value == ".gweb.form") {
        std::string action = "#";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) action = std::get<std::string>(v);
        }
        webHTML += "<form class=\"gn-form\" action=\"" + action + "\" method=\"post\">\n";
        std::cout << "[G_Web.Kit] Form started" << std::endl;
    }
    else if (node->value == ".GWeb.endform" || node->value == ".gweb.endform") {
        webHTML += "</form>\n";
    }
    else if (node->value == ".GWeb.video" || node->value == ".gweb.video") {
        std::string src = "";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) src = std::get<std::string>(v);
        }
        webHTML += "  <video src=\"" + src + "\" controls class=\"gn-video\"></video>\n";
        std::cout << "[G_Web.Kit] Video: " << src << std::endl;
    }
    else if (node->value == ".GWeb.div" || node->value == ".gweb.div") {
        std::string className = "";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) className = std::get<std::string>(v);
        }
        webHTML += "<div class=\"" + className + "\">\n";
        std::cout << "[G_Web.Kit] Div: " << className << std::endl;
    }
    else if (node->value == ".GWeb.enddiv" || node->value == ".gweb.enddiv") {
        webHTML += "</div>\n";
    }
    else if (node->value == ".GWeb.br" || node->value == ".gweb.br") {
        webHTML += "  <br>\n";
    }
    else if (node->value == ".GWeb.hr" || node->value == ".gweb.hr") {
        webHTML += "  <hr class=\"gn-hr\">\n";
    }
    else if (node->value == ".GWeb.space" || node->value == ".gweb.space") {
        int height = 20;
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<int>(v)) height = std::get<int>(v);
        }
        webHTML += "  <div style=\"height: " + std::to_string(height) + "px;\"></div>\n";
    }
    else if (node->value == ".GWeb.build" || node->value == ".gweb.build" ||
             node->value == ".Web.build" || node->value == ".web.build") {
        // Generate CSS
        webCSS = R"(
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: )" + webFont + R"(; background: )" + webBgColor + R"(; color: )" + webTextColor + R"(; line-height: 1.6; }
.gn-nav { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: rgba(0,0,0,0.1); }
.gn-nav-brand { font-size: 1.5rem; font-weight: bold; color: )" + webAccentColor + R"(; }
.gn-nav-links a { margin-left: 2rem; text-decoration: none; color: )" + webTextColor + R"(; transition: color 0.3s; }
.gn-nav-links a:hover { color: )" + webAccentColor + R"(; }
.gn-hero { text-align: center; padding: 5rem 2rem; background: linear-gradient(135deg, )" + webAccentColor + R"(22, )" + webAccentColor + R"(11); }
.gn-hero h1 { font-size: 3rem; margin-bottom: 1rem; }
.gn-hero p { font-size: 1.25rem; opacity: 0.8; }
.gn-section { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
.gn-section h2 { font-size: 2rem; margin-bottom: 1.5rem; color: )" + webAccentColor + R"(; }
.gn-btn { display: inline-block; padding: 0.75rem 1.5rem; background: )" + webAccentColor + R"(; color: white; text-decoration: none; border-radius: 8px; transition: transform 0.2s, box-shadow 0.2s; }
.gn-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 20px )" + webAccentColor + R"(44; }
.gn-img { max-width: 100%; border-radius: 12px; }
.gn-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.5rem; margin: 1rem 0; }
.gn-card h3 { color: )" + webAccentColor + R"(; margin-bottom: 0.5rem; }
.gn-grid { display: grid; gap: 1.5rem; }
.gn-grid-2 { grid-template-columns: repeat(2, 1fr); }
.gn-grid-3 { grid-template-columns: repeat(3, 1fr); }
.gn-grid-4 { grid-template-columns: repeat(4, 1fr); }
.gn-list { list-style: none; }
.gn-list li { padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
.gn-footer { text-align: center; padding: 2rem; background: rgba(0,0,0,0.1); margin-top: 2rem; }
.gn-link { color: )" + webAccentColor + R"(; text-decoration: none; transition: opacity 0.2s; }
.gn-link:hover { opacity: 0.8; }
.gn-input { padding: 0.75rem 1rem; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; background: rgba(255,255,255,0.05); color: inherit; font-size: 1rem; width: 100%; max-width: 400px; }
.gn-input:focus { outline: none; border-color: )" + webAccentColor + R"(; }
.gn-form { display: flex; flex-direction: column; gap: 1rem; }
.gn-video { max-width: 100%; border-radius: 12px; }
.gn-hr { border: none; height: 1px; background: rgba(255,255,255,0.1); margin: 2rem 0; }
@media (max-width: 768px) { .gn-grid-2, .gn-grid-3, .gn-grid-4 { grid-template-columns: 1fr; } .gn-hero h1 { font-size: 2rem; } }
)";
        
        // Generate full HTML
        std::string fullHTML = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n";
        fullHTML += "  <meta charset=\"UTF-8\">\n";
        fullHTML += "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n";
        fullHTML += "  <title>" + webTitle + "</title>\n";
        fullHTML += "  <style>" + webCSS + "</style>\n";
        fullHTML += "</head>\n<body>\n";
        fullHTML += webHTML;
        fullHTML += "</body>\n</html>";
        
        // Save to file
        std::ofstream htmlFile("_geneia_website.html");
        htmlFile << fullHTML;
        htmlFile.close();
        
        std::cout << "[G_Web.Kit] Website built: _geneia_website.html" << std::endl;
        std::cout << "[G_Web.Kit] Open in browser to view" << std::endl;
        
        // Try to open in browser
        if (system("which xdg-open > /dev/null 2>&1") == 0) {
            system("xdg-open _geneia_website.html 2>/dev/null &");
        }
    }
    // ============================================================
    // OpenGWS - Open Public Geneia Web Server Services Kit
    // Package Manager (like npm) + Web Server (like node)
    // Import: import OpenGWS
    // 
    // Package Manager:
    //   .GWS.install 'package'    - Install a package
    //   .GWS.remove 'package'     - Remove a package
    //   .GWS.list                 - List installed packages
    //   .GWS.search 'query'       - Search packages
    //   .GWS.update               - Update packages
    //
    // Web Server:
    //   .GWS.port (8080)          - Set server port
    //   .GWS.route '/'            - Define a route
    //   .GWS.page 'title'         - Set page title
    //   .GWS.endroute             - End route definition
    //   .GWS.serve                - Start the server
    // ============================================================
    // Package Manager Functions
    else if (node->value == ".GWS.install" || node->value == ".gws.install" ||
             node->value == ".OpenGWS.install" || node->value == ".opengws.install") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string pkg = std::get<std::string>(v);
                gwsInstalledPackages.push_back(pkg);
                std::cout << "[gwsl-get] Installing " << pkg << "..." << std::endl;
                std::cout << "[gwsl-get] Package '" << pkg << "' installed" << std::endl;
            }
        }
    }
    else if (node->value == ".GWS.remove" || node->value == ".gws.remove" ||
             node->value == ".OpenGWS.remove" || node->value == ".opengws.remove") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string pkg = std::get<std::string>(v);
                auto it = std::find(gwsInstalledPackages.begin(), gwsInstalledPackages.end(), pkg);
                if (it != gwsInstalledPackages.end()) {
                    gwsInstalledPackages.erase(it);
                    std::cout << "[gwsl-get] Removed: " << pkg << std::endl;
                } else {
                    std::cout << "[gwsl-get] Not found: " << pkg << std::endl;
                }
            }
        }
    }
    else if (node->value == ".GWS.pkglist" || node->value == ".gws.pkglist" ||
             node->value == ".OpenGWS.pkglist" || node->value == ".opengws.pkglist") {
        std::cout << "[gwsl-get] Installed packages:" << std::endl;
        if (gwsInstalledPackages.empty()) {
            std::cout << "  (none)" << std::endl;
        } else {
            for (const auto& pkg : gwsInstalledPackages) {
                std::cout << "  - " << pkg << std::endl;
            }
        }
    }
    else if (node->value == ".GWS.search" || node->value == ".gws.search" ||
             node->value == ".OpenGWS.search" || node->value == ".opengws.search") {
        std::string query = "";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) query = std::get<std::string>(v);
        }
        std::cout << "[gwsl-get] Available packages:" << std::endl;
        std::cout << "  - express     : Fast web framework" << std::endl;
        std::cout << "  - flask       : Python web framework" << std::endl;
        std::cout << "  - fastapi     : Modern API framework" << std::endl;
        std::cout << "  - http-server : Simple HTTP server" << std::endl;
    }
    else if (node->value == ".GWS.update" || node->value == ".gws.update" ||
             node->value == ".OpenGWS.update" || node->value == ".opengws.update") {
        std::cout << "[gwsl-get] Updating packages..." << std::endl;
        std::cout << "[gwsl-get] All packages up to date" << std::endl;
    }
    // Web Server Functions
    else if (node->value == ".GWS.port" || node->value == ".gws.port" ||
             node->value == ".OpenGWS.port" || node->value == ".opengws.port") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<int>(v)) {
                gwsPort = std::get<int>(v);
            }
        }
        std::cout << "[OpenGWS] Port set to: " << gwsPort << std::endl;
    }
    else if (node->value == ".GWS.route" || node->value == ".gws.route" ||
             node->value == ".OpenGWS.route" || node->value == ".opengws.route") {
        // Start a new route
        gwsCurrentRoute = "/";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                gwsCurrentRoute = std::get<std::string>(v);
            }
        }
        // Reset web state for this route
        webHTML = "";
        webCSS = "";
        webJS = "";
        webTitle = "Geneia Server";
        std::cout << "[OpenGWS] Route: " << gwsCurrentRoute << std::endl;
    }
    else if (node->value == ".GWS.endroute" || node->value == ".gws.endroute" ||
             node->value == ".OpenGWS.endroute" || node->value == ".opengws.endroute") {
        // Build the page for this route
        std::string routeCSS = R"(
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: )" + webFont + R"(; background: )" + webBgColor + R"(; color: )" + webTextColor + R"(; line-height: 1.6; }
.gn-nav { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: rgba(0,0,0,0.1); }
.gn-nav-brand { font-size: 1.5rem; font-weight: bold; color: )" + webAccentColor + R"(; }
.gn-nav-links a { margin-left: 2rem; text-decoration: none; color: )" + webTextColor + R"(; }
.gn-hero { text-align: center; padding: 5rem 2rem; background: linear-gradient(135deg, )" + webAccentColor + R"(22, )" + webAccentColor + R"(11); }
.gn-hero h1 { font-size: 3rem; margin-bottom: 1rem; }
.gn-section { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
.gn-section h2 { font-size: 2rem; margin-bottom: 1.5rem; color: )" + webAccentColor + R"(; }
.gn-btn { display: inline-block; padding: 0.75rem 1.5rem; background: )" + webAccentColor + R"(; color: white; text-decoration: none; border-radius: 8px; }
.gn-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.5rem; margin: 1rem 0; }
.gn-card h3 { color: )" + webAccentColor + R"(; }
.gn-grid { display: grid; gap: 1.5rem; }
.gn-grid-3 { grid-template-columns: repeat(3, 1fr); }
.gn-list { list-style: none; }
.gn-list li { padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
.gn-footer { text-align: center; padding: 2rem; background: rgba(0,0,0,0.1); }
)";
        std::string fullHTML = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\"><title>" + webTitle + "</title><style>" + routeCSS + "</style></head><body>" + webHTML + "</body></html>";
        gwsRoutes.push_back({gwsCurrentRoute, fullHTML});
        std::cout << "[OpenGWS] Route '" << gwsCurrentRoute << "' ready" << std::endl;
    }
    else if (node->value == ".GWS.page" || node->value == ".gws.page" ||
             node->value == ".OpenGWS.page" || node->value == ".opengws.page") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                webTitle = std::get<std::string>(v);
            }
        }
        std::cout << "[OpenGWS] Page: " << webTitle << std::endl;
    }
    else if (node->value == ".GWS.style" || node->value == ".gws.style" ||
             node->value == ".OpenGWS.style" || node->value == ".opengws.style") {
        if (node->children.size() >= 2) {
            Value prop = evaluateExpression(node->children[0]);
            Value val = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(prop) && std::holds_alternative<std::string>(val)) {
                std::string p = std::get<std::string>(prop);
                std::string v = std::get<std::string>(val);
                if (p == "bg") webBgColor = v;
                else if (p == "text") webTextColor = v;
                else if (p == "accent") webAccentColor = v;
                else if (p == "font") webFont = v;
            }
        }
    }
    else if (node->value == ".GWS.nav" || node->value == ".gws.nav" ||
             node->value == ".OpenGWS.nav" || node->value == ".opengws.nav") {
        webHTML += "<nav class=\"gn-nav\"><div class=\"gn-nav-brand\">" + webTitle + "</div><div class=\"gn-nav-links\">";
        for (auto& arg : node->children) {
            Value v = evaluateExpression(arg);
            if (std::holds_alternative<std::string>(v)) {
                webHTML += "<a href=\"#\">" + std::get<std::string>(v) + "</a>";
            }
        }
        webHTML += "</div></nav>";
    }
    else if (node->value == ".GWS.hero" || node->value == ".gws.hero" ||
             node->value == ".OpenGWS.hero" || node->value == ".opengws.hero") {
        std::string title = "Welcome", subtitle = "";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) title = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(v)) subtitle = std::get<std::string>(v);
        }
        webHTML += "<section class=\"gn-hero\"><h1>" + title + "</h1>";
        if (!subtitle.empty()) webHTML += "<p>" + subtitle + "</p>";
        webHTML += "</section>";
    }
    else if (node->value == ".GWS.sect" || node->value == ".gws.sect" ||
             node->value == ".OpenGWS.sect" || node->value == ".opengws.sect") {
        std::string title = "Section";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) title = std::get<std::string>(v);
        }
        webHTML += "<section class=\"gn-section\"><h2>" + title + "</h2>";
    }
    else if (node->value == ".GWS.endsec" || node->value == ".gws.endsec" ||
             node->value == ".OpenGWS.endsec" || node->value == ".opengws.endsec") {
        webHTML += "</section>";
    }
    else if (node->value == ".GWS.text" || node->value == ".gws.text" ||
             node->value == ".OpenGWS.text" || node->value == ".opengws.text") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                webHTML += "<p>" + std::get<std::string>(v) + "</p>";
            }
        }
    }
    else if (node->value == ".GWS.btn" || node->value == ".gws.btn" ||
             node->value == ".OpenGWS.btn" || node->value == ".opengws.btn") {
        std::string text = "Click", link = "#";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) text = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(v)) link = std::get<std::string>(v);
        }
        webHTML += "<a href=\"" + link + "\" class=\"gn-btn\">" + text + "</a>";
    }
    else if (node->value == ".GWS.card" || node->value == ".gws.card" ||
             node->value == ".OpenGWS.card" || node->value == ".opengws.card") {
        std::string title = "Card", content = "";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) title = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(v)) content = std::get<std::string>(v);
        }
        webHTML += "<div class=\"gn-card\"><h3>" + title + "</h3>";
        if (!content.empty()) webHTML += "<p>" + content + "</p>";
        webHTML += "</div>";
    }
    else if (node->value == ".GWS.grid" || node->value == ".gws.grid" ||
             node->value == ".OpenGWS.grid" || node->value == ".opengws.grid") {
        int cols = 3;
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<int>(v)) cols = std::get<int>(v);
        }
        webHTML += "<div class=\"gn-grid gn-grid-" + std::to_string(cols) + "\">";
    }
    else if (node->value == ".GWS.endgrid" || node->value == ".gws.endgrid" ||
             node->value == ".OpenGWS.endgrid" || node->value == ".opengws.endgrid") {
        webHTML += "</div>";
    }
    else if (node->value == ".GWS.list" || node->value == ".gws.list" ||
             node->value == ".OpenGWS.list" || node->value == ".opengws.list") {
        webHTML += "<ul class=\"gn-list\">";
        for (auto& arg : node->children) {
            Value v = evaluateExpression(arg);
            if (std::holds_alternative<std::string>(v)) {
                webHTML += "<li>" + std::get<std::string>(v) + "</li>";
            }
        }
        webHTML += "</ul>";
    }
    else if (node->value == ".GWS.foot" || node->value == ".gws.foot" ||
             node->value == ".OpenGWS.foot" || node->value == ".opengws.foot") {
        std::string text = "Powered by OpenGWS";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) text = std::get<std::string>(v);
        }
        webHTML += "<footer class=\"gn-footer\"><p>" + text + "</p></footer>";
    }
    else if (node->value == ".GWS.serve" || node->value == ".gws.serve" ||
             node->value == ".OpenGWS.serve" || node->value == ".opengws.serve") {
        // Generate Python server script
        std::string serverScript = R"(#!/usr/bin/env python3
import http.server
import socketserver

PORT = )" + std::to_string(gwsPort) + R"(

ROUTES = {
)";
        for (auto& route : gwsRoutes) {
            // Escape quotes in HTML
            std::string escapedHTML = route.second;
            size_t pos = 0;
            while ((pos = escapedHTML.find("\"", pos)) != std::string::npos) {
                escapedHTML.replace(pos, 1, "\\\"");
                pos += 2;
            }
            pos = 0;
            while ((pos = escapedHTML.find("\n", pos)) != std::string::npos) {
                escapedHTML.replace(pos, 1, "\\n");
                pos += 2;
            }
            serverScript += "    \"" + route.first + "\": \"" + escapedHTML + "\",\n";
        }
        serverScript += R"(}

class GeneiaHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?')[0]
        if path in ROUTES:
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(ROUTES[path].encode('utf-8'))
        else:
            self.send_response(404)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'<h1>404 - Not Found</h1><p>Route not defined in OpenGWS</p>')

with socketserver.TCPServer(("", PORT), GeneiaHandler) as httpd:
    print(f"\n[OpenGWS] Server running at http://localhost:{PORT}")
    print("[OpenGWS] Press Ctrl+C to stop\n")
    print("Routes:")
    for route in ROUTES:
        print(f"  - http://localhost:{PORT}{route}")
    print()
    httpd.serve_forever()
)";
        // Save server script
        std::ofstream serverFile("_geneia_server.py");
        serverFile << serverScript;
        serverFile.close();
        
        std::cout << "\n[OpenGWS] ========================================" << std::endl;
        std::cout << "[OpenGWS] Server script saved to _geneia_server.py" << std::endl;
        std::cout << "[OpenGWS] Starting server on port " << gwsPort << "..." << std::endl;
        std::cout << "[OpenGWS] ========================================\n" << std::endl;
        
        // Run the server
        system("python3 _geneia_server.py");
    }
    // ============================================================
    // OpenW2G - Open Public Web to Geneia Kit
    // Converts HTML/Web code to Geneia syntax
    // Import: import OpenW2G
    // Syntax: .W2G.parse 'file.html'   - Parse HTML file
    //         .W2G.convert '<html>'    - Convert HTML string
    //         .W2G.save 'output.gn'    - Save to file
    //         .W2G.view                - View converted code
    // ============================================================
    else if (node->value == ".W2G.parse" || node->value == ".w2g.parse" ||
             node->value == ".OpenW2G.parse" || node->value == ".openw2g.parse") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string filename = std::get<std::string>(v);
                std::ifstream file(filename);
                if (file.is_open()) {
                    std::stringstream buffer;
                    buffer << file.rdbuf();
                    w2gInputHTML = buffer.str();
                    file.close();
                    std::cout << "[OpenW2G] Parsed: " << filename << std::endl;
                } else {
                    std::cout << "[OpenW2G] Error: Cannot open " << filename << std::endl;
                }
            }
        }
    }
    else if (node->value == ".W2G.convert" || node->value == ".w2g.convert" ||
             node->value == ".OpenW2G.convert" || node->value == ".openw2g.convert") {
        std::string html = w2gInputHTML;
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) html = std::get<std::string>(v);
        }
        
        w2gOutputGeneia = "! Generated by OpenW2G !\n\nimport G_Web.Kit\n\n";
        w2gOutputGeneia += ".GWeb.page 'Converted Page'\n";
        w2gOutputGeneia += ".GWeb.style 'bg' '#ffffff'\n";
        w2gOutputGeneia += ".GWeb.style 'text' '#333333'\n\n";
        
        // Simple HTML to Geneia conversion
        size_t pos = 0;
        while ((pos = html.find("<", pos)) != std::string::npos) {
            size_t end = html.find(">", pos);
            if (end == std::string::npos) break;
            
            std::string tag = html.substr(pos + 1, end - pos - 1);
            size_t spacePos = tag.find(" ");
            std::string tagName = (spacePos != std::string::npos) ? tag.substr(0, spacePos) : tag;
            
            size_t closeStart = html.find("</" + tagName, end);
            std::string content = "";
            if (closeStart != std::string::npos) {
                content = html.substr(end + 1, closeStart - end - 1);
                size_t start = content.find_first_not_of(" \t\n\r");
                size_t last = content.find_last_not_of(" \t\n\r");
                if (start != std::string::npos && last != std::string::npos) {
                    content = content.substr(start, last - start + 1);
                }
            }
            
            if (tagName == "h1" || tagName == "h2" || tagName == "h3") {
                w2gOutputGeneia += ".GWeb.head '" + content + "'\n";
            } else if (tagName == "p") {
                w2gOutputGeneia += ".GWeb.text '" + content + "'\n";
            } else if (tagName == "button" || tagName == "a") {
                w2gOutputGeneia += ".GWeb.btn '" + content + "' '#'\n";
            } else if (tagName == "nav") {
                w2gOutputGeneia += ".GWeb.nav 'Home' 'About'\n";
            } else if (tagName == "section") {
                w2gOutputGeneia += ".GWeb.sect 'Section'\n";
            } else if (tagName == "footer") {
                w2gOutputGeneia += ".GWeb.foot '" + content + "'\n";
            }
            
            pos = end + 1;
        }
        
        w2gOutputGeneia += "\n.GWeb.build\nexit (0)\n";
        std::cout << "[OpenW2G] Converted to Geneia code" << std::endl;
    }
    else if (node->value == ".W2G.save" || node->value == ".w2g.save" ||
             node->value == ".OpenW2G.save" || node->value == ".openw2g.save") {
        std::string filename = "converted.gn";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) filename = std::get<std::string>(v);
        }
        std::ofstream file(filename);
        file << w2gOutputGeneia;
        file.close();
        std::cout << "[OpenW2G] Saved to: " << filename << std::endl;
    }
    else if (node->value == ".W2G.view" || node->value == ".w2g.view" ||
             node->value == ".OpenW2G.view" || node->value == ".openw2g.view") {
        std::cout << "[OpenW2G] Generated code:\n" << w2gOutputGeneia << std::endl;
    }
    // ============================================================
    // G_Render - Universal Rendering Module
    // Render same UI to web, desktop, terminal, or other platforms
    // Import: import G_Render
    // Syntax: .GR.target 'web'        - Set target (web/desktop/term/json)
    //         .GR.title 'App Name'    - Set app title
    //         .GR.theme 'dark'        - Set theme (dark/light)
    //         .GR.style 'accent' '#color'
    //         .GR.view 'main'         - Create a view
    //         .GR.text 'content'      - Add text
    //         .GR.btn 'Click' 'action'
    //         .GR.nav 'Home' 'About'
    //         .GR.card 'title' 'content'
    //         .GR.grid (cols)
    //         .GR.list 'item1' 'item2'
    //         .GR.img 'src' 'alt'
    //         .GR.endview
    //         .GR.render              - Render to target
    // ============================================================
    else if (node->value == ".GR.target" || node->value == ".gr.target" ||
             node->value == ".GRender.target" || node->value == ".grender.target") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                renderTarget = std::get<std::string>(v);
            }
        }
        std::cout << "[G_Render] Target: " << renderTarget << std::endl;
    }
    else if (node->value == ".GR.title" || node->value == ".gr.title" ||
             node->value == ".GRender.title" || node->value == ".grender.title") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                renderTitle = std::get<std::string>(v);
            }
        }
        std::cout << "[G_Render] Title: " << renderTitle << std::endl;
    }
    else if (node->value == ".GR.theme" || node->value == ".gr.theme" ||
             node->value == ".GRender.theme" || node->value == ".grender.theme") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                renderTheme = std::get<std::string>(v);
                if (renderTheme == "dark") {
                    renderBg = "#0a0a1a";
                    renderText = "#f0f0f0";
                } else if (renderTheme == "light") {
                    renderBg = "#ffffff";
                    renderText = "#333333";
                }
            }
        }
        std::cout << "[G_Render] Theme: " << renderTheme << std::endl;
    }
    else if (node->value == ".GR.style" || node->value == ".gr.style" ||
             node->value == ".GRender.style" || node->value == ".grender.style") {
        if (node->children.size() >= 2) {
            Value prop = evaluateExpression(node->children[0]);
            Value val = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(prop) && std::holds_alternative<std::string>(val)) {
                std::string p = std::get<std::string>(prop);
                std::string v = std::get<std::string>(val);
                if (p == "accent") renderAccent = v;
                else if (p == "bg") renderBg = v;
                else if (p == "text") renderText = v;
            }
        }
    }
    else if (node->value == ".GR.view" || node->value == ".gr.view" ||
             node->value == ".GRender.view" || node->value == ".grender.view") {
        renderOutput = "";
        std::string viewId = "main";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) viewId = std::get<std::string>(v);
        }
        std::cout << "[G_Render] View: " << viewId << std::endl;
    }
    else if (node->value == ".GR.text" || node->value == ".gr.text" ||
             node->value == ".GRender.text" || node->value == ".grender.text") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string text = std::get<std::string>(v);
                if (renderTarget == "web") {
                    renderOutput += "<p class=\"gr-text\">" + text + "</p>\n";
                } else if (renderTarget == "term") {
                    renderOutput += text + "\n";
                } else if (renderTarget == "json") {
                    renderOutput += "{\"type\":\"text\",\"content\":\"" + text + "\"},\n";
                } else if (renderTarget == "desktop") {
                    renderOutput += "LABEL|lbl|" + text + "|20|auto|400|30\n";
                }
            }
        }
    }
    else if (node->value == ".GR.btn" || node->value == ".gr.btn" ||
             node->value == ".GRender.btn" || node->value == ".grender.btn") {
        std::string text = "Button", action = "#";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) text = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(v)) action = std::get<std::string>(v);
        }
        if (renderTarget == "web") {
            renderOutput += "<button class=\"gr-btn\" onclick=\"" + action + "\">" + text + "</button>\n";
        } else if (renderTarget == "term") {
            renderOutput += "[" + text + "]\n";
        } else if (renderTarget == "json") {
            renderOutput += "{\"type\":\"button\",\"text\":\"" + text + "\",\"action\":\"" + action + "\"},\n";
        } else if (renderTarget == "desktop") {
            renderOutput += "BUTTON|btn|" + text + "|20|auto|150|40\n";
        }
    }
    else if (node->value == ".GR.nav" || node->value == ".gr.nav" ||
             node->value == ".GRender.nav" || node->value == ".grender.nav") {
        if (renderTarget == "web") {
            renderOutput += "<nav class=\"gr-nav\"><div class=\"gr-brand\">" + renderTitle + "</div><div class=\"gr-links\">";
            for (auto& arg : node->children) {
                Value v = evaluateExpression(arg);
                if (std::holds_alternative<std::string>(v)) {
                    renderOutput += "<a href=\"#\">" + std::get<std::string>(v) + "</a>";
                }
            }
            renderOutput += "</div></nav>\n";
        } else if (renderTarget == "term") {
            renderOutput += "=== " + renderTitle + " ===\n";
            for (auto& arg : node->children) {
                Value v = evaluateExpression(arg);
                if (std::holds_alternative<std::string>(v)) {
                    renderOutput += "| " + std::get<std::string>(v) + " ";
                }
            }
            renderOutput += "|\n";
        } else if (renderTarget == "json") {
            renderOutput += "{\"type\":\"nav\",\"brand\":\"" + renderTitle + "\",\"items\":[";
            bool first = true;
            for (auto& arg : node->children) {
                Value v = evaluateExpression(arg);
                if (std::holds_alternative<std::string>(v)) {
                    if (!first) renderOutput += ",";
                    renderOutput += "\"" + std::get<std::string>(v) + "\"";
                    first = false;
                }
            }
            renderOutput += "]},\n";
        } else if (renderTarget == "desktop") {
            renderOutput += "MENU|" + renderTitle + "\n";
        }
    }
    else if (node->value == ".GR.hero" || node->value == ".gr.hero" ||
             node->value == ".GRender.hero" || node->value == ".grender.hero") {
        std::string title = "Welcome", subtitle = "";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) title = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(v)) subtitle = std::get<std::string>(v);
        }
        if (renderTarget == "web") {
            renderOutput += "<section class=\"gr-hero\"><h1>" + title + "</h1>";
            if (!subtitle.empty()) renderOutput += "<p>" + subtitle + "</p>";
            renderOutput += "</section>\n";
        } else if (renderTarget == "term") {
            renderOutput += "\n*** " + title + " ***\n";
            if (!subtitle.empty()) renderOutput += subtitle + "\n";
            renderOutput += "\n";
        } else if (renderTarget == "json") {
            renderOutput += "{\"type\":\"hero\",\"title\":\"" + title + "\",\"subtitle\":\"" + subtitle + "\"},\n";
        } else if (renderTarget == "desktop") {
            renderOutput += "LABEL|hero|" + title + "|center|20|800|50\n";
        }
    }
    else if (node->value == ".GR.card" || node->value == ".gr.card" ||
             node->value == ".GRender.card" || node->value == ".grender.card") {
        std::string title = "Card", content = "";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) title = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(v)) content = std::get<std::string>(v);
        }
        if (renderTarget == "web") {
            renderOutput += "<div class=\"gr-card\"><h3>" + title + "</h3>";
            if (!content.empty()) renderOutput += "<p>" + content + "</p>";
            renderOutput += "</div>\n";
        } else if (renderTarget == "term") {
            renderOutput += "+-- " + title + " --+\n";
            if (!content.empty()) renderOutput += "| " + content + "\n";
            renderOutput += "+---------------+\n";
        } else if (renderTarget == "json") {
            renderOutput += "{\"type\":\"card\",\"title\":\"" + title + "\",\"content\":\"" + content + "\"},\n";
        } else if (renderTarget == "desktop") {
            renderOutput += "PANEL|card|20|auto|300|100\n";
            renderOutput += "LABEL|cardtitle|" + title + "|25|5|290|25\n";
        }
    }
    else if (node->value == ".GR.list" || node->value == ".gr.list" ||
             node->value == ".GRender.list" || node->value == ".grender.list") {
        if (renderTarget == "web") {
            renderOutput += "<ul class=\"gr-list\">";
            for (auto& arg : node->children) {
                Value v = evaluateExpression(arg);
                if (std::holds_alternative<std::string>(v)) {
                    renderOutput += "<li>" + std::get<std::string>(v) + "</li>";
                }
            }
            renderOutput += "</ul>\n";
        } else if (renderTarget == "term") {
            for (auto& arg : node->children) {
                Value v = evaluateExpression(arg);
                if (std::holds_alternative<std::string>(v)) {
                    renderOutput += "  * " + std::get<std::string>(v) + "\n";
                }
            }
        } else if (renderTarget == "json") {
            renderOutput += "{\"type\":\"list\",\"items\":[";
            bool first = true;
            for (auto& arg : node->children) {
                Value v = evaluateExpression(arg);
                if (std::holds_alternative<std::string>(v)) {
                    if (!first) renderOutput += ",";
                    renderOutput += "\"" + std::get<std::string>(v) + "\"";
                    first = false;
                }
            }
            renderOutput += "]},\n";
        } else if (renderTarget == "desktop") {
            renderOutput += "LISTBOX|list|20|auto|300|100\n";
        }
    }
    else if (node->value == ".GR.grid" || node->value == ".gr.grid" ||
             node->value == ".GRender.grid" || node->value == ".grender.grid") {
        int cols = 3;
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<int>(v)) cols = std::get<int>(v);
        }
        if (renderTarget == "web") {
            renderOutput += "<div class=\"gr-grid gr-grid-" + std::to_string(cols) + "\">\n";
        } else if (renderTarget == "json") {
            renderOutput += "{\"type\":\"grid\",\"cols\":" + std::to_string(cols) + ",\"children\":[\n";
        }
    }
    else if (node->value == ".GR.endgrid" || node->value == ".gr.endgrid" ||
             node->value == ".GRender.endgrid" || node->value == ".grender.endgrid") {
        if (renderTarget == "web") {
            renderOutput += "</div>\n";
        } else if (renderTarget == "json") {
            renderOutput += "]},\n";
        }
    }
    else if (node->value == ".GR.endview" || node->value == ".gr.endview" ||
             node->value == ".GRender.endview" || node->value == ".grender.endview") {
        std::cout << "[G_Render] View complete" << std::endl;
    }
    else if (node->value == ".GR.render" || node->value == ".gr.render" ||
             node->value == ".GRender.render" || node->value == ".grender.render") {
        std::cout << "[G_Render] Rendering to " << renderTarget << "..." << std::endl;
        
        if (renderTarget == "web") {
            std::string css = R"(
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; background: )" + renderBg + R"(; color: )" + renderText + R"(; }
.gr-nav { display: flex; justify-content: space-between; padding: 1rem 2rem; background: rgba(0,0,0,0.2); }
.gr-brand { font-size: 1.5rem; font-weight: bold; color: )" + renderAccent + R"(; }
.gr-links a { margin-left: 2rem; color: )" + renderText + R"(; text-decoration: none; }
.gr-hero { text-align: center; padding: 4rem 2rem; background: linear-gradient(135deg, )" + renderAccent + R"(22, )" + renderAccent + R"(11); }
.gr-hero h1 { font-size: 3rem; margin-bottom: 1rem; }
.gr-text { margin: 1rem 2rem; }
.gr-btn { padding: 0.75rem 1.5rem; background: )" + renderAccent + R"(; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 0.5rem; }
.gr-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; margin: 1rem; }
.gr-card h3 { color: )" + renderAccent + R"(; margin-bottom: 0.5rem; }
.gr-grid { display: grid; gap: 1rem; padding: 1rem; }
.gr-grid-2 { grid-template-columns: repeat(2, 1fr); }
.gr-grid-3 { grid-template-columns: repeat(3, 1fr); }
.gr-grid-4 { grid-template-columns: repeat(4, 1fr); }
.gr-list { list-style: none; margin: 1rem 2rem; }
.gr-list li { padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
)";
            std::string html = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\"><title>" + renderTitle + "</title><style>" + css + "</style></head><body>\n" + renderOutput + "</body></html>";
            
            std::ofstream file("_grender_output.html");
            file << html;
            file.close();
            std::cout << "[G_Render] Output: _grender_output.html" << std::endl;
            
            if (system("which xdg-open > /dev/null 2>&1") == 0) {
                system("xdg-open _grender_output.html 2>/dev/null &");
            }
        } else if (renderTarget == "term") {
            std::cout << "\n" << renderOutput << std::endl;
        } else if (renderTarget == "json") {
            std::string json = "{\"app\":\"" + renderTitle + "\",\"theme\":\"" + renderTheme + "\",\"elements\":[\n" + renderOutput + "]}\n";
            std::ofstream file("_grender_output.json");
            file << json;
            file.close();
            std::cout << "[G_Render] Output: _grender_output.json" << std::endl;
        } else if (renderTarget == "desktop") {
            std::string ui = "WINDOW|" + renderTitle + "|800|600\n" + renderOutput + "SHOW\n";
            std::ofstream file("_grender_output.ui");
            file << ui;
            file.close();
            std::cout << "[G_Render] Output: _grender_output.ui" << std::endl;
            
            if (system("which dotnet > /dev/null 2>&1") == 0) {
                if (system("test -f ui/bin/linux/GeneiaUILinux.dll") == 0) {
                    system("dotnet ui/bin/linux/GeneiaUILinux.dll _grender_output.ui");
                }
            }
        }
    }
    // ============================================================
    // OpenGNEL - Open Geneia Element LanScript
    // Command line scripting in Geneia syntax
    // Import: import OpenGNEL
    // Syntax: .GNEL.run 'command'      - Run shell command
    //         .GNEL.cd 'path'          - Change directory
    //         .GNEL.pwd                - Print working directory
    //         .GNEL.ls                 - List files
    //         .GNEL.ls 'path'          - List files in path
    //         .GNEL.cat 'file'         - Show file content
    //         .GNEL.echo 'text'        - Print text
    //         .GNEL.mkdir 'dir'        - Create directory
    //         .GNEL.rm 'file'          - Remove file
    //         .GNEL.cp 'src' 'dst'     - Copy file
    //         .GNEL.mv 'src' 'dst'     - Move file
    //         .GNEL.env 'VAR' 'value'  - Set environment variable
    //         .GNEL.getenv 'VAR'       - Get environment variable
    //         .GNEL.alias 'name' 'cmd' - Create alias
    //         .GNEL.hist               - Show command history
    //         .GNEL.pipe 'cmd1' 'cmd2' - Pipe commands
    //         .GNEL.script 'file'      - Run script file
    //         .GNEL.save 'file'        - Save script to file
    // ============================================================
    else if (node->value == ".GNEL.run" || node->value == ".gnel.run" ||
             node->value == ".OpenGNEL.run" || node->value == ".opengnel.run") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string cmd = std::get<std::string>(v);
                // Check for alias
                if (gnelAliases.find(cmd) != gnelAliases.end()) {
                    cmd = gnelAliases[cmd];
                }
                gnelHistory.push_back(cmd);
                std::cout << "[GNEL] $ " << cmd << std::endl;
                int result = system(cmd.c_str());
                if (result != 0) {
                    std::cout << "[GNEL] Command exited with code: " << result << std::endl;
                }
            }
        }
    }
    else if (node->value == ".GNEL.cd" || node->value == ".gnel.cd" ||
             node->value == ".OpenGNEL.cd" || node->value == ".opengnel.cd") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string path = std::get<std::string>(v);
                if (chdir(path.c_str()) == 0) {
                    gnelWorkDir = path;
                    std::cout << "[GNEL] Changed to: " << path << std::endl;
                } else {
                    std::cout << "[GNEL] Error: Cannot change to " << path << std::endl;
                }
            }
        }
    }
    else if (node->value == ".GNEL.pwd" || node->value == ".gnel.pwd" ||
             node->value == ".OpenGNEL.pwd" || node->value == ".opengnel.pwd") {
        char cwd[1024];
        if (getcwd(cwd, sizeof(cwd)) != nullptr) {
            std::cout << cwd << std::endl;
        }
    }
    else if (node->value == ".GNEL.ls" || node->value == ".gnel.ls" ||
             node->value == ".OpenGNEL.ls" || node->value == ".opengnel.ls") {
        std::string path = ".";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                path = std::get<std::string>(v);
            }
        }
        std::string cmd = "ls -la " + path;
        system(cmd.c_str());
    }
    else if (node->value == ".GNEL.cat" || node->value == ".gnel.cat" ||
             node->value == ".OpenGNEL.cat" || node->value == ".opengnel.cat") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string file = std::get<std::string>(v);
                std::ifstream f(file);
                if (f.is_open()) {
                    std::cout << f.rdbuf() << std::endl;
                    f.close();
                } else {
                    std::cout << "[GNEL] Error: Cannot read " << file << std::endl;
                }
            }
        }
    }
    else if (node->value == ".GNEL.echo" || node->value == ".gnel.echo" ||
             node->value == ".OpenGNEL.echo" || node->value == ".opengnel.echo") {
        for (auto& arg : node->children) {
            Value v = evaluateExpression(arg);
            if (std::holds_alternative<std::string>(v)) {
                std::cout << std::get<std::string>(v) << " ";
            } else if (std::holds_alternative<int>(v)) {
                std::cout << std::get<int>(v) << " ";
            }
        }
        std::cout << std::endl;
    }
    else if (node->value == ".GNEL.mkdir" || node->value == ".gnel.mkdir" ||
             node->value == ".OpenGNEL.mkdir" || node->value == ".opengnel.mkdir") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string dir = std::get<std::string>(v);
                std::string cmd = "mkdir -p " + dir;
                if (system(cmd.c_str()) == 0) {
                    std::cout << "[GNEL] Created: " << dir << std::endl;
                }
            }
        }
    }
    else if (node->value == ".GNEL.rm" || node->value == ".gnel.rm" ||
             node->value == ".OpenGNEL.rm" || node->value == ".opengnel.rm") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string file = std::get<std::string>(v);
                if (remove(file.c_str()) == 0) {
                    std::cout << "[GNEL] Removed: " << file << std::endl;
                } else {
                    std::cout << "[GNEL] Error: Cannot remove " << file << std::endl;
                }
            }
        }
    }
    else if (node->value == ".GNEL.cp" || node->value == ".gnel.cp" ||
             node->value == ".OpenGNEL.cp" || node->value == ".opengnel.cp") {
        if (node->children.size() >= 2) {
            Value src = evaluateExpression(node->children[0]);
            Value dst = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(src) && std::holds_alternative<std::string>(dst)) {
                std::string cmd = "cp " + std::get<std::string>(src) + " " + std::get<std::string>(dst);
                if (system(cmd.c_str()) == 0) {
                    std::cout << "[GNEL] Copied: " << std::get<std::string>(src) << " -> " << std::get<std::string>(dst) << std::endl;
                }
            }
        }
    }
    else if (node->value == ".GNEL.mv" || node->value == ".gnel.mv" ||
             node->value == ".OpenGNEL.mv" || node->value == ".opengnel.mv") {
        if (node->children.size() >= 2) {
            Value src = evaluateExpression(node->children[0]);
            Value dst = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(src) && std::holds_alternative<std::string>(dst)) {
                std::string cmd = "mv " + std::get<std::string>(src) + " " + std::get<std::string>(dst);
                if (system(cmd.c_str()) == 0) {
                    std::cout << "[GNEL] Moved: " << std::get<std::string>(src) << " -> " << std::get<std::string>(dst) << std::endl;
                }
            }
        }
    }
    else if (node->value == ".GNEL.env" || node->value == ".gnel.env" ||
             node->value == ".OpenGNEL.env" || node->value == ".opengnel.env") {
        if (node->children.size() >= 2) {
            Value name = evaluateExpression(node->children[0]);
            Value val = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(name) && std::holds_alternative<std::string>(val)) {
                std::string n = std::get<std::string>(name);
                std::string v = std::get<std::string>(val);
                gnelEnvVars[n] = v;
                setenv(n.c_str(), v.c_str(), 1);
                std::cout << "[GNEL] Set " << n << "=" << v << std::endl;
            }
        }
    }
    else if (node->value == ".GNEL.getenv" || node->value == ".gnel.getenv" ||
             node->value == ".OpenGNEL.getenv" || node->value == ".opengnel.getenv") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string name = std::get<std::string>(v);
                char* val = getenv(name.c_str());
                if (val != nullptr) {
                    std::cout << name << "=" << val << std::endl;
                } else if (gnelEnvVars.find(name) != gnelEnvVars.end()) {
                    std::cout << name << "=" << gnelEnvVars[name] << std::endl;
                } else {
                    std::cout << name << " is not set" << std::endl;
                }
            }
        }
    }
    else if (node->value == ".GNEL.alias" || node->value == ".gnel.alias" ||
             node->value == ".OpenGNEL.alias" || node->value == ".opengnel.alias") {
        if (node->children.size() >= 2) {
            Value name = evaluateExpression(node->children[0]);
            Value cmd = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(name) && std::holds_alternative<std::string>(cmd)) {
                std::string n = std::get<std::string>(name);
                std::string c = std::get<std::string>(cmd);
                gnelAliases[n] = c;
                std::cout << "[GNEL] Alias: " << n << " = " << c << std::endl;
            }
        } else if (node->children.empty()) {
            // Show all aliases
            std::cout << "[GNEL] Aliases:" << std::endl;
            for (auto& a : gnelAliases) {
                std::cout << "  " << a.first << " = " << a.second << std::endl;
            }
        }
    }
    else if (node->value == ".GNEL.hist" || node->value == ".gnel.hist" ||
             node->value == ".OpenGNEL.hist" || node->value == ".opengnel.hist") {
        std::cout << "[GNEL] Command History:" << std::endl;
        int i = 1;
        for (auto& cmd : gnelHistory) {
            std::cout << "  " << i++ << ": " << cmd << std::endl;
        }
    }
    else if (node->value == ".GNEL.pipe" || node->value == ".gnel.pipe" ||
             node->value == ".OpenGNEL.pipe" || node->value == ".opengnel.pipe") {
        if (node->children.size() >= 2) {
            std::string pipeline = "";
            for (size_t i = 0; i < node->children.size(); i++) {
                Value v = evaluateExpression(node->children[i]);
                if (std::holds_alternative<std::string>(v)) {
                    if (i > 0) pipeline += " | ";
                    pipeline += std::get<std::string>(v);
                }
            }
            gnelHistory.push_back(pipeline);
            std::cout << "[GNEL] $ " << pipeline << std::endl;
            system(pipeline.c_str());
        }
    }
    else if (node->value == ".GNEL.script" || node->value == ".gnel.script" ||
             node->value == ".OpenGNEL.script" || node->value == ".opengnel.script") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string file = std::get<std::string>(v);
                std::string cmd = "bash " + file;
                std::cout << "[GNEL] Running script: " << file << std::endl;
                system(cmd.c_str());
            }
        }
    }
    else if (node->value == ".GNEL.save" || node->value == ".gnel.save" ||
             node->value == ".OpenGNEL.save" || node->value == ".opengnel.save") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string file = std::get<std::string>(v);
                std::ofstream f(file);
                f << "#!/bin/bash\n";
                f << "# Generated by OpenGNEL\n\n";
                for (auto& cmd : gnelHistory) {
                    f << cmd << "\n";
                }
                f.close();
                std::cout << "[GNEL] Script saved to: " << file << std::endl;
            }
        }
    }
    else if (node->value == ".GNEL.touch" || node->value == ".gnel.touch" ||
             node->value == ".OpenGNEL.touch" || node->value == ".opengnel.touch") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string file = std::get<std::string>(v);
                std::ofstream f(file, std::ios::app);
                f.close();
                std::cout << "[GNEL] Created: " << file << std::endl;
            }
        }
    }
    else if (node->value == ".GNEL.grep" || node->value == ".gnel.grep" ||
             node->value == ".OpenGNEL.grep" || node->value == ".opengnel.grep") {
        if (node->children.size() >= 2) {
            Value pattern = evaluateExpression(node->children[0]);
            Value file = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(pattern) && std::holds_alternative<std::string>(file)) {
                std::string cmd = "grep '" + std::get<std::string>(pattern) + "' " + std::get<std::string>(file);
                system(cmd.c_str());
            }
        }
    }
    else if (node->value == ".GNEL.find" || node->value == ".gnel.find" ||
             node->value == ".OpenGNEL.find" || node->value == ".opengnel.find") {
        std::string path = ".";
        std::string name = "*";
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) name = std::get<std::string>(v);
        }
        if (node->children.size() >= 2) {
            Value v = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(v)) path = std::get<std::string>(v);
        }
        std::string cmd = "find " + path + " -name '" + name + "'";
        system(cmd.c_str());
    }
    else if (node->value == ".GNEL.wc" || node->value == ".gnel.wc" ||
             node->value == ".OpenGNEL.wc" || node->value == ".opengnel.wc") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(v)) {
                std::string cmd = "wc " + std::get<std::string>(v);
                system(cmd.c_str());
            }
        }
    }
    else if (node->value == ".GNEL.head" || node->value == ".gnel.head" ||
             node->value == ".OpenGNEL.head" || node->value == ".opengnel.head") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            int lines = 10;
            if (node->children.size() >= 2) {
                Value n = evaluateExpression(node->children[1]);
                if (std::holds_alternative<int>(n)) lines = std::get<int>(n);
            }
            if (std::holds_alternative<std::string>(v)) {
                std::string cmd = "head -n " + std::to_string(lines) + " " + std::get<std::string>(v);
                system(cmd.c_str());
            }
        }
    }
    else if (node->value == ".GNEL.tail" || node->value == ".gnel.tail" ||
             node->value == ".OpenGNEL.tail" || node->value == ".opengnel.tail") {
        if (!node->children.empty()) {
            Value v = evaluateExpression(node->children[0]);
            int lines = 10;
            if (node->children.size() >= 2) {
                Value n = evaluateExpression(node->children[1]);
                if (std::holds_alternative<int>(n)) lines = std::get<int>(n);
            }
            if (std::holds_alternative<std::string>(v)) {
                std::string cmd = "tail -n " + std::to_string(lines) + " " + std::get<std::string>(v);
                system(cmd.c_str());
            }
        }
    }
    // Math Functions - .Module.function syntax with actual calculations
    else if (node->value == ".Math.sqrt" || node->value == ".math.sqrt" ||
             node->value == "Math.sqrt" || node->value == "math.sqrt") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double num = 0;
            if (std::holds_alternative<int>(val)) num = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) num = std::get<double>(val);
            double result = std::sqrt(num);
            std::cout << result << std::endl;
            // Store result if there's a target variable
            if (node->children.size() >= 2) {
                variables[node->children[1]->value] = result;
            }
        }
    } else if (node->value == ".Math.pow" || node->value == ".math.pow" ||
               node->value == "Math.pow" || node->value == "math.pow") {
        if (node->children.size() >= 2) {
            Value base = evaluateExpression(node->children[0]);
            Value exp = evaluateExpression(node->children[1]);
            double b = 0, e = 0;
            if (std::holds_alternative<int>(base)) b = std::get<int>(base);
            else if (std::holds_alternative<double>(base)) b = std::get<double>(base);
            if (std::holds_alternative<int>(exp)) e = std::get<int>(exp);
            else if (std::holds_alternative<double>(exp)) e = std::get<double>(exp);
            std::cout << std::pow(b, e) << std::endl;
        }
    } else if (node->value == ".Math.sin" || node->value == ".math.sin" ||
               node->value == "Math.sin" || node->value == "math.sin") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double num = 0;
            if (std::holds_alternative<int>(val)) num = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) num = std::get<double>(val);
            std::cout << std::sin(num) << std::endl;
        }
    } else if (node->value == ".Math.cos" || node->value == ".math.cos" ||
               node->value == "Math.cos" || node->value == "math.cos") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double num = 0;
            if (std::holds_alternative<int>(val)) num = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) num = std::get<double>(val);
            std::cout << std::cos(num) << std::endl;
        }
    } else if (node->value == ".Math.abs" || node->value == ".math.abs" ||
               node->value == "Math.abs" || node->value == "math.abs") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            if (std::holds_alternative<int>(val)) std::cout << std::abs(std::get<int>(val)) << std::endl;
            else if (std::holds_alternative<double>(val)) std::cout << std::abs(std::get<double>(val)) << std::endl;
        }
    } else if (node->value == ".Math.floor" || node->value == ".math.floor" ||
               node->value == "Math.floor" || node->value == "math.floor") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double num = 0;
            if (std::holds_alternative<int>(val)) num = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) num = std::get<double>(val);
            std::cout << std::floor(num) << std::endl;
        }
    } else if (node->value == ".Math.ceil" || node->value == ".math.ceil" ||
               node->value == "Math.ceil" || node->value == "math.ceil") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double num = 0;
            if (std::holds_alternative<int>(val)) num = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) num = std::get<double>(val);
            std::cout << std::ceil(num) << std::endl;
        }
    } else if (node->value == ".Math.round" || node->value == ".math.round" ||
               node->value == "Math.round" || node->value == "math.round") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double num = 0;
            if (std::holds_alternative<int>(val)) num = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) num = std::get<double>(val);
            std::cout << std::round(num) << std::endl;
        }
    } else if (node->value == ".Math.rand" || node->value == ".math.rand" ||
               node->value == "Math.rand" || node->value == "math.rand") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            int max = 100;
            if (std::holds_alternative<int>(val)) max = std::get<int>(val);
            std::cout << (rand() % max) << std::endl;
        } else {
            std::cout << (rand() % 100) << std::endl;
        }
    } else if (node->value == ".Math.pi" || node->value == ".math.pi" ||
               node->value == "Math.pi" || node->value == "math.pi") {
        std::cout << 3.14159265359 << std::endl;
    }
    // Graphics Functions
    else if (node->value == ".Graphics.draw" || node->value == ".gfx.draw" ||
             node->value == "Graphics.draw" || node->value == "gfx.draw") {
        std::cout << "[GFX] Draw called" << std::endl;
    } else if (node->value == ".Graphics.circle" || node->value == ".gfx.circle" ||
               node->value == "Graphics.circle" || node->value == "gfx.circle") {
        if (node->children.size() >= 3) {
            std::cout << "[GFX] Circle at (" << node->children[0]->value << "," << node->children[1]->value << ") r=" << node->children[2]->value << std::endl;
        }
    } else if (node->value == ".Graphics.rect" || node->value == ".gfx.rect" ||
               node->value == "Graphics.rect" || node->value == "gfx.rect") {
        std::cout << "[GFX] Rectangle drawn" << std::endl;
    } else if (node->value == ".Graphics.line" || node->value == ".gfx.line" ||
               node->value == "Graphics.line" || node->value == "gfx.line") {
        std::cout << "[GFX] Line drawn" << std::endl;
    }
    // File Functions
    else if (node->value == ".File.read" || node->value == ".file.read" ||
             node->value == "File.read" || node->value == "file.read") {
        if (!node->children.empty()) {
            Value path = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(path)) {
                std::cout << "[FILE] Reading: " << std::get<std::string>(path) << std::endl;
            }
        }
    } else if (node->value == ".File.write" || node->value == ".file.write" ||
               node->value == "File.write" || node->value == "file.write") {
        if (node->children.size() >= 2) {
            Value path = evaluateExpression(node->children[0]);
            Value content = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(path)) {
                std::cout << "[FILE] Writing to: " << std::get<std::string>(path) << std::endl;
            }
        }
    }
    // Network Functions
    else if (node->value == ".Network.http" || node->value == ".net.http" ||
             node->value == "Network.http" || node->value == "net.http") {
        if (!node->children.empty()) {
            Value url = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(url)) {
                std::cout << "[NET] HTTP request to: " << std::get<std::string>(url) << std::endl;
            }
        }
    } else if (node->value == ".Network.connect" || node->value == ".net.connect" ||
               node->value == "Network.connect" || node->value == "net.connect") {
        std::cout << "[NET] Connection established" << std::endl;
    }
    // Console Functions
    else if (node->value == ".Console.clear" || node->value == ".console.clear" ||
             node->value == "Console.clear" || node->value == "console.clear") {
        std::cout << "\033[2J\033[H"; // ANSI clear screen
    } else if (node->value == ".Console.color" || node->value == ".console.color" ||
               node->value == "Console.color" || node->value == "console.color") {
        // Set console color (simplified)
        std::cout << "[CONSOLE] Color changed" << std::endl;
    }
    // String Functions
    else if (node->value == ".String.upper" || node->value == ".string.upper" ||
             node->value == "String.upper" || node->value == "string.upper") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                for (auto& c : s) c = std::toupper(c);
                std::cout << s << std::endl;
            }
        }
    } else if (node->value == ".String.lower" || node->value == ".string.lower" ||
               node->value == "String.lower" || node->value == "string.lower") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                for (auto& c : s) c = std::tolower(c);
                std::cout << s << std::endl;
            }
        }
    } else if (node->value == ".String.len" || node->value == ".string.len" ||
               node->value == "String.len" || node->value == "string.len") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(val)) {
                std::cout << std::get<std::string>(val).length() << std::endl;
            }
        }
    }
    // Additional String Functions
    else if (node->value == ".String.trim" || node->value == ".string.trim" ||
             node->value == "String.trim" || node->value == "string.trim") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                size_t start = s.find_first_not_of(" \t\n\r");
                size_t end = s.find_last_not_of(" \t\n\r");
                if (start != std::string::npos) {
                    std::cout << s.substr(start, end - start + 1) << std::endl;
                } else {
                    std::cout << "" << std::endl;
                }
            }
        }
    } else if (node->value == ".String.rev" || node->value == ".string.rev" ||
               node->value == "String.rev" || node->value == "string.rev") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                std::reverse(s.begin(), s.end());
                std::cout << s << std::endl;
            }
        }
    } else if (node->value == ".String.sub" || node->value == ".string.sub" ||
               node->value == "String.sub" || node->value == "string.sub") {
        if (node->children.size() >= 3) {
            Value val = evaluateExpression(node->children[0]);
            Value startVal = evaluateExpression(node->children[1]);
            Value lenVal = evaluateExpression(node->children[2]);
            if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                int start = std::holds_alternative<int>(startVal) ? std::get<int>(startVal) : 0;
                int len = std::holds_alternative<int>(lenVal) ? std::get<int>(lenVal) : s.length();
                if (start >= 0 && start < (int)s.length()) {
                    std::cout << s.substr(start, len) << std::endl;
                }
            }
        }
    } else if (node->value == ".String.rep" || node->value == ".string.rep" ||
               node->value == "String.rep" || node->value == "string.rep") {
        if (node->children.size() >= 2) {
            Value val = evaluateExpression(node->children[0]);
            Value countVal = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                int count = std::holds_alternative<int>(countVal) ? std::get<int>(countVal) : 1;
                std::string result;
                for (int i = 0; i < count; i++) result += s;
                std::cout << result << std::endl;
            }
        }
    } else if (node->value == ".String.has" || node->value == ".string.has" ||
               node->value == "String.has" || node->value == "string.has") {
        if (node->children.size() >= 2) {
            Value val = evaluateExpression(node->children[0]);
            Value searchVal = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(val) && std::holds_alternative<std::string>(searchVal)) {
                std::string s = std::get<std::string>(val);
                std::string search = std::get<std::string>(searchVal);
                std::cout << (s.find(search) != std::string::npos ? "true" : "false") << std::endl;
            }
        }
    } else if (node->value == ".String.idx" || node->value == ".string.idx" ||
               node->value == "String.idx" || node->value == "string.idx") {
        if (node->children.size() >= 2) {
            Value val = evaluateExpression(node->children[0]);
            Value searchVal = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(val) && std::holds_alternative<std::string>(searchVal)) {
                std::string s = std::get<std::string>(val);
                std::string search = std::get<std::string>(searchVal);
                size_t pos = s.find(search);
                std::cout << (pos != std::string::npos ? (int)pos : -1) << std::endl;
            }
        }
    } else if (node->value == ".String.split" || node->value == ".string.split" ||
               node->value == "String.split" || node->value == "string.split") {
        if (node->children.size() >= 2) {
            Value val = evaluateExpression(node->children[0]);
            Value delimVal = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(val) && std::holds_alternative<std::string>(delimVal)) {
                std::string s = std::get<std::string>(val);
                std::string delim = std::get<std::string>(delimVal);
                size_t pos = 0;
                std::cout << "[";
                bool first = true;
                while ((pos = s.find(delim)) != std::string::npos) {
                    if (!first) std::cout << ", ";
                    std::cout << "'" << s.substr(0, pos) << "'";
                    s.erase(0, pos + delim.length());
                    first = false;
                }
                if (!first) std::cout << ", ";
                std::cout << "'" << s << "']" << std::endl;
            }
        }
    }
    // Time Functions
    else if (node->value == ".Time.now" || node->value == ".time.now" ||
             node->value == "Time.now" || node->value == "time.now") {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        std::cout << std::ctime(&time);
    } else if (node->value == ".Time.unix" || node->value == ".time.unix" ||
               node->value == "Time.unix" || node->value == "time.unix") {
        auto now = std::chrono::system_clock::now();
        auto epoch = now.time_since_epoch();
        auto seconds = std::chrono::duration_cast<std::chrono::seconds>(epoch);
        std::cout << seconds.count() << std::endl;
    } else if (node->value == ".Time.ms" || node->value == ".time.ms" ||
               node->value == "Time.ms" || node->value == "time.ms") {
        auto now = std::chrono::system_clock::now();
        auto epoch = now.time_since_epoch();
        auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(epoch);
        std::cout << ms.count() << std::endl;
    } else if (node->value == ".Time.year" || node->value == ".time.year" ||
               node->value == "Time.year" || node->value == "time.year") {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        auto tm = *std::localtime(&time);
        std::cout << (tm.tm_year + 1900) << std::endl;
    } else if (node->value == ".Time.month" || node->value == ".time.month" ||
               node->value == "Time.month" || node->value == "time.month") {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        auto tm = *std::localtime(&time);
        std::cout << (tm.tm_mon + 1) << std::endl;
    } else if (node->value == ".Time.day" || node->value == ".time.day" ||
               node->value == "Time.day" || node->value == "time.day") {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        auto tm = *std::localtime(&time);
        std::cout << tm.tm_mday << std::endl;
    } else if (node->value == ".Time.hour" || node->value == ".time.hour" ||
               node->value == "Time.hour" || node->value == "time.hour") {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        auto tm = *std::localtime(&time);
        std::cout << tm.tm_hour << std::endl;
    } else if (node->value == ".Time.min" || node->value == ".time.min" ||
               node->value == "Time.min" || node->value == "time.min") {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        auto tm = *std::localtime(&time);
        std::cout << tm.tm_min << std::endl;
    } else if (node->value == ".Time.sec" || node->value == ".time.sec" ||
               node->value == "Time.sec" || node->value == "time.sec") {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        auto tm = *std::localtime(&time);
        std::cout << tm.tm_sec << std::endl;
    }
    // Array Functions
    else if (node->value == ".Array.new" || node->value == ".array.new" ||
             node->value == "Array.new" || node->value == "array.new") {
        std::cout << "[]" << std::endl;
    } else if (node->value == ".Array.len" || node->value == ".array.len" ||
               node->value == "Array.len" || node->value == "array.len") {
        if (!node->children.empty()) {
            std::cout << node->children.size() << std::endl;
        } else {
            std::cout << "0" << std::endl;
        }
    } else if (node->value == ".Array.join" || node->value == ".array.join" ||
               node->value == "Array.join" || node->value == "array.join") {
        if (node->children.size() >= 2) {
            Value delimVal = evaluateExpression(node->children[node->children.size() - 1]);
            std::string delim = std::holds_alternative<std::string>(delimVal) ? std::get<std::string>(delimVal) : ",";
            std::string result;
            for (size_t i = 0; i < node->children.size() - 1; i++) {
                if (i > 0) result += delim;
                Value v = evaluateExpression(node->children[i]);
                if (std::holds_alternative<std::string>(v)) result += std::get<std::string>(v);
                else if (std::holds_alternative<int>(v)) result += std::to_string(std::get<int>(v));
                else if (std::holds_alternative<double>(v)) result += std::to_string(std::get<double>(v));
            }
            std::cout << result << std::endl;
        }
    }
    // System Functions
    else if (node->value == ".Sys.os" || node->value == ".sys.os" ||
             node->value == "Sys.os" || node->value == "sys.os") {
        #ifdef _WIN32
        std::cout << "windows" << std::endl;
        #elif __APPLE__
        std::cout << "macos" << std::endl;
        #elif __linux__
        std::cout << "linux" << std::endl;
        #else
        std::cout << "unknown" << std::endl;
        #endif
    } else if (node->value == ".Sys.arch" || node->value == ".sys.arch" ||
               node->value == "Sys.arch" || node->value == "sys.arch") {
        #if defined(__x86_64__) || defined(_M_X64)
        std::cout << "x64" << std::endl;
        #elif defined(__i386) || defined(_M_IX86)
        std::cout << "x86" << std::endl;
        #elif defined(__aarch64__) || defined(_M_ARM64)
        std::cout << "arm64" << std::endl;
        #elif defined(__arm__) || defined(_M_ARM)
        std::cout << "arm" << std::endl;
        #else
        std::cout << "unknown" << std::endl;
        #endif
    } else if (node->value == ".Sys.env" || node->value == ".sys.env" ||
               node->value == "Sys.env" || node->value == "sys.env") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(val)) {
                const char* env = std::getenv(std::get<std::string>(val).c_str());
                std::cout << (env ? env : "") << std::endl;
            }
        }
    } else if (node->value == ".Sys.exit" || node->value == ".sys.exit" ||
               node->value == "Sys.exit" || node->value == "sys.exit") {
        int code = 0;
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            if (std::holds_alternative<int>(val)) code = std::get<int>(val);
        }
        std::exit(code);
    } else if (node->value == ".Sys.sleep" || node->value == ".sys.sleep" ||
               node->value == "Sys.sleep" || node->value == "sys.sleep") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            int ms = 0;
            if (std::holds_alternative<int>(val)) ms = std::get<int>(val);
            std::this_thread::sleep_for(std::chrono::milliseconds(ms));
        }
    }
    // More Math Functions
    else if (node->value == ".Math.tan" || node->value == ".math.tan" ||
             node->value == "Math.tan" || node->value == "math.tan") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double num = 0;
            if (std::holds_alternative<int>(val)) num = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) num = std::get<double>(val);
            std::cout << std::tan(num) << std::endl;
        }
    } else if (node->value == ".Math.log" || node->value == ".math.log" ||
               node->value == "Math.log" || node->value == "math.log") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double num = 0;
            if (std::holds_alternative<int>(val)) num = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) num = std::get<double>(val);
            std::cout << std::log(num) << std::endl;
        }
    } else if (node->value == ".Math.log10" || node->value == ".math.log10" ||
               node->value == "Math.log10" || node->value == "math.log10") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double num = 0;
            if (std::holds_alternative<int>(val)) num = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) num = std::get<double>(val);
            std::cout << std::log10(num) << std::endl;
        }
    } else if (node->value == ".Math.exp" || node->value == ".math.exp" ||
               node->value == "Math.exp" || node->value == "math.exp") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double num = 0;
            if (std::holds_alternative<int>(val)) num = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) num = std::get<double>(val);
            std::cout << std::exp(num) << std::endl;
        }
    } else if (node->value == ".Math.min" || node->value == ".math.min" ||
               node->value == "Math.min" || node->value == "math.min") {
        if (node->children.size() >= 2) {
            Value a = evaluateExpression(node->children[0]);
            Value b = evaluateExpression(node->children[1]);
            double va = 0, vb = 0;
            if (std::holds_alternative<int>(a)) va = std::get<int>(a);
            else if (std::holds_alternative<double>(a)) va = std::get<double>(a);
            if (std::holds_alternative<int>(b)) vb = std::get<int>(b);
            else if (std::holds_alternative<double>(b)) vb = std::get<double>(b);
            std::cout << std::min(va, vb) << std::endl;
        }
    } else if (node->value == ".Math.max" || node->value == ".math.max" ||
               node->value == "Math.max" || node->value == "math.max") {
        if (node->children.size() >= 2) {
            Value a = evaluateExpression(node->children[0]);
            Value b = evaluateExpression(node->children[1]);
            double va = 0, vb = 0;
            if (std::holds_alternative<int>(a)) va = std::get<int>(a);
            else if (std::holds_alternative<double>(a)) va = std::get<double>(a);
            if (std::holds_alternative<int>(b)) vb = std::get<int>(b);
            else if (std::holds_alternative<double>(b)) vb = std::get<double>(b);
            std::cout << std::max(va, vb) << std::endl;
        }
    } else if (node->value == ".Math.mod" || node->value == ".math.mod" ||
               node->value == "Math.mod" || node->value == "math.mod") {
        if (node->children.size() >= 2) {
            Value a = evaluateExpression(node->children[0]);
            Value b = evaluateExpression(node->children[1]);
            int va = 0, vb = 1;
            if (std::holds_alternative<int>(a)) va = std::get<int>(a);
            if (std::holds_alternative<int>(b)) vb = std::get<int>(b);
            std::cout << (vb != 0 ? va % vb : 0) << std::endl;
        }
    } else if (node->value == ".Math.e" || node->value == ".math.e" ||
               node->value == "Math.e" || node->value == "math.e") {
        std::cout << 2.71828182846 << std::endl;
    }
    else if (functions.find(node->value) != functions.end()) {
        auto func = functions[node->value];
        for (auto& child : func->children) {
            executeNode(child);
        }
    }
    // Math operations: add, sub, mul, div
    else if (node->value == "add" || node->value == "sub" || node->value == "mul" || node->value == "div") {
        if (node->children.size() >= 2) {
            std::string varName = node->children[0]->value;
            Value val = evaluateExpression(node->children[1]);
            double operand = 0;
            if (std::holds_alternative<int>(val)) operand = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) operand = std::get<double>(val);
            
            double current = 0;
            if (variables.find(varName) != variables.end()) {
                Value cv = variables[varName];
                if (std::holds_alternative<int>(cv)) current = std::get<int>(cv);
                else if (std::holds_alternative<double>(cv)) current = std::get<double>(cv);
            }
            
            double result = 0;
            if (node->value == "add") result = current + operand;
            else if (node->value == "sub") result = current - operand;
            else if (node->value == "mul") result = current * operand;
            else if (node->value == "div") result = (operand != 0) ? current / operand : 0;
            
            variables[varName] = result;
        }
    }
    // rand - random number
    else if (node->value == "rand") {
        if (node->children.size() >= 2) {
            std::string varName = node->children[0]->value;
            Value maxVal = evaluateExpression(node->children[1]);
            int maxNum = 100;
            if (std::holds_alternative<int>(maxVal)) maxNum = std::get<int>(maxVal);
            variables[varName] = rand() % maxNum;
        }
    }
    // len - string length
    else if (node->value == "len") {
        if (node->children.size() >= 2) {
            std::string varName = node->children[0]->value;
            Value strVal = evaluateExpression(node->children[1]);
            if (std::holds_alternative<std::string>(strVal)) {
                variables[varName] = static_cast<int>(std::get<std::string>(strVal).length());
            }
        }
    }
    // wait - delay (simulated)
    else if (node->value == "wait") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            int ms = 0;
            if (std::holds_alternative<int>(val)) ms = std::get<int>(val);
            std::cout << "[WAIT] " << ms << "ms" << std::endl;
        }
    }
    // msg - message output
    else if (node->value == "msg") {
        std::cout << "[MSG] ";
        for (auto& arg : node->children) {
            Value val = evaluateExpression(arg);
            if (std::holds_alternative<std::string>(val)) {
                std::cout << std::get<std::string>(val);
            }
        }
        std::cout << std::endl;
    }
    // gmath - built-in auto math function: gmath (a) + (b), gmath (a) - (b), etc.
    else if (node->value == "gmath") {
        if (node->children.size() >= 3) {
            Value left = evaluateExpression(node->children[0]);
            std::string op = node->children[1]->value;
            Value right = evaluateExpression(node->children[2]);
            
            double a = 0, b = 0;
            if (std::holds_alternative<int>(left)) a = std::get<int>(left);
            else if (std::holds_alternative<double>(left)) a = std::get<double>(left);
            if (std::holds_alternative<int>(right)) b = std::get<int>(right);
            else if (std::holds_alternative<double>(right)) b = std::get<double>(right);
            
            double result = 0;
            if (op == "+") result = a + b;
            else if (op == "-") result = a - b;
            else if (op == "*") result = a * b;
            else if (op == "/") result = (b != 0) ? a / b : 0;
            else if (op == "%") result = (b != 0) ? fmod(a, b) : 0;
            else if (op == "^") result = std::pow(a, b);
            
            std::cout << result << std::endl;
            
            // Store result if there's a target variable
            if (node->children.size() >= 4) {
                variables[node->children[3]->value] = result;
            }
        } else if (node->children.size() == 2) {
            // Unary operations: gmath - (a), gmath sqrt (a)
            std::string op = node->children[0]->value;
            Value val = evaluateExpression(node->children[1]);
            double a = 0;
            if (std::holds_alternative<int>(val)) a = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) a = std::get<double>(val);
            
            double result = 0;
            if (op == "-") result = -a;
            else if (op == "sqrt") result = std::sqrt(a);
            else if (op == "abs") result = std::abs(a);
            else if (op == "sin") result = std::sin(a);
            else if (op == "cos") result = std::cos(a);
            else if (op == "tan") result = std::tan(a);
            else if (op == "log") result = std::log(a);
            else if (op == "exp") result = std::exp(a);
            else if (op == "floor") result = std::floor(a);
            else if (op == "ceil") result = std::ceil(a);
            else if (op == "round") result = std::round(a);
            
            std::cout << result << std::endl;
        }
    }
    // Unit conversion: gmath -C (value) 'from' 'to'
    else if (node->value == "gmath.convert" || node->value == ".Math.convert") {
        if (node->children.size() >= 3) {
            Value valNode = evaluateExpression(node->children[0]);
            double value = 0;
            if (std::holds_alternative<int>(valNode)) value = std::get<int>(valNode);
            else if (std::holds_alternative<double>(valNode)) value = std::get<double>(valNode);
            
            std::string fromUnit = "";
            std::string toUnit = "";
            if (std::holds_alternative<std::string>(evaluateExpression(node->children[1]))) {
                fromUnit = std::get<std::string>(evaluateExpression(node->children[1]));
            }
            if (std::holds_alternative<std::string>(evaluateExpression(node->children[2]))) {
                toUnit = std::get<std::string>(evaluateExpression(node->children[2]));
            }
            
            // Convert to lowercase for comparison
            for (auto& c : fromUnit) c = std::tolower(c);
            for (auto& c : toUnit) c = std::tolower(c);
            
            double result = value;
            
            // Length conversions (base: meters)
            std::map<std::string, double> lengthToMeters = {
                {"m", 1.0}, {"meter", 1.0}, {"meters", 1.0},
                {"km", 1000.0}, {"kilometer", 1000.0}, {"kilometers", 1000.0},
                {"cm", 0.01}, {"centimeter", 0.01}, {"centimeters", 0.01},
                {"mm", 0.001}, {"millimeter", 0.001}, {"millimeters", 0.001},
                {"mi", 1609.344}, {"mile", 1609.344}, {"miles", 1609.344},
                {"yd", 0.9144}, {"yard", 0.9144}, {"yards", 0.9144},
                {"ft", 0.3048}, {"foot", 0.3048}, {"feet", 0.3048},
                {"in", 0.0254}, {"inch", 0.0254}, {"inches", 0.0254},
                {"nm", 1852.0}, {"nautical", 1852.0}, {"nauticalmile", 1852.0},
                {"um", 0.000001}, {"micrometer", 0.000001}, {"micrometers", 0.000001},
                {"ly", 9.461e15}, {"lightyear", 9.461e15}, {"lightyears", 9.461e15}
            };
            
            // Weight/Mass conversions (base: kilograms)
            std::map<std::string, double> weightToKg = {
                {"kg", 1.0}, {"kilogram", 1.0}, {"kilograms", 1.0},
                {"g", 0.001}, {"gram", 0.001}, {"grams", 0.001},
                {"mg", 0.000001}, {"milligram", 0.000001}, {"milligrams", 0.000001},
                {"lb", 0.453592}, {"pound", 0.453592}, {"pounds", 0.453592},
                {"oz", 0.0283495}, {"ounce", 0.0283495}, {"ounces", 0.0283495},
                {"t", 1000.0}, {"ton", 1000.0}, {"tons", 1000.0}, {"tonne", 1000.0},
                {"st", 6.35029}, {"stone", 6.35029}, {"stones", 6.35029}
            };
            
            // Time conversions (base: seconds)
            std::map<std::string, double> timeToSec = {
                {"s", 1.0}, {"sec", 1.0}, {"second", 1.0}, {"seconds", 1.0},
                {"ms", 0.001}, {"millisecond", 0.001}, {"milliseconds", 0.001},
                {"us", 0.000001}, {"microsecond", 0.000001}, {"microseconds", 0.000001},
                {"ns", 0.000000001}, {"nanosecond", 0.000000001}, {"nanoseconds", 0.000000001},
                {"min", 60.0}, {"minute", 60.0}, {"minutes", 60.0},
                {"h", 3600.0}, {"hr", 3600.0}, {"hour", 3600.0}, {"hours", 3600.0},
                {"d", 86400.0}, {"day", 86400.0}, {"days", 86400.0},
                {"w", 604800.0}, {"week", 604800.0}, {"weeks", 604800.0},
                {"mo", 2592000.0}, {"month", 2592000.0}, {"months", 2592000.0},
                {"y", 31536000.0}, {"yr", 31536000.0}, {"year", 31536000.0}, {"years", 31536000.0}
            };
            
            // Data/Storage conversions (base: bytes)
            std::map<std::string, double> dataToBytes = {
                {"b", 1.0}, {"byte", 1.0}, {"bytes", 1.0},
                {"kb", 1024.0}, {"kilobyte", 1024.0}, {"kilobytes", 1024.0},
                {"mb", 1048576.0}, {"megabyte", 1048576.0}, {"megabytes", 1048576.0},
                {"gb", 1073741824.0}, {"gigabyte", 1073741824.0}, {"gigabytes", 1073741824.0},
                {"tb", 1099511627776.0}, {"terabyte", 1099511627776.0}, {"terabytes", 1099511627776.0},
                {"pb", 1125899906842624.0}, {"petabyte", 1125899906842624.0},
                {"bit", 0.125}, {"bits", 0.125},
                {"kbit", 128.0}, {"kilobit", 128.0},
                {"mbit", 131072.0}, {"megabit", 131072.0},
                {"gbit", 134217728.0}, {"gigabit", 134217728.0}
            };
            
            // Speed conversions (base: m/s)
            std::map<std::string, double> speedToMs = {
                {"mps", 1.0}, {"m/s", 1.0},
                {"kmh", 0.277778}, {"kph", 0.277778}, {"km/h", 0.277778},
                {"mph", 0.44704}, {"mi/h", 0.44704},
                {"fps", 0.3048}, {"ft/s", 0.3048},
                {"knot", 0.514444}, {"knots", 0.514444}, {"kn", 0.514444},
                {"mach", 343.0}, {"c", 299792458.0}
            };
            
            // Area conversions (base: square meters)
            std::map<std::string, double> areaToSqm = {
                {"sqm", 1.0}, {"m2", 1.0}, {"sqmeter", 1.0},
                {"sqkm", 1000000.0}, {"km2", 1000000.0},
                {"sqcm", 0.0001}, {"cm2", 0.0001},
                {"sqmm", 0.000001}, {"mm2", 0.000001},
                {"sqmi", 2589988.11}, {"mi2", 2589988.11},
                {"sqyd", 0.836127}, {"yd2", 0.836127},
                {"sqft", 0.092903}, {"ft2", 0.092903},
                {"sqin", 0.00064516}, {"in2", 0.00064516},
                {"ha", 10000.0}, {"hectare", 10000.0}, {"hectares", 10000.0},
                {"acre", 4046.86}, {"acres", 4046.86}
            };
            
            // Volume conversions (base: liters)
            std::map<std::string, double> volumeToL = {
                {"l", 1.0}, {"liter", 1.0}, {"liters", 1.0}, {"litre", 1.0},
                {"ml", 0.001}, {"milliliter", 0.001}, {"milliliters", 0.001},
                {"cl", 0.01}, {"centiliter", 0.01},
                {"dl", 0.1}, {"deciliter", 0.1},
                {"hl", 100.0}, {"hectoliter", 100.0},
                {"m3", 1000.0}, {"cubicmeter", 1000.0},
                {"cm3", 0.001}, {"cubiccm", 0.001}, {"cc", 0.001},
                {"gal", 3.78541}, {"gallon", 3.78541}, {"gallons", 3.78541},
                {"qt", 0.946353}, {"quart", 0.946353}, {"quarts", 0.946353},
                {"pt", 0.473176}, {"pint", 0.473176}, {"pints", 0.473176},
                {"cup", 0.236588}, {"cups", 0.236588},
                {"floz", 0.0295735}, {"oz", 0.0295735},
                {"tbsp", 0.0147868}, {"tablespoon", 0.0147868},
                {"tsp", 0.00492892}, {"teaspoon", 0.00492892}
            };
            
            // Angle conversions (base: radians)
            std::map<std::string, double> angleToRad = {
                {"rad", 1.0}, {"radian", 1.0}, {"radians", 1.0},
                {"deg", 0.0174533}, {"degree", 0.0174533}, {"degrees", 0.0174533},
                {"grad", 0.015708}, {"gradian", 0.015708},
                {"turn", 6.28319}, {"rev", 6.28319}, {"revolution", 6.28319}
            };
            
            // Pressure conversions (base: pascals)
            std::map<std::string, double> pressureToPa = {
                {"pa", 1.0}, {"pascal", 1.0}, {"pascals", 1.0},
                {"kpa", 1000.0}, {"kilopascal", 1000.0},
                {"mpa", 1000000.0}, {"megapascal", 1000000.0},
                {"bar", 100000.0}, {"bars", 100000.0},
                {"mbar", 100.0}, {"millibar", 100.0},
                {"atm", 101325.0}, {"atmosphere", 101325.0},
                {"psi", 6894.76}, {"torr", 133.322}, {"mmhg", 133.322}
            };
            
            // Energy conversions (base: joules)
            std::map<std::string, double> energyToJ = {
                {"j", 1.0}, {"joule", 1.0}, {"joules", 1.0},
                {"kj", 1000.0}, {"kilojoule", 1000.0},
                {"mj", 1000000.0}, {"megajoule", 1000000.0},
                {"cal", 4.184}, {"calorie", 4.184}, {"calories", 4.184},
                {"kcal", 4184.0}, {"kilocalorie", 4184.0},
                {"wh", 3600.0}, {"watthour", 3600.0},
                {"kwh", 3600000.0}, {"kilowatthour", 3600000.0},
                {"ev", 1.60218e-19}, {"electronvolt", 1.60218e-19},
                {"btu", 1055.06}, {"erg", 1e-7}
            };
            
            // Power conversions (base: watts)
            std::map<std::string, double> powerToW = {
                {"w", 1.0}, {"watt", 1.0}, {"watts", 1.0},
                {"kw", 1000.0}, {"kilowatt", 1000.0},
                {"mw", 1000000.0}, {"megawatt", 1000000.0},
                {"gw", 1000000000.0}, {"gigawatt", 1000000000.0},
                {"hp", 745.7}, {"horsepower", 745.7},
                {"ps", 735.499}, {"metrichp", 735.499}
            };
            
            // Frequency conversions (base: hertz)
            std::map<std::string, double> freqToHz = {
                {"hz", 1.0}, {"hertz", 1.0},
                {"khz", 1000.0}, {"kilohertz", 1000.0},
                {"mhz", 1000000.0}, {"megahertz", 1000000.0},
                {"ghz", 1000000000.0}, {"gigahertz", 1000000000.0},
                {"rpm", 0.0166667}, {"bpm", 0.0166667}
            };
            
            // Temperature (special handling)
            bool isTemp = false;
            std::vector<std::string> tempUnits = {"c", "celsius", "f", "fahrenheit", "k", "kelvin"};
            for (const auto& u : tempUnits) {
                if (fromUnit == u || toUnit == u) {
                    isTemp = true;
                    break;
                }
            }
            
            if (isTemp) {
                // Convert to Celsius first
                double celsius = value;
                if (fromUnit == "f" || fromUnit == "fahrenheit") {
                    celsius = (value - 32) * 5.0 / 9.0;
                } else if (fromUnit == "k" || fromUnit == "kelvin") {
                    celsius = value - 273.15;
                }
                // Convert from Celsius to target
                if (toUnit == "f" || toUnit == "fahrenheit") {
                    result = celsius * 9.0 / 5.0 + 32;
                } else if (toUnit == "k" || toUnit == "kelvin") {
                    result = celsius + 273.15;
                } else {
                    result = celsius;
                }
            }
            // Try each conversion category
            else if (lengthToMeters.count(fromUnit) && lengthToMeters.count(toUnit)) {
                result = value * lengthToMeters[fromUnit] / lengthToMeters[toUnit];
            }
            else if (weightToKg.count(fromUnit) && weightToKg.count(toUnit)) {
                result = value * weightToKg[fromUnit] / weightToKg[toUnit];
            }
            else if (timeToSec.count(fromUnit) && timeToSec.count(toUnit)) {
                result = value * timeToSec[fromUnit] / timeToSec[toUnit];
            }
            else if (dataToBytes.count(fromUnit) && dataToBytes.count(toUnit)) {
                result = value * dataToBytes[fromUnit] / dataToBytes[toUnit];
            }
            else if (speedToMs.count(fromUnit) && speedToMs.count(toUnit)) {
                result = value * speedToMs[fromUnit] / speedToMs[toUnit];
            }
            else if (areaToSqm.count(fromUnit) && areaToSqm.count(toUnit)) {
                result = value * areaToSqm[fromUnit] / areaToSqm[toUnit];
            }
            else if (volumeToL.count(fromUnit) && volumeToL.count(toUnit)) {
                result = value * volumeToL[fromUnit] / volumeToL[toUnit];
            }
            else if (angleToRad.count(fromUnit) && angleToRad.count(toUnit)) {
                result = value * angleToRad[fromUnit] / angleToRad[toUnit];
            }
            else if (pressureToPa.count(fromUnit) && pressureToPa.count(toUnit)) {
                result = value * pressureToPa[fromUnit] / pressureToPa[toUnit];
            }
            else if (energyToJ.count(fromUnit) && energyToJ.count(toUnit)) {
                result = value * energyToJ[fromUnit] / energyToJ[toUnit];
            }
            else if (powerToW.count(fromUnit) && powerToW.count(toUnit)) {
                result = value * powerToW[fromUnit] / powerToW[toUnit];
            }
            else if (freqToHz.count(fromUnit) && freqToHz.count(toUnit)) {
                result = value * freqToHz[fromUnit] / freqToHz[toUnit];
            }
            else {
                std::cout << "Unknown conversion: " << fromUnit << " to " << toUnit << std::endl;
                return;
            }
            
            std::cout << result << std::endl;
        }
    }
    // Inner string functions (no . prefix)
    else if (node->value == "str.upper" || node->value == "upper") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                for (auto& c : s) c = std::toupper(c);
                std::cout << s << std::endl;
            }
        }
    }
    else if (node->value == "str.lower" || node->value == "lower") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                for (auto& c : s) c = std::tolower(c);
                std::cout << s << std::endl;
            }
        }
    }
    else if (node->value == "str.trim" || node->value == "trim") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                size_t start = s.find_first_not_of(" \t\n\r");
                size_t end = s.find_last_not_of(" \t\n\r");
                if (start != std::string::npos) {
                    std::cout << s.substr(start, end - start + 1) << std::endl;
                }
            }
        }
    }
    else if (node->value == "str.rev" || node->value == "rev") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(val)) {
                std::string s = std::get<std::string>(val);
                std::reverse(s.begin(), s.end());
                std::cout << s << std::endl;
            }
        }
    }
    // Inner time functions
    else if (node->value == "time.now" || node->value == "now") {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        std::cout << std::ctime(&time);
    }
    else if (node->value == "time.unix" || node->value == "unix") {
        auto now = std::chrono::system_clock::now();
        auto epoch = now.time_since_epoch();
        auto seconds = std::chrono::duration_cast<std::chrono::seconds>(epoch);
        std::cout << seconds.count() << std::endl;
    }
    else if (node->value == "time.year" || node->value == "year") {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        auto tm = *std::localtime(&time);
        std::cout << (tm.tm_year + 1900) << std::endl;
    }
    else if (node->value == "time.month" || node->value == "month") {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        auto tm = *std::localtime(&time);
        std::cout << (tm.tm_mon + 1) << std::endl;
    }
    else if (node->value == "time.day" || node->value == "day") {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        auto tm = *std::localtime(&time);
        std::cout << tm.tm_mday << std::endl;
    }
    else if (node->value == "time.hour" || node->value == "hour") {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        auto tm = *std::localtime(&time);
        std::cout << tm.tm_hour << std::endl;
    }
    // Inner system functions
    else if (node->value == "sys.os" || node->value == "os") {
        #ifdef _WIN32
        std::cout << "windows" << std::endl;
        #elif __APPLE__
        std::cout << "macos" << std::endl;
        #elif __linux__
        std::cout << "linux" << std::endl;
        #else
        std::cout << "unknown" << std::endl;
        #endif
    }
    else if (node->value == "sys.arch" || node->value == "arch") {
        #if defined(__x86_64__) || defined(_M_X64)
        std::cout << "x64" << std::endl;
        #elif defined(__i386) || defined(_M_IX86)
        std::cout << "x86" << std::endl;
        #elif defined(__aarch64__) || defined(_M_ARM64)
        std::cout << "arm64" << std::endl;
        #else
        std::cout << "unknown" << std::endl;
        #endif
    }
    else if (node->value == "sleep") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            int ms = 0;
            if (std::holds_alternative<int>(val)) ms = std::get<int>(val);
            std::this_thread::sleep_for(std::chrono::milliseconds(ms));
        }
    }
    // Inner math functions
    else if (node->value == "sqrt") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double a = 0;
            if (std::holds_alternative<int>(val)) a = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) a = std::get<double>(val);
            std::cout << std::sqrt(a) << std::endl;
        }
    }
    else if (node->value == "abs") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double a = 0;
            if (std::holds_alternative<int>(val)) a = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) a = std::get<double>(val);
            std::cout << std::abs(a) << std::endl;
        }
    }
    else if (node->value == "sin") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double a = 0;
            if (std::holds_alternative<int>(val)) a = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) a = std::get<double>(val);
            std::cout << std::sin(a) << std::endl;
        }
    }
    else if (node->value == "cos") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double a = 0;
            if (std::holds_alternative<int>(val)) a = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) a = std::get<double>(val);
            std::cout << std::cos(a) << std::endl;
        }
    }
    else if (node->value == "tan") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double a = 0;
            if (std::holds_alternative<int>(val)) a = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) a = std::get<double>(val);
            std::cout << std::tan(a) << std::endl;
        }
    }
    else if (node->value == "floor") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double a = 0;
            if (std::holds_alternative<int>(val)) a = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) a = std::get<double>(val);
            std::cout << std::floor(a) << std::endl;
        }
    }
    else if (node->value == "ceil") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double a = 0;
            if (std::holds_alternative<int>(val)) a = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) a = std::get<double>(val);
            std::cout << std::ceil(a) << std::endl;
        }
    }
    else if (node->value == "round") {
        if (!node->children.empty()) {
            Value val = evaluateExpression(node->children[0]);
            double a = 0;
            if (std::holds_alternative<int>(val)) a = std::get<int>(val);
            else if (std::holds_alternative<double>(val)) a = std::get<double>(val);
            std::cout << std::round(a) << std::endl;
        }
    }
    else if (node->value == "pi" || node->value == "gmath.pi") {
        std::cout << 3.14159265358979323846 << std::endl;
    }
    else if (node->value == "e" || node->value == "gmath.e") {
        std::cout << 2.71828182845904523536 << std::endl;
    }
}

void Interpreter::executeVarDecl(std::shared_ptr<ASTNode> node) {
    if (!node->children.empty()) {
        auto firstChild = node->children[0];
        
        // Check if it's a string repeat operation
        if (firstChild->type == AST_STR_OP && firstChild->value == "repeat") {
            if (firstChild->children.size() >= 2) {
                Value strVal = evaluateExpression(firstChild->children[0]);
                Value countVal = evaluateExpression(firstChild->children[1]);
                
                if (std::holds_alternative<std::string>(strVal) && std::holds_alternative<int>(countVal)) {
                    std::string result = strRepeat(std::get<std::string>(strVal), std::get<int>(countVal));
                    variables[node->value] = result;
                }
            }
            
            // Check for exit node
            if (node->children.size() > 1 && node->children[1]->type == AST_EXIT) {
                shouldExit = true;
                if (!node->children[1]->value.empty()) {
                    try {
                        exitCode = std::stoi(node->children[1]->value);
                    } catch (...) {
                        exitCode = 0;
                    }
                }
            }
        } else {
            variables[node->value] = evaluateExpression(firstChild);
            
            // Check for exit node (without repeat)
            if (node->children.size() > 1 && node->children[1]->type == AST_EXIT) {
                shouldExit = true;
                if (!node->children[1]->value.empty()) {
                    try {
                        exitCode = std::stoi(node->children[1]->value);
                    } catch (...) {
                        exitCode = 0;
                    }
                }
            }
        }
    }
}

void Interpreter::executeLoop(std::shared_ptr<ASTNode> node) {
    std::string value = node->value;
    int count = 0;
    std::string timeUnit = "";
    
    // Parse count and time unit
    if (value.empty()) {
        count = 1; // default
    } else {
        size_t ampPos = value.find('&');
        if (ampPos != std::string::npos) {
            count = std::stoi(value.substr(0, ampPos));
            timeUnit = value.substr(ampPos + 1);
        } else {
            count = std::stoi(value);
        }
    }
    
    // Check if first child is a message (for repeat) or statements (for turn)
    bool hasMessage = !node->children.empty() && node->children[0]->type == AST_STRING;
    
    // Execute loop
    for (int i = 0; i < count && !shouldExit; i++) {
        if (hasMessage) {
            // For repeat: print the message
            std::cout << node->children[0]->value << std::endl;
            // Execute remaining children
            for (size_t j = 1; j < node->children.size(); j++) {
                if (shouldExit) break;
                executeNode(node->children[j]);
            }
        } else {
            // For turn: execute all children
            for (auto& child : node->children) {
                if (shouldExit) break;
                executeNode(child);
            }
        }
    }
}

void Interpreter::executeFunctionDef(std::shared_ptr<ASTNode> node) {
    functions[node->value] = node;
}

void Interpreter::executeCondition(std::shared_ptr<ASTNode> node) {
    if (!node->children.empty()) {
        Value val = evaluateExpression(node->children[0]);
        if (std::holds_alternative<int>(val) && std::get<int>(val) != 0) {
            for (size_t i = 1; i < node->children.size(); i++) {
                executeNode(node->children[i]);
            }
        }
    }
}

std::string Interpreter::strRepeat(const std::string& str, int count) {
    std::string result;
    for (int i = 0; i < count; i++) {
        result += str;
    }
    return result;
}

void Interpreter::executeImport(std::shared_ptr<ASTNode> node) {
    std::string moduleName = node->value;
    
    if (importedModules.find(moduleName) != importedModules.end()) {
        std::cout << "[INFO] Module '" << moduleName << "' already imported" << std::endl;
        return;
    }
    
    // Check if it's a .gns or .gne file
    if (moduleName.find(".gns") != std::string::npos || moduleName.find(".gne") != std::string::npos) {
        // Load Geneia extension module
        if (loadGeneiaModule(moduleName)) {
            return;
        }
    }
    
    // List of built-in modules
    bool isBuiltIn = (moduleName == "UI" || moduleName == "UI Library" || moduleName == "Math" || 
                      moduleName == "File I/O" || moduleName == "File" || moduleName == "Network" || 
                      moduleName == "Graphics" || moduleName == "GeneiaUI" || moduleName == "OpenGSL" ||
                      moduleName == "G_Web.Kit" || moduleName == "GWeb" || moduleName == "Web" ||
                      moduleName == "OpenGWS" || moduleName == "GWS" ||
                      moduleName == "OpenW2G" || moduleName == "W2G" ||
                      moduleName == "G_Render" || moduleName == "GRender" || moduleName == "GR" ||
                      moduleName == "OpenGNEL" || moduleName == "GNEL");
    
    // Try loading as .gne or .gns if it's not a built-in module
    if (!isBuiltIn) {
        // Assume it's a Geneia extension
        if (loadGeneiaModule(moduleName)) {
            return;
        }
    }
    
    importedModules[moduleName] = true;
    std::cout << "[INFO] Imported module: " << moduleName << std::endl;
    
    // Load module functionality based on module name
    if (moduleName == "UI" || moduleName == "UI Library") {
        // UI Library functions
        variables["ui.version"] = std::string("1.0.0");
        variables["ui.window"] = std::string("create");
        variables["ui.button"] = std::string("create");
        variables["ui.label"] = std::string("create");
        variables["ui.textbox"] = std::string("create");
    } else if (moduleName == "GeneiaUI") {
        // GeneiaUI - Full GUI module with window and customized UI
        variables["geneiaui.version"] = std::string("1.0.0");
        variables["geneiaui.window"] = std::string("create");
        variables["geneiaui.panel"] = std::string("create");
        variables["geneiaui.button"] = std::string("create");
        variables["geneiaui.label"] = std::string("create");
        variables["geneiaui.input"] = std::string("create");
        variables["geneiaui.text"] = std::string("create");
        variables["geneiaui.list"] = std::string("create");
        variables["geneiaui.menu"] = std::string("create");
        variables["geneiaui.toolbar"] = std::string("create");
        variables["geneiaui.status"] = std::string("create");
        variables["geneiaui.dialog"] = std::string("create");
        variables["geneiaui.style"] = std::string("function");
        variables["geneiaui.theme"] = std::string("function");
        variables["geneiaui.color"] = std::string("function");
        variables["geneiaui.font"] = std::string("function");
        variables["geneiaui.size"] = std::string("function");
        variables["geneiaui.pos"] = std::string("function");
        variables["geneiaui.show"] = std::string("function");
        variables["geneiaui.hide"] = std::string("function");
        variables["geneiaui.close"] = std::string("function");
        variables["geneiaui.run"] = std::string("function");
    } else if (moduleName == "Math") {
        // Math library functions
        variables["math.pi"] = 3.14159265359;
        variables["math.e"] = 2.71828182846;
        variables["math.sqrt"] = std::string("function");
        variables["math.pow"] = std::string("function");
        variables["math.sin"] = std::string("function");
        variables["math.cos"] = std::string("function");
    } else if (moduleName == "File I/O" || moduleName == "File") {
        // File I/O functions
        variables["file.version"] = std::string("1.0.0");
        variables["file.read"] = std::string("function");
        variables["file.write"] = std::string("function");
        variables["file.open"] = std::string("function");
        variables["file.close"] = std::string("function");
    } else if (moduleName == "Network") {
        // Network functions
        variables["net.version"] = std::string("1.0.0");
        variables["net.http"] = std::string("function");
        variables["net.socket"] = std::string("function");
        variables["net.connect"] = std::string("function");
    } else if (moduleName == "Graphics") {
        // Graphics functions
        variables["gfx.version"] = std::string("1.0.0");
        variables["gfx.draw"] = std::string("function");
        variables["gfx.circle"] = std::string("function");
        variables["gfx.rect"] = std::string("function");
        variables["gfx.line"] = std::string("function");
    } else if (moduleName == "G_Web.Kit" || moduleName == "GWeb" || moduleName == "Web") {
        // G_Web.Kit - Geneia Web Kit for generating websites
        variables["gweb.version"] = std::string("1.0.0");
        variables["gweb.page"] = std::string("function");
        variables["gweb.style"] = std::string("function");
        variables["gweb.nav"] = std::string("function");
        variables["gweb.hero"] = std::string("function");
        variables["gweb.sect"] = std::string("function");
        variables["gweb.text"] = std::string("function");
        variables["gweb.head"] = std::string("function");
        variables["gweb.btn"] = std::string("function");
        variables["gweb.img"] = std::string("function");
        variables["gweb.card"] = std::string("function");
        variables["gweb.grid"] = std::string("function");
        variables["gweb.list"] = std::string("function");
        variables["gweb.foot"] = std::string("function");
        variables["gweb.build"] = std::string("function");
        std::cout << "[INFO] G_Web.Kit loaded - use .GWeb.* functions" << std::endl;
    } else if (moduleName == "OpenGSL") {
        // OpenGSL - Open Public Geneia Styling Library
        variables["opengsl.version"] = std::string("1.0.0");
        variables["opengsl.canvas"] = std::string("function");
        variables["opengsl.bg"] = std::string("function");
        variables["opengsl.color"] = std::string("function");
        variables["opengsl.rect"] = std::string("function");
        variables["opengsl.circle"] = std::string("function");
        variables["opengsl.line"] = std::string("function");
        variables["opengsl.ellipse"] = std::string("function");
        variables["opengsl.text"] = std::string("function");
        variables["opengsl.cube"] = std::string("function");
        variables["opengsl.sphere"] = std::string("function");
        variables["opengsl.pyramid"] = std::string("function");
        variables["opengsl.cylinder"] = std::string("function");
        variables["opengsl.render"] = std::string("function");
        std::cout << "[INFO] OpenGSL loaded - use .OpenGSL.* functions" << std::endl;
    } else if (moduleName == "OpenGWS" || moduleName == "GWS") {
        // OpenGWS - Open Public Geneia Web Server Services Kit
        // Package Manager + Web Server
        variables["gws.version"] = std::string("1.0.0");
        // Package manager
        variables["gws.install"] = std::string("function");
        variables["gws.remove"] = std::string("function");
        variables["gws.pkglist"] = std::string("function");
        variables["gws.search"] = std::string("function");
        variables["gws.update"] = std::string("function");
        // Web server
        variables["gws.port"] = std::string("function");
        variables["gws.route"] = std::string("function");
        variables["gws.page"] = std::string("function");
        variables["gws.style"] = std::string("function");
        variables["gws.nav"] = std::string("function");
        variables["gws.hero"] = std::string("function");
        variables["gws.sect"] = std::string("function");
        variables["gws.text"] = std::string("function");
        variables["gws.btn"] = std::string("function");
        variables["gws.card"] = std::string("function");
        variables["gws.grid"] = std::string("function");
        variables["gws.list"] = std::string("function");
        variables["gws.foot"] = std::string("function");
        variables["gws.endroute"] = std::string("function");
        variables["gws.serve"] = std::string("function");
        std::cout << "[INFO] OpenGWS loaded - Package Manager + Web Server" << std::endl;
    } else if (moduleName == "OpenW2G" || moduleName == "W2G") {
        // OpenW2G - Open Public Web to Geneia Kit
        variables["w2g.version"] = std::string("1.0.0");
        variables["w2g.parse"] = std::string("function");
        variables["w2g.convert"] = std::string("function");
        variables["w2g.save"] = std::string("function");
        variables["w2g.view"] = std::string("function");
        std::cout << "[INFO] OpenW2G loaded - Web to Geneia converter" << std::endl;
    } else if (moduleName == "G_Render" || moduleName == "GRender" || moduleName == "GR") {
        // G_Render - Universal Rendering Module
        variables["gr.version"] = std::string("1.0.0");
        variables["gr.target"] = std::string("function");
        variables["gr.title"] = std::string("function");
        variables["gr.theme"] = std::string("function");
        variables["gr.style"] = std::string("function");
        variables["gr.view"] = std::string("function");
        variables["gr.text"] = std::string("function");
        variables["gr.btn"] = std::string("function");
        variables["gr.nav"] = std::string("function");
        variables["gr.hero"] = std::string("function");
        variables["gr.card"] = std::string("function");
        variables["gr.grid"] = std::string("function");
        variables["gr.list"] = std::string("function");
        variables["gr.endview"] = std::string("function");
        variables["gr.render"] = std::string("function");
        std::cout << "[INFO] G_Render loaded - Universal renderer (web/desktop/term/json)" << std::endl;
    } else if (moduleName == "OpenGNEL" || moduleName == "GNEL") {
        // OpenGNEL - Open Geneia Element LanScript
        variables["gnel.version"] = std::string("1.0.0");
        variables["gnel.run"] = std::string("function");
        variables["gnel.cd"] = std::string("function");
        variables["gnel.pwd"] = std::string("function");
        variables["gnel.ls"] = std::string("function");
        variables["gnel.cat"] = std::string("function");
        variables["gnel.echo"] = std::string("function");
        variables["gnel.mkdir"] = std::string("function");
        variables["gnel.rm"] = std::string("function");
        variables["gnel.cp"] = std::string("function");
        variables["gnel.mv"] = std::string("function");
        variables["gnel.env"] = std::string("function");
        variables["gnel.getenv"] = std::string("function");
        variables["gnel.alias"] = std::string("function");
        variables["gnel.hist"] = std::string("function");
        variables["gnel.pipe"] = std::string("function");
        variables["gnel.script"] = std::string("function");
        variables["gnel.save"] = std::string("function");
        variables["gnel.touch"] = std::string("function");
        variables["gnel.grep"] = std::string("function");
        variables["gnel.find"] = std::string("function");
        variables["gnel.wc"] = std::string("function");
        variables["gnel.head"] = std::string("function");
        variables["gnel.tail"] = std::string("function");
        std::cout << "[INFO] OpenGNEL loaded - Command line scripting" << std::endl;
    } else {
        std::cout << "[WARNING] Unknown module: " << moduleName << std::endl;
    }
}

void Interpreter::executeExport(std::shared_ptr<ASTNode> node) {
    std::string exportName = node->value;
    std::cout << "[INFO] Exported: " << exportName << std::endl;
    
    // Store exported variables/functions for module system
    if (variables.find(exportName) != variables.end()) {
        // Export variable
        exportedModules["current"][exportName] = variables[exportName];
    } else if (functions.find(exportName) != functions.end()) {
        // Export function (store as marker)
        exportedModules["current"][exportName] = std::string("function");
    }
}

bool Interpreter::loadGeneiaModule(const std::string& filename) {
    std::string fullPath = filename;
    
    // Check if it's a .gns or .gne file
    bool isGNS = (filename.find(".gns") != std::string::npos);
    bool isGNE = (filename.find(".gne") != std::string::npos);
    
    if (!isGNS && !isGNE) {
        // Add extension if not provided
        fullPath = filename + ".gne";
    }
    
    std::cout << "[INFO] Loading Geneia module: " << fullPath << std::endl;
    
    // In a real implementation, we would:
    // 1. Read the .gns/.gne file
    // 2. Parse it
    // 3. Execute it in a separate context
    // 4. Import its exported symbols
    
    // For now, simulate successful load
    importedModules[filename] = true;
    return true;
}

// ============================================================
// INT Inc. Command System
// .intcnf - INT Config files for defining custom terminal commands
// .intpkf - INT Package files (compiled/packaged commands)
// ============================================================

void Interpreter::executeIntCmd(std::shared_ptr<ASTNode> node) {
    std::string subCmd = node->value;
    
    if (subCmd == "load") {
        // int load 'file.intcnf' - Load config file
        if (!node->children.empty()) {
            Value filename = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(filename)) {
                std::string file = std::get<std::string>(filename);
                if (loadIntConfig(file)) {
                    std::cout << "[INT] Loaded config: " << file << std::endl;
                } else {
                    std::cout << "[INT] Failed to load: " << file << std::endl;
                }
            }
        }
    } else if (subCmd == "pack") {
        // int pack 'file.intcnf' - Package config to .intpkf
        if (!node->children.empty()) {
            Value filename = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(filename)) {
                std::string configFile = std::get<std::string>(filename);
                std::string outputFile = configFile;
                // Replace .intcnf with .intpkf
                size_t pos = outputFile.find(".intcnf");
                if (pos != std::string::npos) {
                    outputFile.replace(pos, 7, ".intpkf");
                } else {
                    outputFile += ".intpkf";
                }
                
                if (packIntConfig(configFile, outputFile)) {
                    std::cout << "[INT] Packaged: " << configFile << " -> " << outputFile << std::endl;
                } else {
                    std::cout << "[INT] Failed to package: " << configFile << std::endl;
                }
            }
        }
    } else if (subCmd == "run") {
        // int run 'file.intpkf' - Run packaged commands
        if (!node->children.empty()) {
            Value filename = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(filename)) {
                std::string file = std::get<std::string>(filename);
                if (runIntPackage(file)) {
                    std::cout << "[INT] Executed package: " << file << std::endl;
                } else {
                    std::cout << "[INT] Failed to run: " << file << std::endl;
                }
            }
        }
    } else if (subCmd == "cmd") {
        // int cmd 'name' { ... } - Define a command
        if (node->children.size() >= 2) {
            Value cmdName = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(cmdName)) {
                std::string name = std::get<std::string>(cmdName);
                // Store command body
                intCommands[name] = node->children[1];
                std::cout << "[INT] Defined command: " << name << std::endl;
            }
        }
    } else if (subCmd == "exec") {
        // int exec 'name' - Execute a command
        if (!node->children.empty()) {
            Value cmdName = evaluateExpression(node->children[0]);
            if (std::holds_alternative<std::string>(cmdName)) {
                std::string name = std::get<std::string>(cmdName);
                if (intCommands.find(name) != intCommands.end()) {
                    std::cout << "[INT] Executing: " << name << std::endl;
                    auto cmdBody = intCommands[name];
                    if (cmdBody->type == AST_BLOCK) {
                        for (auto& stmt : cmdBody->children) {
                            executeNode(stmt);
                        }
                    } else {
                        executeNode(cmdBody);
                    }
                } else {
                    std::cout << "[INT] Command not found: " << name << std::endl;
                }
            }
        }
    } else if (subCmd == "list") {
        // int list - List available commands
        std::cout << "[INT] Available commands:" << std::endl;
        for (auto& cmd : intCommands) {
            std::cout << "  - " << cmd.first << std::endl;
        }
        if (intCommands.empty()) {
            std::cout << "  (none defined)" << std::endl;
        }
    } else {
        std::cout << "[INT] Unknown subcommand: " << subCmd << std::endl;
        std::cout << "[INT] Usage:" << std::endl;
        std::cout << "  int load 'file.intcnf'  - Load config file" << std::endl;
        std::cout << "  int pack 'file.intcnf'  - Package to .intpkf" << std::endl;
        std::cout << "  int run 'file.intpkf'   - Run packaged commands" << std::endl;
        std::cout << "  int cmd 'name' { ... }  - Define a command" << std::endl;
        std::cout << "  int exec 'name'         - Execute a command" << std::endl;
        std::cout << "  int list                - List commands" << std::endl;
    }
}

bool Interpreter::loadIntConfig(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        // Try with .intcnf extension
        std::ifstream file2(filename + ".intcnf");
        if (!file2.is_open()) {
            return false;
        }
        file = std::move(file2);
    }
    
    std::string line;
    std::string currentCmd = "";
    std::string cmdBody = "";
    bool inCommand = false;
    
    while (std::getline(file, line)) {
        // Skip comments (lines starting with #)
        if (line.empty() || line[0] == '#') continue;
        
        // Trim whitespace
        size_t start = line.find_first_not_of(" \t");
        if (start == std::string::npos) continue;
        line = line.substr(start);
        
        // Parse command definitions: [command_name]
        if (line[0] == '[' && line.back() == ']') {
            // Save previous command if any
            if (!currentCmd.empty() && !cmdBody.empty()) {
                // Create a simple AST node for the command
                auto cmdNode = std::make_shared<ASTNode>();
                cmdNode->type = AST_BLOCK;
                cmdNode->value = cmdBody;
                intCommands[currentCmd] = cmdNode;
            }
            
            currentCmd = line.substr(1, line.length() - 2);
            cmdBody = "";
            inCommand = true;
        } else if (inCommand) {
            // Add to command body
            if (!cmdBody.empty()) cmdBody += "\n";
            cmdBody += line;
        }
    }
    
    // Save last command
    if (!currentCmd.empty() && !cmdBody.empty()) {
        auto cmdNode = std::make_shared<ASTNode>();
        cmdNode->type = AST_BLOCK;
        cmdNode->value = cmdBody;
        intCommands[currentCmd] = cmdNode;
    }
    
    file.close();
    return true;
}

bool Interpreter::packIntConfig(const std::string& configFile, const std::string& outputFile) {
    // Load the config first
    if (!loadIntConfig(configFile)) {
        return false;
    }
    
    // Write packaged format
    std::ofstream out(outputFile, std::ios::binary);
    if (!out.is_open()) {
        return false;
    }
    
    // Write header
    out << "INTPKF\n";  // Magic header
    out << "1.0\n";     // Version
    out << intCommands.size() << "\n";  // Number of commands
    
    // Write each command
    for (auto& cmd : intCommands) {
        out << "[" << cmd.first << "]\n";
        if (cmd.second) {
            out << cmd.second->value << "\n";
        }
        out << "[/]\n";  // End marker
    }
    
    out.close();
    std::cout << "[INT] Package created: " << outputFile << std::endl;
    return true;
}

bool Interpreter::runIntPackage(const std::string& filename) {
    std::ifstream file(filename, std::ios::binary);
    if (!file.is_open()) {
        // Try with .intpkf extension
        std::ifstream file2(filename + ".intpkf");
        if (!file2.is_open()) {
            return false;
        }
        file = std::move(file2);
    }
    
    std::string line;
    
    // Read and verify header
    std::getline(file, line);
    if (line != "INTPKF") {
        std::cout << "[INT] Invalid package format" << std::endl;
        return false;
    }
    
    // Read version
    std::getline(file, line);
    std::cout << "[INT] Package version: " << line << std::endl;
    
    // Read command count
    std::getline(file, line);
    int cmdCount = std::stoi(line);
    std::cout << "[INT] Commands in package: " << cmdCount << std::endl;
    
    // Read and execute commands
    std::string currentCmd = "";
    std::string cmdBody = "";
    
    while (std::getline(file, line)) {
        if (line[0] == '[' && line != "[/]") {
            currentCmd = line.substr(1, line.length() - 2);
            cmdBody = "";
        } else if (line == "[/]") {
            // Execute the command body
            if (!cmdBody.empty()) {
                std::cout << "[INT] Running: " << currentCmd << std::endl;
                // Execute shell command
                system(cmdBody.c_str());
            }
            currentCmd = "";
        } else {
            if (!cmdBody.empty()) cmdBody += "\n";
            cmdBody += line;
        }
    }
    
    file.close();
    return true;
}
