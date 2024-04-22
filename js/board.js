let finishedSubTasks = [];
let subTasksGlobal = [];
let currentDraggedElement;
let checkedStatusSubtasks = false;
let priorities = [
  {
      'text': 'Urgent',
      'iconWhite': '/img/urgent_white.png',
      'iconColor': '/img/urgent_red.png',
      'bgColorTrue': 'highlight-color-urgent',
      'bgColorFalse': 'bg-color-priority',
      'isPriority': false,
  },
  {
      'text': 'Medium',
      'iconWhite': '/img/medium_white.png',
      'iconColor': '/img/medium_orange.png',
      'bgColorTrue': 'highlight-color-medium',
      'bgColorFalse': 'bg-color-priority',
      'isPriority': true,
  },
  {
      'text': 'Low',
      'iconWhite': '/img/low_white.png',
      'iconColor': '/img/low_green.png',
      'bgColorTrue': 'highlight-color-low',
      'bgColorFalse': 'bg-color-priority',
      'isPriority': false,
  }
]

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
                <div class="loadbar-container">
                  <div id="loadBar" class="loadbar"></div>
                </div>
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
  renderContactsBoardInitialen(i);
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
  renderSubTasksBoard(i);
  updateLoadbar(i);
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
  checkSubtaskBoardOverlayChecked();
}

function checkSubtaskBoardOverlayChecked() {
  for (let i = 0; i < subTasksGlobal.length; i++) {
    let subTask = subTasksGlobal[i];
    if (finishedSubTasks.includes(subTask)) {
      let imgCheck = document.getElementById(`checkEmptySubtask(${i})`);
      imgCheck.src = "../img/box-checked.png";
    }
  }
}

function renderContactsBoardInitialen(i) {
  let contactsFieldBoard = document.getElementById(`contactsFieldBoard(${i})`);
  let contactsForTask = tasks[i]["assignedTo"];
  contactsFieldBoard.innerHTML = "";

  for (j = 0; j < contactsForTask.length; j++) {
    let contactForTask = contactsForTask[j];
    contactsFieldBoard.innerHTML += returnHtmlContactsInitialen(contactForTask, j);
    backgroundColorInitialsBoard(i, j);
  }
    renderFullName(i, contactsForTask);
}

function renderFullName(i, contactsForTask) {
  let backgroundDialog = document.getElementById("backgroundDialog")
  
  if(backgroundDialog.classList.contains('background-dialog')) {
    let contactsFieldBoard = document.getElementById(`contactsFieldBoardFullName(${i})`);
    contactsFieldBoard.innerHTML = '';

    for(j = 0; j < contactsForTask.length; j++) {
      fullName = contactsForTask[j];
      contactsFieldBoard.innerHTML += returnHtmlContactsFullName(fullName);
    }
  }
}

function updateLoadbar(i) {
  let subTasks = tasks[i]['subTasks'].length;
  let loadbar = document.getElementById('loadBar');
  let progress = (finishedSubTasks.length / subTasks.length) * 100;
  loadbar.style.width = progress + '%';
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
  let index = finishedSubTasks.findIndex(subTask => JSON.stringify(subTask) === JSON.stringify(currentSubTask));

  if(checkedStatusSubtasks == false) {
    finishedSubTasks.push(currentSubTask);
    imgCheck.src = "../img/box-checked.png"
    checkedStatusSubtasks = true;
    updateLoadbar(i);
  } else {
    updateLoadbar(i);
    finishedSubTasks[i].splice(index, 1);
    imgCheck.src = "../img/check_empty.png";
    checkedStatusSubtasks = false;
  }
}

function editTaskOverlay(i) {
  let overlayTask = tasks[i];
  let dialogField = document.getElementById("taskOverlay");
  dialogField.innerHTML = '';
  dialogField.innerHTML = returnHtmlEditCurrentTask(overlayTask, i);
  let prioSelection = document.getElementById(`prioArea(${i})`);

  whichPriority(prioSelection);
}

function changePrio(i) {
  currentPrio = priorities[i]['text'];
  priorities[i]['isPriority'] = true;
  editTaskOverlay(i)
  whichPriority();
}

function whichPriority(prioSelection) {
  prioSelection.innerHTML = '';

  for(i = 0; i < priorities.length; i++) {
      priority = priorities[i];
      checkBooleanForPriority(priority, prioSelection, i);
  }
}

function checkBooleanForPriority(priority, prioSelection, i) {
  if(priority['isPriority'] == false) {
      prioSelection.innerHTML += prioNormal(priority, i);
  } else {
      prioSelection.innerHTML += prioActive(priority, i);
      priority['isPriority'] = false;
  }
}

function returnHtmlEditCurrentTask(overlayTask, i) {
  return /*html*/`
      <div id="categoryArea(${i})" class="overlay-first-row">
        <div></div>
        <a onclick="showCurrentTask()">X</a>
    </div>

    <div class="description-input d-flex-column-center">
      <div class="input-description">
        <div class="title-headline">
          <span>Title</span>
          <span class="color-FF8190">*</span>
        </div>
      </div>
      <input class="input-field normal-border pd-12-16" id="title" type="text" value="${overlayTask["title"]}">
      <div id="title(${i})" class="required-field-title vs-hidden">
         <span class="error">This field is required</span>
      </div>
    </div>
    
    <div class="overlay-description font-overlay">
      <textarea id="description(${i})">${overlayTask["description"]}</textarea>
    </div>
    
    <div class="overlay-date font-overlay">
        <span>Due Date:</span>
        <input type="date" value="${overlayTask["dueDate"]}" id="date(${i})">
    </div>
    
    <div id="prioArea(${i})"></div>

    <div class="overlay-assigned font-overlay">
        <span>Assigned To:</span>
        <div class="d-flex">
          <div id="contactsFieldBoard(${i})" class="column-gap-contacts"></div>
        </div>
    </div>

    <div class="description-category d-flex-column-center">
      <span class="input-description">Subtasks</span>
        <div id="inputFieldSubtasks" class="input-field new-subtask normal-border">
          <input onclick="changeIconsSubtask(event)" class="input-new-subtask" type="text" id="subTasks" placeholder="Add new subtask">
          <a id="addIconSubtasks" class="icon-subtask-field"><img src="/img/add.png"></a>
        </div>
        <div id="newSubTaskField"></div>
    </div>

    <div class="last-section-overlay">
      <div></div>
      <div class="delete-edit-overlay">
      <button class="btn-add-task" onclick="resetInputFields(); return false">
        <span class="typography-clear">Ok</span>
        <img src="../img/check-white.png">
      </button>
      </div>
    </div>`
}

function returnHtmlCurrentTask(overlayTask, i) {
  return /*html*/`
    <div id="categoryArea(${i})" class="overlay-first-row">
        <div class="overlay-statement" id="statementField${i}">${overlayTask["statement"]}</div>
        <a onclick="showCurrentTask()">X</a>
    </div>
    <div class="overlay-title">
        <span id="title(${i})">${overlayTask["title"]}</span>
    </div>
    <div class="overlay-description font-overlay">
      <span id="description(${i})">${overlayTask["description"]}</span>
    </div>
    <div class="overlay-date font-overlay">
        <span>Due Date:</span>
        <span id="date(${i})">${overlayTask["dueDate"]}</span>
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
        <div class="d-flex">
          <div id="contactsFieldBoard(${i})" class="column-gap-contacts"></div>
          <div id="contactsFieldBoardFullName(${i})" class="column-gap-contacts"></div>
        </div>
    </div>
    <div class="overlay-subtasks font-overlay">
      <span>Subtasks</span>
      <div id="subTasksField${i}" class="input-subtasks-overlay"></div>
    </div>
    <div class="last-section-overlay">
      <div></div>
      <div class="delete-edit-overlay">
        <div class="flex-center">
          <img src="../img/trashbin.png">
          <span>Delete</span>
        </div>
        <img src="../img/Vector 3.png">
        <div onclick="editTaskOverlay(${i})" class="flex-center">
          <img src="../img/edit_pencil.png">
          <span>Edit</span>
        </div>
      </div>
    </div>
    </div>`;
}

function returnHtmlSubtasks(subTask, j) {
  return /*html*/`
    <div onclick="checkSubtaskBoardOverlay(${j})" class="subtasks-check-board">
      <img id="checkEmptySubtask(${j})" src="../img/check_empty.png">
      <span>${subTask}</span>
    </div>`;
}

function returnHtmlContactsInitialen(contactForTask, j) {
  return /*html*/`
    <div id="initialArea${j}" class="contact-board mg-left-8">
      <span>${contactForTask["nameInitials"]}</span>
    </div>`;
} 

function returnHtmlContactsFullName(currentTask) {
  return /*html*/`
    <div class="full-name">
      <span>${currentTask['name']}</span>
    </div>`
}

function prioNormal(priority, i) {
  return `
  <div id="prioUrgent" onclick="changePrio(${i})" class="selection-field hover-prio-btn ${priority['bgColorFalse']}">
      <span class="fz-20">${priority['text']}</span>
      <img id="imgUrgent" src="${priority['iconColor']}">
  </div>`
}

function prioActive(priority, i) {
  return `
  <div id="prioUrgent" onclick="changePrio(${i})" class="selection-field ${priority['bgColorTrue']}">
      <span class="fz-20">${priority['text']}</span>
      <img id="imgUrgent" src="${priority['iconWhite']}">
  </div>`
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
