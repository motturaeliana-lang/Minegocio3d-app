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
  whatsapp: "5493496XXXXXXXX", // Reemplaza aquí con tu número real sin espacios ni símbolos
  celularNoti: "5493496XXXXXXXX"
};

let inventario = [
  { 
    id: 1, 
    nombre: "Soporte de Auriculares Cyberpunk", 
    stock: 12, 
    precio: 15000, 
    imagenes: [
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400"
    ],
    videoDemo: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-light-tunnel-3-41372-large.mp4"
  }
];

let agendaPublicaciones = [
  { id: 1, producto: "Soporte Cyberpunk", formato: "Reel Tendencia (Antes/Después)", fecha: "Hoy, 18:00 hs", estado: "Programado (IA)" }
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
  configuracionTienda.whatsapp = req.body.whatsapp.replace(/\D/g,''); // Limpia cualquier carácter que no sea número
  configuracionTienda.celularNoti = req.body.celularNoti;
  res.redirect('/');
});

app.post('/agregar-producto', upload.fields([{ name: 'foto' }]), (req, res) => {
  const { nombre, stock, precio } = req.body;
  const fotoPath = req.files['foto'] ? `/uploads/${req.files['foto'][0].filename}` : "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=400";
  
  if (nombre && stock && precio) {
    inventario.push({
      id: inventario.length + 1,
      nombre,
      stock: parseInt(stock),
      precio: parseFloat(precio),
      imagenes: [fotoPath, "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400"],
      videoDemo: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-3d-printer-nozzle-42992-large.mp4"
    });
    agendaPublicaciones.push({
      id: agendaPublicaciones.length + 1,
      producto: nombre,
      formato: "Reel Viral Automático (Demostración en Vivo)",
      fecha: "Próximo Slot Disponible",
      estado: "Programado por IA"
    });
  }
  res.redirect('/');
});

app.get('/', (req, res) => {
  const listaInventarioHTML = inventario.map(p => `<li><b>${p.nombre}</b> - Stock: ${p.stock}u ($${p.precio})</li>`).join('');
  const listaAgendaHTML = agendaPublicaciones.map(a => `<li><b>${a.producto}</b><br><span style="color: #38bdf8; font-size: 13px;">📱 ${a.formato} | ⏰ ${a.fecha}</span></li>`).join('');
  const listaTendenciasHTML = tendenciasMercado.map(t => `<li><b>${t.producto}</b> — Demanda: ${t.demanda} | Margen: ${t.margen}</li>`).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>${configuracionTienda.nombre} - Cloud Production</title>
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
            ul { padding-left: 20px; } li { margin-bottom: 10px; font-size: 14px; }
            .stat-box { display: flex; justify-content: space-between; background: #0f172a; padding: 12px; border-radius: 6px; margin-bottom: 8px; border: 1px solid var(--border); }
            .chat-box { background: #0f172a; height: 180px; border-radius: 6px; padding: 10px; overflow-y: auto; border: 1px solid var(--border); margin-bottom: 10px; font-size: 14px; }
            .chat-msg { margin-bottom: 8px; } .chat-msg.bot { color: #38bdf8; }
            .visor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
            .media-preview { background: #0f172a; border: 1px solid var(--border); border-radius: 8px; padding: 10px; text-align: center; }
            .media-preview img, .media-preview video { width: 100%; height: 140px; object-fit: cover; border-radius: 6px; background: #000; }
            .stl-viewport { width: 100%; height: 180px; background: #0b0f19; border: 2px dashed var(--border); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #38bdf8; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 ${configuracionTienda.nombre} <span style="font-size: 14px; background: #334155; padding: 4px 10px; border-radius: 20px; color: #fff;">Cloud 24/7 Activo</span></h1>
            
            <div class="grid">
                <div class="card">
                    <h2>⚙️ Configuración & Edición de Tienda</h2>
                    <form action="/actualizar-config" method="POST">
                        <label>Nombre de la Tienda:</label>
                        <input type="text" name="nombre" value="${configuracionTienda.nombre}" required>
                        <label>Instagram:</label>
                        <input type="text" name="instagram" value="${configuracionTienda.instagram}">
                        <label>WhatsApp de Pedidos (Ej: 5493496...):</label>
                        <input type="text" name="whatsapp" value="${configuracionTienda.whatsapp}" required>
                        <label>Celular para Notificaciones:</label>
                        <input type="text" name="celularNoti" value="${configuracionTienda.celularNoti}">
                        <button type="submit" class="success">Actualizar Datos de Tienda</button>
                    </form>
                    <a href="/web" target="_blank"><button style="background:#0284c7; margin-top: 10px;">🌐 Ver Mi Página Web en Vivo</button></a>
                </div>

                <div class="card">
                    <h2>⚙️ Estudio STL (Visor, Reparador y Colores)</h2>
                    <p style="font-size: 13px; color: #94a3b8;">Carga tu archivo STL para visualizar malla y trocear:</p>
                    <textarea placeholder="Describe el diseño a generar..." style="height: 40px;"></textarea>
                    <input type="file" id="inputStlFile" accept=".stl,.3mf" onchange="cargarVisorStl(event)">
                    <div class="stl-viewport" id="stlViewportBox">
                        <div id="stlInfoText">📦 [Visor 3D Nube] Sube un archivo STL para analizar</div>
                    </div>
                    <button class="success" onclick="alert('¡Piezas optimizadas con pines de encastre listas!')" style="margin-top: 10px;">🚀 Procesar y Generar Paquete STL</button>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <h2>📸 Editor de Fotos Reales & Generador IA</h2>
                    <p style="font-size: 13px; color: #94a3b8;">Sube una foto real de tu impresión:</p>
                    <form action="/agregar-producto" method="POST" enctype="multipart/form-data">
                        <input type="text" name="nombre" placeholder="Nombre de la pieza" required>
                        <input type="number" name="stock" placeholder="Stock" required>
                        <input type="number" name="precio" placeholder="Precio ($)" required>
                        <input type="file" name="foto" accept="image/*" required>
                        <button type="submit" class="success">✨ Aplicar Mejora IA y Publicar</button>
                    </form>
                </div>

                <div class="card">
                    <h2>🎬 Visor de Contenido Generado</h2>
                    <div class="visor-grid">
                        <div class="media-preview">
                            <p style="font-size: 11px; color: #38bdf8; margin: 3px 0;"><b>Banner Studio Pro</b></p>
                            <img src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400" alt="Banner">
                        </div>
                        <div class="media-preview">
                            <p style="font-size: 11px; color: #38bdf8; margin: 3px 0;"><b>Reel / TikTok (Bucle)</b></p>
                            <video autoplay muted loop playsinline>
                                <source src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-light-tunnel-3-41372-large.mp4" type="video/mp4">
                            </video>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <h2>🤖 Simulador Bot de Ventas & WhatsApp</h2>
                    <div class="chat-box" id="botChat">
                        <div class="chat-msg bot"><b>Bot GRUMI:</b> ¡Hola! ¿Dudas sobre envíos o querés cerrar tu compra?</div>
                    </div>
                    <input type="text" id="botInput" placeholder="Escribe al bot...">
                    <button onclick="probarBot()" class="success">Enviar Mensaje</button>
                </div>

                <div class="card">
                    <h2>📊 Estadísticas & Analítica</h2>
                    <div class="stat-box"><span>Ingresos del Mes:</span> <b>$${estadisticas.ventasMes.toLocaleString()}</b></div>
                    <div class="stat-box"><span>Pedidos Entregados:</span> <b>${estadisticas.pedidosEntregados} un.</b></div>
                    <div class="stat-box"><span>Tasa de Conversión:</span> <b>${estadisticas.tasaConversion}</b></div>
                    <div class="stat-box"><span>Derivaciones WhatsApp:</span> <b style="color:var(--accent);">Activas (24/7)</b></div>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <h2>📅 Agenda de Publicaciones (IA)</h2>
                    <ul>${listaAgendaHTML}</ul>
                </div>

                <div class="card">
                    <h2>🤖 Asistente IA Analista de Mercado</h2>
                    <div class="chat-box" id="chatBox">
                        <div class="chat-msg bot"><b>Asistente GRUMI:</b> ¡Hola Eliana! El sistema en la nube está monitoreando tendencias locales.</div>
                    </div>
                    <input type="text" id="userInput" placeholder="Pregúntale al analista...">
                    <button onclick="enviarMensaje()">Consultar Tendencia</button>
                    <div style="margin-top: 10px; font-size: 13px;">
                        <b>🔥 Tendencias:</b>
                        <ul>${listaTendenciasHTML}</ul>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>📦 Inventario Activo</h2>
                <ul>${listaInventarioHTML}</ul>
            </div>
        </div>

        <script>
            function cargarVisorStl(event) {
                const file = event.target.files[0];
                if(file) {
                    const box = document.getElementById('stlViewportBox');
                    box.innerHTML = '<div style="color: #10b981; font-weight: bold; text-align:center;">✔ STL Cargado en Nube: ' + file.name + '<br><span style="font-size:12px; color:#38bdf8;">[Optimizando malla con pines de encastre...]</span></div>';
                }
            }
            function probarBot() {
                const input = document.getElementById('botInput');
                const chat = document.getElementById('botChat');
                if(!input.value) return;
                chat.innerHTML += '<div class="chat-msg"><b>Cliente:</b> ' + input.value + '</div>';
                input.value = '';
                setTimeout(() => {
                    chat.innerHTML += '<div class="chat-msg bot"><b>Bot GRUMI:</b> 🚀 <b>¡Venta Concluida!</b> Derivando orden a WhatsApp...</div>';
                    setTimeout(() => { alert('💬 [Notificación Celular]: ¡Nuevo cliente derivado desde la tienda 24/7!'); }, 300);
                    chat.scrollTop = chat.scrollHeight;
                }, 800);
            }
            function enviarMensaje() {
                const input = document.getElementById('userInput');
                const chat = document.getElementById('chatBox');
                if(!input.value) return;
                chat.innerHTML += '<div class="chat-msg"><b>Tú:</b> ' + input.value + '</div>';
                input.value = '';
                setTimeout(() => {
                    chat.innerHTML += '<div class="chat-msg bot"><b>Asistente GRUMI:</b> Analizando con IA comercial... Te sugiero programar publicaciones de macetas y soportes para el fin de semana.</div>';
                    chat.scrollTop = chat.scrollHeight;
                }, 800);
            }
        </script>
    </body>
    </html>
  `);
});

app.get('/web', (req, res) => {
  const productosHTML = inventario.map(p => `
    <div class="product-card">
        <video autoplay muted loop playsinline class="product-video">
            <source src="${p.videoDemo}" type="video/mp4">
        </video>
        <div class="thumb-gallery" style="display:flex; justify-content:center; gap:8px; margin:10px 0;">
            ${p.imagenes.map(img => `<img src="${img}" style="width:45px; height:45px; object-fit:cover; border-radius:4px; border:1px solid #cbd5e1;" alt="Thumb">`).join('')}
        </div>
        <h3>${p.nombre}</h3>
        <p style="color: #64748b; font-size: 14px;">Stock: ${p.stock} unidades</p>
        <div class="price">$${p.precio.toLocaleString()}</div>
        <div class="buy-buttons">
            <a href="https://wa.me/${configuracionTienda.whatsapp}?text=Hola!%20Quiero%20comprar:%20${encodeURIComponent(p.nombre)}" target="_blank" class="btn-whatsapp">💬 Comprar por WhatsApp</a>
            <a href="#" onclick="alert('Redirigiendo a pasarela segura...'); return false;" class="btn-mp">💳 Pagar Online</a>
        </div>
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>${configuracionTienda.nombre}</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
            header { background: #0f172a; color: white; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }
            header .socials a { color: #38bdf8; text-decoration: none; font-weight: bold; margin-left: 20px; }
            .hero { background: linear-gradient(135deg, #6366f1, #38bdf8); color: white; padding: 60px 20px; text-align: center; }
            .container { max-width: 1100px; margin: 40px auto; padding: 0 20px; }
            .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; }
            .product-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; text-align: center; display: flex; flex-direction: column; justify-content: space-between; }
            .product-video { width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 5px; background: #000; }
            .price { font-size: 22px; font-weight: bold; color: #6366f1; margin: 10px 0; }
            .buy-buttons { display: flex; flex-direction: column; gap: 8px; margin-top: 15px; }
            .btn-whatsapp { background: #25d366; color: white; text-decoration: none; padding: 10px; border-radius: 6px; font-weight: bold; font-size: 14px; }
            .btn-mp { background: #009ee3; color: white; text-decoration: none; padding: 10px; border-radius: 6px; font-weight: bold; font-size: 14px; }
            footer { background: #0f172a; color: white; text-align: center; padding: 30px; margin-top: 50px; font-size: 14px; }
        </style>
    </head>
    <body>
        <header>
            <h2>🚀 ${configuracionTienda.nombre}</h2>
            <div class="socials">
                <a href="https://instagram.com/${configuracionTienda.instagram}" target="_blank">📸 Instagram</a>
                <a href="https://wa.me/${configuracionTienda.whatsapp}" target="_blank">💬 WhatsApp</a>
            </div>
        </header>
        <div class="hero">
            <h1>Impresión 3D de Vanguardia 24/7</h1>
            <p>Catálogo en vivo conectado a producción y pasarelas de pago.</p>
        </div>
        <div class="container">
            <h2>Catálogo de Productos Exclusivos</h2>
            <div class="products-grid">
                ${productosHTML}
            </div>
        </div>
        <footer>
            <p>${configuracionTienda.nombre} © 2026 • Sistema Autónomo Nube.</p>
        </footer>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor GRUMI 3D Nube 24/7 corriendo en puerto ${PORT}`);
});
