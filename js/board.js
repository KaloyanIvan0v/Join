// let finishedSubTasks = [];
let subTasksGlobal = [];
let currentDraggedElement;
let checkedStatusSubtasks = false;

async function init_board() {
  await loadTasks();
  includeHTML();
  loadNewTasks(tasks);
  loadContacts();
  filterTaskListener();
  setSearchFieldBorderListener();
}

function returnHtmlShowToDos(singleTask, i, id) {
  return /*html*/ `
    <div id="taskCard${id}" class="task-card" draggable="true" ondragstart='startDragging(${id})' onclick="viewTaskDetails(${i},${id})">
        <div class="task-card-category">
            <span id="statementField${i}" class="which-statement">
                ${singleTask["category"]}
            </span>
        </div>
        
        <div class="header-area-card">
            <div class="ft-weight-700">
                ${singleTask["title"]}
            </div>
            <div class="task-msg">
                ${singleTask["description"]}
            </div>
        </div>

        <div class="subtasks-contacts">
            <div class="subtasks-loadbar-number">
                
            </div>

            <div class="contacts-area">
                <div id="contactsFieldBoard(${i})" class="contacts-board"></div>
                <div id="prioField${i}" class="prio-field">
                    ${singleTask["prio"]}
                </div>
            </div>
        </div>`;
}

function updateLoadbar(i) {
  let subTasks = tasks[i]["subTasks"].length;
  let loadbar = document.getElementById("loadBar");
  let progress = (finishedSubTasks.length / subTasks.length) * 100;
  loadbar.style.width = progress + "%";
}

function renderSubtaskProgressBarHtml(singleTask, finishedSubTasks) {
  return /*html*/ `
<div class="loadbar-container">
   <div id="loadBar" class="loadbar"></div>
  </div>
  <div class="number-done-subtasks">
    <span>${finishedSubTasks.length}/</span>
    <span>${singleTask["subTasks"].length} Subtasks</span>
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

async function loadNewTasks(taskList) {
  let taskAreas = diclareTaskAreas();
  taskAreas[0].innerHTML = "";
  taskAreas[1].innerHTML = "";
  taskAreas[2].innerHTML = "";
  taskAreas[3].innerHTML = "";
  for (i = 0; i < taskList.length; i++) {
    let singleTask = taskList[i];
    let id = taskList[i]["id"];
    let statement = taskList[i]["statement"];
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

function viewTaskDetails(i, id) {
  let dialogField = document.getElementById("taskOverlay");
  toggleBackgroundDialog();
  let currentTask = tasks[i];
  dialogField.innerHTML = "";
  dialogField.innerHTML = returnHtmlCurrentTask(currentTask, i, id);
  choosestatementColor(i);
  whichPriorityTaskCard(i, true);
  renderSubTasksBoard(i);
  handleHoverButtonDeleteEditTask();
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
  checkSubtaskBoardOverlayChecked();
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
  loadNewTasks(tasks);
}

function checkBooleanForPriority(priority, prioSelection, i) {
  if (priority["isPriority"] == false) {
    prioSelection.innerHTML += prioNormal(priority, i);
  } else {
    prioSelection.innerHTML += prioActive(priority, i);
    priority["isPriority"] = false;
  }
}

function returnHtmlEditCurrentTask(overlayTask, i) {
  return /*html*/ `
    <div class="overlay-current-task">
      <div id="categoryArea(${i})" class="overlay-first-row">
        <div></div>
        <a onclick="closeCurrentTask()">X</a>
    </div>

    <div class="title-edit-board">
      <div class="input-description">
        <div class="title-headline">
          <span>Title</span>
        </div>
      </div>
      <div>
        <input class="input-edit-title" id="title" type="text" value="${overlayTask["title"]}">
        <div>
          <span class="required-field-edit vs-hidden">This field is required</span>   
        </div>
      </div>
    </div>
    
    <div class="description-edit-board">
      <span>Description</span>
      <div>
        <textarea id="description(${i})">${overlayTask["description"]}</textarea>
        <div class="vs-hidden">
         <span class="required-field-edit">This field is required</span>
        </div>
      </div>
    </div>
    
    <div class="overlay-date font-overlay">
        <span>Due Date:</span>
        <input class="input-edit-title" type="date" value="${overlayTask["dueDate"]}" id="date(${i})">
        <div class="vs-hidden">
         <span class="required-field-edit">This field is required</span>
        </div>
    </div>
    
    <div class="prio-area" id="prioArea(${i})">
      <div onclick="prioSelect(${i}, 'urgent')">
        <img id="urgent(${i})" src="/img/urgent.png">
      </div>

      <div onclick="prioSelect(${i}, 'medium')">
        <img id="medium(${i})" src="/img/medium_highlight.png">
      </div>

      <div onclick="prioSelect(${i}, 'Low')">
        <img id="low(${i})" src="/img/low.png">
      </div>
    </div>

    <div class="overlay-assigned">
        <span>Assigned To:</span>
        <div onclick="showCheckboxes(event)" class="add-contacts-edit-board">
          <input onkeydown="searchContact()" tabindex="0" class="input-contacts-edit" id="inputToSearchContact" type="text" placeholder="Select contacts to assign">
          <div class="dropdown-icon">
            <img src="/img/arrow_drop_down.png" id="dropDownArrow">
          </div>
        </div>
        <div class="contacts-edit-board">
          <div id="contactsFieldBoard(${i})" class="contacts-edit-board"></div>
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
        <img src="/img/check-white.png">
      </button>
      </div>
    </div>
</div>`;
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

function returnHtmlCurrentTask(overlayTask, i, id) {
  return /*html*/ `
  <div class="overlay-current-task">
    <div id="categoryArea(${i})" class="overlay-first-row">
        <div class="overlay-category" id="statementField${i}">${overlayTask["category"]}</div>
        <a onclick="closeCurrentTask()">X</a>
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
        <div onclick="deleteTask(${id})" class="flex-center hover btn-hover-trash">
          <div class="img-hover-trash"></div>
          <span>Delete</span>
        </div>
        <img src="/img/Vector 3.png">
        <div onclick="editTaskOverlay(${i})" class="flex-center hover  btn-hover-edit">
         <div class="img-hover-edit"></div>
          <span>Edit</span>
        </div>
      </div>
    </div>
    </div>
  <div>`;
}

function returnHtmlSubtasks(subTask, j) {
  return /*html*/ `
    <div onclick="checkSubtaskBoardOverlay(${j})" class="subtasks-check-board">
      <img id="checkEmptySubtask(${j})" src="/img/check_empty.png">
      <span>${subTask}</span>
    </div>`;
}

function returnHtmlContactsInitialen(contactForTask, j) {
  return /*html*/ `
    <div id="initialArea${j}" class="contact-board mg-left-8">
      <span>${contactForTask["nameInitials"]}</span>
    </div>`;
}

function returnHtmlContactsFullName(currentTask) {
  return /*html*/ `
    <div class="full-name">
      <span>${currentTask["name"]}</span>
    </div>`;
}

// function prioNormal(priority, i) {
//   return `
//   <div id="prioUrgent" onclick="changePrio(${i})" class="selection-field hover-prio-btn ${priority['bgColorFalse']}">
//       <span class="fz-20">${priority['text']}</span>
//       <img id="imgUrgent" src="${priority['iconColor']}">
//   </div>`
// }

// function prioActive(priority, i) {
//   return `
//   <div id="prioUrgent" onclick="changePrio(${i})" class="selection-field ${priority['bgColorTrue']}">
//       <span class="fz-20">${priority['text']}</span>
//       <img id="imgUrgent" src="${priority['iconWhite']}">
//   </div>`
// }

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
  loadNewTasks(tasks);
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

function filterTaskListener() {
  document
    .getElementById("id-find-task-input")
    .addEventListener("input", () => renderFilteredTasks());
}

function renderFilteredTasks() {
  var inputValue = document
    .getElementById("id-find-task-input")
    .value.toLowerCase();
  var filteredTasks = tasks.filter(function (task) {
    return (
      task.title.toLowerCase().includes(inputValue) ||
      task.description.toLowerCase().includes(inputValue)
    );
  });
  loadNewTasks(filteredTasks);
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
  tasks.splice(tasks[getIndexOfElmentById(taskId)], 1);
  loadNewTasks(tasks);
  setSesionStorage("tasks", tasks);
  setItem("tasks", JSON.stringify(tasks));
}

function getIndexOfElmentById(id) {
  let index = 0;
  for (i = 0; i < tasks.length; i++) {
    if (tasks[i]["id"] == id) {
      index = i;
    }
  }
  return index;
}
