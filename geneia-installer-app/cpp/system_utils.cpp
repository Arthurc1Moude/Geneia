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
