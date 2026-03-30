// --- ESTADO DE LA APLICACIÓN ---
let tasks = JSON.parse(localStorage.getItem("hotelTasks")) || [];
let categories = JSON.parse(localStorage.getItem("hotelCategories")) || [
  "Admin",
  "Guest",
  "Staff",
  "Revenue",
];
let activeTaskId = null;
let timerInterval = null;

// --- SELECTORES ---
const taskList = document.getElementById("taskList");
const btnCreate = document.getElementById("btnCreate");
const taskDescInput = document.getElementById("taskDesc");
const taskCategoryInput = document.getElementById("taskCategory");

// --- LÓGICA DE TIEMPO ---

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => (v < 10 ? "0" + v : v)).join(":");
}

function toggleTimer(id) {
  const task = tasks.find((t) => t.id === id);

  if (activeTaskId && activeTaskId !== id) {
    stopActiveTask();
  }

  if (!task.isRunning) {
    task.isRunning = true;
    activeTaskId = id;
    timerInterval = setInterval(() => {
      task.seconds++;
      saveData();
      renderTasks();
    }, 1000);
  } else {
    stopActiveTask();
  }
  renderTasks();
}

function stopActiveTask() {
  clearInterval(timerInterval);
  const task = tasks.find((t) => t.id === activeTaskId);
  if (task) task.isRunning = false;
  activeTaskId = null;
  saveData();
}

// --- LÓGICA DE CATEGORÍAS ---

function renderCategories() {
  const select = document.getElementById("taskCategory");
  select.innerHTML = categories
    .map((cat) => `<option value="${cat}">${cat}</option>`)
    .join("");
}

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

// --- GESTIÓN DE DATOS ---

document.getElementById("btnToggleNewCat")?.addEventListener("click", () => {
  const container = document.getElementById("newCatContainer");
  container?.classList.toggle("d-none");
});

btnCreate.addEventListener("click", () => {
  const desc = taskDescInput.value;
  const newCatInput = document.getElementById("newCategoryName");
  let cat = taskCategoryInput.value;

  if (newCatInput?.value.trim() !== "") {
    cat = newCatInput.value.trim();
    if (!categories.includes(cat)) {
      categories.push(cat);
      localStorage.setItem("hotelCategories", JSON.stringify(categories));
      renderCategories();
    }
  }

  if (!desc) return alert("Por favor, describe la tarea.");

  const newTask = {
    id: Date.now(),
    description: desc,
    category: cat,
    seconds: 0,
    isRunning: false,
    date: new Date().toLocaleDateString(),
    color: stringToColor(cat),
  };

  tasks.unshift(newTask);
  saveData();
  renderTasks();

  taskDescInput.value = "";
  if (newCatInput) {
    newCatInput.value = "";
    document.getElementById("newCatContainer")?.classList.add("d-none");
  }
});

function saveData() {
  localStorage.setItem("hotelTasks", JSON.stringify(tasks));
}

// --- RENDERIZADO DE LA INTERFAZ ---

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = `card card-task shadow-sm p-3 ${task.isRunning ? "border-primary" : ""}`;
    card.style.borderLeft = `5px solid ${task.color}`;

    card.innerHTML = `
    <div class="row align-items-center">
    <div class="col-md-6">
      <span class="badge mb-1 category-badge" style="background-color: ${task.color}">${task.category}</span>
      <h5 class="mb-0 ${task.isRunning ? "text-primary" : ""}">${task.description}</h5>
      <small class="text-muted">${task.date}</small>
    </div>
    <div class="col-md-3 text-center">
      <div class="timer-display ${task.isRunning ? "text-primary" : "text-dark"}">
      ${formatTime(task.seconds)}
      </div>
    </div>
    <div class="col-md-3 text-end">
      <button onclick="toggleTimer(${task.id})" class="btn btn-light rounded-circle shadow-sm me-2">
      <span class="material-icons-round ${task.isRunning ? "text-danger" : "text-success"}">
        ${task.isRunning ? "pause" : "play_arrow"}
      </span>
      </button>
      <button onclick="deleteTask(${task.id})" class="btn btn-light rounded-circle shadow-sm">
      <span class="material-icons-round text-muted">delete</span>
      </button>
    </div>
    </div>
  `;
    taskList.appendChild(card);
  });
}

function deleteTask(id) {
  if (activeTaskId === id) stopActiveTask();
  tasks = tasks.filter((t) => t.id !== id);
  saveData();
  renderTasks();
}

// Carga inicial
renderCategories();
renderTasks();
