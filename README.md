# Hriday Banquet Hall – Premium Website with Admin Panel

A modern, responsive, premium-looking website for **HRIDAY BANQUET HALL**, built with high-end hospitality aesthetics, dynamic content management, real banquet photography galleries, customer memories showcase, dedicated promotion for **SUNSHINE EVENTS & MANAGEMENT**, dual-channel WhatsApp integrations, and a secure CMS admin dashboard.

---

## 🌟 Key Features

### 1. Brand Identity & Design
- **Luxury Hospitality Palette**: Ivory (`#FAF7F0`), Champagne Gold (`#C5A059`, `#D4AF37`), Deep Royal Maroon (`#5A121F`, `#2A060D`), and warm charcoal accents.
- **Bespoke Typography**: Cormorant Garamond & Playfair Display for headings paired with Plus Jakarta Sans for body readability.
- **Subtle Visuals**: Smooth scrolling, gold ambient glow, glassmorphism navigation, responsive lightboxes, and smooth hover effects.

### 2. Public Experience
- **Sticky Navigation**: Brand monogram logo, smooth anchor links, social links, and prominent WhatsApp Quotation button.
- **Hero Section**: Full-width high-resolution banquet interior, headline, trust badge ("Your Celebrations, Our Commitment"), and dual action CTAs.
- **About Us Section**: Narrative description, banquet interior showcase, and 3 editable highlight cards.
- **Facilities & Services**: 8 verified service categories with cover photos, descriptions, and direct "Enquire Now" triggers.
- **Banquet Gallery**:
  - Interactive multi-category slider (Banquet Interiors, Wedding Events, Decorations, Celebrations, Stage Arrangements, Other Events).
  - Auto-slide with hover pause, touch swipe on mobile, thumbnail strip, and full-screen Lightbox with WhatsApp quotation integration.
- **Instagram Showcase**: "Real Celebrations. Real Memories." highlighting genuine community celebration moments and direct Instagram profile follow.
- **Sunshine Events & Management Promotional Block**: Distinct agency showcase highlighting digital marketing, social media management, branding, web development, online advertising, and event management.
- **Contact & Google Maps**: Contact cards, visiting hours, interactive Google Maps responsive embed with "Get Directions" button, and direct quotation web form.
- **Global WhatsApp Integration**:
  - Two independent configurable numbers: **Hriday Banquet Hall** and **Sunshine Events & Management**.
  - Numbers initially remain blank in the database as requested.
  - Graceful handling: If a number is not configured, clicking the button shows an elegant modal with option to use the web form.

### 3. Complete CMS Admin Dashboard (`/admin`)
- **Dashboard Overview**: Real-time metrics (gallery photos count, active services count, real customer quotation inquiries, and WhatsApp status).
- **Gallery Manager**: Upload photographs (from device or external URL), assign categories, set display order, toggle featured slides, and toggle active status.
- **Services Manager**: Add, edit, reorder, and activate/deactivate celebration services.
- **Website Content Manager**: Edit hero headlines, subtitles, trust text, about narrative, and 3 highlight cards.
- **WhatsApp Settings**: Manage independent phone numbers and pre-filled message templates with phone validation and live click-to-chat preview.
- **Sunshine Agency Manager**: Manage agency name, headlines, service offerings, and section visibility.
- **Location & Contact Manager**: Update venue address, phone, email, visiting hours, and Google Maps iframe embed.
- **Social Media Settings**: Update Instagram handle, profile link, and Facebook link.
- **Customer Enquiries**: View incoming quotation requests, update status (new, contacted, quoted, closed), or reply directly to the customer on WhatsApp.
- **General Settings & Security**: Update site metadata, SEO tags, section visibility toggles, and change administrator password.

---

## 🛠️ Tech Stack

- **Frontend**: React 18+, TypeScript, Tailwind CSS, Vite, Lucide React, React Router
- **Backend**: Node.js, Express, TypeScript, Multer (image uploads)
- **Database**:
  - Built-in High-Performance SQLite (`node:sqlite` via `server/data/hriday_banquet.db`) for zero-configuration, instant local execution.
  - Complete **Supabase PostgreSQL** schema and seed migration scripts in `supabase/schema.sql` and `supabase/seed.sql`.
- **Storage**: Local static uploads folder (`server/uploads/`) and optional Supabase Storage bucket (`gallery-images`).
- **Authentication**: JWT token authentication with bcrypt password hashing.

---

## 🚀 Getting Started

### 1. Installation
In the project root:
```bash
npm run install:all
```
Or individually in `server/` and `client/`:
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Development Mode (Frontend + Backend concurrently)
```bash
npm run dev
```
- Client dev server: `http://localhost:5173`
- Backend API server: `http://localhost:5001`

### 3. Production Build & Execution
```bash
npm run build
npm start
```
The Express server serves both the REST API and the production client at `http://localhost:5001`.

---

## 🔐 Admin Access Credentials

- **Admin Login URL**: `http://localhost:5001/admin/login` (or `http://localhost:5173/admin/login` in dev mode)
- **Username / Email**: `admin@hridaybanquet.com`
- **Password**: `HridayAdmin@2026`

*(The administrator can change this password at any time from General Settings).*

---

## 📂 Project Directory Structure

```
hriday-banquet-hall/
├── package.json                 # Monorepo management scripts
├── README.md                    # Project documentation
├── client/                      # React 18 + Vite frontend
│   ├── index.html
│   ├── tailwind.config.js       # Luxury ivory, champagne gold & maroon palette
│   ├── vite.config.ts           # Proxy configuration to port 5001
│   └── src/
│       ├── types/               # Shared TypeScript models
│       ├── services/api.ts      # REST API client
│       ├── context/             # AuthContext & ContentContext
│       ├── components/          # Navbar, Hero, About, Gallery, Lightbox, Sunshine, etc.
│       └── pages/               # HomePage, AdminLoginPage, and Admin Dashboard views
├── server/                      # Express + TypeScript backend
│   ├── data/                    # SQLite database storage (hriday_banquet.db)
│   ├── uploads/                 # Banquet photography uploads
│   └── src/
│       ├── db/                  # Database initialization, schema, and initial seed
│       ├── middleware/          # JWT auth & Multer image processing
│       ├── routes/              # Public, Auth, and Admin CMS routers
│       └── index.ts             # Express server entry point
└── supabase/                    # Supabase Cloud deployment files
    ├── schema.sql               # PostgreSQL tables, indices, and RLS policies
    ├── seed.sql                 # Initial seed data
    └── SUPABASE_GUIDE.md        # Step-by-step setup guide
```
