/**
 * Opens the task detail view in a popup and initializes various UI elements related to the task.
 *
 * @param {number} i - Index of the task in the filtered tasks list.
 * @param {string} id - Unique identifier of the task to be displayed.
 */
function openTaskDetailView(i, id) {
  checkWhichTaskOverlay = 'openTaskDetailView'
  openPopUp()
  let popUpDiv = document.getElementById('id-pop-up')
  popUpDiv.innerHTML = openTaskDetailViewHtml(tasks[getIndexOfElementById(id, tasks)], i, id)
  setCategoryColor(i, getFilteredTasks(), id)
  setPriorityTaskCard(i, id)
  renderContactsBoardInitials(true, id, `contactsFieldBoard(${id})`)
  handleHoverButtonDeleteEditTask()
  renderTaskAssignedNames(id)
  renderSubTasksBoard(i, id)
}

/**
 * Renders the full names of contacts associated with a particular task.
 * Only displays names if the background dialog is currently visible.
 *
 * @param {number} i - Index of the current task.
 * @param {Array} contactsForTask - List of contact names to be displayed.
 */
function renderFullName(i, contactsForTask) {
  let backgroundDialog = document.getElementById('backgroundDialog')
  if (backgroundDialog.classList.contains('background-dialog')) {
    let contactsFieldBoard = document.getElementById(`contactsFieldBoardFullName(${i})`)
    contactsFieldBoard.innerHTML = ''
    for (let j = 0; j < contactsForTask.length; j++) {
      let fullName = contactsForTask[j]
      contactsFieldBoard.innerHTML += returnHtmlContactsFullName(fullName)
    }
  }
}

/**
 * Toggles the checkbox status of a subtask and updates the task list accordingly.
 * Re-renders the subtasks of the current task to reflect changes.
 *
 * @param {number} i - Index of the parent task in the task list.
 * @param {string} subTaskId - Unique identifier of the subtask.
 * @param {string} id - Unique identifier of the parent task.
 */
function toggleCheckboxSubTask(i, subTaskId, id) {
  if (getSubtaskStatus(i, subTaskId)) {
    tasks[i].subTasks[getIndexOfElementById(subTaskId, tasks[i].subTasks)].status = false
  } else {
    tasks[i].subTasks[getIndexOfElementById(subTaskId, tasks[i].subTasks)].status = true
  }
  renderSubTasksBoard(i, id)
  setItem('tasks', tasks)
}

/**
 * Retrieves the status of a specific subtask.
 *
 * @param {number} i - Index of the parent task.
 * @param {string} subTaskId - Unique identifier of the subtask.
 * @returns {boolean} - The status of the specified subtask (true if completed, false otherwise).
 */
function getSubtaskStatus(i, subTaskId) {
  let subTaskStatus = tasks[i].subTasks[getIndexOfElementById(subTaskId, tasks[i].subTasks)].status
  return subTaskStatus
}

/**
 * Deletes a task from the task list by its unique identifier, updates session storage,
 * and re-renders the task board to reflect the deletion.
 *
 * @param {string} taskId - Unique identifier of the task to be deleted.
 */
function deleteTask(taskId) {
  tasks.splice(getIndexOfElementById(taskId, tasks), 1)
  closePopUp()
  setSessionStorage('tasks', tasks)
  renderTasks(getFilteredTasks())
  ifLastItem(tasks)
  setItem('tasks', tasks)
}

/**
 * Sets the category color for a task based on its category.
 * @param {number} i - The index of the task.
 * @param {Object[]} list - The list of tasks.
 */
function setCategoryColor(i, list) {
  let statementField = document.getElementById(`statementField${i}`)
  let singleTaskStatement = list[i]['category']
  if (singleTaskStatement == 'Technical Task') {
    statementField.classList.add('bg-color-technical-task')
  } else {
    statementField.classList.add('bg-color-user-story')
  }
}
