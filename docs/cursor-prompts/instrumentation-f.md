# Cursor: дособрать инструментацию §F в iznkit

Проект iznkit (Next.js 16 App Router, React 19, TypeScript, двуязычный EN+RU).
Задача — довесить аналитические события на оставшиеся калькуляторы и две точки навигации
по УЖЕ существующему паттерну. Чистая однотипная правка, новых файлов почти нет.

## Контекст и образец (копируй 1:1)
- Хук: `src/lib/tools/use-tool-used.ts` — `useToolUsed(slug)` возвращает `markUsed`,
  который один раз за монтирование шлёт `track("tool_use", { tool: slug, action: "calculate" })`.
- Эталон применения: `src/components/tools/loan-tool.tsx`
  - строка ~14: `const markUsed = useToolUsed("loan-calculator");`
  - строка ~45: корневой контейнер калькулятора: `<div onInput={markUsed} className="...">`.
- Уже инструментированы (НЕ трогать, это образцы): loan, tip, pct, regex, marketplace-taxes, webp-converter.
- Трек-ссылки: `src/components/tracked-link.tsx` — `TrackedLink` с пропом `external`
  (внешний `<a target="_blank" rel="noopener">`), `nofollow` (добавляет `rel="nofollow noopener"`),
  `event` и `params`. Аналитика — `track()` из `@/lib/analytics`.

## Часть 1 — `tool_use:calculate` на остальных калькуляторах
Добавь хук в каждый из этих компонентов по образцу loan-tool (импорт хука, `const markUsed =
useToolUsed("<registry-slug>")`, и `onInput={markUsed}` на корневом контейнере формы/инпутов):

| компонент | что подставить в useToolUsed |
|---|---|
| `src/components/tools/margin-tool.tsx` | slug этого инструмента |
| `src/components/tools/vat-tool.tsx` | slug |
| `src/components/tools/discount-tool.tsx` | slug |
| `src/components/tools/compound-tool.tsx` | slug |
| `src/components/tools/breakeven-tool.tsx` | slug |
| `src/components/tools/datediff-tool.tsx` | slug |
| `src/components/tools/age-tool.tsx` | slug |
| `src/components/tools/aspectratio-tool.tsx` | slug |
| `src/components/tools/marketplace-payout-tool.tsx` | slug |
| `src/components/tools/marketplace-price-tool.tsx` | slug |

**Важно:** аргумент `useToolUsed(...)` — это РЕГИСТРОВЫЙ slug инструмента, а не имя компонента.
Узнай его в соответствующей странице `src/app/[locale]/tools/<slug>/page.tsx` (константа `SLUG`)
или в `src/lib/tools/registry.ts`. Повесь `onInput={markUsed}` на тот контейнер, что охватывает
все поля ввода (как в loan-tool). Если у инструмента несколько блоков инпутов — вешай на общий
родитель. Ничего в логике расчёта не меняй.

## Часть 2 — outbound_click на странице /projects
Файл `src/app/[locale]/tools/.../`? Нет — страница проектов: `src/app/[locale]/projects/page.tsx`.
Сейчас ссылки на сайты сети — обычные `<a href={p.url} target="_blank" rel="nofollow noopener">`.
Замени их на `TrackedLink` c `external nofollow event="outbound_click"
params={{ to: p.name, where: "projects" }}`, сохранив визуальные классы и `rel="nofollow noopener"`
(у TrackedLink это даёт проп `nofollow`). НЕ делай ссылки do-follow — политика сети: сквозные
списки сети = nofollow (см. футер как образец: `src/components/site-footer.tsx`).

## Часть 3 — cta_click на кнопке гайд→инструмент
В `src/components/guide-article.tsx` есть inline-CTA (кнопка `body.cta →` ведёт на `toolHref`).
Сейчас это обычный `next/link`. Нужно, чтобы клик слал `track("cta_click", { from: <guide slug>,
to: <tool slug>, placement: "guide" })`. Вариант: обернуть в `TrackedLink` (внутренний, без external)
с нужными params, либо навесить `onClick` с `track(...)`. Нужные slugs прокинь пропами в
`GuideArticle` из вызывающей страницы `src/app/[locale]/guides/[slug]/page.tsx`, если их там ещё нет.
Не ломай существующую вёрстку кнопки.

## Критерии готовности и проверка
1. `npx next build` проходит без ошибок типов.
2. Все 10 калькуляторов из таблицы получили `useToolUsed` + `onInput={markUsed}` на корне;
   образцы (loan/tip/pct/regex/marketplace-taxes/webp) не тронуты.
3. /projects: внешние ссылки идут через TrackedLink, событие `outbound_click`, `rel` остался
   `nofollow noopener`.
4. Гайд: CTA-кнопка шлёт `cta_click` с from/to; визуально не изменилась.
5. Спот-чек в деве: открыть пару калькуляторов, ввести значение — в консоли/в gtag debug
   видно одно событие `tool_use action=calculate` на инструмент (не на каждый ввод).
   (События летят только в прод-режиме с согласием — достаточно проверить, что `markUsed`
   реально вызывается, напр. временным `console.log`, затем убрать.)

## Ограничения
- Только навешивание событий. Никакой новой бизнес-логики, никаких новых зависимостей.
- Не менять существующие инструментированные компоненты и не трогать серверные роуты.
- Сохранять код-стиль соседних компонентов.
