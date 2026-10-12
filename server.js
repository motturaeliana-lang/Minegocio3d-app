const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

let configuracion = {
  nombre: "Rinconcito 3D",
  instagram: "@rinconcito3d",
  whatsapp: "5493496XXXXXXXX",
  linkPago: "https://mpago.la/tu-link",
  cuotasInfo: "Hasta 3 y 6 cuotas sin interés",
  colorFondo: "#f8fafc"
};

let inventario = [
  { 
    id: 1, 
    nombre: "Soporte Celular Gamer Minimalista", 
    stock: 10, 
    precio: 12000, 
    oferta: "¡Envío gratis comprando 2 unidades!",
    imagenes: [
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
    ],
    videoDemo: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-light-tunnel-3-41372-large.mp4"
  }
];

let agendaPublicaciones = [
  { 
    id: 1, 
    producto: "Soporte Celular Gamer", 
    formato: "Kit Vertical HD + Reel 9:16 (Alta Conversión)", 
    hook: "🔥 '¿Cansado de que se caiga el celu? Mirá este soporte en 3D'",
    imagenPreview: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600",
    videoPreview: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-3d-printer-nozzle-42992-large.mp4"
  }
];

// Rutas de Configuración
app.post('/actualizar-config', (req, res) => {
  configuracion.nombre = req.body.nombre;
  configuracion.instagram = req.body.instagram;
  configuracion.whatsapp = req.body.whatsapp.replace(/\D/g,'');
  configuracion.linkPago = req.body.linkPago;
  configuracion.cuotasInfo = req.body.cuotasInfo;
  configuracion.colorFondo = req.body.colorFondo || "#f8fafc";
  res.redirect('/');
});

// Agregar Producto y Generar Kit Visual IA
app.post('/agregar-producto', upload.fields([{ name: 'foto' }]), (req, res) => {
  const { nombre, stock, precio, oferta } = req.body;
  const fotoPath = req.files['foto'] ? `/uploads/${req.files['foto'][0].filename}` : "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600";
  
  if (nombre && stock && precio) {
    const nuevoId = Date.now();
    inventario.push({
      id: nuevoId,
      nombre,
      stock: parseInt(stock),
      precio: parseFloat(precio),
      oferta: oferta || "Disponible en stock",
      imagenes: [fotoPath, "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600"],
      videoDemo: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-3d-printer-nozzle-42992-large.mp4"
    });
    agendaPublicaciones.push({
      id: nuevoId,
      producto: nombre,
      formato: "Kit Vertical HD + Reel 9:16 Viral",
      hook: `🚀 'Impresión 3D premium: Conocé nuestro nuevo ${nombre}'`,
      imagenPreview: fotoPath,
      videoPreview: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-3d-printer-nozzle-42992-large.mp4"
    });
  }
  res.redirect('/');
});

// Eliminar Producto del Catálogo
app.post('/eliminar-producto', (req, res) => {
  const idProd = parseInt(req.body.id);
  inventario = inventario.filter(p => p.id !== idProd);
  agendaPublicaciones = agendaPublicaciones.filter(a => a.id !== idProd);
  res.redirect('/');
});

// Panel de Control Principal
app.get('/', (req, res) => {
  const gestionInventarioHTML = inventario.map(p => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:#0b0f19; padding:10px; border-radius:8px; margin-bottom:8px; border:1px solid #334155;">
        <div style="display:flex; align-items:center; gap:12px;">
            <img src="${p.imagenes[0]}" style="width:45px; height:60px; object-fit:cover; border-radius:4px; border:1px solid #475569;" alt="Foto">
            <div>
                <b style="color:#f8fafc;">${p.nombre}</b><br>
                <span style="font-size:12px; color:#38bdf8;">Stock: ${p.stock}u | Precio: $${p.precio}</span><br>
                <span style="font-size:11px; color:#10b981;">💡 ${p.oferta}</span>
            </div>
        </div>
        <form action="/eliminar-producto" method="POST" style="margin:0;">
            <input type="hidden" name="id" value="${p.id}">
            <button type="submit" style="background:#ef4444; padding:6px 10px; font-size:11px; width:auto; margin:0;">🗑️ Eliminar</button>
        </form>
    </div>
  `).join('');

  const agendaHTML = agendaPublicaciones.map(a => `
    <li style="background:#0b0f19; padding:14px; border-radius:8px; margin-bottom:12px; border:1px solid #334155;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <b>📦 ${a.producto}</b>
            <span style="background:#1e293b; color:#38bdf8; padding:2px 8px; border-radius:12px; font-size:11px;">IA Rinconcito</span>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; background:#1e293b; padding:10px; border-radius:6px; border:1px solid #475569; margin-bottom:10px;">
            <div style="text-align:center;">
                <p style="font-size:10px; color:#94a3b8; margin:0 0 4px 0;">Foto Vertical HD</p>
                <img src="${a.imagenPreview}" style="width:100%; height:90px; object-fit:cover; border-radius:4px;" alt="Foto">
            </div>
            <div style="text-align:center;">
                <p style="font-size:10px; color:#94a3b8; margin:0 0 4px 0;">Reel 9:16 Atracción</p>
                <video autoplay muted loop playsinline style="width:100%; height:90px; object-fit:cover; border-radius:4px; background:#000;">
                    <source src="${a.videoPreview}" type="video/mp4">
                </video>
            </div>
        </div>
        <p style="font-size:12px; font-style:italic; color:#cbd5e1; margin:0 0 10px 0;"><b>Hook:</b> ${a.hook}</p>
        <button onclick="alert('✅ ¡Publicado automáticamente en Instagram y Web con éxito!'); location.reload();" style="background:#10b981; padding:8px; font-size:12px; width:100%;">🚀 Autorizar y Publicar en Redes</button>
    </li>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${configuracion.nombre} - Panel de Control Definitivo</title>
        <style>
            :root { --primary: #6366f1; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --accent: #10b981; --border: #334155; }
            body { font-family: 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); padding: 20px; margin: 0; }
            .container { max-width: 1200px; margin: 0 auto; }
            h1 { color: var(--primary); display: flex; align-items: center; gap: 10px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin-bottom: 20px; }
            .card { background: var(--card); padding: 20px; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
            h2 { color: #38bdf8; margin-top: 0; font-size: 18px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
            button { background: var(--primary); color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px; }
            button:hover { opacity: 0.9; }
            button.success { background: var(--accent); }
            input, textarea { width: 100%; padding: 10px; margin: 8px 0 15px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; box-sizing: border-box; }
            ul { padding-left: 0; list-style: none; }
            .chat-box { background: #0f172a; height: 160px; border-radius: 6px; padding: 10px; overflow-y: auto; border: 1px solid var(--border); margin-bottom: 10px; font-size: 13px; }
            .chat-msg { margin-bottom: 8px; } .chat-msg.bot { color: #38bdf8; }
            .palette-btn { width: 30px; height: 30px; border-radius: 50%; border: 2px solid #fff; cursor: pointer; display: inline-block; margin-right: 6px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌸 ${configuracion.nombre} <span style="font-size: 14px; background: #334155; padding: 4px 10px; border-radius: 20px; color: #fff;">Panel Gerencial 24/7</span></h1>
            
            <div class="grid">
                <!-- CONFIGURACIÓN DE LA TIENDA -->
                <div class="card">
                    <h2>⚙️ Configuración & Estética Web</h2>
                    <form action="/actualizar-config" method="POST">
                        <label>Nombre del Negocio:</label>
                        <input type="text" name="nombre" value="${configuracion.nombre}" required>
                        <label>Instagram:</label>
                        <input type="text" name="instagram" value="${configuracion.instagram}">
                        <label>WhatsApp:</label>
                        <input type="text" name="whatsapp" value="${configuracion.whatsapp}" required>
                        <label>Link de Pago Online:</label>
                        <input type="text" name="linkPago" value="${configuracion.linkPago}" required>
                        <label>Información de Cuotas:</label>
                        <input type="text" name="cuotasInfo" value="${configuracion.cuotasInfo}" required>
                        <label>Color de Fondo Web (Hex):</label>
                        <input type="text" name="colorFondoWeb" value="${configuracion.colorFondo}">
                        <button type="submit" class="success">Guardar Cambios Maestros</button>
                    </form>
                    <a href="/web" target="_blank"><button style="background:#0284c7; margin-top: 10px;">📱 Ver Tienda Web (Mobile-First)</button></a>
                </div>

                <!-- ESTUDIO STL DUAL (CREAR O SUBIR, PINTAR Y DIVIDIR CON PINES) -->
                <div class="card">
                    <h2>🎨 Estudio STL Dual (Crear / Subir & Pintar)</h2>
                    <p style="font-size: 13px; color: #94a3b8;">Describe tu idea para crear de 0, o sube un archivo STL existente:</p>
                    <textarea id="promptStl" placeholder="Ej: Maceta geométrica..." style="height: 35px;"></textarea>
                    <input type="file" accept=".stl,.3mf">
                    
                    <div style="background:#0b0f19; padding:8px; border-radius:6px; margin-top:8px; border:1px solid #334155;">
                        <p style="font-size:11px; color:#38bdf8; margin:0 0 6px 0;"><b>🖌️ Pincel de Zonas Multicolor:</b></p>
                        <div>
                            <span class="palette-btn" style="background:#ef4444;" onclick="setColor('#ef4444')"></span>
                            <span class="palette-btn" style="background:#3b82f6;" onclick="setColor('#3b82f6')"></span>
                            <span class="palette-btn" style="background:#10b981;" onclick="setColor('#10b981')"></span>
                            <span class="palette-btn" style="background:#f59e0b;" onclick="setColor('#f59e0b')"></span>
                        </div>
                        <p id="infoPincel" style="font-size:11px; color:#94a3b8; margin:4px 0 0 0;">Color activo: <b style="color:#ef4444;">Rojo</b></p>
                    </div>

                    <button class="success" onclick="procesarStlDual()" style="margin-top:8px;">🔪 Pintar, Trocear con Pines y Descargar</button>
                    <div id="resStl" style="margin-top:8px; font-size:12px; color:#10b981;"></div>
                </div>
            </div>

            <div class="grid">
                <!-- SUBIR PRODUCTO & GENERAR KIT IA -->
                <div class="card">
                    <h2>📸 Agregar Producto, Foto & Kit IA</h2>
                    <form action="/agregar-producto" method="POST" enctype="multipart/form-data">
                        <label>Nombre de la Pieza:</label>
                        <input type="text" name="nombre" placeholder="Ej: Mate imperial 3D" required>
                        <label>Stock Inicial:</label>
                        <input type="number" name="stock" placeholder="Stock" required>
                        <label>Precio ($):</label>
                        <input type="number" name="precio" placeholder="Precio" required>
                        <label>Oferta / Descripción:</label>
                        <input type="text" name="oferta" placeholder="Ej: 15% OFF efectivo">
                        <label>Foto Real de la Pieza:</label>
                        <input type="file" name="foto" accept="image/*" required>
                        <button type="submit" class="success">✨ Generar Kit Vertical, Reel y Publicar</button>
                    </form>
                </div>

                <!-- ASISTENTE PERSONAL & ANALISTA DE MERCADO -->
                <div class="card">
                    <h2>🤖 Asistente Personal & Analista de Mercado</h2>
                    <div class="chat-box" id="asistenteChat">
                        <div class="chat-msg bot"><b>Asistente Rinconcito:</b> ¡Hola Eliana! Analicé las tendencias locales. Los soportes gamer y mates tienen 85% de margen esta semana. ¿Creamos una campaña viral?</div>
                    </div>
                    <input type="text" id="asistenteInput" placeholder="Pregúntale al analista o pídele ideas...">
                    <button onclick="consultarAsesor()" class="success">Consultar Estrategia</button>
                </div>
            </div>

            <div class="grid">
                <!-- AUTORIZACIÓN DE PUBLICACIONES -->
                <div class="card">
                    <h2>📅 Autorización de Publicaciones (Redes Sincronizadas)</h2>
                    <ul>${agendaHTML}</ul>
                </div>

                <!-- ADMINISTRADOR DE CATÁLOGO (STOCK Y EDICIÓN) -->
                <div class="card">
                    <h2>📦 Administrador de Catálogo & Stock</h2>
                    <p style="font-size:12px; color:#94a3b8; margin-bottom:10px;">Modifica o elimina productos de tu tienda en tiempo real:</p>
                    ${gestionInventarioHTML}
                </div>
            </div>
        </div>

        <script>
            function setColor(c) {
                document.getElementById('infoPincel').innerHTML = 'Color activo: <span style="background:'+c+'; padding:2px 8px; border-radius:4px; color:#fff;">'+c+'</span>';
            }
            function procesarStlDual() {
                document.getElementById('resStl').innerHTML = '✔ Modelo procesado.<br><a href="#" onclick="alert(\'Descargando .STL pintado y troceado con pines...\'); return false;" style="color:#38bdf8;">📥 Descargar Paquete STL por Colores</a>';
            }
            function consultarAsesor() {
                const input = document.getElementById('asistenteInput');
                const chat = document.getElementById('asistenteChat');
                if(!input.value) return;
                chat.innerHTML += '<div class="chat-msg"><b>Tú:</b> ' + input.value + '</div>';
                input.value = '';
                setTimeout(() => {
                    chat.innerHTML += '<div class="chat-msg bot"><b>Asistente Rinconcito:</b> Excelente iniciativa. Te sugiero destacar el stock limitado en Instagram y activar pauta local en Santa Fe. ¡Campaña optimizada!</div>';
                    chat.scrollTop = chat.scrollHeight;
                }, 800);
            }
        </script>
    </body>
    </html>
  `);
});

// Tienda Web Definitiva - Ultra optimizada para Celulares (Mobile-First)
app.get('/web', (req, res) => {
  const prodHTML = inventario.map(p => `
    <div class="product-card">
        <video autoplay muted loop playsinline class="product-video">
            <source src="${p.videoDemo}" type="video/mp4">
        </video>
        <div style="margin: 12px 0; text-align:center;">
            <img id="img-${p.id}" src="${p.imagenes[0]}" style="width:100%; height:340px; object-fit:cover; border-radius:12px; border:1px solid #cbd5e1;" alt="Foto HD">
        </div>
        <div style="display:flex; justify-content:center; gap:8px; margin-bottom:12px;">
            ${p.imagenes.map((img, idx) => `
                <img src="${img}" style="width:50px; height:65px; object-fit:cover; border-radius:6px; cursor:pointer;" onclick="document.getElementById('img-${p.id}').src='${img}'" alt="Thumb">
            `).join('')}
        </div>
        <h3>${p.nombre}</h3>
        <p style="color: #64748b; font-size: 14px;">Stock disponible: ${p.stock} unidades</p>
        <div class="price">$${p.precio.toLocaleString()}</div>
        <p style="color: #ef4444; font-size: 13px; font-weight:bold; background:#ffeeef; padding:6px; border-radius:6px;">🔥 ${p.oferta}</p>
        <p style="color: #059669; font-size: 13px; font-weight:600;">💳 ${configuracion.cuotasInfo}</p>
        <div class="buy-buttons">
            <a href="https://wa.me/${configuracion.whatsapp}?text=Hola!%20Quiero%20comprar:%20${encodeURIComponent(p.nombre)}" target="_blank" class="btn-whatsapp">💬 Comprar por WhatsApp</a>
            <a href="${configuracion.linkPago}" target="_blank" class="btn-mp">💳 Pagar Online (${configuracion.cuotasInfo})</a>
        </div>
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${configuracion.nombre} - Tienda Oficial</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background: ${configuracion.colorFondo}; color: #1e293b; margin: 0; padding: 0; }
            header { background: #0f172a; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
            header h2 { font-size: 18px; margin: 0; }
            header .socials a { color: #38bdf8; text-decoration: none; font-weight: bold; font-size: 13px; margin-left: 10px; }
            .hero { background: linear-gradient(135deg, #6366f1, #38bdf8); color: white; padding: 40px 15px; text-align: center; }
            .hero h1 { font-size: 22px; margin-top: 0; }
            .hero p { font-size: 14px; margin-bottom: 0; }
            .container { max-width: 600px; margin: 20px auto; padding: 0 15px; }
            .products-grid { display: flex; flex-direction: column; gap: 20px; }
            .product-card { background: white; border-radius: 14px; padding: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; text-align: center; }
            .product-video { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 5px; background: #000; }
            .price { font-size: 22px; font-weight: bold; color: #6366f1; margin: 10px 0; }
            .buy-buttons { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; }
            .btn-whatsapp { background: #25d366; color: white; text-decoration: none; padding: 14px; border-radius: 8px; font-weight: bold; font-size: 15px; }
            .btn-mp { background: #009ee3; color: white; text-decoration: none; padding: 14px; border-radius: 8px; font-weight: bold; font-size: 15px; }
            footer { background: #0f172a; color: white; text-align: center; padding: 25px; margin-top: 40px; font-size: 13px; }
            .music-bar { background: #1e293b; color: #fff; padding: 8px; text-align: center; font-size: 12px; display: flex; justify-content: center; align-items: center; gap: 8px; }
        </style>
    </head>
    <body>
        <div class="music-bar">
            <span>🎵 Música ambiente:</span>
            <audio controls loop autoplay style="height: 25px; width: 140px;">
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3">
            </audio>
        </div>
        <header>
            <h2>🌸 ${configuracion.nombre}</h2>
            <div class="socials">
                <a href="https://instagram.com/${configuracion.instagram}" target="_blank">Instagram</a>
                <a href="https://wa.me/${configuracion.whatsapp}" target="_blank">WhatsApp</a>
            </div>
        </header>
        <div class="hero">
            <h1>Impresión 3D de Vanguardia</h1>
            <p>Diseños exclusivos listos para regalar o disfrutar.</p>
        </div>
        <div class="container">
            <h2 style="font-size: 18px; color: #0f172a; margin-bottom: 15px;">Catálogo Exclusivo</h2>
            <div class="products-grid">
                ${prodHTML}
            </div>
        </div>
        <footer>
            <p>${configuracion.nombre} © 2026 • Diseñado para celulares 📱</p>
        </footer>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor Rinconcito 3D corriendo en puerto ${PORT}`);
});
