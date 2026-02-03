"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const cp = __importStar(require("child_process"));
const path = __importStar(require("path"));
function activate(context) {
    console.log('Geneia extension activated');
    // Run command
    const runCommand = vscode.commands.registerCommand('geneia.run', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active Geneia file');
            return;
        }
        const document = editor.document;
        if (document.languageId !== 'geneia') {
            vscode.window.showErrorMessage('Not a Geneia file');
            return;
        }
        // Save file first
        document.save().then(() => {
            const filePath = document.fileName;
            const config = vscode.workspace.getConfiguration('geneia');
            const compilerPath = config.get('compilerPath', 'geneia');
            // Create output channel
            const outputChannel = vscode.window.createOutputChannel('Geneia');
            outputChannel.show();
            outputChannel.appendLine(`Running: ${filePath}`);
            outputChannel.appendLine('---');
            // Run the file
            const process = cp.spawn(compilerPath, [filePath], {
                cwd: path.dirname(filePath)
            });
            process.stdout.on('data', (data) => {
                outputChannel.append(data.toString());
            });
            process.stderr.on('data', (data) => {
                outputChannel.append(data.toString());
            });
            process.on('close', (code) => {
                outputChannel.appendLine('---');
                outputChannel.appendLine(`Exit code: ${code}`);
            });
            process.on('error', (err) => {
                vscode.window.showErrorMessage(`Failed to run Geneia: ${err.message}`);
            });
        });
    });
    // Compile command
    const compileCommand = vscode.commands.registerCommand('geneia.compile', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active Geneia file');
            return;
        }
        const document = editor.document;
        if (document.languageId !== 'geneia') {
            vscode.window.showErrorMessage('Not a Geneia file');
            return;
        }
        document.save().then(() => {
            vscode.window.showInformationMessage('Geneia file compiled successfully');
        });
    });
    // Hover provider for keywords
    const hoverProvider = vscode.languages.registerHoverProvider('geneia', {
        provideHover(document, position) {
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
            const docs = {
                'peat': 'Print output to console\n\nUsage: `peat \'message\'` or `peat {variable}`',
                'str': 'String operations\n\nFlags:\n- `-u` / `--upper`: uppercase\n- `-l` / `--lower`: lowercase\n- `-t` / `--trim`: trim whitespace\n- `-r` / `--rev`: reverse',
                'hold': 'Declare a numeric variable\n\nUsage: `hold {name} = (value)`',
                'time': 'Time operations\n\nFlags:\n- `-n` / `--now`: current datetime\n- `-u` / `--unix`: unix timestamp\n- `-y` / `--year`: current year\n- `-m` / `--month`: current month\n- `-d` / `--day`: current day\n- `-h` / `--hour`: current hour',
                'sys': 'System operations\n\nFlags:\n- `-o` / `--os`: operating system\n- `-a` / `--arch`: architecture\n- `-w` / `--sleep`: sleep ms',
                'gmath': 'Math operations\n\nFlags:\n- `-s` / `--sqrt`: square root\n- `-a` / `--abs`: absolute value\n- `-f` / `--floor`: floor\n- `-i` / `--ceil`: ceiling\n- `-r` / `--round`: round\n- `-p` / `--pi`: pi constant\n- `-E` / `--e`: euler number\n- `-C` / `--convert`: unit conversion',
                'func': 'Define a function\n\nUsage: `func name { ... }`',
                'turn': 'Loop N times\n\nUsage: `turn (count) { ... }`',
                'repeat': 'Repeat with time unit\n\nUsage: `repeat \'message\' & t.s = (count)`',
                'exit': 'Exit program\n\nUsage: `exit (code)`',
                'import': 'Import a module\n\nUsage: `import ModuleName`',
                'use': 'Use a module\n\nUsage: `use ModuleName`'
            };
            if (docs[word]) {
                return new vscode.Hover(new vscode.MarkdownString(docs[word]));
            }
            return null;
        }
    });
    context.subscriptions.push(runCommand, compileCommand, hoverProvider);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map