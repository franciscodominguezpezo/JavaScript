// 1. VERIFICACIÓN DE SESIÓN
const currentUser = localStorage.getItem("session");

if (!currentUser) {
  window.location.href = "index.html";
}

// Variables Globales
let calendar;
const userKey = `data_${currentUser}`;

// 2. INICIALIZACIÓN AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("user-email").innerText = currentUser;
  loadUserProfile();
  initCalendar();
  initProfilePic();
});

// --- LÓGICA DE PERFIL (Nombre, Foto, LinkedIn) ---

function updateWelcomeMessage(nombre) {
  const displayTitle = nombre || currentUser;
  document.getElementById("welcome-msg").innerText =
    `Bienvenido, ${displayTitle}`;
}

function loadUserProfile() {
  const userData = JSON.parse(localStorage.getItem(userKey)) || {};
  const nombreGuardado = userData.nombre || "";

  document.getElementById("nombre-completo").value = nombreGuardado;
  document.getElementById("linkedin-url").value = userData.linkedin || "";

  updateWelcomeMessage(nombreGuardado);

  if (userData.foto) {
    document.getElementById("profile-pic").src = userData.foto;
  }
}

function guardarNombre() {
  const nuevoNombre = document.getElementById("nombre-completo").value;
  actualizarDato("nombre", nuevoNombre);
  updateWelcomeMessage(nuevoNombre);

  Swal.fire({
    icon: "success",
    title: "Nombre actualizado",
    timer: 2000,
    showConfirmButton: false,
  });
}

function guardarLinkedIn() {
  const url = document.getElementById("linkedin-url").value;
  actualizarDato("linkedin", url);
  Swal.fire({
    icon: "success",
    title: "LinkedIn Guardado",
    toast: true,
    position: "top-end",
    timer: 3000,
    showConfirmButton: false,
  });
}

function actualizarDato(campo, valor) {
  const userData = JSON.parse(localStorage.getItem(userKey)) || {};
  userData[campo] = valor;
  localStorage.setItem(userKey, JSON.stringify(userData));
}

function cambiarContraseña() {
  const actual = document.getElementById("password-actual").value;
  const nueva = document.getElementById("password-nueva").value;
  const passGuardada = localStorage.getItem(currentUser);

  if (actual === passGuardada) {
    if (nueva.length < 4)
      return Swal.fire("Error", "Mínimo 4 caracteres", "warning");
    localStorage.setItem(currentUser, nueva);
    Swal.fire("Éxito", "Contraseña actualizada", "success");
    document.getElementById("password-actual").value = "";
    document.getElementById("password-nueva").value = "";
  } else {
    Swal.fire("Error", "La contraseña actual es incorrecta", "error");
  }
}

function initProfilePic() {
  const pic = document.getElementById("profile-pic");
  const input = document.getElementById("foto-input");
  pic.addEventListener("click", () => input.click());
  input.addEventListener("change", function () {
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64Image = e.target.result;
      pic.src = base64Image;
      actualizarDato("foto", base64Image);
      Swal.fire({
        icon: "success",
        title: "Foto actualizada",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    };
    if (this.files[0]) reader.readAsDataURL(this.files[0]);
  });
}

// --- LÓGICA DE EVENTOS (Calendario, Editar, Eliminar) ---

function initCalendar() {
  const calendarEl = document.getElementById("calendario");
  const userData = JSON.parse(localStorage.getItem(userKey)) || {};
  const eventos = userData.eventos || [];

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "es",
    events: eventos, // FullCalendar asocia automáticamente el campo 'id'
    eventClick: function (info) {
      // IMPORTANTE: info.event.id nos da el ID único del evento clicado
      abrirMenuEvento(info.event.id);
    },
  });
  calendar.render();
  renderListaEventos(eventos);
}

function abrirMenuEvento(id) {
  if (!id) return;

  const userData = JSON.parse(localStorage.getItem(userKey));
  const evento = userData.eventos.find(
    (e) => e.id.toString() === id.toString(),
  );

  if (!evento) return;

  Swal.fire({
    title: "Gestionar Evento",
    text: evento.title,
    icon: "info",
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: "Editar",
    denyButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    denyButtonColor: "#d33",
  }).then((result) => {
    if (result.isConfirmed) {
      editarEvento(id);
    } else if (result.isDenied) {
      confirmarEliminar(id);
    }
  });
}

function agregarEvento() {
  const titulo = document.getElementById("evento-titulo").value;
  const fecha = document.getElementById("evento-fecha").value;
  const desc = document.getElementById("evento-descripcion").value;

  if (!titulo || !fecha)
    return Swal.fire("Error", "Título y fecha obligatorios", "warning");

  const nuevoEvento = {
    id: Date.now().toString(), // Generamos ID único como String
    title: titulo,
    start: fecha,
    description: desc,
  };

  const userData = JSON.parse(localStorage.getItem(userKey)) || {};
  userData.eventos = userData.eventos || [];
  userData.eventos.push(nuevoEvento);
  localStorage.setItem(userKey, JSON.stringify(userData));

  // Actualizar el calendario sin recargar
  calendar.addEvent(nuevoEvento);
  renderListaEventos(userData.eventos);

  // Limpiar formulario
  document.getElementById("evento-titulo").value = "";
  document.getElementById("evento-fecha").value = "";
  document.getElementById("evento-descripcion").value = "";
  Swal.fire("Éxito", "Evento añadido", "success");
}

async function editarEvento(id) {
  const userData = JSON.parse(localStorage.getItem(userKey));
  const index = userData.eventos.findIndex(
    (e) => e.id.toString() === id.toString(),
  );
  const evento = userData.eventos[index];

  const { value: formValues } = await Swal.fire({
    title: "Editar Evento",
    html:
      `<label class="form-label">Título</label><input id="edit-title" class="swal2-input" value="${evento.title}">` +
      `<label class="form-label">Fecha</label><input id="edit-date" type="datetime-local" class="swal2-input" value="${evento.start}">`,
    focusConfirm: false,
    preConfirm: () => {
      return {
        title: document.getElementById("edit-title").value,
        start: document.getElementById("edit-date").value,
      };
    },
  });

  if (formValues) {
    userData.eventos[index].title = formValues.title;
    userData.eventos[index].start = formValues.start;
    localStorage.setItem(userKey, JSON.stringify(userData));

    Swal.fire("Actualizado", "", "success").then(() => location.reload());
  }
}

function confirmarEliminar(id) {
  if (!id) return;

  Swal.fire({
    title: "¿Eliminar evento?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar",
    confirmButtonColor: "#d33",
  }).then((result) => {
    if (result.isConfirmed) {
      const userData = JSON.parse(localStorage.getItem(userKey)) || {};
      userData.eventos = userData.eventos.filter(
        (e) => e.id.toString() !== id.toString(),
      );
      localStorage.setItem(userKey, JSON.stringify(userData));

      // Refrescamos visualmente
      location.reload();
    }
  });
}

function renderListaEventos(eventos) {
  const lista = document.getElementById("lista-eventos");
  if (!eventos) return;

  lista.innerHTML = eventos
    .map(
      (ev) => `
        <div class="alert alert-info py-2 mb-2 shadow-sm d-flex justify-content-between align-items-center">
            <div>
              <small><strong>${ev.start.split("T")[0]}</strong></small><br>
              <span>${ev.title}</span>
            </div>
            <button class="btn btn-sm btn-outline-danger border-0" onclick="confirmarEliminar('${ev.id}')">
              🗑️
            </button>
        </div>
    `,
    )
    .join("");
}

function logout() {
  Swal.fire({
    title: "¿Cerrar sesión?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, salir",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("session");
      window.location.href = "index.html";
    }
  });
}
