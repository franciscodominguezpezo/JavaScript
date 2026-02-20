const form = document.getElementById("grupoForm");
const tabla = document.getElementById("tablaGrupos");
const mensajeVacio = document.getElementById("mensajeVacio");
const cardForm = document.getElementById("cardFormulario");
const btnSubmit = document.getElementById("btnSubmit");
const btnCancelar = document.getElementById("btnCancelar");
const formTitle = document.getElementById("formTitle");

document.addEventListener("DOMContentLoaded", mostrarGrupos);

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
    // Modo Edición: Reemplazar el existente
    lista = lista.map((g) => (g.id === datosGrupo.id ? datosGrupo : g));
    cancelarEdicion();
  } else {
    // Modo Nuevo
    lista.push(datosGrupo);
  }

  localStorage.setItem("hotelGrupos", JSON.stringify(lista));
  form.reset();
  mostrarGrupos();
  Swal.fire({
    icon: "success",
    title: "Guardado correctamente",
    timer: 1000,
    showConfirmButton: false,
  });
});

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
      (a, b) => new Date(a.fechaLlegada) - new Date(b.fechaLlegada)
    );

    listaFiltrada.forEach((g) => {
      const obsHtml = g.observaciones
        ? `<span class="obs-text">${g.observaciones}</span>`
        : "";
      tabla.innerHTML += `
        <tr>
            <td>
                <div class="fw-bold text-dark">${g.nombre}</div>
                ${obsHtml}
            </td>
            <td>
                <span class="badge bg-primary d-inline-block mb-1">${
                  g.diaSemana
                }</span><br>
                <small><b>In:</b> ${g.fechaLlegada}</small><br>
                <small><b>Out:</b> ${g.fechaSalida || "--"}</small>
            </td>
            <td>
                <i class="bi bi-people"></i> ${g.pax} pax<br>
                <i class="bi bi-door-closed"></i> ${g.habitaciones} hab
            </td>
            <td>
                <span class="badge ${
                  g.sala === "Sí" ? "bg-success" : "bg-light text-dark"
                } border">Sala: ${g.sala}</span>
                <span class="badge ${
                  g.catering === "Sí" ? "bg-success" : "bg-light text-dark"
                } border">Cat: ${g.catering}</span>
            </td>
            <td class="text-end no-print">
                <div class="btn-group">
                    <button class="btn btn-outline-warning btn-sm" onclick="cargarEdicion(${
                      g.id
                    })"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-outline-danger btn-sm" onclick="eliminarGrupo(${
                      g.id
                    })"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        </tr>
    `;
    });
  }
}

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

    // UI de edición
    cardForm.classList.add("edit-mode");
    btnSubmit.innerText = "Actualizar Cambios";
    btnSubmit.classList.replace("btn-primary", "btn-warning");
    btnCancelar.classList.remove("d-none");
    formTitle.innerText = "Editando Grupo";
    window.scrollTo(0, 0);
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
    title: "¿Eliminar?",
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
