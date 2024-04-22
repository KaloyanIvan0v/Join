let finishedSubTasks = [];
let currentDraggedElement;
async function init_board() {
  await loadTasks();
  includeHTML();
  loadNewTasks();
  loadContacts();
}

function returnHtmlShowToDos(singleTask, i, id) {
  return /*html*/ `
    <div id="taskCard${id}" class="task-card" draggable="true" ondragstart='startDragging(${id})' onclick="showCurrentTask(${i})">
        <div class="task-card-statement">
            <span id="statementField${i}" class="which-statement">
                ${singleTask["statement"]}
            </span>
        </div>
        
        <div class="header-area-card">
            <div class="ft-weight-700">
                ${singleTask["title"]}
            </div>
            <div class="">
                ${singleTask["description"]}
            </div>
        </div>

        <div class="subtasks-contacts">
            <div class="subtasks-loadbar-number">
                <span><i>loadbar must to do</i></span>
                <div class="number-done-subtasks">
                    <span>${finishedSubTasks.length}/</span>
                    <span>${singleTask["subTasks"].length} Subtasks</span>
                </div>
            </div>

            <div class="contacts-area">
                <div id="contactsFieldBoard(${i})" class="contacts-board"></div>
                <div id="prioField${i}" class="prio-field">
                    ${singleTask["prio"]}
                </div>
            </div>
        </div>
        `;
}

function diclareTaskAreas() {
  let toDoField = document.getElementById("statementToDo");
  let inProgressField = document.getElementById("statementInProgress");
  let awaitFeedbackField = document.getElementById("statementAwaitFeedback");
  let doneField = document.getElementById("statementDone");
  return [toDoField, inProgressField, awaitFeedbackField, doneField];
}

async function loadNewTasks() {
  let taskAreas = diclareTaskAreas();
  taskAreas[0].innerHTML = "";
  taskAreas[1].innerHTML = "";
  taskAreas[2].innerHTML = "";
  taskAreas[3].innerHTML = "";
  for (i = 0; i < tasks.length; i++) {
    let singleTask = tasks[i];
    let id = tasks[i]["id"];
    let statement = tasks[i]["statement"];
    if (statement == "toDo") {
      taskAreas[0].innerHTML += returnHtmlShowToDos(singleTask, i, id);
    } else if (statement == "inProgress") {
      taskAreas[1].innerHTML += returnHtmlShowToDos(singleTask, i, id);
    } else if (statement == "awaitFeedback") {
      taskAreas[2].innerHTML += returnHtmlShowToDos(singleTask, i, id);
    } else if (statement == "done") {
      taskAreas[3].innerHTML += returnHtmlShowToDos(singleTask, i, id);
    }
    choosestatementColor(i);
  }
  checkIfTaskAreaIsEmpty();
}

function choosestatementColor(i) {
  let statementField = document.getElementById(`statementField${i}`);
  let singleTaskstatement = tasks[i]["statement"];

  if (singleTaskstatement == "Technical Task") {
    statementField.classList.add("bg-color-technical-task");
  } else {
    statementField.classList.add("bg-color-user-story");
  }
  whichPriorityTaskCard(i);
}

function whichPriorityTaskCard(i) {
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
  renderContactsBoard(i);
}

function showCurrentTask(i) {
  let backgroundDialog = document.getElementById("backgroundDialog");
  let dialogField = document.getElementById("taskOverlay");
  let currentTask = tasks[i];

  backgroundDialog.classList.toggle("background-dialog");
  dialogField.innerHTML = "";
  dialogField.innerHTML = returnHtmlCurrentTask(currentTask, i);
  choosestatementColor(i);
  whichPriorityTaskCard(i);
  renderContactsBoard(i);
  renderSubTasksBoard(i);
}

function renderSubTasksBoard(i) {
  let subTasksField = document.getElementById(`subTasksField${i}`);
  let subTasks = tasks[i]["subTasks"];
  subTasksField.innerHTML = "";

  for (j = 0; j < subTasks.length; j++) {
    let subTask = subTasks[j];
    subTasksField.innerHTML += returnHtmlSubtasks(subTask);
  }
  renderContactsBoard(i);
}
function renderContactsBoard(i) {
  let contactsFieldBoard = document.getElementById(`contactsFieldBoard(${i})`);
  let contactsForTask = tasks[i]["assignedTo"];
  contactsFieldBoard.innerHTML = "";
}
function renderContactsBoard(i) {
  let contactsFieldBoard = document.getElementById(`contactsFieldBoard(${i})`);
  let contactsForTask = tasks[i]["assignedTo"];
  contactsFieldBoard.innerHTML = "";

  for (j = 0; j < contactsForTask.length; j++) {
    let contactForTask = contactsForTask[j];
    contactsFieldBoard.innerHTML += returnHtmlContacts(contactForTask, j);
    backgroundColorInitialsBoard(i, j);
  }
}

function backgroundColorInitialsBoard(i, j) {
  let initialArea = document.getElementById(`initialArea${j}`);
  let colorNumber = tasks[i]["checkedUsers"][j]["color"];
  let bgColor = contactColor[colorNumber];
  initialArea.style.backgroundColor = bgColor;
  initialArea.removeAttribute("id");
}

function returnHtmlCurrentTask(overlayTask, i) {
  return `
    <div class="overlay-first-row">
        <div class="overlay-statement" id="statementField${i}">${overlayTask["statement"]}</div>
        <a onclick="showCurrentTask()">X</a>
    </div>
    <div class="overlay-title">
        ${overlayTask["title"]}
    </div>
    <div class="overlay-description font-overlay">
        ${overlayTask["description"]}
    </div>
    <div class="overlay-date font-overlay">
        <span>Due Date:</span>
        <span>${overlayTask["dueDate"]}</span>
    </div>
    <div class="overlay-prio font-overlay">
        <span>Priority:</span>
        <div class="prio-name-image">
            <span>${overlayTask["prio"]}</span>
            <div id="prioField${i}"></div>
        </div>
    </div>
    <div class="overlay-assigned font-overlay">
        <span>Assigned To:</span>
        <div id="contactsFieldBoard(${i})" class="overlay-assigned-contacts"></div>
    </div>
    <div class="overlay-subtasks font-overlay">
    <span>Subtasks</span>
    <div id="subTasksField${i}" class="input-subtasks-overlay"></div>
</div>
    </div>`;
}

function returnHtmlSubtasks(subTask) {
  return `
    <label class="style-sub-tasks font-overlay-subtasks" for="box${i}">
    <input type="checkbox">${subTask}</label>`;
}

function returnHtmlContacts(contactForTask, j) {
  return `
    <div id="initialArea${j}" class="contact-board">${contactForTask["nameInitials"]}</div>`;
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
  loadNewTasks();
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
  let taskAreas = diclareTaskAreas();
  for (i = 0; i < taskAreas.length; i++) {
    if (taskAreas[i].innerHTML == "") {
      let statement = getStatementByTaskI(i);
      taskAreas[i].innerHTML = taskAreaIsEmptyHtml(statement);
    }
  }
}

function taskAreaIsEmptyHtml(statement) {
  return /*html*/ `
  <div class="task-area-empty-mgs">
    no tasks ${statement}
  </div>
  `;
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
  let taskAreas = diclareTaskAreas();
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

function previewElementHtml(positon) {
  return /*html*/ `
  <div class="preview-element-${positon}"></div>
  `;
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
