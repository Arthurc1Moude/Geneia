#ifndef LEXER_H
#define LEXER_H

#include <string>
#include <vector>

enum TokenType {
    TOKEN_KEYWORD,
    TOKEN_IDENTIFIER,
    TOKEN_NUMBER,
    TOKEN_STRING,
    TOKEN_ECHO,
    TOKEN_TIP,
    TOKEN_COMMENT,
    TOKEN_OPERATOR,
    TOKEN_LPAREN,
    TOKEN_RPAREN,
    TOKEN_LBRACE,
    TOKEN_RBRACE,
    TOKEN_LBRACKET,
    TOKEN_RBRACKET,
    TOKEN_SEMICOLON,
    TOKEN_COMMA,
    TOKEN_ASSIGN,
    TOKEN_INT_CMD,
    TOKEN_EOF
};

struct Token {
    TokenType type;
    std::string value;
    int line;
    int column;
};

class Lexer {
private:
    std::string source;
    size_t pos;
    int line;
    int column;
    
public:
    Lexer(const std::string& src);
    std::vector<Token> tokenize();
    Token nextToken();
    
private:
    char peek();
    char advance();
    void skipWhitespace();
    Token readString();
    Token readNumber();
    Token readIdentifier();
    Token readComment();
};

#endif
