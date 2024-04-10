let currentPrio = ['medium'];
let tasks = [];
let subTasks = [];
let checkChangeIcons = false;

function init() {
    includeHTML();
    loadTasks();
}

async function loadTasks() {
    tasks = JSON.parse(await getItem('tasks'));
    subTasks = JSON.parse(await getItem('subTasks'));
}

async function addTask() {
    // let createBtn = document.getElementById('createBtn');
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let assignedTo = document.getElementById('assignedTo');
    let dueDate = document.getElementById('dueDate');
    let category = document.getElementById('category');
    // let subTasks = document.getElementById('subTasks');

    let task = {
        "title": title.value,
        "description": description.value,
        "assignedTo": assignedTo.value,
        "dueDate": dueDate.value,
        "prio": currentPrio,
        "category": category.value,
        "subTasks": subTasks,
        }
    
    
    tasks.push(task);
    await setItem('tasks', tasks);
    resetInputFields();
    window.location.href = "board.html";
}

function whichPriority(level) {
    let medium = document.getElementById('mediumPrio');
    let urgent = document.getElementById('urgentPrio');
    let low = document.getElementById('lowPrio');
    // let imgLow = document.getElementById('imgLow');
    // let imgMedium = document.getElementById('imgMedium');
    // let imgUrgent = document.getElementById('imgUrgent');

    if(level == 'urgent') {
        changeIcon('urgent');
        low.classList.remove('highlight-color-low');
        medium.classList.remove('highlight-color-medium');
        urgent.classList.add('highlight-color-urgent');
        currentPrio = 'urgent';
    } else if (level == 'low') {
        changeIcon('low');
        urgent.classList.remove('highlight-color-urgent');
        medium.classList.remove('highlight-color-medium');
        low.classList.add('highlight-color-low');
        currentPrio = 'low';
    } else {
        changeIcon('medium');
        urgent.classList.remove('highlight-color-urgent');
        medium.classList.add('highlight-color-medium');
        low.classList.remove('highlight-color-low');
        currentPrio = 'medium';
    }
}

function changeIcon(level) {
    let imgLow = document.getElementById('imgLow');
    let imgMedium = document.getElementById('imgMedium');
    let imgUrgent = document.getElementById('imgUrgent');
    if (level == 'low' && imgLow.src.includes('prio_low.png')) {
        imgLow.src = '/img/prio_medium_orange.png';
    } else {
        imgLow.src = '/img/prio_low.png';
    }
}

function resetInputFields() {
    title.value = '';
    description.value = '';
    assignedTo.value = '';
    dueDate.value = '';
    category.value = '';
    subTasks.value = '';
}

function resetAddNewSubtask() {
    subTasks.value = '';
    checkChangeIcons = false;
    changeIconsSubtask();
    checkChangeIcons = false;
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
        checkChangeIcons = false;
        changeIconsSubtask();
        checkChangeIcons = false;
    }
}

function returnHtmlNewSubtasks(newSubTask) {
    return `
    <ul>
        <li>${newSubTask}</li>
    </ul>`
}

function changeIconsSubtask() {
    let activeInputSubtask = document.getElementById('activeInputSubtask');
    let addIconSubtasks = document.getElementById('addIconSubtasks');

    if(checkChangeIcons == false) {
        checkChangeIcons = true;
        addIconSubtasks.classList.toggle('vs-hidden');
        activeInputSubtask.classList.toggle('vs-hidden');
    }
}