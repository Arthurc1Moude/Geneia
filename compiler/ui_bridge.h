#ifndef UI_BRIDGE_H
#define UI_BRIDGE_H

#include <string>
#include <map>
#include <memory>

// Bridge to C# UI runtime
class UIBridge {
private:
    static std::map<std::string, std::string> windows;
    static std::map<std::string, std::string> controls;
    static std::string currentWindow;
    static bool uiInitialized;
    
public:
    // Initialize UI system
    static void Initialize();
    
    // Window functions
    static void CreateWindow(const std::string& name, const std::string& title, int width, int height);
    static void ShowWindow(const std::string& name);
    
    // Control functions
    static void CreateButton(const std::string& name, const std::string& text, int x, int y, int width, int height);
    static void CreateLabel(const std::string& name, const std::string& text, int x, int y, int width, int height);
    static void CreateTextBox(const std::string& name, int x, int y, int width, int height);
    static void CreatePanel(const std::string& name, int x, int y, int width, int height, const std::string& color);
    static void CreateListBox(const std::string& name, int x, int y, int width, int height);
    static void CreateComboBox(const std::string& name, int x, int y, int width, int height);
    static void CreateCheckBox(const std::string& name, const std::string& text, int x, int y, int width, int height);
    static void CreateRadioButton(const std::string& name, const std::string& text, int x, int y, int width, int height);
    static void CreateProgressBar(const std::string& name, int x, int y, int width, int height);
    
    // Property functions
    static void SetText(const std::string& name, const std::string& text);
    static std::string GetText(const std::string& name);
    static void SetBackColor(const std::string& name, const std::string& color);
    static void SetForeColor(const std::string& name, const std::string& color);
    static void AddItem(const std::string& name, const std::string& item);
    
    // Dialog functions
    static void ShowMessage(const std::string& title, const std::string& message);
    static std::string ShowDialog(const std::string& title, const std::string& message, const std::string& type);
    
    // Cleanup
    static void Cleanup();
};

#endif
