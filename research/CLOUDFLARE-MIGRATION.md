# Переезд iznkit.com с Vercel на Cloudflare Workers

**Статус на 05.11.2026: все 18 PDF-роутов переписаны на pdf-lib и РЕНДЕРЯТСЯ ВЕРНО на workerd;
3 шаблона счёта восстановлены; критический баг шрифтов исправлен. Остаётся: полная A/B-сверка с
продом, `public/_headers` + `.env.production.local`, деплой воркера и переключение DNS. Домен не тронут,
прод на Vercel.** Ветка `cf-migration` (запушена, бэкап на GitHub).

## ⚠️ Критический баг шрифтов (найден и исправлен 05.11) — ОБЯЗАТЕЛЬНО к сведению
Рантайм-сабсеттинг fontkit (`embedFont(bytes, {subset:true})`) **портит таблицу glyf и молча теряет
большинство кириллических глифов**: PDF-ы отдают `pdftotext` корректный текст (через ToUnicode), но в
реальных вьюерах (CoreGraphics/Preview/Chrome, poppler) текст рендерится ПУСТЫМ. Затрагивало ВСЕ 18
документов. Приёмка 13 Cursor-документов это пропустила, потому что проверяла только `pdftotext`, а не
визуальный рендер. **Урок: PDF проверять рендером в PNG (`qlmanage -t` / `pdftoppm`), не только pdftotext.**
Фикс: NotoSans **пресаб­сечен офлайн** (`pyftsubset` → Cyrillic+Latin+пунктуация+₽/№/«»/—, 630 КБ→54 КБ
каждый) и встраивается ЦЕЛИКОМ (`subset:false` в `src/lib/pdf2/fonts.ts`). PDF ~68–73 КБ, рендер верный.
Регенерация шрифтов: `pyftsubset public/fonts/NotoSans-{Regular,Bold}.ttf --unicodes=... → base64 → fonts-data.ts`.

## Главный блокер: @react-pdf на Workers не едет (в отличие от izntools)
izntools/calc-tools/worldtime переехали легко — у них **нет @react-pdf**. У iznkit — 18 PDF-роутов
(`src/app/api/pdf/*`) на `@react-pdf/renderer` (счёт, счёт-фактура, УПД, ТОРГ-12, акт сверки, чек, КП, NDA,
квитанции и т.д.) — это ядро продукта.

**Корень (найден на workerd под OpenNext):**
`RuntimeError: Aborted(CompileError: WebAssembly.instantiate(): Wasm code generation disallowed by embedder)`.
@react-pdf тащит **yoga-layout** (движок флекс-раскладки), который инстанцирует WASM из байтов **в рантайме**.
Cloudflare Workers это **запрещают** (WASM — только статический импорт на сборке). Конфигом не чинится.
(Ранний пилот на голом wrangler падал раньше — на fontkit `new URL`; под OpenNext воркер стартует, но
yoga-WASM всплывает при вызове роута.)

## Решение владельца (02.11): переписать PDF на pdf-lib
Выбран вариант: убрать `@react-pdf`, переписать все 18 документов на **pure-JS pdf-lib** (работает на Workers).

### ✅ Подтверждено на workerd (go/no-go пройден)
Минимальный тест-роут с pdf-lib + `@pdf-lib/fontkit` + встраиванием NotoSans:
- **HTTP 200, валидный %PDF-1.7**, кириллица и ₽ рендерятся корректно, **без WASM-ошибок**.
- Шрифт встраивается из base64 (`src/lib/pdf2/fonts-data.ts`, NotoSans Regular+Bold, ~1.6 МБ в бандле) —
  на Workers нет файловой системы, поэтому шрифт инлайнится, а не читается с диска (как было у @react-pdf
  через `process.cwd()/public/fonts`). PDF ~640 КБ из-за полного шрифта (можно засабсетить до кириллицы+латиницы).
- Рабочий паттерн: `const d=await PDFDocument.create(); d.registerFontkit(fontkit); const f=await d.embedFont(bytes);
  page.drawText(..., {font:f}); const bytes=await d.save();` + `atob`-хелпер base64→Uint8Array.

## Что сделано в ветке cf-migration
- `@opennextjs/cloudflare` + `wrangler` + `pdf-lib` + `@pdf-lib/fontkit` установлены (`--legacy-peer-deps`:
  адаптер peer-требует Next ≥16.4.1, iznkit на 16.2.12 — izntools/calc-tools на 16.3.x делали так же, рантайм ок).
- `open-next.config.ts` (static-assets incremental cache) + `wrangler.jsonc` (`name:iznkit`, `workers_dev:false`,
  `preview_urls:false`, `nodejs_compat`, assets, self-ref) — по образцу calc-tools.
- Скрипты `cf:build` / `cf:preview` / `cf:deploy`.
- `src/lib/pdf2/fonts-data.ts` — base64 NotoSans (основа для всех документов).
- `.open-next/`, `.wrangler/` — в `.gitignore`.
- Сборка: `source ~/.nvm/nvm.sh && nvm use 22 && NEXT_PUBLIC_SITE_URL=https://iznkit.com npm run cf:build`;
  локальный прогон: `npx wrangler dev` на `.open-next/worker.js`.

## Переписывание PDF — ✅ ЗАВЕРШЕНО (все 18 роутов на pdf-lib)
Фундамент `src/lib/pdf2/`: `layout.ts` (класс `Doc` — страница/перенос/таблицы/поля/QR/футер),
`grid.ts` (`drawGrid` — официальные формы: шапка+номера граф+строки+границы+слияние ячеек),
`fonts.ts`+`fonts-data.ts` (пресаб­сет NotoSans, subset:false — см. баг выше).
- **invoice** (3 шаблона split/band/minimal + акцент по `template`, ГОСТ-QR, watermark PREVIEW),
  **akt-sverki**, + **13 Cursor-документов** (adroi/cert/delivery/hourly/inspection/nda/po/quote/receipt/
  rental/tax/timesheet/unit).
- **3 легальные grid-формы**: `schet-faktura`, `upd` (статус+передаточная часть), `torg12` (15 граф) — через `drawGrid`.
- Все роуты `src/app/api/pdf/*/route.tsx` переключены со `@react-pdf`/`renderToBuffer` на новый билдер
  (`new Response(new Uint8Array(bytes), …)`). `grep -rl @react-pdf src/app/api/pdf` — пусто.
- Старые `src/lib/pdf/*-document.tsx` оставлены на месте (роуты на них не ссылаются), удалять не обязательно.

## Инвентаризация Vercel-специфики iznkit (чистая)
- Нет `vercel.json`, нет `@vercel/*`, нет middleware-файла, нет Supabase/auth (аккаунтов нет).
- `headers()` в `next.config.ts` — security-заголовки на все роуты; **на `public/` на CF не дойдут** → нужен
  `public/_headers` (fonts, donate-svg, картинки). Урок izntools.
- Env: `NEXT_PUBLIC_SITE_URL` (каноникалы → https://iznkit.com, build-time — класть в `.env.production.local`),
  `NEXT_PUBLIC_ADSENSE_ID`/`NEXT_PUBLIC_EZOIC_ADSTXT` (опц., дефолты есть), `UNLOCK_SECRET` (серверный секрет —
  через `wrangler secret put`, не в бандл).
- Аналитика уже за гейтом хоста (`src/components/analytics.tsx`, `location.hostname==='iznkit.com'`) — на зеркалах
  не стартует; при переезде гейт сохранить (на новом хосте он же и нужен).

## Что осталось (после переписывания PDF)
- `public/_headers` (security + кэш статики), HSTS (пропадает после Vercel — вернуть в next.config + _headers).
- Деплой воркера (`cf:deploy`, OAuth владельца; автомод режет — нужно разрешение в `.claude/settings.local.json`).
- Переключение DNS — в дашборде CF (Workers → iznkit → Domains & Routes → Add Domain → iznkit.com), атомарно
  заменяет Vercel-запись. Делает владелец/с его «да». `www` → проксированный CNAME + Redirect Rule 301.
- Always Use HTTPS включает диспетчер (настройка зоны).
- После недели — `vercel git disconnect`.
- Проверка: аналитика с гейтом, каноникалы, sitemap, Search Console (адрес тот же).

## Follow-up: 3 шаблона счёта — ✅ ВОССТАНОВЛЕНО (05.11)
3 стиля шапки восстановлены в `src/lib/pdf2/invoice.ts`: `split` (classic/amber — акцент-заголовок слева,
мета справа), `band` (modern/rose/royal — цветная плашка во всю ширину, белый заголовок+мета),
`minimal` (ink-заголовок + тонкая акцент-линия). Акцент берётся из `getTemplate(data.template).accent`.
Визуально проверены все 3 на workerd (qlmanage).

## Шаг 3 — ✅ ГОТОВО (A/B + окружение)
- Все 18 PDF-роутов прогнаны на workerd и визуально проверены (PNG, qlmanage): кириллица, ₽, вёрстка,
  цвета, badge'ы, QR — верно. Ключевые страницы 200, i18n-редиректы, canonical/sitemap/robots → iznkit.com.
- `.env.production.local` (gitignored) — `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADSENSE_ID`; localhost в бандл не течёт
  (SITE_URL и так с фолбэком на iznkit.com). `UNLOCK_SECRET` — НЕ в .env (рантайм-секрет через wrangler).
- `public/_headers` — immutable-кэш для `/_next/static/*`, `/fonts/*`, `*.svg` + security-заголовки на статику.
  Проверено на workerd: шрифт получает `max-age=31536000, immutable` + HSTS/nosniff; сам `_headers` не отдаётся.
- **HSTS не пропадает на CF** — `headers()` из next.config доходят до всех Worker-роутов (HTML-страниц). Опасение из
  прежней доки не подтвердилось.

## Шаг 4 — деплой воркера ✅ СДЕЛАНО (05.11), DNS — за владельцем
- `npm run cf:deploy` → **Success, «No deploy targets for iznkit»** = воркер создан БЕЗ домена/маршрута
  (`workers_dev:false`, custom domain не привязан). Version `5c7e53ca`. Трафик/прод на Vercel не затронуты.
- `UNLOCK_SECRET` установлен как Worker secret (`wrangler secret put`), копия в gitignored `.env.production.local`.
- **DNS-зону прочитать не удалось**: OAuth-токен wrangler имеет `zone (read)`, но не `dns_records:read` → 403.
  Зона `iznkit.com` на CF, статус active (id `c9e84cb0cce5335882bbe02c8979b2ec`). Список записей — в дашборде.

### DNS-переключение (cutover) — ✅ ВЫПОЛНЕНО 05.11.2026
Через Chrome (сессия владельца) в дашборде CF удалены ДВЕ Vercel-записи:
`iznkit.com` CNAME и `www.iznkit.com` CNAME (обе → `15ed08420f316545.vercel-dns-017.com`).
**Почта не тронута** — остались 3× MX (route1/2/3.mx.cloudflare.net), TXT DKIM (`cf2024-1._domainkey`),
TXT SPF (`v=spf1 include:_spf.mx.cloudflare.net ~all`). Затем `wrangler` привязал custom domains:
`routes: [{pattern:"iznkit.com",custom_domain:true},{pattern:"www.iznkit.com",custom_domain:true}]` →
**Deployed triggers: iznkit.com (custom domain), www.iznkit.com (custom domain)**. Version `97babcda`.
(API-путь к custom domain сначала падал с `code 100117 — hostname already has externally managed DNS records`:
токен wrangler имеет только `zone (read)`, удалить записи через API нельзя — поэтому удалял вручную в дашборде.)

**Проверка на проде (https://iznkit.com):** `server: cloudflare`, HTTP/2 200, HSTS; apex `/`→308→`/en`;
www 200. Живые PDF-роуты (schet-faktura, invoice band, nda) — HTTP 200, `%PDF`, рендер кириллицы верный
(qlmanage). Миграция работает end-to-end на Cloudflare.

## Шаг 5 — ✅ ЗАВЕРШЕНО (05.11.2026)
- **Always Use HTTPS** включён диспетчером (через API). Проверено: `http://iznkit.com/en` → 301, https → 200.
- **www → apex**: www отдавал дубль (200). Добавлен host-редирект в `next.config.ts` `redirects()` (выполняется
  в Worker через OpenNext, покрывает все пути — middleware `src/proxy.ts` их пропускает ради Edge Requests).
  Проверено: `www/ru/tools/invoice?x=1` → 308 → `iznkit.com/ru/tools/invoice?x=1` (путь+query целы). Коммит 3c054f0.
- **`vercel git disconnect`** — выполнен через дашборд Vercel (Chrome; CLI блокнул автомод): iznkit → Settings →
  Git → Remove Connection. Проект и последний деплой Vercel сохранены (откат через DNS возможен). Пуш в main
  больше не триггерит сборку Vercel.
- **cf-migration смёрджена в main** (fast-forward, запушено). Дальнейший деплой — локальный: `npm run cf:deploy`
  (сначала `NEXT_PUBLIC_SITE_URL=https://iznkit.com npm run cf:build`). Vercel-автодеплоя больше нет.
- privacy: строки про Vercel-хостинг нет (только донат-копи «домен, хостинг», без провайдера) — править нечего.

**Переезд iznkit.com на Cloudflare завершён.** Прод живой на CF, PDF-роуты рендерят кириллицу, www→apex,
HTTPS форсится, Vercel отключён.
