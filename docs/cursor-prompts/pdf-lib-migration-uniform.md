# Cursor: переписать 13 PDF-документов с @react-pdf на pdf-lib (ветка cf-migration)

**ВАЖНО: работай в ветке `cf-migration`, НЕ в `main`.** (`git checkout cf-migration`.)
Это часть переезда iznkit на Cloudflare Workers: `@react-pdf/renderer` не работает на Workers
(yoga-layout инстанцирует WASM в рантайме — запрещено), поэтому все PDF-роуты переписываются на
**pdf-lib** (pure-JS, работает и на Node, и на Workers). Фундамент и 2 образца уже готовы — ты
тиражируешь по ним ещё 13 однотипных документов.

## Цель
Для каждого из 13 документов ниже: переписать его @react-pdf-рендер на pdf-lib-билдер через готовый
тулкит `Doc`, и переключить его API-роут на новый билдер. Содержимое (поля, подписи, таблицы, тексты)
сохранить как есть — ничего не выдумывать, брать из существующего @react-pdf-документа и модели.

## Образцы — изучи и копируй ПОДХОД (пути)
- Тулкит: `src/lib/pdf2/layout.ts` — класс `Doc` (создание, `text` с переносом, `field` (label/value),
  `table` (колонки долями ширины, перенос в ячейках, авторазрыв страниц), `hr`, `drawPng` (картинки/QR),
  `footer`), константы цветов (`INK/MUTED/LINE/LINE_SOFT/HEAD_BG`), `money()`.
- Встраивание шрифтов: `src/lib/pdf2/fonts.ts` — `embedDocFonts` (кириллица, subset) уже внутри `Doc.create()`.
- Образец с таблицей/итогами/картинкой/watermark: `src/lib/pdf2/invoice.ts` + роут `src/app/api/pdf/invoice/route.tsx`.
- Образец с двусторонней таблицей/подписями/интро: `src/lib/pdf2/akt-sverki.ts` + роут `src/app/api/pdf/akt-sverki/route.tsx`.

Из образцов видно оба изменения: (1) новый билдер `src/lib/pdf2/<name>.ts`, экспортирующий
`async function build<Name>Pdf(data, labels?, brand, opts?) : Promise<Uint8Array>`; (2) роут
`src/app/api/pdf/<name>/route.tsx` перестаёт импортировать `@react-pdf/renderer`/`ensureFonts`/
`<...Document>` и вместо `renderToBuffer(...)` зовёт новый билдер; ответ — `new Response(new Uint8Array(bytes), {...})`.

## 13 документов (route → @react-pdf-документ для справки по содержимому)
Для каждого смотри текущий `src/lib/pdf/<doc>` чтобы точно повторить поля/подписи/таблицы, и роут
`src/app/api/pdf/<route>/route.tsx` чтобы понять, какие labels/data он собирает:

| route | @react-pdf документ | заметка |
|---|---|---|
| `adroi` | `src/lib/pdf/adroi-document.tsx` | отчёт ad-ROI (поля + числа) |
| `cert` | `src/lib/pdf/cert-document.tsx` | подарочный сертификат |
| `delivery` | `src/lib/pdf/delivery-document.tsx` | расходная/товарная записка |
| `hourly` | `src/lib/pdf/hourly-document.tsx` | отчёт по часовой ставке |
| `inspection` | `src/lib/pdf/inspection-document.tsx` | акт осмотра |
| `nda` | `src/lib/pdf/nda-document.tsx` | NDA — текст-тяжёлый (длинные абзацы + блоки подписей); используй `d.text` с переносом |
| `po` | `src/lib/pdf/po-document.tsx` | заказ поставщику (таблица позиций) |
| `quote` | `src/lib/pdf/quote-document.tsx` | смета / КП (таблица) |
| `receipt` | `src/lib/pdf/receipt-document.tsx` | чек |
| `rental` | `src/lib/pdf/rental-document.tsx` | отчёт доходности аренды |
| `tax` | `src/lib/pdf/tax-document.tsx` | оценка налога фрилансера |
| `timesheet` | `src/lib/pdf/timesheet-document.tsx` | табель учёта часов (таблица) |
| `unit` | `src/lib/pdf/unit-document.tsx` | отчёт юнит-экономики |

## НЕ трогать
- `main`, `src/lib/pdf2/{layout,fonts,invoice,akt-sverki}.ts` и роуты invoice/akt-sverki (готовы).
- Три легальные grid-формы: `schet-faktura`, `upd`, `torg12` — их делает владелец сам, НЕ переписывай.
- Модели (`src/lib/tools/*`), словари, SEO — брать из них данные/labels, но не менять.
- Старые `src/lib/pdf/*-document.tsx` можно оставить на месте (просто роут на них больше не ссылается);
  удалять не обязательно.

## Правила
- Только pdf-lib через тулкит `Doc`. Никаких новых зависимостей. Код-стиль как в образцах.
- Содержимое 1:1 с текущим документом: те же заголовки, поля, подписи, тексты оговорок, колонки таблиц.
  Pixel-perfect не требуется, но ВСЕ данные и подписи должны присутствовать и быть читаемы, кириллица — целой.
- Если у документа есть watermark/preview-логика (как invoice) — сохрани её (см. образец invoice: `opts.watermark`).
- Деньги форматируй через `money()` из тулкита.

## Как проверить (ОБЯЗАТЕЛЬНО, обе среды)
1. Node-типы/сборка: `npx next build` — EXIT 0 (следи за типами: `new Response(new Uint8Array(bytes))`).
2. CF-рантайм (главное): собрать и поднять воркер, дёрнуть КАЖДЫЙ переписанный роут:
   ```bash
   source ~/.nvm/nvm.sh && nvm use 22
   NEXT_PUBLIC_SITE_URL=https://iznkit.com npm run cf:build
   npx wrangler dev --port 8788   # в отдельном терминале
   # для каждого <route> POST с тестовым JSON (структуру data возьми из модели/роута):
   curl -s -X POST http://127.0.0.1:8788/api/pdf/<route> -H "Content-Type: application/json" \
     --data '{"locale":"ru","data":{...}}' -o /tmp/<route>.pdf -w "%{http_code} %{size_download}\n"
   # ждём: HTTP 200, файл начинается с %PDF, в pdftotext видно кириллицу и ключевые поля.
   ```
   Критично: НЕ должно быть `WebAssembly.instantiate disallowed` или 500 — это значит, что где-то остался @react-pdf.
3. Убедись, что ни в одном переписанном роуте не осталось импорта `@react-pdf/renderer`:
   `grep -rl '@react-pdf' src/app/api/pdf/<route>` — пусто.

## Критерий «готово»
Все 13 роутов отдают валидный PDF (HTTP 200, `%PDF`) на локальном workerd, `npx next build` зелёный,
в этих 13 роутах нет импорта @react-pdf. Коммить в ветку `cf-migration` (не в main).
