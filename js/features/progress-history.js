function getStudentBadges(attempts) {
  if (!attempts.length) return [{ label: "Starter", tone: "soft", icon: "🌱" }];
  const best = Math.max(...attempts.map((a) => a.overallScore || 0));
  const avg = Math.round(attempts.reduce((sum, row) => sum + Number(row.overallScore || 0), 0) / attempts.length);
  const recent3Passed = attempts.slice(0, 3).every((a) => Number(a.overallScore || 0) >= 75);
  const badges = [];
  if (attempts.length >= 5) badges.push({ label: "Practice Streak", tone: "info", icon: "🔥" });
  if (best >= 90) badges.push({ label: "Pronunciation Star", tone: "gold", icon: "⭐" });
  if (avg >= 80) badges.push({ label: "Strong Performer", tone: "success", icon: "🏅" });
  if (recent3Passed && attempts.length >= 3) badges.push({ label: "Consistency", tone: "purple", icon: "🎯" });
  return badges.length ? badges : [{ label: "Keep Going", tone: "soft", icon: "💪" }];
}

function getTeacherBadges(attempts) {
  if (!attempts.length) return [{ label: "Class Monitor", tone: "soft", icon: "📘" }];
  const uniqueStudents = new Set(attempts.map((a) => a.studentEmail)).size;
  const highScores = attempts.filter((a) => Number(a.overallScore || 0) >= 85).length;
  const badges = [];
  if (uniqueStudents >= 3) badges.push({ label: "Multi-Student Tracking", tone: "info", icon: "👥" });
  if (highScores >= 5) badges.push({ label: "Class Momentum", tone: "success", icon: "📈" });
  badges.push({ label: "Live Insights", tone: "purple", icon: "🧠" });
  return badges;
}

function renderBadgeBoard(targetId, badges) {
  const board = document.getElementById(targetId);
  if (!board) return;
  board.innerHTML = badges.map((badge) => `
    <div class="design-badge ${badge.tone}">
      <span class="design-badge-icon">${badge.icon}</span>
      <span>${badge.label}</span>
    </div>
  `).join("");
}

function buildTrendSvg(attempts) {
  const recent = attempts.slice().reverse().slice(-10);
  const points = recent
    .map((attempt, index) => {
      const x = 30 + index * 36;
      const y = 175 - Math.round((Number(attempt.overallScore || 0) / 100) * 145);
      return `${x},${y}`;
    })
    .join(" ");
  const bars = recent
    .map((attempt, index) => {
      const x = 22 + index * 36;
      const height = Math.round((Number(attempt.overallScore || 0) / 100) * 120);
      const y = 175 - height;
      return `<rect x="${x}" y="${y}" width="16" height="${height}" rx="4" fill="rgba(79,172,254,0.35)" />`;
    })
    .join("");

  return `
    <svg viewBox="0 0 400 200" class="trend-chart-svg" aria-label="Score trend chart">
      <defs>
        <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#667eea"></stop>
          <stop offset="100%" stop-color="#ff6b9d"></stop>
        </linearGradient>
      </defs>
      <line x1="20" y1="175" x2="390" y2="175" stroke="#d8deee" />
      <line x1="20" y1="25" x2="20" y2="175" stroke="#d8deee" />
      <line x1="20" y1="62" x2="390" y2="62" stroke="#edf1fb" />
      <line x1="20" y1="100" x2="390" y2="100" stroke="#edf1fb" />
      <line x1="20" y1="138" x2="390" y2="138" stroke="#edf1fb" />
      ${bars}
      <polyline fill="none" stroke="url(#lineStroke)" stroke-width="3.5" points="${points}" />
      <text x="345" y="20" font-size="11" fill="#666">Last attempts</text>
    </svg>
  `;
}

function renderStudentHistory(attempts) {
  const feed = document.getElementById("student-history-feed");
  const chart = document.getElementById("student-trend-chart");
  if (!feed || !chart) return;
  renderBadgeBoard("student-badge-board", getStudentBadges(attempts));

  feed.innerHTML = attempts.slice(0, 12).map((attempt) => `
    <div class="history-item">
      <div><strong>${attempt.verb}</strong> (${attempt.tense}) - ${attempt.overallScore}%</div>
      <div>${new Date(attempt.createdAt).toLocaleString()}</div>
    </div>
  `).join("") || "<div>No attempts yet.</div>";

  chart.innerHTML = attempts.length ? buildTrendSvg(attempts) : "<div>No trend data yet.</div>";
}

function renderTeacherHistory(attempts) {
  const feed = document.getElementById("teacher-history-feed");
  const chart = document.getElementById("teacher-trend-chart");
  if (!feed || !chart) return;
  renderBadgeBoard("teacher-badge-board", getTeacherBadges(attempts));

  feed.innerHTML = attempts.slice(0, 20).map((attempt) => `
    <div class="history-item">
      <div><strong>${attempt.studentName}</strong> - ${attempt.verb} (${attempt.tense})</div>
      <div>Score: ${attempt.overallScore}% | ${new Date(attempt.createdAt).toLocaleString()}</div>
    </div>
  `).join("") || "<div>No class attempts yet.</div>";

  chart.innerHTML = attempts.length ? buildTrendSvg(attempts) : "<div>No class trend yet.</div>";
}

async function refreshProgressTracking() {
  const session = await getSession();
  if (!session) return;
  if (session.role === "student") {
    const attempts = await getStudentVoiceAttempts();
    renderStudentHistory(attempts);
  } else if (session.role === "teacher") {
    const attempts = await getTeacherVoiceAttempts();
    renderTeacherHistory(attempts);
  }
}

window.refreshProgressTracking = refreshProgressTracking;
