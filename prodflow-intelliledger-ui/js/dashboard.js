/*
  dashboard.js
  ------------
  Dashboard-only UI logic (mock data only).
*/

(function () {
  const PF = (window.PF = window.PF || {});

  document.addEventListener('DOMContentLoaded', () => {
    // Guard: ensure authenticated.
    if (document.getElementById('loginForm')) return;
    PF.auth.requireAuth();

    // Mock KPIs
    const kpiInventory = document.getElementById('kpiInventory');
    const kpiLedger = document.getElementById('kpiLedger');
    const kpiProducts = document.getElementById('kpiProducts');

    if (kpiInventory) kpiInventory.textContent = '1,284';
    if (kpiLedger) kpiLedger.textContent = '412';
    if (kpiProducts) kpiProducts.textContent = '86';

    // Mock recent ledger table
    const rows = [
      { date: '2026-02-01', ref: 'INV-10021', type: 'Sale', amount: 12450 },
      { date: '2026-01-30', ref: 'PO-00418', type: 'Purchase', amount: -3920 },
      { date: '2026-01-28', ref: 'ADJ-00077', type: 'Inventory Adj.', amount: -615 },
      { date: '2026-01-25', ref: 'INV-09988', type: 'Sale', amount: 8600 }
    ];

    const tbody = document.querySelector('#recentLedgerTable tbody');
    if (tbody) {
      tbody.innerHTML = rows
        .map((r) => {
          const sign = r.amount < 0 ? '-' : '';
          const amt = PF.format.currency(Math.abs(r.amount));
          return `
            <tr>
              <td>${r.date}</td>
              <td>${r.ref}</td>
              <td>${r.type}</td>
              <td>${sign}${amt}</td>
            </tr>
          `;
        })
        .join('');
    }
  });
})();
