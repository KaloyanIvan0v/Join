function init_board() {
    includeHTML();
    loadNewTasks();
}

async function loadNewTasks() {
    // tasks = getFromLocalStorage('tasks') || [];
    tasks = JSON.parse(await getItem('tasks'));
    let toDoField = document.getElementById('categoryToDo');

    toDoField.innerHTML = '';
    for(i = 0; i < tasks.length; i++) {
        let singleTask = tasks[i];
        toDoField.innerHTML += returnHtmlShowToDos(singleTask, i); 
        chooseCategoryColor(i);
    }
}

function chooseCategoryColor(i) {
    let categoryField = document.getElementById(`categoryField${i}`);
    let singleTaskCategory = tasks[i]['category'];

    if(singleTaskCategory == 'Technical Task') {
        categoryField.classList.add('bg-color-technical-task');
    } else {
        categoryField.classList.add('bg-color-user-story');
    }
    whichPriorityTaskCard(i);
}

function whichPriorityTaskCard(i) {
    let prioField = document.getElementById(`prioField${i}`);
    let singleTaskPrio = tasks[i]['prio'];

    prioField.innerHTML = '';

    if(singleTaskPrio == 'low') {
        prioField.innerHTML = '<img src="' + '../img/prio_low.png' + '" alt="Bildbeschreibung">'
    } else if(singleTaskPrio == 'medium') {
        prioField.innerHTML = '<img src="' + '../img/prio_medium_orange.png' + '" alt="Bildbeschreibung">'
    } else {
        prioField.innerHTML = '<img src="' + '../img/prio_urgent.png' + '" alt="Bildbeschreibung">'
    }
}

function showCurrentTask(i) {
    let backgroundDialog = document.getElementById('backgroundDialog');
    let dialogField = document.getElementById('taskOverlay');
    let currentTask = tasks[i];

    backgroundDialog.classList.toggle('background-dialog');
    dialogField.innerHTML = '';
    dialogField.innerHTML = returnHtmlCurrentTask(currentTask);
}

// function searchTask() {

// }

function returnHtmlShowToDos(singleTask, i) {
    return `
    <div class="task-card" onclick="showCurrentTask(${i})">
        <div class="task-card-category">
            <span id="categoryField${i}" class="which-category">
                ${singleTask['category']}
            </span>
        </div>
        
        <div class="header-area-card">
            <div class="ft-weight-700">
                ${singleTask['title']}
            </div>
            <div class="">
                ${singleTask['description']}
            </div>
        </div>

        <div class="">
            <div class="">
                <span><i>Subtasks Field & loadbar</i></span>
                ${singleTask['subTasks']}
            </div>
        </div>

        <div class="last-section-card">
            <div class="">
                ${singleTask['assignedTo']}
            </div>
            <div id="prioField${i}" class="prio-field">
                ${singleTask['prio']}
            </div>
        </div>`
}

function returnHtmlCurrentTask(overlayTask) {
    return `
    <div class="overlay-first-row">
        <div class="overlay-category" id="overlayCategoryField">${overlayTask['category']}</div>
        <a onclick="showCurrentTask()">X</a>
    </div>
    <div class="overlay-title">
        ${overlayTask['title']}
    </div>
    <div class="overlay-description">
        ${overlayTask['description']}
    </div>
    <div class="overlay-date">
        <span>Due Date:</span>
        <span>${overlayTask['dueDate']}</span>
    </div>
    <div class="overlay-assigned">
        <span>Assigned To:</span>
        <div class="overlay-assigned-contacts">
            <span>Test</span>
            <span>Test</span>
            <span>Test</span>
        </div>
    </div>
    <div class="overlay-assigned">
    <span>Subtasks</span>
    <div class="overlay-assigned-contacts">
        <span>Test</span>
        <span>Test</span>
        <span>Test</span>
    </div>
</div>
    </div>`
}