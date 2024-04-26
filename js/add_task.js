let currentPrio = ["medium"];
let taskCategory = [];
let idNumber = [];
let subTasks = [];
let checkedUsers = [];
let searchContacts = [];
let finishedSubTasks = [];
let checkChangeIcons = false;
let expanded = false;
let checkBoxContact = false;
// let inputBorderError = false;
let arrowToggleCheck = false;
// let priorities = [
//     {
//         'text': 'Urgent', 'iconWhite': '/img/urgent_white.png', 'iconColor': '/img/urgent_red.png', 'bgColorTrue': 'highlight-color-urgent', 'bgColorFalse': 'bg-color-priority','isPriority': false,
//     },
//     {
//         'text': 'Medium', 'iconWhite': '/img/medium_white.png', 'iconColor': '/img/medium_orange.png', 'bgColorTrue': 'highlight-color-medium', 'bgColorFalse': 'bg-color-priority', 'isPriority': true,
//     },
//     {   'text': 'Low',    'iconWhite': '/img/low_white.png',     'iconColor': '/img/low_green.png',  'bgColorTrue': 'highlight-color-low',    'bgColorFalse': 'bg-color-priority',   'isPriority': false,
//     }
// ]

function init() {
  includeHTML();
  setTimeout(loadFirstLettersFromSessionStorage, 200);
  loadTasks();
  loadContacts();
  // whichPriority();
  loadUsers();
  currentDate();
}

async function addTask() {
  let idNumber = increaseId();
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let dueDate = document.getElementById("dueDate");
  let subTaskForTask = subTasks;
  let checkedUsersForTask = checkedUsers;

  let task = {
    title: title.value,
    description: description.value,
    assignedTo: checkedUsers,
    dueDate: dueDate.value,
    prio: currentPrio,
    category: taskCategory,
    subTasks: subTaskForTask,
    finishedSubTasks: finishedSubTasks,
    checkedUsers: checkedUsersForTask,
    statement: "toDo",
    id: idNumber,
  };
  tasks.push(task);
  addedToBoard();
  await setItem("tasks", tasks);
  resetInputFields();
  window.location.href = "board.html";
}

function increaseId() {
  let lastTaskofTasks = tasks.length - 1;

  if (lastTaskofTasks == -1) {
    return (currentId = 0);
  } else {
    let currentId = tasks[lastTaskofTasks]["id"];
    currentId++;
    return currentId;
  }
}

function addedToBoard() {
  let bgDialog = document.getElementById("bgDialog");

  bgDialog.classList.remove("vs-hidden");
  bgDialog.classList.add("align-center");
}

function resetInputFields() {
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
}

function furtherResetField() {
  currentDate();
  changeCategory("Select task category");
  setItem("subTasks", []);
  // changePrio(1);

  checkChangeIcons = true;
  changeIconsSubtask();
}

function currentDate() {
  let inputDateField = document.getElementById("dueDate");
  let todayDate = new Date();
  let year = todayDate.getFullYear();
  let month = todayDate.getMonth() + 1;
  let day = todayDate.getDate();

  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  let currentDate = year + "-" + month + "-" + day;
  inputDateField.value = currentDate;
}

function prioSelectAddTask(prioSelect) {
  let urgent = document.getElementById(`urgent`);
  let medium = document.getElementById(`medium`);
  let low = document.getElementById(`low`);
  // setItem('tasks', tasks);

  if (prioSelect == "urgent") {
    urgent.src = "../img/urgent_highlight.png";
    medium.src = "../img/medium.png";
    low.src = "../img/low.png";
    currentPrio = "urgent";
  } else if (prioSelect == "medium") {
    urgent.src = "../img/urgent.png";
    medium.src = "../img/medium_highlight.png";
    low.src = "../img/low.png";
    currentPrio = "medium";
  } else {
    urgent.src = "../img/urgent.png";
    medium.src = "../img/medium.png";
    low.src = "../img/low_highlight.png";
    currentPrio = "Low";
  }
}

// function changePrio(i) {
//     currentPrio = priorities[i]['text'];
//     priorities[i]['isPriority'] = true;
//     whichPriority();
// }

// function whichPriority() {
//     let prioSelection = document.getElementById('prioSelection');
//     prioSelection.innerHTML = '';

//     for(i = 0; i < priorities.length; i++) {
//         priority = priorities[i];
//         checkBooleanForPriority(priority);
//     }
// }

// function checkBooleanForPriority(priority) {
//     if(priority['isPriority'] == false) {
//         prioSelection.innerHTML += prioNormal(priority);
//     } else {
//         prioSelection.innerHTML += prioActive(priority);
//         priority['isPriority'] = false;
//     }
// }

// <-------------Subtasks functions----------------->

function addNewSubTask() {
  let singleNewTask = document.getElementById("subTasks");
  let singleNewTaskValue = singleNewTask.value;

  if (singleNewTaskValue.length >= 3) {
    subTasks.push(singleNewTaskValue);
  }
  renderSubTasks("newSubtask");
}

function resetAddNewSubtask() {
  let subTasks = document.getElementById("subTasks");
  subTasks.value = "";
  checkChangeIcons = true;
  changeIconsSubtask();
}

function renderSubTasks(operator) {
  let newTaskField = document.getElementById("newSubTaskField");
  let singleNewTask = document.getElementById("subTasks");
  singleNewTask.value = "";
  newTaskField.innerHTML = "";

  for (i = 0; i < subTasks.length; i++) {
    let newSubTask = subTasks[i];
    newTaskField.innerHTML += returnHtmlNewSubtasks(newSubTask);
  }
  checkIfNewSubTask(operator);
}

async function checkIfNewSubTask(operator) {
  if (operator == "newSubtask") {
    checkChangeIcons = true;
    changeIconsSubtask();
    await setItem("subTasks", subTasks);
  }
}

function changeIconsSubtask() {
  let addIconSubtasks = document.getElementById("addIconSubtasks");
  let subTask = document.getElementById("inputFieldSubtasks");

  addIconSubtasks.innerHTML = "";

  if (checkChangeIcons == false) {
    addIconSubtasks.innerHTML = returnHtmlCheckAndClear();
    subTask.classList.add("fill-border");
    checkChangeIcons = false;
    renderSubTasks();
  } else {
    addIconSubtasks.innerHTML = returnHtmlAdd();
    subTask.classList.remove("fill-border");
    checkChangeIcons = false;
  }
  renderSubTasks();
}

function preventFocusLoss(event) {
  event.preventDefault();
}

function showCheckboxes(event) {
  // preventFocusLoss(event);
  let checkboxes = document.getElementById("checkboxes");
  let assignedBtn = document.getElementById("inputToSearchContact");

  if (!expanded) {
    toggleDropDownArrow("dropDownArrow");
    // preventFocusLoss(event);
    // assignedBtn.focus();
    checkboxes.classList.remove("vs-hidden");
    assignedBtn.placeholder = "Search Contact";
    // assignedBtn.classList.add('fill-border');
    renderAssignedToField(contacts);

    expanded = true;
  } else {
    toggleDropDownArrow("dropDownArrow");
    assignedBtn.blur();
    // checkboxes.classList.add('vs-hidden');
    assignedBtn.classList.remove("fill-border");
    toggleUserListInitials(assignedBtn);
    expanded = false;
    showInitials();
  }
}

function toggleDropDownArrow(idImage) {
  let arrow = document.getElementById(idImage);
  if (arrowToggleCheck == false) {
    arrow.src = "../img/arrow_drop_down_up.png";
    arrowToggleCheck = true;
  } else {
    arrow.src = "../img/arrow_drop_down.png";
    arrowToggleCheck = false;
  }
}

function toggleUserListInitials(assigned) {
  let checkboxes = document.getElementById("checkboxes");

  checkboxes.classList.toggle("user-list");
  checkboxes.classList.toggle("d-flex-initials");
}

function renderAssignedToField(arrayToRender) {
  let userCheckBox = document.getElementById("checkboxes");
  userCheckBox.innerHTML = "";

  if (!userCheckBox.classList.contains("user-list")) {
    toggleUserListInitials();
  }

  for (i = 0; i < arrayToRender.length; i++) {
    user = arrayToRender[i];
    userCheckBox.innerHTML += returnHtmlSingleContact(user);
    backgroundColorInitials(i, "none");
  }

  if (checkedUsers.length > 0) {
    for (i = 0; i < arrayToRender.length; i++) {
      examineUser(i);
    }
  }
}

function examineUser(i) {
  // let currentLabel = document.getElementById(`checkBox${i}`);
  // let checkBox = document.getElementById(`checkBox${i}`);
  let currentName = contacts[i]["name"];
  let index = checkedUsers.findIndex(
    (item) => JSON.stringify(item["name"]) === JSON.stringify(currentName)
  );

  if (index != -1) {
    toggleForCheckedUser(i);
    // checkBox.classList.remove('box-unchecked');
    // userField.classList.add('bg-checked');
    // userField.classList.toggle('hover-user-field');
    // paddingForChecked.classList.toggle('pd-right-16');
    // paddingForChecked.classList.toggle('hover-assigned');
  }
}

function toggleForCheckedUser(i) {
  let userField = document.getElementById(`userField${i}`);
  let paddingForChecked = document.getElementById(`paddingForChecked${i}`);

  // checkBox.classList.toggle('box-unchecked');
  // userField.classList.toggle('bg-checked');
  userField.classList.toggle("hover-user-field");
  paddingForChecked.classList.toggle("pd-right-16");
  paddingForChecked.classList.toggle("hover-assigned");
}

function backgroundColorInitials(i, whichArea) {
  if (whichArea == "showInitial") {
    let checkedUserColor = checkedUsers[i]["color"];
    let bgColorCheckedUser = contactColor[checkedUserColor];
    let bgInitials = document.getElementById(`initialArea${i}`);
    bgInitials.style.backgroundColor = bgColorCheckedUser;
  } else {
    let currentColor = contacts[i]["color"];
    let bgColorContacts = contactColor[currentColor];
    let bgInitials = document.getElementById(`bgInitials${i}`);
    bgInitials.style.backgroundColor = bgColorContacts;
  }
}

function selectedUser(i) {
  let singleUser = contacts[i];
  let currentIndex = checkedUsers.indexOf(singleUser);

  if (!checkedUsers.includes(singleUser, 0)) {
    checkedUsers.push(singleUser);
    // toggleForCheckedUser(i);
  } else {
    checkedUsers.splice(currentIndex, 1);
    // toggleForCheckedUser(i);
  }
  toggleForCheckedUser(i);
  toggleCheckbox(i);
}

function toggleCheckbox(i) {
  let checkBox = document.getElementById(`checkBox${i}`);

  if (checkBoxContact == true) {
    checkBox.src = "../img/box-unchecked.png";
    checkBoxContact = false;
  } else {
    checkBox.src = "../img/Check button.png";
    checkBoxContact = true;
  }
}

function showInitials() {
  let initialsArea = document.getElementById("checkboxes");
  initialsArea.innerHTML = "";

  for (i = 0; i < checkedUsers.length; i++) {
    let singleUser = checkedUsers[i]["name"];
    let nameParts = singleUser.split(" ");
    let firstLetter = nameParts[0].substring(0, 1);
    if (nameParts.length == 2) {
      let secondLetter = nameParts[1].substring(0, 1);
      let nameInitial = firstLetter + secondLetter;
      initial = nameInitial;
    } else {
      initial = firstLetter;
    }
    initialsArea.innerHTML += loadInitial(i, initial);
    backgroundColorInitials(i, "showInitial");
  }
}

function searchContact() {
  let inputSearchContact = document.getElementById(
    "inputToSearchContact"
  ).value;
  inputSearchContact = inputSearchContact.toLowerCase();

  searchContacts.splice(0, searchContacts.length);
  if (inputSearchContact.length > 1) {
    for (i = 0; i < contacts.length; i++) {
      contact = contacts[i]["name"];
      let contactComplete = contacts[i];
      if (contact.toLowerCase().includes(inputSearchContact)) {
        searchContacts.push(contactComplete);
      }
    }
    renderAssignedToField(searchContacts);
  } else if (inputSearchContact.length == 1) {
    renderAssignedToField(contacts);
  }
}

function editSubtask(i) {
  let subTaskField = document.getElementById(`subTaskElement${i}`);
  let subTask = subTasks[i];
  let subTaskElement = document.getElementById(`subTaskElement${i}`);
  let ulSubtasks = document.getElementById(`ulSubtasks(${i})`);

  if (ulSubtasks) {
    subTaskElement.classList.add("li-edit");
    subTaskElement.classList.add("pd-inline-start");
    ulSubtasks.classList.add("pd-inline-start");
    subTaskField.classList.add("fill-border-bottom");

    subTaskField.innerHTML = "";
    subTaskField.innerHTML = editSubtaskHtml(i, subTask);
    inputFocus(i);
  }
}

function deleteSubtask(i) {
  subTasks.splice(i, 1);
  setItem("subTasks", subTasks);
  renderSubTasks();
}

async function changeSubtask(i) {
  let changedSubTask = document.getElementById(`inputField${i}`).value;
  subTasks[i] = changedSubTask;
  await setItem("subTasks", subTasks);
  renderSubTasks();
}

function inputFocus(i) {
  let inputField = document.getElementById(`inputField${i}`);
  inputField.focus();
  inputField.setSelectionRange(
    inputField.value.length,
    inputField.value.length
  );
}

function showCategories() {
  toggleDropDownArrow("dropDownArrowCategory");
  let categoriesField = document.getElementById("categories");

  categoriesField.classList.toggle("vs-hidden");

  if (!categoriesField.classList.contains("vs-hidden")) {
    categoriesField.focus();
  }
}

function changeCategory(category) {
  let clickedCategory = category;
  let categoryDropdown = document.getElementById("categoryDropdown");

  categoryDropdown.innerHTML = "";
  categoryDropdown.innerHTML = clickedCategory;

  taskCategory.push(clickedCategory);
  containerCategory.classList.toggle("fill-border");

  if (category != "Select task category") {
    showCategories();
  }
}

function showAddTaskTemplate() {
  currentDate();
  let bgDialog = document.getElementById("bgDialog");
  bgDialog.classList.toggle("vs-hidden");
  bgDialog.classList.toggle("align-center");
}
