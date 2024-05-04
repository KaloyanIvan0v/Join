async function init() {
  await loadTasks();
  includeHTML();
  writeNumberOfAllTasks();
  filterHighestPrio();
  countStatements("toDo");
  countStatements("done");
  countStatements("inProgress");
  countStatements("awaitFeedback");
  upCommingDeadline();
}

function writeNumberOfAllTasks() {
  document.getElementById("numberOfTasksInBoard").innerHTML = tasks.length;
}

function filterHighestPrio() {
  let count = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i]['prio'] === 'urgent') {
      count++;
    }
  }
  document.getElementById("highestPrio").innerHTML = count;
  //console.log(count);
}

function countStatements(index) {
  let statementCounts = 0;
  tasks.forEach((task) => {
    if (task.statement === index) {
      statementCounts++;
    }
  });
  document.getElementById(`count${index}`).innerHTML = statementCounts;
}

function changeImageOnHover(element, image) {
  let newImage = image;
  document.getElementById(element).setAttribute('src', newImage);
}

function changeImageOnUnHover(element, image) {
  let newImage = image;
  document.getElementById(element).setAttribute('src', newImage);
}

function upCommingDeadline() {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  if (tasks.length === 0) {
    return null;
  }
  // Initialisiere mit der ersten Deadline
  let shortestDeadline = tasks[0];
  // Iteriere durch das Array, um die kürzeste Deadline zu finden
  for (let i = 1; i < tasks.length; i++) {
    if (new Date(tasks[i].dueDate) < new Date(shortestDeadline.dueDate)) {
      shortestDeadline = tasks[i];
    }
  }
  const deadlineDate = new Date(shortestDeadline.dueDate);
  const deadlineDateToString = deadlineDate.toLocaleString('en-US', options);
  document.getElementById('deadlineH3').innerHTML = `${deadlineDateToString}`;
}

function loadBoardHTML(){
  window.location.assign('/html/board.html');
}

