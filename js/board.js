async function init_board() {
    await includeHTML();
    loadNewTasks();
}

function loadNewTasks() {
    tasks = getFromLocalStorage('tasks') || [];
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
    whichPriorityBoard(i);
}

function whichPriorityBoard(i) {
    let prioField = document.getElementById(`prioField${i}`);
    let singleTaskPrio = tasks[i]['prio'];

    prioField.innerHTML = '';

    if(singleTaskPrio == 'low') {
        prioField.innerHTML = '<img src="' + '../img/Capa 2.png' + '" alt="Bildbeschreibung">'
    } else if(singleTaskPrio == 'medium') {
        prioField.innerHTML = '<img src="' + '../img/Capa 2 (1).png' + '" alt="Bildbeschreibung">'
    } else {
        prioField.innerHTML = '<img src="' + '../img/Capa 1.png' + '" alt="Bildbeschreibung">'
    }
}

function returnHtmlShowToDos(singleTask, i) {
    return `
    <div class="task-card">
        <div class="task-card-category">
            <span id="categoryField${i}" class="which-category">
                ${singleTask['category']}
            </span>
        </div>
        
        <div class="y">
            <div class="">
                ${singleTask['title']}
            </div>
        </div>

        <div class="">
            <div class="">
                ${singleTask['description']}
            </div>
        </div>

        <div class="">
            <div class="">
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