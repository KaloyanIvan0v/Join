let currentPrio = ['medium'];
let tasks = [];
let subTasks = [];
let checkedUsers = [];
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
let checkChangeIcons = false;

async function init() {
    includeHTML();
    loadTasks();
    whichPriority();
    await loadUsers();
    // renderAssignedToField();
}

function changePrio(i) {
    currentPrio = priorities[i]['text'];
    priorities[i]['isPriority'] = true;
    whichPriority();
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

async function loadTasks() {
    tasks = JSON.parse(await getItem('tasks'));
    subTasks = JSON.parse(await getItem('subTasks'));
}

async function addTask() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    // let assignedTo = document.getElementById('assignedTo');
    let dueDate = document.getElementById('dueDate');
    let category = document.getElementById('category');
    let subTasks =  document.getElementById('subTasks');

    let task = {
        "title": title.value,
        "description": description.value,
        "assignedTo": checkedUsers,
        "dueDate": dueDate.value,
        "prio": currentPrio,
        "category": category.value,
        "subTasks": subTasks,
        }
    tasks.push(task);
    addedToBoard();
    await setItem('tasks', tasks);
    resetInputFields();
    window.location.href = "board.html";
}

function addedToBoard() {
    let bgDialog = document.getElementById('bgDialog');

    bgDialog.classList.remove('vs-hidden');
    bgDialog.classList.add('align-center');
}

function resetInputFields() {
    let subTasks =  document.getElementById('subTasks');
    title.value = '';
    description.value = '';
    // assignedTo.value = '';
    dueDate.value = '';
    category.value = '';
    subTasks.value = '';

    checkChangeIcons = true;
    changeIconsSubtask();
    // checkChangeIcons = false;
}

function resetAddNewSubtask() {
    let subTasks =  document.getElementById('subTasks');
    subTasks.value = '';
    checkChangeIcons = true;
    changeIconsSubtask();
    // checkChangeIcons = false;
}

async function addNewSubTask() {
    let newTaskField = document.getElementById('newSubTaskField');
    let singleNewTask = document.getElementById('subTasks');
    let singleNewTaskValue = singleNewTask.value;

    if(singleNewTaskValue.length >= 3){
        subTasks.push(singleNewTaskValue);
        await setItem('subTasks', subTasks);
        singleNewTask.value = '';
        newTaskField.innerHTML = '';

        for(i = 0; i < subTasks.length; i++) {
            let newSubTask = subTasks[i];
            newTaskField.innerHTML += returnHtmlNewSubtasks(newSubTask);
        }
        checkChangeIcons = true;
        changeIconsSubtask();
        // checkChangeIcons = false;
    }
}

function changeIconsSubtask() {
    // let activeInputSubtask = document.getElementById('activeInputSubtask');
    let addIconSubtasks = document.getElementById('addIconSubtasks');

    addIconSubtasks.innerHTML = '';

    if(checkChangeIcons == false) {
        addIconSubtasks.innerHTML = returnHtmlCheckAndClear();
        checkChangeIcons = false;
    } else {
        addIconSubtasks.innerHTML = returnHtmlAdd();
        checkChangeIcons = false;
    }
}

function returnHtmlCheckAndClear() {
    return `
    <div id="activeInputSubtask" class="active-input-subtasks">
        <a onclick="resetAddNewSubtask()"><img src="/img/close.png"></a>
        <span class="height-24">|</span>
        <a onclick="addNewSubTask()"><img class="size-check" src="/img/check_black.png"></a>
    </div>`
}

function returnHtmlAdd() {
    return `
    <a id="addIconSubtasks" onclick="addNewSubTask()" class="icon-subtask-field"><img src="/img/add.png"></a>`
}

function prioNormal(priority) {
    return `
    <div id="prioUrgent" onclick="changePrio(${i})" class="selection-field ${priority['bgColorFalse']}">
        <span class="fz-20">${priority['text']}</span>
        <img id="imgUrgent" src="${priority['iconColor']}">
    </div>`
}

function prioActive(priority) {
    return `
    <div id="prioUrgent" onclick="testtest(${i})" class="selection-field ${priority['bgColorTrue']}">
        <span class="fz-20">${priority['text']}</span>
        <img id="imgUrgent" src="${priority['iconWhite']}">
    </div>`
}

function returnHtmlNewSubtasks(newSubTask) {
    return `
    <ul>
        <li>${newSubTask}</li>
    </ul>`
}

var expanded = false;

function showCheckboxes() {
    let checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.classList.toggle('vs-hidden');
        // checkboxes.style.display = "block";
        renderAssignedToField();
        expanded = true;
    } else {
        checkboxes.classList.toggle('vs-hidden');
        // checkboxes.style.display = "none";
        expanded = false;
    }
}

function renderAssignedToField() {
    let userCheckBox = document.getElementById('checkboxes');
    userCheckBox.innerHTML = '';

    for(i = 0; i < users.length; i++){;
        user = users[i];
        userCheckBox.innerHTML += `

        <label class="single-user" for="${i}">
        ${user['name']}<input type="checkbox" onclick="selectedUser(${i})" id="checkBox${i}" />`
    }
}

function selectedUser(i) {
    let singleUser = users[i]['name'];
    let currentIndex = checkedUsers.indexOf(singleUser);

    if(!checkedUsers.includes(singleUser, 0)) {
        checkedUsers.push(singleUser);
        showInitials();
    } else {
        checkedUsers.splice(currentIndex, 1);
    }
    setItem('checkedUsers', checkedUsers);
}

function showInitials() {
    let initialsArea = document.getElementById('initialArea');
    // let singleUser = users[i]['name'];
    // let nameParts = singleUser.split(" ");
    // let firstLetter = nameParts[0].substring(0, 1);
    initialsArea.innerHTML = '';


    for(i = 0; i < checkedUsers.length; i++) {
        let singleUser = checkedUsers[i];
        let nameParts = singleUser.split(" ");
        let firstLetter = nameParts[0].substring(0, 1);
        if(nameParts.length == 2) {
            let secondLetter = nameParts[1].substring(0, 1);
            let nameInitial = firstLetter + secondLetter;
            initial = nameInitial;
            // initialsArea.innerHTML += `<div class="initial-area">${nameInitial}</div>`
        } else {
            // initialsArea.innerHTML += `<div class="initial-area">${firstLetter}</div>`
            initial = firstLetter;
        }
        initialsArea.innerHTML += `<div class="initial-area">${initial}</div>`
    }
}