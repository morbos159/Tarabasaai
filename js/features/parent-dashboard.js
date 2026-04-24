async function renderParentDashboard() {
  const summaryEl = document.getElementById("parent-summary-cards");
  const weeklyEl = document.getElementById("weekly-report-content");
  const checklistEl = document.getElementById("activity-checklist");
  const badgesEl = document.getElementById("badge-display");
  if (!summaryEl || !weeklyEl || !checklistEl || !badgesEl) return;

  try {
    const data = await getParentOverview();
    summaryEl.innerHTML = data.children.map((child) => `
      <div class="module-card">
        <div><strong>${child.name}</strong></div>
        <div>${child.currentLevel}</div>
        <div>Score: ${child.score}%</div>
      </div>
    `).join("") || "<div>No linked children found.</div>";

    weeklyEl.innerHTML =
      `Weekly Activities: ${data.weeklyReport.weeklyActivities}<br>` +
      `Average Score: ${data.weeklyReport.averageScore}%`;

    checklistEl.innerHTML = data.activityChecklist.map((item) =>
      `<div>${item.done ? "✅" : "⬜"} ${item.label}</div>`
    ).join("");

    badgesEl.innerHTML = data.badges.map((badge) =>
      `<span class="badge-pill">${badge}</span>`
    ).join("");
  } catch (err) {
    summaryEl.innerHTML = `<div>${err.message || "Could not load parent dashboard."}</div>`;
  }
}

window.renderParentDashboard = renderParentDashboard;
