# PaperPal — PDF Toolkit (Final)

This package contains the full PaperPal project (blue-purple gradient, dark mode, hints, history, preview & reorder, and Download All functionality).

## Quick start (Windows)

1. Unzip and open the folder
```powershell
cd %USERPROFILE%\Downloads
powershell -Command "Expand-Archive -Path pdffusion-pro.zip -DestinationPath pdffusion-pro"
cd pdffusion-pro
```

2. Install dependencies
```powershell
npm cache clean --force
npm install
```

3. Run dev server
```powershell
npm run dev
```

Open the printed Vite URL (usually http://localhost:5173)

## Notes
- All processing happens locally in the browser. No files are uploaded to any server.
- Compress turns pages into images; selectable text may be lost.
- If pdfjs worker fails to load, ensure your computer can reach the CDN or modify the code to use a local worker.
