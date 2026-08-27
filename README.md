# Be Positive News

Müstəqil, yoxlanılmış yaxşı xəbərlər nəşri — elm, sağlamlıq, ətraf mühit, cəmiyyət və mədəniyyət sahələrindən.

Hazırda sayt Azərbaycan dilində fəaliyyət göstərir; digər dillərin (o cümlədən ingilis dilinin) əlavə olunması planlaşdırılır.

## Texnologiya

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)

## İnkişaf

```bash
npm install
npm run dev
```

Nəticəni görmək üçün [http://localhost:3000](http://localhost:3000) açın.

## Struktur

- `src/app/(site)` — ictimai səhifələr (ana səhifə, kateqoriya, məqalə, haqqımızda, axtarış)
- `src/app/admin` — xəbər idarəetmə paneli (bax aşağı)
- `src/components` — paylaşılan UI komponentləri
- `src/content` — xəbər məlumatları (`articles.json`) və köməkçi funksiyalar (`articles.ts`)
- `src/lib` — köməkçi funksiyalar (tarix formatlama, admin auth, GitHub API və s.)

## Build

```bash
npm run build
npm run lint
```

## Admin panel (`/admin`)

Sayt tam statikdır — verilənlər bazası yoxdur. Admin panel xəbərləri
`src/content/articles.json` faylına, şəkilləri isə `public/uploads/`
qovluğuna GitHub Contents API vasitəsilə birbaşa commit edir; Vercel
həmin push-u görüb saytı avtomatik yenidən deploy edir (adətən 30-60
saniyə). Hər yeni xəbər üçün şəkil məcburidir (JPG/PNG/WEBP, maks.
2MB); köhnə xəbərlər (şəkilsiz) hələ də fon rəngi + emoji ilə göstərilir.

Aktiv etmək üçün Vercel-də (Project Settings → Environment Variables)
bu dəyişənləri təyin edin (nümunə: `.env.example`):

- `ADMIN_PASSWORD` — `/admin` girişi üçün parol
- `GITHUB_TOKEN` — bu repoya `Contents: Read and write` icazəsi olan
  fine-grained Personal Access Token
  ([yaratmaq üçün](https://github.com/settings/personal-access-tokens/new))
- `GITHUB_REPO` — `sahib/repo` formatında (məs. `alamdarmanafov/bepositivenews`)
- `GITHUB_CONTENT_BRANCH` — commit ediləcək branch, Vercel-in deploy
  etdiyi branch ilə eyni olmalıdır (hazırda `claude/yeni-sayt-quraq-8ya9y2`,
  bu repoda hələ `main` yoxdur)
- `NEXT_PUBLIC_SITE_URL` — saytın əsl domeni (canonical/OG/sitemap üçün)

Dəyişənlər olmadan `/admin` girişə icazə vermir və xəbər siyahısı
xəta mesajı göstərir — sayt özü bundan təsirlənmir.
