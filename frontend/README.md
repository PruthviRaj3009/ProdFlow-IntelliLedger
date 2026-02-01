# ProdFlow-IntelliLedger UI (Static Prototype)

This is a **frontend-only, UI prototype** for an enterprise/ERP-style web application called **ProdFlow-IntelliLedger**.

- **No backend**
- **No APIs**
- **No frameworks**
- **No authentication logic**

The project is intentionally structured to be **scalable** and **backend-ready** (e.g., Spring Boot later), while remaining fully static today.

## How to run

Open `frontend/index.html` in a browser.

For best results with relative paths, you can also serve it locally with any static server (optional). Example:

- VS Code: “Live Server” extension
- Python: `python -m http.server`

## Simulated roles & access rules (UI-only)

This prototype simulates login state using `localStorage`:

- `pf.session` is stored in the browser
- Role selection happens on the login page via “Simulated role”

**Roles:**
- `admin`
- `distributor`
- `sub_distributor`

**Rules implemented (UI-only):**
- No public sign-up
- Login page displays: “Accounts are created by authorized distributors only.”
- `pages/users.html` is restricted to **Admin / Distributor** only
  - The sidebar “Users” menu item is hidden for `sub_distributor`
  - Direct navigation to `users.html` shows an “Access denied” message and hides the page’s cards

## Folder structure

```
frontend/
  index.html

  pages/
    dashboard.html
    products.html
    inventory.html
    ledger.html
    users.html
    change-password.html

  assets/
    images/
    fonts/

  css/
    base.css
    layout.css
    components.css
    login.css
    dashboard.css
    theme.css

  js/
    auth.js
    navigation.js
    dashboard.js
    products.js
    inventory.js
    ledger.js
    users.js
    utils.js
```

## Design approach

- **Enterprise/ERP look**: clean, minimal, consistent spacing
- **Split layout** for login (`index.html`)
- **Sidebar layout** for internal pages (`pages/*`)
- Reusable styles are centralized:
  - `css/theme.css`: tokens and theme variables
  - `css/base.css`: reset + typography
  - `css/layout.css`: layout primitives (split screen, sidebar, main area)
  - `css/components.css`: reusable components (buttons, inputs, cards, tables)

## JavaScript approach (UI only)

- `js/utils.js`
  - Small helpers (DOM selection, storage wrapper, formatting)
- `js/auth.js`
  - Simulated login/session stored in `localStorage`
  - Redirects login → dashboard
  - Provides `PF.auth.requireAuth()` guard
- `js/navigation.js`
  - Hides/Shows sidebar links based on `data-requires-role`
  - Highlights active page
  - Guards `users.html`
- `js/*.js` page scripts
  - Render **mock data** into tables and KPIs

## Notes for future backend integration

This structure is intended to map cleanly onto a future Spring Boot setup:

- Spring can serve the static assets from `src/main/resources/static/`
- Auth/session can replace the UI-only `localStorage` simulation
- Role-based menus can be driven by server-provided claims/roles

---

If you want, we can add:
- A shared HTML partial pattern (header/sidebar templates) using simple JS includes (still framework-free)
- A dedicated `js/change-password.js` file (instead of inline JS) for stricter separation
- A minimal “route guard” pattern for all pages (not only `users.html`)
