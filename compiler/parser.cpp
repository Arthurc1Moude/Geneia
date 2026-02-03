#include "parser.h"
#include <stdexcept>
#include <iostream>

// External flag from main.cpp
extern bool g_checkMode;

Parser::Parser(const std::vector<Token>& toks) : tokens(toks), pos(0) {}

Token Parser::peek() {
    if (pos >= tokens.size()) return tokens.back();
    return tokens[pos];
}

Token Parser::advance() {
    if (pos >= tokens.size()) return tokens.back();
    return tokens[pos++];
}

bool Parser::match(TokenType type) {
    return peek().type == type;
}

std::shared_ptr<ASTNode> Parser::parse() {
    auto program = std::make_shared<ASTNode>();
    program->type = AST_PROGRAM;
    
    while (!match(TOKEN_EOF)) {
        try {
            auto stmt = parseStatement();
            if (stmt) {
                program->children.push_back(stmt);
            }
        } catch (const std::exception& e) {
            if (g_checkMode) {
                // Re-throw in check mode so main can output JSON
                throw;
            }
            std::cerr << "Parse error: " << e.what() << std::endl;
            break;
        } catch (...) {
            if (g_checkMode) {
                throw std::runtime_error("Unknown parse error");
            }
            std::cerr << "Unknown parse error" << std::endl;
            break;
        }
    }
    
    return program;
}

std::shared_ptr<ASTNode> Parser::parseStatement() {
    // Skip comments
    if (match(TOKEN_COMMENT)) {
        advance();
        return parseStatement();
    }
    
    // Handle tips
    if (match(TOKEN_TIP)) {
        auto node = std::make_shared<ASTNode>();
        node->type = AST_FUNCTION_CALL;
        node->value = "tip";
        auto tipNode = std::make_shared<ASTNode>();
        tipNode->type = AST_STRING;
        tipNode->value = advance().value;
        node->children.push_back(tipNode);
        return node;
    }
    
    // Handle int command (INT Inc. terminal commands)
    if (match(TOKEN_INT_CMD)) {
        return parseIntCmd();
    }
    
    if (match(TOKEN_KEYWORD)) {
        Token kw = peek();
        if (kw.value == "hold") {
            return parseVarDecl();
        } else if (kw.value == "peat" || kw.value == "msg") {
            return parseFunctionCall();
        } else if (kw.value == "upper" || kw.value == "lower" || kw.value == "trim" ||
                   kw.value == "rev" || kw.value == "now" || kw.value == "unix" ||
                   kw.value == "year" || kw.value == "month" || kw.value == "day" ||
                   kw.value == "hour" || kw.value == "os" || kw.value == "arch" ||
                   kw.value == "sleep" ||
                   kw.value == "sqrt" || kw.value == "abs" || kw.value == "sin" ||
                   kw.value == "cos" || kw.value == "tan" || kw.value == "floor" ||
                   kw.value == "ceil" || kw.value == "round" || kw.value == "pi" ||
                   kw.value == "e") {
            // Inner functions - parse as function call
            return parseFunctionCall();
        } else if (kw.value == "repeat" || kw.value == "turn") {
            return parseLoop();
        } else if (kw.value == "exit") {
            auto node = std::make_shared<ASTNode>();
            node->type = AST_EXIT;
            advance();
            if (match(TOKEN_LPAREN)) {
                advance(); // consume (
                if (match(TOKEN_NUMBER)) {
                    node->value = advance().value;
                }
                if (match(TOKEN_RPAREN)) advance(); // consume )
            } else if (match(TOKEN_NUMBER)) {
                node->value = advance().value;
            }
            return node;
        } else if (kw.value == "var") {
            return parseVarDecl();
        } else if (kw.value == "str") {
            // str with flags: str -u 'text', str --upper 'text', str(U+XXXX)
            size_t savedPos = pos;
            advance(); // consume 'str'
            
            // Check for flag syntax: str -u, str --upper, etc.
            if (peek().value == "-" || peek().value == "--") {
                auto node = std::make_shared<ASTNode>();
                node->type = AST_FUNCTION_CALL;
                
                std::string flag = advance().value; // consume - or --
                if (match(TOKEN_IDENTIFIER) || match(TOKEN_KEYWORD)) {
                    flag += advance().value; // get flag name
                }
                
                // Map flags to function names
                if (flag == "-u" || flag == "--upper") {
                    node->value = "str.upper";
                } else if (flag == "-l" || flag == "--lower") {
                    node->value = "str.lower";
                } else if (flag == "-t" || flag == "--trim") {
                    node->value = "str.trim";
                } else if (flag == "-r" || flag == "--rev") {
                    node->value = "str.rev";
                } else if (flag == "-s" || flag == "--sub") {
                    node->value = "str.sub";
                } else if (flag == "-p" || flag == "--rep") {
                    node->value = "str.rep";
                } else if (flag == "-h" || flag == "--has") {
                    node->value = "str.has";
                } else if (flag == "-i" || flag == "--idx") {
                    node->value = "str.idx";
                } else if (flag == "-x" || flag == "--split") {
                    node->value = "str.split";
                } else if (flag == "-n" || flag == "--len") {
                    node->value = "str.len";
                } else {
                    node->value = "str";
                }
                
                // Parse arguments
                while (!match(TOKEN_EOF) && !match(TOKEN_KEYWORD) && peek().value != "!" && peek().value != "\"") {
                    if (peek().value == "-" || peek().value == "--") break;
                    if (match(TOKEN_ECHO)) {
                        auto argNode = std::make_shared<ASTNode>();
                        argNode->type = AST_STRING;
                        argNode->value = advance().value;
                        node->children.push_back(argNode);
                    } else if (match(TOKEN_STRING)) {
                        auto argNode = std::make_shared<ASTNode>();
                        argNode->type = AST_IDENTIFIER;
                        argNode->value = advance().value;
                        node->children.push_back(argNode);
                    } else if (match(TOKEN_LPAREN)) {
                        advance(); // consume (
                        if (match(TOKEN_NUMBER)) {
                            auto argNode = std::make_shared<ASTNode>();
                            argNode->type = AST_NUMBER;
                            argNode->value = advance().value;
                            node->children.push_back(argNode);
                        }
                        if (match(TOKEN_RPAREN)) advance(); // consume )
                    } else {
                        break;
                    }
                }
                return node;
            } else if (match(TOKEN_LPAREN)) {
                // It's str(U+XXXX) - Unicode string function
                auto node = std::make_shared<ASTNode>();
                node->type = AST_FUNCTION_CALL;
                node->value = "str";
                advance(); // consume (
                // Read the Unicode value (U+XXXX format)
                std::string unicodeVal;
                while (!match(TOKEN_RPAREN) && !match(TOKEN_EOF)) {
                    Token t = advance();
                    unicodeVal += t.value;
                }
                auto strNode = std::make_shared<ASTNode>();
                strNode->type = AST_STRING;
                strNode->value = unicodeVal;
                node->children.push_back(strNode);
                if (match(TOKEN_RPAREN)) advance(); // consume )
                return node;
            } else {
                // It's old-style str {var} = 'value' - treat as var
                pos = savedPos; // restore position
                return parseVarDecl();
            }
        } else if (kw.value == "time") {
            // time with flags: time -n, time --now, time -u, time --unix, etc.
            advance(); // consume 'time'
            auto node = std::make_shared<ASTNode>();
            node->type = AST_FUNCTION_CALL;
            
            if (peek().value == "-" || peek().value == "--") {
                std::string flag = advance().value; // consume - or --
                if (match(TOKEN_IDENTIFIER) || match(TOKEN_KEYWORD)) {
                    flag += advance().value; // get flag name
                }
                
                // Map flags to function names
                if (flag == "-n" || flag == "--now") {
                    node->value = "time.now";
                } else if (flag == "-u" || flag == "--unix") {
                    node->value = "time.unix";
                } else if (flag == "-y" || flag == "--year") {
                    node->value = "time.year";
                } else if (flag == "-m" || flag == "--month") {
                    node->value = "time.month";
                } else if (flag == "-d" || flag == "--day") {
                    node->value = "time.day";
                } else if (flag == "-h" || flag == "--hour") {
                    node->value = "time.hour";
                } else if (flag == "-i" || flag == "--min") {
                    node->value = "time.min";
                } else if (flag == "-s" || flag == "--sec") {
                    node->value = "time.sec";
                } else if (flag == "-z" || flag == "--ms") {
                    node->value = "time.ms";
                } else {
                    node->value = "time.now";
                }
            } else {
                node->value = "time.now";
            }
            return node;
        } else if (kw.value == "sys") {
            // sys with flags: sys -o, sys --os, sys -a, sys --arch, etc.
            advance(); // consume 'sys'
            auto node = std::make_shared<ASTNode>();
            node->type = AST_FUNCTION_CALL;
            
            if (peek().value == "-" || peek().value == "--") {
                std::string flag = advance().value; // consume - or --
                if (match(TOKEN_IDENTIFIER) || match(TOKEN_KEYWORD)) {
                    flag += advance().value; // get flag name
                }
                
                // Map flags to function names
                if (flag == "-o" || flag == "--os") {
                    node->value = "sys.os";
                } else if (flag == "-a" || flag == "--arch") {
                    node->value = "sys.arch";
                } else if (flag == "-e" || flag == "--env") {
                    node->value = "sys.env";
                    // Parse env var name
                    if (match(TOKEN_ECHO)) {
                        auto argNode = std::make_shared<ASTNode>();
                        argNode->type = AST_STRING;
                        argNode->value = advance().value;
                        node->children.push_back(argNode);
                    }
                } else if (flag == "-x" || flag == "--exit") {
                    node->value = "sys.exit";
                    // Parse exit code
                    if (match(TOKEN_LPAREN)) {
                        advance();
                        if (match(TOKEN_NUMBER)) {
                            auto argNode = std::make_shared<ASTNode>();
                            argNode->type = AST_NUMBER;
                            argNode->value = advance().value;
                            node->children.push_back(argNode);
                        }
                        if (match(TOKEN_RPAREN)) advance();
                    }
                } else if (flag == "-w" || flag == "--sleep") {
                    node->value = "sleep";
                    // Parse ms
                    if (match(TOKEN_LPAREN)) {
                        advance();
                        if (match(TOKEN_NUMBER)) {
                            auto argNode = std::make_shared<ASTNode>();
                            argNode->type = AST_NUMBER;
                            argNode->value = advance().value;
                            node->children.push_back(argNode);
                        }
                        if (match(TOKEN_RPAREN)) advance();
                    }
                } else {
                    node->value = "sys.os";
                }
            } else {
                node->value = "sys.os";
            }
            return node;
        } else if (kw.value == "func") {
            return parseFunctionDef();
        } else if (kw.value == "check") {
            return parseCondition();
        } else if (kw.value == "import" || kw.value == "use") {
            return parseImport();
        } else if (kw.value == "export") {
            return parseExport();
        } else if (kw.value == "gmath") {
            // gmath with flags: gmath -s (16), gmath --sqrt (16), gmath (a) + (b), etc.
            auto node = std::make_shared<ASTNode>();
            node->type = AST_FUNCTION_CALL;
            node->value = "gmath";
            advance(); // consume 'gmath'
            
            // Check for flag syntax
            if (peek().value == "-" || peek().value == "--") {
                std::string flag = advance().value; // consume - or --
                if (match(TOKEN_IDENTIFIER) || match(TOKEN_KEYWORD)) {
                    flag += advance().value; // get flag name
                }
                
                // Map flags to operations
                std::string op = "";
                if (flag == "-s" || flag == "--sqrt") op = "sqrt";
                else if (flag == "-a" || flag == "--abs") op = "abs";
                else if (flag == "-n" || flag == "--sin") op = "sin";
                else if (flag == "-c" || flag == "--cos") op = "cos";
                else if (flag == "-t" || flag == "--tan") op = "tan";
                else if (flag == "-l" || flag == "--log") op = "log";
                else if (flag == "-e" || flag == "--exp") op = "exp";
                else if (flag == "-f" || flag == "--floor") op = "floor";
                else if (flag == "-i" || flag == "--ceil") op = "ceil";
                else if (flag == "-r" || flag == "--round") op = "round";
                else if (flag == "-p" || flag == "--pi") {
                    node->value = "gmath.pi";
                    return node;
                } else if (flag == "-E" || flag == "--e") {
                    node->value = "gmath.e";
                    return node;
                } else if (flag == "-m" || flag == "--min") op = "min";
                else if (flag == "-x" || flag == "--max") op = "max";
                else if (flag == "-o" || flag == "--mod") op = "mod";
                else if (flag == "-C" || flag == "--convert") {
                    // Unit conversion: gmath -C (value) 'from' 'to'
                    // e.g., gmath -C (100) 'cm' 'in'
                    node->value = "gmath.convert";
                    
                    // Parse value
                    if (match(TOKEN_LPAREN)) {
                        advance(); // consume (
                        if (match(TOKEN_NUMBER)) {
                            auto numNode = std::make_shared<ASTNode>();
                            numNode->type = AST_NUMBER;
                            numNode->value = advance().value;
                            node->children.push_back(numNode);
                        }
                        if (match(TOKEN_RPAREN)) advance(); // consume )
                    }
                    
                    // Parse 'from' unit
                    if (match(TOKEN_ECHO)) {
                        auto fromNode = std::make_shared<ASTNode>();
                        fromNode->type = AST_STRING;
                        fromNode->value = advance().value;
                        node->children.push_back(fromNode);
                    }
                    
                    // Parse 'to' unit
                    if (match(TOKEN_ECHO)) {
                        auto toNode = std::make_shared<ASTNode>();
                        toNode->type = AST_STRING;
                        toNode->value = advance().value;
                        node->children.push_back(toNode);
                    }
                    
                    return node;
                }
                
                if (!op.empty()) {
                    auto opNode = std::make_shared<ASTNode>();
                    opNode->type = AST_STRING;
                    opNode->value = op;
                    node->children.push_back(opNode);
                    
                    // Parse argument(s)
                    while (match(TOKEN_LPAREN)) {
                        advance(); // consume (
                        if (match(TOKEN_NUMBER)) {
                            auto numNode = std::make_shared<ASTNode>();
                            numNode->type = AST_NUMBER;
                            numNode->value = advance().value;
                            node->children.push_back(numNode);
                        }
                        if (match(TOKEN_RPAREN)) advance(); // consume )
                    }
                }
                return node;
            }
            
            // Parse first operand (number) - original syntax
            if (match(TOKEN_LPAREN)) {
                advance(); // consume (
                if (match(TOKEN_NUMBER)) {
                    auto numNode = std::make_shared<ASTNode>();
                    numNode->type = AST_NUMBER;
                    numNode->value = advance().value;
                    node->children.push_back(numNode);
                }
                if (match(TOKEN_RPAREN)) advance(); // consume )
            } else if (match(TOKEN_IDENTIFIER)) {
                // Unary operation like: gmath sqrt (16)
                auto opNode = std::make_shared<ASTNode>();
                opNode->type = AST_STRING;
                opNode->value = advance().value;
                node->children.push_back(opNode);
                
                if (match(TOKEN_LPAREN)) {
                    advance(); // consume (
                    if (match(TOKEN_NUMBER)) {
                        auto numNode = std::make_shared<ASTNode>();
                        numNode->type = AST_NUMBER;
                        numNode->value = advance().value;
                        node->children.push_back(numNode);
                    }
                    if (match(TOKEN_RPAREN)) advance(); // consume )
                }
                return node;
            }
            
            // Parse operator (+, -, *, /, %, ^)
            if (match(TOKEN_OPERATOR)) {
                auto opNode = std::make_shared<ASTNode>();
                opNode->type = AST_STRING;
                opNode->value = advance().value;
                node->children.push_back(opNode);
            }
            
            // Parse second operand
            if (match(TOKEN_LPAREN)) {
                advance(); // consume (
                if (match(TOKEN_NUMBER)) {
                    auto numNode = std::make_shared<ASTNode>();
                    numNode->type = AST_NUMBER;
                    numNode->value = advance().value;
                    node->children.push_back(numNode);
                }
                if (match(TOKEN_RPAREN)) advance(); // consume )
            }
            
            return node;
        } else if (kw.value == "add" || kw.value == "sub" || kw.value == "mul" || 
                   kw.value == "div" || kw.value == "mod" || kw.value == "rand" ||
                   kw.value == "len" || kw.value == "wait") {
            // Math and utility operations
            auto node = std::make_shared<ASTNode>();
            node->type = AST_FUNCTION_CALL;
            node->value = advance().value; // consume keyword
            
            // Parse {varname} = (value)
            if (match(TOKEN_STRING)) {
                auto varNode = std::make_shared<ASTNode>();
                varNode->type = AST_IDENTIFIER;
                varNode->value = advance().value;
                node->children.push_back(varNode);
            }
            
            if (match(TOKEN_ASSIGN)) {
                advance(); // consume =
            }
            
            if (match(TOKEN_LPAREN)) {
                advance(); // consume (
                if (match(TOKEN_NUMBER)) {
                    auto numNode = std::make_shared<ASTNode>();
                    numNode->type = AST_NUMBER;
                    numNode->value = advance().value;
                    node->children.push_back(numNode);
                } else if (match(TOKEN_STRING)) {
                    auto strNode = std::make_shared<ASTNode>();
                    strNode->type = AST_IDENTIFIER;
                    strNode->value = advance().value;
                    node->children.push_back(strNode);
                }
                if (match(TOKEN_RPAREN)) advance(); // consume )
            }
            
            return node;
        } else if (kw.value == "back") {
            // Return statement
            auto node = std::make_shared<ASTNode>();
            node->type = AST_FUNCTION_CALL;
            node->value = "back";
            advance(); // consume 'back'
            return node;
        } else if (kw.value == "stop" || kw.value == "skip") {
            // Loop control
            auto node = std::make_shared<ASTNode>();
            node->type = AST_FUNCTION_CALL;
            node->value = advance().value;
            return node;
        }
    }
    
    if (match(TOKEN_IDENTIFIER)) {
        // Check for Module.function syntax
        Token id = peek();
        size_t savedPos = pos;
        advance(); // consume identifier
        
        // Check if next is a dot (Module.function)
        if (peek().value == ".") {
            advance(); // consume .
            if (match(TOKEN_IDENTIFIER)) {
                std::string moduleName = id.value;
                std::string funcName = advance().value;
                
                auto node = std::make_shared<ASTNode>();
                node->type = AST_FUNCTION_CALL;
                node->value = "." + moduleName + "." + funcName;
                
                // Parse arguments (can be 'string', (number), or {variable})
                // Stop when we see another .Module.function call
                while (!match(TOKEN_EOF) && !match(TOKEN_KEYWORD) && peek().value != "!" && peek().value != "\"") {
                    // Check if this is the start of another .Module.function call
                    if (peek().type == TOKEN_OPERATOR && peek().value == ".") {
                        // Look ahead to see if it's another function call
                        size_t checkPos = pos;
                        advance(); // consume .
                        if (peek().type == TOKEN_IDENTIFIER) {
                            // This is another function call, restore and break
                            pos = checkPos;
                            break;
                        }
                        // Not an identifier after dot, restore and break
                        pos = checkPos;
                        break;
                    }
                    
                    if (match(TOKEN_ECHO)) {
                        auto argNode = std::make_shared<ASTNode>();
                        argNode->type = AST_STRING;
                        argNode->value = advance().value;
                        node->children.push_back(argNode);
                    } else if (match(TOKEN_STRING)) {
                        auto argNode = std::make_shared<ASTNode>();
                        argNode->type = AST_IDENTIFIER;
                        argNode->value = advance().value;
                        node->children.push_back(argNode);
                    } else if (match(TOKEN_LPAREN)) {
                        advance(); // consume (
                        if (match(TOKEN_NUMBER)) {
                            auto argNode = std::make_shared<ASTNode>();
                            argNode->type = AST_NUMBER;
                            argNode->value = advance().value;
                            node->children.push_back(argNode);
                        }
                        if (match(TOKEN_RPAREN)) advance(); // consume )
                    } else if (match(TOKEN_NUMBER)) {
                        auto argNode = std::make_shared<ASTNode>();
                        argNode->type = AST_NUMBER;
                        argNode->value = advance().value;
                        node->children.push_back(argNode);
                    } else {
                        break;
                    }
                }
                
                return node;
            }
        }
        
        // Not Module.function, restore and parse as regular function call
        pos = savedPos;
        return parseFunctionCall();
    }
    
    // Check for .Module.function or .Module.sub.function syntax (with leading dot)
    if (peek().value == ".") {
        advance(); // consume leading .
        if (match(TOKEN_IDENTIFIER)) {
            std::string moduleName = advance().value;
            std::string fullPath = "." + moduleName;
            
            // Keep consuming .identifier pairs for function name only
            // Stop at depth 2 (e.g., .Time.now, .String.upper)
            // Don't consume more than Module.function
            if (peek().value == ".") {
                size_t savedPos = pos;
                advance(); // consume .
                if (match(TOKEN_IDENTIFIER) || match(TOKEN_KEYWORD)) {
                    fullPath += "." + advance().value;
                } else {
                    pos = savedPos;
                }
            }
            
            auto node = std::make_shared<ASTNode>();
            node->type = AST_FUNCTION_CALL;
            node->value = fullPath;
            
            // Parse arguments - stop at newline-starting . or keywords
            while (!match(TOKEN_EOF) && !match(TOKEN_KEYWORD) && peek().value != "!" && peek().value != "\"") {
                // Check if this is the start of another .Module.function call
                if (peek().type == TOKEN_OPERATOR && peek().value == ".") {
                    break; // New function call on next line
                }
                
                if (match(TOKEN_ECHO)) {
                    auto argNode = std::make_shared<ASTNode>();
                    argNode->type = AST_STRING;
                    argNode->value = advance().value;
                    node->children.push_back(argNode);
                } else if (match(TOKEN_STRING)) {
                    auto argNode = std::make_shared<ASTNode>();
                    argNode->type = AST_IDENTIFIER;
                    argNode->value = advance().value;
                    node->children.push_back(argNode);
                } else if (match(TOKEN_LPAREN)) {
                    advance(); // consume (
                    if (match(TOKEN_NUMBER)) {
                        auto argNode = std::make_shared<ASTNode>();
                        argNode->type = AST_NUMBER;
                        argNode->value = advance().value;
                        node->children.push_back(argNode);
                    }
                    if (match(TOKEN_RPAREN)) advance(); // consume )
                } else if (match(TOKEN_NUMBER)) {
                    auto argNode = std::make_shared<ASTNode>();
                    argNode->type = AST_NUMBER;
                    argNode->value = advance().value;
                    node->children.push_back(argNode);
                } else if (peek().value == "-" || peek().value == "--") {
                    std::string flag = advance().value;
                    if (match(TOKEN_IDENTIFIER)) {
                        flag += advance().value;
                    }
                    auto argNode = std::make_shared<ASTNode>();
                    argNode->type = AST_STRING;
                    argNode->value = flag;
                    node->children.push_back(argNode);
                } else if (peek().value == "&") {
                    advance(); // consume &
                    if (match(TOKEN_IDENTIFIER)) {
                        std::string propName = advance().value;
                        if (peek().value == ".") {
                            advance();
                            if (match(TOKEN_IDENTIFIER)) {
                                propName += "." + advance().value;
                            }
                        }
                        auto propNode = std::make_shared<ASTNode>();
                        propNode->type = AST_IDENTIFIER;
                        propNode->value = propName;
                        node->children.push_back(propNode);
                        
                        if (peek().value == "=") {
                            advance();
                            if (match(TOKEN_IDENTIFIER)) {
                                auto valNode = std::make_shared<ASTNode>();
                                valNode->type = AST_IDENTIFIER;
                                valNode->value = advance().value;
                                node->children.push_back(valNode);
                            } else if (match(TOKEN_ECHO)) {
                                auto valNode = std::make_shared<ASTNode>();
                                valNode->type = AST_STRING;
                                valNode->value = advance().value;
                                node->children.push_back(valNode);
                            } else if (match(TOKEN_STRING)) {
                                auto valNode = std::make_shared<ASTNode>();
                                valNode->type = AST_IDENTIFIER;
                                valNode->value = advance().value;
                                node->children.push_back(valNode);
                            }
                        }
                    }
                } else {
                    break;
                }
            }
            
            return node;
        }
    }
    
    throw std::runtime_error("Incomplete sentence or function");
}

std::shared_ptr<ASTNode> Parser::parseFunctionCall() {
    auto node = std::make_shared<ASTNode>();
    node->type = AST_FUNCTION_CALL;
    Token funcToken = advance();
    
    if (funcToken.value == "peat") {
        node->value = "peat";
        
        // Check if next is a variable reference {name} or identifier
        if (match(TOKEN_STRING)) {
            // It's {name} - treat as variable reference
            auto varNode = std::make_shared<ASTNode>();
            varNode->type = AST_IDENTIFIER;
            varNode->value = advance().value;
            node->children.push_back(varNode);
        } else if (match(TOKEN_LPAREN)) {
            // It's (number)
            advance(); // consume (
            auto numNode = std::make_shared<ASTNode>();
            numNode->type = AST_NUMBER;
            if (match(TOKEN_NUMBER)) {
                numNode->value = advance().value;
            }
            if (match(TOKEN_RPAREN)) advance(); // consume )
            node->children.push_back(numNode);
        } else if (match(TOKEN_KEYWORD) && peek().value == "msg") {
            // It's msg keyword
            auto varNode = std::make_shared<ASTNode>();
            varNode->type = AST_IDENTIFIER;
            varNode->value = advance().value;
            node->children.push_back(varNode);
        } else {
            node->children.push_back(parseExpression());
        }
        
        return node;
    }
    
    // Handle inner functions (no . prefix needed)
    // String functions: upper, lower, trim, rev
    // Time functions: now, unix, year, month, day, hour
    // System functions: os, arch, sleep
    // Math functions: sqrt, abs, sin, cos, tan, floor, ceil, round, pi, e
    if (funcToken.value == "upper" || funcToken.value == "lower" || 
        funcToken.value == "trim" || funcToken.value == "rev") {
        node->value = funcToken.value;
        // Parse string argument: 'text'
        if (match(TOKEN_ECHO)) {
            auto argNode = std::make_shared<ASTNode>();
            argNode->type = AST_STRING;
            argNode->value = advance().value;
            node->children.push_back(argNode);
        } else if (match(TOKEN_STRING)) {
            auto argNode = std::make_shared<ASTNode>();
            argNode->type = AST_IDENTIFIER;
            argNode->value = advance().value;
            node->children.push_back(argNode);
        }
        return node;
    }
    
    // Time functions (no arguments)
    if (funcToken.value == "now" || funcToken.value == "unix" ||
        funcToken.value == "year" || funcToken.value == "month" ||
        funcToken.value == "day" || funcToken.value == "hour") {
        node->value = funcToken.value;
        return node;
    }
    
    // System functions
    if (funcToken.value == "os" || funcToken.value == "arch") {
        node->value = funcToken.value;
        return node;
    }
    
    // Math constants (no arguments)
    if (funcToken.value == "pi" || funcToken.value == "e") {
        node->value = funcToken.value;
        return node;
    }
    
    // Math functions with number argument
    if (funcToken.value == "sqrt" || funcToken.value == "abs" ||
        funcToken.value == "sin" || funcToken.value == "cos" ||
        funcToken.value == "tan" || funcToken.value == "floor" ||
        funcToken.value == "ceil" || funcToken.value == "round") {
        node->value = funcToken.value;
        // Parse number argument: (num)
        if (match(TOKEN_LPAREN)) {
            advance(); // consume (
            if (match(TOKEN_NUMBER)) {
                auto argNode = std::make_shared<ASTNode>();
                argNode->type = AST_NUMBER;
                argNode->value = advance().value;
                node->children.push_back(argNode);
            }
            if (match(TOKEN_RPAREN)) advance(); // consume )
        } else if (match(TOKEN_NUMBER)) {
            auto argNode = std::make_shared<ASTNode>();
            argNode->type = AST_NUMBER;
            argNode->value = advance().value;
            node->children.push_back(argNode);
        }
        return node;
    }
    
    if (funcToken.value == "sleep") {
        node->value = funcToken.value;
        // Parse number argument: (ms)
        if (match(TOKEN_LPAREN)) {
            advance(); // consume (
            if (match(TOKEN_NUMBER)) {
                auto argNode = std::make_shared<ASTNode>();
                argNode->type = AST_NUMBER;
                argNode->value = advance().value;
                node->children.push_back(argNode);
            }
            if (match(TOKEN_RPAREN)) advance(); // consume )
        } else if (match(TOKEN_NUMBER)) {
            auto argNode = std::make_shared<ASTNode>();
            argNode->type = AST_NUMBER;
            argNode->value = advance().value;
            node->children.push_back(argNode);
        }
        return node;
    }
    
    node->value = funcToken.value;
    
    // Check if it's a simple function call (no parentheses) - user-defined function
    if (!match(TOKEN_LPAREN)) {
        // It's a simple function call like: greet
        return node;
    }
    advance(); // consume (
    
    while (!match(TOKEN_RPAREN) && !match(TOKEN_EOF)) {
        node->children.push_back(parseExpression());
        if (match(TOKEN_COMMA)) advance();
    }
    
    if (match(TOKEN_RPAREN)) advance();
    return node;
}

std::shared_ptr<ASTNode> Parser::parseVarDecl() {
    auto node = std::make_shared<ASTNode>();
    node->type = AST_VAR_DECL;
    
    advance(); // consume 'str' or 'hold'
    
    // Check if it's msg (built-in keyword without {})
    if (match(TOKEN_KEYWORD) && peek().value == "msg") {
        node->value = "msg";
        advance(); // consume msg
    }
    // Expect {name} for str or (name) for hold
    else if (match(TOKEN_STRING)) {
        node->value = advance().value;
    } else if (match(TOKEN_LPAREN)) {
        advance(); // consume (
        if (match(TOKEN_IDENTIFIER)) {
            node->value = advance().value;
        } else if (match(TOKEN_NUMBER)) {
            // Handle case where variable name is a number (shouldn't happen but let's be safe)
            node->value = "var_" + advance().value;
        }
        if (match(TOKEN_RPAREN)) advance(); // consume )
    } else if (match(TOKEN_IDENTIFIER)) {
        // Direct identifier without () or {}
        node->value = advance().value;
    }
    
    // Check for =
    if (match(TOKEN_ASSIGN)) {
        advance(); // consume '='
        
        // Check if next is 'repeat'
        if (match(TOKEN_KEYWORD) && peek().value == "repeat") {
            advance(); // consume 'repeat'
            
            // Parse repeat: 'message' & t.s = count
            auto strNode = parseExpression();
            
            // Check for & t.s = count
            if (match(TOKEN_OPERATOR) && peek().value == "&") {
                advance(); // consume &
                
                // Check for time unit
                if (match(TOKEN_KEYWORD)) {
                    Token timeUnit = peek();
                    if (timeUnit.value.length() >= 2 && timeUnit.value[0] == 't' && timeUnit.value[1] == '.') {
                        advance(); // consume time unit
                        
                        // Expect = count
                        if (match(TOKEN_ASSIGN)) {
                            advance(); // consume =
                            auto countNode = parseExpression();
                            
                            // Create repeat operation
                            auto repeatNode = std::make_shared<ASTNode>();
                            repeatNode->type = AST_STR_OP;
                            repeatNode->value = "repeat";
                            repeatNode->children.push_back(strNode);
                            repeatNode->children.push_back(countNode);
                            
                            node->children.push_back(repeatNode);
                            
                            // Check for && exit
                            if (match(TOKEN_OPERATOR) && peek().value == "&&") {
                                advance(); // consume '&&'
                                if (match(TOKEN_KEYWORD) && peek().value == "exit") {
                                    advance(); // consume 'exit'
                                    auto exitNode = std::make_shared<ASTNode>();
                                    exitNode->type = AST_EXIT;
                                    if (match(TOKEN_LPAREN)) {
                                        advance(); // consume (
                                        if (match(TOKEN_NUMBER)) {
                                            exitNode->value = advance().value;
                                        }
                                        if (match(TOKEN_RPAREN)) advance(); // consume )
                                    }
                                    node->children.push_back(exitNode);
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // Parse value with () for numbers
            if (match(TOKEN_LPAREN)) {
                advance(); // consume (
                auto valNode = std::make_shared<ASTNode>();
                if (match(TOKEN_NUMBER)) {
                    valNode->type = AST_NUMBER;
                    valNode->value = advance().value;
                } else if (match(TOKEN_STRING) || match(TOKEN_ECHO)) {
                    valNode->type = AST_STRING;
                    valNode->value = advance().value;
                }
                if (match(TOKEN_RPAREN)) advance(); // consume )
                node->children.push_back(valNode);
            } else {
                node->children.push_back(parseExpression());
            }
            
            // Check for && exit (without repeat)
            if (match(TOKEN_OPERATOR) && peek().value == "&&") {
                advance(); // consume '&&'
                if (match(TOKEN_KEYWORD) && peek().value == "exit") {
                    advance(); // consume 'exit'
                    auto exitNode = std::make_shared<ASTNode>();
                    exitNode->type = AST_EXIT;
                    if (match(TOKEN_LPAREN)) {
                        advance(); // consume (
                        if (match(TOKEN_NUMBER)) {
                            exitNode->value = advance().value;
                        }
                        if (match(TOKEN_RPAREN)) advance(); // consume )
                    }
                    node->children.push_back(exitNode);
                }
            }
        }
    }
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseExpression() {
    auto node = std::make_shared<ASTNode>();
    Token token = advance();
    
    if (token.type == TOKEN_NUMBER) {
        node->type = AST_NUMBER;
        node->value = token.value;
    } else if (token.type == TOKEN_STRING || token.type == TOKEN_ECHO) {
        node->type = AST_STRING;
        node->value = token.value;
    } else if (token.type == TOKEN_IDENTIFIER) {
        node->type = AST_IDENTIFIER;
        node->value = token.value;
    }
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseLoop() {
    auto node = std::make_shared<ASTNode>();
    node->type = AST_LOOP;
    Token loopToken = advance(); // consume 'repeat' or 'turn'
    
    // Parse: repeat 'message' & t.s = count
    if (loopToken.value == "repeat") {
        // Get message
        auto msgNode = parseExpression();
        node->children.push_back(msgNode);
        
        // Check for & with time unit
        if (match(TOKEN_OPERATOR) && peek().value == "&") {
            advance(); // consume &
            
            // Check for time unit starting with 't.'
            if (match(TOKEN_KEYWORD)) {
                Token timeUnit = peek();
                if (timeUnit.value.length() >= 2 && timeUnit.value[0] == 't' && timeUnit.value[1] == '.') {
                    advance(); // consume time unit
                    
                    // Expect = count
                    if (match(TOKEN_ASSIGN)) {
                        advance(); // consume =
                        if (match(TOKEN_LPAREN)) {
                            advance(); // consume (
                            if (match(TOKEN_NUMBER)) {
                                node->value = advance().value + "&" + timeUnit.value;
                            }
                            if (match(TOKEN_RPAREN)) advance(); // consume )
                        } else if (match(TOKEN_NUMBER)) {
                            node->value = advance().value + "&" + timeUnit.value;
                        }
                    } else {
                        throw std::runtime_error("Expected = after time unit");
                    }
                } else {
                    throw std::runtime_error("Unknown unit of 't': expected format t.suffix (e.g., t.s, t.ms)");
                }
            } else {
                throw std::runtime_error("Unknown unit of 't': expected time unit after &");
            }
        }
    } else if (loopToken.value == "turn") {
        // turn N { ... }
        if (match(TOKEN_LPAREN)) {
            advance(); // consume (
            if (match(TOKEN_NUMBER)) {
                node->value = advance().value;
            }
            if (match(TOKEN_RPAREN)) advance(); // consume )
        } else if (match(TOKEN_NUMBER)) {
            node->value = advance().value;
        }
        
        // Check for block syntax
        if (match(TOKEN_LBRACE)) {
            advance(); // consume {
            while (!match(TOKEN_RBRACE) && !match(TOKEN_EOF)) {
                auto stmt = parseStatement();
                if (stmt) node->children.push_back(stmt);
            }
            if (match(TOKEN_RBRACE)) {
                advance(); // consume }
            } else {
                throw std::runtime_error("Incomplete sentence or function: expected }");
            }
        }
    }
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseFunctionDef() {
    auto node = std::make_shared<ASTNode>();
    node->type = AST_FUNC_DEF;
    advance(); // consume 'func'
    
    if (match(TOKEN_IDENTIFIER)) {
        node->value = advance().value;
    }
    
    // Parse function body { ... }
    if (match(TOKEN_LBRACE)) {
        advance(); // consume {
        while (!match(TOKEN_RBRACE) && !match(TOKEN_EOF)) {
            auto stmt = parseStatement();
            if (stmt) node->children.push_back(stmt);
        }
        if (match(TOKEN_RBRACE)) {
            advance(); // consume }
        }
    }
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseCondition() {
    auto node = std::make_shared<ASTNode>();
    node->type = AST_CONDITION;
    advance(); // consume 'check'
    
    // Parse condition expression
    node->children.push_back(parseExpression());
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseImport() {
    auto node = std::make_shared<ASTNode>();
    node->type = AST_IMPORT;
    advance(); // consume 'import' or 'use'
    
    // Get module name - can be compound like G_Web.Kit
    std::string moduleName = "";
    if (match(TOKEN_IDENTIFIER) || match(TOKEN_STRING)) {
        moduleName = advance().value;
        
        // Check for compound module names like G_Web.Kit
        // Only continue if:
        // 1. Current name ends with underscore pattern (like G_Web)
        // 2. Next token is a dot followed by a known module extension (Kit, Lib, etc.)
        // NOT a short abbreviation like GR, GS which are likely function prefixes
        if (moduleName.find('_') != std::string::npos && 
            match(TOKEN_OPERATOR) && peek().value == ".") {
            size_t savedPos = pos;
            advance(); // consume '.'
            if (match(TOKEN_IDENTIFIER)) {
                std::string nextPart = peek().value;
                // Only consume if it looks like a module extension (Kit, Lib, Library, etc.)
                // NOT a short prefix like GR, GS, W2G which are function call prefixes
                if (nextPart.length() >= 3 && nextPart[0] >= 'A' && nextPart[0] <= 'Z' &&
                    (nextPart == "Kit" || nextPart == "Lib" || nextPart == "Library" ||
                     nextPart == "Core" || nextPart == "Utils" || nextPart == "Tools")) {
                    moduleName += "." + advance().value;
                } else {
                    // This is likely a function call prefix, not a module extension
                    pos = savedPos;
                }
            } else {
                pos = savedPos;
            }
        }
    }
    node->value = moduleName;
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseExport() {
    auto node = std::make_shared<ASTNode>();
    node->type = AST_EXPORT;
    advance(); // consume 'export'
    
    // Get what to export (function or variable name)
    if (match(TOKEN_IDENTIFIER) || match(TOKEN_STRING)) {
        node->value = advance().value;
    }
    
    return node;
}

std::shared_ptr<ASTNode> Parser::parseIntCmd() {
    auto node = std::make_shared<ASTNode>();
    node->type = AST_INT_CMD;
    advance(); // consume 'int'
    
    // int command syntax:
    // int load 'file.intcnf'     - Load config file
    // int pack 'file.intcnf'     - Package config to .intpkf
    // int run 'file.intpkf'      - Run packaged commands
    // int cmd 'name' { ... }     - Define a command
    // int exec 'name'            - Execute a command
    // int list                   - List available commands
    
    std::string subCmd = "";
    if (match(TOKEN_IDENTIFIER) || match(TOKEN_KEYWORD)) {
        subCmd = advance().value;
    }
    node->value = subCmd;
    
    // For 'list' command, no arguments needed
    if (subCmd == "list") {
        return node;
    }
    
    // Parse arguments
    while (!match(TOKEN_EOF) && !match(TOKEN_KEYWORD) && !match(TOKEN_INT_CMD) && peek().value != "!" && peek().value != "\"") {
        if (match(TOKEN_ECHO)) {
            auto argNode = std::make_shared<ASTNode>();
            argNode->type = AST_STRING;
            argNode->value = advance().value;
            node->children.push_back(argNode);
        } else if (match(TOKEN_STRING)) {
            auto argNode = std::make_shared<ASTNode>();
            argNode->type = AST_IDENTIFIER;
            argNode->value = advance().value;
            node->children.push_back(argNode);
        } else if (match(TOKEN_LBRACE)) {
            advance(); // consume {
            // Parse command body
            auto bodyNode = std::make_shared<ASTNode>();
            bodyNode->type = AST_BLOCK;
            while (!match(TOKEN_RBRACE) && !match(TOKEN_EOF)) {
                auto stmt = parseStatement();
                if (stmt) {
                    bodyNode->children.push_back(stmt);
                }
            }
            if (match(TOKEN_RBRACE)) advance(); // consume }
            node->children.push_back(bodyNode);
            break;
        } else {
            break;
        }
    }
    
    return node;
}
