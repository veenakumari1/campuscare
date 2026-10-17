# CampusCare

A campus complaint management system. Students submit and track complaints; admins review them and update their status.

Built with Next.js (App Router), TypeScript, Tailwind CSS and Supabase.

## Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. **Create the database.** In Supabase open *SQL Editor > New query*, paste the contents of
   `supabase/migrations/20261016000000_init_campuscare.sql`, and click *Run*.
3. **Add your keys.** Copy `.env.example` to `.env.local` and fill in the three values
   (Supabase Dashboard > *Project Settings > API*):
   - `NEXT_PUBLIC_SUPABASE_URL`: project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: the public `anon` (or "publishable") key
   - `SUPABASE_SERVICE_ROLE_KEY`: the secret `service_role` key (used only by the admin script below; never share it)
4. **(Recommended for testing)** In Supabase, *Authentication > Providers > Email*, turn off
   *Confirm email* so new accounts can log in immediately. Leave it on in production; the sign-up page then tells students to check their inbox.
5. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3000

## Create an admin

Admins can't sign up through the website. Create one from your computer:

```bash
npm run make-admin -- admin@school.edu YourPassword123   # creates the account
npm run make-admin -- someone@school.edu                 # promotes an existing user
```

Then log in at `/admin/login`.

## Pages

| URL | Who | What |
| --- | --- | --- |
| `/` | Everyone | Landing page |
| `/signup`, `/login` | Students | Create account / log in |
| `/complaints/new` | Students | Submit a complaint |
| `/complaints` | Students | Track your complaints |
| `/admin/login` | Admins | Separate admin login |
| `/admin/dashboard` | Admins | View, filter and update complaint status |

## Project layout

```
src/app/                 Pages and server actions (app/actions/)
src/components/          Reusable UI (forms, cards, header, buttons)
src/lib/supabase/        Supabase connection and session handling
src/lib/auth.ts          requireStudent() / requireAdmin() checks
src/lib/validation.ts    Form rules (zod)
src/proxy.ts             Redirects visitors who aren't logged in
supabase/migrations/     Database tables and security rules
scripts/make-admin.mjs   Creates or promotes an admin
```

## How it stays secure

- All writes happen in server actions, and every form is validated again on the server.
- Row Level Security in the database means students can only read their own complaints, and only admins can change a status. This is enforced by the database itself, not just the UI.
- The admin role is checked on the server for every admin page and action.
- The `service_role` key is never used by the website, only by the local `make-admin` script.

## Commands

```bash
npm run dev     # development server
npm run lint    # check code
npm run build   # production build
```
