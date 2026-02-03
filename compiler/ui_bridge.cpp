#include "ui_bridge.h"
#include <iostream>
#include <fstream>
#include <cstdlib>

std::map<std::string, std::string> UIBridge::windows;
std::map<std::string, std::string> UIBridge::controls;
std::string UIBridge::currentWindow;
bool UIBridge::uiInitialized = false;

void UIBridge::Initialize() {
    if (!uiInitialized) {
        std::cout << "[UI] Initializing UI system..." << std::endl;
        uiInitialized = true;
    }
}

void UIBridge::CreateWindow(const std::string& name, const std::string& title, int width, int height) {
    Initialize();
    windows[name] = title;
    currentWindow = name;
    
    std::cout << "[UI] Window created: " << title << " (" << width << "x" << height << ")" << std::endl;
    
    // Generate C# code to create actual window
    std::ofstream uiScript("_geneia_ui_temp.cs");
    uiScript << "using System;\n";
    uiScript << "using System.Drawing;\n";
    uiScript << "using System.Windows.Forms;\n\n";
    uiScript << "class GeneiaUIApp {\n";
    uiScript << "    [STAThread]\n";
    uiScript << "    static void Main() {\n";
    uiScript << "        Application.EnableVisualStyles();\n";
    uiScript << "        Form window = new Form();\n";
    uiScript << "        window.Text = \"" << title << "\";\n";
    uiScript << "        window.Size = new Size(" << width << ", " << height << ");\n";
    uiScript << "        window.StartPosition = FormStartPosition.CenterScreen;\n";
    uiScript << "        window.BackColor = Color.FromArgb(240, 240, 245);\n";
    uiScript << "        \n";
}

void UIBridge::CreateButton(const std::string& name, const std::string& text, int x, int y, int width, int height) {
    controls[name] = "button";
    std::cout << "[UI] Button created: " << text << " at (" << x << ", " << y << ")" << std::endl;
    
    // Append to UI script
    std::ofstream uiScript("_geneia_ui_temp.cs", std::ios::app);
    uiScript << "        Button " << name << " = new Button();\n";
    uiScript << "        " << name << ".Text = \"" << text << "\";\n";
    uiScript << "        " << name << ".Location = new Point(" << x << ", " << y << ");\n";
    uiScript << "        " << name << ".Size = new Size(" << width << ", " << height << ");\n";
    uiScript << "        " << name << ".BackColor = Color.FromArgb(100, 150, 200);\n";
    uiScript << "        " << name << ".ForeColor = Color.White;\n";
    uiScript << "        " << name << ".FlatStyle = FlatStyle.Flat;\n";
    uiScript << "        " << name << ".Font = new Font(\"Segoe UI\", 10, FontStyle.Bold);\n";
    uiScript << "        " << name << ".Click += (s, e) => MessageBox.Show(\"Button clicked: " << text << "\");\n";
    uiScript << "        window.Controls.Add(" << name << ");\n";
    uiScript << "        \n";
}

void UIBridge::CreateLabel(const std::string& name, const std::string& text, int x, int y, int width, int height) {
    controls[name] = "label";
    std::cout << "[UI] Label created: " << text << " at (" << x << ", " << y << ")" << std::endl;
    
    std::ofstream uiScript("_geneia_ui_temp.cs", std::ios::app);
    uiScript << "        Label " << name << " = new Label();\n";
    uiScript << "        " << name << ".Text = \"" << text << "\";\n";
    uiScript << "        " << name << ".Location = new Point(" << x << ", " << y << ");\n";
    uiScript << "        " << name << ".Size = new Size(" << width << ", " << height << ");\n";
    uiScript << "        " << name << ".Font = new Font(\"Segoe UI\", 12, FontStyle.Bold);\n";
    uiScript << "        " << name << ".ForeColor = Color.FromArgb(60, 60, 80);\n";
    uiScript << "        window.Controls.Add(" << name << ");\n";
    uiScript << "        \n";
}

void UIBridge::CreateTextBox(const std::string& name, int x, int y, int width, int height) {
    controls[name] = "textbox";
    std::cout << "[UI] TextBox created at (" << x << ", " << y << ")" << std::endl;
    
    std::ofstream uiScript("_geneia_ui_temp.cs", std::ios::app);
    uiScript << "        TextBox " << name << " = new TextBox();\n";
    uiScript << "        " << name << ".Location = new Point(" << x << ", " << y << ");\n";
    uiScript << "        " << name << ".Size = new Size(" << width << ", " << height << ");\n";
    uiScript << "        " << name << ".Font = new Font(\"Segoe UI\", 10);\n";
    uiScript << "        " << name << ".BackColor = Color.FromArgb(250, 250, 255);\n";
    uiScript << "        window.Controls.Add(" << name << ");\n";
    uiScript << "        \n";
}

void UIBridge::CreatePanel(const std::string& name, int x, int y, int width, int height, const std::string& color) {
    controls[name] = "panel";
    std::cout << "[UI] Panel created at (" << x << ", " << y << ")" << std::endl;
    
    std::ofstream uiScript("_geneia_ui_temp.cs", std::ios::app);
    uiScript << "        Panel " << name << " = new Panel();\n";
    uiScript << "        " << name << ".Location = new Point(" << x << ", " << y << ");\n";
    uiScript << "        " << name << ".Size = new Size(" << width << ", " << height << ");\n";
    uiScript << "        " << name << ".BackColor = Color." << color << ";\n";
    uiScript << "        " << name << ".BorderStyle = BorderStyle.FixedSingle;\n";
    uiScript << "        window.Controls.Add(" << name << ");\n";
    uiScript << "        \n";
}

void UIBridge::CreateListBox(const std::string& name, int x, int y, int width, int height) {
    controls[name] = "listbox";
    std::cout << "[UI] ListBox created at (" << x << ", " << y << ")" << std::endl;
    
    std::ofstream uiScript("_geneia_ui_temp.cs", std::ios::app);
    uiScript << "        ListBox " << name << " = new ListBox();\n";
    uiScript << "        " << name << ".Location = new Point(" << x << ", " << y << ");\n";
    uiScript << "        " << name << ".Size = new Size(" << width << ", " << height << ");\n";
    uiScript << "        " << name << ".Font = new Font(\"Segoe UI\", 10);\n";
    uiScript << "        " << name << ".BackColor = Color.FromArgb(250, 250, 255);\n";
    uiScript << "        window.Controls.Add(" << name << ");\n";
    uiScript << "        \n";
}

void UIBridge::CreateComboBox(const std::string& name, int x, int y, int width, int height) {
    controls[name] = "combobox";
    std::cout << "[UI] ComboBox created at (" << x << ", " << y << ")" << std::endl;
    
    std::ofstream uiScript("_geneia_ui_temp.cs", std::ios::app);
    uiScript << "        ComboBox " << name << " = new ComboBox();\n";
    uiScript << "        " << name << ".Location = new Point(" << x << ", " << y << ");\n";
    uiScript << "        " << name << ".Size = new Size(" << width << ", " << height << ");\n";
    uiScript << "        " << name << ".Font = new Font(\"Segoe UI\", 10);\n";
    uiScript << "        " << name << ".DropDownStyle = ComboBoxStyle.DropDownList;\n";
    uiScript << "        window.Controls.Add(" << name << ");\n";
    uiScript << "        \n";
}

void UIBridge::CreateCheckBox(const std::string& name, const std::string& text, int x, int y, int width, int height) {
    controls[name] = "checkbox";
    std::cout << "[UI] CheckBox created: " << text << " at (" << x << ", " << y << ")" << std::endl;
    
    std::ofstream uiScript("_geneia_ui_temp.cs", std::ios::app);
    uiScript << "        CheckBox " << name << " = new CheckBox();\n";
    uiScript << "        " << name << ".Text = \"" << text << "\";\n";
    uiScript << "        " << name << ".Location = new Point(" << x << ", " << y << ");\n";
    uiScript << "        " << name << ".Size = new Size(" << width << ", " << height << ");\n";
    uiScript << "        " << name << ".Font = new Font(\"Segoe UI\", 10);\n";
    uiScript << "        window.Controls.Add(" << name << ");\n";
    uiScript << "        \n";
}

void UIBridge::CreateRadioButton(const std::string& name, const std::string& text, int x, int y, int width, int height) {
    controls[name] = "radiobutton";
    std::cout << "[UI] RadioButton created: " << text << " at (" << x << ", " << y << ")" << std::endl;
    
    std::ofstream uiScript("_geneia_ui_temp.cs", std::ios::app);
    uiScript << "        RadioButton " << name << " = new RadioButton();\n";
    uiScript << "        " << name << ".Text = \"" << text << "\";\n";
    uiScript << "        " << name << ".Location = new Point(" << x << ", " << y << ");\n";
    uiScript << "        " << name << ".Size = new Size(" << width << ", " << height << ");\n";
    uiScript << "        " << name << ".Font = new Font(\"Segoe UI\", 10);\n";
    uiScript << "        window.Controls.Add(" << name << ");\n";
    uiScript << "        \n";
}

void UIBridge::CreateProgressBar(const std::string& name, int x, int y, int width, int height) {
    controls[name] = "progressbar";
    std::cout << "[UI] ProgressBar created at (" << x << ", " << y << ")" << std::endl;
    
    std::ofstream uiScript("_geneia_ui_temp.cs", std::ios::app);
    uiScript << "        ProgressBar " << name << " = new ProgressBar();\n";
    uiScript << "        " << name << ".Location = new Point(" << x << ", " << y << ");\n";
    uiScript << "        " << name << ".Size = new Size(" << width << ", " << height << ");\n";
    uiScript << "        " << name << ".Style = ProgressBarStyle.Continuous;\n";
    uiScript << "        " << name << ".Value = 50;\n";
    uiScript << "        window.Controls.Add(" << name << ");\n";
    uiScript << "        \n";
}

void UIBridge::ShowWindow(const std::string& name) {
    std::cout << "[UI] Showing window: " << name << std::endl;
    
    // Complete the C# script
    std::ofstream uiScript("_geneia_ui_temp.cs", std::ios::app);
    uiScript << "        Application.Run(window);\n";
    uiScript << "    }\n";
    uiScript << "}\n";
    uiScript.close();
    
    // Compile and run the C# UI
    std::cout << "[UI] Compiling UI application..." << std::endl;
    system("csc /target:winexe /out:_geneia_ui_app.exe _geneia_ui_temp.cs 2>/dev/null");
    
    std::cout << "[UI] Launching UI application..." << std::endl;
    system("./_geneia_ui_app.exe &");
}

void UIBridge::SetText(const std::string& name, const std::string& text) {
    std::cout << "[UI] Set text for " << name << ": " << text << std::endl;
}

std::string UIBridge::GetText(const std::string& name) {
    return "";
}

void UIBridge::SetBackColor(const std::string& name, const std::string& color) {
    std::cout << "[UI] Set background color for " << name << ": " << color << std::endl;
}

void UIBridge::SetForeColor(const std::string& name, const std::string& color) {
    std::cout << "[UI] Set foreground color for " << name << ": " << color << std::endl;
}

void UIBridge::AddItem(const std::string& name, const std::string& item) {
    std::cout << "[UI] Add item to " << name << ": " << item << std::endl;
}

void UIBridge::ShowMessage(const std::string& title, const std::string& message) {
    std::cout << "[UI] Message: " << title << " - " << message << std::endl;
}

std::string UIBridge::ShowDialog(const std::string& title, const std::string& message, const std::string& type) {
    std::cout << "[UI] Dialog: " << title << " - " << message << " (" << type << ")" << std::endl;
    return "OK";
}

void UIBridge::Cleanup() {
    windows.clear();
    controls.clear();
    currentWindow = "";
    uiInitialized = false;
}
