import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
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
            const compilerPath = config.get<string>('compilerPath', 'geneia');

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

            const docs: { [key: string]: string } = {
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

export function deactivate() {}
