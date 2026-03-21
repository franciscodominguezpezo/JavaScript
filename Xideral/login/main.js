// Función para registrar un nuevo usuario
function register(event) {
  event.preventDefault(); // Evita que el formulario se envíe y recargue la página

  // IDs corregidos según tu HTML
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (localStorage.getItem(email)) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "El usuario ya existe.",
    });
    return;
  }

  localStorage.setItem(email, password);
  Swal.fire({
    icon: "success",
    title: "Éxito",
    text: "Usuario registrado exitosamente.",
  });

  document.getElementById("registerForm").reset(); // Limpia el formulario
}

// Función para iniciar sesión
function login(event) {
  event.preventDefault(); // Evita que el formulario se envíe y recargue la página

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const storedPassword = localStorage.getItem(email);

  if (storedPassword && storedPassword === password) {
    localStorage.setItem("session", email); // Guarda la sesión del usuario
    Swal.fire({
      icon: "success",
      title: "Bienvenido",
      text: "Redirigiendo a tu perfil...",
    });
    // Redirigir al perfil después de un breve retraso
    setTimeout(() => {
      window.location.href = "perfil.html";
    }, 2000);
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Usuario o contraseña incorrectos.",
    });
  }
}

// Escuchamos el evento 'submit' de los formularios en lugar del 'click' del botón
document.getElementById("registerForm").addEventListener("submit", register);
document.getElementById("loginForm").addEventListener("submit", login);
