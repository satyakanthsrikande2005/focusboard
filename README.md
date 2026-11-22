# FocusBoard

FocusBoard is a responsive task management dashboard built for the MobileFirst frontend development assignment. It runs entirely in the browser and saves tasks to LocalStorage.

## Features

- **Dashboard layout** — desktop sidebar (1440 × 1000 reference) and a mobile top bar with slide-in menu (390 × 1128 reference); tablet sizes supported.
- **Header** — welcome message, current date, live search, notifications for tasks that are due soon or overdue, and the user profile.
- **Dynamic statistics** — Total, Completed, In Progress and Pending counts calculated from the saved tasks.
- **Full CRUD**
  - Create tasks in a validated modal form.
  - Read all saved tasks.
  - Update tasks with prefilled values (or tick the circle to mark complete).
  - Delete tasks after an inline confirmation.
- **Search & filters** — search by title while typing, filter by status (All / Pending / In Progress / Completed) and priority (Low / Medium / High). Search and filters work together, and **Clear filters** resets all of them.
- **Focus Notes carousel** — three slides with heading, message, Previous/Next buttons, three pagination dots, active indicator, smooth transitions and arrow-key support.
- **LocalStorage persistence** — key `focusboard_tasks`. Sample tasks are created only on the first launch; invalid or missing data is handled safely and saved data is never overwritten on reload.
- **Navigation** — Dashboard, My Tasks, Calendar (tasks ordered by due date), Help Center and Settings (restore sample tasks).
- **Accessibility** — semantic HTML, labelled controls, keyboard support, focus trapping in the modal and visible focus states.

## Tech stack

React 19 · Vite · JavaScript (ES6+, JSX) · CSS3 · React Hooks · Lucide React · LocalStorage · ESLint

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # preview the production build
npm run lint      # run ESLint
```

## Project structure

```
focusboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Sidebar.jsx           # Desktop sidebar and navigation
│   │   ├── MobileNavigation.jsx  # Mobile top bar and slide-in menu
│   │   ├── Header.jsx            # Welcome, date, search, notifications, profile
│   │   ├── StatsCards.jsx        # Statistics container
│   │   ├── StatCard.jsx          # Single statistics card
│   │   ├── TaskList.jsx          # Task records
│   │   ├── TaskItem.jsx          # Task details and actions
│   │   ├── TaskModal.jsx         # Add / edit form with validation
│   │   ├── TaskFilters.jsx       # Status and priority filters
│   │   ├── SearchBar.jsx         # Task search
│   │   ├── FocusNotes.jsx        # Three-slide carousel
│   │   └── EmptyState.jsx        # Empty list message
│   ├── hooks/
│   │   └── useTasks.js           # Task state, CRUD, filters and stats
│   ├── utils/
│   │   └── storage.js            # LocalStorage read / write helpers
│   ├── App.jsx                   # Main layout and views
│   ├── App.css                   # Application styles (responsive)
│   ├── index.css                 # Design tokens and CSS reset
│   └── main.jsx                  # React entry point
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## Resetting data

Open **Settings → Restore sample tasks**, or clear the `focusboard_tasks` key from your browser's LocalStorage.
