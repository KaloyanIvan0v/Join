let users = [];

async function initRegister() {
  loadUsers();
}

async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function register() {
  registerBtn.disabled = true;
  users.push({
    name: names.value,
    email: email.value,
    password: password.value,
  });
  await setItem("users", JSON.stringify(users));
  resetForm();
}

function getInputValues() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let passwordConfirm = document.getElementById("password-confirm").value;
  let inputData = [name, email, password, passwordConfirm];
  return inputData;
}

function resetForm() {
  email.value = "";
  password.value = "";
  registerBtn.disabled = false;
}
