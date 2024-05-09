function openAddTaskTemplate(statement) {
  openPopUp();
  let idPopUp = document.getElementById("id-pop-up");
  idPopUp.innerHTML += returnHtmlTaskTemplate(
    "createTaskAtBoard",
    "closeTaskFormTemplate",
    "cancle",
    statement
  );
  selectPriority();
  currentDate();
  renderExitCross("id-headline-area");
  changePrio(1);
}

async function createTaskAtBoard(statement) {
  if (checkCategoryInput()) {
    addTask();
    if (statement != "undefined") {
      tasks[tasks.length - 1].statement = statement;
      setItem("tasks", tasks);
    }
    await setSesionStorage("tasks", tasks);
    resetInputFields();
    closePopUp();
    tasks = JSON.parse(sessionStorage.getItem("tasks"));
    renderTasks(getFilteredTasks());
  } else {
    setErrorBorderColor("containerCategory", 2000);
  }
}

function checkCategoryInput() {
  let inputCategory = document.getElementById("categoryDropdown");
  let categoryValue = inputCategory.textContent;
  if (categoryValue === "Select task category") {
    return false;
  } else {
    return true;
  }
}

function renderExitCross(elementId) {
  let div = document.getElementById(elementId);
  div.innerHTML += returnExitCrossHtml();
}

function closeAddTaskPopUp() {
  resetInputFields();
  setTimeout(closePopUp, 20);
}

function closeTaskFormTemplate(event) {
  if (event) {
    event.preventDefault();
  }
  addTaskFormResetFields();
  closePopUp();
}

function addTaskFormResetFields() {
  clearContactsChecked();
}

function clearAddTaskForm() {
  let subTasks = document.getElementById("subTasks");
  let initialArea = document.getElementById("initialArea");
  let newSubTaskField = document.getElementById("newSubTaskField");
  let initialen = document.getElementById("checkboxes");

  title.value = "";
  description.value = "";
  initialArea.innerHTML = "";
  subTasks.value = "";
  newSubTaskField.innerHTML = "";
  checkedUsers = [];
  initialen.innerHTML = "";
  furtherResetField();
  closePopUp();
}
