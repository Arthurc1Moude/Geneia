#include "file_operations.h"
#include <filesystem>
#include <fstream>
#include <iostream>

#ifndef _WIN32
#include <sys/stat.h>
#endif

namespace fs = std::filesystem;

void FileOperations::CopyFile(const std::string& src, const std::string& dest) {
    fs::create_directories(fs::path(dest).parent_path());
    fs::copy_file(src, dest, fs::copy_options::overwrite_existing);
}

void FileOperations::CopyDirectory(const std::string& src, const std::string& dest) {
    fs::create_directories(dest);
    
    for (const auto& entry : fs::recursive_directory_iterator(src)) {
        const auto& path = entry.path();
        auto relativePath = fs::relative(path, src);
        auto destPath = fs::path(dest) / relativePath;
        
        if (fs::is_directory(path)) {
            fs::create_directories(destPath);
        } else {
            fs::copy_file(path, destPath, fs::copy_options::overwrite_existing);
        }
    }
}

void FileOperations::MakeExecutable(const std::string& path) {
#ifndef _WIN32
    chmod(path.c_str(), S_IRWXU | S_IRGRP | S_IXGRP | S_IROTH | S_IXOTH);
#endif
}

bool FileOperations::FileExists(const std::string& path) {
    return fs::exists(path);
}

void FileOperations::CreateDirectory(const std::string& path) {
    fs::create_directories(path);
}
