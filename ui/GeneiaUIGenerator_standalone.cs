using System;
using System.Drawing;
using System.Windows.Forms;
using System.IO;
using System.Collections.Generic;

namespace GeneiaUI
{
    // Standalone UI Generator - Creates real windows from Geneia programs
    public class GeneiaUIGenerator
    {
        private static Form? mainWindow = null;
        private static Dictionary<string, Control> controls = new Dictionary<string, Control>();
        
        [STAThread]
        static void Main(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine("Usage: GeneiaUIGenerator <ui_script_file>");
                return;
            }
            
            string scriptFile = args[0];
            if (!File.Exists(scriptFile))
            {
                Console.WriteLine($"Error: File not found: {scriptFile}");
                return;
            }
            
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            
            // Parse and execute UI script
            ExecuteUIScript(scriptFile);
            
            if (mainWindow != null)
            {
                Application.Run(mainWindow);
            }
        }
        
        static void ExecuteUIScript(string scriptFile)
        {
            string[] lines = File.ReadAllLines(scriptFile);
            
            foreach (string line in lines)
            {
                string trimmed = line.Trim();
                if (string.IsNullOrEmpty(trimmed) || trimmed.StartsWith("//"))
                    continue;
                    
                string[] parts = trimmed.Split('|');
                if (parts.Length < 2)
                    continue;
                    
                string command = parts[0];
                
                switch (command)
                {
                    case "WINDOW":
                        CreateWindow(parts);
                        break;
                    case "BUTTON":
                        CreateButton(parts);
                        break;
                    case "LABEL":
                        CreateLabel(parts);
                        break;
                    case "TEXTBOX":
                        CreateTextBox(parts);
                        break;
                    case "PANEL":
                        CreatePanel(parts);
                        break;
                    case "LISTBOX":
                        CreateListBox(parts);
                        break;
                    case "COMBOBOX":
                        CreateComboBox(parts);
                        break;
                    case "CHECKBOX":
                        CreateCheckBox(parts);
                        break;
                    case "RADIOBUTTON":
                        CreateRadioButton(parts);
                        break;
                    case "PROGRESSBAR":
                        CreateProgressBar(parts);
                        break;
                }
            }
        }
        
        static void CreateWindow(string[] parts)
        {
            // WINDOW|title|width|height
            string title = parts.Length > 1 ? parts[1] : "Geneia Application";
            int width = parts.Length > 2 ? int.Parse(parts[2]) : 800;
            int height = parts.Length > 3 ? int.Parse(parts[3]) : 600;
            
            mainWindow = new Form
            {
                Text = title,
                Size = new Size(width, height),
                StartPosition = FormStartPosition.CenterScreen,
                BackColor = Color.FromArgb(240, 240, 245)
            };
            
            Console.WriteLine($"[UI] Created window: {title} ({width}x{height})");
        }
        
        static void CreateButton(string[] parts)
        {
            // BUTTON|name|text|x|y|width|height
            if (mainWindow == null) return;
            
            string name = parts.Length > 1 ? parts[1] : "button";
            string text = parts.Length > 2 ? parts[2] : "Button";
            int x = parts.Length > 3 ? int.Parse(parts[3]) : 10;
            int y = parts.Length > 4 ? int.Parse(parts[4]) : 10;
            int width = parts.Length > 5 ? int.Parse(parts[5]) : 100;
            int height = parts.Length > 6 ? int.Parse(parts[6]) : 30;
            
            Button button = new Button
            {
                Name = name,
                Text = text,
                Location = new Point(x, y),
                Size = new Size(width, height),
                BackColor = Color.FromArgb(100, 150, 200),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 10, FontStyle.Bold)
            };
            
            button.FlatAppearance.BorderSize = 0;
            button.Click += (s, e) => MessageBox.Show($"Button clicked: {text}", "Geneia UI", MessageBoxButtons.OK, MessageBoxIcon.Information);
            
            mainWindow.Controls.Add(button);
            controls[name] = button;
            
            Console.WriteLine($"[UI] Created button: {text} at ({x}, {y})");
        }
        
        static void CreateLabel(string[] parts)
        {
            // LABEL|name|text|x|y|width|height
            if (mainWindow == null) return;
            
            string name = parts.Length > 1 ? parts[1] : "label";
            string text = parts.Length > 2 ? parts[2] : "Label";
            int x = parts.Length > 3 ? int.Parse(parts[3]) : 10;
            int y = parts.Length > 4 ? int.Parse(parts[4]) : 10;
            int width = parts.Length > 5 ? int.Parse(parts[5]) : 200;
            int height = parts.Length > 6 ? int.Parse(parts[6]) : 30;
            
            Label label = new Label
            {
                Name = name,
                Text = text,
                Location = new Point(x, y),
                Size = new Size(width, height),
                Font = new Font("Segoe UI", 11, FontStyle.Bold),
                ForeColor = Color.FromArgb(60, 60, 80)
            };
            
            mainWindow.Controls.Add(label);
            controls[name] = label;
            
            Console.WriteLine($"[UI] Created label: {text}");
        }
        
        static void CreateTextBox(string[] parts)
        {
            // TEXTBOX|name|x|y|width|height
            if (mainWindow == null) return;
            
            string name = parts.Length > 1 ? parts[1] : "textbox";
            int x = parts.Length > 2 ? int.Parse(parts[2]) : 10;
            int y = parts.Length > 3 ? int.Parse(parts[3]) : 10;
            int width = parts.Length > 4 ? int.Parse(parts[4]) : 200;
            int height = parts.Length > 5 ? int.Parse(parts[5]) : 25;
            
            TextBox textBox = new TextBox
            {
                Name = name,
                Location = new Point(x, y),
                Size = new Size(width, height),
                Font = new Font("Segoe UI", 10),
                BackColor = Color.FromArgb(250, 250, 255)
            };
            
            mainWindow.Controls.Add(textBox);
            controls[name] = textBox;
            
            Console.WriteLine($"[UI] Created textbox at ({x}, {y})");
        }
        
        static void CreatePanel(string[] parts)
        {
            // PANEL|name|x|y|width|height|color
            if (mainWindow == null) return;
            
            string name = parts.Length > 1 ? parts[1] : "panel";
            int x = parts.Length > 2 ? int.Parse(parts[2]) : 10;
            int y = parts.Length > 3 ? int.Parse(parts[3]) : 10;
            int width = parts.Length > 4 ? int.Parse(parts[4]) : 200;
            int height = parts.Length > 5 ? int.Parse(parts[5]) : 200;
            string colorName = parts.Length > 6 ? parts[6] : "LightBlue";
            
            Panel panel = new Panel
            {
                Name = name,
                Location = new Point(x, y),
                Size = new Size(width, height),
                BackColor = Color.FromName(colorName),
                BorderStyle = BorderStyle.FixedSingle
            };
            
            mainWindow.Controls.Add(panel);
            controls[name] = panel;
            
            Console.WriteLine($"[UI] Created panel at ({x}, {y})");
        }
        
        static void CreateListBox(string[] parts)
        {
            // LISTBOX|name|x|y|width|height
            if (mainWindow == null) return;
            
            string name = parts.Length > 1 ? parts[1] : "listbox";
            int x = parts.Length > 2 ? int.Parse(parts[2]) : 10;
            int y = parts.Length > 3 ? int.Parse(parts[3]) : 10;
            int width = parts.Length > 4 ? int.Parse(parts[4]) : 200;
            int height = parts.Length > 5 ? int.Parse(parts[5]) : 100;
            
            ListBox listBox = new ListBox
            {
                Name = name,
                Location = new Point(x, y),
                Size = new Size(width, height),
                Font = new Font("Segoe UI", 10),
                BackColor = Color.FromArgb(250, 250, 255)
            };
            
            // Add sample items
            listBox.Items.Add("Item 1");
            listBox.Items.Add("Item 2");
            listBox.Items.Add("Item 3");
            
            mainWindow.Controls.Add(listBox);
            controls[name] = listBox;
            
            Console.WriteLine($"[UI] Created listbox at ({x}, {y})");
        }
        
        static void CreateComboBox(string[] parts)
        {
            // COMBOBOX|name|x|y|width|height
            if (mainWindow == null) return;
            
            string name = parts.Length > 1 ? parts[1] : "combobox";
            int x = parts.Length > 2 ? int.Parse(parts[2]) : 10;
            int y = parts.Length > 3 ? int.Parse(parts[3]) : 10;
            int width = parts.Length > 4 ? int.Parse(parts[4]) : 200;
            int height = parts.Length > 5 ? int.Parse(parts[5]) : 25;
            
            ComboBox comboBox = new ComboBox
            {
                Name = name,
                Location = new Point(x, y),
                Size = new Size(width, height),
                Font = new Font("Segoe UI", 10),
                DropDownStyle = ComboBoxStyle.DropDownList
            };
            
            // Add sample items
            comboBox.Items.Add("Option 1");
            comboBox.Items.Add("Option 2");
            comboBox.Items.Add("Option 3");
            comboBox.SelectedIndex = 0;
            
            mainWindow.Controls.Add(comboBox);
            controls[name] = comboBox;
            
            Console.WriteLine($"[UI] Created combobox at ({x}, {y})");
        }
        
        static void CreateCheckBox(string[] parts)
        {
            // CHECKBOX|name|text|x|y|width|height
            if (mainWindow == null) return;
            
            string name = parts.Length > 1 ? parts[1] : "checkbox";
            string text = parts.Length > 2 ? parts[2] : "CheckBox";
            int x = parts.Length > 3 ? int.Parse(parts[3]) : 10;
            int y = parts.Length > 4 ? int.Parse(parts[4]) : 10;
            int width = parts.Length > 5 ? int.Parse(parts[5]) : 150;
            int height = parts.Length > 6 ? int.Parse(parts[6]) : 25;
            
            CheckBox checkBox = new CheckBox
            {
                Name = name,
                Text = text,
                Location = new Point(x, y),
                Size = new Size(width, height),
                Font = new Font("Segoe UI", 10)
            };
            
            mainWindow.Controls.Add(checkBox);
            controls[name] = checkBox;
            
            Console.WriteLine($"[UI] Created checkbox: {text}");
        }
        
        static void CreateRadioButton(string[] parts)
        {
            // RADIOBUTTON|name|text|x|y|width|height
            if (mainWindow == null) return;
            
            string name = parts.Length > 1 ? parts[1] : "radiobutton";
            string text = parts.Length > 2 ? parts[2] : "RadioButton";
            int x = parts.Length > 3 ? int.Parse(parts[3]) : 10;
            int y = parts.Length > 4 ? int.Parse(parts[4]) : 10;
            int width = parts.Length > 5 ? int.Parse(parts[5]) : 150;
            int height = parts.Length > 6 ? int.Parse(parts[6]) : 25;
            
            RadioButton radioButton = new RadioButton
            {
                Name = name,
                Text = text,
                Location = new Point(x, y),
                Size = new Size(width, height),
                Font = new Font("Segoe UI", 10)
            };
            
            mainWindow.Controls.Add(radioButton);
            controls[name] = radioButton;
            
            Console.WriteLine($"[UI] Created radiobutton: {text}");
        }
        
        static void CreateProgressBar(string[] parts)
        {
            // PROGRESSBAR|name|x|y|width|height
            if (mainWindow == null) return;
            
            string name = parts.Length > 1 ? parts[1] : "progressbar";
            int x = parts.Length > 2 ? int.Parse(parts[2]) : 10;
            int y = parts.Length > 3 ? int.Parse(parts[3]) : 10;
            int width = parts.Length > 4 ? int.Parse(parts[4]) : 200;
            int height = parts.Length > 5 ? int.Parse(parts[5]) : 25;
            
            ProgressBar progressBar = new ProgressBar
            {
                Name = name,
                Location = new Point(x, y),
                Size = new Size(width, height),
                Style = ProgressBarStyle.Continuous,
                Value = 50
            };
            
            mainWindow.Controls.Add(progressBar);
            controls[name] = progressBar;
            
            Console.WriteLine($"[UI] Created progressbar at ({x}, {y})");
        }
    }
}
