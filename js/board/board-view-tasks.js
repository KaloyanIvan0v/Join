function openTaskDetailView(i, id) {
  openPopUp();
  let popUpDiv = document.getElementById("id-pop-up");
  popUpDiv.innerHTML = openTaskDetailViewHtml(tasks[getIndexOfElmentById(id, tasks)], i, id);
  setCategoryColor(i, getFilteredTasks(), id);
  setPriorityTaskCard(i, id);
  renderContactsBoardInitials(true, id, `contactsFieldBoard(${id})`);
  handleHoverButtonDeleteEditTask();
  renderTaskAssignedNames(id);
  renderSubTasksBoard(i, id);
}

function renderFullName(i, contactsForTask) {
  let backgroundDialog = document.getElementById("backgroundDialog");
  if (backgroundDialog.classList.contains("background-dialog")) {
    let contactsFieldBoard = document.getElementById(`contactsFieldBoardFullName(${i})`);
    contactsFieldBoard.innerHTML = "";
    for (j = 0; j < contactsForTask.length; j++) {
      fullName = contactsForTask[j];
      contactsFieldBoard.innerHTML += returnHtmlContactsFullName(fullName);
    }
  }
}

function toggleCheckboxSubTask(i, subTaskId, id) {
  if (getSubtaskStatus(i, subTaskId)) {
    tasks[i].subTasks[getIndexOfElmentById(subTaskId, tasks[i].subTasks)].status = false;
  } else {
    tasks[i].subTasks[getIndexOfElmentById(subTaskId, tasks[i].subTasks)].status = true;
  }
  renderSubTasksBoard(i, id);
  setItem("tasks", tasks);
}

function getSubtaskStatus(i, subTaskId) {
  let subTaskStatus = tasks[i].subTasks[getIndexOfElmentById(subTaskId, tasks[i].subTasks)].status;
  return subTaskStatus;
}

function deleteTask(taskId) {
  tasks.splice(getIndexOfElmentById(taskId, tasks), 1);
  closePopUp();
  setSesionStorage("tasks", tasks);
  renderTasks(getFilteredTasks());
  setItem("tasks", JSON.stringify(tasks));
}
