/*
  products.js
  -----------
  Products page UI logic (mock data only).
*/

(function () {
  const PF = (window.PF = window.PF || {});

  document.addEventListener('DOMContentLoaded', () => {
    PF.auth.requireAuth();

    const data = [
      { sku: 'PF-ALPHA-01', name: 'Alpha Widget', status: 'Active', updated: '2026-01-28' },
      { sku: 'PF-BETA-02', name: 'Beta Component', status: 'Active', updated: '2026-01-21' },
      { sku: 'PF-GAMMA-11', name: 'Gamma Assembly', status: 'Paused', updated: '2025-12-18' }
    ];

    const tbody = document.querySelector('#productsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = data
      .map((p) => {
        const badge = `<span class="pf-badge">${p.status}</span>`;
        return `
          <tr>
            <td>${p.sku}</td>
            <td>${p.name}</td>
            <td>${badge}</td>
            <td>${p.updated}</td>
          </tr>
        `;
      })
      .join('');
  });
})();
