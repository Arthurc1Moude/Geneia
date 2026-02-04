# Geneia Resource Web Center

A Next.js web application for hosting and distributing Geneia installer packages.

## Features

- 🎨 Modern UI with Tailwind CSS
- 🔥 Firebase Storage for hosting large installer files
- 📦 Download center for all Geneia installers
- 🚀 Fast and responsive
- 📱 Mobile-friendly

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Firebase Storage
4. Get your Firebase config from Project Settings
5. Copy `.env.local.example` to `.env.local`
6. Fill in your Firebase credentials

### 3. Upload Installer Files

Upload the installer zip files to Firebase Storage:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase in this project
firebase init storage

# Upload files to Storage bucket under /downloads/
```

Or manually upload through Firebase Console:
- Go to Storage in Firebase Console
- Create a `downloads` folder
- Upload the 4 installer zip files

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy

#### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

#### Deploy to Firebase Hosting

```bash
firebase init hosting
npm run build
firebase deploy
```

## File Structure

```
geneia-resource-web-center/
├── app/
│   ├── page.tsx          # Main download page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── lib/
│   └── firebase.ts       # Firebase configuration
├── public/
│   ├── geneia-icon.svg   # Geneia logo
│   └── downloads/        # Local downloads (optional)
├── .env.local.example    # Environment variables template
└── README.md
```

## Environment Variables

Create `.env.local` with:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Installer Files

The following files should be uploaded to Firebase Storage:

- `Geneia-Installer-1.0.0-AppImage.zip` (296 MB)
- `Geneia-Installer-1.0.0-amd64.deb.zip` (178 MB)
- `Geneia-Installer-1.0.0-arm64.deb.zip` (174 MB)
- `Geneia-Installer-1.0.0-x86_64.rpm.zip` (180 MB)

## License

MIT © Moude AI Inc.
