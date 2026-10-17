// Creates an admin account, or promotes an existing user to admin.
//
// Usage (from the project folder):
//   npm run make-admin -- admin@school.edu              (user already signed up)
//   npm run make-admin -- admin@school.edu MyPassword1  (create the admin account)
//
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
// The service role key bypasses all security rules, so this runs only on your computer.

import { createClient } from "@supabase/supabase-js";

const [email, password] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function fail(message) {
  console.error(`\nError: ${message}\n`);
  process.exit(1);
}

if (!email) fail("Please provide an email. Example: npm run make-admin -- admin@school.edu");
if (!url || !serviceKey) {
  fail("Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local first.");
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(target) {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) fail(`Could not list users: ${error.message}`);
    const match = data.users.find((u) => u.email?.toLowerCase() === target.toLowerCase());
    if (match) return match;
    if (data.users.length < 1000) return null;
  }
}

let user = await findUserByEmail(email);

if (!user) {
  if (!password) {
    fail(`No user found for ${email}. Add a password to create the account:\n  npm run make-admin -- ${email} YourPassword`);
  }
  if (password.length < 8) fail("Password must be at least 8 characters.");
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Administrator" },
  });
  if (error) fail(`Could not create the user: ${error.message}`);
  user = data.user;
  console.log(`Created account for ${email}.`);
}

const { error } = await supabase.from("profiles").upsert({
  id: user.id,
  full_name: user.user_metadata?.full_name ?? "Administrator",
  role: "admin",
});
if (error) {
  fail(`Could not set the admin role: ${error.message}\nHave you run the SQL migration in Supabase yet?`);
}

console.log(`Done. ${email} is now an admin. Log in at /admin/login`);
