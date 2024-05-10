let currentDraggedElement;
async function init_board() {
  await loadTasks();
  await loadContacts();
  await includeHTML();
  renderTasks(getFilteredTasks());
  filterTaskListener();
  setSearchFieldBorderListener();
}

function openPopUp() {
  document.getElementById("id-shadow-layer").classList.remove("visibility-hidden");
}

function closePopUp() {
  addClassListTo("id-shadow-layer", "visibility-hidden");
  clearElement("id-pop-up");
  renderTasks(getFilteredTasks());
}

function initTaskAreas() {
  let toDoField = document.getElementById("statementToDo");
  let inProgressField = document.getElementById("statementInProgress");
  let awaitFeedbackField = document.getElementById("statementAwaitFeedback");
  let doneField = document.getElementById("statementDone");
  return [toDoField, inProgressField, awaitFeedbackField, doneField];
}

async function renderTasks(taskList) {
  let taskAreas = initTaskAreas();
  clearBoard(taskAreas);
  for (i = 0; i < taskList.length; i++) {
    renderSigleTask(taskList, taskAreas, i);
  }
  ifTaskAreaIsEmptySetEmptyInfoBox();
}

function renderSigleTask(taskList, taskAreas, i) {
  let singleTask = taskList[i];
  let id = taskList[i]["id"];
  taskAreas[sectionIdForTask(taskList)].innerHTML += returnHtmlShowToDos(singleTask, i, id);
  setCategoryColor(i, taskList, id);
  setPriorityTaskCard(i, id);
  renderContactsBoardInitials(false, id, `contactsFieldBoard(${id})`);
  handleSubtasksProgressBar(id);
}

function handleSubtasksProgressBar(id) {
  if (noSubtasksExist(id)) {
    return;
  } else {
    renderSubtaskProgressBar(id);
  }
}

function noSubtasksExist(id) {
  let subTasksLength = tasks[getIndexOfElmentById(id, tasks)].subTasks.length;
  return subTasksLength == 0;
}

function renderSubtaskProgressBar(id) {
  let subTasksLength = tasks[getIndexOfElmentById(id, tasks)].subTasks.length;
  let funishedSubTasks = getFinishedSubTasksLength(id);
  let progressSection = document.getElementById(`id-subtasks-progress-section${id}`);
  progressSection.classList.remove("visibility-hidden");
  renderPorgressBarText(id, subTasksLength, funishedSubTasks);
  renderProgressBar(id, subTasksLength, funishedSubTasks);
}

function renderPorgressBarText(id, subTasksLength, funishedSubTasks) {
  let progresTextArea = document.getElementById(`subtasks-progress-text${id}`);
  progresTextArea.innerHTML = `${funishedSubTasks}/${subTasksLength} Subtasks`;
}

function renderProgressBar(id, subTasksLength, funishedSubTasks) {
  let loadWidth = (funishedSubTasks / subTasksLength) * 100;
  let loadBar = document.getElementById(`id-loadbar${id}`);
  loadBar.style.width = `${loadWidth}%`;
}

function getFinishedSubTasksLength(id) {
  let task = tasks[getIndexOfElmentById(id, tasks)];
  let finishedSubTasks = task.subTasks.filter((subTask) => subTask.status);
  return finishedSubTasks.length;
}

function sectionIdForTask(taskList) {
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

function clearBoard(element) {
  for (i = 0; i < element.length; i++) {
    clearElement(element[i]);
  }
}

function setCategoryColor(i, list) {
  let statementField = document.getElementById(`statementField${i}`);
  let singleTaskstatement = list[i]["category"];
  if (singleTaskstatement == "Technical Task") {
    statementField.classList.add("bg-color-technical-task");
  } else {
    statementField.classList.add("bg-color-user-story");
  }
}

function setPriorityTaskCard(i, id) {
  let prioField = document.getElementById(`prioField${i}`);
  let singleTaskPrio = tasks[getIndexOfElmentById(id, tasks)]["prio"];
  clearElement(prioField);
  if (singleTaskPrio == "Low") {
    prioField.innerHTML = '<img src="' + "/img/low_green.png" + '" alt="Bildbeschreibung">';
  } else if (singleTaskPrio == "Medium") {
    prioField.innerHTML = '<img src="' + "/img/medium_orange.png" + '" alt="Bildbeschreibung">';
  } else {
    prioField.innerHTML = '<img src="' + "/img/urgent_red.png" + '" alt="Bildbeschreibung">';
  }
}

function handleHoverButtonDeleteEditTask() {
  handleHoverButtonChangeImg(
    ".btn-hover-trash",
    ".img-hover-trash",
    "url('/img/trashbin.png')",
    "url('/img/trash-light-blue.png')"
  );
  handleHoverButtonChangeImg(
    ".btn-hover-edit",
    ".img-hover-edit",
    "url('/img/edit-pencil.png')",
    "url('/img/edit-pencil-light-blue.png')"
  );
}

function toggleBackgroundDialog() {
  clearElement("taskOverlay");
  let backgroundDialog = document.getElementById("backgroundDialog");
  backgroundDialog.classList.toggle("background-dialog");
}

function renderContactsBoardInitials(renderFull, id, targetElementId) {
  let contactsFieldBoard = document.getElementById(targetElementId);
  let contactsForTask = tasks[getIndexOfElmentById(id, tasks)]["assignedTo"];
  for (j = 0; j < contactsForTask.length; j++) {
    if (contactExists(contactsForTask[j])) {
      if (j < 3 || renderFull == true) {
        renderContactInitial(contactsFieldBoard, contactsForTask, id);
      } else {
        renderMoreContactsPreview(contactsFieldBoard, contactsForTask);
        break;
      }
    }
  }
}

function renderContactInitial(contactsFieldBoard, contactsForTask, id) {
  let contactForTask = contactsForTask[j];
  contactsFieldBoard.innerHTML += returnHtmlContactsInitialen(contactForTask, j);
  backgroundColorInitialsBoard(j, id);
}

function renderMoreContactsPreview(contactsFieldBoard, contactsForTask) {
  let restAmount = contactsForTask.length - 3;
  contactsFieldBoard.innerHTML += returnMoreContactsPreview(restAmount);
  return;
}

function contactExists(assignedContact) {
  let contactsIds = [];
  let assignedContactId = assignedContact.id;
  contacts.forEach((contact) => {
    contactsIds.push(contact.id);
  });
  return contactsIds.includes(assignedContactId);
}

function backgroundColorInitialsBoard(j, id) {
  let initialArea = document.getElementById(`initialArea${j}`);
  let colorNumber = tasks[getIndexOfElmentById(id, tasks)]["assignedTo"][j]["color"];
  let bgColor = contactColor[colorNumber];
  initialArea.style.backgroundColor = bgColor;
  initialArea.removeAttribute("id");
}

function retrieveIdsFromTwoLevelNestedArrayById(id, arrayLevelOne, ArrayLevelTwo) {
  let secondLevelArrayIds = [];
  let secondLevelArray = arrayLevelOne[getIndexOfElmentById(id, arrayLevelOne)][ArrayLevelTwo];
  for (i = 0; i < secondLevelArray.length; i++) {
    secondLevelArrayIds.push(secondLevelArray[i].id);
  }
  return secondLevelArrayIds;
}

function retrieveIdsFromOneLevelArrayById(arrayName) {
  let idArray = [];
  for (i = 0; i < arrayName.length; i++) {
    idArray.push(arrayName[i].id);
  }
  return idArray;
}

function closeCurrentTask() {
  toggleBackgroundDialog();
  renderTasks(getFilteredTasks());
}

function checkBooleanForPriority(priority, prioSelection, i) {
  if (priority["isPriority"] == false) {
    prioSelection.innerHTML += prioNormal(priority, i);
  } else {
    prioSelection.innerHTML += prioActive(priority, i);
    priority["isPriority"] = false;
  }
}

function prioSelect(id, prioSelect) {
  let urgent = document.getElementById(`Urgent(${id})`);
  let medium = document.getElementById(`Medium(${id})`);
  let low = document.getElementById(`Low(${id})`);
  setPrioSelectDefaultState(urgent, medium, low);
  if (prioSelect == "Urgent") {
    urgent.src = "/img/urgent_highlight.png";
  } else if (prioSelect == "Medium") {
    medium.src = "/img/medium_highlight.png";
  } else {
    low.src = "/img/low_highlight.png";
  }
  tasks[getIndexOfElmentById(id, tasks)]["prio"] = prioSelect;
}

function setPrioSelectDefaultState(urgent, medium, low) {
  urgent.src = "/img/urgent.png";
  medium.src = "/img/medium.png";
  low.src = "/img/low.png";
}

function ifTaskAreaIsEmptySetEmptyInfoBox() {
  let taskAreas = initTaskAreas();
  for (i = 0; i < taskAreas.length; i++) {
    if (taskAreas[i].innerHTML == "") {
      let statement = getStatementByTaskI(i);
      taskAreas[i].innerHTML = taskAreaIsEmptyHtml(statement);
    }
  }
}

function getStatementByTaskI(i) {
  const TaskAreaStatements = {
    0: "To do",
    1: "In progress",
    2: "Await Feedback",
    3: "Done",
  };
  return TaskAreaStatements[i];
}

function getTaskStatementIndex(id) {
  const statementIndices = {
    toDo: 0,
    inProgress: 1,
    awaitFeedback: 2,
    done: 3,
  };
  const statement = tasks[getIndexOfElmentById(id, tasks)].statement;
  return statementIndices.hasOwnProperty(statement) ? statementIndices[statement] : -1;
}

function filterTaskListener() {
  document
    .getElementById("id-find-task-input")
    .addEventListener("input", () => renderTasks(getFilteredTasks()));
}

function getFilteredTasks() {
  let inputValue = document.getElementById("id-find-task-input").value.toLowerCase();
  let filteredTasks = tasks.filter(function (task) {
    return (
      task.title.toLowerCase().includes(inputValue) ||
      task.description.toLowerCase().includes(inputValue)
    );
  });
  return filteredTasks;
}

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

function setErrorBorderColor(elementId, timePeriod) {
  const div = document.getElementById(elementId);
  div.style.borderColor = "red";
  setTimeout(() => {
    div.style.borderColor = "grey";
  }, timePeriod);
}
