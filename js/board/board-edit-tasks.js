/**
 * Displays an overlay to edit a task.
 *
 * @param {number} i - Index of the task.
 * @param {string} id - ID of the task.
 */
function editTaskOverlay(i, id) {
  arrowToggleCheck ? (arrowToggleCheck = false) : arrowToggleCheck
  checkWhichTaskOverlay = 'editTaskOverlay'
  const overlayTask = tasks[getIndexOfElementById(id, tasks)]
  const dialogField = document.getElementById('id-pop-up')
  let currentPrio = overlayTask['prio']
  clearElement(dialogField)
  renderEditTaskOverlay(dialogField, i, id, overlayTask)
  prioSelect(id, currentPrio)
  setUsersForEditTask(id)
  renderSubTasksEdit(id)
}

/**
 * Renders the edit task overlay.
 *
 * @param {HTMLElement} targetElement - The HTML element to render the overlay into.
 * @param {number} i - Index of the task.
 * @param {string} id - ID of the task.
 * @param {Object} overlayTask - The task object to be edited.
 */
function renderEditTaskOverlay(targetElement, i, id, overlayTask) {
  targetElement.innerHTML = returnHtmlEditCurrentTask(overlayTask, i, id)
}

/**
 * Renders the subtasks for editing.
 *
 * @param {string} id - ID of the task.
 */
function renderSubTasksEdit(id) {
  let input = document.getElementById('subTasks')
  let subTasks = tasks[getIndexOfElementById(id, tasks)]['subTasks']
  for (let j = 0; j < subTasks.length; j++) {
    renderSubtask(input, subTasks[j])
  }
}

/**
 * Renders a single subtask for editing.
 *
 * @param {HTMLElement} input - The input field to render the subtask into.
 * @param {Object} subTask - The subtask object to be rendered.
 */
function renderSubtask(input, subTask) {
  input.value = subTask.subTask
  let subTaskState = subTask.status
  addNewSubTaskBoard(subTaskState)
  input.value = ''
}

/**
 * Adds a new subtask to the task board.
 *
 * @param {string} subTaskState - The state of the subtask.
 */
function addNewSubTaskBoard(subTaskState) {
  let singleNewTaskValue = document.getElementById('subTasks').value
  if (subTaskLongEnough(singleNewTaskValue)) {
    subTasks.push({
      subTask: singleNewTaskValue,
      status: subTaskState,
      id: increaseId(subTasks),
    })
  }
  removeFocusFrom('subTasks')
  renderSubTasks('newSubtask')
}

/**
 * Removes focus from an element.
 *
 * @param {string} elementId - ID of the element to remove focus from.
 */
function removeFocusFrom(elementId) {
  document.getElementById(elementId).blur()
}

/**
 * Checks if a subtask is long enough.
 *
 * @param {string} element - The subtask text to check.
 * @returns {boolean} - Returns true if the subtask is long enough, false otherwise.
 */
function subTaskLongEnough(element) {
  if (element.length >= 3) {
    return true
  } else {
    return false
  }
}

/**
 * Renders the subtasks board.
 *
 * @param {number} i - The index of the task.
 * @param {string} id - The ID of the parent task.
 * @returns {void}
 */
function renderSubTasksBoard(i, id) {
  const subTasksField = document.getElementById(`subTasksField`)
  const subTasks = tasks[getIndexOfElementById(id, tasks)]['subTasks']
  if (!noSubtasksExist(id)) {
    subTasksField.innerHTML = ''
    subTasks.forEach((subTask, j) => {
      renderSubTask(i, id, subTasksField, subTask, j)
    })
  }
}

/**
 * Renders a subtask.
 *
 * @param {number} i - The index of the task.
 * @param {string} id - The ID of the parent task.
 * @param {HTMLElement} subTasksField - The container for subtasks.
 * @param {Object} subTask - The subtask object.
 * @param {number} j - The index of the subtask.
 * @returns {void}
 */
/**
 * Renders a subtask.
 *
 * @param {number} i - Index of the task.
 * @param {string} id - ID of the task.
 * @param {HTMLElement} subTasksField - The HTML element to render the subtasks into.
 * @param {Object} subTask - The subtask object to render.
 * @param {number} j - Index of the subtask.
 */
function renderSubTask(i, id, subTasksField, subTask, j) {
  const imgSrc = subTask.status ? '/img/box-checked.png' : '/img/check_empty.png'
  subTasksField.innerHTML += returnHtmlSubtasks(subTask.subTask, i, subTask.id, imgSrc, id, j)
}

/**
 * Safely applies changes to tasks.
 *
 * @param {string} id - ID of the task.
 */
function safeTaskChanges(id) {
  safeChangesToTasks(id)
  setSessionStorage('tasks', tasks)
  setItem('tasks', tasks)
  closeEditTaskPopUp()
  subTasks = []
  tasks = JSON.parse(sessionStorage.getItem('tasks'))
  renderTasks(getFilteredTasks())
}

/**
 * Safely applies changes to the specified task.
 *
 * @param {string} id - ID of the task.
 */
function safeChangesToTasks(id) {
  let title = document.getElementById('title').value
  let description = document.getElementById('description').value
  let dueDate = document.getElementById('dueDate').value
  let assignedTo = checkedUsers
  let task = tasks[getIndexOfElementById(id, tasks)]
  task.title = title
  task.description = description
  task.dueDate = dueDate
  task.assignedTo = assignedTo.length == 0 ? -1 : assignedTo
  subTasks.length == 0 ? (task.subTasks = -1) : (task.subTasks = subTasks)
}

/**
 * Closes the edit task popup.
 */
function closeEditTaskPopUp() {
  clearAssignedSection()
  setTimeout(closePopUp, 20)
  arrowToggleCheck = false
  subTasks = []
}

/**
 * Sets users for the edit task.
 *
 * @param {string} taskId - ID of the task.
 */
function setUsersForEditTask(taskId) {
  let assignedToIds = retrieveIdsFromTwoLevelNestedArrayById(taskId, tasks, 'assignedTo')
  showOrHideContacts(event)
  for (let i = 0; i < contacts.length; i++) {
    contactId = contacts[i]['id']
    if (assignedToIds.includes(contactId)) {
      selectedUser(event, contactId)
    }
  }
  showOrHideContacts(event)
}

/**
 * Renders the names of assigned users for the task.
 *
 * @param {string} id - ID of the task.
 */
function renderTaskAssignedNames(id) {
  let nameArea = document.getElementById('contactsFieldBoardFullName')
  let checkedContacts = tasks[getIndexOfElementById(id, tasks)].assignedTo
  for (let i = 0; i < checkedContacts.length; i++) {
    if (contactExists(checkedContacts[i])) {
      let checkedContact = checkedContacts[i].name
      nameArea.innerHTML += returnTaskAssignedContactNameHtml(checkedContact)
    }
  }
}

/**
 * Handles the hover effect for delete and edit task buttons by changing their image.
 */
function handleHoverButtonDeleteEditTask() {
  handleHoverButtonChangeImg(
    '.btn-hover-trash',
    '.img-hover-trash',
    "url('/img/trashbin.png')",
    "url('/img/trash-light-blue.png')"
  )
  handleHoverButtonChangeImg(
    '.btn-hover-edit',
    '.img-hover-edit',
    "url('/img/edit-pencil.png')",
    "url('/img/edit-pencil-light-blue.png')"
  )
}

/**
 * Handles the selection of task priority.
 * @param {string} id - The ID of the task.
 * @param {string} prioSelect - The priority selection.
 */
function prioSelect(id, prioSelect) {
  let urgent = document.getElementById(`Urgent(${id})`)
  let medium = document.getElementById(`Medium(${id})`)
  let low = document.getElementById(`Low(${id})`)
  setPrioSelectDefaultState(urgent, medium, low)
  if (prioSelect == 'Urgent') {
    urgent.src = '/img/urgent_highlight.png'
  } else if (prioSelect == 'Medium') {
    medium.src = '/img/medium_highlight.png'
  } else {
    low.src = '/img/low_highlight.png'
  }
  tasks[getIndexOfElementById(id, tasks)]['prio'] = prioSelect
}

/**
 * Sets the default state of the priority selection buttons.
 * @param {HTMLElement} urgent - The urgent priority button.
 * @param {HTMLElement} medium - The medium priority button.
 * @param {HTMLElement} low - The low priority button.
 */
function setPrioSelectDefaultState(urgent, medium, low) {
  urgent.src = '/img/urgent.png'
  medium.src = '/img/medium.png'
  low.src = '/img/low.png'
}

function ifLastItem(list) {
  if (list.length == 0) {
    list = ' '
  }
}
