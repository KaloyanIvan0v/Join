function editTaskOverlay(i, id) {
  let overlayTask = tasks[getIndexOfElmentById(id, tasks)];
  let dialogField = document.getElementById("id-pop-up");
  let currentPrio = overlayTask["prio"];
  let contactsField = document.getElementById("contactsField");
  dialogField.innerHTML = "";
  dialogField.innerHTML = returnHtmlEditCurrentTask(overlayTask, i, id);
  prioSelect(id, currentPrio);
  setUsersForEditTask(id);
  renderSubTasksEdit(id);
}

function renderSubTasksEdit(id) {
  let input = document.getElementById("subTasks");
  let subTasks = tasks[getIndexOfElmentById(id, tasks)]["subTasks"];
  for (j = 0; j < subTasks.length; j++) {
    input.value = subTasks[j].subTask;
    let subTaskState = subTasks[j].status;
    addNewSubTaskBoard(subTaskState);
    input.value = "";
  }
}

function addNewSubTaskBoard(subTaskState) {
  let id = increaseId(subTasks);
  let subTaskStatus;
  let singleNewTask = document.getElementById("subTasks");
  let singleNewTaskValue = singleNewTask.value;

  if (singleNewTaskValue.length >= 3) {
    if (subTaskState == true) {
      subTaskStatus = true;
    } else {
      subTaskStatus = false;
    }
    subTasks.push({
      subTask: singleNewTaskValue,
      status: subTaskStatus,
      id: id,
    });
  }
  singleNewTask.blur();
  renderSubTasks("newSubtask");
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
    subTasksField.innerHTML += returnHtmlSubtasks(subTask, i, subTaskId, imgSrc, id);
  }
}
function safeTaskChanges(id) {
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let dueDate = document.getElementById("dueDate").value;
  let assignedTo = checkedUsers;
  tasks[getIndexOfElmentById(id, tasks)].title = title;
  tasks[getIndexOfElmentById(id, tasks)].description = description;
  tasks[getIndexOfElmentById(id, tasks)].dueDate = dueDate;
  tasks[getIndexOfElmentById(id, tasks)].assignedTo = assignedTo;
  tasks[getIndexOfElmentById(id, tasks)].subTasks = subTasks;
  setSesionStorage("tasks", tasks);
  setItem("tasks", tasks);
  closeEditTaskPopUp();
  subTasks = [];
  tasks = JSON.parse(sessionStorage.getItem("tasks"));
  renderTasks(getFilteredTasks());
}

function closeEditTaskPopUp() {
  clearAssignedSection();
  setTimeout(closePopUp, 20);
  arrowToggleCheck = false;
  subTasks = [];
}

function setUsersForEditTask(taksId) {
  let assignedToIds = retrieveIdsFromTwoLevelNestedArrayById(taksId, tasks, "assignedTo");
  showOrHideContacts(event);
  for (i = 0; i < contacts.length; i++) {
    contactId = contacts[i]["id"];
    if (assignedToIds.includes(contactId)) {
      selectedUser(event, contactId);
    }
  }
  showOrHideContacts(event);
}

function renderTaskAssignedNames(id) {
  let nameArea = document.getElementById("contactsFieldBoardFullName");
  let checkedContacts = tasks[getIndexOfElmentById(id, tasks)].assignedTo;
  for (let i = 0; i < checkedContacts.length; i++) {
    if (contactExists(checkedContacts[i])) {
      let chekedContact = checkedContacts[i].name;
      nameArea.innerHTML += renturnTaksAssignetContactNameHtml(chekedContact);
    }
  }
}
