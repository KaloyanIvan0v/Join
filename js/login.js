let users = [];
async function initLogin() {
  await loadUsers();
}

async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
    console.log("Type of users:", typeof users);
  } catch (e) {
    console.error("Loading error:", e);
  }
}

function login() {}

function resetForm() {
  const registerBtn = document.getElementById("registerBtn");
  email.value = "";
  password.value = "";
  document.getElementById("password-confirm").value = "";
  registerBtn.disabled = true;
}
