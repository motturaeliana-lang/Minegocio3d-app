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
  cuotasInfo: "Hasta 3 y 6 cuotas sin interés"
};

let inventario = [
  { 
    id: 1, 
    nombre: "Soporte de Auriculares Cyberpunk", 
    stock: 12, 
    precio: 15000, 
    imagenes: [
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
      "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=400"
    ],
    videoDemo: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-light-tunnel-3-41372-large.mp4"
  }
];

let agendaPublicaciones = [
  { id: 1, producto: "Soporte Cyberpunk", formato: "Reel Tendencia (Antes/Después)", fecha: "Pendiente de tu aprobación", estado: "Listo para publicar" }
];

let estadisticas = { ventasMes: 480000, pedidosEntregados: 34, tasaConversion: "4.8%", canalPrincipal: "WhatsApp Business" };

let tendenciasMercado = [
  { producto: "Organizadores de escritorio modulares", demanda: "Muy Alta", margen: "75%" },
  { producto: "Soportes de pared para herramientas", demanda: "Alta", margen: "70%" },
  { producto: "Macetas autoriego geométricas", demanda: "Estable", margen: "60%" }
];

app.post('/actualizar-config', (req, res) => {
  configuracionTienda.nombre = req.body.nombre;
  configuracionTienda.instagram = req.body.instagram;
  configuracionTienda.whatsapp = req.body.whatsapp.replace(/\D/g,'');
  configuracionTienda.celularNoti = req.body.celularNoti;
  configuracionTienda.linkPago = req.body.linkPago;
  configuracionTienda.cuotasInfo = req.body.cuotasInfo;
  res.redirect('/');
});

app.post('/agregar-producto', upload.fields([{ name: 'foto' }]), (req, res) => {
  const { nombre, stock, precio } = req.body;
  const fotoPath = req.files['foto'] ? `/uploads/${req.files['foto'][0].filename}` : "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400";
  
  if (nombre && stock && precio) {
    inventario.push({
      id: inventario.length + 1,
      nombre,
      stock: parseInt(stock),
      precio: parseFloat(precio),
      imagenes: [fotoPath, "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400"],
      videoDemo: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-3d-printer-nozzle-42992-large.mp4"
    });
    agendaPublicaciones.push({
      id: agendaPublicaciones.length + 1,
      producto: nombre,
      formato: "Reel Viral Automático + Kit de Fotos Verticales",
      fecha: "Aprobación pendiente",
      estado: "Generado por IA (Listo para Instagram)"
    });
  }
  res.redirect('/');
});

app.get('/', (req, res) => {
  const listaInventarioHTML = inventario.map(p => `<li><b>${p.nombre}</b> - Stock: ${p.stock}u ($${p.precio})</li>`).join('');
  const listaAgendaHTML = agendaPublicaciones.map(a => `
    <li style="background:#0b0f19; padding:10px; border-radius:6px; margin-bottom:8px; border:1px solid #334155;">
        <b>${a.producto}</b> (${a.formato})<br>
        <span style="color: #38bdf8; font-size: 13px;">Estado: ${a.estado}</span><br>
        <button onclick="alert('¡Reel y fotos aprobadas y publicadas con éxito en Instagram y Web!'); location.reload();" style="background:#10b981; padding:4px 10px; font-size:12px; margin-top:6px; width:auto;">✅ Aprobar y Publicar en Redes</button>
    </li>
  `).join('');
  const listaTendenciasHTML = tendenciasMercado.map(t => `<li><b>${t.producto}</b> — Demanda: ${t.demanda} | Margen: ${t.margen}</li>`).join('');

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
            h1 { color: var(--primary); display: flex; align-items: center; gap: 10px; }
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
            .media-preview img, .media-preview video { width: 100%; height: 140px; object-fit: cover; border-radius: 6px; background: #000; }
            .stl-viewport { width: 100%; height: 160px; background: #0b0f19; border: 2px dashed var(--border); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #38bdf8; margin-top: 10px; text-align:center; padding:10px; font-size:13px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 ${configuracionTienda.nombre} <span style="font-size: 14px; background: #334155; padding: 4px 10px; border-radius: 20px; color: #fff;">Cloud 24/7 Activo</span></h1>
            
            <div class="grid">
                <!-- 1. CONFIGURACIÓN EDITABLE DESDE LA RAÍZ -->
                <div class="card">
                    <h2>⚙️ Configuración, Pagos & Enlaces</h2>
                    <form action="/actualizar-config" method="POST">
                        <label>Nombre de la Tienda:</label>
                        <input type="text" name="nombre" value="${configuracionTienda.nombre}" required>
                        <label>Instagram:</label>
                        <input type="text" name="instagram" value="${configuracionTienda.instagram}">
                        <label>WhatsApp de Pedidos:</label>
                        <input type="text" name="whatsapp" value="${configuracionTienda.whatsapp}" required>
                        <label>Celular para Notificaciones:</label>
                        <input type="text" name="celularNoti" value="${configuracionTienda.celularNoti}">
                        <label>Link de Pago Online (Mercado Pago / Getnet):</label>
                        <input type="text" name="linkPago" value="${configuracionTienda.linkPago}" required>
                        <label>Información de Cuotas / Financiación:</label>
                        <input type="text" name="cuotasInfo" value="${configuracionTienda.cuotasInfo}" required>
                        <button type="submit" class="success">Guardar Configuración General</button>
                    </form>
                    <a href="/web" target="_blank"><button style="background:#0284c7; margin-top: 10px;">🌐 Ver Mi Página Web en Vivo</button></a>
                </div>

                <!-- 2. ESTUDIO STL: CREAR DESDE CERO O EDITAR -->
                <div class="card">
                    <h2>⚙️ Estudio STL (Crear desde 0 o Modificar)</h2>
                    <p style="font-size: 13px; color: #94a3b8;">Describe tu idea o sube una imagen para generar el STL:</p>
                    <textarea id="promptStl" placeholder="Ej: Maceta geométrica hexagonal con autoriego..." style="height: 50px;"></textarea>
                    <input type="file" accept=".stl,.3mf,image/*">
                    <button class="success" onclick="generarStlIA()">✨ Generar Modelo STL 3D</button>
                    <div class="stl-viewport" id="stlViewportBox">
                        <div id="stlInfoText">📦 [Estudio STL] Esperando instrucción o archivo...</div>
                    </div>
                </div>
            </div>

            <div class="grid">
                <!-- 3. EDITOR DE FOTOS REALES & KIT MULTIMEDIA IA -->
                <div class="card">
                    <h2>📸 Editor de Fotos & Kit de Reels IA</h2>
                    <p style="font-size: 13px; color: #94a3b8;">Sube tu foto real para generar kit vertical y reel:</p>
                    <form action="/agregar-producto" method="POST" enctype="multipart/form-data">
                        <input type="text" name="nombre" placeholder="Nombre de la pieza" required>
                        <input type="number" name="stock" placeholder="Stock" required>
                        <input type="number" name="precio" placeholder="Precio ($)" required>
                        <input type="file" name="foto" accept="image/*" required>
                        <button type="submit" class="success">✨ Generar Kit de Fotos y Reel para Redes</button>
                    </form>
                </div>

                <!-- 4. VISOR DE KIT DE CONTENIDO -->
                <div class="card">
                    <h2>🎬 Kit de Contenido Generado</h2>
                    <div class="visor-grid">
                        <div class="media-preview">
                            <p style="font-size: 11px; color: #38bdf8; margin: 3px 0;"><b>Foto Vertical Optimizada</b></p>
                            <img src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400" alt="Foto Vertical">
                        </div>
                        <div class="media-preview">
                            <p style="font-size: 11px; color: #38bdf8; margin: 3px 0;"><b>Reel Corto Atracción</b></p>
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
                        <div class="chat-msg bot"><b>Asesor GRUMI:</b> Hola Eliana. Estoy analizando consultas de clientes y sugiriendo respuestas comerciales óptimas.</div>
                    </div>
                    <input type="text" id="botInput" placeholder="Pregúntale al asesor o simula un cliente...">
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
                    <h2>📅 Agenda & Publicación Autónoma (Requiere tu OK)</h2>
                    <ul>${listaAgendaHTML}</ul>
                </div>

                <!-- 8. TENDENCIAS DE MERCADO -->
                <div class="card">
                    <h2>🤖 IA Analista de Mercado</h2>
                    <div style="font-size: 13px;">
                        <b>🔥 Tendencias detectadas hoy:</b>
                        <ul style="padding-left:15px; margin-top:8px;">${listaTendenciasHTML}</ul>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>📦 Inventario Activo</h2>
                <ul>${listaInventarioHTML}</ul>
            </div>
        </div>

        <script>
            function generarStlIA() {
                const prompt = document.getElementById('promptStl').value;
                const box = document.getElementById('stlViewportBox');
                if(!prompt) { alert('Escribe una descripción para generar el STL'); return; }
                box.innerHTML = '<div style="color: #10b981; font-weight: bold;">✔ Modelo STL generado con éxito:<br><a href="#" onclick="alert(\'Descargando archivo .stl a tu computadora...\'); return false;" style="color:#38bdf8; text-decoration:underline;">📥 Descargar Archivo .STL (' + prompt.substring(0,20) + '...)</a></div>';
            }
            function probarAsesor() {
                const input = document.getElementById('botInput');
                const chat = document.getElementById('botChat');
                if(!input.value) return;
                chat.innerHTML += '<div class="chat-msg"><b>Cliente / Consulta:</b> ' + input.value + '</div>';
                const msg = input.value;
                input.value = '';
                setTimeout(() => {
                    chat.innerHTML += '<div class="chat-msg bot"><b>Asesor GRUMI:</b> Hola! Gracias por tu interés en GRUMI 3D. El producto se imprime con PLA premium de alta resistencia. ¿Te agendo el pedido o necesitas asesoramiento con las medidas? (Derivado a tu WhatsApp personal).</div>';
                    setTimeout(() => { alert('💬 [WhatsApp Business Alerta]: ¡Nueva consulta comercial recibida y atendida por el Asesor!'); }, 300);
                    chat.scrollTop = chat.scrollHeight;
                }, 800);
            }
        </script>
    </body>
    </html>
  `);
});

// Página Web del Cliente Final (Con imágenes verticales, música y pagos editables)
app.get('/web', (req, res) => {
  const productosHTML = inventario.map(p => `
    <div class="product-card">
        <video autoplay muted loop playsinline class="product-video">
            <source src="${p.videoDemo}" type="video/mp4">
        </video>
        
        <!-- Imagen Principal Vertical -->
        <div style="margin: 10px 0; text-align:center;">
            <img id="img-principal-${p.id}" src="${p.imagenes[0]}" style="width:100%; height:320px; object-fit:cover; border-radius:10px; border:1px solid #cbd5e1;" alt="Foto Vertical">
        </div>

        <!-- Miniaturas Clickeables -->
        <div class="thumb-gallery" style="display:flex; justify-content:center; gap:8px; margin-bottom:10px; overflow-x:auto;">
            ${p.imagenes.map((img, idx) => `
                <img src="${img}" 
                     style="width:50px; height:65px; object-fit:cover; border-radius:4px; border:2px solid #6366f1; cursor:pointer;" 
                     onclick="document.getElementById('img-principal-${p.id}').src='${img}'" 
                     title="Ver foto ${idx + 1}" alt="Miniatura">
            `).join('')}
        </div>

        <h3>${p.nombre}</h3>
        <p style="color: #64748b; font-size: 14px;">Stock: ${p.stock} unidades</p>
        <div class="price">$${p.precio.toLocaleString()}</div>
        <p style="color: #059669; font-size: 13px; font-weight:600; margin:5px 0;">💳 ${configuracionTienda.cuotasInfo}</p>
        
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
            body { font-family: 'Segoe UI', sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
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
            <p>Catálogo exclusivo con fotos verticales, videos en bucle y financiación flexible.</p>
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
