let currentDraggedElement;
let checkedStatusSubtasks = false;
//test comentar
async function init_board() {
  await loadTasks();
  includeHTML();
  renderTasks(tasks);
  loadContacts();
  filterTaskListener();
  setSearchFieldBorderListener();
}

function openPopUp() {
  document
    .getElementById("id-shadow-layer")
    .classList.remove("visibility-hidden");
}
function closePopUp() {
  document.getElementById("id-shadow-layer").classList.add("visibility-hidden");
  document.getElementById("id-pop-up").innerHTML = "";
}

function renderSubtaskProgressBar(id) {
  let subTasksLength = tasks[getIndexOfElmentById(id, tasks)].subTasks.length;
  if (subTasksLength == 0) {
    return;
  }
  let loadbar = document.getElementById("loadBar");
  loadbar.innerHTML = renderSubtaskProgressBarHtml(finishedSubTasks, subTasks);
  let progress = (finishedSubTasks.length / subTasksLength.length) * 100;
  loadbar.style.width = progress + "%";
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
    let singleTask = taskList[i];
    let id = taskList[i]["id"];
    taskAreas[sectionIdForTask(taskList)].innerHTML += returnHtmlShowToDos(
      singleTask,
      i,
      id
    );
    choosestatementColor(i);
  }
  checkIfTaskAreaIsEmpty();
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
    element[i].innerHTML = "";
  }
}

function choosestatementColor(i) {
  let statementField = document.getElementById(`statementField${i}`);
  let singleTaskstatement = tasks[i]["category"];
  if (singleTaskstatement == "Technical Task") {
    statementField.classList.add("bg-color-technical-task");
  } else {
    statementField.classList.add("bg-color-user-story");
  }
  whichPriorityTaskCard(i, false);
}

function whichPriorityTaskCard(i, renderFull) {
  let prioField = document.getElementById(`prioField${i}`);
  let singleTaskPrio = tasks[i]["prio"];
  prioField.innerHTML = "";
  if (singleTaskPrio == "Low") {
    prioField.innerHTML =
      '<img src="' + "/img/low_green.png" + '" alt="Bildbeschreibung">';
  } else if (singleTaskPrio == "medium") {
    prioField.innerHTML =
      '<img src="' + "/img/medium_orange.png" + '" alt="Bildbeschreibung">';
  } else {
    prioField.innerHTML =
      '<img src="' + "/img/urgent_red.png" + '" alt="Bildbeschreibung">';
  }
  renderContactsBoardInitialen(i, renderFull);
}

function openTaskDetailView(i, id) {
  openPopUp();
  let popUpDiv = document.getElementById("id-pop-up");
  popUpDiv.innerHTML = openTaskDetailViewHtml(tasks[i], i, id);
  choosestatementColor(i);
  whichPriorityTaskCard(i, true);
  //renderSubTasksBoard(i);
  handleHoverButtonDeleteEditTask();
  renderTaskAssignedNames(i);
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

function renderSubTasksBoard(i) {
  let subTasksField = document.getElementById(`subTasksField${i}`);
  let subTasks = tasks[i]["subTasks"];
  subTasksField.innerHTML = "";

  for (j = 0; j < subTasks.length; j++) {
    let subTask = subTasks[j];
    subTasksGlobal.push(subTask);
    subTasksField.innerHTML += returnHtmlSubtasks(subTask, j);
  }
  //checkSubtaskBoardOverlayChecked();
}

function checkSubtaskBoardOverlayChecked() {
  for (let i = 0; i < subTasksGlobal.length; i++) {
    let subTask = subTasksGlobal[i];
    if (finishedSubTasks.includes(subTask)) {
      let imgCheck = document.getElementById(`checkEmptySubtask(${i})`);
      imgCheck.src = "/img/box-checked.png";
    }
  }
}

function renderContactsBoardInitialen(i, renderFull) {
  let contactsFieldBoard = document.getElementById(`contactsFieldBoard(${i})`);
  let contactsForTask = tasks[i]["assignedTo"];
  contactsFieldBoard.innerHTML = "";
  for (j = 0; j < contactsForTask.length; j++) {
    if (j < 3 || renderFull == true) {
      let contactForTask = contactsForTask[j];
      contactsFieldBoard.innerHTML += returnHtmlContactsInitialen(
        contactForTask,
        j
      );
      backgroundColorInitialsBoard(i, j);
    } else {
      let restAmount = contactsForTask.length - 3;
      contactsFieldBoard.innerHTML += returnMoreContactsPreview(restAmount);
      return;
    }
  }
  //if (status == "fullName") renderFullName(i, contactsForTask);
}

function returnMoreContactsPreview(restAmount) {
  return /*html*/ `
    <div id="initialArea${j}" class="contact-board mg-left-8" style="background-color: rgb(42, 54, 71)">
      <span>+${restAmount}</span>
    </div>`;
}

function renderFullName(i, contactsForTask) {
  let backgroundDialog = document.getElementById("backgroundDialog");
  if (backgroundDialog.classList.contains("background-dialog")) {
    let contactsFieldBoard = document.getElementById(
      `contactsFieldBoardFullName(${i})`
    );
    contactsFieldBoard.innerHTML = "";
    for (j = 0; j < contactsForTask.length; j++) {
      fullName = contactsForTask[j];
      contactsFieldBoard.innerHTML += returnHtmlContactsFullName(fullName);
    }
  }
}

function backgroundColorInitialsBoard(i, j) {
  let initialArea = document.getElementById(`initialArea${j}`);
  let colorNumber = tasks[i]["checkedUsers"][j]["color"];
  let bgColor = contactColor[colorNumber];
  initialArea.style.backgroundColor = bgColor;
  initialArea.removeAttribute("id");
}

function checkSubtaskBoardOverlay(j) {
  let currentSubTask = subTasksGlobal[j];
  let imgCheck = document.getElementById(`checkEmptySubtask(${j})`);

  if (checkedStatusSubtasks == false) {
    finishedSubTasks.push(currentSubTask);
    imgCheck.src = "/img/box-checked.png";
    checkedStatusSubtasks = true;
    // updateLoadbar(i);
  } else {
    let index = finishedSubTasks.findIndex(
      (subTask) => JSON.stringify(subTask) === JSON.stringify(currentSubTask)
    );
    // updateLoadbar(i);
    finishedSubTasks.splice(index, 1);
    imgCheck.src = "/img/check_empty.png";
    checkedStatusSubtasks = false;
  }
}

function editTaskOverlay(i) {
  let overlayTask = tasks[i];
  let dialogField = document.getElementById("taskOverlay");
  let currentPrio = tasks[i]["prio"];
  dialogField.innerHTML = "";
  dialogField.innerHTML = returnHtmlEditCurrentTask(overlayTask, i);

  prioSelect(i, currentPrio);
  renderContactsBoardInitialen(i, false);
}

function closeCurrentTask() {
  toggleBackgroundDialog();
  renderTasks(tasks);
}

function checkBooleanForPriority(priority, prioSelection, i) {
  if (priority["isPriority"] == false) {
    prioSelection.innerHTML += prioNormal(priority, i);
  } else {
    prioSelection.innerHTML += prioActive(priority, i);
    priority["isPriority"] = false;
  }
}

function prioSelect(i, prioSelect) {
  let urgent = document.getElementById(`urgent(${i})`);
  let medium = document.getElementById(`medium(${i})`);
  let low = document.getElementById(`low(${i})`);
  tasks[i]["prio"] = prioSelect;
  setItem("tasks", tasks);

  if (prioSelect == "urgent") {
    urgent.src = "/img/urgent_highlight.png";
    medium.src = "/img/medium.png";
    low.src = "/img/low.png";
  } else if (prioSelect == "medium") {
    urgent.src = "/img/urgent.png";
    medium.src = "/img/medium_highlight.png";
    low.src = "/img/low.png";
  } else {
    urgent.src = "/img/urgent.png";
    medium.src = "/img/medium.png";
    low.src = "/img/low_highlight.png";
  }
}

//###################################################################################
//*********************Kaloyan's Code fängt hier an!!!*******************************
//###################################################################################

function startDragging(id) {
  currentDraggedElement = id;
  rotateTaksCard(id);
  previewDrop(id);
}

function allowDrop(event) {
  event.preventDefault();
}

function moveElementTo(newstatement) {
  tasks[getIndexOfElement(currentDraggedElement)].statement = newstatement;
  renderTasks(tasks);
  setSesionStorage("tasks", tasks);
  setItem("tasks", JSON.stringify(tasks));
}

function getIndexOfElement(id) {
  let index = 0;
  for (i = 0; i < tasks.length; i++) {
    if (tasks[i]["id"] == id) {
      index = i;
    }
  }
  return index;
}

function checkIfTaskAreaIsEmpty() {
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
  let taskAreas = initTaskAreas();
  let previewAreasPosition = getPreviewAreas(id);
  if (previewAreasPosition[0] > -1) {
    taskAreas[previewAreasPosition[0]].innerHTML += previewElementHtml("left");
    setPreviewElementwidthAndHeightLeft();
  }
  if (previewAreasPosition[1] < 4) {
    taskAreas[previewAreasPosition[1]].innerHTML += previewElementHtml("right");
    setPreviewElementwidthAndHeightRight();
  }
}

function getPreviewAreas(id) {
  let taskAreaPosition = getTaskStatementIndex(id);
  let previewTaskAreas = [taskAreaPosition - 1, taskAreaPosition + 1];
  return previewTaskAreas;
}

function getTaskStatementIndex(id) {
  let statement = tasks[getIndexOfElement(id)].statement;
  switch (statement) {
    case "toDo":
      return 0;
    case "inProgress":
      return 1;
    case "awaitFeedback":
      return 2;
    case "done":
      return 3;
  }
}

function getDragedElementWidthAndHeigth() {
  let width = document.getElementById(
    `taskCard${currentDraggedElement}`
  ).offsetWidth;
  let height = document.getElementById(
    `taskCard${currentDraggedElement}`
  ).offsetHeight;
  return [width, height];
}

function setPreviewElementwidthAndHeightLeft() {
  let widthAndHeight = getDragedElementWidthAndHeigth();
  let previewElementLeft = document.querySelector(".preview-element-left");
  previewElementLeft.style.width = `${widthAndHeight[0]}px`;
  previewElementLeft.style.height = `${widthAndHeight[1]}px`;
}

function setPreviewElementwidthAndHeightRight() {
  let widthAndHeight = getDragedElementWidthAndHeigth();
  let previewElementRight = document.querySelector(".preview-element-right");
  previewElementRight.style.width = `${widthAndHeight[0]}px`;
  previewElementRight.style.height = `${widthAndHeight[1]}px`;
}

function filterTaskListener() {
  document
    .getElementById("id-find-task-input")
    .addEventListener("input", () => renderTasks(getFilteredTasks()));
}

function getFilteredTasks() {
  var inputValue = document
    .getElementById("id-find-task-input")
    .value.toLowerCase();
  var filteredTasks = tasks.filter(function (task) {
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

function deleteTask(taskId) {
  tasks.splice(getIndexOfElmentById(taskId, tasks), 1);
  closePopUp();
  setSesionStorage("tasks", tasks);
  renderTasks(tasks);
  setItem("tasks", JSON.stringify(tasks));
}

function clearAddTaskForm() {
  let subTasks = document.getElementById("subTasks");
  let initialArea = document.getElementById("initialArea");
  let newSubTaskField = document.getElementById("newSubTaskField");
  let initialen = document.getElementById("checkboxes");

  title.value = "";
  description.value = "";
  initialArea.innerHTML = "";
  subTasks.value = "";
  newSubTaskField.innerHTML = "";
  checkedUsers = [];
  initialen.innerHTML = "";
  furtherResetField();
  closePopUp();
}

function createTaskAtBoard() {
  if (checkCategoryInput()) {
    addTask();
    closePopUp();
    renderTasks(tasks);
  } else {
    setBorderColorForTimePeriod("containerCategory");
  }
}

function checkCategoryInput() {
  let inputCategory = document.getElementById("categoryDropdown");
  let categoryValue = inputCategory.textContent;
  if (categoryValue === "Select task category") {
    return false;
  } else {
    return true;
  }
}

function setBorderColorForTimePeriod(elementId) {
  let div = document.getElementById(elementId);
  div.style.borderColor = "red";
  setTimeout(() => {
    div.style.borderColor = "grey";
  }, 2000);
}

function renderTaskAssignedNames(i) {
  let nameArea = document.getElementById("contactsFieldBoardFullName");
  let checkedContacts = tasks[i].checkedUsers;
  for (let i = 0; i < checkedContacts.length; i++) {
    let chekedContact = checkedContacts[i].name;
    nameArea.innerHTML += renturnTaksAssignetContactNameHtml(chekedContact);
  }
}

function closeTaskFormTemplate() {
  closePopUp();
}
