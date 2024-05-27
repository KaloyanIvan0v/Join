/**
 * This is the Initialfunction.
 */
async function init() {
  await loadTasks();
  includeHTML();
  getTime();
  writeNumberOfAllTasks();
  filterHighestPrio();
  countStatements("toDo");
  countStatements("done");
  countStatements("inProgress");
  countStatements("awaitFeedback");
  upCommingDeadline();
}

/**
 * Render the number of all tasks to summery.html
 */
function writeNumberOfAllTasks() {
  document.getElementById("numberOfTasksInBoard").innerHTML = tasks.length;
}

/**
 * Filter the Array Tasks for prio Urgent.
 */
function filterHighestPrio() {
  // search for high prio Tasks.
  let count = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i]["prio"] === "Urgent") {
      count++;
    }
  }
  document.getElementById("highestPrio").innerHTML = count;
}

/**
 * counts the number of statementtype and render it.
 *
 * @param {string} index - Id of current statement.
 */
function countStatements(index) {
  //Count all Tasks.
  let statementCounts = 0;
  try {
    tasks.forEach((task) => {
      if (task.statement === index) {
        statementCounts++;
      }
    });
  } 
  catch (e) {
    console.log(e);
  }
  document.getElementById(`count${index}`).innerHTML = statementCounts;
}

/**
 * Change the image of an elament on Hover.
 *
 * @param {string} element - The Elements specific ID.
 * @param {string} image - The Image.
 */
function changeImageOnHover(element, image) {
  let newImage = image;
  document.getElementById(element).setAttribute("src", newImage);
}

/**
 * Change the image of an elament on Hover.
 *
 * @param {string} element - The Elements specific ID.
 * @param {string} image - The Image.
 */
function changeImageOnUnHover(element, image) {
  let newImage = image;
  document.getElementById(element).setAttribute("src", newImage);
}

/**
 * Search for shortest deadline.
 *
 * @returns
 */
function upCommingDeadline() {
  //search for shortest deadline
  const options = { month: "long", day: "numeric", year: "numeric" };
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
  const deadlineDateToString = deadlineDate.toLocaleString("en-US", options);
  document.getElementById("deadlineH3").innerHTML = `${deadlineDateToString}`;
}

/**
 * redirect to board.html at set activesite to sessionstorage.
 */
function loadBoardHTML() {
  setActiveSite("board");
  window.location.assign("/html/board.html");
}

/**
 * Change greetings depending on daytime.
 */
function getTime() {
  let actualDate = new Date();
  let hours = actualDate.getHours();
  if (hours >= 2 && hours < 11) {
    document.getElementById("greetingsH4").innerHTML = "Good morning:";
  } else if (hours >= 11 && hours < 17) {
    document.getElementById("greetingsH4").innerHTML = "Good day:";
  } else {
    document.getElementById("greetingsH4").innerHTML = "Good evening:";
  }
}
