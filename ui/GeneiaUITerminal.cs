using System;
using System.IO;
using System.Collections.Generic;

namespace GeneiaUI
{
    // Terminal-based UI with REAL COLOR support using ANSI escape codes
    public class GeneiaUITerminal
    {
        private static Dictionary<string, string> windowData = new Dictionary<string, string>();
        private static List<ControlItem> controls = new List<ControlItem>();
        private static string currentColor = "";
        private static string currentTheme = "default";
        
        class ControlItem
        {
            public string Type { get; set; } = "";
            public string Name { get; set; } = "";
            public string Text { get; set; } = "";
            public string Color { get; set; } = "";
            public int X { get; set; }
            public int Y { get; set; }
        }
        
        // Convert hex color to ANSI 256 color code
        static string HexToAnsi(string hex)
        {
            if (string.IsNullOrEmpty(hex)) return "\x1b[0m";
            
            hex = hex.TrimStart('#');
            if (hex.Length != 6) return "\x1b[0m";
            
            try
            {
                int r = Convert.ToInt32(hex.Substring(0, 2), 16);
                int g = Convert.ToInt32(hex.Substring(2, 2), 16);
                int b = Convert.ToInt32(hex.Substring(4, 2), 16);
                
                // Use true color (24-bit) ANSI escape
                return $"\x1b[38;2;{r};{g};{b}m";
            }
            catch
            {
                return "\x1b[0m";
            }
        }
        
        // Get background color ANSI code
        static string HexToAnsiBg(string hex)
        {
            if (string.IsNullOrEmpty(hex)) return "";
            
            hex = hex.TrimStart('#');
            if (hex.Length != 6) return "";
            
            try
            {
                int r = Convert.ToInt32(hex.Substring(0, 2), 16);
                int g = Convert.ToInt32(hex.Substring(2, 2), 16);
                int b = Convert.ToInt32(hex.Substring(4, 2), 16);
                
                return $"\x1b[48;2;{r};{g};{b}m";
            }
            catch
            {
                return "";
            }
        }

        static string Reset = "\x1b[0m";
        static string Bold = "\x1b[1m";
        
        static void Main(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine("Usage: GeneiaUITerminal <ui_script_file>");
                return;
            }
            
            string scriptFile = args[0];
            if (!File.Exists(scriptFile))
            {
                Console.WriteLine($"Error: File not found: {scriptFile}");
                return;
            }
            
            Console.Clear();
            
            // Parse and execute UI script
            ExecuteUIScript(scriptFile);
            
            // Show the UI with colors
            ShowColorUI();
            
            Console.WriteLine();
            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
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
                if (parts.Length < 1)
                    continue;
                    
                string command = parts[0];
                
                switch (command)
                {
                    case "WINDOW":
                        CreateWindow(parts);
                        break;
                    case "THEME":
                        if (parts.Length > 1) currentTheme = parts[1];
                        break;
                    case "COLOR":
                        if (parts.Length > 1) currentColor = parts[1];
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
                    case "MENU":
                        CreateMenu(parts);
                        break;
                    case "TOOLBAR":
                        CreateToolbar(parts);
                        break;
                    case "STATUSBAR":
                        CreateStatusBar(parts);
                        break;
                    case "LISTBOX":
                        CreateListBox(parts);
                        break;
                    case "CHECKBOX":
                        CreateCheckBox(parts);
                        break;
                }
            }
        }
        
        static void CreateWindow(string[] parts)
        {
            string title = parts.Length > 1 ? parts[1] : "Geneia Application";
            int width = parts.Length > 2 ? int.Parse(parts[2]) : 80;
            int height = parts.Length > 3 ? int.Parse(parts[3]) : 24;
            
            windowData["title"] = title;
            windowData["width"] = width.ToString();
            windowData["height"] = height.ToString();
        }
        
        static void CreateButton(string[] parts)
        {
            string name = parts.Length > 1 ? parts[1] : "button";
            string text = parts.Length > 2 ? parts[2] : "Button";
            int x = parts.Length > 3 ? int.Parse(parts[3]) : 0;
            int y = parts.Length > 4 ? int.Parse(parts[4]) : 0;
            
            controls.Add(new ControlItem { Type = "BUTTON", Name = name, Text = text, Color = currentColor, X = x, Y = y });
        }
        
        static void CreateLabel(string[] parts)
        {
            string name = parts.Length > 1 ? parts[1] : "label";
            string text = parts.Length > 2 ? parts[2] : "Label";
            int x = parts.Length > 3 ? int.Parse(parts[3]) : 0;
            int y = parts.Length > 4 ? int.Parse(parts[4]) : 0;
            
            controls.Add(new ControlItem { Type = "LABEL", Name = name, Text = text, Color = currentColor, X = x, Y = y });
        }
        
        static void CreateTextBox(string[] parts)
        {
            string name = parts.Length > 1 ? parts[1] : "textbox";
            int x = parts.Length > 2 ? int.Parse(parts[2]) : 0;
            int y = parts.Length > 3 ? int.Parse(parts[3]) : 0;
            
            controls.Add(new ControlItem { Type = "TEXTBOX", Name = name, Text = "[___________]", Color = currentColor, X = x, Y = y });
        }
        
        static void CreatePanel(string[] parts)
        {
            controls.Add(new ControlItem { Type = "PANEL", Name = "panel", Text = "─────────────────────────────────────────────────────", Color = currentColor });
        }
        
        static void CreateMenu(string[] parts)
        {
            string name = parts.Length > 1 ? parts[1] : "Menu";
            controls.Add(new ControlItem { Type = "MENU", Name = name, Text = name, Color = currentColor });
        }
        
        static void CreateToolbar(string[] parts)
        {
            controls.Add(new ControlItem { Type = "TOOLBAR", Name = "toolbar", Text = "═══════════════════════════════════════════════════════", Color = currentColor });
        }
        
        static void CreateStatusBar(string[] parts)
        {
            string text = parts.Length > 1 ? parts[1] : "Ready";
            controls.Add(new ControlItem { Type = "STATUSBAR", Name = "status", Text = text, Color = currentColor });
        }
        
        static void CreateListBox(string[] parts)
        {
            controls.Add(new ControlItem { Type = "LISTBOX", Name = "list", Text = "[ List ]", Color = currentColor });
        }
        
        static void CreateCheckBox(string[] parts)
        {
            string name = parts.Length > 1 ? parts[1] : "checkbox";
            string text = parts.Length > 2 ? parts[2] : "Option";
            controls.Add(new ControlItem { Type = "CHECKBOX", Name = name, Text = text, Color = currentColor });
        }

        static void ShowColorUI()
        {
            string title = windowData.ContainsKey("title") ? windowData["title"] : "Geneia Application";
            
            // Rainbow theme header
            if (currentTheme == "rainbow")
            {
                Console.WriteLine($"{HexToAnsi("#FF0000")}╔{HexToAnsi("#FF7F00")}══════════{HexToAnsi("#FFFF00")}══════════{HexToAnsi("#00FF00")}══════════{HexToAnsi("#0000FF")}══════════{HexToAnsi("#4B0082")}══════════{HexToAnsi("#9400D3")}══════════╗{Reset}");
            }
            else
            {
                Console.WriteLine("╔════════════════════════════════════════════════════════════╗");
            }
            
            // Title
            int padding = (60 - title.Length) / 2;
            if (currentTheme == "rainbow")
            {
                Console.Write($"{HexToAnsi("#FF0000")}║{Reset}");
                Console.Write($"{Bold}{HexToAnsi("#FFD700")}{new string(' ', padding)}{title}{new string(' ', 60 - padding - title.Length)}{Reset}");
                Console.WriteLine($"{HexToAnsi("#9400D3")}║{Reset}");
            }
            else
            {
                Console.WriteLine($"║{new string(' ', padding)}{title}{new string(' ', 60 - padding - title.Length)}║");
            }
            
            // Menu bar
            var menus = controls.FindAll(c => c.Type == "MENU");
            if (menus.Count > 0)
            {
                Console.WriteLine("╠════════════════════════════════════════════════════════════╣");
                Console.Write("║ ");
                foreach (var menu in menus)
                {
                    string color = HexToAnsi(menu.Color);
                    Console.Write($"{color}{Bold}[{menu.Text}]{Reset} ");
                }
                Console.WriteLine(new string(' ', Math.Max(0, 58 - menus.Count * 10)) + "║");
            }
            
            // Toolbar
            var toolbar = controls.Find(c => c.Type == "TOOLBAR");
            if (toolbar != null)
            {
                Console.WriteLine("╠════════════════════════════════════════════════════════════╣");
            }
            
            Console.WriteLine("╠════════════════════════════════════════════════════════════╣");
            Console.WriteLine("║                                                            ║");
            
            // Labels with colors
            var labels = controls.FindAll(c => c.Type == "LABEL");
            foreach (var label in labels)
            {
                string color = HexToAnsi(label.Color);
                string bgColor = HexToAnsiBg(label.Color);
                string text = label.Text;
                
                // Create colored block for the label
                Console.Write("║  ");
                Console.Write($"{color}{Bold}■ {text}{Reset}");
                Console.WriteLine(new string(' ', Math.Max(0, 56 - text.Length - 2)) + "║");
            }
            
            Console.WriteLine("║                                                            ║");
            
            // Panel separator
            var panel = controls.Find(c => c.Type == "PANEL");
            if (panel != null)
            {
                Console.WriteLine("╠────────────────────────────────────────────────────────────╣");
                Console.WriteLine("║                                                            ║");
            }
            
            // Buttons with colors
            var buttons = controls.FindAll(c => c.Type == "BUTTON");
            if (buttons.Count > 0)
            {
                Console.Write("║  ");
                int btnPos = 0;
                foreach (var btn in buttons)
                {
                    string color = HexToAnsi(btn.Color);
                    string bgColor = HexToAnsiBg(btn.Color);
                    
                    // Colored button with background
                    Console.Write($"{bgColor}{HexToAnsi("#FFFFFF")}{Bold}[{btn.Text}]{Reset} ");
                    btnPos += btn.Text.Length + 3;
                    
                    // Line break after 4 buttons
                    if (btnPos > 50)
                    {
                        Console.WriteLine(new string(' ', Math.Max(0, 56 - btnPos)) + "║");
                        Console.Write("║  ");
                        btnPos = 0;
                    }
                }
                if (btnPos > 0)
                {
                    Console.WriteLine(new string(' ', Math.Max(0, 56 - btnPos)) + "║");
                }
            }
            
            Console.WriteLine("║                                                            ║");
            
            // Status bar
            var status = controls.Find(c => c.Type == "STATUSBAR");
            if (status != null)
            {
                Console.WriteLine("╠════════════════════════════════════════════════════════════╣");
                string statusColor = HexToAnsi("#00FF00");
                Console.Write($"║ {statusColor}● {status.Text}{Reset}");
                Console.WriteLine(new string(' ', Math.Max(0, 57 - status.Text.Length)) + "║");
            }
            
            // Footer
            if (currentTheme == "rainbow")
            {
                Console.WriteLine($"{HexToAnsi("#9400D3")}╚{HexToAnsi("#4B0082")}══════════{HexToAnsi("#0000FF")}══════════{HexToAnsi("#00FF00")}══════════{HexToAnsi("#FFFF00")}══════════{HexToAnsi("#FF7F00")}══════════{HexToAnsi("#FF0000")}══════════╝{Reset}");
            }
            else
            {
                Console.WriteLine("╚════════════════════════════════════════════════════════════╝");
            }
        }
    }
}
