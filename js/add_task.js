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

function addedToBoard() {
  let bgDialog = document.getElementById("bgDialog");

  bgDialog.classList.remove("vs-hidden");
  bgDialog.classList.add("align-center");
}

function resetInputFields() {
  let subTasks = document.getElementById("subTasks");
  let subTasksArea = document.getElementById("newSubTaskField")
  let initialArea = document.getElementById("checkboxes");
  let initialen = document.getElementById("checkboxes");
  let assignedBtn = document.getElementById("inputToSearchContact");

  title.value = "";
  description.value = "";
  initialArea.innerHTML = "";
  subTasks.value = "";
  subTasksArea.innerHTML = '';
  assignedBtn.innerHTML = "";
  checkedUsers = [];
  initialen.innerHTML = "";
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
  clearContactsChecked()
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

function addNewSubTask(event) {
if(event.key === 'Enter'){
  let id = increaseId(subTasks);
  let singleNewTask = document.getElementById("subTasks");
  let singleNewTaskValue = singleNewTask.value;

  if (singleNewTaskValue.length >= 3) {
      subTasks.push({
      'subTask': singleNewTaskValue,
      'status': false,
      'id': id,
    })
  }
  renderSubTasks("newSubtask");
}
}

function deleteSubtask(i) {
  subTasks.splice(i, 1);
  setItem("subTasks", subTasks);
  renderSubTasks();
}

async function changeSubtask(i) {
  let changedSubTask = document.getElementById(`inputField${i}`).value;
  subTasks[i]['subTask'] = changedSubTask;
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

function renderSubTasks(operator) {
  let newTaskField = document.getElementById("newSubTaskField");
  let singleNewTask = document.getElementById("subTasks");
  singleNewTask.value = "";
  newTaskField.innerHTML = "";

  for (i = 0; i < subTasks.length; i++) {
    let newSubTask = subTasks[i]['subTask'];
    newTaskField.innerHTML += returnHtmlNewSubtasks(newSubTask);
  }
  checkIfNewSubTask(operator);
}

function resetAddNewSubtask() {
  let subTasks = document.getElementById("subTasks");
  subTasks.value = "";
  checkChangeIcons = true;
  changeIconsSubtask();
}

async function checkIfNewSubTask(operator) {
  if (operator == "newSubtask") {
    checkChangeIcons = true;
    changeIconsSubtask();
    await setItem("subTasks", subTasks);
  }
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
    checkIfContactChecked(i);
  }
}

function checkIfContactChecked(i) {
    let testCheckbox = contacts[i]['checkBoxContact'];
    
    if(testCheckbox == true) {
      toggleForCheckedUser(i);
      contacts[i]['checkBoxContact'] = false;
      toggleCheckbox(i);
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
    let bgInitials = document.getElementById(`initialArea${i}`);
    bgInitials.style.backgroundColor = bgColorContacts;
  }
}

function selectedUser(i, event) {
  event.stopPropagation();
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
    contacts[i]["checkBoxContact"] = false;
  } else {
    checkBox.src = "../img/Check button.png";
    contacts[i]["checkBoxContact"] = true
  }
}

function searchContact() {
  let inputSearchContact = document.getElementById("inputToSearchContact").value;
  inputSearchContact = inputSearchContact.toLowerCase();

  searchContacts.splice(0, searchContacts.length);
    for (i = 0; i < contacts.length; i++) {
      contact = contacts[i]["name"];
      let contactComplete = contacts[i];
      if (contact.toLowerCase().includes(inputSearchContact)) {
        searchContacts.push(contactComplete);
      } else {
      }
    }
    renderContactsToField(searchContacts);

}

function editSubtask(i) {
  let subTaskField = document.getElementById(`subTaskElement${i}`);
  let subTask = subTasks[i]['subTask'];
  let subTaskElement = document.getElementById(`subTaskElement${i}`);
  let ulSubtasks = document.getElementById(`ulSubtasks(${i})`);

  if (ulSubtasks) {
    subTaskElement.classList.add("li-edit");
    subTaskElement.classList.add("pd-inline-start");
    ulSubtasks.classList.add("pd-inline-start");
    subTaskField.classList.add("fill-border-bottom");

    if (ulSubtasks) {
      subTaskElement.classList.add("pd-inline-start");
      // ulSubtasks.classList.add("pd-inline-start");

      subTaskField.innerHTML = "";
      subTaskField.innerHTML = editSubtaskHtml(i, subTask);
      inputFocus(i);
    }
  }
}

function showCategories(category) {
  let categoriesField = document.getElementById("categories");

  if (category != "Select task category") {
    toggleDropDownArrow("dropDownArrowCategory");
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

// <-----------Assigned to Field --------------->

function showOrHideContacts(event) {
  event.stopPropagation();
  toggleDropDownArrow("dropDownArrow");

  let contactsField = document.getElementById('contactsField');
  contactsField.innerHTML = '';

  if(arrowToggleCheck == true) {
      contactsField.classList.add('contacts-assigned');
      showContactsToSelect(contactsField);
  } else {
      showContactsInitial(contactsField);
  }
}

function showContactsToSelect(contactsField) {
  for(i = 0; i < contacts.length; i++) {
    contact = contacts[i];
    contactsField.innerHTML += returnHtmlSingleContact(contact);
    checkIfContactChecked(i);
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
// function showCheckboxes(event) {
//   event.stopPropagation();
//   let checkboxes = document.getElementById("checkboxes");
//   let assignedBtn = document.getElementById("inputToSearchContact");
//   assignedBtn.value = '';
 
//   toggleUserListInitials();

//   if (divContacts == false) {
//     ifForshowCheckBoxes(checkboxes, assignedBtn);
//     assignedBtn.focus();
//   } else {
//     elseForshowCheckBoxes(assignedBtn);
//   }
//   assignedBtn.parentElement.classList.toggle("fill-border");
//   toggleDropDownArrow("dropDownArrow");
// }

// function toggleUserListInitials() {
//   let checkboxes = document.getElementById("checkboxes");

//   checkboxes.classList.toggle("user-list");
//   checkboxes.classList.toggle("d-flex-initials");
// }

// function ifForshowCheckBoxes(checkboxes, assignedBtn) {
//   checkboxes.classList.remove("vs-hidden");
//   assignedBtn.placeholder = "Search Contact";
//   renderContactsToField(contacts, checkboxes);
//   divContacts = true;
// }

// function elseForshowCheckBoxes(assignedBtn) {
//   assignedBtn.blur();
//   divContacts = false;
//   showInitials();
// }

// function showInitials() {
  //   let initialsArea = document.getElementById("checkboxes");
  //   initialsArea.innerHTML = "";
  
  //   for (i = 0; i < checkedUsers.length; i++) {
  //     let singleUser = checkedUsers[i]["name"];
  //     let nameParts = singleUser.split(" ");
  //     let firstLetter = nameParts[0].substring(0, 1);
  //     if (nameParts.length == 2) {
  //       let secondLetter = nameParts[1].substring(0, 1);
  //       let nameInitial = firstLetter + secondLetter;
  //       initial = nameInitial;
  //     } else {
  //       initial = firstLetter;
  //     }
  //     initialsArea.innerHTML += loadInitial(i, initial);
  //     backgroundColorInitials(i, "showInitial");
  //   }
  // }