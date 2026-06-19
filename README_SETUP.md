# Employee Management Dashboard - Setup Guide

## Quick Start (Single Port - Production Mode)

### Option 1: Using the startup script
```bash
start.bat
```
This will:
1. Build the React frontend
2. Start the server on http://localhost:5000
3. Serve both frontend and backend on port 5000

### Option 2: Manual commands
```bash
# Build React app
npm run build

# Start backend (serves React build)
cd backend
npm start
```

Then open: **http://localhost:5000**

---

## Development Mode (Two Ports)

If you want hot-reload during development:

### Terminal 1 - Backend (Port 5000):
```bash
cd backend
npm start
```

### Terminal 2 - Frontend (Port 3000):
```bash
npm start
```

Then open: **http://localhost:3000**

---

## Project Structure

```
task1/
├── backend/           # Node.js/Express backend
│   ├── data/         # Employee data storage
│   │   ├── employees.js    # Default employees
│   │   └── employees.txt   # Dynamic storage
│   ├── middleware/   # Auth middleware
│   ├── routes/       # API routes
│   └── server.js     # Express server
├── src/              # React frontend
│   ├── components/   # React components
│   ├── context/      # Auth context
│   └── utils/        # API utilities
└── build/            # Production build (created after npm run build)
```

---

## Features

✅ Login with any email/password  
✅ Dashboard with employee statistics  
✅ Search with highlighting  
✅ Department filtering  
✅ Pagination  
✅ Sort by joining date  
✅ Add/Remove employees  
✅ Dark/Light mode  
✅ Data persistence in text file  

---

## API Endpoints

- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- GET `/api/employees` - Get all employees (with filters)
- GET `/api/employees/:id` - Get employee by ID
- GET `/api/employees/stats/dashboard` - Get dashboard stats
- POST `/api/employees` - Add new employee
- DELETE `/api/employees/:id` - Delete employee

---

## Ports

- **Production (Single Port):** http://localhost:5000
- **Development Frontend:** http://localhost:3000
- **Development Backend:** http://localhost:5000
