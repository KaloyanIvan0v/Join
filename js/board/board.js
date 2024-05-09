let currentDraggedElement;
//let checkedStatusSubtasks = false;

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
  renderContactsBoardInitialen(false, id, `contactsFieldBoard(${id})`);
  handleSubtasksProgressbar(id);
}

function handleSubtasksProgressbar(id) {
  if (noSubtasksExist(id)) {
    return;
  } else {
    renderSubtaskProgressBar(id);
  }
}

function noSubtasksExist(id) {
  let subTasksLength = tasks[getIndexOfElmentById(id, tasks)].subTasks.length;
  if (subTasksLength == 0) {
    return true;
  } else {
    return false;
  }
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
  let dialogField = document.getElementById("taskOverlay");
  dialogField.innerHTML = "";
  let backgroundDialog = document.getElementById("backgroundDialog");
  backgroundDialog.classList.toggle("background-dialog");
}

function renderContactsBoardInitialen(renderFull, id, targetElementId) {
  let contactsFieldBoard = document.getElementById(targetElementId);
  let contactsForTask = tasks[getIndexOfElmentById(id, tasks)]["assignedTo"];
  for (j = 0; j < contactsForTask.length; j++) {
    if (contactExists(contactsForTask[j])) {
      if (j < 3 || renderFull == true) {
        let contactForTask = contactsForTask[j];
        contactsFieldBoard.innerHTML += returnHtmlContactsInitialen(contactForTask, j);
        backgroundColorInitialsBoard(j, id);
      } else {
        let restAmount = contactsForTask.length - 3;
        contactsFieldBoard.innerHTML += returnMoreContactsPreview(restAmount);
        return;
      }
    }
  }
}

function ifRenderFullIsTrue() {}

function renderContactInitial() {}

function contactExists(assignedContact) {
  let contactsIds = [];
  let assignedContactId = assignedContact.id;
  contacts.forEach((contact) => {
    contactsIds.push(contact.id);
  });

  if (contactsIds.includes(assignedContactId)) {
    return true;
  } else {
    return false;
  }
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
  setItem("tasks", tasks);
  if (prioSelect == "Urgent") {
    urgent.src = "/img/urgent_highlight.png";
    medium.src = "/img/medium.png";
    low.src = "/img/low.png";
  } else if (prioSelect == "Medium") {
    urgent.src = "/img/urgent.png";
    medium.src = "/img/medium_highlight.png";
    low.src = "/img/low.png";
  } else {
    urgent.src = "/img/urgent.png";
    medium.src = "/img/medium.png";
    low.src = "/img/low_highlight.png";
  }
  tasks[getIndexOfElmentById(id, tasks)]["prio"] = prioSelect;
}

function startDragging(id) {
  currentDraggedElement = id;
  rotateTaksCard(id);
  previewDrop(id);
}

function allowDrop(event) {
  event.preventDefault();
}

function moveElementTo(newstatement) {
  tasks[getIndexOfElmentById(currentDraggedElement, tasks)].statement = newstatement;
  renderTasks(getFilteredTasks());
  setSesionStorage("tasks", tasks);
  setItem("tasks", JSON.stringify(tasks));
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

function rotateTaksCard(id) {
  let taskCard = document.getElementById(`taskCard${id}`);
  taskCard.style.transform = "rotate(5deg)";
}

function previewDrop(id) {
  if (previewElementIsNotFarLeft(id)) {
    renderPreviewElements(id, 0, "left");
    setPreviewElementwidthAndHeight(".preview-element-left");
  }
  if (previewElementIsNotFarRight(id)) {
    renderPreviewElements(id, 1, "right");
    setPreviewElementwidthAndHeight(".preview-element-right");
  }
}

function previewElementIsNotFarLeft(id) {
  return calculatePreviewAreasPosition(id)[0] > -1;
}

function previewElementIsNotFarRight(id) {
  return calculatePreviewAreasPosition(id)[1] < 4;
}

function renderPreviewElements(id, position, side) {
  let taskAreas = initTaskAreas();
  let previewAreasPosition = calculatePreviewAreasPosition(id);
  taskAreas[previewAreasPosition[position]].innerHTML += previewElementHtml(side);
}

function calculatePreviewAreasPosition(id) {
  let taskAreaPosition = getTaskStatementIndex(id);
  let previewTaskAreas = [taskAreaPosition - 1, taskAreaPosition + 1];
  return previewTaskAreas;
}

function getDragedElementWidthAndHeigth() {
  let width = document.getElementById(`taskCard${currentDraggedElement}`).offsetWidth;
  let height = document.getElementById(`taskCard${currentDraggedElement}`).offsetHeight;
  return [width, height];
}

function setPreviewElementwidthAndHeight(targerElement) {
  let widthAndHeight = getDragedElementWidthAndHeigth();
  let previewElementRight = document.querySelector(targerElement);
  previewElementRight.style.width = `${widthAndHeight[0]}px`;
  previewElementRight.style.height = `${widthAndHeight[1]}px`;
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
