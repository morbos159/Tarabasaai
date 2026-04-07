# TaraBasa AI

Simple static web app with split auth and dashboard pages.

## Project Structure

- `index.html` - Login and Sign Up page
- `dashboard.html` - Teacher, Student, and Parent dashboards
- `css/styles.css` - Shared styles
- `js/app-data.js` - Shared localStorage/session helpers
- `js/auth.js` - Login/Sign Up logic
- `js/dashboard.js` - Dashboard routing and teacher actions

## Run Locally

1. Open `index.html` in your browser.
2. Sign up a new user (Teacher/Student/Parent).
3. After login, you are redirected to `dashboard.html`.

## Notes

- Data is stored in browser `localStorage` only.
- Teacher stats are computed from saved student records:
  - Total Students
  - Need Help (`score < 75`)
  - On Track (`score >= 75`)
  - Class Average