function init_board() {
    includeHTML();
    getFromLocalStorage();
}

function getFromLocalStorage() {
    let tasksAsText = localStorage.getItem('tasks');
    let tasksBoard = JSON.parse(tasksAsText);

    loadNewTasks(tasksBoard);
}

function loadNewTasks(tasksBoard) {
    let toDoField = document.getElementById('categoryToDo');

    toDoField.innerHTML = '';
    for(i = 0; i < tasksBoard.length; i++) {
        let singleTask = tasksBoard[i];
        toDoField.innerHTML += returnHtmlShowToDos(singleTask); 
    }
}

function returnHtmlShowToDos(singleTask) {
    return `
    <div>
        <span>${singleTask['title']}</span
        <span>Hallo</span
    </div>`
}