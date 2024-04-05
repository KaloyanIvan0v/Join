let tasks = [];

function addTask() {
    let createBtn = document.getElementById('createBtn');
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let assignedTo = document.getElementById('assignedTo');
    let dueDate = document.getElementById('dueDate');
    // let prio = document.getElementById('prio');      ????????????????
    let category = document.getElementById('category');
    let subTasks = document.getElementById('subTasks');

    createBtn.disabled = true;
    let task = [{
        "title": title.value,
        "description": description.value,
        "assignedTo": assignedTo.value,
        "dueDate": dueDate.value,
        "category": category.value,
        "subTasks": subTasks.value,
    }];

    console.log(task);

    tasks.push(task);
    resetInputFields();
    tasksToLocalStorage();
    location.replace("board.html");
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

function tasksToLocalStorage() {
    let tasksAsText = JSON.stringify(tasks);
    localStorage.setItem('tasks', tasksAsText);
}