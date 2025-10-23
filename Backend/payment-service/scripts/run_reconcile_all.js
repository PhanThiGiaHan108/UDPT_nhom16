// run_reconcile_all.js
// Repeatedly POST to /api/payment/debug/reconcile-enrolls until no new enrollments are created
// Usage: node run_reconcile_all.js [host]

const host = process.argv[2] || 'http://localhost:5004';
const limit = 100;

async function runOnce() {
  const url = `${host}/api/payment/debug/reconcile-enrolls?limit=${limit}`;
  console.log(`Calling ${url}`);
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' } });
    const data = await res.json();
    console.log('Result summary:', JSON.stringify(data.summary || data, null, 2));
    return data.summary || data;
  } catch (err) {
    console.error('Error calling reconcile endpoint:', err);
    return null;
  }
}

(async () => {
  console.log('Starting reconcile loop...');
  let totalCreated = 0;
  while (true) {
    const summary = await runOnce();
    if (!summary) break;
    const created = summary.created || 0;
    totalCreated += created;
    if (created === 0) {
      console.log('No more enrollments created in last run. Stopping.');
      break;
    }
    console.log(`Created ${created} enrollments in this run. Looping again...`);
    // small delay between runs
    await new Promise((r) => setTimeout(r, 800));
  }
  console.log('Done. Total enrollments created:', totalCreated);
})();
