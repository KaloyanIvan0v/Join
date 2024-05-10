function startDragging(id) {
  currentDraggedElement = id;
  rotateTaksCard(id);
  previewDrop(id);
}

function allowDrop(event) {
  event.preventDefault();
}

function moveElementTo(newstatement) {
  tasks[getIndexOfElmentById(currentDraggedElement, tasks)].statement = newstatement;
  renderTasks(getFilteredTasks());
  setSesionStorage("tasks", tasks);
  setItem("tasks", JSON.stringify(tasks));
}

function previewDrop(id) {
  if (previewElementIsNotFarLeft(id)) {
    renderPreviewElements(id, 0, "left");
    setPreviewElementwidthAndHeight(".preview-element-left");
  }
  if (previewElementIsNotFarRight(id)) {
    renderPreviewElements(id, 1, "right");
    setPreviewElementwidthAndHeight(".preview-element-right");
  }
}

function previewElementIsNotFarLeft(id) {
  return calculatePreviewAreasPosition(id)[0] > -1;
}

function previewElementIsNotFarRight(id) {
  return calculatePreviewAreasPosition(id)[1] < 4;
}

function renderPreviewElements(id, position, side) {
  let taskAreas = initTaskAreas();
  let previewAreasPosition = calculatePreviewAreasPosition(id);
  taskAreas[previewAreasPosition[position]].innerHTML += previewElementHtml(side);
}

function calculatePreviewAreasPosition(id) {
  let taskAreaPosition = getTaskStatementIndex(id);
  let previewTaskAreas = [taskAreaPosition - 1, taskAreaPosition + 1];
  return previewTaskAreas;
}

function getDragedElementWidthAndHeigth() {
  let width = document.getElementById(`taskCard${currentDraggedElement}`).offsetWidth;
  let height = document.getElementById(`taskCard${currentDraggedElement}`).offsetHeight;
  return [width, height];
}

function setPreviewElementwidthAndHeight(targerElement) {
  let widthAndHeight = getDragedElementWidthAndHeigth();
  let previewElementRight = document.querySelector(targerElement);
  previewElementRight.style.width = `${widthAndHeight[0]}px`;
  previewElementRight.style.height = `${widthAndHeight[1]}px`;
}

function rotateTaksCard(id) {
  let taskCard = document.getElementById(`taskCard${id}`);
  taskCard.style.transform = "rotate(5deg)";
}
