#ifndef SYSTEM_UTILS_H
#define SYSTEM_UTILS_H

#include <string>

class SystemUtils {
public:
    static void AddToPath(const std::string& path);
    static std::string GetPlatform();
    static bool IsAdmin();
    static void CreateShortcut(const std::string& target, const std::string& shortcutPath);
};

#endif
