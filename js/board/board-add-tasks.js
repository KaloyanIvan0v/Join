let checkWhichTaskOverlay = []

/**
 * Opens the 'Add Task' template popup, initializes priority selection, sets current date, and adds an exit cross.
 *
 * @param {string} statement - The initial statement to be prefilled in the task form.
 */
function openAddTaskTemplate(statement) {
  checkWhichTaskOverlay = 'addTaskTemplate'
  openPopUp()
  renderAddTaskTemplate(statement)
  selectPriority()
  currentDate()
  renderExitCross('id-headline-area')
  changePrio(1)
  handleExitImg()
}

/**
 * Adds the 'Add Task' form template to the pop-up element.
 *
 * @param {string} statement - The statement that should be pre-filled in the task form.
 */
function renderAddTaskTemplate(statement) {
  let popUpElement = document.getElementById('id-pop-up')
  popUpElement.innerHTML += returnHtmlTaskTemplate(
    'createTaskAtBoard',
    'closeTaskFormTemplate',
    'cancel',
    statement
  )
}

/**
 * Adds a new task to the board after validating that a category is selected.
 * Updates session storage and renders the updated tasks.
 *
 * @param {string} statement - The statement of the task that will be added.
 * @returns {Promise<void>}
 */
async function createTaskAtBoard(statement) {
  arrowToggleCheck ? (arrowToggleCheck = false) : arrowToggleCheck
  if (categorySelected()) {
    addTask()
    setStatement(statement)
    await setSessionStorage('tasks', tasks)
    resetInputFields()
    closePopUp()
    tasks = JSON.parse(sessionStorage.getItem('tasks'))
    renderTasks(getFilteredTasks())
  } else {
    setErrorBorderColor('containerCategory', 2000)
  }
}

/**
 * Updates the statement of the most recently added task if the provided statement is not undefined.
 *
 * @param {string} statement - The statement to be set for the most recently added task.
 */
function setStatement(statement) {
  if (statement != 'undefined') {
    tasks[tasks.length - 1].statement = statement
    setItem('tasks', tasks)
  }
}

/**
 * Checks if a category has been selected from the dropdown.
 *
 * @returns {boolean} - True if a category is selected, false otherwise.
 */
function categorySelected() {
  let inputCategory = document.getElementById('categoryDropdown')
  let categoryValue = inputCategory.textContent
  return categoryValue !== 'Select task category'
}

/**
 * Renders an exit cross in the specified element.
 *
 * @param {string} elementId - The ID of the element where the exit cross will be added.
 */
function renderExitCross(elementId) {
  let div = document.getElementById(elementId)
  div.innerHTML += returnExitCrossHtml()
}

/**
 * Closes the 'Add Task' pop-up after resetting the input fields.
 */
function closeAddTaskPopUp() {
  resetInputFields()
  setTimeout(closePopUp, 20)
  arrowToggleCheck = false
}

/**
 * Handles the closure of the task form template, preventing the default event and clearing any checked contacts.
 *
 * @param {Event} event - The event triggered by the form submission or closure.
 */
function closeTaskFormTemplate(event) {
  if (event) {
    event.preventDefault()
  }
  clearContactsChecked()
  closePopUp()
}

/**
 * Sets the error border color for an element for a specified time period.
 * @param {string} elementId - The ID of the element.
 * @param {number} timePeriod - The time period in milliseconds.
 */
function setErrorBorderColor(elementId, timePeriod) {
  const div = document.getElementById(elementId)
  div.style.borderColor = 'red'
  setTimeout(() => {
    div.style.borderColor = 'grey'
  }, timePeriod)
}

/**
 * Closes the currently open pop-up window based on the value of `checkWhichTaskOverlay`.
 *
 * This function checks the value of the global variable `checkWhichTaskOverlay` and
 * closes the corresponding pop-up window. Possible values for `checkWhichTaskOverlay` are:
 * - 'addTaskTemplate': Closes the "Add Task" pop-up.
 * - 'openTaskDetailView': Closes the task detail view pop-up.
 * - Any other value: Closes the "Edit Task" pop-up.
 *
 * After closing the appropriate pop-up, the function resets `checkWhichTaskOverlay` to an empty array.
 */
function closePopUpBoard() {
  if (checkWhichTaskOverlay == 'addTaskTemplate') {
    closeAddTaskPopUp()
  } else if (checkWhichTaskOverlay == 'openTaskDetailView') {
    closePopUp()
  } else {
    closeEditTaskPopUp()
  }
  checkWhichTaskOverlay = []
}
