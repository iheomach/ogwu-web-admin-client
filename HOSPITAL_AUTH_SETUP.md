# Hospital Auth Setup

## How hospitals_directory was populated

Records were inserted manually via a script (not through the portal).
Each row has hospital info (name, phone, location, admin1, country) but
`admin_user_id` was NOT set by the script — it defaults to NULL.

Without `admin_user_id`, no hospital record is linked to a Supabase Auth user,
so no one can log into the portal yet.

---

## Check current state

Run this in the Supabase SQL editor to see which hospitals have auth users linked:

```sql
SELECT id, name, location, country, admin_user_id
FROM hospitals_directory
ORDER BY name;
```

Any row where `admin_user_id IS NULL` has no login credentials yet.

To check if there are any auth users at all:

```sql
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC;
```

---

## Create a test login for a hospital

### Step 1 — Create a Supabase Auth user

Supabase dashboard -> Authentication -> Users -> Add user

- Email: pick anything (e.g. `luth@ogwu.app`)
- Password: pick a strong password
- Copy the UUID that gets assigned to the new user

### Step 2 — Link it to the hospital row

```sql
UPDATE hospitals_directory
SET admin_user_id = '<paste-uuid-here>'
WHERE name = 'Lagos University Teaching Hospital';
```

Confirm it took:

```sql
SELECT name, admin_user_id FROM hospitals_directory WHERE name = 'Lagos University Teaching Hospital';
```

### Step 3 — Log in

Go to your Vercel deployment (or `localhost:5173` if running locally) -> /login

Use the email and password from Step 1.

---

## Bulk setup script (if you have many hospitals)

If you want to create auth users for all hospitals at once, use the
Supabase Management API or this SQL pattern to check which ones still need them:

```sql
SELECT id, name
FROM hospitals_directory
WHERE admin_user_id IS NULL
ORDER BY name;
```

Then for each result: create an auth user in the dashboard and run the UPDATE above.

A reasonable email convention: `<slug>@ogwu.app` or `admin@<hospitaldomain>`.

---

## How the portal uses admin_user_id

When a hospital admin logs in, the portal:

1. Gets `user.id` from `supabase.auth.getUser()`
2. Queries `hospitals_directory WHERE admin_user_id = user.id` to get the hospital's `id`
3. Uses that `hospital_id` to scope ALL queries:
   - Appointments: `WHERE hospital_id = <id>`
   - Consult threads: `WHERE hospital_id = <id>`
   - Patients: derived from appointment records for this hospital

This means every hospital admin only ever sees their own hospital's data.

---

## Supabase RLS note

For the data scoping above to be enforced at the database level (not just the UI),
your Supabase RLS policies on `appointments`, `consult_threads`, etc. should also
restrict reads to rows where `hospital_id` matches the calling user's linked hospital.

The frontend filtering is a first layer — RLS is the authoritative layer.
If RLS is not yet configured on these tables, the hospital_id filter in the
frontend prevents data leakage for now, but it is not cryptographically enforced.
