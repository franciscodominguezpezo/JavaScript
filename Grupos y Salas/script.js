const form = document.getElementById("grupoForm");
const tabla = document.getElementById("tablaGrupos");
const mensajeVacio = document.getElementById("mensajeVacio");
const cardForm = document.getElementById("cardFormulario");
const btnSubmit = document.getElementById("btnSubmit");
const btnCancelar = document.getElementById("btnCancelar");
const formTitle = document.getElementById("formTitle");

document.addEventListener("DOMContentLoaded", mostrarGrupos);

// --- GUARDAR O ACTUALIZAR GRUPO ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fLlegada = document.getElementById("fechaLlegada").value;
  const fSalida = document.getElementById("fechaSalida").value;
  const editId = document.getElementById("editId").value;

  if (fSalida && new Date(fSalida) < new Date(fLlegada)) {
    Swal.fire("Error", "La salida no puede ser anterior a la entrada", "error");
    return;
  }

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const llegadaObj = new Date(fLlegada + "T00:00:00");

  const datosGrupo = {
    id: editId ? parseInt(editId) : Date.now(),
    nombre: document.getElementById("nombreGrupo").value,
    fechaLlegada: fLlegada,
    fechaSalida: fSalida,
    diaSemana: diasSemana[llegadaObj.getDay()],
    pax: document.getElementById("cantidadPax").value || "0",
    habitaciones: document.getElementById("numHabitaciones").value || "0",
    observaciones: document.getElementById("observaciones").value,
    sala: document.getElementById("salaReuniones").checked ? "Sí" : "No",
    catering: document.getElementById("catering").checked ? "Sí" : "No",
  };

  let lista = JSON.parse(localStorage.getItem("hotelGrupos")) || [];

  if (editId) {
    lista = lista.map((g) => (g.id === datosGrupo.id ? datosGrupo : g));
    cancelarEdicion();
  } else {
    lista.push(datosGrupo);
  }

  localStorage.setItem("hotelGrupos", JSON.stringify(lista));
  form.reset();
  mostrarGrupos();
  Swal.fire({
    icon: "success",
    title: "Guardado",
    timer: 800,
    showConfirmButton: false,
  });
});

// --- RENDERIZAR TABLA CON COLORES DINÁMICOS ---
function mostrarGrupos() {
  let lista = JSON.parse(localStorage.getItem("hotelGrupos")) || [];
  const filtroDesde = document.getElementById("filtroDesde").value;
  const filtroHasta = document.getElementById("filtroHasta").value;

  tabla.innerHTML = "";

  let listaFiltrada = lista.filter((g) => {
    let cumpleDesde = filtroDesde ? g.fechaLlegada >= filtroDesde : true;
    let cumpleHasta = filtroHasta ? g.fechaLlegada <= filtroHasta : true;
    return cumpleDesde && cumpleHasta;
  });

  if (listaFiltrada.length === 0) {
    mensajeVacio.classList.remove("d-none");
  } else {
    mensajeVacio.classList.add("d-none");
    listaFiltrada.sort(
      (a, b) => new Date(a.fechaLlegada) - new Date(b.fechaLlegada),
    );

    listaFiltrada.forEach((g) => {
      // Limpiar acentos para clase CSS (ej: "Miércoles" -> "miercoles")
      const diaClase = g.diaSemana
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const obsHtml = g.observaciones
        ? `<div class="obs-text"><strong>OBSERVACIONES:</strong> ${g.observaciones}</div>`
        : "";

      tabla.innerHTML += `
                <tr>
                    <td style="width: 40%;">
                        <div class="fw-bold text-dark" style="font-size: 1.05rem;">${g.nombre}</div>
                        ${obsHtml}
                    </td>
                    <td style="width: 25%;">
                        <span class="badge badge-${diaClase} mb-2 p-2" style="font-size: 0.75rem;">${g.diaSemana.toUpperCase()}</span>
                        <div class="small"><b>Llegada:</b> ${g.fechaLlegada}</div>
                        <div class="small"><b>Salida:</b> ${g.fechaSalida || "--"}</div>
                    </td>
                    <td style="width: 15%;">
                        <div class="small"><i class="bi bi-people-fill"></i> ${g.pax} pax</div>
                        <div class="small"><i class="bi bi-door-closed-fill"></i> ${g.habitaciones} hab</div>
                    </td>
                    <td style="width: 20%;">
                        <span class="badge ${g.sala === "Sí" ? "bg-success" : "bg-light text-dark"} border d-block mb-1">Sala: ${g.sala}</span>
                        <span class="badge ${g.catering === "Sí" ? "bg-success" : "bg-light text-dark"} border d-block">Catering: ${g.catering}</span>
                    </td>
                    <td class="text-end no-print">
                        <div class="btn-group">
                            <button class="btn btn-outline-warning btn-sm" onclick="cargarEdicion(${g.id})"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-outline-danger btn-sm" onclick="eliminarGrupo(${g.id})"><i class="bi bi-trash"></i></button>
                        </div>
                    </td>
                </tr>`;
    });
  }
}

// --- EDICIÓN ---
function cargarEdicion(id) {
  let lista = JSON.parse(localStorage.getItem("hotelGrupos")) || [];
  const g = lista.find((item) => item.id === id);

  if (g) {
    document.getElementById("editId").value = g.id;
    document.getElementById("nombreGrupo").value = g.nombre;
    document.getElementById("fechaLlegada").value = g.fechaLlegada;
    document.getElementById("fechaSalida").value = g.fechaSalida;
    document.getElementById("cantidadPax").value = g.pax;
    document.getElementById("numHabitaciones").value = g.habitaciones;
    document.getElementById("observaciones").value = g.observaciones;
    document.getElementById("salaReuniones").checked = g.sala === "Sí";
    document.getElementById("catering").checked = g.catering === "Sí";

    cardForm.classList.add("edit-mode");
    btnSubmit.innerText = "Actualizar Cambios";
    btnSubmit.classList.replace("btn-primary", "btn-warning");
    btnCancelar.classList.remove("d-none");
    formTitle.innerText = "Editando Grupo";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function cancelarEdicion() {
  form.reset();
  document.getElementById("editId").value = "";
  cardForm.classList.remove("edit-mode");
  btnSubmit.innerText = "Guardar Grupo";
  btnSubmit.classList.replace("btn-warning", "btn-primary");
  btnCancelar.classList.add("d-none");
  formTitle.innerText = "Nuevo Registro";
}

function limpiarFiltros() {
  document.getElementById("filtroDesde").value = "";
  document.getElementById("filtroHasta").value = "";
  mostrarGrupos();
}

function eliminarGrupo(id) {
  Swal.fire({
    title: "¿Eliminar grupo?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Sí, borrar",
  }).then((result) => {
    if (result.isConfirmed) {
      let lista = JSON.parse(localStorage.getItem("hotelGrupos")) || [];
      lista = lista.filter((g) => g.id !== id);
      localStorage.setItem("hotelGrupos", JSON.stringify(lista));
      mostrarGrupos();
    }
  });
}
