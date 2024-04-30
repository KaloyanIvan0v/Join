let currentPrio = ["medium"];
let taskCategory = [];
let idNumber = [];
let subTasks = [];
let subTaskStatus = [];
let checkedUsers = [];
let findContactsAtSearch = [];
let finishedSubTasks = [];
let checkChangeIcons = false;
let checkBoxContact = false;
let arrowToggleCheck = false;

async function init_add_task() {
  await includeHTML();
  loadHtmlTaskTemplate();
  setTimeout(loadFirstLettersFromSessionStorage, 200);
  loadTasks();
  loadContacts();
  loadUsers();
  setTimeout(selectPriority, 300);
  setTimeout(currentDate, 300);
}

function loadHtmlTaskTemplate() {
  let body = document.getElementById('body');
  let createTask = 'createTask';
  let leftButtonFunction = 'resetInputFields';
  let leftButtonText = 'Clear';

  body.innerHTML += returnHtmlTaskTemplate(createTask, leftButtonFunction, leftButtonText);
}

function createTask() {
  addTask();
  addedToBoard();
  setTimeout(function() {
    window.location.href = "board.html";
  }, 900);
}

async function addTask() {
  let idNumber = increaseId(tasks);
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let dueDate = document.getElementById("dueDate");
  let checkedUsersForTask = checkedUsers;

  let task = {
    title: title.value,
    description: description.value,
    assignedTo: checkedUsers,
    dueDate: dueDate.value,
    prio: currentPrio,
    category: taskCategory,
    subTasks: subTasks,
    finishedSubTasks: finishedSubTasks,
    checkedUsers: checkedUsersForTask,
    statement: "toDo",
    id: idNumber,
  };
  tasks.push(task);
  await setItem("tasks", tasks);
}

function addedToBoard() {
  let bgDialog = document.getElementById("bgDialog");

  bgDialog.classList.remove("vs-hidden");
  bgDialog.classList.add("align-center");
}

function increaseId(array) {
  let lastTaskofTasks = array.length - 1;

  if (lastTaskofTasks == -1) {
    return (currentId = 0);
  } else {
    let currentId = array[lastTaskofTasks]["id"];
    currentId++;
    return currentId;
  }
}

function toggleDropDownArrowInputField(idImage) {
  let arrow = document.getElementById(idImage);
  if (arrowToggleCheck == false) {
    arrow.src = "../img/arrow_drop_down_up.png";
    arrowToggleCheck = true;
  } else {
    arrow.src = "../img/arrow_drop_down.png";
    arrowToggleCheck = false;
  }
}

function resetInputFields() {
  let subTasks = document.getElementById("subTasks");
  let subTasksArea = document.getElementById("newSubTaskField")
  let contactsField = document.getElementById("contactsField");
  let assignedBtn = document.getElementById("inputToSearchContact");

  title.value = "";
  description.value = "";
  contactsField.innerHTML = "";
  subTasks.value = "";
  subTasksArea.innerHTML = '';
  assignedBtn.innerHTML = "";
  checkedUsers = [];
  furtherResetField();
}

function furtherResetField() {
  subTasks = [];
  renderSubTasks('none');
  currentDate();
  changeCategory("Select task category");
  changePrio(1);
  checkChangeIcons = true;
  changeIconsSubtask();
  // clearContactsChecked()
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

function changePrio(i) {
  currentPrio = priorities[i]["text"];
  priorities[i]["isPriority"] = true;
  selectPriority();
}

function selectPriority() {
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

function showCategories(category, event) {
  let categoriesField = document.getElementById("categories");

  toggleDropDownArrowInputField("dropDownArrowCategory");

  if(category == 'none') {
    event.stopPropagation();
  } 

  if(category != "Select task category") {
    categoriesField.classList.toggle("vs-hidden");
  }
}

function changeCategory(category) {
  let clickedCategory = category;

  let categoryDropdown = document.getElementById("categoryDropdown");

  categoryDropdown.innerHTML = "";
  categoryDropdown.innerHTML = clickedCategory;

  taskCategory = clickedCategory;
  showCategories(category);
}

function clearContactsChecked() {
  for(i = 0; i < contacts.length; i++) {
    contacts[i]['checkBoxContact'] = false;
  }
}

function closeDiv(event) {
  if(arrowToggleCheck == true) {
    showOrHideContacts(event);
  }
}

function showOrHideRequiredField(idParent, idToggle) {
  let input = document.getElementById(idParent)
  let inputValue = input.value;
  let element = document.getElementById(idToggle);

  if(inputValue.length == 0) {
    element.classList.remove('vs-hidden');
    input.classList.add('error-border')
  } else if(inputValue.length > 0) {
    element.classList.add('vs-hidden');
    input.classList.remove('error-border')
  }
}

function showOrHideContacts(event) {
  event.stopPropagation();
  toggleDropDownArrowInputField("dropDownArrow");

  let contactsField = document.getElementById('contactsField');
  let inputField = document.getElementById('inputToSearchContact');
  contactsField.innerHTML = '';

  if(arrowToggleCheck == true) {
      contactsField.classList.add('contacts-assigned');
      contactsField.classList.remove('contacts-initialen');
      renderContactsToSelect(contactsField, contacts);
  } else {
      showContactsInitial(contactsField, contacts);
      inputField.blur();
      inputField.value = '';
  }
}

function renderContactsToSelect(contactsField, arrayToRender) {
  contactsField.innerHTML = '';

  for(i = 0; i < arrayToRender.length; i++) {
    contact = arrayToRender[i];
    contactsField.innerHTML += returnHtmlSingleContact(contact);
    checkIfContactChecked(i);
    backgroundColorInitials(i, "showInitial");
  }
}

function showContactsInitial(contactsField) {
  for(i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let checkBoxStatus = contacts[i]['checkBoxContact'];

    if(checkBoxStatus == true) {
      contactsField.classList.remove('contacts-assigned');
      contactsField.classList.add('contacts-initialen');      
      contactsField.innerHTML += loadInitial(i, contact);
      backgroundColorInitials(i, "none");
    }
  }
}

function backgroundColorInitials(i, whichArea) {
  let currentColor = contacts[i]["color"];
  let bgColorCheckedUser = contactColor[currentColor];

  if (whichArea == "showInitial") {
    let bgInitials = document.getElementById(`bgInitials${i}`);
    bgInitials.style.backgroundColor = bgColorCheckedUser;
  } else {
    let bgInitials = document.getElementById(`initialArea${i}`);
    bgInitials.style.backgroundColor = bgColorCheckedUser;
  }
}

function searchContact() {
  let inputSearchContact = document.getElementById("inputToSearchContact").value;

  inputSearchContact = inputSearchContact.toLowerCase();

  findContactsAtSearch.splice(0, findContactsAtSearch.length);
  if(inputSearchContact.length >= 0) {
    for (i = 0; i < contacts.length; i++) {
      contact = contacts[i];
      filterContacts(contact, inputSearchContact);
    }
    renderContactsToSelect(contactsField, findContactsAtSearch);
  } else {
    renderContactsToSelect(contactsField, contacts);
  }
}

function filterContacts(contact, inputSearchContact) {
  if (contact.name.toLowerCase().includes(inputSearchContact)) {
    findContactsAtSearch.push(contact); 
  }
}

function selectedUser(i, event) {
  event.stopPropagation();
  let singleUser = contacts[i];
  let currentIndex = checkedUsers.indexOf(singleUser);
  let inputField = document.getElementById('inputToSearchContact');

  if (!checkedUsers.includes(singleUser, 0)) {
    checkedUsers.push(singleUser);
  } else {
    checkedUsers.splice(currentIndex, 1);
  }
  toggleBackgroundForCheckedUser(i);
  toggleCheckbox(i);
  inputField.focus();
}

function toggleBackgroundForCheckedUser(i) {
  let userField = document.getElementById(`userField${i}`);
  let paddingForChecked = document.getElementById(`paddingForChecked${i}`);

  userField.classList.toggle("hover-user-field");
  paddingForChecked.classList.toggle("pd-right-16");
}

function toggleCheckbox(i) {
  let checkBox = document.getElementById(`checkBox${i}`);
  let checkBoxStatus = contacts[i]["checkBoxContact"];

  if (checkBoxStatus == true) {
    checkBox.src = "../img/box-unchecked.png";
    contacts[i]["checkBoxContact"] = false;
  } else {
    checkBox.src = "../img/Check button.png";
    contacts[i]["checkBoxContact"] = true
  }
}

function checkIfContactChecked(i) {
  let testCheckbox = contacts[i]['checkBoxContact'];
  
  if(testCheckbox == true) {
    toggleBackgroundForCheckedUser(i);
    contacts[i]['checkBoxContact'] = false;
    toggleCheckbox(i);
  }
}