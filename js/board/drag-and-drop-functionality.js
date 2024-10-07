/** @type {number|string|null} */
let currentDraggedElement = null
document.addEventListener('dragend', stopDragging)

/**
 * Initiates the dragging of an element by its ID.
 * Rotates the card and previews the drop position.
 * @param {number|string} id - The ID of the element being dragged.
 */
function startDragging(id) {
  currentDraggedElement = id
  rotateTaskCard(id)
  previewDrop(id)
}

/**
 * Stops dragging and resets the rotation of the task card.
 */
function stopDragging() {
  if (currentDraggedElement !== null) {
    const taskCard = document.getElementById(`taskCard${currentDraggedElement}`)
    taskCard.style.transform = 'rotate(0deg)'
    currentDraggedElement = null
    renderTasks(getFilteredTasks())
  }
}

/**
 * Prevents the default behavior to allow dropping of an element.
 * @param {Event} event - The drag event.
 */
function allowDrop(event) {
  event.preventDefault()
}

/**x
 * Moves the currently dragged element to a new statement.
 * Updates the tasks array and stores the updated data.
 * @param {string} newstatement - The new statement to assign to the dragged element.
 */
function moveElementTo(newstatement) {
  tasks[getIndexOfElementById(currentDraggedElement, tasks)].statement = newstatement
  renderTasks(getFilteredTasks())
  setSessionStorage('tasks', tasks)
  setItem('tasks', tasks)
  stopDragging()
}

/**
 * Renders the preview elements for where the dragged element can be dropped.
 * @param {number|string} id - The ID of the element being dragged.
 */
function previewDrop(id) {
  if (previewElementIsNotFarLeft(id)) {
    renderPreviewElements(id, 0, 'left')
    setPreviewElementwidthAndHeight('.preview-element-left')
  }
  if (previewElementIsNotFarRight(id)) {
    renderPreviewElements(id, 1, 'right')
    setPreviewElementwidthAndHeight('.preview-element-right')
  }
}

/**
 * Checks if the preview element is not too far to the left.
 * @param {number|string} id - The ID of the dragged element.
 * @returns {boolean} True if the element isn't too far to the left, otherwise false.
 */
function previewElementIsNotFarLeft(id) {
  return calculatePreviewAreasPosition(id)[0] > -1
}

/**
 * Checks if the preview element is not too far to the right.
 * @param {number|string} id - The ID of the dragged element.
 * @returns {boolean} True if the element isn't too far to the right, otherwise false.
 */
function previewElementIsNotFarRight(id) {
  return calculatePreviewAreasPosition(id)[1] < 4
}

/**
 * Renders the preview elements to show where the dragged card can be dropped.
 * @param {number|string} id - The ID of the dragged element.
 * @param {number} position - The position in the preview array.
 * @param {string} side - The side where the preview element should be placed ("left" or "right").
 */
function renderPreviewElements(id, position, side) {
  const taskAreas = initTaskAreas()
  const previewAreasPosition = calculatePreviewAreasPosition(id)
  taskAreas[previewAreasPosition[position]].innerHTML += previewElementHtml(side)
}

/**
 * Calculates the possible preview areas for dropping the dragged element.
 * @param {number|string} id - The ID of the dragged element.
 * @returns {number[]} An array with the index of the preview areas to the left and right.
 */
function calculatePreviewAreasPosition(id) {
  const taskAreaPosition = getTaskStatementIndex(id)
  return [taskAreaPosition - 1, taskAreaPosition + 1]
}

/**
 * Gets the width and height of the currently dragged element.
 * @returns {number[]} An array containing the width and height of the dragged element.
 */
function getDragedElementWidthAndHeigth() {
  const width = document.getElementById(`taskCard${currentDraggedElement}`).offsetWidth
  const height = document.getElementById(`taskCard${currentDraggedElement}`).offsetHeight
  return [width, height]
}

/**
 * Sets the width and height of the preview element to match the dragged element.
 * @param {string} targerElement - A selector for the preview element to resize.
 */
function setPreviewElementwidthAndHeight(targerElement) {
  const [width, height] = getDragedElementWidthAndHeigth()
  const previewElement = document.querySelector(targerElement)
  previewElement.style.width = `${width}px`
  previewElement.style.height = `${height}px`
}

/**
 * Rotates the task card to visually indicate it is being dragged.
 * @param {number|string} id - The ID of the task card to rotate.
 */
function rotateTaskCard(id) {
  const taskCard = document.getElementById(`taskCard${id}`)
  taskCard.style.transform = 'rotate(5deg)'
}

/**
 * Opens the task menu for a specific task.
 * @param {string} id - The ID of the task for which the menu should be opened.
 */
function openTaskMenu(id) {
  event.stopPropagation()
  renderTaskMenu(id)
}

/**
 * Renders the task menu for a specific task.
 * @param {string} id - The ID of the task for which the menu should be rendered.
 */
function renderTaskMenu(id) {
  openPopUp()
  let popUpDiv = document.getElementById('id-pop-up')
  popUpDiv.innerHTML = renderTaskMenuHtml(id)
}

/**
 * Moves a task to a new statement.
 * @param {string} id - The ID of the task to move.
 * @param {string} statement - The new statement for the task.
 */
function moveTaskTo(id, statement) {
  let task = tasks[getIndexOfElementById(id, tasks)]
  task.statement = statement
  renderTasks(getFilteredTasks())
  closePopUp()
  setItem('tasks', tasks)
}
