// Mock Data for Blog Posts
const BLOG_POSTS = [
    {
        id: 1,
        title: "la bienvenida",
        category: "General",
        date: "Jun 3, 2026",
        readTime: "2 minutos",
        image: "assets/Fluffy Saludando.png",
        excerpt: "Hola, aquí fluffy, en mi blog de personal con temas de todo tipo, supongo xd",
        content: `
            <p>Hola, aquí fluffy, En esta primer entrada de blog quiero hablar sobre cosas que podrán ver aquí.</p>
            <h3>¿Que podran ver aquí?</h3>
            <ul>
                <li>Ideas sobre creatividad</li>
                <li>Ideas sobre diseño</li>
                <li>Ideas sobre reflexiones</li>
            </ul>
            </p>Espero que les guste mi blog de fluffy, por ejemplo en blogs posteriores pondré info sobre un juego que saldrá proximamente. esto con el fin de que puedan ver todo lo que se viene en el blog de fluffy, que tendrán cosas interesantes para todos ustedes, en fin, disfrutenlo.<p>
            <p>saludos, fluffy.</p>
        `
    }
];

// Mock Data for Videos
const VIDEOS = [
    {
        id: 1,
        title: "Tutorial: Cómo sombrear con lápices como un profesional",
        thumbnail: "assets/video_shadows.png",
        views: "15,200 vistas &bull; hace 2 semanas"
    },
    {
        id: 2,
        title: "Mi rutina creativa diaria: Café, libreta y Figma",
        thumbnail: "assets/video_routine.png",
        views: "8,900 vistas &bull; hace 1 mes"
    },
    {
        id: 3,
        title: "Neubrutalismo en CSS: Creando layouts con actitud",
        thumbnail: "assets/video_css.png",
        views: "24,500 vistas &bull; hace 3 meses"
    },
    {
        id: 4,
        title: "Reto de Diseño: Diseñando una web completa en papel",
        thumbnail: "assets/video_challenge.png",
        views: "12,100 vistas &bull; hace 4 meses"
    }
];

// State variables
let currentCategory = "Todos";
let searchQuery = "";

// DOM Elements
const blogGrid = document.getElementById("blogGrid");
const categoryFilters = document.getElementById("categoryFilters");
const videosGrid = document.getElementById("videosGrid");

const searchToggle = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const searchClose = document.getElementById("searchClose");

const themeToggle = document.getElementById("themeToggle");

// Modal Elements
const articleDialog = document.getElementById("articleDialog");
const articleDialogTag = document.getElementById("articleDialogTag");
const articleDialogTitle = document.getElementById("articleDialogTitle");
const articleDialogMeta = document.getElementById("articleDialogMeta");
const articleDialogImg = document.getElementById("articleDialogImg");
const articleDialogContent = document.getElementById("articleDialogContent");

const aboutDialog = document.getElementById("aboutDialog");
const socialDialog = document.getElementById("socialDialog");
const videosDialog = document.getElementById("videosDialog");

const navAcerca = document.getElementById("navAcerca");
const navTemas = document.getElementById("navTemas");
const navRedes = document.getElementById("navRedes");
const navVideos = document.getElementById("navVideos");
const logoLink = document.getElementById("logoLink");

// Initial render
document.addEventListener("DOMContentLoaded", () => {
    // Set theme from storage or default
    const savedTheme = localStorage.getItem("fluffy-theme") || "theme-paper";
    document.body.className = savedTheme;
    updateThemeIcon(savedTheme);

    renderCategoryTabs();
    renderBlogGrid();
    renderVideos();
    setupEventListeners();
});

// Helper: Get unique categories
function getCategories() {
    const categories = new Set(BLOG_POSTS.map(post => post.category));
    return ["Todos", ...categories];
}

// Render Category filter buttons
function renderCategoryTabs() {
    const categories = getCategories();
    categoryFilters.innerHTML = categories.map(cat => {
        const isActive = cat === currentCategory ? "active" : "";
        return `<button class="filter-tab ${isActive}" data-category="${cat}">${cat}</button>`;
    }).join("");
}

// Render Blog cards in grid
function renderBlogGrid() {
    // Filter data
    const filteredPosts = BLOG_POSTS.filter(post => {
        const matchesCategory = currentCategory === "Todos" || post.category === currentCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filteredPosts.length === 0) {
        blogGrid.innerHTML = `
            <div class="no-results-card sketch-card-rounded" style="grid-column: 1 / -1; padding: 40px; text-align: center; font-family: var(--font-pixel); font-size: 1.5rem;">
                <p>Ningún boceto coincide con tu búsqueda... ✏️❌</p>
                <button class="sketch-btn" id="resetFiltersBtn" style="margin-top: 15px;">Ver todas las entradas</button>
            </div>
        `;
        document.getElementById("resetFiltersBtn")?.addEventListener("click", () => {
            currentCategory = "Todos";
            searchQuery = "";
            searchInput.value = "";
            renderCategoryTabs();
            renderBlogGrid();
        });
        return;
    }

    blogGrid.innerHTML = filteredPosts.map(post => {
        return `
            <article class="blog-card sketch-card-rounded" data-id="${post.id}">
                <div class="card-image-box">
                    <img src="${post.image}" alt="${post.title}" class="card-img" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22 viewBox=%220 0 300 200%22><rect width=%22300%22 height=%22200%22 fill=%22%23a5f3fc%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2220%22 fill=%22%23000%22>Dibujo Boceto</text></svg>'">
                </div>
                <div class="card-content">
                    <div class="card-meta-row">
                        <span class="card-tag">${post.category}</span>
                        <span>${post.date}</span>
                    </div>
                    <h2 class="card-title">${post.title}</h2>
                    <p class="card-excerpt">${post.excerpt}</p>
                    <div class="card-footer">
                        <span>${post.readTime}</span>
                        <span class="read-more-arrow">&rarr;</span>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    // Add click listener to cards
    document.querySelectorAll(".blog-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = parseInt(card.getAttribute("data-id"));
            openArticleModal(id);
        });
    });
}



// Render Videos list inside dialog modal
function renderVideos() {
    videosGrid.innerHTML = VIDEOS.map(vid => {
        return `
            <div class="video-card" data-id="${vid.id}">
                <div class="video-thumbnail-box">
                    <img src="${vid.thumbnail}" alt="${vid.title}" class="video-img" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22180%22 viewBox=%220 0 320 180%22><rect width=%22320%22 height=%22180%22 fill=%22%23fef08a%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2216%22 fill=%22%23000%22>Video Tutorial</text></svg>'">
                    <div class="video-play-overlay">&#9658;</div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${vid.title}</h3>
                    <span class="video-views">${vid.views}</span>
                </div>
            </div>
        `;
    }).join("");

    // Video card click handler (simulated player)
    document.querySelectorAll(".video-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            alert(`[Videos Simulador] Abriendo tutorial #${id}... ¡Cargando contenido en alta definición! 📺✨`);
        });
    });
}

// Open Blog Article Dialog and fill details
function openArticleModal(id) {
    const post = BLOG_POSTS.find(p => p.id === id);
    if (!post) return;

    articleDialogTag.textContent = post.category;
    articleDialogTitle.textContent = post.title;
    articleDialogMeta.innerHTML = `<span class="meta-date">${post.date}</span> &bull; <span class="meta-read-time">${post.readTime}</span>`;
    articleDialogImg.src = post.image;
    articleDialogImg.alt = post.title;
    articleDialogContent.innerHTML = post.content;

    articleDialog.showModal();
}

// Set up UI event listeners
function setupEventListeners() {
    // Category filters tabs
    categoryFilters.addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-tab")) {
            // Remove active class from previous
            document.querySelectorAll(".filter-tab").forEach(tab => tab.classList.remove("active"));

            // Set current active
            e.target.classList.add("active");
            currentCategory = e.target.getAttribute("data-category");

            renderBlogGrid();
        }
    });

    // Search bar slider toggle
    searchToggle.addEventListener("click", () => {
        searchPanel.classList.toggle("active");
        if (searchPanel.classList.contains("active")) {
            searchInput.focus();
        }
    });

    searchClose.addEventListener("click", () => {
        searchPanel.classList.remove("active");
        searchQuery = "";
        searchInput.value = "";
        renderBlogGrid();
    });

    // Realtime search text input
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderBlogGrid();
    });

    // Theme Switcher button
    themeToggle.addEventListener("click", () => {
        let currentTheme = document.body.className;
        let newTheme = currentTheme === "theme-paper" ? "theme-chalkboard" : "theme-paper";

        document.body.className = newTheme;
        localStorage.setItem("fluffy-theme", newTheme);
        updateThemeIcon(newTheme);
    });

    // Navigation Dialog Links
    navAcerca.addEventListener("click", (e) => {
        e.preventDefault();
        aboutDialog.showModal();
    });

    navTemas.addEventListener("click", (e) => {
        e.preventDefault();
        // Scroll smoothly to section title of blog posts, where filters are
        document.querySelector(".blog-header-row").scrollIntoView({ behavior: "smooth" });
    });

    navRedes.addEventListener("click", (e) => {
        e.preventDefault();
        socialDialog.showModal();
    });

    navVideos.addEventListener("click", (e) => {
        e.preventDefault();
        videosDialog.showModal();
    });

    logoLink.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Closing modal when clicking close buttons or backdrop
    const dialogs = [articleDialog, aboutDialog, socialDialog, videosDialog];

    dialogs.forEach(dialog => {
        // Close button inside dialog frame
        dialog.querySelector("[dialog-close]")?.addEventListener("click", () => {
            dialog.close();
        });

        // Close on backdrop click (native dialog behavior support)
        dialog.addEventListener("click", (e) => {
            const rect = dialog.getBoundingClientRect();
            // Check if click was outside the dialog contents area
            if (
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom
            ) {
                dialog.close();
            }
        });
    });

    // Close search panel on Escape key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (searchPanel.classList.contains("active")) {
                searchPanel.classList.remove("active");
                searchQuery = "";
                searchInput.value = "";
                renderBlogGrid();
            }
        }
    });
}

// Update the Theme Icon appearance based on state
function updateThemeIcon(theme) {
    if (theme === "theme-chalkboard") {
        // Dark theme: Chalk outline sun
        themeToggle.querySelector("svg").style.transform = "rotate(180deg)";
    } else {
        // Light theme: Ink dense sun
        themeToggle.querySelector("svg").style.transform = "rotate(0deg)";
    }
}
