#ifndef PARSER_H
#define PARSER_H

#include "lexer.h"
#include <memory>
#include <map>

enum ASTNodeType {
    AST_PROGRAM,
    AST_FUNCTION_CALL,
    AST_VAR_DECL,
    AST_IDENTIFIER,
    AST_NUMBER,
    AST_STRING,
    AST_BLOCK,
    AST_LOOP,
    AST_EXIT,
    AST_FUNC_DEF,
    AST_CONDITION,
    AST_MATH_OP,
    AST_STR_OP,
    AST_IMPORT,
    AST_EXPORT,
    AST_INT_CMD
};

struct ASTNode {
    ASTNodeType type;
    std::string value;
    std::vector<std::shared_ptr<ASTNode>> children;
};

class Parser {
private:
    std::vector<Token> tokens;
    size_t pos;
    
public:
    Parser(const std::vector<Token>& toks);
    std::shared_ptr<ASTNode> parse();
    
private:
    Token peek();
    Token advance();
    bool match(TokenType type);
    std::shared_ptr<ASTNode> parseStatement();
    std::shared_ptr<ASTNode> parseFunctionCall();
    std::shared_ptr<ASTNode> parseVarDecl();
    std::shared_ptr<ASTNode> parseExpression();
    std::shared_ptr<ASTNode> parseLoop();
    std::shared_ptr<ASTNode> parseFunctionDef();
    std::shared_ptr<ASTNode> parseCondition();
    std::shared_ptr<ASTNode> parseImport();
    std::shared_ptr<ASTNode> parseExport();
    std::shared_ptr<ASTNode> parseIntCmd();
};

#endif
