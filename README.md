# Undangan Digital 💍

Platform undangan pernikahan digital untuk pasangan Indonesia, dengan dukungan motif batik, multi-event (Akad, Resepsi, Siraman, dll), dan berbagi via WhatsApp.

## Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth v5 (email + password) |
| Email | Resend |
| Storage | Cloudflare R2 |
| Validation | Zod |
| Forms | React Hook Form |
| Deployment | Vercel |

## Struktur Folder

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── invitations/          # CRUD invitations
│   │   ├── rsvp/                 # RSVP submissions
│   │   ├── wishes/               # Guest wishes
│   │   └── track/                # Open tracking
│   ├── undangan/[slug]/          # Public invitation page
│   ├── dashboard/                # Couple dashboard
│   ├── masuk/                    # Login page
│   └── daftar/                   # Register page
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── auth.ts                   # NextAuth config
│   └── validations.ts            # Zod schemas
├── types/
│   └── index.ts                  # TypeScript types + template configs
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── templates/                # Wedding invitation templates
│   └── dashboard/                # Dashboard components
└── middleware.ts                 # Auth protection
```

## Setup Lokal

```bash
# 1. Clone dan install
git clone ...
npm install

# 2. Salin environment variables
cp .env.example .env.local
# Edit .env.local dengan kredensial kamu

# 3. Setup PostgreSQL (pemula: ikuti docs/SETUP-DATABASE.md — Neon gratis)
#    Lalu jalankan migration:
npx prisma migrate dev --name init

# 4. Jalankan development server
npm run dev

# 5. Daftar akun → http://localhost:3000/daftar
```

## Database Services yang Direkomendasikan

- **Neon** (neon.tech) — PostgreSQL serverless, gratis untuk dev
- **Supabase** (supabase.com) — PostgreSQL + realtime, gratis
- **Railway** (railway.app) — PostgreSQL + deployment, mudah

## Fitur MVP

- [x] Skema database lengkap (Invitation, Event, Guest, RSVP, Wish, Photo, OpenLog)
- [x] NextAuth v5 dengan email + password (daftar / masuk)
- [x] API: invitations, RSVP, wishes, open tracking
- [x] Public invitation page (`/undangan/[slug]`)
- [x] Couple dashboard (`/dashboard`)
- [x] Auth middleware
- [x] Template config (5 template motif Indonesia)
- [x] Tailwind config dengan font & warna batik
- [x] Template UI — Jawa Klasik (public `/undangan/[slug]`)
- [x] Dashboard UI (buat, kelola, terbitkan, tamu, acara)
- [ ] Template UI — 4 motif lainnya (next step)
- [ ] WhatsApp share (next step)
- [ ] Photo upload (next step)

## Template Motif Indonesia

| ID | Nama | Motif | Region | Premium |
|----|------|-------|--------|---------|
| `javanese-classic` | Jawa Klasik | Batik Parang | Jawa | Gratis |
| `sundanese-floral` | Sunda Floral | Floral Sunda | Sunda | Gratis |
| `batak-ulos` | Batak Ulos | Ulos | Batak | Premium |
| `minang-songket` | Minang Songket | Songket | Minang | Premium |
| `modern-elegant` | Modern Elegan | Modern | - | Gratis |
