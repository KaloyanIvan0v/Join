let currentPrio = ['medium'];

function addTask() {
    let createBtn = document.getElementById('createBtn');
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let assignedTo = document.getElementById('assignedTo');
    let dueDate = document.getElementById('dueDate');
    let category = document.getElementById('category');
    let subTasks = document.getElementById('subTasks');

    createBtn.disabled = true;

    // let tasks = getItemTasks('tasks');
    let tasks = getFromLocalStorage('tasks') || [];

    let task = {
        "title": title.value,
        "description": description.value,
        "assignedTo": assignedTo.value,
        "dueDate": dueDate.value,
        "prio": currentPrio,
        "category": category.value,
        "subTasks": subTasks.value,
        };

    tasks.push(task);
    // setItem('tasks', tasks);
    saveToLocalStorage('tasks', tasks);
    resetInputFields();
    window.location.href = "board.html";
}

function whichPriority(level) {
    let medium = document.getElementById('mediumPrio');
    let urgent = document.getElementById('urgentPrio');
    let low = document.getElementById('lowPrio');

    if(level == 'urgent') {
        low.classList.remove('highlight-color-low');
        medium.classList.remove('highlight-color-medium');
        urgent.classList.add('highlight-color-urgent');
        currentPrio = 'urgent';
    } else if (level == 'low') {
        urgent.classList.remove('highlight-color-urgent');
        medium.classList.remove('highlight-color-medium');
        low.classList.add('highlight-color-low');
        currentPrio = 'low';
    } else {
        urgent.classList.remove('highlight-color-urgent');
        medium.classList.add('highlight-color-medium');
        low.classList.remove('highlight-color-low');
        currentPrio = 'medium';
    }
}

function resetInputFields() {
    createBtn.disabled = false;
    title.value = '';
    description.value = '';
    assignedTo.value = '';
    dueDate.value = '';
    category.value = '';
    subTasks.value = '';
}