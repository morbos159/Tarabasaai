function collectFilters() {
  return {
    q: (document.getElementById("student-search-input")?.value || "").trim(),
    grade: (document.getElementById("grade-filter-select")?.value || "").trim(),
    atRisk: (document.getElementById("risk-filter-select")?.value || "").trim()
  };
}

function buildQueryString(filters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.grade) params.set("grade", filters.grade);
  if (filters.atRisk) params.set("atRisk", filters.atRisk);
  const query = params.toString();
  return query ? `?${query}` : "";
}

async function renderClassOverview() {
  const overview = await getTeacherClassOverview();
  const totalEl = document.getElementById("total-students-number");
  const needEl = document.getElementById("need-help-number");
  const avgEl = document.getElementById("class-average-number");
  const activeEl = document.getElementById("active-today-number");
  if (totalEl) totalEl.textContent = String(overview.totalStudents || 0);
  if (needEl) needEl.textContent = String(overview.atRiskCount || 0);
  if (avgEl) avgEl.textContent = `${overview.averageScore || 0}%`;
  if (activeEl) activeEl.textContent = String(overview.activeToday || 0);
}

function renderAlerts(students) {
  const alertPanel = document.getElementById("alert-panel");
  if (!alertPanel) return;
  const atRisk = students.filter((s) => s.needsHelp);
  if (!atRisk.length) {
    alertPanel.innerHTML = "<strong>No alerts:</strong> All students are currently on track.";
    return;
  }
  alertPanel.innerHTML = `<strong>At-risk students:</strong> ${atRisk.map((s) => s.name).join(", ")}`;
}

async function renderStudentList() {
  const filters = collectFilters();
  const students = await apiRequest(`/api/teacher-students${buildQueryString(filters)}`);
  const listEl = document.getElementById("student-list-container");
  if (!listEl) return;

  renderAlerts(students);
  listEl.innerHTML = students.map((s) => {
    const status = s.needsHelp ? "Need Help" : "On Track";
    return `
      <div class="student-row">
        <div><strong>${s.name}</strong> (Grade ${s.grade})</div>
        <div>Score: ${s.score}% - ${status}</div>
        <div>Parent: ${s.parentName || "-"} | Phone: ${s.parentPhone || "-"}</div>
        <div class="student-actions">
          <button class="btn btn-info" onclick="quickViewStudent(${s.id})">Quick View</button>
          <button class="btn btn-warning" onclick="editStudent(${s.id})">Edit</button>
          <button class="back-btn" onclick="deleteStudentRecord(${s.id})">Delete</button>
        </div>
      </div>
    `;
  }).join("");
}

async function addStudent() {
  const name = prompt("Student full name:");
  if (!name || !name.trim()) return;
  const grade = prompt("Grade level:", "1") || "1";
  const parentName = prompt("Parent name:", "") || "";
  const parentPhone = prompt("Parent phone:", "") || "";
  const parentEmail = prompt("Parent email:", "") || "";
  const scoreInput = prompt("Score percent (0-100):", "80");
  const score = Math.max(0, Math.min(100, Number(scoreInput)));
  if (Number.isNaN(score)) return alert("Invalid score.");

  try {
    await addTeacherStudent({
      name: name.trim(),
      grade: grade.trim(),
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim(),
      score,
      isActiveToday: true
    });
    await renderClassOverview();
    await renderStudentList();
  } catch (err) {
    alert(err.message || "Could not save student.");
  }
}

async function editStudent(id) {
  const students = await getTeacherStudents();
  const current = students.find((s) => Number(s.id) === Number(id));
  if (!current) return alert("Student not found.");

  const name = prompt("Student full name:", current.name);
  if (!name || !name.trim()) return;
  const grade = prompt("Grade level:", current.grade || "1") || "1";
  const parentName = prompt("Parent name:", current.parentName || "") || "";
  const parentPhone = prompt("Parent phone:", current.parentPhone || "") || "";
  const parentEmail = prompt("Parent email:", current.parentEmail || "") || "";
  const scoreInput = prompt("Score percent (0-100):", String(current.score || 0));
  const score = Math.max(0, Math.min(100, Number(scoreInput)));
  if (Number.isNaN(score)) return alert("Invalid score.");

  await updateTeacherStudent(id, {
    name: name.trim(),
    grade: grade.trim(),
    parentName: parentName.trim(),
    parentPhone: parentPhone.trim(),
    parentEmail: parentEmail.trim(),
    score,
    isActiveToday: true
  });
  await renderClassOverview();
  await renderStudentList();
}

async function deleteStudentRecord(id) {
  const confirmed = window.confirm("Delete this student?");
  if (!confirmed) return;
  await deleteTeacherStudent(id);
  await renderClassOverview();
  await renderStudentList();
}

async function importCsvStudents() {
  const csv = prompt("Paste CSV with headers: name,grade,parentName,parentPhone,parentEmail,score");
  if (!csv || !csv.trim()) return;
  const result = await importTeacherStudentsCsv(csv);
  alert(`Imported ${result.imported} students.`);
  await renderClassOverview();
  await renderStudentList();
}

async function generateReport() {
  const overview = await getTeacherClassOverview();
  const box = document.getElementById("report-box");
  const content = document.getElementById("report-content");
  if (!box || !content) return;
  content.innerHTML =
    `Total Students: ${overview.totalStudents}<br>` +
    `At-risk Count: ${overview.atRiskCount}<br>` +
    `Average Score: ${overview.averageScore}%<br>` +
    `Active Today: ${overview.activeToday}`;
  box.style.display = "block";
}

async function quickViewStudent(id) {
  const students = await getTeacherStudents();
  const student = students.find((s) => Number(s.id) === Number(id));
  if (!student) return;
  alert(
    `Name: ${student.name}\n` +
    `Grade: ${student.grade}\n` +
    `Score: ${student.score}%\n` +
    `Parent: ${student.parentName || "-"}\n` +
    `Phone: ${student.parentPhone || "-"}`
  );
}

function toggleStudentPanel() {
  const panel = document.getElementById("students-panel");
  if (!panel) return;
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

window.renderClassOverview = renderClassOverview;
window.renderStudentList = renderStudentList;
window.addStudent = addStudent;
window.editStudent = editStudent;
window.deleteStudentRecord = deleteStudentRecord;
window.importCsvStudents = importCsvStudents;
window.generateReport = generateReport;
window.quickViewStudent = quickViewStudent;
window.toggleStudentPanel = toggleStudentPanel;
