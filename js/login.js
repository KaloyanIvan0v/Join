let users = [];
pswVisibility = false;
checkBoxState = false;
async function initLogin() {
  await loadUsers();
  setPwdInputEventListeners();
}

function login() {
  let user = email.value;
  if (userExist(user) && passwordIsIncorrect(user) && checkBoxState == true) {
    window.location.href = "../html/summery.html";
  } else {
    if (!userExist(user)) {
      SetLoginFeedbackMsg("user does not exist!", 3000);
    } else if (!passwordIsIncorrect(user)) {
      SetLoginFeedbackMsg("password is incorrect!", 3000);
    } else {
    }
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

function userExist(user) {
  for (let i = 0; i < users.length; i++) {
    if (user == users[i].email) {
      return true;
    }
  }
  return false;
}

function passwordIsIncorrect(user) {
  let userPsw = users[getUserIndex(user)].password;
  let inputPsw = document.getElementById("password0").value;
  if (userPsw == inputPsw) {
    return true;
  } else {
    return false;
  }
}

function getUserIndex(user) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == user) {
      return i;
    } else {
    }
  }
}

function guestLogIn() {
  console.log("guest login");
}

function resetForm() {
  const registerBtn = document.getElementById("registerBtn");
  email.value = "";
  password.value = "";
  document.getElementById("password-confirm").value = "";
  registerBtn.disabled = true;
}

function toggleCheckbox() {
  let checkBox = document.getElementById("id-checkbox-log-in");
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
  if (id != "password0-img") {
    if (id == "password0") {
      if (pswVisibility == false) {
        document.getElementById(id + "-img").src = "../img/visibility_off.png";
      } else {
        document.getElementById(id + "-img").src = "../img/visibility.png";
      }
    } else {
      document.getElementById("password0-img").src = "../img/lock.svg";
      document.getElementById("password0").type = "password";
      pswVisibility = false;
    }
  }
}

function togglePswVisibility(id) {
  let img = document.getElementById(id);
  if (pswVisibility == false) {
    img.src = "../img/visibility.png";
    pswVisibility = true;
    document.getElementById("password0").type = "text"; // Changed the id construction
  } else {
    img.src = "../img/visibility_off.png";
    pswVisibility = false;
    document.getElementById("password0").type = "password"; // Changed the id construction
  }
}
