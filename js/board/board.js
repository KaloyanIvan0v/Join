/**
 * Initializes the board by loading tasks, contacts, and including HTML.
 * Renders tasks and sets up event listeners.
 * @returns {Promise<void>}
 */
async function init_board() {
  await loadTasks();
  await loadContacts();
  await includeHTML();
  renderTasks(getFilteredTasks());
  setSearchFieldBorderListener();
  filterTaskListener();
}

/**
 * Opens the popup by removing the visibility-hidden class.
 */
function openPopUp() {
  document.getElementById("id-shadow-layer").classList.remove("visibility-hidden");
}

/**
 * Closes the popup, clears its content, and re-renders tasks.
 */
function closePopUp() {
  addClassListTo("id-shadow-layer", "visibility-hidden");
  clearElement("id-pop-up");
  renderTasks(getFilteredTasks());
}

/**
 * Initializes task areas and returns them.
 * @returns {HTMLElement[]} An array of task area elements.
 */
function initTaskAreas() {
  let toDoField = document.getElementById("statementToDo");
  let inProgressField = document.getElementById("statementInProgress");
  let awaitFeedbackField = document.getElementById("statementAwaitFeedback");
  let doneField = document.getElementById("statementDone");
  return [toDoField, inProgressField, awaitFeedbackField, doneField];
}

/**
 * Renders tasks onto the board based on the provided task list.
 * @param {Object[]} taskList - The list of tasks to render.
 */
async function renderTasks(taskList) {
  let taskAreas = initTaskAreas();
  clearBoard(taskAreas);
  for (let i = 0; i < taskList.length; i++) {
    renderSingleTask(taskList, taskAreas, i);
  }
  ifTaskAreaIsEmptySetEmptyInfoBox();
  handleMobileTaskMenu();
}

/**
 * Renders a single task onto the board.
 * @param {Object[]} taskList - The list of tasks.
 * @param {HTMLElement[]} taskAreas - Array of task area elements.
 * @param {number} i - Index of the task.
 */
function renderSingleTask(taskList, taskAreas, i) {
  let singleTask = taskList[i];
  let id = taskList[i]["id"];
  taskAreas[sectionIdForTask(taskList, i)].innerHTML += returnHtmlShowToDos(singleTask, i, id);
  setCategoryColor(i, taskList);
  setPriorityTaskCard(i, id);
  renderContactsBoardInitials(false, id, `contactsFieldBoard(${id})`);
  if (singleTask.subTasks !== -1) {
    handleSubtasksProgressBar(id);
  }
}

/**
 * Handles the progress bar for subtasks if they exist for a task.
 * @param {string} id - The ID of the task.
 */
function handleSubtasksProgressBar(id) {
  if (noSubtasksExist(id)) {
    return;
  } else {
    renderSubtaskProgressBar(id);
  }
}

/**
 * Checks if no subtasks exist for a task.
 * @param {string} id - The ID of the task.
 * @returns {boolean} True if no subtasks exist, otherwise false.
 */
function noSubtasksExist(id) {
  let subTasksExist = tasks[getIndexOfElementById(id, tasks)].subTasks;
  return subTasksExist === -1 ? true : false;
}

/**
 * Renders the progress bar for subtasks.
 * @param {string} id - The ID of the task.
 */
function renderSubtaskProgressBar(id) {
  let subTasksLength = tasks[getIndexOfElementById(id, tasks)].subTasks.length;
  let finishedSubTasks = getFinishedSubTasksLength(id);
  let progressSection = document.getElementById(`id-subtasks-progress-section${id}`);
  progressSection.classList.remove("visibility-hidden");
  renderProgressBarText(id, subTasksLength, finishedSubTasks);
  renderProgressBar(id, subTasksLength, finishedSubTasks);
}

/**
 * Renders the text for the subtask progress bar.
 * @param {string} id - The ID of the task.
 * @param {number} subTasksLength - The total number of subtasks.
 * @param {number} finishedSubTasks - The number of finished subtasks.
 */
function renderProgressBarText(id, subTasksLength, finishedSubTasks) {
  let progressTextArea = document.getElementById(`subtasks-progress-text${id}`);
  progressTextArea.innerHTML = `${finishedSubTasks}/${subTasksLength} Subtasks`;
}

/**
 * Renders the progress bar for subtasks.
 * @param {string} id - The ID of the task.
 * @param {number} subTasksLength - The total number of subtasks.
 * @param {number} finishedSubTasks - The number of finished subtasks.
 */
function renderProgressBar(id, subTasksLength, finishedSubTasks) {
  let loadWidth = (finishedSubTasks / subTasksLength) * 100;
  let loadBar = document.getElementById(`id-loadbar${id}`);
  loadBar.style.width = `${loadWidth}%`;
}

/**
 * Gets the number of finished subtasks for a task.
 * @param {string} id - The ID of the task.
 * @returns {number} The number of finished subtasks.
 */
function getFinishedSubTasksLength(id) {
  let task = tasks[getIndexOfElementById(id, tasks)];
  let finishedSubTasks = task.subTasks.filter((subTask) => subTask.status);
  return finishedSubTasks.length;
}

/**
 * Returns the index of the task area for a task.
 * @param {Object[]} taskList - The list of tasks.
 * @returns {number} The index of the task area.
 */
function sectionIdForTask(taskList, i) {
  let statement = taskList[i]["statement"];
  if (statement == "toDo") {
    return 0;
  } else if (statement == "inProgress") {
    return 1;
  } else if (statement == "awaitFeedback") {
    return 2;
  } else if (statement == "done") {
    return 3;
  }
}

/**
 * Clears the board by removing all child elements from the specified elements.
 * @param {HTMLElement[]} element - The array of elements to clear.
 */
function clearBoard(element) {
  for (let i = 0; i < element.length; i++) {
    clearElement(element[i]);
  }
}

/**
 * Sets the priority task card image based on the priority of the task.
 * @param {number} i - The index of the task.
 * @param {string} id - The ID of the task.
 */
function setPriorityTaskCard(i, id) {
  let prioField = document.getElementById(`prioField${i}`);
  let singleTaskPrio = tasks[getIndexOfElementById(id, tasks)]["prio"];
  clearElement(prioField);
  if (singleTaskPrio == "Low") {
    prioField.innerHTML = '<img src="/img/low_green.png" alt="Low Priority">';
  } else if (singleTaskPrio == "Medium") {
    prioField.innerHTML = '<img src="/img/medium_orange.png" alt="Medium Priority">';
  } else {
    prioField.innerHTML = '<img src="/img/urgent_red.png" alt="Urgent Priority">';
  }
}

/**
 * Toggles the background of the dialog by adding or removing the background-dialog class.
 */
function toggleBackgroundDialog() {
  clearElement("taskOverlay");
  let backgroundDialog = document.getElementById("backgroundDialog");
  backgroundDialog.classList.toggle("background-dialog");
}

/**
 * Renders the initials of contacts assigned to a task.
 * @param {boolean} renderFull - Whether to render all initials or only a preview.
 * @param {string} id - The ID of the task.
 * @param {string} targetElementId - The ID of the target element to render contacts initials.
 */
function renderContactsBoardInitials(renderFull, id, targetElementId) {
  let contactsFieldBoard = document.getElementById(targetElementId);
  let contactsForTask = tasks[getIndexOfElementById(id, tasks)]["assignedTo"];
  if (contactsForTask !== -1) {
    for (let j = 0; j < contactsForTask.length; j++) {
      if (contactExists(contactsForTask[j])) {
        if (j < 3 || renderFull) {
          renderContactInitial(contactsFieldBoard, contactsForTask, id, j);
        } else {
          renderMoreContactsPreview(contactsFieldBoard, contactsForTask, j);
          break;
        }
      }
    }
  }
}

/**
 * Renders the initials of a single contact assigned to a task.
 * @param {HTMLElement} contactsFieldBoard - The element to render the contact initials.
 * @param {Object[]} contactsForTask - The list of contacts assigned to the task.
 * @param {string} id - The ID of the task.
 * @param {number} j - The index of the contact.
 */
function renderContactInitial(contactsFieldBoard, contactsForTask, id, j) {
  let contactForTask = contactsForTask[j];
  contactsFieldBoard.innerHTML += returnHtmlContactsInitialen(contactForTask, j);
  backgroundColorInitialsBoard(j, id);
}

/**
 * Renders a preview of additional contacts assigned to a task.
 * @param {HTMLElement} contactsFieldBoard - The element to render the additional contacts preview.
 * @param {Object[]} contactsForTask - The list of contacts assigned to the task.
 */
function renderMoreContactsPreview(contactsFieldBoard, contactsForTask, j) {
  let restAmount = contactsForTask.length - 3;
  contactsFieldBoard.innerHTML += returnMoreContactsPreview(restAmount, j);
}

/**
 * Checks if a contact exists in the global contacts list.
 * @param {Object} assignedContact - The contact to check.
 * @returns {boolean} True if the contact exists, otherwise false.
 */
function contactExists(assignedContact) {
  let contactsIds = contacts.map((contact) => contact.id);
  return contactsIds.includes(assignedContact.id);
}

/**
 * Sets the background color for initials of a contact board.
 * @param {number} j - The index of the contact.
 * @param {string} id - The ID of the task.
 */
function backgroundColorInitialsBoard(j, id) {
  let initialArea = document.getElementById(`initialArea${j}`);
  let colorNumber = tasks[getIndexOfElementById(id, tasks)]["assignedTo"][j]["color"];
  let bgColor = contactColor[colorNumber];
  initialArea.style.backgroundColor = bgColor;
  initialArea.removeAttribute("id");
}

/**
 * Retrieves the IDs from a two-level nested array by the specified ID.
 * @param {string} id - The ID to search for.
 * @param {Object[]} arrayLevelOne - The first level array.
 * @param {string} ArrayLevelTwo - The key of the second level array.
 * @returns {string[]} An array of IDs from the second level array.
 */
function retrieveIdsFromTwoLevelNestedArrayById(id, arrayLevelOne, ArrayLevelTwo) {
  let secondLevelArrayIds = [];
  let secondLevelArray = arrayLevelOne[getIndexOfElementById(id, arrayLevelOne)][ArrayLevelTwo];
  for (let i = 0; i < secondLevelArray.length; i++) {
    secondLevelArrayIds.push(secondLevelArray[i].id);
  }
  return secondLevelArrayIds;
}

/**
 * Retrieves the IDs from a one-level array by the specified ID.
 * @param {Object[]} arrayName - The array to retrieve IDs from.
 * @returns {string[]} An array of IDs.
 */
function retrieveIdsFromOneLevelArrayById(arrayName) {
  let idArray = [];
  for (let i = 0; i < arrayName.length; i++) {
    idArray.push(arrayName[i].id);
  }
  return idArray;
}

/**
 * Closes the current task dialog by toggling the background and re-rendering tasks.
 */
function closeCurrentTask() {
  toggleBackgroundDialog();
  renderTasks(getFilteredTasks());
}

/**
 * Checks the boolean value for priority and updates the priority selection.
 * @param {Object} priority - The priority object.
 * @param {HTMLElement} prioSelection - The priority selection element.
 * @param {number} i - The index of the task.
 */
function checkBooleanForPriority(priority, prioSelection, i) {
  if (priority["isPriority"] == false) {
    prioSelection.innerHTML += prioNormal(priority, i);
  } else {
    prioSelection.innerHTML += prioActive(priority, i);
    priority["isPriority"] = false;
  }
}

/**
 * Checks if any task area is empty and sets an empty info box.
 */
function ifTaskAreaIsEmptySetEmptyInfoBox() {
  let taskAreas = initTaskAreas();
  for (let i = 0; i < taskAreas.length; i++) {
    if (taskAreas[i].innerHTML == "") {
      let statement = getStatementByTaskI(i);
      taskAreas[i].innerHTML = taskAreaIsEmptyHtml(statement);
    }
  }
}
/**
 * Returns the statement for a task area based on the index.
 * @param {number} i - The index of the task area.
 * @returns {string} The statement for the task area.
 */
function getStatementByTaskI(i) {
  const TaskAreaStatements = {
    0: "To do",
    1: "In progress",
    2: "Await Feedback",
    3: "Done",
  };
  return TaskAreaStatements[i];
}

/**
 * Gets the index of the task statement based on its ID.
 * @param {string} id - The ID of the task.
 * @returns {number} The index of the task statement.
 */
function getTaskStatementIndex(id) {
  const statementIndices = {
    toDo: 0,
    inProgress: 1,
    awaitFeedback: 2,
    done: 3,
  };
  const statement = tasks[getIndexOfElementById(id, tasks)].statement;
  return statementIndices.hasOwnProperty(statement) ? statementIndices[statement] : -1;
}

/**
 * Sets up an event listener for filtering tasks based on input value.
 */
function filterTaskListener() {
  document
    .getElementById("id-find-task-input")
    .addEventListener("input", () => renderTasks(getFilteredTasks()));
}

/**
 * Filters tasks based on the input value in the search field.
 * @returns {Object[]} The filtered list of tasks.
 */
function getFilteredTasks() {
  let inputValue = document.getElementById("id-find-task-input").value.toLowerCase();
  let filteredTasks = tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(inputValue) ||
      task.description.toLowerCase().includes(inputValue)
    );
  });
  return filteredTasks;
}

/**
 * Sets up event listeners to change the border color of the search field.
 */
function setSearchFieldBorderListener() {
  const inputElement = document.getElementById("id-find-task-input");
  const formElement = document.getElementById("id-input-find-task");
  inputElement.addEventListener("focus", function () {
    formElement.style.border = `1px solid var(--accent-color)`;
  });
  inputElement.addEventListener("blur", function () {
    formElement.style.border = "1px solid  rgba(168, 168, 168, 1)";
  });
}
