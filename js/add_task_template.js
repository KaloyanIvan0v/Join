let currentPrio = ['medium'];
let taskCategory = [];
let idNumber = [];
let subTasks = [];
let checkedUsers = [];
let searchContacts = [];
let finishedSubTasks = [];
let checkChangeIcons = false;
let expanded = false;
// let inputBorderError = false;
let arrowToggleCheck = false;

// function showAddTaskTemplate() {
//     currentDate();
//     let bgDialog = document.getElementById('bgDialog');
  
//     bgDialog.classList.toggle('vs-hidden');
//     bgDialog.classList.toggle('align-center');
//   }

  async function addTask() {
    let idNumber = increaseId();
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let dueDate = document.getElementById('dueDate');
    let subTaskForTask = subTasks;
    let checkedUsersForTask = checkedUsers;

    let task = {
        "title": title.value,
        "description": description.value,
        "assignedTo": checkedUsers,
        "dueDate": dueDate.value,
        "prio": currentPrio,
        "category": taskCategory,
        "subTasks": subTaskForTask,
        "finishedSubTasks": finishedSubTasks,
        "checkedUsers": checkedUsersForTask,
        "statement": "toDo",
        "id": idNumber,
        }
    tasks.push(task);
    await setItem('tasks', tasks);
    resetInputFields();
    window.location.href = "board.html";
}

function resetInputFields() {
  let subTasks =  document.getElementById('subTasks');
  let initialArea = document.getElementById('initialArea');
  let newSubTaskField = document.getElementById('newSubTaskField');
  let initialen = document.getElementById('checkboxes')

  title.value = '';
  description.value = '';
  initialArea.innerHTML = '';
  subTasks.value = '';
  newSubTaskField.innerHTML = '';
  checkedUsers = [];
  initialen.innerHTML = '';
  furtherResetField();
}

function searchContact() {
  let inputSearchContact = document.getElementById('inputToSearchContact').value;
  inputSearchContact = inputSearchContact.toLowerCase();

  searchContacts.splice(0, searchContacts.length);
  if(inputSearchContact.length > 1) {
      for(i = 0; i < contacts.length; i++) {
          contact = contacts[i]['name'];
          let contactComplete = contacts[i];
          if(contact.toLowerCase().includes(inputSearchContact)) {
              searchContacts.push(contactComplete);
          }
      }
      renderAssignedToField(searchContacts);
  } else if(inputSearchContact.length == 1) {
      renderAssignedToField(contacts);
  }
}

function renderAssignedToField(arrayToRender) {
  let userCheckBox = document.getElementById('checkboxes');
  userCheckBox.innerHTML = '';

  if(!userCheckBox.classList.contains('user-list')) {
      toggleUserListInitials();
  }

  for(i = 0; i < arrayToRender.length; i++){;
      user = arrayToRender[i];
      userCheckBox.innerHTML += 
          returnHtmlSingleContact(user);
          backgroundColorInitials(i, 'none');
  }

  if(checkedUsers.length > 0) {
      for(i = 0; i < arrayToRender.length; i++){;
          examineUser(i);   
      }
  }
}

function whichPriority() {
  let prioSelection = document.getElementById('prioSelection');
  prioSelection.innerHTML = '';

  for(i = 0; i < priorities.length; i++) {
      priority = priorities[i];
      checkBooleanForPriority(priority);
  }
}

function checkBooleanForPriority(priority) {
  if(priority['isPriority'] == false) {
      prioSelection.innerHTML += prioNormal(priority);
  } else {
      prioSelection.innerHTML += prioActive(priority);
      priority['isPriority'] = false;
  }
}

function currentDate() {
  let inputDateField = document.getElementById('dueDate');
  let todayDate = new Date();
  let year = todayDate.getFullYear();
  let month = todayDate.getMonth() + 1;
  let day = todayDate.getDate();

  if(month < 10) {
      month = '0' + month;
  }
  if(day < 10) {
      day = '0' + day;
  }
  let currentDate = year + '-' + month + '-' + day
  inputDateField.value = currentDate;
}

function addNewSubTask() {
  let singleNewTask = document.getElementById('subTasks');
  let singleNewTaskValue = singleNewTask.value;

  if(singleNewTaskValue.length >= 3){
      subTasks.push(singleNewTaskValue);
  }
  renderSubTasks('newSubtask');
}

function resetAddNewSubtask() {
  let subTasks =  document.getElementById('subTasks');
  subTasks.value = '';
  checkChangeIcons = true;
  changeIconsSubtask();
}

function renderSubTasks(operator) {
  let newTaskField = document.getElementById('newSubTaskField');
  let singleNewTask = document.getElementById('subTasks');
  singleNewTask.value = '';
  newTaskField.innerHTML = '';

  for(i = 0; i < subTasks.length; i++) {
      let newSubTask = subTasks[i];
      newTaskField.innerHTML += returnHtmlNewSubtasks(newSubTask);
  }
  checkIfNewSubTask(operator);
}

async function checkIfNewSubTask(operator) {
  if(operator == 'newSubtask') {
      checkChangeIcons = true;
      changeIconsSubtask();
      await setItem('subTasks', subTasks);
  }
}

function changeIconsSubtask() {
  let addIconSubtasks = document.getElementById('addIconSubtasks');
  let subTask = document.getElementById('inputFieldSubtasks');

  addIconSubtasks.innerHTML = '';

  if(checkChangeIcons == false) {
      addIconSubtasks.innerHTML = returnHtmlCheckAndClear();
      subTask.classList.add('fill-border');
      checkChangeIcons = false;
      renderSubTasks();
  } else {
      addIconSubtasks.innerHTML = returnHtmlAdd();
      subTask.classList.remove('fill-border');
      checkChangeIcons = false;
  }
  renderSubTasks();
}