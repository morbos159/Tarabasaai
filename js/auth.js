function switchAuthTab(tab) {
  const loginTab = document.getElementById("tab-login");
  const signupTab = document.getElementById("tab-signup");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  if (tab === "login") {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
  } else {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
  }
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim().toLowerCase();
  const password = document.getElementById("signup-password").value;
  const role = document.getElementById("signup-role").value;

  if (!name || !email || !password || !role) {
    alert("Please complete all fields.");
    return;
  }

  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    alert("This email is already registered.");
    switchAuthTab("login");
    return;
  }

  const user = { name, email, password, role };
  users.push(user);
  saveUsers(users);
  setSession(user);
  window.location.href = "dashboard.html";
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;
  const user = getUsers().find((u) => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password.");
    return;
  }

  setSession(user);
  window.location.href = "dashboard.html";
}

window.addEventListener("DOMContentLoaded", () => {
  // Always start on login page when opening index.html.
  switchAuthTab("login");
});
