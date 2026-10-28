# booking-v3 date hint contradicts day-first tenant parsing

## Reports covered

**33 unique reports** from support ticket #4471 in the 2026-10-04 export; 3 tenants. First received 2026-04-17; last received 2026-09-22.

## Problem

The booking-v3 form prints MM/DD/YYYY while the form interprets dates using the day-first tenant convention. Users following the hint therefore create swapped dates. R-41230 (copper.studio, es-ES, form) is included even though intake tagged it parser.

## Affected path

Form-channel reports from alder.physio (de-DE), copper.studio (es-ES), and pale.harbour (pt-PT), all on booking-v3. App/email reports from the same tenants belong to the separate shared-parser problem.

## Fix and acceptance check

Make the displayed date hint and actual form parsing agree with the tenant locale. Test all three booking-v3 tenants with ambiguous and unambiguous dates and check resulting booking and invite dates. A shared-parser fix alone does not remove this misleading hint.

## Evidence and uncertainty

This is a distinct defect merged into #4471 without its own desk ticket. Similar subject lines and browser-derived intake tags are not sufficient grounds to merge it back into the parser issue.

Counts execute src/lib/kb/causes.ts against unique report IDs joined to src/lib/data/tenants/*.json. Intake tags in this group: {"parser":15,"hint":18}. The full export has 427 rows but 412 unique IDs; parser and hint counts are disjoint and reconcile to 412.

See [signed review](../src/routes/kb/incidents/4471-review/+page.svx) and [rendered review](../rendered/kb/incidents/4471-review/index.html). The July 2 merge batch reflects backlog processing; receipt history begins in April.

## Report IDs

R-41230, R-41241, R-41251, R-41259, R-41262, R-41275, R-41294, R-41305, R-41308, R-41366, R-41372, R-41384, R-41387, R-41396, R-41400, R-41406, R-41415, R-41416, R-41418, R-41428, R-41439, R-41441, R-41449, R-41453, R-41456, R-41460, R-41472, R-41485, R-41493, R-41539, R-41572, R-41582, R-41584
