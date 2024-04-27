let currentPrio = ["medium"];
let taskCategory = [];
let idNumber = [];
let subTasks = [];
let subTaskStatus = [];
let checkedUsers = [];
let searchContacts = [];
let finishedSubTasks = [];
let checkChangeIcons = false;
let divContacts = false;
let checkBoxContact = false;
let arrowToggleCheck = false;

function init() {
  includeHTML();
  setTimeout(loadFirstLettersFromSessionStorage, 200);
  loadTasks();
  loadContacts();
  whichPriority();
  loadUsers();
  currentDate();
}

function createTask() {
  addTask();
  addedToBoard();
  window.location.href = "board.html";
}

async function addTask() {
  let idNumber = increaseId();
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let dueDate = document.getElementById("dueDate");
  let subTaskForTask = renderSubTasks();
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
  await setItem("tasks", tasks);
  //resetInputFields();
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
  let initialArea = document.getElementById("checkboxes");
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
  changePrio(1);

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
  let low = document.getElementById(`Low`);

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

function changePrio(i) {
  currentPrio = priorities[i]["text"];
  priorities[i]["isPriority"] = true;
  whichPriority();
}

function whichPriority() {
  let prioSelection = document.getElementById("prioSelection");
  prioSelection.innerHTML = "";

  for (i = 0; i < priorities.length; i++) {
    priority = priorities[i];
    checkBooleanForPriority(priority);
  }
}

function checkBooleanForPriority(priority) {
  if (priority["isPriority"] == false) {
    prioSelection.innerHTML += prioNormal(priority);
  } else {
    prioSelection.innerHTML += prioActive(priority);
    priority["isPriority"] = false;
  }
}

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

function showCheckboxes() {
  let checkboxes = document.getElementById("checkboxes");
  let assignedBtn = document.getElementById("inputToSearchContact");

  toggleUserListInitials();

  if (divContacts == false) {
    ifForshowCheckBoxes(checkboxes, assignedBtn);
  } else {
    elseForshowCheckBoxes(assignedBtn);
  }
  assignedBtn.parentElement.classList.toggle("fill-border");
  // checkboxes.classList.toggle("d-flex-initials");
  toggleDropDownArrow("dropDownArrow");
}

function ifForshowCheckBoxes(checkboxes, assignedBtn) {
  checkboxes.classList.remove("vs-hidden");
  assignedBtn.placeholder = "Search Contact";
  renderContactsToField(contacts, checkboxes);
  divContacts = true;
}

function elseForshowCheckBoxes(assignedBtn) {
  checkboxes.classList.add("vs-hidden");
  assignedBtn.blur();
  divContacts = false;
  showInitials();
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

function toggleUserListInitials() {
  let checkboxes = document.getElementById("checkboxes");

  checkboxes.classList.toggle("user-list");
  checkboxes.classList.toggle("d-flex-initials");
}

function renderContactsToField(arrayToRender) {
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

    }}

  function examineUser(i) {
    let currentName = contacts[i]["name"];
    let index = checkedUsers.findIndex((item) => JSON.stringify(item["name"]) === JSON.stringify(currentName));

    if (index != -1) {
      toggleForCheckedUser(i);
      toggleCheckbox(i);
    }
  }
}

function examineUser(i) {
  let currentName = contacts[i]["name"];
  let index = checkedUsers.findIndex(
    (item) => JSON.stringify(item["name"]) === JSON.stringify(currentName)
  );

  if (index != -1) {
    toggleForCheckedUser(i);
    toggleCheckbox(i);
  }
}

function examineUser(i) {
  let currentName = contacts[i]["name"];
  let index = checkedUsers.findIndex(
    (item) => JSON.stringify(item["name"]) === JSON.stringify(currentName)
  );

  if (index != -1) {
    toggleForCheckedUser(i);
  }
}

function toggleForCheckedUser(i) {
  let userField = document.getElementById(`userField${i}`);
  let paddingForChecked = document.getElementById(`paddingForChecked${i}`);

  userField.classList.toggle("hover-user-field");
  paddingForChecked.classList.toggle("pd-right-16");
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
  } else {
    checkedUsers.splice(currentIndex, 1);
  }
  toggleForCheckedUser(i);
  toggleCheckbox(i);
}

function toggleCheckbox(i) {
  let checkBox = document.getElementById(`checkBox${i}`);
  let checkBoxStatus = contacts[i]["checkBoxContact"];

  if (checkBoxStatus == true) {
    checkBox.src = "../img/box-unchecked.png";
  } else {
    checkBox.src = "../img/Check button.png";
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
    renderContactsToField(searchContacts);
  } else if (inputSearchContact.length == 1) {
    renderContactsToField(contacts);
  } else if (inputSearchContact.length == 1) {
    renderAssignedToField(contacts);
    renderAssignedToField(searchContacts);
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

    if (ulSubtasks) {
      // subTaskElement.classList.add('li-edit');
      subTaskElement.classList.add("pd-inline-start");
      ulSubtasks.classList.add("pd-inline-start");
      // subTaskField.classList.add('fill-border-bottom');

      subTaskField.innerHTML = "";
      subTaskField.innerHTML = editSubtaskHtml(i, subTask);
      inputFocus(i);
    }
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

function showCategories(category) {
  let categoriesField = document.getElementById("categories");

  if (category != "Select task category") {
    toggleDropDownArrow("dropDownArrowCategory");
    categoriesField.classList.toggle("vs-hidden");
    giveFocus(categoriesField);
  }
}

function giveFocus(categoriesField) {
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

  showCategories(category);
}

function hoverPrioImage(prioImage) {
  let currentImage = document.getElementById(prioImage);
  currentImage.setAttribute("src", "../img/prio_low_hover.png");
}

function leaveHover(prioImage) {
  let currentImage = document.getElementById(prioImage);
  currentImage.setAttribute("src", "../img/low.png");
}
