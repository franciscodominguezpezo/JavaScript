// CRO para modificación de elementos del DOM.

// 1. CAMBIO DE TEXTO (Hipótesis: Un CTA más directo mejora el clic)
// Buscamos un botón por su selector CSS
const mainButton = document.querySelector(".btn-primary, button, #submit");

if (mainButton) {
  mainButton.innerText = "¡COMPRAR AHORA Y AHORRAR!";
  mainButton.style.backgroundColor = "#ff5722"; // Cambio visual rápido
}

// 2. REORDENACIÓN DE ELEMENTOS (DOM Manipulation)
// Supongamos que queremos mover las valoraciones (estrellas) justo debajo del título
const title = document.querySelector("h1");
const ratings = document.querySelector(".ratings-container, .reviews");

if (title && ratings) {
  // .insertAdjacentElement es más preciso que appendChild
  title.insertAdjacentElement("afterend", ratings);
  ratings.style.marginTop = "10px";
  console.log("CRO: Ratings movidos debajo del título");
}

// 3. INSERCIÓN DE ELEMENTOS NUEVOS (Social Proof)
// Creamos un banner de "X personas viendo este producto"
const priceTag = document.querySelector(".price, #price");

if (priceTag) {
  const socialProof = document.createElement("div");
  socialProof.id = "cro-social-proof";
  socialProof.innerHTML = `
        <p style="color: red; font-weight: bold; font-size: 0.9rem;">
            🔥 15 personas están viendo este producto ahora mismo
        </p>
    `;
  priceTag.parentNode.insertBefore(socialProof, priceTag);
}

// 4. MEDICIÓN (Event Tracking)
// Es vital saber si el cambio funciona. Escuchamos el clic.
if (mainButton) {
  mainButton.addEventListener("click", () => {
    // Aquí enviarías el evento a Google Analytics o Adobe Target
    console.log("Evento enviado: Clic en Variación A - Botón Urgente");
  });
}
