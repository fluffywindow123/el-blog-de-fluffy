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
    },
    {
        id: 2,
        title: "Retrospectiva: Toy Story 3 El Videojuego",
        category: "Gaming",
        date: "Jun 4, 2026",
        readTime: "3 minutos",
        image: "assets/Toy story entrada.png",
        excerpt: "Recordando uno de los mejores juegos de la infancia: Toy Story 3 y su modo Toy Box.",
        content: `
            <p>¡Hola! Aquí fluffy. Hoy les traigo una entrada muy especial sobre uno de mis juegos favoritos: Toy Story 3 El Videojuego.</p>
            <h3>El increíble modo Toy Box</h3>
            <p>Este juego no era solo una adaptación de la película, sino que introdujo el modo Toy Box, un mundo abierto donde podías personalizar tu pueblo, completar misiones y jugar con Woody, Buzz o Jessie.</p>
            <p>Te invito a ver el video original de este maravilloso juego:</p>
            [video 5]
            <p>Es un clásico que sin duda merece la pena recordar.</p>
            [imagen video_routine.png]
        `
    }
];

// Mock Data for Video
const VIDEOS = [
    {
        id: 1,
        title: "Tutorial: Cómo sombrear con lápices como un profesional",
        category: "Dibujo",
        url: "https://www.tiktok.com/@fluffywindow123",
        thumbnail: "assets/video_shadows.png",
        views: "15,200 vistas &bull; hace 2 semanas"
    },
    {
        id: 2,
        title: "Mi rutina creativa diaria: Café, libreta y Figma",
        category: "Creatividad",
        url: "https://www.instagram.com/fluffywindow123",
        thumbnail: "assets/video_routine.png",
        views: "8,900 vistas &bull; hace 1 mes"
    },
    {
        id: 3,
        title: "Neubrutalismo en CSS: Creando layouts con actitud",
        category: "Diseño",
        url: "https://github.com/fluffywindow123",
        thumbnail: "assets/video_css.png",
        views: "24,500 vistas &bull; hace 3 meses"
    },
    {
        id: 4,
        title: "Reto de Diseño: Diseñando una web completa en papel",
        category: "Diseño",
        url: "https://www.youtube.com/@fluffywindow123",
        thumbnail: "assets/video_challenge.png",
        views: "12,100 vistas &bull; hace 4 meses"
    },
    {
        id: 5,
        title: "toy story 3 el videojuego",
        category: "Gaming",
        url: "https://www.youtube.com/watch?v=Kgp9iOHxrFw",
        thumbnail: "assets/Toy story entrada.png",
        views: "12,100 vistas &bull; hace 4 meses"
    },
    {
        id: 6,
        title: "Video nuevo sin miniatura de prueba (Fallback)",
        category: "Creatividad",
        url: "https://www.youtube.com/watch?v=_8fa81Spo3s",
        views: "500 vistas &bull; hace 1 día"
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
    // Set theme from storage, OS preference, or default
    const savedTheme = localStorage.getItem("fluffy-theme");
    let activeTheme = "theme-paper";

    if (savedTheme) {
        activeTheme = savedTheme;
    } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        activeTheme = prefersDark ? "theme-chalkboard" : "theme-paper";
    }

    document.body.className = activeTheme;
    updateThemeIcon(activeTheme);

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
    // Filter data by category and sort descending by ID (newest first)
    const filteredPosts = BLOG_POSTS
        .filter(post => currentCategory === "Todos" || post.category === currentCategory)
        .sort((a, b) => b.id - a.id);

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

    // Add click listener specifically to cards in blogGrid
    blogGrid.querySelectorAll(".blog-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = parseInt(card.getAttribute("data-id"));
            openArticleModal(id);
        });
    });
}

// Global helper for simulated video player or url redirection
function playSimulatedVideo(id) {
    const vid = VIDEOS.find(v => v.id == id);
    if (vid && vid.url) {
        window.open(vid.url, "_blank");
    } else {
        alert(`[Videos Simulador] Abriendo tutorial #${id}... ¡Cargando contenido en alta definición! 📺✨`);
    }
}

// Helper to extract YouTube video ID and construct high quality thumbnail URL
function getYoutubeThumbnail(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

// Render Videos list inside dialog modal
function renderVideos() {
    videosGrid.innerHTML = VIDEOS.map(vid => {
        const ytThumb = getYoutubeThumbnail(vid.url);
        const thumbSrc = ytThumb || vid.thumbnail || "assets/Fluffy Saludando.png";
        return `
            <div class="video-card" data-id="${vid.id}">
                <div class="video-thumbnail-box">
                    <img src="${thumbSrc}" alt="${vid.title}" class="video-img" onerror="this.src='assets/Fluffy Saludando.png'">
                    <div class="video-play-overlay">&#9658;</div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${vid.title}</h3>
                    <span class="video-views">${vid.views}</span>
                </div>
            </div>
        `;
    }).join("");

    // Video card click handler specifically for the dialog grid
    videosGrid.querySelectorAll(".video-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            playSimulatedVideo(id);
        });
    });
}

// Unified Search Results Rendering
function renderSearchResults() {
    const query = searchQuery.trim().toLowerCase();
    const defaultContent = document.getElementById("defaultBlogContent");
    const searchContent = document.getElementById("searchResultsContent");

    if (!query) {
        // Switch back to default category listing
        defaultContent.style.display = "block";
        searchContent.style.display = "none";
        renderBlogGrid();
        return;
    }

    // Toggle views
    defaultContent.style.display = "none";
    searchContent.style.display = "block";

    // Set search query label
    const searchQueryLabel = document.getElementById("searchQueryLabel");
    if (searchQueryLabel) {
        searchQueryLabel.textContent = `Resultados para: "${searchQuery}"`;
    }

    // 1. Filter and sort blog posts by title, category, or excerpt (newest first)
    const filteredPosts = BLOG_POSTS.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query)
    ).sort((a, b) => b.id - a.id);

    // 2. Filter videos by title or category
    const filteredVideos = VIDEOS.filter(vid =>
        vid.title.toLowerCase().includes(query) ||
        (vid.category && vid.category.toLowerCase().includes(query))
    );

    // Render Posts
    const searchBlogGrid = document.getElementById("searchBlogGrid");
    const countPosts = document.getElementById("countPosts");
    if (countPosts) countPosts.textContent = filteredPosts.length;

    if (filteredPosts.length === 0) {
        searchBlogGrid.innerHTML = `
            <div class="no-results-card sketch-card-rounded" style="grid-column: 1 / -1; padding: 30px; text-align: center; font-family: var(--font-pixel); font-size: 1.2rem;">
                <p>No se encontraron entradas para esta búsqueda... ✏️❌</p>
            </div>
        `;
    } else {
        searchBlogGrid.innerHTML = filteredPosts.map(post => {
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

        searchBlogGrid.querySelectorAll(".blog-card").forEach(card => {
            card.addEventListener("click", () => {
                const id = parseInt(card.getAttribute("data-id"));
                openArticleModal(id);
            });
        });
    }

    // Render Videos
    const searchVideosGrid = document.getElementById("searchVideosGrid");
    const countVideos = document.getElementById("countVideos");
    if (countVideos) countVideos.textContent = filteredVideos.length;

    if (filteredVideos.length === 0) {
        searchVideosGrid.innerHTML = `
            <div class="no-results-card sketch-card-rounded" style="grid-column: 1 / -1; padding: 30px; text-align: center; font-family: var(--font-pixel); font-size: 1.2rem; border: 2px solid var(--border-color); background-color: var(--card-bg); box-shadow: 4px 4px 0px var(--shadow-color);">
                <p>No se encontraron videos para esta búsqueda... 📺❌</p>
            </div>
        `;
    } else {
        searchVideosGrid.innerHTML = filteredVideos.map(vid => {
            const ytThumb = getYoutubeThumbnail(vid.url);
            const thumbSrc = ytThumb || vid.thumbnail || "assets/Fluffy Saludando.png";
            return `
                <div class="video-card" data-id="${vid.id}">
                    <div class="video-thumbnail-box">
                        <img src="${thumbSrc}" alt="${vid.title}" class="video-img" onerror="this.src='assets/Fluffy Saludando.png'">
                        <div class="video-play-overlay">&#9658;</div>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">${vid.title}</h3>
                        <span class="video-views">${vid.views}</span>
                    </div>
                </div>
            `;
        }).join("");

        searchVideosGrid.querySelectorAll(".video-card").forEach(card => {
            card.addEventListener("click", () => {
                const id = card.getAttribute("data-id");
                playSimulatedVideo(id);
            });
        });
    }
}

// Helper to generate HTML for embedded videos in blog content
function getEmbeddedVideoHTML(id) {
    const vid = VIDEOS.find(v => v.id == id);
    if (!vid) return `<p style="color: var(--accent-pink); font-family: var(--font-pixel);">[Video #${id} no encontrado]</p>`;

    const ytThumb = getYoutubeThumbnail(vid.url);
    const thumbSrc = ytThumb || vid.thumbnail || "assets/Fluffy Saludando.png";

    return `
        <div class="embedded-video-card" data-id="${vid.id}" style="margin: 20px 0; max-width: 480px; cursor: pointer; border: 2px solid var(--border-color); border-radius: 8px; overflow: hidden; background-color: var(--card-bg); box-shadow: 4px 4px 0px var(--shadow-color); transition: transform 0.2s ease, box-shadow 0.2s ease; display: block;">
            <div class="video-thumbnail-box" style="position: relative; aspect-ratio: 16/9; background-color: var(--accent-yellow); border-bottom: 2px solid var(--border-color); overflow: hidden; display: block;">
                <img src="${thumbSrc}" alt="${vid.title}" class="video-img" onerror="this.src='assets/Fluffy Saludando.png'" style="width: 100%; height: 100%; object-fit: cover; display: block;">
                <div class="video-play-overlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 44px; height: 44px; background-color: #ffffff; border: 2px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">&#9658;</div>
            </div>
            <div class="video-info" style="padding: 12px; display: flex; flex-direction: column; gap: 6px;">
                <h4 class="video-title" style="margin: 0; font-size: 1.1rem; font-weight: 800; line-height: 1.3;">${vid.title}</h4>
                <span class="video-views" style="font-family: var(--font-pixel); font-size: 0.9rem; opacity: 0.8;">${vid.views}</span>
            </div>
        </div>
    `;
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

    // 1. Parse [video id] and [imagen filename] embed codes inside the content text
    let parsedContent = post.content;
    
    const regex = /\[video\s+(\d+)\]/gi;
    parsedContent = parsedContent.replace(regex, (match, vidId) => {
        return getEmbeddedVideoHTML(vidId);
    });

    const imageRegex = /\[imagen\s+([^\]]+)\]/gi;
    parsedContent = parsedContent.replace(imageRegex, (match, filename) => {
        let src = filename.trim();
        if (!src.startsWith('assets/') && !src.startsWith('http://') && !src.startsWith('https://')) {
            src = 'assets/' + src;
        }
        return `<img src="${src}" alt="Imagen del post">`;
    });

    // 2. Parse "videos" array property if present on the post object
    if (post.videos && Array.isArray(post.videos) && post.videos.length > 0) {
        post.videos.forEach(videoRef => {
            let videoId = null;
            if (typeof videoRef === 'string') {
                const match = videoRef.match(/\d+/);
                if (match) videoId = parseInt(match[0]);
            } else if (typeof videoRef === 'number') {
                videoId = videoRef;
            }

            if (videoId) {
                parsedContent += getEmbeddedVideoHTML(videoId);
            }
        });
    }

    // 3. Parse "contentAfter" or "content2" property if present on the post object
    const afterContent = post.contentAfter || post.content2 || post.afterContent;
    if (afterContent) {
        parsedContent += afterContent;
    }

    // 4. Parse "sections" block array property if present on the post object
    if (post.sections && Array.isArray(post.sections)) {
        post.sections.forEach(section => {
            if (section.type === 'text') {
                parsedContent += section.value;
            } else if (section.type === 'video') {
                let videoId = section.id;
                if (typeof videoId === 'string') {
                    const match = videoId.match(/\d+/);
                    if (match) videoId = parseInt(match[0]);
                }
                parsedContent += getEmbeddedVideoHTML(videoId);
            } else if (section.type === 'image') {
                parsedContent += `<img src="${section.src}" alt="Imagen de la entrada" style="margin: 20px 0; max-width: 100%; border: 2px solid var(--border-color); border-radius: 8px; box-shadow: 4px 4px 0px var(--shadow-color); display: block;">`;
            }
        });
    }

    articleDialogContent.innerHTML = parsedContent;

    // Attach click and hover handlers to embedded video cards
    articleDialogContent.querySelectorAll(".embedded-video-card").forEach(card => {
        card.addEventListener("click", (e) => {
            e.stopPropagation();
            const videoId = card.getAttribute("data-id");
            playSimulatedVideo(videoId);
        });

        // Hover animations
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translate(-3px, -3px)";
            card.style.boxShadow = "7px 7px 0px var(--shadow-color)";
            const overlay = card.querySelector(".video-play-overlay");
            if (overlay) overlay.style.backgroundColor = "var(--accent-cyan)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "none";
            card.style.boxShadow = "4px 4px 0px var(--shadow-color)";
            const overlay = card.querySelector(".video-play-overlay");
            if (overlay) overlay.style.backgroundColor = "#ffffff";
        });
    });

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

            // Reset search query and input value if searching
            if (searchQuery !== "") {
                searchQuery = "";
                searchInput.value = "";
                searchPanel.classList.remove("active");
            }
            renderSearchResults();
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
        renderSearchResults();
    });

    // Realtime search text input
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderSearchResults();
    });

    // Theme Switcher button
    themeToggle.addEventListener("click", () => {
        let currentTheme = document.body.className;
        let newTheme = currentTheme === "theme-paper" ? "theme-chalkboard" : "theme-paper";

        document.body.className = newTheme;
        localStorage.setItem("fluffy-theme", newTheme);
        localStorage.setItem("fluffy-theme-overridden", "true");
        updateThemeIcon(newTheme);
    });

    // Listen to OS theme changes dynamically
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        // Only switch automatically if the user hasn't set a manual override
        if (!localStorage.getItem("fluffy-theme-overridden")) {
            const newTheme = e.matches ? "theme-chalkboard" : "theme-paper";
            document.body.className = newTheme;
            updateThemeIcon(newTheme);
        }
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
        if (searchQuery !== "") {
            searchQuery = "";
            searchInput.value = "";
            searchPanel.classList.remove("active");
            renderSearchResults();
        }
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
                renderSearchResults();
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
