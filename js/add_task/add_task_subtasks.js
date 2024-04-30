

function changeIconsSubtask() {
    let addIconSubtasks = document.getElementById("addIconSubtasks");
    let subTask = document.getElementById("inputFieldSubtasks");
  
    addIconSubtasks.innerHTML = "";
  
    if (checkChangeIcons == false) {
      addIconSubtasks.innerHTML = returnHtmlCheckAndClear();
      checkChangeIcons = false;
      renderSubTasks();
    } else {
      addIconSubtasks.innerHTML = returnHtmlAdd();
      checkChangeIcons = false;
    }
    renderSubTasks();
}

function addNewSubTask() {
    let id = increaseId(subTasks);
    let singleNewTask = document.getElementById("subTasks");
    let singleNewTaskValue = singleNewTask.value;
  
    if (singleNewTaskValue.length >= 3) {
        subTasks.push({
        'subTask': singleNewTaskValue,
        'status': false,
        'id': id,
      })
    }
    singleNewTask.blur();
    renderSubTasks("newSubtask");
}

function deleteSubtask(i) {
    subTasks.splice(i, 1);
    setItem("subTasks", subTasks);
    renderSubTasks();
}
  
async function changeSubtask(i) {
    let changedSubTask = document.getElementById(`inputField${i}`).value;
    subTasks[i]['subTask'] = changedSubTask;
    await setItem("subTasks", subTasks);
    renderSubTasks();
}

function renderSubTasks(operator) {
    let newTaskField = document.getElementById("newSubTaskField");
    let singleNewTask = document.getElementById("subTasks");
    singleNewTask.value = "";
    newTaskField.innerHTML = "";
  
    for (i = 0; i < subTasks.length; i++) {
      let newSubTask = subTasks[i]['subTask'];
      newTaskField.innerHTML += returnHtmlNewSubtasks(newSubTask);
    }
    checkIfNewSubTask(operator);
  }
  
  function resetAddNewSubtask() {
    let subTasks = document.getElementById("subTasks");
    subTasks.value = "";
    checkChangeIcons = true;
    changeIconsSubtask();
  }
  
  async function checkIfNewSubTask(operator) {
    if (operator == "newSubtask") {
      checkChangeIcons = true;
      changeIconsSubtask();
      await setItem("subTasks", subTasks);
    }
  }

  function editSubtask(i) {
    let subTaskField = document.getElementById(`subTaskElement${i}`);
    let subTask = subTasks[i]['subTask'];

    subTaskField.classList.add('list-element-subtasks');
    subTaskField.classList.remove('hover-subtask');
    subTaskField.innerHTML = editSubtaskHtml(i, subTask);
    inputFocus(i);

  }

  function inputFocus(i) {
    let inputField = document.getElementById(`inputField${i}`);
    inputField.focus();
    inputField.setSelectionRange(
        inputField.value.length,
        inputField.value.length
    );
}