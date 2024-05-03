async function init() {
  await loadTasks();
  includeHTML();
  writeNumberOfAllTasks();
  filterHighestPrio();
  countStatements("toDo");
  countStatements("done");
  countStatements("inProgress");
  countStatements("awaitFeedback");
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

}

