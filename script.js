/**
 * Color map for contacts with predefined RGB values.
 * @type {Object<number, string>}
 */
const contactColor = {
  1: 'rgb(255, 187, 44)',
  2: 'rgb(255, 70, 70)',
  3: 'rgb(255, 230, 44)',
  4: 'rgb(195, 255, 43)',
  5: 'rgb(0, 56, 255)',
  6: 'rgb(255, 199, 3)',
  7: 'rgb(252, 113, 255)',
  8: 'rgb(255, 163, 94)',
  9: 'rgb(32, 215, 194)',
  10: 'rgb(6, 190, 232)',
  11: 'rgb(147, 39, 255)',
  12: 'rgb(110, 82, 255)',
  13: 'rgb(255, 94, 179)',
  14: 'rgb(255, 122, 1)',
}

/** @type {Array<Object>} */
let tasks = []
/** @type {Array<Object>} */
let contacts = []
/** @type {Array<Object>} */
let users = []
/** @type {Object|null} */
let geLoggedInUser = null

addResizeListener()

/**
 * Sets the currently logged-in user in local storage.
 * @param {Object} user - The user object to be stored.
 */
function setLoggedInUser(user) {
  saveToLocalStorage('loggedInUser', user)
}

/**
 * Retrieves the currently logged-in user from local storage.
 * @returns {Object|null} The user object or null if not found.
 */
function getLoggedInUser() {
  return getFromLocalStorage('loggedInUser')
}

/**
 * Saves a value to local storage with the specified key.
 * @param {string} key - The key under which the value should be saved.
 * @param {Object} value - The value to be saved.
 */
function saveToLocalStorage(key, value) {
  value = JSON.stringify(value)
  localStorage.setItem(key, value)
}

/**
 * Retrieves a value from local storage with the specified key.
 * @param {string} key - The key of the value to be retrieved.
 * @returns {Object|null} The parsed value from storage or null if not found.
 */
function getFromLocalStorage(key) {
  const value = localStorage.getItem(key)
  const valueAsJSON = JSON.parse(value)
  return valueAsJSON || null
}

/**
 * Loads user data from an external source and stores it in the `users` array.
 */
async function loadUsers() {
  try {
    users = await getItem('users')
  } catch (e) {
    console.error('Loading error:', e)
  }
}

/**
 * Loads contact data from an external source and stores it in the `contacts` array.
 */
async function loadContacts() {
  try {
    contacts = await getItem('contacts')
  } catch (e) {
    console.error('Loading error:', e)
  }
}

/**
 * Loads task data from an external source and stores it in the `tasks` array.
 */
async function loadTasks() {
  try {
    tasks = await getItem('/tasks')
    //tasks = JSON.parse(tasks)
  } catch (e) {
    console.error('no tasks exist', e)
  }
}

/**
 * Sets a value in session storage.
 * @param {string} key - The key under which to store the value.
 * @param {Object} value - The value to store.
 */
async function setSessionStorage(key, value) {
  try {
    const serializedValue = JSON.stringify(value)
    sessionStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error('Session Storage error:', error)
  }
}

/**
 * Retrieves a value from session storage by its key.
 * @param {string} key - The key of the value to be retrieved.
 * @returns {Object|null} The parsed value from session storage or null if not found.
 */
function getFromSessionStorage(key) {
  try {
    const serializedValue = sessionStorage.getItem(key)
    if (serializedValue === null) {
      return null
    }
    return JSON.parse(serializedValue)
  } catch (error) {
    console.error('Session Storage retrieval error:', error)
    return null
  }
}

/**
 * Changes the parent element's border color when an input gains or loses focus.
 */
function handleInputOnFocusChangeParentElementBorderColor() {
  const inputs = document.querySelectorAll('input')
  inputs.forEach(function (input) {
    input.addEventListener('focus', function () {
      input.parentElement.style.borderColor = 'var(--accent-color)'
    })
    input.addEventListener('blur', function () {
      input.parentElement.style.borderColor = 'rgba(0, 0, 0, 0.1)'
    })
  })
}

/**
 * Handles changing the background image of an element on hover.
 * @param {string} hoverClassName - The class name of elements that will trigger the change.
 * @param {string} elementsToChangeClassName - The class name of elements that will have their image changed.
 * @param {string} imgUrl - The URL of the original background image.
 * @param {string} imgUrlHover - The URL of the hover background image.
 */
function handleHoverButtonChangeImg(
  hoverClassName,
  elementsToChangeClassName,
  imgUrl,
  imgUrlHover
) {
  const hoverElements = document.querySelectorAll(hoverClassName)
  const elementsToChange = document.querySelectorAll(elementsToChangeClassName)

  hoverElements.forEach(function (hoverElement, index) {
    hoverElement.addEventListener('mouseover', function () {
      elementsToChange[index].style.backgroundImage = imgUrlHover
    })
    hoverElement.addEventListener('mouseout', function () {
      elementsToChange[index].style.backgroundImage = imgUrl
    })
  })
}

/**
 * Finds the index of an object within an array by its ID property.
 * @param {number|string} id - The ID to search for.
 * @param {Array<Object>} list - The array in which to search.
 * @returns {number} The index of the found element, or `0` if not found.
 */
function getIndexOfElementById(id, list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i]['id'] == id) {
      return i
    }
  }
  return 0
}

/**
 * Increases the ID by one from the maximum value found in the array.
 * @param {Array<Object>} array - The array from which to find the maximum ID.
 * @returns {number} The next incremented ID or `0` if the array is empty.
 */
function increaseId(array) {
  if (array.length === 0) {
    return 0
  } else {
    const ids = array.map((item) => item.id)
    return Math.max(...ids) + 1
  }
}

/**
 * Clears the content of an HTML element identified by either its ID or name.
 * @param {string|HTMLElement} elementIdOrName - The ID, name, or HTMLElement object to be cleared.
 */
function clearElement(elementIdOrName) {
  if (typeof elementIdOrName === 'string') {
    document.getElementById(elementIdOrName).innerHTML = ''
  } else {
    elementIdOrName.innerHTML = ''
  }
}

/**
 * Adds a CSS class to an HTML element identified by its ID.
 * @param {string} targetElementId - The ID of the target element.
 * @param {string} className - The class name to be added.
 */
function addClassListTo(targetElementId, className) {
  document.getElementById(targetElementId).classList.add(className)
}

/**
 * Removes a CSS class from an HTML element identified by its ID.
 * @param {string} targetElementId - The ID of the target element.
 * @param {string} className - The class name to be removed.
 */
function removeClassListTo(targetElementId, className) {
  document.getElementById(targetElementId).classList.remove(className)
}

function handleExitImg() {
  setTimeout(function () {
    handleHoverButtonChangeImg(
      '.cancel-add-task',
      '.clear-icon',
      "url('/img/close-dark.svg')",
      "url('/img/close-blue.png')"
    )
  }, 200)
}

/**
 * check if a User logged In or not at set to sessionstorage.
 */
function chechIfLoggedIn() {
  let IfUser = sessionStorage.getItem('LoggedIn')
  if (IfUser == 'false') {
    document.getElementById('menu').classList.replace('menu', 'dNone')
  }
}

/**
 * Prevents the closing of a pop-up by stopping the event from propagating.
 *
 * This function should be used as an event handler to stop the propagation
 * of an event, ensuring that the pop-up does not close when the event is triggered.
 *
 * @param {Event} event - The event object representing the event that was triggered.
 */
function doNotClosePopUp(event) {
  event.stopPropagation()
}

/**
 * Checks if the current device is a mobile device.
 * @returns {boolean} True if the device is a mobile device, otherwise false.
 */
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)
}

function handleLandscapeWarning() {
  if (isMobileDevice()) {
    document.getElementById('warn-landscape').classList.remove('visibility-hidden')
  } else {
    document.getElementById('warn-landscape').classList.add('visibility-hidden')
  }
}

/**
 * Handles the display of mobile task menus based on the device type.
 */
function handleMobileTaskMenu() {
  const elements = document.getElementsByClassName('mobile-task-menu')
  if (isMobileDevice()) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = 'block'
    }
  } else {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = 'none'
    }
  }
}

/**
 * Handles the resize event to show or hide the mobile task menu.
 */
function onResize() {
  handleMobileTaskMenu()
}

/**
 * Adds an event listener for the window resize event.
 */
function addResizeListener() {
  window.addEventListener('resize', onResize)
}
