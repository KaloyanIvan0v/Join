let users = [];
let a = ["a", "b", "c", "d", "e", "k"];
async function initRegister() {
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

async function register() {
  const registerBtn = document.getElementById("registerBtn");
  registerBtn.disabled = true;
  users.push({
    name: names.value,
    email: email.value,
    password: password.value,
  });
  await setItem("users", JSON.stringify(users));
  resetForm();
}

function resetForm() {
  const registerBtn = document.getElementById("registerBtn");
  names.value = "";
  email.value = "";
  password.value = "";
  document.getElementById("password-confirm").value = "";
  registerBtn.disabled = true;
}
