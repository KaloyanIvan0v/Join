let tasks = [];

function init_board() {
    includeHTML();
    loadNewTasks();
}

function loadNewTasks() {
    // getFromLocalStorage('tasks');
    // valueAsJSON = tasks;
    tasks = getFromLocalStorage('tasks')
    let toDoField = document.getElementById('categoryToDo');

    toDoField.innerHTML = '';
    for(i = 0; i < tasks.length; i++) {
        let singleTask = tasks[i];
        toDoField.innerHTML += returnHtmlShowToDos(singleTask); 
    }
}

function returnHtmlShowToDos(singleTask) {
    return `
    <div class="taskCard">
        <span>${singleTask['title']}</span>
        <span>${singleTask['description']}</span>
        <span>${singleTask['assignedTo']}</span>
        <span>${singleTask['dueDate']}</span>
        <span>${singleTask['category']}</span>
        <span>${singleTask['subTasks']}</span>
        <span>${singleTask['prio']}</span>
    </div>`
}

//Hallo Koloyab, ich habe deine Funktion noch erweitert und gesagt, dass nur der valueASJSON übergeben wird, wenn er auch existiert. Grüße, Christopher

function getFromLocalStorage(key) {
    value = localStorage.getItem(key);
    valueAsJSON = JSON.parse(value);
    if(valueAsJSON) {
      return valueAsJSON;
    }
  }