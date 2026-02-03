#include "lexer.h"
#include <cctype>

Lexer::Lexer(const std::string& src) : source(src), pos(0), line(1), column(1) {}

char Lexer::peek() {
    if (pos >= source.length()) return '\0';
    return source[pos];
}

char Lexer::advance() {
    if (pos >= source.length()) return '\0';
    char c = source[pos++];
    if (c == '\n') {
        line++;
        column = 1;
    } else {
        column++;
    }
    return c;
}

void Lexer::skipWhitespace() {
    while (isspace(peek())) advance();
}

Token Lexer::readString() {
    Token token = {TOKEN_STRING, "", line, column};
    char openChar = peek();
    
    if (openChar == '"') {
        // "" for running tips
        token.type = TOKEN_TIP;
        advance(); // skip opening quote
        while (peek() != '"' && peek() != '\0') {
            token.value += advance();
        }
        advance(); // skip closing quote
    } else if (openChar == '\'') {
        // '' for echo messages
        token.type = TOKEN_ECHO;
        advance(); // skip opening quote
        while (peek() != '\'' && peek() != '\0') {
            token.value += advance();
        }
        advance(); // skip closing quote
    } else if (openChar == '{') {
        // {} for strings
        advance(); // skip opening brace
        while (peek() != '}' && peek() != '\0') {
            token.value += advance();
        }
        advance(); // skip closing brace
    }
    
    return token;
}

Token Lexer::readComment() {
    Token token = {TOKEN_COMMENT, "", line, column};
    advance(); // skip opening !
    while (peek() != '!' && peek() != '\0' && peek() != '\n') {
        token.value += advance();
    }
    if (peek() == '!') advance(); // skip closing !
    return token;
}

Token Lexer::readNumber() {
    Token token = {TOKEN_NUMBER, "", line, column};
    while (isdigit(peek()) || peek() == '.') {
        token.value += advance();
    }
    return token;
}

Token Lexer::readIdentifier() {
    Token token = {TOKEN_IDENTIFIER, "", line, column};
    
    // Check for time unit starting with 't.'
    if (peek() == 't' && pos + 1 < source.length() && source[pos + 1] == '.') {
        token.value += advance(); // t
        token.value += advance(); // .
        while (isalpha(peek())) {
            token.value += advance();
        }
        token.type = TOKEN_KEYWORD;
        return token;
    }
    
    while (isalnum(peek()) || peek() == '_') {
        token.value += advance();
    }
    
    // Check for .Module.function syntax (module call with leading dot)
    // This is handled in parser, just recognize the identifier here
    
    if (token.value == "hold" || token.value == "as" || token.value == "be" ||
        token.value == "when" || token.value == "loop" || token.value == "give" ||
        token.value == "make" || token.value == "call" || token.value == "done" ||
        token.value == "take" || token.value == "send" || token.value == "get" ||
        token.value == "repeat" || token.value == "exit" || token.value == "var" ||
        token.value == "str" || token.value == "func" || token.value == "back" || 
        token.value == "check" || token.value == "math" || token.value == "join" || 
        token.value == "split" || token.value == "size" || token.value == "push" || 
        token.value == "pop" || token.value == "peat" || token.value == "turn" || 
        token.value == "msg" || token.value == "import" || token.value == "from" || 
        token.value == "use" || token.value == "export" ||
        token.value == "add" || token.value == "sub" || token.value == "mul" ||
        token.value == "div" || token.value == "mod" || token.value == "rand" ||
        token.value == "len" || token.value == "wait" || token.value == "stop" ||
        token.value == "skip" || token.value == "each" || token.value == "list" ||
        token.value == "set" || token.value == "del" || token.value == "has" ||
        token.value == "gmath" || token.value == "time" || token.value == "sys" ||
        token.value == "upper" || token.value == "lower" || token.value == "trim" ||
        token.value == "rev" || token.value == "now" || token.value == "unix" ||
        token.value == "year" || token.value == "month" || token.value == "day" ||
        token.value == "hour" || token.value == "os" || token.value == "arch" ||
        token.value == "sleep" ||
        token.value == "sqrt" || token.value == "abs" || token.value == "sin" ||
        token.value == "cos" || token.value == "tan" || token.value == "floor" ||
        token.value == "ceil" || token.value == "round" || token.value == "pi" ||
        token.value == "e") {
        token.type = TOKEN_KEYWORD;
    }
    
    // Check for 'int' command keyword
    if (token.value == "int") {
        token.type = TOKEN_INT_CMD;
    }
    
    return token;
}

Token Lexer::nextToken() {
    skipWhitespace();
    
    Token token = {TOKEN_EOF, "", line, column};
    char c = peek();
    
    if (c == '\0') return token;
    if (c == '!') return readComment();
    if (c == '"') return readString();
    if (c == '\'') return readString();
    if (c == '{' && pos + 1 < source.length() && !isspace(source[pos + 1])) {
        // Check if it's a string literal {text}
        size_t tempPos = pos + 1;
        bool isStringLiteral = false;
        while (tempPos < source.length() && source[tempPos] != '}' && source[tempPos] != '\n') {
            if (!isalnum(source[tempPos]) && source[tempPos] != ' ' && source[tempPos] != '_') {
                break;
            }
            tempPos++;
        }
        if (tempPos < source.length() && source[tempPos] == '}') {
            isStringLiteral = true;
        }
        if (isStringLiteral) return readString();
    }
    if (isdigit(c)) return readNumber();
    if (isalpha(c) || c == '_') return readIdentifier();
    
    token.column = column;
    advance();
    
    switch (c) {
        case '(': token.type = TOKEN_LPAREN; token.value = "("; break;
        case ')': token.type = TOKEN_RPAREN; token.value = ")"; break;
        case '{': token.type = TOKEN_LBRACE; token.value = "{"; break;
        case '}': token.type = TOKEN_RBRACE; token.value = "}"; break;
        case '[': token.type = TOKEN_LBRACKET; token.value = "["; break;
        case ']': token.type = TOKEN_RBRACKET; token.value = "]"; break;
        case ';': token.type = TOKEN_SEMICOLON; token.value = ";"; break;
        case ',': token.type = TOKEN_COMMA; token.value = ","; break;
        case '=': token.type = TOKEN_ASSIGN; token.value = "="; break;
        case '+': token.type = TOKEN_OPERATOR; token.value = "+"; break;
        case '-':
            if (peek() == '-') {
                advance();
                token.type = TOKEN_OPERATOR;
                token.value = "--";
            } else {
                token.type = TOKEN_OPERATOR;
                token.value = "-";
            }
            break;
        case '*': token.type = TOKEN_OPERATOR; token.value = "*"; break;
        case '/': token.type = TOKEN_OPERATOR; token.value = "/"; break;
        case '%': token.type = TOKEN_OPERATOR; token.value = "%"; break;
        case '^': token.type = TOKEN_OPERATOR; token.value = "^"; break;
        case '?':
            if (peek() == '?') {
                advance();
                token.type = TOKEN_OPERATOR;
                token.value = "??";
            } else {
                token.type = TOKEN_OPERATOR;
                token.value = "?";
            }
            break;
        case '&':
            if (peek() == '&') {
                advance();
                token.type = TOKEN_OPERATOR;
                token.value = "&&";
            } else {
                token.type = TOKEN_OPERATOR;
                token.value = "&";
            }
            break;
        case '.':
            // Check for .Module.function syntax
            token.type = TOKEN_OPERATOR;
            token.value = ".";
            break;
        default: token.type = TOKEN_OPERATOR; token.value = c; break;
    }
    
    return token;
}

std::vector<Token> Lexer::tokenize() {
    std::vector<Token> tokens;
    Token token;
    do {
        token = nextToken();
        tokens.push_back(token);
    } while (token.type != TOKEN_EOF);
    return tokens;
}
