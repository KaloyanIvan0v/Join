let currentPrio = ["medium"];
let idNumber = [];
let categories = ["Technical Task", "User Story"];
let selectedCategory = [];
let subTasks = [];
let subTaskStatus = [];
let checkedUsers = [];
let findContactsAtSearch = [];
let finishedSubTasks = [];
let checkedContactsId = [];
let openContacts = false;
let openCategories = false;
let checkChangeIcons = false;
let checkBoxContact = false;
let arrowToggleCheck = false;
let categoryBoolean = false;

async function init_add_task() {
  await includeHTML();
  loadHtmlTaskTemplate();
  // setTimeout(loadFirstLettersFromSessionStorage, 300);
  loadTasks();
  loadContacts();
  loadUsers();
  setTimeout(selectPriority, 200);
  setTimeout(currentDate, 200);
  handleExitImg();
}

/**
 * Creates a new task, adds it to the board, and redirects to the board page after a delay.
 */
function createTask() {
  let containerCategory = document.getElementById("containerCategory");
  if (selectedCategory.length == 0) {
    containerCategory.classList.add("error-border");
  } else {
    addTask();
    addedToBoardPopUp();
    setTimeout(function () {
      window.location.href = "board.html";
    }, 900);
  }
}

/**
 * Adds a new task with the provided details to the task list.
 *
 * @returns {Promise} A promise that resolves after the task is added.
 */
async function addTask() {
  let idNumber = increaseId(tasks);
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let dueDate = document.getElementById("dueDate");
  let checkedUsersForTask = checkedUsers;
  let task = {
    title: title.value,
    description: description.value,
    assignedTo: checkedUsers.length === 0 ? -1 : checkedUsers,
    dueDate: dueDate.value,
    prio: currentPrio,
    category: selectedCategory,
    subTasks: subTasks.length === 0 ? -1 : subTasks,
    finishedSubTasks: finishedSubTasks,
    checkedUsers: checkedUsersForTask.length === 0 ? -1 : checkedUsersForTask,
    statement: "toDo",
    id: idNumber,
  };
  tasks.push(task);
  await setItem("tasks", tasks);
}

/**
 * Changes the icons for adding or clearing subtasks and renders the subtasks accordingly.
 */
function changeIconsSubtask() {
  let addIconSubtasks = document.getElementById("addIconSubtasks");
  let subTask = document.getElementById("inputFieldSubtasks");

  addIconSubtasks.innerHTML = "";

  if (checkChangeIcons == false) {
    addIconSubtasks.innerHTML = returnHtmlCheckAndClear();
    checkChangeIcons = false;
    renderSubTasks();
  } else {
    addIconSubtasks.innerHTML = returnHtmlAdd();
    checkChangeIcons = false;
  }
  renderSubTasks();
}

/**
 * Adds a new subtask to the list of subtasks.
 */
function addNewSubTask() {
  let id = increaseId(subTasks);
  let singleNewTask = document.getElementById("subTasks");
  let singleNewTaskValue = singleNewTask.value;

  if (singleNewTaskValue.length >= 3) {
    subTasks.push({
      subTask: singleNewTaskValue,
      status: false,
      id: id,
    });
  }
  singleNewTask.blur();
  renderSubTasks("newSubtask");
}

/**
 * Deletes a subtask from the list of subtasks.
 *
 * @param {number} i - The index of the subtask.
 */
function deleteSubtask(event, i) {
  event.stopPropagation();
  subTasks.splice(i, 1);
  setItem("subTasks", subTasks);
  renderSubTasks();
}

/**
 * Changes the content of a subtask.
 *
 * @param {number} i - The index of the subtask.
 */
async function changeSubtask(i) {
  let changedSubTask = document.getElementById(`inputField${i}`).value;
  subTasks[i]["subTask"] = changedSubTask;
  await setItem("subTasks", subTasks);
  renderSubTasks();
}

/**
 * Renders the list of subtasks.
 *
 * @param {string} operator - The operation to perform.
 */
function renderSubTasks(operator) {
  let newTaskField = document.getElementById("newSubTaskField");
  let singleNewTask = document.getElementById("subTasks");
  singleNewTask.value = "";
  newTaskField.innerHTML = "";

  for (i = 0; i < subTasks.length; i++) {
    let newSubTask = subTasks[i]["subTask"];
    newTaskField.innerHTML += returnHtmlNewSubtasks(newSubTask);
  }
  checkIfNewSubTask(operator);
}

/**
 * Resets the input field for adding a new subtask.
 */
function resetAddNewSubtask() {
  let subTasks = document.getElementById("subTasks");
  subTasks.value = "";
  checkChangeIcons = true;
  changeIconsSubtask();
}

/**
 * Checks if a new subtask has been added.
 *
 * @param {string} operator - The operation to perform.
 */
async function checkIfNewSubTask(operator) {
  if (operator == "newSubtask") {
    checkChangeIcons = true;
    changeIconsSubtask();
    await setItem("subTasks", subTasks);
  }
}

/**
 * Edits a subtask.
 *
 * @param {number} i - The index of the subtask.
 */
function editSubtask(i) {
  let subTaskField = document.getElementById(`subTaskElement${i}`);
  let subTask = subTasks[i]["subTask"];

  subTaskField.classList.add("list-element-subtasks");
  subTaskField.classList.remove("hover-subtask");
  subTaskField.innerHTML = editSubtaskHtml(i, subTask);
  inputFocus(i);
}

/**
 * Focuses on the input field for editing a subtask.
 *
 * @param {number} i - The index of the subtask.
 */
function inputFocus(i) {
  let inputField = document.getElementById(`inputField${i}`);
  inputField.focus();
  inputField.setSelectionRange(inputField.value.length, inputField.value.length);
}
