# 🎓 Internship Tracker Dashboard (Frontend)

![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-purple)
![Ant Design](https://img.shields.io/badge/Ant_Design-UI_Library-1890ff)
![React Router](https://img.shields.io/badge/React_Router-SPA_Navigation-ca4245)

A modern, responsive Single Page Application (SPA) built to manage and track internship lifecycles. This frontend repository provides a centralized dashboard connecting students, educational institutions, and internship providers. 

## 🎯 Project Overview: What Are We Trying to Achieve?

Managing internships typically involves juggling multiple spreadsheets, emails, and disconnected databases. The goal of this project is to build a unified **Internship Tracking System** with a seamless User Interface (UI). 

We aim to provide administrators and users with an intuitive dark-themed dashboard to efficiently track:
1. **Students** seeking or enrolled in internships.
2. **Providers** (companies/organizations) offering opportunities.
3. **Institutions** (universities/colleges) managing their students.
4. **Applications & Statuses** mapping students to specific roles.
5. **Internship Tracks** detailing the progression of the internship programs.

## 🧠 In-Depth Analysis: How Are We Achieving It?

This frontend is engineered for speed, modularity, and clean UX. Here is how the technical stack achieves these goals:

### 1. High-Performance Build Tooling (Vite)
Instead of traditional tools like Create React App (Webpack), this project uses **Vite**. Vite provides near-instantaneous Hot Module Replacement (HMR) and highly optimized production builds, vastly improving developer experience and deployment speed.

### 2. Robust UI Architecture (Ant Design - `antd`)
Building complex data tables and layouts from scratch is error-prone. We leverage the **Ant Design** component library.
* **Global Theming:** Wrapped in an `antd` `<ConfigProvider theme={{ mode: 'dark' }}>`, the entire application automatically inherits a sleek, consistent dark mode.
* **Layouts & Navigation:** The `SidebarLayout` utilizes `antd`'s `<Layout>`, `<Sider>`, and `<Breadcrumb>` components to create a fixed, professional dashboard shell with a custom background overlay.

### 3. Client-Side Routing (`react-router-dom`)
To ensure a smooth, app-like experience without full page reloads, we use `react-router-dom`. 
* The sidebar acts as the navigation controller. Clicking on a menu item (like "Institutions" or "Providers") dynamically swaps out the `<Content>` area with the respective component (e.g., `<InstitutionsTable />`) while preserving the application state.

### 4. API Integration Readiness (`axios` & `moment`)
The application is pre-configured to communicate with a backend database. 
* **Axios** is utilized for making asynchronous HTTP GET/POST requests to fetch table data (e.g., student lists, internship statuses).
* **Moment.js** is included to handle complex date formatting (e.g., parsing application dates, start/end times for internship tracks).

## 📂 Repository Structure

| File/Folder | Description | 
| ----- | ----- | 
| `package.json` | Project manifest defining scripts, dependencies (`antd`, `axios`, `react-router-dom`), and project metadata. | 
| `vite.config.js` | Configuration file for the Vite build environment. | 
| `src/App.jsx` | The root React component. Wraps the app in the global Dark Theme and renders the main Layout. | 
| `src/assets/sidebar.jsx` | The core structural component. Contains the routing logic, sidebar menu items, header, and footer. | 
| `src/assets/studentTable.jsx` | Data grid component dedicated to displaying and managing student records. | 
| `src/assets/providerstable.jsx` | Data grid component for managing companies offering internships. | 
| `src/assets/institutions table.jsx`| Component for tracking educational institutions. | 
| `src/assets/internship.jsx` | Component displaying the active internship applications and their statuses. | 
| `src/assets/internshipTrack.jsx` | Component for monitoring the progression/timeline of active internships. | 

## ⚙️ Complete Setup & Installation Guide

Follow these steps to run the frontend development server on your local machine.

### Step 1: Prerequisites
Ensure you have **Node.js (v16 or higher)** and **npm** installed on your system.
Verify by running:
```bash
node -v
npm -v
```

### Step 2: Clone the Repository
Open your terminal and clone the repository:
```bash
git clone <your-repository-url>
cd dbe-frontend
```

### Step 3: Install Dependencies
Install all the required React packages, Vite, and Ant Design libraries:
```bash
npm install
```

### Step 4: Run the Development Server
Spin up the Vite local server:
```bash
npm run dev
```
The terminal will output a local address (usually `http://localhost:5173`). Ctrl+Click or copy-paste that link into your browser to view the application.

## 🚀 Usage Guide

Once the application is running, navigate using the left-hand sidebar:
* **Student:** View the roster of users/students in the system.
* **Providers:** Check the registered organizations hosting internships.
* **Institutions:** View university/college partner data.
* **Applications:** Track the status of active internship applications.
* **Internship Track:** Monitor milestones and ongoing internship progress.

### Building for Production
When you are ready to deploy (e.g., to Vercel, Netlify, or Azure Static Web Apps), generate an optimized static build:
```bash
npm run build
```
This will create a `dist/` folder containing your minified, production-ready assets.

## 🛠️ Troubleshooting

* **`'vite' is not recognized as an internal or external command`**: This means your dependencies didn't install correctly. Rerun `npm install`.
* **Blank screen on load**: Open your browser's Developer Tools (F12) and check the Console. Ensure that the routing paths in `sidebar.jsx` match exactly with the URLs you are trying to access.
* **Images not loading**: Verify that `photo-1530533718754-001d2668365a.jpg` is properly located in the `src/assets/` directory as referenced by the background style in `sidebar.jsx`.

---
*Internship Tracker ©2024 Created by Sanan, Suleman and Sheheryar*
