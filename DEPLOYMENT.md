# Panduan Deploy Playreia ke Vercel

Panduan langkah demi langkah dari persiapan project hingga live di Vercel.

---

## Prasyarat

- Akun [GitHub](https://github.com) (gratis)
- Akun [Vercel](https://vercel.com) (gratis, login dengan GitHub)
- Server MariaDB yang bisa diakses publik (Alstore Hosting kamu)
- (Opsional) Google Cloud Console untuk Google OAuth

---

## Langkah 1: Persiapan Repository GitHub

### 1.1 Buat Repository Baru di GitHub

1. Buka [github.com/new](https://github.com/new)
2. Isi **Repository name**: `playreia` (atau nama lain)
3. Pilih **Private** (disarankan)
4. Klik **Create repository**

### 1.2 Push Project ke GitHub

Buka terminal di folder `artifacts/playreia` dan jalankan:

```bash
# Inisialisasi git (jika belum ada)
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit: Playreia with Auth.js + MariaDB"

# Tambahkan remote origin (ganti USERNAME dengan username GitHub kamu)
git remote add origin https://github.com/USERNAME/playreia.git

# Push ke GitHub
git push -u origin main
```

> **Catatan:** File `.env` sudah ada di `.gitignore`, jadi secrets tidak akan ikut ter-push.

---

## Langkah 2: Import Project ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new)
2. Klik **Import Git Repository**
3. Pilih repository `playreia` yang baru dibuat
4. Vercel akan otomatis mendeteksi ini sebagai **SvelteKit** project
5. **Jangan klik Deploy dulu** — lanjutkan ke Langkah 3 terlebih dahulu

---

## Langkah 3: Konfigurasi Environment Variables di Vercel

Di halaman import project Vercel, scroll ke bagian **Environment Variables** dan tambahkan satu per satu:

### Wajib

| KEY | VALUE | Keterangan |
|-----|-------|------------|
| `MYSQL_DATABASE_URL` | `mysql://USER:PASSWORD@database.alstore.space:6969/NAMA_DB` | Ganti USER, PASSWORD, dan NAMA_DB |
| `AUTH_SECRET` | *(generate di bawah)* | Secret key untuk enkripsi session |
| `AUTH_TRUST_HOST` | `true` | Wajib untuk deployment di Vercel |
| `NEXTAUTH_URL` | `https://www.playreia.com` | URL produksi situs kamu |
| `RESEND_API_KEY` | *(API key Resend kamu)* | Untuk newsletter |
| `CANONICAL_ORIGIN` | `https://www.playreia.com` | URL canonical untuk SEO |
| `LAUNCH_DATE` | `2026-04-10` | Tanggal launch untuk Dynamic ID |

### Cara Generate AUTH_SECRET

Jalankan salah satu perintah ini di terminal:

```bash
# Menggunakan openssl (Linux/Mac/WSL)
openssl rand -hex 32

# Menggunakan Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Hasilnya berupa string 64 karakter hex. Salin dan masukkan sebagai value `AUTH_SECRET`.

### Opsional (Google OAuth)

| KEY | VALUE |
|-----|-------|
| `GOOGLE_CLIENT_ID` | Client ID dari Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Client Secret dari Google Cloud Console |

---

## Langkah 4: Konfigurasi Build

Vercel sudah dikonfigurasi via `vercel.json` dengan build command:

```
npx prisma generate && npm run build
```

Ini memastikan Prisma Client di-generate **sebelum** `vite build` dijalankan, sehingga tidak ada error database client saat runtime.

Jika Vercel menanyakan konfigurasi build secara manual:

| Setting | Value |
|---------|-------|
| **Framework Preset** | SvelteKit |
| **Build Command** | `npx prisma generate && npm run build` |
| **Output Directory** | `.vercel/output` (auto) |
| **Install Command** | `npm install` |
| **Root Directory** | `artifacts/playreia` (jika deploy dari monorepo) |

---

## Langkah 5: Whitelist IP Vercel di MariaDB Alstore Hosting

Ini adalah langkah **paling penting** — Vercel menggunakan IP dinamis, jadi ada dua opsi:

### Opsi A: Allow All IP (Termudah — Gunakan jika server di-protect dengan password kuat)

Di panel hosting Alstore, cari pengaturan **Remote MySQL** atau **Database Access** dan tambahkan:
```
Host: %
```
Ini mengizinkan koneksi dari semua IP.

> ⚠️ Pastikan password database kamu kuat jika menggunakan opsi ini.

### Opsi B: Whitelist IP Vercel (Lebih Aman)

Daftar IP Vercel yang perlu di-whitelist: [vercel.com/docs/security/deployment-protection/methods-to-protect-all-vercel-deployments/vercel-firewall#vercel-firewall-cidr-ranges](https://vercel.com/docs/security/deployment-protection)

Tambahkan di **Remote MySQL** panel Alstore Hosting:
```
76.76.21.0/24
76.76.22.0/24
```

### Verifikasi Koneksi Database

Setelah deploy, uji koneksi dengan menambahkan endpoint test (hapus setelah testing):

```typescript
// src/routes/api/db-test/+server.ts (HAPUS SETELAH TESTING)
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const GET = async () => {
  const count = await prisma.user.count();
  return json({ ok: true, users: count });
};
```

---

## Langkah 6: Setup Google OAuth (Opsional)

1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Buat project baru atau pilih yang ada
3. Pergi ke **APIs & Services** → **Credentials**
4. Klik **Create Credentials** → **OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. Tambahkan **Authorized Redirect URIs**:
   ```
   https://www.playreia.com/auth/callback/google
   https://playreia.vercel.app/auth/callback/google
   ```
7. Salin **Client ID** dan **Client Secret**
8. Masukkan ke Vercel Dashboard → Settings → Environment Variables

---

## Langkah 7: Deploy!

1. Kembali ke Vercel
2. Pastikan semua environment variables sudah diisi
3. Klik **Deploy**
4. Vercel akan:
   - Install dependencies (`npm install`)
   - Generate Prisma Client (`npx prisma generate`)
   - Build SvelteKit (`npm run build`)
   - Deploy ke edge network

---

## Langkah 8: Setelah Deploy — Setup Database

Prisma sudah dikonfigurasi dengan `prisma db push` saat pengembangan, tetapi di Vercel kamu mungkin perlu menjalankan ini secara manual dari mesin lokal kamu **setelah** pertama kali deployment:

```bash
# Di folder artifacts/playreia, dengan .env yang sudah dikonfigurasi
npx prisma db push
```

Atau jalankan di terminal lokal dengan koneksi ke database production:
```bash
MYSQL_DATABASE_URL="mysql://USER:PASSWORD@database.alstore.space:6969/NAMA_DB" npx prisma db push
```

---

## Checklist Pre-Launch

- [ ] `MYSQL_DATABASE_URL` sudah benar dan bisa diakses dari Vercel
- [ ] `AUTH_SECRET` sudah di-generate (64 karakter hex)
- [ ] `AUTH_TRUST_HOST=true` sudah ditambahkan
- [ ] `NEXTAUTH_URL` mengarah ke domain produksi
- [ ] `CANONICAL_ORIGIN` mengarah ke domain produksi
- [ ] `RESEND_API_KEY` sudah diisi (untuk newsletter)
- [ ] `LAUNCH_DATE` sudah diset ke tanggal launch resmi
- [ ] IP Vercel sudah di-whitelist di database Alstore Hosting
- [ ] Tabel database sudah dibuat (prisma db push)

---

## Troubleshooting

### Error: "Untrusted Host"
Tambahkan `AUTH_TRUST_HOST=true` ke environment variables Vercel.

### Error: "Can't reach database server"
- Pastikan IP Vercel sudah di-whitelist di Alstore Hosting
- Cek format `MYSQL_DATABASE_URL` (prefix harus `mysql://` bukan `mariadb://`)
- Verifikasi port `6969` terbuka untuk koneksi eksternal

### Error: "PrismaClientInitializationError"
Build command belum include `prisma generate`. Pastikan `vercel.json` sudah benar.

### Error: "NEXTAUTH_URL mismatch"
Pastikan `NEXTAUTH_URL` di Vercel sama persis dengan URL yang kamu akses (termasuk `https://` dan tanpa trailing slash).

### Google OAuth tidak bekerja
Pastikan Authorized Redirect URI di Google Console sudah sesuai dengan domain Vercel kamu (termasuk subdomain preview seperti `playreia-xyz.vercel.app`).
