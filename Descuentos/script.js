const caja = document.getElementById("caja");
const resultado = document.getElementById("resultado");
const btnAbrir = document.getElementById("btnAbrir");
const resetBtn = document.getElementById("resetBtn");
const contador = document.getElementById("contador");

let tiempoOferta = 5 * 60; // 5 minutos
let intervalo;

/* --------- SI YA ESTABA ABIERTA --------- */

if (localStorage.getItem("cajaAbierta") === "true") {
  mostrarMensajeGuardado();
  iniciarTemporizadorExistente();
}

/* --------- ABRIR CAJA --------- */

async function abrirCaja() {
  if (localStorage.getItem("cajaAbierta") === "true") {
    mostrarMensajeGuardado();
    return;
  }

  const premio = await generarPremio();
  const codigo = generarCodigo();

  caja.classList.add("abierta");

  // 🎊 CONFETI JUSTO AL ABRIR
  lanzarConfetti();

  resultado.innerHTML = `
        <div class="alert alert-success">
            🎉 <strong>${premio}</strong><br>
            Código: <span class="fw-bold">${codigo}</span>
        </div>
    `;

  btnAbrir.disabled = true;
  resetBtn.classList.remove("d-none");

  localStorage.setItem("cajaAbierta", "true");
  localStorage.setItem("premio", premio);
  localStorage.setItem("codigo", codigo);

  iniciarTemporizador();
}

/* --------- BACKEND SIMULADO --------- */

async function generarPremio() {
  const response = await fetch("premios.json");
  const premios = await response.json();

  const random = Math.random() * 100;
  let acumulado = 0;

  for (let premio of premios) {
    acumulado += premio.probabilidad;
    if (random <= acumulado) {
      return premio.nombre;
    }
  }
}

function generarCodigo() {
  return "DESC" + Math.floor(1000 + Math.random() * 9000);
}

/* --------- TEMPORIZADOR --------- */

function iniciarTemporizador() {
  const expiracion = Date.now() + tiempoOferta * 1000;
  localStorage.setItem("expiracion", expiracion);

  actualizarContador();
  intervalo = setInterval(actualizarContador, 1000);
}

function iniciarTemporizadorExistente() {
  if (localStorage.getItem("expiracion")) {
    actualizarContador();
    intervalo = setInterval(actualizarContador, 1000);
  }
}

function actualizarContador() {
  const expiracion = localStorage.getItem("expiracion");
  if (!expiracion) return;

  const tiempoRestante = Math.floor((expiracion - Date.now()) / 1000);

  if (tiempoRestante <= 0) {
    clearInterval(intervalo);
    contador.innerHTML = "⛔ Oferta expirada";
    return;
  }

  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;

  contador.innerHTML = `⏳ Oferta válida: ${minutos}:${segundos.toString().padStart(2, "0")}`;
}

/* --------- CONFETI --------- */

function lanzarConfetti() {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
  });
}

/* --------- ESTADO GUARDADO --------- */

function mostrarMensajeGuardado() {
  const premio = localStorage.getItem("premio");
  const codigo = localStorage.getItem("codigo");

  resultado.innerHTML = `
        <div class="alert alert-info">
            Ya abriste la caja.<br>
            Premio: <strong>${premio}</strong><br>
            Código: <span class="fw-bold">${codigo}</span>
        </div>
    `;

  btnAbrir.disabled = true;
  resetBtn.classList.remove("d-none");
}

/* --------- RESET --------- */

function resetCaja() {
  localStorage.clear();
  location.reload();
}
