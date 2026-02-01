/*
  inventory.js
  ------------
  Inventory page UI logic (mock data only).
*/

(function () {
  const PF = (window.PF = window.PF || {});

  document.addEventListener('DOMContentLoaded', () => {
    PF.auth.requireAuth();

    const data = [
      { sku: 'PF-ALPHA-01', warehouse: 'Central', onHand: 420, reorder: 120 },
      { sku: 'PF-BETA-02', warehouse: 'Central', onHand: 85, reorder: 100 },
      { sku: 'PF-GAMMA-11', warehouse: 'East Hub', onHand: 230, reorder: 80 }
    ];

    const tbody = document.querySelector('#inventoryTable tbody');
    if (!tbody) return;

    tbody.innerHTML = data
      .map((i) => {
        const low = i.onHand <= i.reorder;
        const onHand = low
          ? `<span style="color:var(--pf-warning);font-weight:700;">${i.onHand}</span>`
          : String(i.onHand);
        return `
          <tr>
            <td>${i.sku}</td>
            <td>${i.warehouse}</td>
            <td>${onHand}</td>
            <td>${i.reorder}</td>
          </tr>
        `;
      })
      .join('');
  });
})();
