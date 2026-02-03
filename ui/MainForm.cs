using System;
using System.Drawing;
using System.Windows.Forms;
using System.Diagnostics;
using System.IO;

namespace GeneiaUI
{
    public class MainForm : Form
    {
        private TextBox codeEditor = null!;
        private TextBox outputBox = null!;
        private Button runButton = null!;
        private Button clearButton = null!;
        private Button saveButton = null!;
        private Button loadButton = null!;
        private Button exportButton = null!;
        private Button importButton = null!;
        private ComboBox moduleCombo = null!;
        private ListBox moduleList = null!;
        private ListBox functionList = null!;
        private Label statusLabel = null!;
        
        public MainForm()
        {
            InitializeUI();
        }
        
        private void InitializeUI()
        {
            this.Text = "Geneia IDE - Professional Development Environment";
            this.Size = new Size(1400, 900);
            this.BackColor = Color.FromArgb(240, 240, 245);
            this.StartPosition = FormStartPosition.CenterScreen;
            
            // Glass-style main panel
            Panel glassPanel = new Panel
            {
                Location = new Point(20, 20),
                Size = new Size(1340, 820),
                BackColor = Color.FromArgb(220, 255, 255, 255),
                BorderStyle = BorderStyle.FixedSingle
            };
            
            // Left panel - Modules and Functions
            Panel leftPanel = new Panel
            {
                Location = new Point(10, 50),
                Size = new Size(250, 750),
                BackColor = Color.FromArgb(240, 250, 255),
                BorderStyle = BorderStyle.FixedSingle
            };
            
            Label moduleLabel = new Label
            {
                Text = "📦 Modules",
                Location = new Point(10, 10),
                Size = new Size(230, 30),
                Font = new Font("Segoe UI", 12, FontStyle.Bold),
                ForeColor = Color.FromArgb(60, 60, 80)
            };
            
            moduleCombo = new ComboBox
            {
                Location = new Point(10, 45),
                Size = new Size(230, 30),
                DropDownStyle = ComboBoxStyle.DropDownList,
                Font = new Font("Segoe UI", 10)
            };
            moduleCombo.Items.AddRange(new object[] { 
                "UI Library", 
                "Math", 
                "File I/O", 
                "Network", 
                "Graphics",
                "Custom .gne",
                "Custom .gns"
            });
            moduleCombo.SelectedIndex = 0;
            
            importButton = new Button
            {
                Text = "➕ Import Module",
                Location = new Point(10, 85),
                Size = new Size(230, 35),
                BackColor = Color.FromArgb(100, 150, 200),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 10, FontStyle.Bold)
            };
            importButton.FlatAppearance.BorderSize = 0;
            importButton.Click += ImportButton_Click;
            
            Label importedLabel = new Label
            {
                Text = "Imported:",
                Location = new Point(10, 130),
                Size = new Size(230, 25),
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                ForeColor = Color.FromArgb(60, 60, 80)
            };
            
            moduleList = new ListBox
            {
                Location = new Point(10, 160),
                Size = new Size(230, 150),
                BackColor = Color.FromArgb(250, 250, 255),
                Font = new Font("Consolas", 9),
                BorderStyle = BorderStyle.FixedSingle
            };
            
            Label functionsLabel = new Label
            {
                Text = "⚡ Functions",
                Location = new Point(10, 320),
                Size = new Size(230, 30),
                Font = new Font("Segoe UI", 12, FontStyle.Bold),
                ForeColor = Color.FromArgb(60, 60, 80)
            };
            
            functionList = new ListBox
            {
                Location = new Point(10, 355),
                Size = new Size(230, 340),
                BackColor = Color.FromArgb(250, 250, 255),
                Font = new Font("Consolas", 9),
                BorderStyle = BorderStyle.FixedSingle
            };
            
            // Populate function list
            functionList.Items.AddRange(new object[] {
                "peat - Output",
                "repeat - Loop",
                "turn - Block loop",
                "str - String var",
                "hold - Number var",
                "import - Load module",
                "export - Export symbol",
                "exit - Exit program",
                "func - Define function",
                "check - Conditional",
                "t.s - Seconds",
                "t.ms - Milliseconds",
                "t.m - Minutes",
                "t.h - Hours",
                "t.d - Days"
            });
            
            exportButton = new Button
            {
                Text = "📤 Export Module",
                Location = new Point(10, 705),
                Size = new Size(230, 35),
                BackColor = Color.FromArgb(200, 100, 150),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 10, FontStyle.Bold)
            };
            exportButton.FlatAppearance.BorderSize = 0;
            exportButton.Click += ExportButton_Click;
            
            leftPanel.Controls.Add(moduleLabel);
            leftPanel.Controls.Add(moduleCombo);
            leftPanel.Controls.Add(importButton);
            leftPanel.Controls.Add(importedLabel);
            leftPanel.Controls.Add(moduleList);
            leftPanel.Controls.Add(functionsLabel);
            leftPanel.Controls.Add(functionList);
            leftPanel.Controls.Add(exportButton);
            
            // Code editor
            Label editorLabel = new Label
            {
                Text = "📝 Code Editor",
                Location = new Point(270, 20),
                Size = new Size(200, 30),
                Font = new Font("Segoe UI", 14, FontStyle.Bold),
                ForeColor = Color.FromArgb(60, 60, 80)
            };
            
            codeEditor = new TextBox
            {
                Location = new Point(270, 55),
                Size = new Size(1050, 400),
                Multiline = true,
                Font = new Font("Consolas", 11),
                BackColor = Color.FromArgb(250, 250, 255),
                ForeColor = Color.FromArgb(40, 40, 60),
                ScrollBars = ScrollBars.Both,
                BorderStyle = BorderStyle.FixedSingle
            };
            
            // Button panel
            Panel buttonPanel = new Panel
            {
                Location = new Point(270, 465),
                Size = new Size(1050, 50),
                BackColor = Color.Transparent
            };
            
            runButton = new Button
            {
                Text = "▶ Run",
                Location = new Point(0, 5),
                Size = new Size(120, 40),
                BackColor = Color.FromArgb(100, 200, 100),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 11, FontStyle.Bold)
            };
            runButton.FlatAppearance.BorderSize = 0;
            runButton.Click += RunButton_Click;
            
            clearButton = new Button
            {
                Text = "🗑 Clear",
                Location = new Point(130, 5),
                Size = new Size(120, 40),
                BackColor = Color.FromArgb(200, 100, 100),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 11, FontStyle.Bold)
            };
            clearButton.FlatAppearance.BorderSize = 0;
            clearButton.Click += (s, e) => { codeEditor.Clear(); outputBox.Clear(); UpdateStatus("Cleared"); };
            
            saveButton = new Button
            {
                Text = "💾 Save",
                Location = new Point(260, 5),
                Size = new Size(120, 40),
                BackColor = Color.FromArgb(100, 150, 200),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 11, FontStyle.Bold)
            };
            saveButton.FlatAppearance.BorderSize = 0;
            saveButton.Click += SaveButton_Click;
            
            loadButton = new Button
            {
                Text = "📂 Load",
                Location = new Point(390, 5),
                Size = new Size(120, 40),
                BackColor = Color.FromArgb(150, 100, 200),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 11, FontStyle.Bold)
            };
            loadButton.FlatAppearance.BorderSize = 0;
            loadButton.Click += LoadButton_Click;
            
            Button demoButton = new Button
            {
                Text = "🎯 Load Demo",
                Location = new Point(520, 5),
                Size = new Size(140, 40),
                BackColor = Color.FromArgb(200, 150, 100),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 11, FontStyle.Bold)
            };
            demoButton.FlatAppearance.BorderSize = 0;
            demoButton.Click += DemoButton_Click;
            
            buttonPanel.Controls.Add(runButton);
            buttonPanel.Controls.Add(clearButton);
            buttonPanel.Controls.Add(saveButton);
            buttonPanel.Controls.Add(loadButton);
            buttonPanel.Controls.Add(demoButton);
            
            // Output box
            Label outputLabel = new Label
            {
                Text = "📊 Output Console",
                Location = new Point(270, 525),
                Size = new Size(200, 30),
                Font = new Font("Segoe UI", 14, FontStyle.Bold),
                ForeColor = Color.FromArgb(60, 60, 80)
            };
            
            outputBox = new TextBox
            {
                Location = new Point(270, 560),
                Size = new Size(1050, 210),
                Multiline = true,
                ReadOnly = true,
                Font = new Font("Consolas", 10),
                BackColor = Color.FromArgb(40, 40, 50),
                ForeColor = Color.FromArgb(0, 255, 150),
                ScrollBars = ScrollBars.Both,
                BorderStyle = BorderStyle.FixedSingle
            };
            
            // Status bar
            statusLabel = new Label
            {
                Text = "Ready",
                Location = new Point(270, 780),
                Size = new Size(1050, 25),
                Font = new Font("Segoe UI", 10),
                ForeColor = Color.FromArgb(100, 100, 120),
                TextAlign = ContentAlignment.MiddleLeft
            };
            
            // Add controls
            glassPanel.Controls.Add(leftPanel);
            glassPanel.Controls.Add(editorLabel);
            glassPanel.Controls.Add(codeEditor);
            glassPanel.Controls.Add(buttonPanel);
            glassPanel.Controls.Add(outputLabel);
            glassPanel.Controls.Add(outputBox);
            glassPanel.Controls.Add(statusLabel);
            
            this.Controls.Add(glassPanel);
            
            // Sample code
            codeEditor.Text = @"! Geneia Sample Code !

import Math
import UI

""Welcome to Geneia IDE""

str {name} = 'Developer'
peat 'Hello, '
peat {name}

repeat 'Processing...' & t.s = (2)

turn (2) {
    peat 'Iteration'
}

exit (0)";
            
            UpdateStatus("Ready - Load a file or start coding!");
        }
        
        private void UpdateStatus(string message)
        {
            if (statusLabel != null)
            {
                statusLabel.Text = $"Status: {message}";
            }
        }
        
        private void ImportButton_Click(object? sender, EventArgs e)
        {
            string? module = moduleCombo.SelectedItem?.ToString();
            if (!string.IsNullOrEmpty(module) && !moduleList.Items.Contains(module))
            {
                if (module == "Custom .gne" || module == "Custom .gns")
                {
                    OpenFileDialog ofd = new OpenFileDialog
                    {
                        Filter = "Geneia Extensions (*.gne;*.gns)|*.gne;*.gns|All files (*.*)|*.*",
                        Title = "Select Geneia Extension"
                    };
                    
                    if (ofd.ShowDialog() == DialogResult.OK)
                    {
                        string fileName = Path.GetFileName(ofd.FileName);
                        moduleList.Items.Add(fileName);
                        codeEditor.Text = $"import {fileName}\n\n" + codeEditor.Text;
                        outputBox.AppendText($"[INFO] Imported extension: {fileName}\r\n");
                        UpdateStatus($"Imported {fileName}");
                    }
                }
                else
                {
                    moduleList.Items.Add(module);
                    codeEditor.Text = $"import {module}\n\n" + codeEditor.Text;
                    outputBox.AppendText($"[INFO] Imported module: {module}\r\n");
                    UpdateStatus($"Imported {module}");
                }
            }
        }
        
        private void ExportButton_Click(object? sender, EventArgs e)
        {
            SaveFileDialog sfd = new SaveFileDialog
            {
                Filter = "Geneia Regular Extension (*.gne)|*.gne|Geneia S-Extension (*.gns)|*.gns",
                Title = "Export as Geneia Module",
                DefaultExt = "gne"
            };
            
            if (sfd.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    File.WriteAllText(sfd.FileName, codeEditor.Text);
                    outputBox.AppendText($"[SUCCESS] Exported to: {sfd.FileName}\r\n");
                    UpdateStatus($"Exported to {Path.GetFileName(sfd.FileName)}");
                    MessageBox.Show($"Module exported successfully!\n\n{sfd.FileName}", 
                        "Export Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                catch (Exception ex)
                {
                    outputBox.AppendText($"[ERROR] Export failed: {ex.Message}\r\n");
                    UpdateStatus("Export failed");
                }
            }
        }
        
        private void SaveButton_Click(object? sender, EventArgs e)
        {
            SaveFileDialog sfd = new SaveFileDialog
            {
                Filter = "Geneia Files (*.gn)|*.gn|All files (*.*)|*.*",
                DefaultExt = "gn"
            };
            
            if (sfd.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    File.WriteAllText(sfd.FileName, codeEditor.Text);
                    outputBox.AppendText($"[SUCCESS] Saved to: {sfd.FileName}\r\n");
                    UpdateStatus($"Saved {Path.GetFileName(sfd.FileName)}");
                }
                catch (Exception ex)
                {
                    outputBox.AppendText($"[ERROR] Save failed: {ex.Message}\r\n");
                    UpdateStatus("Save failed");
                }
            }
        }
        
        private void LoadButton_Click(object? sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog
            {
                Filter = "Geneia Files (*.gn)|*.gn|All files (*.*)|*.*"
            };
            
            if (ofd.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    codeEditor.Text = File.ReadAllText(ofd.FileName);
                    outputBox.AppendText($"[SUCCESS] Loaded: {ofd.FileName}\r\n");
                    UpdateStatus($"Loaded {Path.GetFileName(ofd.FileName)}");
                }
                catch (Exception ex)
                {
                    outputBox.AppendText($"[ERROR] Load failed: {ex.Message}\r\n");
                    UpdateStatus("Load failed");
                }
            }
        }
        
        private void DemoButton_Click(object? sender, EventArgs e)
        {
            codeEditor.Text = @"! ================================================ !
! GENEIA COMPLETE DEMONSTRATION                    !
! ================================================ !

import UI
import Math
import Graphics

""Complete Geneia feature demonstration""

str {app} = 'Geneia Demo'
str {version} = '2.0.0'
hold (count) = (5)

peat '========================================'
peat {app}
peat 'Version: '
peat {version}
peat '========================================'

repeat 'Processing...' & t.s = (3)

turn (2) {
    peat 'Turn iteration'
    repeat 'Nested' & t.ms = (2)
}

""All features working!""

export app
export version

exit (0)";
            outputBox.AppendText("[INFO] Demo code loaded\r\n");
            UpdateStatus("Demo loaded - Click Run to execute");
        }
        
        private void RunButton_Click(object? sender, EventArgs e)
        {
            try
            {
                UpdateStatus("Running...");
                outputBox.Clear();
                outputBox.AppendText("=== Geneia Execution ===\r\n\r\n");
                
                string tempFile = Path.GetTempFileName() + ".gn";
                File.WriteAllText(tempFile, codeEditor.Text);
                
                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = "../compiler/geneia",
                    Arguments = tempFile,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                
                using (Process? process = Process.Start(psi))
                {
                    if (process != null)
                    {
                        string output = process.StandardOutput.ReadToEnd();
                        string error = process.StandardError.ReadToEnd();
                        process.WaitForExit();
                        
                        if (!string.IsNullOrEmpty(output))
                        {
                            outputBox.AppendText(output);
                        }
                        
                        if (!string.IsNullOrEmpty(error))
                        {
                            outputBox.AppendText("\r\n=== Errors ===\r\n");
                            outputBox.AppendText(error);
                        }
                        
                        outputBox.AppendText($"\r\n\r\n=== Exit Code: {process.ExitCode} ===");
                        UpdateStatus($"Execution complete (Exit: {process.ExitCode})");
                    }
                }
                
                File.Delete(tempFile);
            }
            catch (Exception ex)
            {
                outputBox.Text = $"Error: {ex.Message}";
                UpdateStatus("Execution failed");
            }
        }
    }
}
