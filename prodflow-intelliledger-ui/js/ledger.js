/*
  ledger.js
  ---------
  Ledger page UI logic (mock data only).
*/

(function () {
  const PF = (window.PF = window.PF || {});

  document.addEventListener('DOMContentLoaded', () => {
    PF.auth.requireAuth();

    const data = [
      { date: '2026-02-01', ref: 'INV-10021', account: 'Sales', debit: 0, credit: 12450 },
      { date: '2026-01-30', ref: 'PO-00418', account: 'COGS', debit: 3920, credit: 0 },
      { date: '2026-01-28', ref: 'ADJ-00077', account: 'Inventory Shrinkage', debit: 615, credit: 0 },
      { date: '2026-01-25', ref: 'INV-09988', account: 'Sales', debit: 0, credit: 8600 }
    ];

    const tbody = document.querySelector('#ledgerTable tbody');
    if (!tbody) return;

    tbody.innerHTML = data
      .map((r) => {
        const d = r.debit ? PF.format.currency(r.debit) : '—';
        const c = r.credit ? PF.format.currency(r.credit) : '—';
        return `
          <tr>
            <td>${r.date}</td>
            <td>${r.ref}</td>
            <td>${r.account}</td>
            <td>${d}</td>
            <td>${c}</td>
          </tr>
        `;
      })
      .join('');
  });
})();
