function getUsers() {
  return JSON.parse(localStorage.getItem("tb_users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("tb_users", JSON.stringify(users));
}

function setSession(user) {
  localStorage.setItem("tb_session", JSON.stringify({
    name: user.name,
    email: user.email,
    role: user.role
  }));
}

function getSession() {
  return JSON.parse(localStorage.getItem("tb_session") || "null");
}

function clearSession() {
  localStorage.removeItem("tb_session");
}

function getTeacherStudents() {
  const fallback = [
    { name: "Juan Dela Cruz", needsHelp: false, score: 86 },
    { name: "Maria Reyes", needsHelp: true, score: 62 },
    { name: "Pedro Garcia", needsHelp: false, score: 93 }
  ];

  const saved = JSON.parse(localStorage.getItem("tb_teacher_students") || "null");
  if (!saved) return fallback;
  if (Array.isArray(saved) && saved.length && typeof saved[0] === "string") {
    const migrated = saved.map((name) => ({ name, needsHelp: false, score: 80 }));
    localStorage.setItem("tb_teacher_students", JSON.stringify(migrated));
    return migrated;
  }
  return saved;
}

function saveTeacherStudents(students) {
  localStorage.setItem("tb_teacher_students", JSON.stringify(students));
}
