const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const todoCheckedList = document.getElementById("todoCheckedList");
const delAllBtn = document.getElementById("DelAllBtn");
const delPopUp = document.getElementById("DelPopUp");
const deletePopUpContainer = document.getElementById("DeletePopUpContainer");
const checkedItemsHeader = document.querySelector(".CheckedItems");
const checkedCountDisplay = checkedItemsHeader.querySelector("p");
let itemToDelete = null;
let isDeletingAll = false;

document.addEventListener("DOMContentLoaded", () => {
  updateCheckedCount();
});

// Add Task

addBtn.addEventListener("click", addTask);

function addTask() {
  const taskText = todoInput.value.trim();

  if (taskText) {
    createTaskElement(taskText);
    todoInput.value = "";
    todoInput.focus();
    updateCheckedCount();
  } else {
    alert("Please enter a task!");
  }
}

// Create Task Element

function createTaskElement(taskText, isChecked = false) {
  const li = document.createElement("li");
  li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${
          isChecked ? "checked" : ""
        }>
        <span class="task-text">${taskText}</span>
        <i class="fa-regular EditIcons fa-pen-to-square"></i>
        <i class="fa-regular DelIcons fa-trash-can"></i>
    `;

  if (isChecked) {
    li.querySelector(".task-text").style.textDecoration = "line-through";
    li.querySelector(".task-text").style.color = "gray";
    todoCheckedList.appendChild(li);
  } else {
    todoList.prepend(li);
  }

  const checkbox = li.querySelector(".task-checkbox");
  const editIcon = li.querySelector(".EditIcons");
  const deleteIcon = li.querySelector(".DelIcons");

  checkbox.addEventListener("change", toggleTaskStatus);
  editIcon.addEventListener("click", editTask);
  deleteIcon.addEventListener("click", showDeletePopup);

  return li;
}

// Edit Task

function editTask(e) {
  const li = e.target.closest("li");
  console.log(li);
  const taskText = li.querySelector(".task-text");
  const currentText = taskText.textContent;
  const newText = prompt("Edit your task:", currentText);

  if (newText !== null && newText.trim() !== "") {
    taskText.textContent = newText.trim();
  }
}

// Toggle Task Status

function toggleTaskStatus(e) {
  const checkbox = e.target;
  const li = checkbox.closest("li");
  const taskText = li.querySelector(".task-text");

  if (checkbox.checked) {
    taskText.style.textDecoration = "line-through";
    taskText.style.color = "gray";
    todoCheckedList.appendChild(li);
  } else {
    taskText.style.textDecoration = "none";
    taskText.style.color = "inherit";
    todoList.appendChild(li);
  }

  updateCheckedCount();
}

// Show delete popup

function showDeletePopup(e) {
  itemToDelete = e.target.closest("li");
  isDeletingAll = false;
  deletePopUpContainer.style.display = "flex";
  delPopUp.style.display = "flex";
}

// Delete Single Task
function deleteTask() {
  if (itemToDelete) {
    itemToDelete.remove();
    itemToDelete = null;
    updateCheckedCount();
  }
  delPopUp.style.display = "none";
  deletePopUpContainer.style.display = "none";
}

// Delete All Checked Tasks

delAllBtn.addEventListener("click", showDeleteAllPopup);

function showDeleteAllPopup() {
  if (todoCheckedList.children.length > 0) {
    isDeletingAll = true;
    deletePopUpContainer.style.display = "flex";
    delPopUp.style.display = "flex";
  }
}

function deleteAllChecked() {
  while (todoCheckedList.firstChild) {
    todoCheckedList.removeChild(todoCheckedList.firstChild);
  }
  updateCheckedCount();
  delPopUp.style.display = "none";
  deletePopUpContainer.style.display = "none";
}

// Cancel Delete

delPopUp.querySelector(".Cancel-Btn").addEventListener("click", cancelDelete);

function cancelDelete() {
  itemToDelete = null;
  isDeletingAll = false;
  delPopUp.style.display = "none";
  deletePopUpContainer.style.display = "none";
}

function updateCheckedCount() {
  const checkedCount = todoCheckedList.children.length;
  const icon = checkedCount > 0 ? "fa-angle-up" : "fa-angle-down";

  checkedCountDisplay.innerHTML = `<i class="fa-solid ${icon}"></i> ${checkedCount} Checked Items`;

  if (checkedCount > 0) {
    checkedItemsHeader.style.display = "flex";
    todoCheckedList.style.display = "block";
  } else {
    checkedItemsHeader.style.display = "none";
    todoCheckedList.style.display = "none";
  }
}

checkedItemsHeader.addEventListener("click", (e) => {
  if (todoCheckedList.children.length > 0 && !e.target.closest("#DelAllBtn")) {
    const isVisible = todoCheckedList.style.display !== "none";
    todoCheckedList.style.display = isVisible ? "none" : "block";

    const angleIcon = checkedCountDisplay.querySelector("i");
    angleIcon.className = isVisible
      ? "fa-solid fa-angle-down"
      : "fa-solid fa-angle-up";
  }
});

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

delPopUp.querySelector(".Del-Btn").addEventListener("click", () => {
  if (isDeletingAll) {
    deleteAllChecked();
  } else {
    deleteTask();
  }
});
