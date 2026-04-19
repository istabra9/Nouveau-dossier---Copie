# Advancia Trainings

Advancia Trainings is a full-stack training platform built with Next.js, Node.js, and MongoDB. It includes a premium public homepage, secure authentication, role-based dashboards, training management, notifications, activity tracking, onboarding-based recommendations, and mock AI assistants ready for future LLM integration.

## Stack

- Frontend: Next.js App Router + TypeScript
- Backend: route handlers + backend service/repository layers
- Database: MongoDB + Mongoose
- Styling: Tailwind CSS v4
- Charts: Recharts
- Motion: Framer Motion
- 3D accents: React Three Fiber
- Auth: bcryptjs + jose
- Import/export: XLSX + pdf-lib

## Core Features

- Responsive homepage with animated hero, catalogue preview, and calendar preview
- Secure register, login, logout, onboarding, and password change flows
- Exactly 3 roles: `User`, `Admin`, `Super Administrator`
- Preloaded Super Administrator: `Ramzy Sassi`
- Protected role-based routes
- User profile with:
  - profile completeness
  - funny avatar selection
  - profile image upload
  - language preference
  - theme preference
  - current training dates
- User dashboard with Alexa assistant
- Admin dashboard with:
  - KPI cards
  - charts
  - notifications
  - user management
  - import/export center
- Super admin dashboard with:
  - advanced analytics
  - Alex assistant
  - user CRUD tools
  - training CRUD tools
  - intelligent insights
- Notification system
- Activity history
- Training calendar
- Excel import
- Excel/PDF export
- Mongo seed/demo data

## Project Structure

```text
app/
  (auth)/
    login/
    register/
  (dashboard)/
    dashboard/
      admin/
      import-export/
      super-admin/
      user/
  (marketing)/
    calendar/
    page.tsx
    profile/
    trainings/
  (onboarding)/
    onboarding/
  api/
    admin/
      notifications/
      trainings/
      users/
    auth/register/
    chatbot/
    import/trainings/
    onboarding/
    payments/checkout/
    profile/
    reports/
backend/
  auth/
  chatbot/
  data/
  db/
  models/
  payments/
  repositories/
  services/
frontend/
  components/
    auth/
    catalogue/
    dashboard/
    layout/
    marketing/
    onboarding/
    profile/
    providers/
    shared/
    three/
    ui/
  content/
  i18n/
  types/
  utils/
public/
scripts/
  seed.ts
proxy.ts
```

## Data Models

MongoDB-ready models included:

- `User`
- `Training`
- `Category`
- `Enrollment`
- `Payment`
- `Schedule`
- `Notification`
- `ActivityLog`

## Roles

### User

- Register, log in, and complete onboarding
- Update own profile only
- Change password
- Pick a funny avatar
- Upload a profile image
- Browse trainings
- Enroll and pay
- View notifications and activity history
- Use Alexa for recommendations

### Admin

- View operational dashboard
- Create, update, activate, and delete learner accounts
- Import Excel files
- Export Excel and PDF reports
- Monitor analytics and alerts
- Send notifications

### Super Administrator

- Everything admin can do
- Full user oversight
- Training CRUD
- Advanced analytics
- Alex assistant
- Training status monitoring
- Intelligent insights

## Assistants

### Alexa

- User-facing bunny assistant
- Helps choose the right training
- Uses onboarding-derived focus data and recommendations
- Ready for future AI service replacement

### Alex

- Super-admin analytics assistant
- Answers queries like:
  - inactive users
  - most popular training
  - most active users
- Uses database-backed rule logic for now

## Auth and Access

- Passwords hashed with `bcryptjs`
- Signed session cookie with `jose`
- Middleware protection in [`proxy.ts`](/C:/Users/user/OneDrive/Bureau/Nouveau%20dossier/proxy.ts)
- Guards in [`backend/auth/guards.ts`](/C:/Users/user/OneDrive/Bureau/Nouveau%20dossier/backend/auth/guards.ts)
- Dashboard landing by role:
  - User → `/dashboard/user`
  - Admin → `/dashboard/admin`
  - Super Administrator → `/dashboard/super-admin`

## Demo Accounts

- Super Administrator: `superadmin@advancia.local` / `SuperAdmin123!`
- Admin: `admin@advancia.local` / `Admin123!`
- User: `user@advancia.local` / `User123!`

## Environment

Copy the example file:

```bash
copy .env.example .env.local
```

Required values:

- `MONGODB_URI`
- `AUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `PAYMENT_PROVIDER`
- `DEFAULT_CURRENCY`

Example file: [.env.example](/C:/Users/user/OneDrive/Bureau/Nouveau%20dossier/.env.example)

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Make sure MongoDB is running locally

Default local URI:

```text
mongodb://127.0.0.1:27017/advancia-trainings
```

3. Seed the database

```bash
npm run seed
```

4. Start development

```bash
npm run dev
```

5. Open the app

```text
http://localhost:3000
```

## Production Check

Validated locally with:

```bash
npm run lint
npm run typecheck
npm run build
```

Note: on this Windows setup, Next may print non-blocking SWC native warnings and fall back to WASM bindings. The build still succeeds.

## Main API Routes

- `POST /api/auth/register`
- `POST /api/onboarding`
- `POST /api/chatbot`
- `PATCH /api/profile`
- `PATCH /api/profile/password`
- `POST /api/payments/checkout`
- `POST /api/admin/users`
- `PATCH /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `POST /api/admin/trainings`
- `PATCH /api/admin/trainings/:slug`
- `DELETE /api/admin/trainings/:slug`
- `POST /api/admin/notifications`
- `POST /api/import/trainings`
- `GET /api/reports/excel?report=...`
- `GET /api/reports/pdf?report=...`

## Notes for Future AI Integration

- Alexa and Alex already use dedicated backend logic and isolated entry points
- The chatbot engine can be swapped later with a real LLM service without rewriting the UI
- The analytics and recommendation layers already expose structured data suitable for future AI orchestration
