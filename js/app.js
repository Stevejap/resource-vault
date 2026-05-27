// Resource Vault - Arquitectura Centralizada Limpia (Sin Datos por Defecto)
document.addEventListener("DOMContentLoaded", () => {
    initDatabase();
    updateNavbarDynamic();
    checkAddPageProtection();
});

function initDatabase() {
    // REQUISITO: No crear recursos locales por defecto (Iniciar vacío)
    if (!localStorage.getItem("vault_resources")) {
        localStorage.setItem("vault_resources", JSON.stringify([]));
    }
    
    // Categorías base obligatorias para el funcionamiento de los filtros
    if (!localStorage.getItem("vault_local_categories")) {
        const defaultCats = ["documentacion", "cursos", "articulos"];
        localStorage.setItem("vault_local_categories", JSON.stringify(defaultCats));
    }
    
    // REQUISITO: No crear recursos públicos por defecto (Iniciar vacío)
    if (!localStorage.getItem("vault_public_resources")) {
        localStorage.setItem("vault_public_resources", JSON.stringify([]));
    }

    // REQUISITO: Asegurar que no haya sesión activa por defecto si es la primera vez
    if (localStorage.getItem("vault_session") === null) {
        localStorage.setItem("vault_session", "false");
    }
    // Sincronizar Registro de usuarios real
    if (!localStorage.getItem("vault_users_registry")) {
        localStorage.setItem("vault_users_registry", JSON.stringify([]));
    }
}

// Protección de la página de adición
function checkAddPageProtection() {
    const currentFile = window.location.pathname.split("/").pop();
    if (currentFile === "nuevo-recurso.html") {
        const sessionActive = localStorage.getItem("vault_session") === "true";
        if (!sessionActive) {
            alert("Acceso denegado: Debes iniciar sesión para añadir un nuevo recurso.");
            window.location.href = "login.html";
        }
    }
}

function updateNavbarDynamic() {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;

    const sessionActive = localStorage.getItem("vault_session") === "true";
    const currentFile = window.location.pathname.split("/").pop() || "index.html";
    
    // Menú base con la tuerca accesible SIEMPRE en la barra superior fija
    let htmlMenu = `
        <li><a href="index.html" class="${currentFile === 'index.html' ? 'active' : ''}"><i class="fa-solid fa-house"></i> Inicio</a></li>
        <li><a href="dashboard.html" class="${currentFile === 'dashboard.html' ? 'active' : ''}"><i class="fa-solid fa-database"></i> Bóveda</a></li>
        <li><a href="nuevo-recurso.html" class="${currentFile === 'nuevo-recurso.html' ? 'active' : ''}"><i class="fa-solid fa-circle-plus"></i> Añadir</a></li>
        <li><a href="configuracion.html" class="${currentFile === 'configuracion.html' ? 'active' : ''}" title="Configuración"><i class="fa-solid fa-gear"></i></a></li>
    `;

    if (!sessionActive) {
        htmlMenu += `<li><a href="login.html" class="btn" style="padding: 0.4rem 1rem; color:#fff;"><i class="fa-solid fa-right-to-bracket"></i> Acceder</a></li>`;
    } else {
        const sessionUser = JSON.parse(localStorage.getItem("vault_user")) || { username: "Estudiante UTP" };
        htmlMenu += `
            <li class="user-menu-container">
                <span class="nav-username">${sessionUser.username}</span>
                <div class="profile-combo-btn" id="profileComboBtn">
                    <img src="${sessionUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}" alt="Avatar" class="nav-avatar">
                </div>
                <div class="nav-dropdown-menu" id="navDropdownMenu">
                    <a href="perfil.html"><i class="fa-solid fa-user-tie"></i> Mi Perfil</a>
                    <a href="#" id="btnLogoutAction" style="border-top:1px solid var(--border-color); color:var(--danger);"><i class="fa-solid fa-power-off"></i> Salir</a>
                </div>
            </li>
        `;
    }
    
    navLinks.innerHTML = htmlMenu;

    if (sessionActive) {
        setupDropdownLogic();
    }
}

function setupDropdownLogic() {
    const btn = document.getElementById("profileComboBtn");
    const menu = document.getElementById("navDropdownMenu");
    const logout = document.getElementById("btnLogoutAction");

    if (btn && menu) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("show");
        });
    }

    if (logout) {
        logout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.setItem("vault_session", "false");
            localStorage.removeItem("vault_user"); // Limpiar también los datos del usuario al salir
            alert("Sesión finalizada correctamente.");
            window.location.href = "index.html";
        });
    }

    window.addEventListener("click", () => {
        if (menu && menu.classList.contains("show")) {
            menu.classList.remove("show");
        }
    });
}
