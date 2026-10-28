import fs from 'node:fs/promises';
import { groupByCause, uniqueById } from './src/lib/kb/causes.ts';

const root = new URL('./src/lib/data/', import.meta.url);
const reports = JSON.parse(await fs.readFile(new URL('reports-4471.json', root)));
const tenants = await Promise.all((await fs.readdir(new URL('tenants/', root))).map(async name => JSON.parse(await fs.readFile(new URL(`tenants/${name}`, root)))));
const tenantMap = new Map(tenants.map(t => [t.handle, t]));
const groups = groupByCause(uniqueById(reports).filter(r => r.mergedInto === 4471), r => tenantMap.get(r.tenant));
const descriptions = {
  parser: {
    title: 'Shared parser reads day-first tenant dates month-first',
    problem: 'The shared parser treats day-first input as MM/DD, swapping day and month in bookings and calendar invites. For example, R-41203 (lantern.row, cs-CZ, app) booked 2 December but received 12 February.',
    path: 'Day-first tenants on app/email paths, booking-v2 forms, and non-form paths for booking-v3 tenants. Do not select by browser locale or intakeTag.',
    fix: 'Interpret dates according to the tenant locale or pass normalized, unambiguous date fields into the parser. Verify booking and invite dates end to end across app/email and applicable forms; include ambiguous dates such as 03/04 and day values above 12.',
    caveat: 'Five reports (R-41202, R-41209, R-41236, R-41344, R-41620) describe one-day or timing anomalies. The current desk classifier includes them in this count by tenant/channel, but that is not proof of their root cause. Investigate timestamps and timezones before claiming they are fixed; do not invent a confirmed third defect from these symptoms alone.',
  },
  hint: {
    title: 'booking-v3 date hint contradicts day-first tenant parsing',
    problem: 'The booking-v3 form prints MM/DD/YYYY while the form interprets dates using the day-first tenant convention. Users following the hint therefore create swapped dates. R-41230 (copper.studio, es-ES, form) is included even though intake tagged it parser.',
    path: 'Form-channel reports from alder.physio (de-DE), copper.studio (es-ES), and pale.harbour (pt-PT), all on booking-v3. App/email reports from the same tenants belong to the separate shared-parser problem.',
    fix: 'Make the displayed date hint and actual form parsing agree with the tenant locale. Test all three booking-v3 tenants with ambiguous and unambiguous dates and check resulting booking and invite dates. A shared-parser fix alone does not remove this misleading hint.',
    caveat: 'This is a distinct defect merged into #4471 without its own desk ticket. Similar subject lines and browser-derived intake tags are not sufficient grounds to merge it back into the parser issue.',
  },
};
await fs.mkdir(new URL('./issues/', import.meta.url), { recursive: true });
for (const g of groups) {
  const d = descriptions[g.cause];
  const body = `# ${d.title}\n\n## Reports covered\n\n**${g.reports.length} unique reports** from support ticket #4471 in the 2026-10-04 export; ${g.tenants} tenants. First received ${g.firstSeen}; last received ${g.lastSeen}.\n\n## Problem\n\n${d.problem}\n\n## Affected path\n\n${d.path}\n\n## Fix and acceptance check\n\n${d.fix}\n\n## Evidence and uncertainty\n\n${d.caveat}\n\nCounts execute src/lib/kb/causes.ts against unique report IDs joined to src/lib/data/tenants/*.json. Intake tags in this group: ${JSON.stringify(g.taggedAs)}. The full export has 427 rows but 412 unique IDs; parser and hint counts are disjoint and reconcile to 412.\n\nSee [signed review](../src/routes/kb/incidents/4471-review/+page.svx) and [rendered review](../rendered/kb/incidents/4471-review/index.html). The July 2 merge batch reflects backlog processing; receipt history begins in April.\n\n## Report IDs\n\n${g.reports.map(r => r.id).join(', ')}\n`;
  await fs.writeFile(new URL(`./issues/${g.cause}.md`, import.meta.url), body);
  console.log(`${g.cause}: ${g.reports.length}`);
}
