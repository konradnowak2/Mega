<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const unique = uniqueById(reports as Report[]);
  const merged = unique.filter(r => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const anomalies = merged.filter(r => notes.oneDayMove.includes(r.id));
  const months = Object.entries(Object.groupBy(merged, r => r.receivedAt.slice(0, 7)));
  const mergeDays = Object.entries(Object.groupBy(merged, r => r.mergedAt?.slice(0, 10) ?? 'unknown'));
  const peak = mergeDays.sort((a, b) => b[1]!.length - a[1]!.length)[0];
  const disagreements = groups.reduce((n, g) => n + g.reports.filter(r => r.meta.intakeTag !== g.cause).length, 0);
</script>

<h2>Reconciled counts</h2>
<p>{reports.length} export rows contain {unique.length} unique report IDs; {reports.length - unique.length} overlapping rows are not additional reports. All {merged.length} unique reports belong to #4471 in this snapshot.</p>
<table>
  <thead><tr><th>Problem</th><th>Reports</th><th>Tenants</th><th>First received</th><th>Last received</th><th>GitHub issue</th></tr></thead>
  <tbody>
    {#each groups as g}
      <tr><td>{g.cause}</td><td>{g.reports.length}</td><td>{g.tenants}</td><td>{g.firstSeen}</td><td>{g.lastSeen}</td><td><a href={g.cause === 'parser' ? 'https://github.com/konradnowak2/Mega/issues?q=is%3Aissue+%22shared+parser%22' : 'https://github.com/konradnowak2/Mega/issues?q=is%3Aissue+%22booking-v3%22'}>Find issue</a></td></tr>
    {/each}
  </tbody>
</table>
<p>{disagreements} intake tags disagree with the tenant-and-channel classification. Use tenant locale and form version, not browser locale, intake tag, subject wording or export-row count.</p>

<h2>Received is not merged</h2>
<p>The largest merge batch was {peak[0]}: {peak[1]!.length} reports. Reports had already arrived in April; this batch is backlog processing, not evidence that the defect started in July.</p>
<table><thead><tr><th>Month received</th><th>Unique reports</th></tr></thead><tbody>
  {#each months as [month, rs]}<tr><td>{month}</td><td>{rs!.length}</td></tr>{/each}
</tbody></table>

<h2>Unresolved symptoms retained within the desk's count</h2>
<p>{anomalies.length} reports describe one-day or timing anomalies. The current classifier places them under parser by tenant and channel; that is a filing rule, not proof of a timezone or parser root cause. Keep them visible and investigate before reclassifying or declaring the fix complete.</p>
<table><thead><tr><th>Report</th><th>Tenant</th><th>Report text</th></tr></thead><tbody>
  {#each anomalies as r}<tr><td>{r.id}</td><td>{r.tenant}</td><td>{r.body}</td></tr>{/each}
</tbody></table>
