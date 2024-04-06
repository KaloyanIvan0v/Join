let users = [];
let checkBoxState = false;
async function initRegister() {
  await loadUsers();
}

async function register() {
  let inputEmail = email.value;
  if (userExist(inputEmail)) {
    console.log("user exists", inputEmail);
  } else {
    console.log("user will be created", inputEmail);
    registerNewUser();
  }
}

async function registerNewUser() {
  const registerBtn = document.getElementById("registerBtn");
  registerBtn.disabled = true;
  users.push({
    name: names.value,
    email: email.value,
    password: password.value,
  });
  await setItem("users", JSON.stringify(users));
  resetForm();
  window.location.href = "../index.html?Deine Registrierung war erfolgreich";
}

function resetForm() {
  const registerBtn = document.getElementById("registerBtn");
  names.value = "";
  email.value = "";
  password.value = "";
  document.getElementById("password-confirm").value = "";
  registerBtn.disabled = true;
}

function userExist(user) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == user) {
      return true;
    } else {
    }
  }
  return false;
}

function passwordMatch(password, passwordConfirm) {
  if (password == passwordConfirm) {
    return true;
  } else {
    return false;
  }
}

function toggleCheckbox() {
  let checkBox = document.getElementById("id-checkbox-sign-up");
  if (checkBoxState == false) {
    checkBoxState = true;
    checkBox.src = "../img/box-checked.png";
  } else {
    checkBoxState = false;
    checkBox.src = "../img/box-unchecked.png";
  }
}
