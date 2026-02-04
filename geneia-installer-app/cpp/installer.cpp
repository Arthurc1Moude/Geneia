#include <napi.h>
#include <string>
#include <iostream>
#include <filesystem>
#include <fstream>
#include "system_utils.h"
#include "file_operations.h"

namespace fs = std::filesystem;

class Installer {
public:
    static Napi::Value Install(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();

        if (info.Length() < 2) {
            Napi::TypeError::New(env, "Expected 2 arguments").ThrowAsJavaScriptException();
            return env.Null();
        }

        std::string installPath = info[0].As<Napi::String>().Utf8Value();
        std::string installType = info[1].As<Napi::String>().Utf8Value();

        try {
            // Create installation directory
            fs::create_directories(installPath);

            // Copy compiler binary
            std::string compilerSrc = "../compiler/geneia";
            std::string compilerDest = installPath + "/bin/geneia";
            FileOperations::CopyFile(compilerSrc, compilerDest);
            FileOperations::MakeExecutable(compilerDest);

            // Install modules
            if (installType == "full") {
                FileOperations::CopyDirectory("../modules", installPath + "/lib/geneia/modules");
                FileOperations::CopyDirectory("../examples", installPath + "/share/geneia/examples");
                FileOperations::CopyDirectory("../editors", installPath + "/share/geneia/editors");
            } else {
                // Minimal: only core modules
                FileOperations::CopyDirectory("../modules", installPath + "/lib/geneia/modules");
            }

            // Create config file
            std::string configPath = installPath + "/geneia.conf";
            std::ofstream configFile(configPath);
            configFile << "modules_path = " << installPath << "/lib/geneia/modules\n";
            configFile << "output_color = true\n";
            configFile << "strict_mode = false\n";
            configFile.close();

            // Add to PATH (platform-specific)
            SystemUtils::AddToPath(installPath + "/bin");

            // Create desktop shortcut
            SystemUtils::CreateDesktopShortcut(installPath + "/bin/geneia", "Geneia IDE");

            Napi::Object result = Napi::Object::New(env);
            result.Set("success", Napi::Boolean::New(env, true));
            result.Set("installPath", Napi::String::New(env, installPath));
            result.Set("message", Napi::String::New(env, "Installation completed successfully"));

            return result;

        } catch (const std::exception& e) {
            Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
            return env.Null();
        }
    }
};

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("install", Napi::Function::New(env, Installer::Install));
    return exports;
}

NODE_API_MODULE(installer, Init)
