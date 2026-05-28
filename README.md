# SafeVault – Personal Password Manager

A MERN stack password manager with a dark, secure UI.

## Project Structure

```
safevault/
├── client/          # React frontend (Create React App)
│   └── src/
│       ├── components/
│       │   ├── common/      # PasswordInput, StrengthBar, SiteFavicon, ProtectedRoute
│       │   ├── layout/      # Sidebar, Topbar
│       │   └── modals/      # AddEntry, EditEntry, DeleteConfirm, ViewPassword, Success
│       ├── context/         # AuthContext, VaultContext
│       ├── pages/           # LoginPage, DashboardPage, SecurityPage, SettingsPage
│       ├── services/        # api.js (all HTTP calls)
│       └── utils/           # passwordUtils.js
└── server/          # Express backend
    ├── config/      # db.js
    ├── controllers/ # authController, vaultController
    ├── middleware/  # authMiddleware (JWT)
    ├── models/      # User, VaultEntry (Mongoose)
    └── routes/      # authRoutes, vaultRoutes
```

## SOLID Principles Applied

- **S** – Each file has one responsibility (e.g. `PasswordInput` only handles the input UI, `authController` only handles auth logic)
- **O** – `AuthProvider` and `VaultProvider` can be extended without modifying core logic
- **L** – Modal components are interchangeable via consistent `onClose`/`onSuccess` props
- **I** – Contexts expose only what each consumer needs
- **D** – Pages depend on context abstractions, not directly on `axios`

## Page Flow

```
LoginPage (Screenshot 1)
  └──▶ DashboardPage (Screenshot 2)
         ├── Click entry → ViewPasswordModal (Screenshot 5)
         │     └── Correct master password → Detail panel shown (Screenshot 6)
         │           ├── ✏️ Edit icon → EditEntryModal (Screenshot 7) → SuccessModal (Screenshot 4)
         │           └── 🗑️ Delete icon → DeleteConfirmModal (Screenshot 8) → SuccessModal (Screenshot 9)
         └── "+ Add Entry" button → AddEntryModal (Screenshot 3) → SuccessModal (Screenshot 4)

SecurityPage (Screenshot 10) – accessed via sidebar
SettingsPage (Screenshot 11) – accessed via sidebar
```

## Setup

### 1. Clone & install

```bash
npm run install:all
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and JWT secret
```

### 3. Run in development

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 4. Create an account

Go to http://localhost:3000, click **"Create Vault"**, register with your email and a master password.

## Notes

- Passwords are stored as plain text in this page-flow demo. For production, implement client-side encryption using the master password as a key derivation input (e.g. PBKDF2 + AES-GCM via Web Crypto API).
- The master password is hashed with bcrypt (cost 12) in the database.
- All vault routes require a valid JWT token via `Authorization: Bearer <token>`.
