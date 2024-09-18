let checkBoxState = false

/**
 * Initializes the login process by setting the start screen image, loading user data,
 * and configuring various event listeners. It also starts a timeout to initiate the start screen
 * animation and sets session storage data.
 */
async function initLogin() {
  setStartScreenImgAndBackgroundColor()
  await loadUsers()
  await loadContacts()
  await loadTasks()
  setPwdInputEventListeners()
  setTimeout(() => {
    startScreen()
  }, 375)
  setSessionStorage('contacts', contacts)
  setSessionStorage('tasks', tasks)
  sessionStorage.setItem('activeSite', 'summery')
  setStatusNotLogInToSessionstorage()
  LoadLoginFromLocalStorage()
  handleInputOnFocusChangeParentElementBorderColor()
  includeHTML()
}

/**
 * Starts the screen animation by adding the 'move' class to the moving image
 * and hiding the opacity layer.
 */
function startScreen() {
  document.querySelector('.moving-img').classList.add('move')
  document.querySelector('.opacity-layer').classList.add('hidden')
}

/**
 * Configures the start screen image and background color depending on the
 * window's width.
 */
function setStartScreenImgAndBackgroundColor() {
  if (window.innerWidth <= 860) {
    document.getElementById('id-logo-img').src = '../img/logo-light.svg'
    document.getElementById('id-opacity-layer').style.backgroundColor = `var(--primary-color)`
    setTimeout(() => {
      document.getElementById('id-logo-img').src = '../img/logo-dark.svg'
    }, 1200)
  }
}

/**
 * Handles the login process by checking if the user exists and the provided password
 * is correct. If the login is successful, redirects to the summary page. Otherwise,
 * displays appropriate feedback messages.
 */
function login() {
  if (checkBoxState == true) {
    saveLoginToLocalStorage()
  }
  const user = email.value
  if (userExist(user) && passwordIsCorrect(user)) {
    setSessionStorage('loggedInUser', users[getUserIndex(user)])
    resetForm()
    window.location.href = '../html/summery.html'
  } else {
    if (!userExist(user)) {
      SetLoginFeedbackMsg('User does not exist!', 3000)
    } else if (!passwordIsCorrect(user)) {
      SetLoginFeedbackMsg('Password is incorrect!', 3000)
    }
  }
  sessionStorage.setItem('LoggedIn', 'true')
}

/**
 * Displays a feedback message for a specified duration.
 *
 * @param {string} errMsg - The feedback message to display.
 * @param {number} duration - The duration in milliseconds to display the message.
 */
function SetLoginFeedbackMsg(errMsg, duration) {
  const feedbackField = document.getElementById('id-input-feedback')
  feedbackField.innerHTML = setLoginFeedbackMsgHtml(errMsg)

  setTimeout(() => {
    removeFeedbackMsg(feedbackField)
  }, duration)
}

/**
 * Generates the HTML for the login feedback message.
 *
 * @param {string} errMsg - The feedback message.
 * @returns {string} The HTML for the feedback message.
 */
function setLoginFeedbackMsgHtml(errMsg) {
  return `${errMsg}`
}

/**
 * Clears the feedback message from the given element.
 *
 * @param {HTMLElement} divId - The HTML element to clear.
 */
function removeFeedbackMsg(divId) {
  divId.innerHTML = ''
}

/**
 * Checks whether a user exists based on their email.
 *
 * @param {string} user - The email of the user to check.
 * @returns {boolean} True if the user exists, false otherwise.
 */
function userExist(user) {
  for (let i = 0; i < users.length; i++) {
    if (user === users[i].email) {
      return true
    }
  }
  return false
}

/**
 * Checks whether the provided password is correct for a given user.
 *
 * @param {string} user - The email of the user.
 * @returns {boolean} True if the password is correct, false otherwise.
 */
function passwordIsCorrect(user) {
  const userPsw = users[getUserIndex(user)].password
  const inputPsw = document.getElementById('password0').value
  return userPsw === inputPsw
}

/**
 * Gets the index of a user in the users array based on their email.
 *
 * @param {string} user - The email of the user.
 * @returns {number} The index of the user in the users array.
 */
function getUserIndex(user) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === user) {
      return i
    }
  }
  return -1 // User not found
}

/**
 * Logs in as a guest user and redirects to the summary page.
 */
function guestLogIn() {
  loggedInUser = { name: 'Guest', email: 'guest@info.com', password: 'guest' }
  window.location.href = '../html/summery.html'
  sessionStorage.setItem('LoggedIn', 'true')
}

/**
 * Resets the login form inputs and disables the login button.
 */
function resetForm() {
  const loginBtn = document.getElementById('loginBtn')
  email.value = ''
  password0.value = ''
  loginBtn.disabled = true
}

/**
 * Toggles the state of a checkbox and updates its visual representation.
 */
function toggleCheckbox() {
  const checkBox = document.getElementById('id-checkbox-log-in')
  if (checkBoxState === false) {
    checkBoxState = true
    checkBox.src = '../img/box-checked.png'
  } else {
    checkBoxState = false
    checkBox.src = '../img/box-unchecked.png'
    clearUserDataFromLocalStorage()
  }
}

/**
 * Sets up event listeners for password input interactions.
 */
function setPwdInputEventListeners() {
  document.addEventListener('click', function (event) {
    inputClicked(event.target.id)
  })
}

/**
 * Handles input click events to configure password visibility.
 *
 * @param {string} id - The ID of the clicked element.
 */
function inputClicked(id) {
  configPwdVisibility(id)
}

/**
 * Configures password visibility based on the clicked element ID.
 *
 * @param {string} id - The ID of the clicked element.
 */
function configPwdVisibility(id) {
  if (id !== 'password0-img') {
    if (id === 'password0') {
      if (pswVisibility === false) {
        document.getElementById(id + '-img').src = '../img/visibility_off.png'
      } else {
        document.getElementById(id + '-img').src = '../img/visibility.png'
      }
    } else {
      hidePasswordInput()
    }
  }
}

/**
 * Hides the password input and changes its visual representation.
 */
function hidePasswordInput() {
  document.getElementById('password0-img').src = '../img/lock.svg'
  document.getElementById('password0').type = 'password'
  pswVisibility = false
}

/**
 * Toggles the visibility of the password field.
 *
 * @param {string} id - The ID of the image element representing password visibility.
 */
function togglePswVisibility(id) {
  const img = document.getElementById(id)
  if (pswVisibility === false) {
    img.src = '../img/visibility.png'
    pswVisibility = true
    document.getElementById('password0').type = 'text'
  } else {
    img.src = '../img/visibility_off.png'
    pswVisibility = false
    document.getElementById('password0').type = 'password'
  }
}

function saveLoginToLocalStorage() {
  let email = document.getElementById('email').value
  let password = document.getElementById('password0').value
  localStorage.setItem('rememberMeE-mail', email)
  localStorage.setItem('rememberMePW', password)
}

function LoadLoginFromLocalStorage() {
  let email = localStorage.getItem('rememberMeE-mail')
  let password = localStorage.getItem('rememberMePW')
  if (email) {
    toggleCheckbox()
    document.getElementById('email').value = email
    document.getElementById('password0').value = password
  }
}

function clearUserDataFromLocalStorage() {
  localStorage.removeItem('rememberMeE-mail')
  localStorage.removeItem('rememberMePW')
}

function setStatusNotLogInToSessionstorage() {
  sessionStorage.setItem('LoggedIn', 'false')
}
