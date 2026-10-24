# Cursor: добавить 5 dev-инструментов (v2) в iznkit

Добавь в проект iznkit (Next.js 16 App Router, React 19, Tailwind 4, TypeScript,
двуязычный EN+RU) пять новых **клиентских** инструментов по существующему паттерну.
Все пять — чистый client-side (никаких `/api`-роутов, никакого серверного рендера).

## ОБЯЗАТЕЛЬНО перед кодом
1. Это НЕ тот Next.js, что ты знаешь. Если правишь роутинг/метаданные/конфиг —
   сверься с `node_modules/next/dist/docs/` (см. AGENTS.md). Для добавления инструментов
   по готовому паттерну это обычно не нужно, но не изобретай API.
2. Изучи эталоны и копируй их структуру 1:1:
   - Клиентский компонент: `src/components/tools/case-tool.tsx` (простой),
     `src/components/tools/color-tool.tsx` (цветовая математика + свотчи + копирование).
   - Страница: `src/app/[locale]/tools/case-converter/page.tsx`.
   - OG-картинка: `src/app/[locale]/tools/case-converter/opengraph-image.tsx`.
   - Реестр: `src/lib/tools/registry.ts` (секции `id: "developer"` и `id: "creative-assets"`).
   - Словари: `src/lib/i18n/dictionaries.ts` (ДВА зеркальных объекта `en` и `ru`;
     тип `Dictionary = typeof en` — у RU должны быть РОВНО те же ключи, что у EN).
   - SEO: `src/lib/seo/tool-content.ts` (константа `Content` + регистрация слуга в карте `content`).

## Что создать для КАЖДОГО инструмента (6 правок, роута НЕТ)
1. `src/components/tools/<slug>-tool.tsx` — `"use client"` компонент с логикой.
   - Стиль: Tailwind + CSS-переменные (`var(--border)`, `var(--accent)`, `var(--muted)`,
     `var(--background)`, `var(--card)`), как в эталонах. Кнопки копирования — класс как в
     соседних инструментах.
   - Аналитика: при копировании/действии вызывай
     `track("tool_use", { tool: "<slug>", action: "copy" | "calculate" | "convert" })`
     из `@/lib/analytics`.
   - Принимает `{ locale }` и берёт строки из `getDictionary(locale).<dictKey>`.
2. `src/app/[locale]/tools/<slug>/page.tsx` — копия `case-converter/page.tsx`, заменить
   SLUG, импорт компонента, `dict.<dictKey>`.
3. `src/app/[locale]/tools/<slug>/opengraph-image.tsx` — копия эталона, заменить slug/alt/dictKey.
   Оставить `export const dynamic = "force-static"` и `generateStaticParams` на en+ru.
4. Реестр `registry.ts`: добавить запись в нужную секцию:
   `{ slug, status: "live", priceCents: 0, affiliate: "<cluster>", title: {en,ru}, blurb: {en,ru} }`.
5. Словари `dictionaries.ts`: добавить блок `<dictKey>: { title, subtitle, free, ... }` в объект `en`
   И зеркально в объект `ru` (те же ключи). `free` = EN "Free · no sign-up" / RU "Бесплатно · без регистрации".
6. SEO `tool-content.ts`: добавить `const <name>Content: Content = { en: {...}, ru: {...} }`
   (intro, benefits[], steps[], faq[{q,a}], useCases[], metaExtra) и строку `"<slug>": <name>Content,`
   в карту `content`.

НЕ добавлять слуги в `src/lib/tools/local.ts` (SERVER_TOOLS) — эти инструменты клиентские,
значит `isLocalTool` вернёт true автоматически, и trust-строка «данные не покидают браузер»
покажется корректно.

## Инструменты

### 1. chmod-калькулятор
- slug `chmod-calculator`, секция `developer`, affiliate `developer-tools`.
- title EN «chmod calculator» / RU «Калькулятор chmod (права доступа)».
- Чекбоксы: владелец/группа/остальные × чтение/запись/выполнение → вывод **восьмеричный**
  (напр. `755`) и **символьный** (`rwxr-xr-x`). Двунаправленно: ввод числа 0–777 обновляет
  чекбоксы. Доп.: спецбиты setuid/setgid/sticky (4-я цифра) — опционально, переключателем.
  Показывать готовую команду `chmod 755 file`. Копирование числа/символа/команды.
- Без зависимостей (чистая битовая математика).

### 2. XML formatter / minify
- slug `xml-formatter`, секция `developer`, affiliate `developer-tools`.
- title EN «XML formatter» / RU «Форматтер XML».
- Вход XML → режим **beautify** (отступы) или **minify** (убрать пробелы между тегами).
  Валидация через `DOMParser` (`application/xml`) — показывать ошибку парсинга человекочитаемо.
  Предпочти без зависимостей (рекурсивная сериализация DOM с отступами); если нужна библиотека —
  `xml-formatter` (npm, работает в браузере). Настройка размера отступа (2/4/tab). Копирование.

### 3. Minify + beautify (HTML/CSS/JS)
- slug `minify-beautify`, секция `developer`, affiliate `developer-tools`.
- title EN «Minify & beautify (HTML/CSS/JS)» / RU «Минификация и форматирование (HTML/CSS/JS)».
- Селектор языка (HTML/CSS/JS) + режим (beautify/minify). Beautify — библиотека `js-beautify`
  (экспорты `js_beautify`, `css_beautify`, `html_beautify`, работает в браузере).
  Minify: CSS/HTML — консервативно (убрать комментарии и лишние пробелы); JS — через `terser`
  (браузерная сборка). ⚠️ Это самый тяжёлый инструмент: JS-парсеры большие — грузи библиотеку
  **динамически** (`await import(...)`) по действию, а не на старте страницы, чтобы не раздувать бандл.
  Копирование результата + показ размера до/после и −%.

### 4. cron-builder
- slug `cron-builder`, секция `developer`, affiliate `developer-tools`.
- title EN «Cron expression builder» / RU «Конструктор cron-выражений».
- Пресеты (каждую минуту / каждый час / ежедневно в HH:MM / еженедельно по дню / ежемесячно
  числа N / свой вариант по 5 полям) → собирает cron-строку (минута час день месяц день-недели)
  + человекочитаемое описание + ближайшие запуски. Обратный к существующему `cron-parser` —
  переиспользуй его логику описания/следующих запусков (смотри `src/components/tools/*cron*`
  и/или `src/lib/.../cron*`), не дублируй парсер. Копирование строки.

### 5. Палитра / оттенки цвета
- slug `color-palette`, секция `creative-assets`, affiliate `creative-assets`.
- title EN «Color palette & shades generator» / RU «Палитра и оттенки цвета».
- Базовый цвет (hex/rgb/hsl) → генерировать **tints** (светлее) и **shades** (темнее) ступенями,
  плюс гармонии: комплементарная, аналоговые, триада. Чистая HSL-математика (можно переиспользовать
  конверсии из `color-tool.tsx`), без зависимостей. Каждый свотч показывает hex и копируется по клику.
  Это расширение темы существующего `color` — отдельная страница под запросы «color palette
  generator», «color shades», «tints and shades».

## i18n и контент
- Все строки — через словари, EN и RU (RU — полноценный перевод, не калька). Для RU-инструментов
  (chmod/xml/cron — международные) держи нейтральный технический русский.
- SEO `tool-content.ts`: intro 2–4 предложения с ключевыми фразами, 4–6 benefits, 3–4 steps,
  4–5 FAQ, 3–4 useCases, metaExtra ≤160 симв. По образцу соседних dev-инструментов.

## Проверка (обязательно перед завершением)
1. `npx next build` проходит без ошибок типов (следи за зеркальностью EN/RU в словарях —
   это частая причина падения сборки).
2. Каждая страница открывается: `/en/tools/<slug>` и `/ru/tools/<slug>` — заголовок, инструмент,
   SEO-блок, без ошибок в консоли.
3. Спот-чек логики: chmod 755↔rwxr-xr-x; XML beautify/minify валидного и невалидного ввода;
   beautify/minify по каждому языку; cron-пресеты дают корректную строку и описание; палитра
   генерирует оттенки и копирует hex.
4. Стиль кода и вёрстки — как в соседних инструментах (отступы, классы, именование).

## Ограничения
- Только client-side, без `/api`, без новых серверных зависимостей.
- Новые npm-зависимости — минимум и только клиент-безопасные (`js-beautify`, при необходимости
  `terser`/`xml-formatter`); тяжёлые парсеры подключать динамическим импортом.
- Не трогать `local.ts` (SERVER_TOOLS), не трогать существующие инструменты, кроме переиспользования
  логики cron и цветовых конверсий.
- Один коммит на инструмент или один общий — на усмотрение; сборка должна быть зелёной.
