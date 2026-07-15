# Nastavitev administracije Vidim cilj

Koda je pripravljena tako, da brez Supabase ključev pokaže varen predogled administracije. Za pravo prijavo, trajno shranjevanje, novice in fotografije izvedite naslednje korake.

## 1. Ustvarite Supabase projekt

1. Odprite [supabase.com](https://supabase.com/) in izberite **New project**.
2. Izberite organizacijo, ime projekta, močno geslo zbirke in evropsko regijo.
3. Počakajte, da se projekt pripravi.
4. V **SQL Editor** odprite nov poizvedbeni zavihek.
5. Kopirajte celotno vsebino datoteke `supabase/migrations/202607130001_admin_cms.sql` in jo zaženite z **Run**.

Migracija ustvari tabele, revizije, vloge urednikov, RLS varnostna pravila in javno shrambo fotografij z omejitvijo 8 MB.

## 2. Dodajte prvega administratorja

V SQL Editorju zaženite spodnji ukaz in zamenjajte e-poštni naslov:

```sql
insert into public.admin_users(email, role)
values ('vas.pravi.naslov@gmail.com', 'admin');
```

Naslov mora biti zapisan z malimi črkami in mora biti isti Google račun, s katerim se boste prijavljali.

Za dodatnega urednika pozneje uporabite:

```sql
insert into public.admin_users(email, role)
values ('urednik@gmail.com', 'editor');
```

## 3. Pridobite projektna ključa

1. V Supabase odprite **Project Settings → API** oziroma **Connect**.
2. Kopirajte **Project URL**.
3. Kopirajte **Publishable key**. Če projekt kaže samo starejši `anon` key, lahko začasno uporabite tega.
4. V korenu projekta ustvarite `.env.local` po vzoru `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Nikoli ne dodajajte `service_role` ali secret ključa v spremenljivko z oznako `NEXT_PUBLIC`.

## 4. Nastavite Google prijavo

1. Odprite [Google Cloud Console](https://console.cloud.google.com/).
2. Ustvarite ali izberite projekt.
3. V **Google Auth Platform** nastavite ime aplikacije, kontaktni e-poštni naslov in dovoljene uporabnike.
4. Ustvarite **OAuth Client ID** vrste **Web application**.
5. Kot **Authorized redirect URI** dodajte Supabase callback:

```text
https://PROJECT_REF.supabase.co/auth/v1/callback
```

6. Kopirajte Google Client ID in Client Secret.
7. V Supabase odprite **Authentication → Providers → Google**, vključite ponudnika ter vnesite oba podatka.

## 5. Dovoljeni naslovi aplikacije

V **Supabase Authentication → URL Configuration** nastavite:

- Site URL med lokalnim razvojem: `http://localhost:3000`
- Additional Redirect URL: `http://localhost:3000/auth/callback`
- po objavi še: `https://vasa-domena.si/auth/callback`
- po potrebi tudi Netlify predogledni naslov.

Nato ponovno zaženite razvojni strežnik in odprite `/admin/login`.

## 6. Netlify in prava domena

Projekt povežite z Git repozitorijem. Netlify naj uporablja ukaz `pnpm build`; statične mape `out` ne nalagajte več ročno, ker administracija in dinamične novice potrebujejo Next.js runtime.

V **Netlify → Site configuration → Environment variables** dodajte isti spremenljivki:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Po priklopu prave domene posodobite še Supabase Site URL in seznam dovoljenih redirect naslovov.

## Preverjanje

1. Odprite `/admin/login`.
2. Prijavite se z dovoljenim Google računom.
3. V **Vsebina strani** spremenite eno testno besedilo in ga shranite.
4. V **Novice** ustvarite osnutek.
5. Dodajte fotografijo in alternativni opis.
6. Status spremenite na **Objavljeno** in preverite `/novice`.

Če Google račun ni v `admin_users`, se uporabnik lahko uspešno identificira pri Googlu, vendar mu aplikacija in RLS ne dovolita urejanja.
