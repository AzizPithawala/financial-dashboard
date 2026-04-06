# FINOVA - Financial Dashboard

A premium, interactive personal finance dashboard built to evaluate frontend development capabilities. FINOVA is designed to help users track their cash flow, examine detailed transactions, and get actionable insights.

![Dashboard Preview](https://via.placeholder.com/1200x600.png?text=Finova+Financial+Dashboard)

## 🎯 Project Objective
This application satisfies the **Finance Dashboard UI Assignment** criteria. It demonstrates my ability to craft complex user interfaces, manage complex local state, establish basic role-based access control (RBAC), and integrate interactive data visualizations. 

## 🚀 Key Features

* **Dashboard Overview (Core):**
  * Live summary cards (Net Savings, Income, Expense, Health Score).
  * Beautiful time-based trends and monthly cash flow charts (built with Recharts).
  * Categorical donut charts displaying the spending breakdown.
* **Transactions & Filtering (Core):**
  * Tabular display of transactions spanning categories, types, and amounts.
  * Robust filtering systems by Date Ranges, Categories, Income vs Expense Types, and a full-text search.
* **Basic Role Based UI (Core):**
  * Simulate an **"Admin" vs "Viewer"** environment.
  * Use the toggle in the global Header to switch between roles.
  * Viewers are restricted from creating or deleting transactions.
* **Financial Insights (Core):**
  * Dynamic observations via Smart Banners (e.g., specific budget limits exceeded).
  * Health Score ring assessing overall savings percentage.
  * Highest spending category breakdowns.
* **Bonus & Optional Enhancements:**
  * **Mock Data Generator:** Instantly loads 10+ realistic transactions into memory so features can be experienced immediately without manual data entry.
  * **AI Chat Assistant (FAB):** A floating AI agent on the bottom right that parses your questions and provides insights on the data.
  * **Dark / Light Mode:** Fully cohesive CSS variables logic allowing instant theme toggles without refreshing.
  * **State Persistence:** LocalStorage caching through Zustand keeps all manual changes securely saved on your local device.
  * **CSV Exports:** Native browser API export to CSV downloads for analysis in Excel/Sheets.

## 🛠 Tech Stack
I focused strictly on the frontend architecture as per instructions without utilizing any complicated backend infrastructures:
* **Framework**: React 18 with TypeScript on Vite.
* **State Management**: **Zustand** + `zustand/middleware` for data persistence.
* **Routing**: React Router DOM (v6).
* **Charts & Viz**: Recharts
* **Animations**: Framer Motion
* **Styling**: Vanilla CSS Modules & Global Variables (CSS Custom Properties).

## 🧩 Architectural Decisions
1. **Single Source of Truth Store**: `financeStore.ts` acts as the single normalized store for all state (transactions, budgets, ui configuration, active role).
2. **Modular File Structure**: Features are divided into bounded contexts (`features/dashboard`, `features/transactions`, `features/insights`) rather than just flattening into `components/`.
3. **Graceful Degradation**: Empty states are properly accounted for, with robust loading skeletons when initializing charts.

## 💿 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd "FINANCIAL DASHBOARD"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The dashboard will pop up. If it doesn't, navigate your browser to `http://localhost:5173`.

> **Note:** The application will **automatically load realistic mock data** the first time it opens, providing you full access to features globally on load.
