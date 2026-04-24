# TaraBasa AI

Web app with secure authentication and role-based dashboards.

## Description

Secure login and registration for Teacher, Student, and Parent roles.

## Key Functions

- Register
- Login
- Logout
- Password reset
- Role-based routing

## Student Management

Create, Read, Update, Delete student records including grade and parent link.

- Add/edit/delete student
- CSV import
- Search/filter
- Parent phone link

## Class Overview

Class overview: total students, at-risk count, average score, active today.

- Stat cards
- Student list
- Alert panel
- Quick-view buttons

## Parent Progress View

Parent view of child progress: current level, weekly activities, badges.

- Child summary cards
- Weekly report
- Activity checklist
- Badge display

## Project Structure

- `index.html` - Login and Sign Up page
- `dashboard.html` - Teacher, Student, and Parent dashboards
- `css/styles.css` - Shared styles
- `js/app-data.js` - Shared localStorage/session helpers
- `js/features/auth-ui.js` - Auth tab switching UI
- `js/features/auth-actions.js` - Sign up and login actions
- `js/features/auth-init.js` - Auth page startup behavior
- `js/features/dashboard-routing.js` - Dashboard role routing + logout
- `js/features/teacher-dashboard.js` - Teacher stats, add student, reports
- `js/features/dashboard-init.js` - Dashboard startup behavior

## Run Locally

1. Make sure Node.js is installed.
2. From the project folder, install dependencies:
   - `npm install`
3. Start the server:
   - `npm start`
4. Open `http://127.0.0.1:8000` in your browser.
5. Sign up a new user (Teacher/Student/Parent).
6. After login, you are redirected to `dashboard.html`.

## Notes

- User and student data are stored in `database` (SQLite file).
- Browser `localStorage` stores only the current session info.
- Teacher stats are computed from saved student records:
  - Total Students
  - Need Help (`score < 75`)
  - On Track (`score >= 75`)
  - Class Average