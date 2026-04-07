function showRoleDashboard(role) {
  const ids = ["teacher-dashboard", "student-home", "parent-dashboard"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });

  if (role === "teacher") document.getElementById("teacher-dashboard").classList.add("active");
  else if (role === "student") document.getElementById("student-home").classList.add("active");
  else document.getElementById("parent-dashboard").classList.add("active");
}

function renderStudentList() {
  const students = getTeacherStudents();
  const total = students.length;
  const needHelp = students.filter((s) => s.needsHelp).length;
  const onTrack = total - needHelp;
  const avg = total ? Math.round(students.reduce((sum, s) => sum + Number(s.score || 0), 0) / total) : 0;

  const totalEl = document.getElementById("total-students-number");
  const needEl = document.getElementById("need-help-number");
  const onTrackEl = document.getElementById("on-track-number");
  const avgEl = document.getElementById("class-average-number");
  const listEl = document.getElementById("student-list-container");

  if (totalEl) totalEl.textContent = String(total);
  if (needEl) needEl.textContent = String(needHelp);
  if (onTrackEl) onTrackEl.textContent = String(onTrack);
  if (avgEl) avgEl.textContent = `${avg}%`;

  if (listEl) {
    listEl.innerHTML = students.map((s, i) => {
      const status = s.needsHelp ? "Need Help" : "On Track";
      return `<div>${i + 1}. ${s.name} - ${s.score}% - ${status}</div>`;
    }).join("");
  }
}

function addStudent() {
  const name = prompt("Enter student full name:");
  if (!name || !name.trim()) return;
  const scoreInput = prompt("Enter score percent (0-100):", "80");
  const score = Math.max(0, Math.min(100, Number(scoreInput)));
  if (Number.isNaN(score)) return alert("Invalid score.");

  const students = getTeacherStudents();
  students.push({ name: name.trim(), score, needsHelp: score < 75 });
  saveTeacherStudents(students);
  renderStudentList();
}

function generateReport() {
  const students = getTeacherStudents();
  const total = students.length;
  const needHelp = students.filter((s) => s.needsHelp).length;
  const onTrack = total - needHelp;
  const avg = total ? Math.round(students.reduce((sum, s) => sum + Number(s.score || 0), 0) / total) : 0;
  const box = document.getElementById("report-box");
  const content = document.getElementById("report-content");
  content.innerHTML =
    `Total Students: ${total}<br>` +
    `Need Help: ${needHelp}<br>` +
    `On Track: ${onTrack}<br>` +
    `Class Average: ${avg}%`;
  box.style.display = "block";
}

function toggleStudentPanel() {
  const panel = document.getElementById("students-panel");
  if (!panel) return;
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function logoutUser() {
  clearSession();
  window.location.href = "index.html";
}

window.addEventListener("DOMContentLoaded", () => {
  const session = getSession();
  if (!session || !session.role) {
    window.location.href = "index.html";
    return;
  }

  showRoleDashboard(session.role);
  if (session.role === "teacher") renderStudentList();
});
