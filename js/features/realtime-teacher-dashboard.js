let teacherRealtimeTimer = null;

async function refreshTeacherRealtimeAlerts() {
  const panel = document.getElementById("alert-panel");
  if (!panel) return;
  try {
    const payload = await getTeacherAtRiskAlerts();
    if (!payload.alerts.length) {
      panel.innerHTML = "<strong>No intervention alert:</strong> no student has 3+ consecutive fails.";
      return;
    }
    const list = payload.alerts
      .map((row) => `${row.studentName} (${row.consecutiveFails} consecutive fails, latest ${row.latestScore}%)`)
      .join(", ");
    panel.innerHTML = `<strong>Intervention Needed:</strong> ${list}`;
  } catch (err) {
    panel.innerHTML = `<strong>Alert error:</strong> ${err.message}`;
  }
}

function initTeacherRealtimeDashboard() {
  if (teacherRealtimeTimer) {
    clearInterval(teacherRealtimeTimer);
  }
  refreshTeacherRealtimeAlerts();
  teacherRealtimeTimer = setInterval(async () => {
    await refreshTeacherRealtimeAlerts();
    await renderClassOverview();
    await renderStudentList();
    await refreshProgressTracking();
  }, 10000);
}

window.initTeacherRealtimeDashboard = initTeacherRealtimeDashboard;
