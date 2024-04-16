let usersInit = [];
let contactsInit = [];
let tasksInit = [];
let loggedInUser;
let pswVisibility = false;
let checkBoxState = false;

async function initLogin() {
  await loadUsers();
  await loadContacts();
  await loadTasks();
  setPwdInputEventListeners();
  setTimeout(() => {
    startScreen();
  }, 375);
  handleMsgBox();
  setSesionStorage("contacts", contactsInit);
  setSesionStorage("tasks", tasksInit);
  setSesionStorage("logedInUser", loggedInUser);
}

function startScreen() {
  document.querySelector(".moving-img").classList.add("move");
  document.querySelector(".opacity-layer").classList.add("hidden");
}

function login() {
  let user = email.value;
  if (userExist(user) && passwordIsCorrect(user)) {
    setSesionStorage("loggedInUser", usersInit[getUserIndex(user)]);
    resetForm();
    window.location.href = "../html/summery.html";
  } else {
    if (!userExist(user)) {
      SetLoginFeedbackMsg("user does not exist!", 3000);
    } else if (!passwordIsCorrect(user)) {
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
  for (let i = 0; i < usersInit.length; i++) {
    if (user == usersInit[i].email) {
      return true;
    }
  }
  return false;
}

function passwordIsCorrect(user) {
  let userPsw = usersInit[getUserIndex(user)].password;
  let inputPsw = document.getElementById("password0").value;
  if (userPsw == inputPsw) {
    return true;
  } else {
    return false;
  }
}

function getUserIndex(user) {
  for (let i = 0; i < usersInit.length; i++) {
    if (usersInit[i].email == user) {
      return i;
    } else {
    }
  }
}

function guestLogIn() {
  loggedInUser = { name: "Guest", email: "guest@info.com", password: "guest" };
  window.location.href = "../html/summery.html";
}

function resetForm() {
  const loginBtn = document.getElementById("loginBtn");
  email.value = "";
  password0.value = "";
  loginBtn.disabled = true;
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
  confingPwdVisibility(id);
}

function confingPwdVisibility(id) {
  if (id != "password0-img") {
    if (id == "password0") {
      if (pswVisibility == false) {
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
  document.getElementById("password0").type = "password";
  pswVisibility = false;
}

function togglePswVisibility(id) {
  let img = document.getElementById(id);
  if (pswVisibility == false) {
    img.src = "../img/visibility.png";
    pswVisibility = true;
    document.getElementById("password0").type = "text";
  } else {
    img.src = "../img/visibility_off.png";
    pswVisibility = false;
    document.getElementById("password0").type = "password";
  }
}

function handleMsgBox() {
  let msgBox = document.getElementById("id-msg-box");
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get("msg");
  if (msg) {
    msgBox.innerHTML = msg;
    handleMsgBoxMovement(3000, msgBox);
  } else {
  }
}

function handleMsgBoxMovement(duration) {
  let msgBox = document.getElementById("id-msg-box");
  msgBox.classList.add("msg-show");
  setTimeout(() => {
    msgBox.classList.remove("msg-show");
  }, duration);
}
