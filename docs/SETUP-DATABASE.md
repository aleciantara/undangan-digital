# PostgreSQL untuk pemula (Neon)

Kamu **tidak perlu install PostgreSQL di komputer**. Kita pakai **Neon** — database PostgreSQL gratis di cloud, cukup copy-paste satu URL.

## Langkah 1 — Buat akun Neon

1. Buka [https://neon.tech](https://neon.tech)
2. Daftar (bisa pakai GitHub atau email)
3. Klik **New Project**
4. Nama project: `undangan-digital` (bebas)
5. Region: pilih yang dekat (mis. **Singapore**)
6. Klik **Create project**

## Langkah 2 — Ambil connection string

1. Di dashboard Neon, buka tab **Connection Details**
2. Pilih **Connection string**
3. Untuk **migrate pertama**, pilih **Direct connection** (bukan Pooler)
4. Klik **Copy** — bentuknya seperti:

```
postgresql://neondb_owner:xxxxx@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

## Langkah 3 — Masukkan ke `.env.local`

Buka file `C:\laragon\www\undangan-digital\.env.local` dan ganti baris `DATABASE_URL`:

```env
DATABASE_URL="postgresql://....paste-dari-neon....?sslmode=require"
```

Simpan file.

## Langkah 4 — Buat tabel di database (migration)

Di terminal, dari folder project:

```powershell
cd C:\laragon\www\undangan-digital
npx prisma migrate dev --name init
```

Kalau berhasil, kamu akan melihat folder `prisma/migrations/` dan pesan sukses.

**Kalau error P1001 "Can't reach database server":**

1. **Hanya satu baris `DATABASE_URL`** di `.env.local` — jangan tambah `Host=`, `Password=`, `Pooler=` (itu bikin Prisma bingung).
2. Password harus **di dalam URL**, bukan `xxxxxx` placeholder.
3. Pakai string **Direct** dari Neon (hostname **tanpa** `-pooler`).
4. Cek project Neon tidak **Suspended** (buka dashboard → wake project).
5. Port **5432** kadang diblokir WiFi/kantor/antivirus — coba **hotspot HP** atau VPN, lalu jalankan migrate lagi.
6. Kalau tetap gagal: buat SQL dari schema lalu jalankan di Neon SQL Editor:

```powershell
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script -o prisma/init.sql
```

Buka Neon → **SQL Editor** → paste isi `prisma/init.sql` → Run. Lalu:

```powershell
npx prisma migrate resolve --applied init
```

**Kalau error auth / password salah:**

- Reset password di Neon → Connection Details → reset → update `DATABASE_URL`

## Langkah 5 — Cek data (opsional)

```powershell
npx prisma studio
```

Browser terbuka — kamu bisa lihat tabel `User`, `Invitation`, dll.

## Seed akun admin & user (disarankan)

Setelah migrate, jalankan:

```powershell
npm run db:seed
```

Akun default:

| Role | Email | Password |
|------|-------|----------|
| ADMIN | `admin@undangandigital.com` | `Admin123!` |
| USER | `user@undangandigital.com` | `User123!` |

Ubah lewat variabel `SEED_ADMIN_*` dan `SEED_USER_*` di `.env.local` sebelum seed.

## Daftar & masuk

1. `npm run dev`
2. http://localhost:3000/masuk — login dengan akun seed di atas, **atau**
3. http://localhost:3000/daftar — buat akun baru (role **USER**)

---

## Apa itu PostgreSQL (singkat)?

| Istilah | Arti |
|---------|------|
| **Database** | Tempat menyimpan data (user, undangan, tamu) |
| **PostgreSQL** | Jenis database (populer, kuat, dipakai Neon/Vercel) |
| **Prisma** | Cara app Node.js bicara ke PostgreSQL |
| **Migration** | Skrip yang membuat/mengubah tabel sesuai `schema.prisma` |
| **Neon** | Hosting PostgreSQL gratis — tidak perlu install di PC |

---

## Alternatif lain

- [Supabase](https://supabase.com) — juga PostgreSQL, ada UI mirip spreadsheet
- [Railway](https://railway.app) — PostgreSQL + deploy

Cara pakainya sama: copy connection string → `DATABASE_URL` → `npx prisma migrate dev`.
