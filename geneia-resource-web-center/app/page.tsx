import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const installers = [
    {
      name: "AppImage (Universal Linux)",
      file: "Geneia-Installer-1.0.0-AppImage.zip",
      size: "296 MB",
      platform: "Linux",
      icon: "🐧",
    },
    {
      name: "Debian/Ubuntu (x64)",
      file: "Geneia-Installer-1.0.0-amd64.deb.zip",
      size: "178 MB",
      platform: "Linux",
      icon: "🐧",
    },
    {
      name: "Debian/Ubuntu (ARM64)",
      file: "Geneia-Installer-1.0.0-arm64.deb.zip",
      size: "174 MB",
      platform: "Linux",
      icon: "🐧",
    },
    {
      name: "Fedora/RHEL (x64)",
      file: "Geneia-Installer-1.0.0-x86_64.rpm.zip",
      size: "180 MB",
      platform: "Linux",
      icon: "🐧",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/geneia-icon.svg"
                alt="Geneia"
                width={50}
                height={50}
              />
              <h1 className="text-3xl font-bold text-gray-900">
                Geneia Resource Center
              </h1>
            </div>
            <Link
              href="https://github.com/Arthurc1Moude/Geneia"
              className="text-blue-600 hover:text-blue-800"
            >
              GitHub →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Download Geneia v1.0.0
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Code with clarity. Build with confidence.
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {installers.map((installer) => (
            <div
              key={installer.file}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-4xl">{installer.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {installer.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {installer.platform} • {installer.size}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Includes installer + README with instructions
                  </p>
                </div>
              </div>
              <a
                href={`/downloads/${installer.file}`}
                className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Download
              </a>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            What's Included
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✅</span>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Automatic Installation
                </h4>
                <p className="text-gray-600">
                  One-click installer handles everything
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🖥️</span>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Desktop Shortcut
                </h4>
                <p className="text-gray-600">
                  Automatically creates desktop icon
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔧</span>
              <div>
                <h4 className="font-semibold text-gray-900">PATH Setup</h4>
                <p className="text-gray-600">
                  Configures environment variables
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📦</span>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Full Modules
                </h4>
                <p className="text-gray-600">
                  All standard library modules included
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-gray-900 rounded-lg shadow-md p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Quick Start</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-300 mb-2">1. Download and run installer</p>
              <p className="text-gray-300 mb-2">2. Verify installation:</p>
              <pre className="bg-gray-800 rounded p-3 text-sm overflow-x-auto">
                <code>geneia --version</code>
              </pre>
            </div>
            <div>
              <p className="text-gray-300 mb-2">3. Create your first program:</p>
              <pre className="bg-gray-800 rounded p-3 text-sm overflow-x-auto">
                <code>{`out 'Hello, Geneia!'
set name = 'World'
out 'Welcome to {name}!'`}</code>
              </pre>
            </div>
            <div>
              <p className="text-gray-300 mb-2">4. Run it:</p>
              <pre className="bg-gray-800 rounded p-3 text-sm overflow-x-auto">
                <code>geneia hello.gn</code>
              </pre>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">
            ❤ Developed with care by Moude AI Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
