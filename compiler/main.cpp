#include <iostream>
#include <fstream>
#include <sstream>
#include <cstring>
#include "lexer.h"
#include "parser.h"
#include "interpreter.h"

// Global flag for check mode
bool g_checkMode = false;

std::string readFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        throw std::runtime_error("Could not open file: " + filename);
    }
    std::stringstream buffer;
    buffer << file.rdbuf();
    return buffer.str();
}

// Escape string for JSON output
std::string escapeJson(const std::string& s) {
    std::string result;
    for (char c : s) {
        switch (c) {
            case '"': result += "\\\""; break;
            case '\\': result += "\\\\"; break;
            case '\n': result += "\\n"; break;
            case '\r': result += "\\r"; break;
            case '\t': result += "\\t"; break;
            default: result += c;
        }
    }
    return result;
}

// Output error in JSON format for IDE
void outputJsonError(int line, int column, const std::string& message, const std::string& severity, const std::string& code) {
    std::cout << "{\"valid\":false,\"errors\":[{\"line\":" << line 
              << ",\"column\":" << column 
              << ",\"message\":\"" << escapeJson(message) << "\""
              << ",\"severity\":\"" << severity << "\""
              << ",\"code\":\"" << code << "\"}]}" << std::endl;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cout << "Geneia Programming Language v1.0" << std::endl;
        std::cout << "Usage: geneia <filename.gn>" << std::endl;
        std::cout << "       geneia --check <filename.gn>  (syntax check only, JSON output)" << std::endl;
        return 1;
    }
    
    bool checkOnly = false;
    std::string filename;
    
    // Parse arguments
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "--check") == 0 || strcmp(argv[i], "-c") == 0) {
            checkOnly = true;
            g_checkMode = true;
        } else if (argv[i][0] != '-') {
            filename = argv[i];
        }
    }
    
    if (filename.empty()) {
        if (checkOnly) {
            outputJsonError(1, 1, "No input file specified", "error", "E000");
        } else {
            std::cerr << "Error: No input file specified" << std::endl;
        }
        return 1;
    }
    
    try {
        std::string source = readFile(filename);
        
        Lexer lexer(source);
        auto tokens = lexer.tokenize();
        
        Parser parser(tokens);
        auto ast = parser.parse();
        
        if (checkOnly) {
            // Syntax check mode - output JSON for IDE
            // If we got here without exception, syntax is valid
            std::cout << "{\"valid\":true,\"errors\":[]}" << std::endl;
            return 0;
        }
        
        Interpreter interpreter;
        interpreter.execute(ast);
        
    } catch (const std::exception& e) {
        if (checkOnly) {
            // Output error as JSON for IDE
            outputJsonError(1, 1, e.what(), "error", "E000");
            return 1;
        }
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}
