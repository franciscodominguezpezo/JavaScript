# 📅 Personal Dashboard & Event Manager

> **Bilingual Edition / Edición Bilingüe (ES/EN)**

An interactive web application for personal management that allows user registration, profile customization with photos, professional link management, and a full event calendar with local data persistence.

Una aplicación web interactiva de gestión personal que permite el registro de usuarios, personalización de perfil con fotografía, gestión de enlaces profesionales y un calendario de eventos completo con persistencia de datos local.

---

## 🚀 Features / Características

### 🇬🇧 English

- **Local Authentication:** Registration and Login system using `localStorage`.
- **Custom Profile:**
  - Dynamic name updates in the welcome message.
  - Profile picture upload (stored in Base64).
  - LinkedIn profile link management.
  - Password change with current password validation.
- **Event Management (CRUD):**
  - Interactive calendar powered by **FullCalendar 6**.
  - Create, Edit, and Delete events with a single click.
  - Synchronized sidebar with upcoming events.
- **Modern UI:** Responsive design with **Bootstrap 5**, custom CSS, and **SweetAlert2** for elegant dialogs.

### 🇪🇸 Español

- **Autenticación Local:** Sistema de registro e inicio de sesión utilizando `localStorage`.
- **Perfil Personalizado:**
  - Actualización dinámica del nombre en el saludo de bienvenida.
  - Carga de foto de perfil (almacenada en Base64).
  - Gestión de enlace a perfil de LinkedIn.
  - Cambio de contraseña con validación de contraseña actual.
- **Gestión de Eventos (CRUD):**
  - Calendario interactivo con **FullCalendar 6**.
  - Crear, Editar y Eliminar eventos con un clic.
  - Lista lateral de próximos eventos sincronizada.
- **Interfaz Moderna:** Diseño responsivo con **Bootstrap 5**, CSS personalizado y **SweetAlert2** para diálogos elegantes.

---

## 🛠️ Stack / Tecnologías

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

- **Logic:** JavaScript (ES6+)
- **UI Framework:** [Bootstrap 5.3](https://getbootstrap.com/)
- **Calendar:** [FullCalendar 6.1](https://fullcalendar.io/)
- **Alerts:** [SweetAlert2](https://sweetalert2.github.io/)
- **Icons:** [Bootstrap Icons](https://icons.getbootstrap.com/)

---

## 📂 Project Structure / Estructura del Proyecto

```text
/
├── index.html        # Login & Registration screen / Pantalla de Inicio y Registro
├── perfil.html       # Private User Area / Área Privada del Usuario
├── main.js           # Auth & Session logic / Lógica de Autenticación
├── perfil.js         # Profile & Calendar logic / Lógica de Perfil y Eventos
├── style.css         # Custom Global Styles / Estilos Personalizados
└── README.md         # Documentation / Documentación
```
