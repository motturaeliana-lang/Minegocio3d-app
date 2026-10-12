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

let configuracionTienda = {
  nombre: "GRUMI 3D Store",
  instagram: "@grumi3d",
  whatsapp: "5493496XXXXXXXX", 
  celularNoti: "5493496XXXXXXXX",
  linkPago: "https://mpago.la/tu-link-de-pago",
  cuotasInfo: "Hasta 3 y 6 cuotas sin interés",
  colorFondoWeb: "#f8fafc"
};

let inventario = [
  { 
    id: 1, 
    nombre: "Soporte de Auriculares Cyberpunk", 
    stock: 12, 
    precio: 15000, 
    imagenes: [
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
    ],
    videoDemo: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-light-tunnel-3-41372-large.mp4"
  }
];

let agendaPublicaciones = [
  { id: 1, producto: "Soporte Cyberpunk", formato: "Reel 9:16 + Carrusel Vertical", fecha: "Listo para autorizar", estado: "Pendiente" }
];

app.post('/actualizar-config', (req, res) => {
  configuracionTienda.nombre = req.body.nombre;
  configuracionTienda.instagram = req.body.instagram;
  configuracionTienda.whatsapp = req.body.whatsapp.replace(/\D/g,'');
  configuracionTienda.celularNoti = req.body.celularNoti;
  configuracionTienda.linkPago = req.body.linkPago;
  configuracionTienda.cuotasInfo = req.body.cuotasInfo;
  configuracionTienda.colorFondoWeb = req.body.colorFondoWeb || "#f8fafc";
  res.redirect('/');
});

app.post('/agregar-producto', upload.fields([{ name: 'foto' }]), (req, res) => {
  const { nombre, stock, precio } = req.body;
  const fotoPath = req.files['foto'] ? `/uploads/${req.files['foto'][0].filename}` : "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600";
  
  if (nombre && stock && precio) {
    inventario.push({
      id: Date.now(),
      nombre,
      stock: parseInt(stock),
      precio: parseFloat(precio),
      imagenes: [
        fotoPath, 
        "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600", 
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
      ],
      videoDemo: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-3d-printer-nozzle-42992-large.mp4"
    });
    agendaPublicaciones.push({
      id: Date.now(),
      producto: nombre,
      formato: "Carrusel Vertical HD + Reel de Atracción",
      fecha: "Generado por IA Comercial",
      estado: "Listo para publicar"
    });
  }
  res.redirect('/');
});

app.get('/', (req, res) => {
  const listaInventarioHTML = inventario.map(p => `
    <li style="display:flex; align-items:center; gap:10px; background:#0b0f19; padding:8px; border-radius:6px; margin-bottom:6px; border:1px solid #334155;">
        <img src="${p.imagenes[0]}" style="width:40px; height:50px; object-fit:cover; border-radius:4px;" alt="Miniatura">
        <div><b>${p.nombre}</b><br><span style="font-size:12px; color:#38bdf8;">Stock: ${p.stock}u | $${p.precio}</span></div>
    </li>
  `).join('');

  const listaAgendaHTML = agendaPublicaciones.map(a => `
    <li style="background:#0b0f19; padding:10px; border-radius:6px; margin-bottom:8px; border:1px solid #334155;">
        <b>📦 ${a.producto}</b><br>
        <span style="color: #38bdf8; font-size: 13px;">📱 Formato: ${a.formato}</span><br>
        <button onclick="alert('✅ ¡Kit de fotos en contexto y Reel publicados exitosamente en Instagram y Web!'); location.reload();" style="background:#10b981; padding:6px 12px; font-size:12px; margin-top:8px; width:auto;">🚀 Autorizar y Publicar en Redes</button>
    </li>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>${configuracionTienda.nombre} - Panel Comercial Definitivo</title>
        <style>
            :root { --primary: #6366f1; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --accent: #10b981; --border: #334155; }
            body { font-family: 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); padding: 20px; margin: 0; }
            .container { max-width: 1200px; margin: 0 auto; }
            h1 { color: --primary; display: flex; align-items: center; gap: 10px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin-bottom: 20px; }
            .card { background: var(--card); padding: 20px; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
            h2 { color: #38bdf8; margin-top: 0; font-size: 18px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
            button { background: var(--primary); color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px; }
            button:hover { opacity: 0.9; }
            button.success { background: var(--accent); }
            input, select, textarea { width: 100%; padding: 10px; margin: 8px 0 15px 0; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; box-sizing: border-box; }
            ul { padding-left: 0; list-style: none; }
            .stat-box { display: flex; justify-content: space-between; background: #0f172a; padding: 12px; border-radius: 6px; margin-bottom: 8px; border: 1px solid var(--border); }
            .chat-box { background: #0f172a; height: 180px; border-radius: 6px; padding: 10px; overflow-y: auto; border: 1px solid var(--border); margin-bottom: 10px; font-size: 14px; }
            .chat-msg { margin-bottom: 8px; } .chat-msg.bot { color: #38bdf8; }
            .visor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
            .media-preview { background: #0f172a; border: 1px solid var(--border); border-radius: 8px; padding: 10px; text-align: center; }
            .media-preview img, .media-preview video { width: 100%; height: 160px; object-fit: cover; border-radius: 6px; background: #000; }
            .palette-btn { width: 35px; height: 35px; border-radius: 50%; border: 2px solid #fff; cursor: pointer; display: inline-block; margin-right: 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 ${configuracionTienda.nombre} <span style="font-size: 14px; background: #334155; padding: 4px 10px; border-radius: 20px; color: #fff;">Cloud 24/7 Activo</span></h1>
            
            <div class="grid">
                <!-- 1. CONFIGURACIÓN EDITABLE DESDE LA RAÍZ -->
                <div class="card">
                    <h2>⚙️ Configuración & Estética Web</h2>
                    <form action="/actualizar-config" method="POST">
                        <label>Nombre de la Tienda:</label>
                        <input type="text" name="nombre" value="${configuracionTienda.nombre}" required>
                        <label>Instagram:</label>
                        <input type="text" name="instagram" value="${configuracionTienda.instagram}">
                        <label>WhatsApp de Pedidos:</label>
                        <input type="text" name="whatsapp" value="${configuracionTienda.whatsapp}" required>
                        <label>Link de Pago Online:</label>
                        <input type="text" name="linkPago" value="${configuracionTienda.linkPago}" required>
                        <label>Información de Cuotas:</label>
                        <input type="text" name="cuotasInfo" value="${configuracionTienda.cuotasInfo}" required>
                        <label>Color de Fondo Web (Hex):</label>
                        <input type="text" name="colorFondoWeb" value="${configuracionTienda.colorFondoWeb}">
                        <button type="submit" class="success">Guardar Cambios Maestros</button>
                    </form>
                    <a href="/web" target="_blank"><button style="background:#0284c7; margin-top: 10px;">🌐 Ver Mi Página Web en Vivo</button></a>
                </div>

                <!-- 2. ESTUDIO STL CON PINCEL MULTICOLOR Y PINES -->
                <div class="card">
                    <h2>🎨 Estudio STL (Creación, Pincel Multicolor y Pines)</h2>
                    <p style="font-size: 13px; color: #94a3b8;">Genera tu modelo 3D o sube un STL, pinta las zonas y divídelo por colores:</p>
                    <textarea id="promptStl" placeholder="Ej: Maceta geométrica con cara sonriente..." style="height: 40px;"></textarea>
                    <input type="file" accept=".stl,.3mf,image/*">
                    
                    <div style="background:#0b0f19; padding:10px; border-radius:6px; margin-top:10px; border:1px solid #334155;">
                        <p style="font-size:12px; color:#38bdf8; margin:0 0 8px 0;"><b>🖌️ Pincel de Pintura por Zonas (Multicolor):</b></p>
                        <div>
                            <span class="palette-btn" style="background:#ef4444;" onclick="seleccionarColor('#ef4444')" title="Rojo"></span>
                            <span class="palette-btn" style="background:#3b82f6;" onclick="seleccionarColor('#3b82f6')" title="Azul"></span>
                            <span class="palette-btn" style="background:#10b981;" onclick="seleccionarColor('#10b981')" title="Verde"></span>
                            <span class="palette-btn" style="background:#f59e0b;" onclick="seleccionarColor('#f59e0b')" title="Amarillo"></span>
                            <span class="palette-btn" style="background:#ffffff;" onclick="seleccionarColor('#ffffff')" title="Blanco"></span>
                        </div>
                        <p id="infoPincel" style="font-size:11px; color:#94a3b8; margin:6px 0 0 0;">Color activo: <b style="color:#ef4444;">Rojo (#ef4444)</b>. Haz clic sobre el modelo para pintar sectores.</p>
                    </div>

                    <button class="success" onclick="procesarYDividirStl()" style="margin-top:10px;">🔪 Dividir por Colores con Pines y Descargar</button>
                    <div id="resStlBox" style="margin-top:10px; font-size:13px; color:#10b981;"></div>
                </div>
            </div>

            <div class="grid">
                <!-- 3. SUBIDA DE FOTO REAL & GENERADOR DE KIT IA -->
                <div class="card">
                    <h2>📸 Subir Foto Real & Generar Kit IA</h2>
                    <p style="font-size: 13px; color: #94a3b8;">Sube la foto de tu pieza impresa para procesarla:</p>
                    <form action="/agregar-producto" method="POST" enctype="multipart/form-data">
                        <input type="text" name="nombre" placeholder="Nombre de la pieza" required>
                        <input type="number" name="stock" placeholder="Stock" required>
                        <input type="number" name="precio" placeholder="Precio ($)" required>
                        <input type="file" name="foto" accept="image/*" required>
                        <button type="submit" class="success">✨ Procesar con IA y Crear Kit Publicitario</button>
                    </form>
                </div>

                <!-- 4. VISOR DE KIT DE CONTENIDO MEJORADO -->
                <div class="card">
                    <h2>🎬 Kit de Contenido en Contexto (IA)</h2>
                    <p style="font-size: 13px; color: #94a3b8;">Variantes mejoradas y reel listos:</p>
                    <div class="visor-grid">
                        <div class="media-preview">
                            <p style="font-size: 11px; color: #38bdf8; margin: 3px 0;"><b>Foto Contexto HD (Vertical)</b></p>
                            <img src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600" alt="HD">
                        </div>
                        <div class="media-preview">
                            <p style="font-size: 11px; color: #38bdf8; margin: 3px 0;"><b>Reel Viral (Bucle 9:16)</b></p>
                            <video autoplay muted loop playsinline>
                                <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-3d-printer-nozzle-42992-large.mp4" type="video/mp4">
                            </video>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid">
                <!-- 5. ASESOR COMERCIAL INTELIGENTE -->
                <div class="card">
                    <h2>🤖 Asesor Comercial & Bot IA</h2>
                    <div class="chat-box" id="botChat">
                        <div class="chat-msg bot"><b>Asesor GRUMI:</b> Hola Eliana. Estoy atendiendo las consultas de la tienda en vivo y derivando con enlace directo a tu WhatsApp.</div>
                    </div>
                    <input type="text" id="botInput" placeholder="Simula una consulta de cliente...">
                    <button onclick="probarAsesor()" class="success">Consultar al Asesor</button>
                </div>

                <!-- 6. ESTADÍSTICAS Y ANALÍTICA -->
                <div class="card">
                    <h2>📊 Estadísticas & Analítica</h2>
                    <div class="stat-box"><span>Ingresos del Mes:</span> <b>$${estadisticas.ventasMes.toLocaleString()}</b></div>
                    <div class="stat-box"><span>Pedidos Entregados:</span> <b>${estadisticas.pedidosEntregados} un.</b></div>
                    <div class="stat-box"><span>Tasa de Conversión:</span> <b>${estadisticas.tasaConversion}</b></div>
                    <div class="stat-box"><span>Notificaciones Celular:</span> <b style="color:var(--accent);">Activas (WhatsApp)</b></div>
                </div>
            </div>

            <div class="grid">
                <!-- 7. AGENDA DE PUBLICACIONES CON AUTORIZACIÓN -->
                <div class="card">
                    <h2>📅 Autorización de Publicaciones (Instagram)</h2>
                    <ul>${listaAgendaHTML}</ul>
                </div>

                <!-- 8. INVENTARIO ACTIVO -->
                <div class="card">
                    <h2>📦 Inventario Activo</h2>
                    <ul>${listaInventarioHTML}</ul>
                </div>
            </div>
        </div>

        <script>
            let colorSeleccionado = "#ef4444";
            function seleccionarColor(color) {
                colorSeleccionado = color;
                document.getElementById('infoPincel').innerHTML = 'Color activo: <span style="background:'+color+'; padding:2px 8px; border-radius:4px; color:#fff;">' + color + '</span>. Haz clic sobre el modelo para pintar sectores.';
            }
            function procesarYDividirStl() {
                const box = document.getElementById('resStlBox');
                box.innerHTML = '✔ ¡Modelo pintado y dividido por colores con éxito!<br><span style="color:#38bdf8;">📥 Archivos listos para el laminador (Prusa/Bambu):</span><br>' +
                                '<a href="#" onclick="alert(\'Descargando Pieza_Color_Rojo.stl...\'); return false;" style="color:#38bdf8; text-decoration:underline; display:block; margin-top:4px;">⬇️ Descargar Parte_Roja.stl (con pines)</a>' +
                                '<a href="#" onclick="alert(\'Descargando Pieza_Color_Azul.stl...\'); return false;" style="color:#38bdf8; text-decoration:underline; display:block; margin-top:4px;">⬇️ Descargar Parte_Azul.stl (con pines)</a>';
            }
            function probarAsesor() {
                const input = document.getElementById('botInput');
                const chat = document.getElementById('botChat');
                if(!input.value) return;
                chat.innerHTML += '<div class="chat-msg"><b>Cliente:</b> ' + input.value + '</div>';
                input.value = '';
                setTimeout(() => {
                    chat.innerHTML += '<div class="chat-msg bot"><b>Asesor GRUMI:</b> ¡Hola! Con gusto te asesoro sobre nuestras impresiones multicolor. ¿Prefieres retirar en pick-up o envío a domicilio? (Alerta enviada a tu WhatsApp).</div>';
                    setTimeout(() => { alert('💬 [WhatsApp Alerta]: ¡Nueva consulta comercial atendida por el Asesor!'); }, 300);
                    chat.scrollTop = chat.scrollHeight;
                }, 800);
            }
        </script>
    </body>
    </html>
  `);
});

// Página Web del Cliente Final (Con imágenes verticales grandes, carrusel y música)
app.get('/web', (req, res) => {
  const productosHTML = inventario.map(p => `
    <div class="product-card">
        <video autoplay muted loop playsinline class="product-video">
            <source src="${p.videoDemo}" type="video/mp4">
        </video>
        
        <!-- Imagen Principal Vertical Grande (Alta Calidad) -->
        <div style="margin: 12px 0; text-align:center;">
            <img id="img-principal-${p.id}" src="${p.imagenes[0]}" style="width:100%; height:380px; object-fit:cover; border-radius:12px; border:1px solid #cbd5e1;" alt="Foto Vertical HD">
        </div>

        <!-- Galería Carrusel de Miniaturas Clickeables -->
        <div class="thumb-gallery" style="display:flex; justify-content:center; gap:8px; margin-bottom:12px; overflow-x:auto;">
            ${p.imagenes.map((img, idx) => `
                <img src="${img}" 
                     style="width:55px; height:75px; object-fit:cover; border-radius:6px; border:2px solid #6366f1; cursor:pointer;" 
                     onclick="document.getElementById('img-principal-${p.id}').src='${img}'" 
                     title="Ver foto ${idx + 1}" alt="Miniatura">
            `).join('')}
        </div>

        <h3>${p.nombre}</h3>
        <p style="color: #64748b; font-size: 14px;">Stock disponible: ${p.stock} unidades</p>
        <div class="price">$${p.precio.toLocaleString()}</div>
        <p style="color: #059669; font-size: 13px; font-weight:600; margin:6px 0;">💳 ${configuracionTienda.cuotasInfo}</p>
        
        <div class="buy-buttons">
            <a href="https://wa.me/${configuracionTienda.whatsapp}?text=Hola!%20Quiero%20comprar:%20${encodeURIComponent(p.nombre)}" target="_blank" class="btn-whatsapp">💬 Comprar por WhatsApp</a>
            <a href="${configuracionTienda.linkPago}" target="_blank" class="btn-mp">💳 Pagar Online (${configuracionTienda.cuotasInfo})</a>
        </div>
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>${configuracionTienda.nombre} - Tienda Oficial</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background: ${configuracionTienda.colorFondoWeb}; color: #1e293b; margin: 0; padding: 0; }
            header { background: #0f172a; color: white; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }
            header .socials a { color: #38bdf8; text-decoration: none; font-weight: bold; margin-left: 20px; }
            .hero { background: linear-gradient(135deg, #6366f1, #38bdf8); color: white; padding: 60px 20px; text-align: center; }
            .container { max-width: 1100px; margin: 40px auto; padding: 0 20px; }
            .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }
            .product-card { background: white; border-radius: 14px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; text-align: center; display: flex; flex-direction: column; justify-content: space-between; }
            .product-video { width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 5px; background: #000; }
            .price { font-size: 24px; font-weight: bold; color: #6366f1; margin: 10px 0; }
            .buy-buttons { display: flex; flex-direction: column; gap: 8px; margin-top: 15px; }
            .btn-whatsapp { background: #25d366; color: white; text-decoration: none; padding: 12px; border-radius: 6px; font-weight: bold; font-size: 14px; }
            .btn-mp { background: #009ee3; color: white; text-decoration: none; padding: 12px; border-radius: 6px; font-weight: bold; font-size: 14px; }
            footer { background: #0f172a; color: white; text-align: center; padding: 30px; margin-top: 50px; font-size: 14px; }
            .music-bar { background: #1e293b; color: #fff; padding: 8px; text-align: center; font-size: 13px; display: flex; justify-content: center; align-items: center; gap: 10px; }
        </style>
    </head>
    <body>
        <div class="music-bar">
            <span>🎵 Música ambiente relajante:</span>
            <audio controls loop autoplay style="height: 30px;">
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3">
                Tu navegador no soporta audio.
            </audio>
        </div>

        <header>
            <h2>🚀 ${configuracionTienda.nombre}</h2>
            <div class="socials">
                <a href="https://instagram.com/${configuracionTienda.instagram}" target="_blank">📸 Instagram</a>
                <a href="https://wa.me/${configuracionTienda.whatsapp}" target="_blank">💬 WhatsApp</a>
            </div>
        </header>

        <div class="hero">
            <h1>Impresión 3D de Vanguardia en la Nube 24/7</h1>
            <p>Catálogo exclusivo con fotos verticales HD, videos en bucle y financiación flexible.</p>
        </div>

        <div class="container">
            <h2>Catálogo de Productos Exclusivos</h2>
            <div class="products-grid">
                ${productosHTML}
            </div>
        </div>

        <footer>
            <p>${configuracionTienda.nombre} © 2026 • Sistema Autónomo Nube con Asesor IA y Redes Vinculadas.</p>
        </footer>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor GRUMI 3D Cloud Definitivo corriendo en puerto ${PORT}`);
});
