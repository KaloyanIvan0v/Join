let finishedSubTasks = [];

async function init_board() {
    includeHTML();
    loadNewTasks();
    await loadContacts();
}

async function loadNewTasks() {
    tasks = JSON.parse(await getItem('tasks'));
    checkedUsers = JSON.parse(await getItem('checkedUsers'));
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

    if(singleTaskPrio == 'Low') {
        prioField.innerHTML = '<img src="' + '/img/low_green.png' + '" alt="Bildbeschreibung">'
    } else if(singleTaskPrio == 'medium') {
        prioField.innerHTML = '<img src="' + '/img/medium_orange.png' + '" alt="Bildbeschreibung">'
    } else {
        prioField.innerHTML = '<img src="' + '/img/urgent_red.png' + '" alt="Bildbeschreibung">'
    }
    // renderSubTasksBoard(i);
    renderContactsBoard(i);
}

function showCurrentTask(i) {
    let backgroundDialog = document.getElementById('backgroundDialog');
    let dialogField = document.getElementById('taskOverlay');
    let currentTask = tasks[i];

    backgroundDialog.classList.toggle('background-dialog');
    dialogField.innerHTML = '';
    dialogField.innerHTML = returnHtmlCurrentTask(currentTask);
}

function renderSubTasksBoard(i) {
    let subTasksField = document.getElementById(`subTasksField${i}`);
    let subTasks = tasks[i]['subTasks'];
    subTasksField.innerHTML = '';

    for(j = 0; j < subTasks.length; j++) {
        let subTask = subTasks[j];
        subTasksField.innerHTML += returnHtmlSubtasks(subTask);
    }
    renderContactsBoard(i)
}

function renderContactsBoard(i) {
    let contactsFieldBoard = document.getElementById(`contactsFieldBoard(${i})`);
    let contactsForTask = tasks[i]['assignedTo'];
    contactsFieldBoard.innerHTML = '';

    for(j = 0; j < contactsForTask.length; j++) {
        let contactForTask = contactsForTask[j];
        contactsFieldBoard.innerHTML += returnHtmlContacts(contactForTask, j);
        backgroundColorInitialsBoard(i, j);        
    }
}

function backgroundColorInitialsBoard(i, j) {
    let initialArea = document.getElementById(`initialArea${j}`);
    let colorNumber = tasks[i]['checkedUsers'][j]['color'];
    let bgColor = contactColor[colorNumber];
    initialArea.style.backgroundColor = bgColor;
    initialArea.removeAttribute('id');
}

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

        <div class="subtasks-contacts">
            <div class="subtasks-loadbar-number">
                <span><i>loadbar</i></span>
                <div class="number-done-subtasks">
                    <span>${finishedSubTasks.length}/</span>
                    <span>${singleTask['subTasks'].length} Subtasks</span>
                </div>
            </div>

            <div class="contacts-area">
                <div id="contactsFieldBoard(${i})" class="contacts-board"></div>
                <div id="prioField${i}" class="prio-field">
                    ${singleTask['prio']}
                </div>
            </div>
        </div>`
}

{/* <span id="subTasksField${i}" class="style-sub-tasks"></span> */}


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

function returnHtmlSubtasks(subTask) {
    return `
    <span class="style-sub-tasks">${subTask}</span>`
}

function returnHtmlContacts(contactForTask, j) {
    return `
    <div id="initialArea${j}" class="contact-board">${contactForTask['nameInitials']}</div>`
}