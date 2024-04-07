let users = [];
let checkBoxState = false;
async function initRegister() {
  await loadUsers();
  setPwdInputEventListeners();
}

async function register() {
  let inputEmail = email.value;
  if (!userExist(inputEmail) && passwordMatch()) {
    console.log("user will be created", inputEmail);
    registerNewUser();
  } else {
    handleLoginFeedbackMsg(inputEmail);
  }
}

function handleLoginFeedbackMsg(inputEmail) {
  if (userExist(inputEmail)) {
    SetLoginFeedbackMsg("User already exists!", 3000);
  } else if (!passwordMatch()) {
    SetLoginFeedbackMsg("Ups! your password don’t match", 3000);
  }
}

function SetLoginFeedbackMsg(errMsg, duration) {
  let feedbackField = document.getElementById("id-input-feedback");
  feedbackField.innerHTML = setLoginFeedbackMsgHtml(errMsg);

  setTimeout(() => {
    removeFeddbackMsg(feedbackField);
  }, duration);
}

function setLoginFeedbackMsgHtml(errMsg) {
  return /*html*/ `
${errMsg}
`;
}

function removeFeddbackMsg(divId) {
  divId.innerHTML = "";
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

function passwordMatch() {
  let password = document.getElementById("password").value;
  let passwordConfirm = document.getElementById("password-confirm").value;
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

function setPwdInputEventListeners() {
  document.addEventListener("click", function (event) {
    inputClicked(event.target.id);
  });
}

function inputClicked(id) {
  if (id == "password" || id == "password-confirm") {
    document.getElementById(id + "-img").src = "../img/visibility_off.png";
  } else {
    document.getElementById("password-confirm-img").src = "../img/lock.svg";
    document.getElementById("password-img").src = "../img/lock.svg";
  }
}

function togglePswVisibility(id) {
  let img = document.getElementById(id);
  console.log(img.src);
  if (img.src == "../img/lock.svg") {
  }
}
