let currentDraggedElement;
let checkedStatusSubtasks = false;

async function init_board() {
  await loadTasks();
  await includeHTML();
  renderTasks(getFilteredTasks());
  loadContacts();
  filterTaskListener();
  setSearchFieldBorderListener();
}

function openPopUp() {
  document.getElementById("id-shadow-layer").classList.remove("visibility-hidden");
}

function openAddTaskTemplate() {
  openPopUp();
  let idPopUp = document.getElementById("id-pop-up");
  idPopUp.innerHTML += returnHtmlTaskTemplate(
    "createTaskAtBoard",
    "closeTaskFormTemplate",
    "cancle"
  );
  selectPriority();
  currentDate();
  renderExitCross("id-headline-area");
  changePrio(1);
}

function closePopUp() {
  document.getElementById("id-shadow-layer").classList.add("visibility-hidden");
  document.getElementById("id-pop-up").innerHTML = "";
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
    let singleTask = taskList[i];
    let id = taskList[i]["id"];
    taskAreas[sectionIdForTask(taskList)].innerHTML += returnHtmlShowToDos(singleTask, i, id);
    choosestatementColor(i, taskList, id);
    renderSubtaskProgressBar(id);
  }
  checkIfTaskAreaIsEmpty();
}

function renderSubtaskProgressBar(id) {
  let subTasksLength = tasks[getIndexOfElmentById(id, tasks)].subTasks.length;
  let funishedSubTasks = getFinishedSubTasksLength(id);
  if (subTasksLength == 0) {
    return;
  }
  let progressSection = document.getElementById(`id-subtasks-progress-section${id}`);
  progressSection.classList.remove("hide");
  let loadStatusText = document.getElementById(`subtasks-progress-text${id}`);
  loadStatusText.innerHTML = `${funishedSubTasks}/${subTasksLength} Subtasks`;
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
    element[i].innerHTML = "";
  }
}

function choosestatementColor(i, list, id) {
  let statementField = document.getElementById(`statementField${i}`);
  let singleTaskstatement = list[i]["category"];
  if (singleTaskstatement == "Technical Task") {
    statementField.classList.add("bg-color-technical-task");
  } else {
    statementField.classList.add("bg-color-user-story");
  }
  whichPriorityTaskCard(i, false, list, id);
}

function whichPriorityTaskCard(i, renderFull, list, id) {
  let prioField = document.getElementById(`prioField${i}`);
  let singleTaskPrio = tasks[getIndexOfElmentById(id, tasks)]["prio"];
  prioField.innerHTML = "";
  if (singleTaskPrio == "Low") {
    prioField.innerHTML = '<img src="' + "/img/low_green.png" + '" alt="Bildbeschreibung">';
  } else if (singleTaskPrio == "medium") {
    prioField.innerHTML = '<img src="' + "/img/medium_orange.png" + '" alt="Bildbeschreibung">';
  } else {
    prioField.innerHTML = '<img src="' + "/img/urgent_red.png" + '" alt="Bildbeschreibung">';
  }
  renderContactsBoardInitialen(i, renderFull, list);
}

function openTaskDetailView(i, id) {
  openPopUp();
  let popUpDiv = document.getElementById("id-pop-up");
  popUpDiv.innerHTML = openTaskDetailViewHtml(tasks[getIndexOfElmentById(id, tasks)], i, id);
  choosestatementColor(i, getFilteredTasks(), id);
  whichPriorityTaskCard(i, true, getFilteredTasks(), id);
  handleHoverButtonDeleteEditTask();
  renderTaskAssignedNames(i, id);
  renderSubTasksBoard(i, id);
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

function renderSubTasksBoard(i, id) {
  let subTasksField = document.getElementById(`subTasksField`);
  let subTasks = tasks[getIndexOfElmentById(id, tasks)]["subTasks"];
  subTasksField.innerHTML = "";

  for (j = 0; j < subTasks.length; j++) {
    let imgSrc;
    let subTask = subTasks[j].subTask;
    let subTaskId = subTasks[j].id;
    let subTaskStatus = subTasks[j].status;
    if (subTaskStatus == true) {
      imgSrc = "/img/box-checked.png";
    } else {
      imgSrc = "/img/check_empty.png";
    }
    subTasksField.innerHTML += returnHtmlSubtasks(subTask, i, subTaskId, imgSrc);
  }
}

function renderContactsBoardInitialen(i, renderFull, list) {
  let contactsFieldBoard = document.getElementById(`contactsFieldBoard(${i})`);
  let contactsForTask = list[i]["assignedTo"];
  contactsFieldBoard.innerHTML = "";
  for (j = 0; j < contactsForTask.length; j++) {
    if (j < 3 || renderFull == true) {
      let contactForTask = contactsForTask[j];
      contactsFieldBoard.innerHTML += returnHtmlContactsInitialen(contactForTask, j);
      backgroundColorInitialsBoard(i, j, list);
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
    let contactsFieldBoard = document.getElementById(`contactsFieldBoardFullName(${i})`);
    contactsFieldBoard.innerHTML = "";
    for (j = 0; j < contactsForTask.length; j++) {
      fullName = contactsForTask[j];
      contactsFieldBoard.innerHTML += returnHtmlContactsFullName(fullName);
    }
  }
}

function backgroundColorInitialsBoard(i, j, list) {
  let initialArea = document.getElementById(`initialArea${j}`);
  let colorNumber = list[i]["checkedUsers"][j]["color"];
  let bgColor = contactColor[colorNumber];
  initialArea.style.backgroundColor = bgColor;
  initialArea.removeAttribute("id");
}

function editTaskOverlay(i, id) {
  let overlayTask = tasks[getIndexOfElmentById(id, tasks)];
  let dialogField = document.getElementById("id-pop-up");
  let currentPrio = overlayTask["prio"];
  dialogField.innerHTML = "";
  dialogField.innerHTML = returnHtmlEditCurrentTask(overlayTask, i);

  prioSelect(i, currentPrio);
  renderContactsBoardInitialen(i, false, getFilteredTasks());
  //changeIconsSubtask();
  //renderSubTasksIntoEditTask(id);
}

// function renderSubTasksIntoEditTask(id) {
//   let subTasksField = document.getElementById(`newSubTaskField`);
//   let subTasks = tasks[getIndexOfElmentById(id, tasks)]["subTasks"];
//   subTasksField.innerHTML = "";

//   for (j = 0; j < subTasks.length; j++) {
//     let subTask = subTasks[j].subTask;
//     let subTaskId = subTasks[j].id;
//     subTasksField.innerHTML += returnHtmlSubtasks(subTask, j, subTaskId, id);
//   }
// }

// function returnHtmlSubtasks(subTask, i, subTaskId, id) {
//   return /*html*/ `
//     <li class="hover-subtask" onclick="editSubtaskBoard(${subTaskId},${i},${id})" id="subTaskElement${i}">${subTask}</li>`;
// }

// function editSubtaskBoard(subTaksId, i, id) {
//   let subTasksField = document.getElementById(`newSubTaskField`);
//   let subTask = tasks[getIndexOfElmentById(id, tasks)]["subTask"];
//   subTasksField.classList.add("list-element-subtasks");
//   subTasksField.classList.remove("hover-subtask");
//   subTasksField.innerHTML = editSubtaskHtml(i, subTask);
//   inputFocus(i);
// }

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

function prioSelect(i, prioSelect) {
  let urgent = document.getElementById(`urgent(${i})`);
  let medium = document.getElementById(`medium(${i})`);
  let low = document.getElementById(`low(${i})`);
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
  renderTasks(getFilteredTasks());
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
  let width = document.getElementById(`taskCard${currentDraggedElement}`).offsetWidth;
  let height = document.getElementById(`taskCard${currentDraggedElement}`).offsetHeight;
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
  var inputValue = document.getElementById("id-find-task-input").value.toLowerCase();
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
  renderTasks(getFilteredTasks());
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
    renderTasks(getFilteredTasks());
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

function renderTaskAssignedNames(i, id) {
  let nameArea = document.getElementById("contactsFieldBoardFullName");
  let checkedContacts = tasks[getIndexOfElmentById(id, tasks)].checkedUsers;
  for (let i = 0; i < checkedContacts.length; i++) {
    let chekedContact = checkedContacts[i].name;
    nameArea.innerHTML += renturnTaksAssignetContactNameHtml(chekedContact);
  }
}

function closeTaskFormTemplate(event) {
  if (event) {
    event.preventDefault();
  }
  addTaskFormResetFields();
  closePopUp();
}

function addTaskFormResetFields() {
  clearContactsChecked();
}

function toggleCheckboxSubTask(i, subTaskId, id) {
  if (getSubtaskStatus(i, subTaskId)) {
    tasks[i].subTasks[getIndexOfElmentById(subTaskId, tasks[i].subTasks)].status = false;
  } else {
    tasks[i].subTasks[getIndexOfElmentById(subTaskId, tasks[i].subTasks)].status = true;
  }
  renderSubTasksBoard(i, id);
  setItem("tasks", tasks);
}

function getSubtaskStatus(i, subTaskId) {
  let subTaskStatus = tasks[i].subTasks[getIndexOfElmentById(subTaskId, tasks[i].subTasks)].status;
  return subTaskStatus;
}

function closeEditTaskPopUp() {
  setTimeout(closePopUp, 20);
}

function closeAddTaskPopUp() {
  resetInputFields();
  setTimeout(closePopUp, 20);
}

function renderExitCross(elementId) {
  let div = document.getElementById(elementId);
  div.innerHTML += returnExitCrossHtml();
}

function returnExitCrossHtml() {
  return /*html*/ `
  <div class="exit-cross" onclick="closeAddTaskPopUp()">
    <img src="/img/close-dark.svg">
  </div>
  `;
}

function saveTaskChanges(id) {}
