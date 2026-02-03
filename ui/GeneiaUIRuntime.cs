using System;
using System.Drawing;
using System.Windows.Forms;
using System.Collections.Generic;

namespace GeneiaUI
{
    // Real UI Runtime for Geneia programs
    public static class GeneiaUIRuntime
    {
        private static Dictionary<string, Form> windows = new Dictionary<string, Form>();
        private static Dictionary<string, Control> controls = new Dictionary<string, Control>();
        private static Form? currentWindow = null;
        
        // Create Window
        public static void CreateWindow(string name, string title, int width, int height)
        {
            Form window = new Form
            {
                Text = title,
                Size = new Size(width, height),
                StartPosition = FormStartPosition.CenterScreen,
                BackColor = Color.FromArgb(240, 240, 245)
            };
            
            windows[name] = window;
            currentWindow = window;
            
            Console.WriteLine($"[UI] Created window: {name} ({width}x{height})");
        }
        
        // Show Window
        public static void ShowWindow(string name)
        {
            if (windows.ContainsKey(name))
            {
                Application.Run(windows[name]);
            }
        }
        
        // Create Button
        public static void CreateButton(string name, string text, int x, int y, int width, int height)
        {
            Button button = new Button
            {
                Text = text,
                Location = new Point(x, y),
                Size = new Size(width, height),
                BackColor = Color.FromArgb(100, 150, 200),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 10, FontStyle.Bold)
            };
            
            button.FlatAppearance.BorderSize = 0;
            button.Click += (s, e) => Console.WriteLine($"[UI] Button clicked: {name}");
            
            controls[name] = button;
            currentWindow?.Controls.Add(button);
            
            Console.WriteLine($"[UI] Created button: {name}");
        }
        
        // Create Label
        public static void CreateLabel(string name, string text, int x, int y, int width, int height)
        {
            Label label = new Label
            {
                Text = text,
                Location = new Point(x, y),
                Size = new Size(width, height),
                Font = new Font("Segoe UI", 11),
                ForeColor = Color.FromArgb(60, 60, 80)
            };
            
            controls[name] = label;
            currentWindow?.Controls.Add(label);
            
            Console.WriteLine($"[UI] Created label: {name}");
        }
        
        // Create TextBox
        public static void CreateTextBox(string name, int x, int y, int width, int height)
        {
            TextBox textBox = new TextBox
            {
                Location = new Point(x, y),
                Size = new Size(width, height),
                Font = new Font("Segoe UI", 10),
                BackColor = Color.FromArgb(250, 250, 255)
            };
            
            controls[name] = textBox;
            currentWindow?.Controls.Add(textBox);
            
            Console.WriteLine($"[UI] Created textbox: {name}");
        }
        
        // Create Panel
        public static void CreatePanel(string name, int x, int y, int width, int height, string color)
        {
            Panel panel = new Panel
            {
                Location = new Point(x, y),
                Size = new Size(width, height),
                BackColor = ParseColor(color),
                BorderStyle = BorderStyle.FixedSingle
            };
            
            controls[name] = panel;
            currentWindow?.Controls.Add(panel);
            
            Console.WriteLine($"[UI] Created panel: {name}");
        }
        
        // Create ListBox
        public static void CreateListBox(string name, int x, int y, int width, int height)
        {
            ListBox listBox = new ListBox
            {
                Location = new Point(x, y),
                Size = new Size(width, height),
                Font = new Font("Segoe UI", 10),
                BackColor = Color.FromArgb(250, 250, 255)
            };
            
            controls[name] = listBox;
            currentWindow?.Controls.Add(listBox);
            
            Console.WriteLine($"[UI] Created listbox: {name}");
        }
        
        // Create ComboBox
        public static void CreateComboBox(string name, int x, int y, int width, int height)
        {
            ComboBox comboBox = new ComboBox
            {
                Location = new Point(x, y),
                Size = new Size(width, height),
                Font = new Font("Segoe UI", 10),
                DropDownStyle = ComboBoxStyle.DropDownList
            };
            
            controls[name] = comboBox;
            currentWindow?.Controls.Add(comboBox);
            
            Console.WriteLine($"[UI] Created combobox: {name}");
        }
        
        // Create CheckBox
        public static void CreateCheckBox(string name, string text, int x, int y, int width, int height)
        {
            CheckBox checkBox = new CheckBox
            {
                Text = text,
                Location = new Point(x, y),
                Size = new Size(width, height),
                Font = new Font("Segoe UI", 10)
            };
            
            controls[name] = checkBox;
            currentWindow?.Controls.Add(checkBox);
            
            Console.WriteLine($"[UI] Created checkbox: {name}");
        }
        
        // Create RadioButton
        public static void CreateRadioButton(string name, string text, int x, int y, int width, int height)
        {
            RadioButton radioButton = new RadioButton
            {
                Text = text,
                Location = new Point(x, y),
                Size = new Size(width, height),
                Font = new Font("Segoe UI", 10)
            };
            
            controls[name] = radioButton;
            currentWindow?.Controls.Add(radioButton);
            
            Console.WriteLine($"[UI] Created radiobutton: {name}");
        }
        
        // Create ProgressBar
        public static void CreateProgressBar(string name, int x, int y, int width, int height)
        {
            ProgressBar progressBar = new ProgressBar
            {
                Location = new Point(x, y),
                Size = new Size(width, height),
                Style = ProgressBarStyle.Continuous
            };
            
            controls[name] = progressBar;
            currentWindow?.Controls.Add(progressBar);
            
            Console.WriteLine($"[UI] Created progressbar: {name}");
        }
        
        // Set Text
        public static void SetText(string name, string text)
        {
            if (controls.ContainsKey(name))
            {
                controls[name].Text = text;
                Console.WriteLine($"[UI] Set text for {name}: {text}");
            }
        }
        
        // Get Text
        public static string GetText(string name)
        {
            if (controls.ContainsKey(name))
            {
                return controls[name].Text;
            }
            return "";
        }
        
        // Set Background Color
        public static void SetBackColor(string name, string color)
        {
            if (controls.ContainsKey(name))
            {
                controls[name].BackColor = ParseColor(color);
                Console.WriteLine($"[UI] Set background color for {name}: {color}");
            }
        }
        
        // Set Foreground Color
        public static void SetForeColor(string name, string color)
        {
            if (controls.ContainsKey(name))
            {
                controls[name].ForeColor = ParseColor(color);
                Console.WriteLine($"[UI] Set foreground color for {name}: {color}");
            }
        }
        
        // Add Item to ListBox/ComboBox
        public static void AddItem(string name, string item)
        {
            if (controls.ContainsKey(name))
            {
                if (controls[name] is ListBox listBox)
                {
                    listBox.Items.Add(item);
                }
                else if (controls[name] is ComboBox comboBox)
                {
                    comboBox.Items.Add(item);
                }
                Console.WriteLine($"[UI] Added item to {name}: {item}");
            }
        }
        
        // Show Message Box
        public static void ShowMessage(string title, string message)
        {
            MessageBox.Show(message, title, MessageBoxButtons.OK, MessageBoxIcon.Information);
            Console.WriteLine($"[UI] Showed message: {title}");
        }
        
        // Show Dialog
        public static string ShowDialog(string title, string message, string type)
        {
            DialogResult result = DialogResult.OK;
            
            if (type == "yesno")
            {
                result = MessageBox.Show(message, title, MessageBoxButtons.YesNo, MessageBoxIcon.Question);
            }
            else if (type == "okcancel")
            {
                result = MessageBox.Show(message, title, MessageBoxButtons.OKCancel, MessageBoxIcon.Question);
            }
            else
            {
                MessageBox.Show(message, title, MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            
            return result.ToString();
        }
        
        // Parse Color
        private static Color ParseColor(string colorName)
        {
            return colorName.ToLower() switch
            {
                "red" => Color.Red,
                "blue" => Color.Blue,
                "green" => Color.Green,
                "yellow" => Color.Yellow,
                "white" => Color.White,
                "black" => Color.Black,
                "gray" => Color.Gray,
                "orange" => Color.Orange,
                "purple" => Color.Purple,
                "pink" => Color.Pink,
                "cyan" => Color.Cyan,
                "lightblue" => Color.LightBlue,
                "lightgray" => Color.LightGray,
                _ => Color.FromArgb(240, 240, 245)
            };
        }
        
        // Clear all
        public static void Clear()
        {
            windows.Clear();
            controls.Clear();
            currentWindow = null;
        }
    }
}
