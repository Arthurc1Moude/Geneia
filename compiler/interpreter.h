#ifndef INTERPRETER_H
#define INTERPRETER_H

#include "parser.h"
#include <map>
#include <string>
#include <variant>

using Value = std::variant<int, double, std::string>;

class Interpreter {
private:
    std::map<std::string, Value> variables;
    std::map<std::string, std::shared_ptr<ASTNode>> functions;
    std::map<std::string, bool> importedModules;
    std::map<std::string, std::map<std::string, Value>> exportedModules;
    std::map<std::string, std::shared_ptr<ASTNode>> intCommands;  // INT Inc. custom commands
    bool shouldExit;
    int exitCode;
    
public:
    Interpreter() : shouldExit(false), exitCode(0) {}
    void execute(std::shared_ptr<ASTNode> ast);
    
private:
    void executeNode(std::shared_ptr<ASTNode> node);
    Value evaluateExpression(std::shared_ptr<ASTNode> node);
    void executeFunctionCall(std::shared_ptr<ASTNode> node);
    void executeVarDecl(std::shared_ptr<ASTNode> node);
    void executeLoop(std::shared_ptr<ASTNode> node);
    void executeFunctionDef(std::shared_ptr<ASTNode> node);
    void executeCondition(std::shared_ptr<ASTNode> node);
    void executeImport(std::shared_ptr<ASTNode> node);
    void executeExport(std::shared_ptr<ASTNode> node);
    void executeIntCmd(std::shared_ptr<ASTNode> node);
    bool loadGeneiaModule(const std::string& filename);
    bool loadIntConfig(const std::string& filename);
    bool packIntConfig(const std::string& configFile, const std::string& outputFile);
    bool runIntPackage(const std::string& filename);
    std::string strRepeat(const std::string& str, int count);
};

#endif
