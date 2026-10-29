# ASP INTERNATIONAL SCHOOL CITY - Digital QR Attendance System

Professional QR-code based attendance management application for ASP International School City.

## Features

- **Student Management**: Add students with Name, Father Name, ID No, Class
- **Auto QR Generation**: Unique QR code containing student details
- **Download QR Only**: Export clean QR code image for printing
- **Download Full ID Card**: Professional badge template with school logo, student details and QR
- **Camera Scanner**: Mobile-optimized QR scanner using device camera
- **Duplicate Prevention**: Only first scan of the day is recorded; subsequent scans show announcement + voice alert
- **Attendance Log**: Searchable by Name or ID, filter by date
- **Excel Export**: Download full or filtered attendance records as .xlsx
- **Glassmorphism UI**: Modern frosted-glass interface
- **PWA Ready**: Installable on mobile devices

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- qrcode.react
- html5-qrcode
- xlsx + file-saver
- html2canvas
- lucide-react

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel (via GitHub)

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import the GitHub repository
4. Framework Preset: Next.js (auto-detected)
5. Deploy

No environment variables required. Data is stored in browser localStorage.

## Usage Flow

1. **Students** page → Add student → Select student → Download QR Only or Full Card
2. Print QR / Card and distribute to students
3. **Scanner** page → Start Camera → Scan student QR
4. First scan records attendance; duplicate scans are rejected with voice announcement
5. **Attendance** page → Search / Filter → Download Excel

## School Branding

- App name: ASP INTERNATIONAL SCHOOL CITY
- Custom logo included at `/public/logo.svg`
- ID card template includes school header and official styling

## Notes

- Camera requires HTTPS (or localhost) for permission
- Speech synthesis for announcements works on supported browsers
- Data persists per browser/device via localStorage
