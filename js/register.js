/**
 * State indicating whether the checkbox is checked.
 */
let checkBoxState = false;

/**
 * State indicating whether the passwords are visible (true) or hidden (false).
 * This is for multiple password fields.
 */
let pswVisibility = [false, false];
/**
 * Initializes the registration process by loading users and setting up password input event listeners.
 */
async function initRegister() {
  await loadUsers();
  setPwdInputEventListeners();
  handleInputOnFocusChangeParentElementBorderColor();
  includeHTML();
}

/**
 * Registers a new user if the email doesn't already exist, the passwords match, and
 * the checkbox is checked. Displays appropriate feedback messages otherwise.
 */
async function register() {
  const inputEmail = email.value;
  if (!userExist(inputEmail) && passwordMatch() && checkBoxState) {
    handleMsgBox();
    setTimeout(() => {
      registerNewUser();
    }, 1000);
  } else {
    handleLoginFeedbackMsg(inputEmail);
  }
}

/**
 * Displays feedback messages based on the registration validation.
 *
 * @param {string} inputEmail - The email entered by the user.
 */
function handleLoginFeedbackMsg(inputEmail) {
  if (userExist(inputEmail)) {
    SetLoginFeedbackMsg("User already exists!", 3000);
  } else if (!passwordMatch()) {
    SetLoginFeedbackMsg("Oops! Your passwords don't match.", 3000);
  } else if (!checkBoxState) {
    SetLoginFeedbackMsg("Please accept the policy.", 3000);
  }
}

/**
 * Sets a feedback message with a specified duration in a designated field.
 *
 * @param {string} errMsg - The feedback message to display.
 * @param {number} duration - The time in milliseconds to display the message.
 */
function SetLoginFeedbackMsg(errMsg, duration) {
  const feedbackField = document.getElementById("id-input-feedback");
  feedbackField.innerHTML = setLoginFeedbackMsgHtml(errMsg);

  setTimeout(() => {
    removeFeddbackMsg(feedbackField);
  }, duration);
}

/**
 * Returns the HTML content for the login feedback message.
 *
 * @param {string} errMsg - The feedback message.
 * @returns {string} The HTML content for the feedback message.
 */
function setLoginFeedbackMsgHtml(errMsg) {
  return `${errMsg}`;
}

/**
 * Clears the feedback message from the specified field.
 *
 * @param {HTMLElement} divId - The field from which the feedback message will be removed.
 */
function removeFeddbackMsg(divId) {
  divId.innerHTML = "";
}

/**
 * Registers a new user, adds them to the user list, and redirects to the main page.
 */
async function registerNewUser() {
  const registerBtn = document.getElementById("registerBtn");
  registerBtn.disabled = true;
  registerBtn.style.backgroundColor = "lightgrey";
  let name = document.getElementById("names").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password0").value;
  let newUser = { name, email, password };
  users.push(newUser);
  await setItem("users", users);
  resetForm();
  window.location.href = "/index.html?msg=You Signed Up successfully";
}

/**
 * Resets the form fields used for user registration.
 */
function resetForm() {
  const registerBtn = document.getElementById("registerBtn");
  names.value = "";
  email.value = "";
  password0.value = "";
  password1.value = "";
}

/**
 * Checks if a user with the given email already exists in the system.
 *
 * @param {string} user - The email of the user to check.
 * @returns {boolean} True if the user exists, false otherwise.
 */
function userExist(user) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === user) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if the entered passwords match.
 *
 * @returns {boolean} True if the passwords match, false otherwise.
 */
function passwordMatch() {
  const password = document.getElementById("password0").value;
  const passwordConfirm = document.getElementById("password1").value;
  return password === passwordConfirm;
}

/**
 * Toggles the checkbox state and updates the checkbox image accordingly.
 */
function toggleCheckbox() {
  const checkBox = document.getElementById("id-checkbox-sign-up");
  if (checkBoxState === false) {
    checkBoxState = true;
    checkBox.src = "/img/box-checked.png";
  } else {
    checkBoxState = false;
    checkBox.src = "/img/box-unchecked.png";
  }
}

/**
 * Sets up event listeners for password input to handle clicks for visibility toggles.
 */
function setPwdInputEventListeners() {
  document.addEventListener("click", function (event) {
    inputClicked(event.target.id);
  });
}

/**
 * Handles clicks to toggle password visibility or hide the password input.
 *
 * @param {string} id - The ID of the clicked element.
 */
function inputClicked(id) {
  if (id !== "password0-img" && id !== "password1-img") {
    if (id === "password0" || id === "password1") {
      const index = id === "password0" ? 0 : 1;
      const visibilityState = pswVisibility[index];
      document.getElementById(id + "-img").src = visibilityState
        ? "/img/visibility.png"
        : "/img/visibility_off.png";
    } else {
      hidePasswordInput();
    }
  }
}

/**
 * Hides the password input by changing the type to 'password' and updating the
 * corresponding images.
 */
function hidePasswordInput() {
  document.getElementById("password0-img").src = "/img/lock.svg";
  document.getElementById("password1-img").src = "/img/lock.svg";
  document.getElementById("password0").type = "password";
  document.getElementById("password1").type = "password";
  pswVisibility = [false, false];
}

/**
 * Toggles the visibility of a password field.
 *
 * @param {string} id - The ID of the image representing password visibility.
 */
function togglePswVisibility(id) {
  const img = document.getElementById(id);
  const index = id === "password0-img" ? 0 : 1;
  const visibilityState = pswVisibility[index];

  img.src = visibilityState ? "/img/visibility_off.png" : "/img/visibility.png";
  document.getElementById("password" + index).type = visibilityState ? "password" : "text";

  pswVisibility[index] = !visibilityState;
}

/**
 * Shows a message box with a shadow layer, usually indicating successful registration.
 */
function handleMsgBox() {
  const shadowLayer = document.getElementById("id-shadow-layer");
  shadowLayer.classList.remove("visibility-hidden");
  handleMsgBoxMovement();
}

/**
 * Adds the 'show' class to the message box to animate it.
 */
function handleMsgBoxMovement() {
  const msgBox = document.getElementById("id-msg-box");
  msgBox.classList.add("show");
}
