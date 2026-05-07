# SOC Alert Triage Platform

An enterprise-grade Security Operations Center (SOC) dashboard designed for high-density alert monitoring, real-time threat triage, and landscape analysis.

## 🚀 Key Features

- **Security Posture Overview:** Real-time metrics aggregated by severity, category, and status using Recharts.
- **High-Density Triage Queue:** A "Linear/Datadog" inspired list view optimized for technical analysts.
- **Real-Time Sync:** Background revalidation using **Server-Sent Events (SSE)**—the dashboard updates automatically when any analyst modifies an alert.
- **Deep Triage View:** Master-Detail layout with raw JSON evidence exploration and quick-dismiss workflows.
- **Authentication:** Robust auth powered by Better Auth.

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Ant Design, Recharts, Moment.js.
- **Backend:** Node.js, Express, MongoDB (Mongoose), Better Auth.
- **Real-time:** SSE (Server-Sent Events) with Node EventEmitter.

---

## 📂 Getting Started

### 1. Backend Setup

Navigate to the backend directory and configure your environment:

```bash
cd backend
```

Create a `.env` file and add the following:

```env
PORT=3001
ENVIRONMENT=dev
DATABASE=soc
MONGO_URI_DEV=mongodb://127.0.0.1:27017/soc
MONGO_URI_PROD=mongodb://127.0.0.1:27017/soc

# Authentication
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_SECRET=your_generated_secret_here
FRONTEND_DASHBOARD=http://localhost:3000
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

---

### 2. Frontend Setup

Navigate to the frontend directory and configure your environment:

```bash
cd frontend
```

Create a `.env.local` file and add the following:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_ENVIRONMENT=dev
```

Install dependencies and start the application:

```bash
npm install
npm run dev
```

---

## 📡 Real-Time Architecture

This platform utilizes a **Signal-to-Refresh** pattern.

1. When an alert is updated via the `PATCH` API, the backend emits a signal via a shared `eventHub`.
2. The SSE route (`/api/alert/stream`) broadcasts a `REVALIDATE_LIST` event to all connected clients.
3. The frontend listens for this signal and silently refreshes the data in the background, ensuring all analysts are looking at the most up-to-date information without page reloads.
