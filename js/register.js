let users = [];
let checkBoxState = false;
let pswVisibility = [false, false];
async function initRegister() {
  await loadUsers();
  setPwdInputEventListeners();
}

async function register() {
  let inputEmail = email.value;
  if (!userExist(inputEmail) && passwordMatch() && checkBoxState) {
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
  } else if (!checkBoxState) {
    SetLoginFeedbackMsg("please accept the policy", 3000);
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
  registerBtn.style.backgroundColor = "lightgrey";
  users.push({
    name: names.value,
    email: email.value,
    password: password0.value,
  });
  await setItem("users", JSON.stringify(users));
  resetForm();
  window.location.href = "../index.html?msg=You Signed Up successfully";
}

function resetForm() {
  const registerBtn = document.getElementById("registerBtn");
  names.value = "";
  email.value = "";
  password0.value = "";
  password1.value = "";
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
  let password = document.getElementById("password0").value;
  let passwordConfirm = document.getElementById("password1").value;
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
  if (id != "password0-img" && id != "password1-img") {
    if (id == "password0" || id == "password1") {
      let index = id === "password0" ? 0 : 1;
      if (pswVisibility[index] == false) {
        document.getElementById(id + "-img").src = "../img/visibility_off.png";
      } else {
        document.getElementById(id + "-img").src = "../img/visibility.png";
      }
    } else {
      hidePasswordInput();
    }
  }
}

function hidePasswordInput() {
  document.getElementById("password0-img").src = "../img/lock.svg";
  document.getElementById("password1-img").src = "../img/lock.svg";
  document.getElementById("password0").type = "password";
  document.getElementById("password1").type = "password";
  pswVisibility = [false, false];
}

function togglePswVisibility(id) {
  let img = document.getElementById(id);
  let index = id === "password0-img" ? 0 : 1;
  if (pswVisibility[index] === false) {
    img.src = "../img/visibility.png";
    pswVisibility[index] = true;
    document.getElementById("password" + index).type = "text";
  } else {
    img.src = "../img/visibility_off.png";
    pswVisibility[index] = false;
    document.getElementById("password" + index).type = "password";
  }
}
