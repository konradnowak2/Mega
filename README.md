# kb — the support knowledge base

## Review of #4471

- [Signed review source](src/routes/kb/incidents/4471-review/+page.svx)
- [Rendered review](rendered/kb/incidents/4471-review/index.html)
- [Proposed replacement decision](src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx)
- [Issue drafts and report IDs](issues/)

Run `npm ci`, `node generate-issues.mjs`, then `npm run build`. Serve `rendered/` at the root of a local HTTP server (for example `python3 -m http.server 4173 --directory rendered`) and open `/kb/incidents/4471-review/`. The HTML includes server-rendered tables, styles, a derived desk reference and a hydrated dedupe explorer. No external service is needed to view it.

Source snapshot: 2026-10-04. Review: 2026-10-28. Computed split: 379 parser reports and 33 form-hint reports, from 412 unique report IDs (427 export rows). Rebuild and recheck when desk data changes.

Engineering update: #4471 closed 2026-10-05. Parser fixed (`fix(dates): parse dd/mm for eu locales`); hint won't fix because booking-v3 was retired. [Parser issue #2](https://github.com/konradnowak2/Mega/issues/2) is completed; [hint issue #1](https://github.com/konradnowak2/Mega/issues/1) is not planned. See the review for the source and uncertainty boundaries.

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.
