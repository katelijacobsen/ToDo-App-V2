"use strict";
//global selectors
const input = document.getElementById("task-input");
const ongoingTasksEl = document.getElementById("ongoing");
const completedTasksEl = document.getElementById("completed");
const formTask = document.getElementById("formTask");


input.addEventListener("animationend", () => input.classList.remove("alert"));

//arrays (empty) for test
const aTask = {
  title: "Title",
  id: createID(),
  completed: false,
};

let ongoingTasks = [];
let completedTasks = [];

loadTasks();

displayOngoingTasks();
displayCompletedTasks();

//Unikt ID for hver to-do (anvender en metode)
function createID() {
  return crypto.randomUUID();
} 


formTask.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const data = new FormData(formTask);
  const title = data.get("title");
  
  if(title != "") {
      const description = data.get("description");
      addTask(title, description);
      displayOngoingTasks();
      formTask.reset();
    }
    else{
        input.classList.add("alert"); 
  }
});

//gem opgave med LocalStorage :3
function saveTasks(){
  localStorage.setItem("ongoingTasks", JSON.stringify(ongoingTasks));
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

function loadTasks(){
  const loadedOngoingTasks = localStorage.getItem("ongoingTasks")
  const loadedCompletedTasks = localStorage.getItem("completedTasks")

  if(loadedOngoingTasks){
    ongoingTasks = JSON.parse(loadedOngoingTasks);
  }
  if(loadedCompletedTasks){
    completedTasks = JSON.parse(loadedCompletedTasks);
  }
}

//Tilføj en opgave (funktion med parameter)
function addTask(title, description) {
  //lokal variabel (objekt)
  const newTask = {
    title,
    description,
    id: createID(),
    completed: false,
  };
  ongoingTasks.push(newTask);
  saveTasks();
  //console.log(ongoingTasks);
}
// Indhold til Ongoing Tasks
function displayOngoingTasks() {
  ongoingTasksEl.innerHTML = "";
  ongoingTasks.forEach((task) => {
    const taskEl = document.createElement("li");
    taskEl.classList.add("todo-item");
    taskEl.innerHTML = `
        <div class="task">
            <label class="checkbox-container">
            <input onchange="completedTask('${task.id}')" type="checkbox" name="check" unchecked/>
            </label>
            <div class="content">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            </div>
        </div>
        <button id="removeBtn" onclick="removeTask('${task.id}')" class="remove"><i class="fa fa-trash"></i></button>
    `;

    //animation
    ongoingTasksEl.appendChild(taskEl);
    setTimeout(() => {
      taskEl.classList.add("show");
    }, 10);
  });
};
// Indhold til Completed Tasks
function completedTask(id) {
  const taskToToggle =
    ongoingTasks.find((task) => task.id === id) ||
    completedTasks.find((task) => task.id === id);
  if (taskToToggle) {
    if (taskToToggle.completed) {
      taskToToggle.completed = false;
      ongoingTasks.push(taskToToggle);
      completedTasks = completedTasks.filter((task) => task.id !== id);
    } else {
      taskToToggle.completed = true;
      completedTasks.push(taskToToggle);
      ongoingTasks = ongoingTasks.filter((task) => task.id !== id);
    }
    saveTasks();
    displayOngoingTasks();
    displayCompletedTasks();
  }
}

// Visning for comleted tasks
function displayCompletedTasks() {
  completedTasksEl.innerHTML = "";
  completedTasks.forEach((task) => {
    const taskEl = document.createElement("li");
    taskEl.classList.add("todo-item");
    taskEl.innerHTML = `
        <div class="task">
            <label class="checkbox-container">
            <input onchange="completedTask('${task.id}')" type="checkbox" name="check" checked/>
            </label>
            <div class="content">
            <h3 style="text-decoration: line-through; color: #f0f2f5a6;">${task.title}</h3>
            <p style="text-decoration: line-through; color: #f0f2f5a6;">${task.description}</p>
            </div>
        </div>
        <button id="removeBtn" onclick="removeTask('${task.id}')" class="remove"><i class="fa fa-trash"></i></button>
    `;

    //animation
    completedTasksEl.appendChild(taskEl);
    setTimeout(() => {
      taskEl.classList.add("show");
    }, 30);
  });
}

//Fjern opgaven
function removeTask(id) {
  const taskEl = document.querySelector(`.todo-item button[onclick="removeTask('${id}')"]`).parentElement;

  //animation
  taskEl.classList.add("remove");
  setTimeout(() => {
    if (ongoingTasks.some((task) => task.id === id)) {
      ongoingTasks = ongoingTasks.filter((task) => task.id !== id);
    } else if (completedTasks.some((task) => task.id === id)) {
      completedTasks = completedTasks.filter((task) => task.id !== id);
    }
    saveTasks();
    displayOngoingTasks();
    displayCompletedTasks();
  }, 300);
}
