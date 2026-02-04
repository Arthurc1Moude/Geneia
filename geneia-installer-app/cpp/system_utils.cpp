#include "system_utils.h"
#include <iostream>
#include <fstream>
#include <cstdlib>

#ifdef _WIN32
#include <windows.h>
#include <shlobj.h>
#elif __APPLE__
#include <unistd.h>
#include <sys/stat.h>
#else
#include <unistd.h>
#include <sys/stat.h>
#endif

void SystemUtils::AddToPath(const std::string& path) {
#ifdef _WIN32
    // Windows: Add to registry
    std::string cmd = "setx PATH \"%PATH%;" + path + "\"";
    system(cmd.c_str());
#elif __APPLE__
    // macOS: Add to .zshrc and .bash_profile
    std::string homeDir = getenv("HOME");
    std::ofstream zshrc(homeDir + "/.zshrc", std::ios::app);
    zshrc << "\nexport PATH=\"$PATH:" << path << "\"\n";
    zshrc.close();
    
    std::ofstream bashrc(homeDir + "/.bash_profile", std::ios::app);
    bashrc << "\nexport PATH=\"$PATH:" << path << "\"\n";
    bashrc.close();
#else
    // Linux: Add to .bashrc
    std::string homeDir = getenv("HOME");
    std::ofstream bashrc(homeDir + "/.bashrc", std::ios::app);
    bashrc << "\nexport PATH=\"$PATH:" << path << "\"\n";
    bashrc.close();
#endif
}

std::string SystemUtils::GetPlatform() {
#ifdef _WIN32
    return "Windows";
#elif __APPLE__
    return "macOS";
#else
    return "Linux";
#endif
}

bool SystemUtils::IsAdmin() {
#ifdef _WIN32
    BOOL isAdmin = FALSE;
    PSID adminGroup = NULL;
    SID_IDENTIFIER_AUTHORITY ntAuthority = SECURITY_NT_AUTHORITY;
    
    if (AllocateAndInitializeSid(&ntAuthority, 2, SECURITY_BUILTIN_DOMAIN_RID,
        DOMAIN_ALIAS_RID_ADMINS, 0, 0, 0, 0, 0, 0, &adminGroup)) {
        CheckTokenMembership(NULL, adminGroup, &isAdmin);
        FreeSid(adminGroup);
    }
    return isAdmin;
#else
    return geteuid() == 0;
#endif
}

void SystemUtils::CreateShortcut(const std::string& target, const std::string& shortcutPath) {
#ifdef _WIN32
    // Windows shortcut creation
    CoInitialize(NULL);
    IShellLink* pShellLink = NULL;
    HRESULT hres = CoCreateInstance(CLSID_ShellLink, NULL, CLSCTX_INPROC_SERVER,
                                    IID_IShellLink, (LPVOID*)&pShellLink);
    if (SUCCEEDED(hres)) {
        pShellLink->SetPath(target.c_str());
        IPersistFile* pPersistFile;
        hres = pShellLink->QueryInterface(IID_IPersistFile, (LPVOID*)&pPersistFile);
        if (SUCCEEDED(hres)) {
            WCHAR wsz[MAX_PATH];
            MultiByteToWideChar(CP_ACP, 0, shortcutPath.c_str(), -1, wsz, MAX_PATH);
            pPersistFile->Save(wsz, TRUE);
            pPersistFile->Release();
        }
        pShellLink->Release();
    }
    CoUninitialize();
#else
    // Unix: Create symlink
    symlink(target.c_str(), shortcutPath.c_str());
#endif
}

void SystemUtils::CreateDesktopShortcut(const std::string& targetPath, const std::string& name) {
#ifdef _WIN32
    // Windows: Create .lnk file on desktop
    char desktopPath[MAX_PATH];
    SHGetFolderPathA(NULL, CSIDL_DESKTOP, NULL, 0, desktopPath);
    std::string shortcutPath = std::string(desktopPath) + "\\" + name + ".lnk";
    CreateShortcut(targetPath, shortcutPath);
#elif __APPLE__
    // macOS: Create launcher script on desktop
    std::string home = getenv("HOME");
    std::string desktopPath = home + "/Desktop/" + name;
    
    std::ofstream launcher(desktopPath);
    if (launcher.is_open()) {
        launcher << "#!/bin/bash\n";
        launcher << "\"" << targetPath << "\" \"$@\"\n";
        launcher.close();
        chmod(desktopPath.c_str(), 0755);
    }
#else
    // Linux: Create .desktop file
    std::string home = getenv("HOME");
    std::string desktopPath = home + "/Desktop/" + name + ".desktop";
    
    // Extract directory from targetPath for icon
    std::string iconPath = targetPath.substr(0, targetPath.find_last_of("/")) + "/../share/icons/geneia.png";
    
    std::ofstream desktopFile(desktopPath);
    if (desktopFile.is_open()) {
        desktopFile << "[Desktop Entry]\n";
        desktopFile << "Version=1.0\n";
        desktopFile << "Type=Application\n";
        desktopFile << "Name=" << name << "\n";
        desktopFile << "Comment=Geneia Programming Language IDE\n";
        desktopFile << "Exec=" << targetPath << " %F\n";
        desktopFile << "Icon=" << iconPath << "\n";
        desktopFile << "Terminal=false\n";
        desktopFile << "Categories=Development;IDE;\n";
        desktopFile << "Keywords=programming;compiler;geneia;\n";
        desktopFile.close();
        chmod(desktopPath.c_str(), 0755);
    }
    
    // Also install to applications menu
    std::string appsDir = home + "/.local/share/applications";
    system(("mkdir -p " + appsDir).c_str());
    std::string appsPath = appsDir + "/" + name + ".desktop";
    system(("cp " + desktopPath + " " + appsPath).c_str());
#endif
}
