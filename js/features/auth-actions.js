async function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim().toLowerCase();
  const password = document.getElementById("signup-password").value;
  const role = document.getElementById("signup-role").value;

  if (!name || !email || !password || !role) {
    alert("Please complete all fields.");
    return;
  }

  try {
    const user = await signupUser({ name, email, password, role });
    setSession(user);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message || "Sign up failed.");
    if ((err.message || "").toLowerCase().includes("already")) {
      switchAuthTab("login");
    }
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;
  try {
    const user = await loginUser(email, password);
    setSession(user);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message || "Login failed.");
  }
}

async function handleForgotPassword() {
  const emailInput = prompt("Enter your account email:");
  const email = (emailInput || "").trim().toLowerCase();
  if (!email) return;

  try {
    const result = await requestPasswordReset(email);
    if (result?.resetCode) {
      alert(`Your reset code is: ${result.resetCode}`);
    }
    const code = (prompt("Enter the reset code:") || "").trim();
    if (!code) return;
    const newPassword = prompt("Enter your new password (minimum 6 characters):") || "";
    if (!newPassword) return;

    await confirmPasswordReset(email, code, newPassword);
    alert("Password reset successful. You can now log in.");
    switchAuthTab("login");
  } catch (err) {
    alert(err.message || "Password reset failed.");
  }
}

window.handleSignup = handleSignup;
window.handleLogin = handleLogin;
window.handleForgotPassword = handleForgotPassword;
