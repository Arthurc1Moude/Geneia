#ifndef FILE_OPERATIONS_H
#define FILE_OPERATIONS_H

#include <string>

class FileOperations {
public:
    static void CopyFile(const std::string& src, const std::string& dest);
    static void CopyDirectory(const std::string& src, const std::string& dest);
    static void MakeExecutable(const std::string& path);
    static bool FileExists(const std::string& path);
    static void CreateDirectory(const std::string& path);
};

#endif
