/*
  users.js
  --------
  Admin/distributor-only: create sub-distributor UI (mock data only).

  Notes:
  - Access control is simulated (see navigation.js + auth.js).
  - "Create" does not call a backend; it only updates the table in-memory.
*/

(function () {
  const PF = (window.PF = window.PF || {});

  document.addEventListener('DOMContentLoaded', () => {
    const ok = PF.auth.requireRole(['admin', 'distributor']);
    if (!ok) return;

    const seed = [
      { name: 'Rita Sharma', email: 'rita@dist.example', role: 'sub_distributor', status: 'Active' },
      { name: 'Omar Saeed', email: 'omar@dist.example', role: 'sub_distributor', status: 'Pending' }
    ];

    const tbody = document.querySelector('#usersTable tbody');
    const form = document.getElementById('createUserForm');

    const state = {
      users: [...seed]
    };

    const render = () => {
      if (!tbody) return;
      tbody.innerHTML = state.users
        .map((u) => {
          return `
            <tr>
              <td>${u.name}</td>
              <td>${u.email}</td>
              <td><span class="pf-badge">${u.role.replace('_', ' ')}</span></td>
              <td>${u.status}</td>
            </tr>
          `;
        })
        .join('');
    };

    render();

    form?.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('newName');
      const emailEl = document.getElementById('newEmail');
      const regionEl = document.getElementById('newRegion');

      const name = (nameEl.value || '').trim();
      const email = (emailEl.value || '').trim();
      const region = (regionEl.value || '').trim();

      if (!name || !email) {
        alert('UI prototype: please provide name and email.');
        return;
      }

      state.users.unshift({
        name,
        email,
        role: 'sub_distributor',
        status: region ? `Active (${region})` : 'Active'
      });

      nameEl.value = '';
      emailEl.value = '';
      regionEl.value = '';

      render();
    });
  });
})();
