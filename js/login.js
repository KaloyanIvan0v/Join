let users = [];
async function initLogin() {
  await loadUsers();
}

function login() {}

function resetForm() {
  const registerBtn = document.getElementById("registerBtn");
  email.value = "";
  password.value = "";
  document.getElementById("password-confirm").value = "";
  registerBtn.disabled = true;
}
