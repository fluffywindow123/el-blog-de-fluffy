/**
 * send_notifications.js
 * Script de Node.js para enviar notificaciones automáticas por correo.
 * Extrae dinámicamente el último post de script.js, lo compara con el commit anterior
 * y lo envía a la lista de suscriptores en subscribers.json mediante la API de Resend.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración básica
const BLOG_URL_BASE = 'https://fluffywindow123.github.io/el-blog-de-fluffy/';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const isDryRun = !RESEND_API_KEY;

// Mensaje inicial de diagnóstico
if (isDryRun) {
    console.log('⚠️  No se detectó RESEND_API_KEY. Ejecutando en MODO PRUEBA (Dry Run)...');
} else {
    console.log('🚀 API Key de Resend detectada. Preparando envío de notificaciones...');
}

// Helper para esperar (evitar superar límites de velocidad de Resend)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Parsea el contenido de script.js y extrae el último post basado en el id más alto.
 */
function extractLatestPost(fileContent) {
    try {
        const startIndex = fileContent.indexOf('const BLOG_POSTS = [');
        if (startIndex === -1) {
            throw new Error('No se encontró "const BLOG_POSTS = [" en el archivo.');
        }

        const endIndex = fileContent.indexOf('const VIDEOS = [');
        if (endIndex === -1) {
            throw new Error('No se encontró "const VIDEOS = [" para delimitar los posts.');
        }

        const blogPostsText = fileContent.substring(startIndex, endIndex).trim();
        // Convertimos la declaración de constante en un retorno para evaluarlo
        const getPostsText = blogPostsText.replace('const BLOG_POSTS =', 'return');
        
        // Ejecución en un contexto de función nativo
        const getPosts = new Function(getPostsText);
        const posts = getPosts();

        if (!Array.isArray(posts) || posts.length === 0) {
            return null;
        }

        // Ordenamos descendentemente por ID para obtener el más reciente
        return posts.sort((a, b) => b.id - a.id)[0];
    } catch (err) {
        console.error('Error al extraer los posts del código JavaScript:', err.message);
        return null;
    }
}

/**
 * Obtiene el contenido de script.js del commit anterior usando Git.
 */
function getPreviousCommitScript() {
    try {
        // Obtenemos el script.js de HEAD~1 (el commit anterior)
        return execSync('git show HEAD~1:script.js', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    } catch (err) {
        // Ocurre si no hay commit anterior (ej. primer commit) o si no es un repositorio git completo
        console.log('ℹ️ No se pudo leer el commit anterior en Git. Es posible que sea el primer commit del repositorio.');
        return null;
    }
}

/**
 * Genera una plantilla de correo HTML con estilo Neubrutalista.
 */
function generateEmailTemplate(post) {
    const postUrl = `${BLOG_URL_BASE}#post-${post.id}`;
    
    // Plantilla Neubrutalista responsiva
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>¡Nueva entrada en Blog de Fluffy!</title>
        <style>
            body {
                background-color: #fdfbf7;
                color: #0f0f11;
                font-family: 'Outfit', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
                margin: 0;
                padding: 20px;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 3px solid #0f0f11;
                box-shadow: 8px 8px 0px #0f0f11;
                padding: 30px;
                border-radius: 4px;
            }
            .header-banner {
                background-color: #a5f3fc; /* Cyan */
                border: 3px solid #0f0f11;
                padding: 15px;
                text-align: center;
                margin-bottom: 25px;
                box-shadow: 4px 4px 0px #0f0f11;
            }
            .header-banner h1 {
                font-family: Arial, sans-serif;
                font-size: 28px;
                margin: 0;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .post-category {
                display: inline-block;
                background-color: #fbcfe8; /* Pink */
                color: #0f0f11;
                border: 1px solid #0f0f11;
                padding: 4px 10px;
                font-weight: bold;
                font-size: 12px;
                text-transform: uppercase;
                margin-bottom: 10px;
            }
            .post-title {
                font-size: 24px;
                font-weight: 800;
                margin-top: 0;
                margin-bottom: 15px;
                line-height: 1.2;
            }
            .post-meta {
                font-size: 13px;
                color: #555555;
                margin-bottom: 20px;
            }
            .post-excerpt {
                font-size: 16px;
                line-height: 1.6;
                background-color: #fef08a; /* Yellow */
                border: 2px dashed #0f0f11;
                padding: 15px;
                margin-bottom: 25px;
            }
            .button-container {
                text-align: center;
                margin-bottom: 30px;
            }
            .cta-button {
                display: inline-block;
                background-color: #ffffff;
                color: #0f0f11;
                border: 3px solid #0f0f11;
                padding: 12px 25px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                box-shadow: 4px 4px 0px #0f0f11;
                border-radius: 4px;
                transition: all 0.1s ease;
            }
            .footer {
                border-top: 2px dashed #0f0f11;
                padding-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #666666;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header-banner">
                <h1>Blog de Fluffy ✏️</h1>
            </div>
            
            <span class="post-category">${post.category}</span>
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">Publicado el ${post.date} &bull; ${post.readTime} de lectura</div>
            
            <div class="post-excerpt">
                <strong>Resumen:</strong><br>
                ${post.excerpt}
            </div>
            
            <div class="button-container">
                <a href="${postUrl}" class="cta-button" target="_blank">Leer entrada completa &rarr;</a>
            </div>
            
            <div class="footer">
                <p>&copy; 2026 Blog de Fluffy. Hecho con ❤️ y automatizado por IA.</p>
                <p>Recibes este correo porque te suscribiste a las actualizaciones del blog.</p>
                <p>Para desuscribirte, por favor responde a este correo solicitándolo.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

/**
 * Envía la notificación a un suscriptor individual usando la API de Resend.
 */
async function sendEmail(email, post, htmlContent) {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
            // NOTA: Si usas el plan gratuito sin dominio verificado, debes usar 'onboarding@resend.dev'
            // y solo podrás enviar correos a tu propia cuenta registrada en Resend.
            // Si verificas un dominio (ej. blog.tudominio.com), puedes usar 'boletin@blog.tudominio.com'.
            from: 'Blog de Fluffy <onboarding@resend.dev>',
            to: email,
            subject: `✏️ Nueva entrada en el Blog de Fluffy: "${post.title}"`,
            html: htmlContent
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Error HTTP ${response.status}`);
    }

    return data;
}

/**
 * Función principal del script.
 */
async function main() {
    // 1. Obtener y parsear el script.js actual
    const currentScriptPath = path.join(__dirname, 'script.js');
    if (!fs.existsSync(currentScriptPath)) {
        console.error('❌ Error: No se encontró script.js en el directorio actual.');
        process.exit(1);
    }
    const currentScriptContent = fs.readFileSync(currentScriptPath, 'utf8');
    const currentLatestPost = extractLatestPost(currentScriptContent);

    if (!currentLatestPost) {
        console.error('❌ Error: No se pudieron extraer posts del archivo script.js actual.');
        process.exit(1);
    }

    console.log(`✨ Post actual más reciente detectado: [ID ${currentLatestPost.id}] "${currentLatestPost.title}"`);

    // 2. Obtener y parsear el script.js del commit anterior (si existe)
    const prevScriptContent = getPreviousCommitScript();
    let hasNewPost = false;

    if (prevScriptContent) {
        const prevLatestPost = extractLatestPost(prevScriptContent);
        if (prevLatestPost) {
            console.log(`✨ Post del commit anterior más reciente: [ID ${prevLatestPost.id}] "${prevLatestPost.title}"`);
            if (currentLatestPost.id > prevLatestPost.id) {
                hasNewPost = true;
            } else {
                console.log('ℹ️ El post más reciente ya existía en el commit anterior. No se enviarán correos (evita duplicados).');
            }
        } else {
            console.log('ℹ️ No se pudo parsear el post en el commit anterior. Se asumirá que es un nuevo post por seguridad.');
            hasNewPost = true;
        }
    } else {
        // Si no hay commit anterior, es la primera ejecución o un clon superficial.
        // En MODO PRUEBA (Dry Run) permitimos continuar para verificar el script.
        // En producción (GitHub Actions real), no enviamos nada para evitar spam accidental al configurar el flujo por primera vez.
        if (isDryRun) {
            console.log('ℹ️ Ejecución local / MODO PRUEBA sin historial previo. Simulando envío para el último post.');
            hasNewPost = true;
        } else {
            console.log('ℹ️ Historial Git no disponible en producción. Se omite el envío para prevenir spam por primera configuración.');
            process.exit(0);
        }
    }

    // Si no se detecta nuevo post, salir
    if (!hasNewPost) {
        console.log('✅ Finalizado: No hay entradas nuevas que notificar.');
        process.exit(0);
    }

    // 3. Leer lista de suscriptores
    const subscribersPath = path.join(__dirname, 'subscribers.json');
    if (!fs.existsSync(subscribersPath)) {
        console.error('❌ Error: No se encontró el archivo subscribers.json.');
        process.exit(1);
    }

    let subscribers = [];
    try {
        subscribers = JSON.parse(fs.readFileSync(subscribersPath, 'utf8'));
    } catch (err) {
        console.error('❌ Error al parsear subscribers.json:', err.message);
        process.exit(1);
    }

    if (!Array.isArray(subscribers) || subscribers.length === 0) {
        console.log('ℹ️ No hay ningún suscriptor registrado en subscribers.json. Saliendo...');
        process.exit(0);
    }

    console.log(`📬 Se enviará la notificación a ${subscribers.length} suscriptor(es)...`);
    const emailHtml = generateEmailTemplate(currentLatestPost);

    // 4. Bucle de envío individual
    for (let i = 0; i < subscribers.length; i++) {
        const email = subscribers[i];
        console.log(`[${i + 1}/${subscribers.length}] Procesando envío para: ${email}...`);

        if (isDryRun) {
            console.log(`[DRY RUN] Simulación exitosa del envío de correo a: ${email}`);
            // En modo prueba imprimimos una vista previa corta de la plantilla HTML generada
            if (i === 0) {
                console.log('\n--- VISTA PREVIA DEL CORREO (HTML) ---');
                console.log(emailHtml.substring(0, 800) + '\n... [contenido truncado en consola] ...');
                console.log('-------------------------------------\n');
            }
            continue;
        }

        try {
            await sendEmail(email, currentLatestPost, emailHtml);
            console.log(`  ✅ Correo enviado con éxito.`);
        } catch (err) {
            console.error(`  ❌ Error al enviar correo a ${email}:`, err.message);
        }

        // Delay de 150ms para no saturar los límites de velocidad de Resend (máx. 10 reqs/seg)
        await sleep(150);
    }

    console.log('🎉 ¡Proceso de notificaciones finalizado!');
}

main().catch(err => {
    console.error('❌ Error inesperado en el script principal:', err);
    process.exit(1);
});
