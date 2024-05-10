function openAddTaskTemplate(statement) {
  openPopUp();
  renderAddTaskTemplate(statement);
  selectPriority();
  currentDate();
  renderExitCross("id-headline-area");
  changePrio(1);
}

function renderAddTaskTemplate(statement) {
  let popUpElement = document.getElementById("id-pop-up");
  popUpElement.innerHTML += returnHtmlTaskTemplate(
    "createTaskAtBoard",
    "closeTaskFormTemplate",
    "cancle",
    statement
  );
}

async function createTaskAtBoard(statement) {
  if (categorySelected()) {
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

function categorySelected() {
  let inputCategory = document.getElementById("categoryDropdown");
  let categoryValue = inputCategory.textContent;
  return categoryValue !== "Select task category";
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
  clearContactsChecked();
  closePopUp();
}

// function clearAddTaskForm() {
//   let subTasks = document.getElementById("subTasks");
//   let initialArea = document.getElementById("initialArea");
//   let newSubTaskField = document.getElementById("newSubTaskField");
//   let initialen = document.getElementById("checkboxes");

//   title.value = "";
//   description.value = "";
//   initialArea.innerHTML = "";
//   subTasks.value = "";
//   newSubTaskField.innerHTML = "";
//   checkedUsers = [];
//   initialen.innerHTML = "";
//   furtherResetField();
//   closePopUp();
// }
