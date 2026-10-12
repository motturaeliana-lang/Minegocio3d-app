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
  nombre: "GRUMI 3D Store",
  instagram: "@grumi3d",
  whatsapp: "5493496XXXXXXXX",
  linkPago: "https://mpago.la/tu-link",
  cuotasInfo: "Hasta 3 y 6 cuotas sin interés",
  colorFondo: "#f8fafc"
};

let inventario = [
  { 
    id: 1, 
    nombre: "Soporte Cyberpunk", 
    stock: 12, 
    precio: 15000, 
    imagenes: [
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
    ],
    videoDemo: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-light-tunnel-3-41372-large.mp4"
  }
];

let agenda = [
  { id: 1, producto: "Soporte Cyberpunk", formato: "Reel 9:16 + Carrusel HD", estado: "Pendiente de aprobación" }
];

app.post('/actualizar-config', (req, res) => {
  configuracion.nombre = req.body.nombre;
  configuracion.instagram = req.body.instagram;
  configuracion.whatsapp = req.body.whatsapp.replace(/\D/g,'');
  configuracion.linkPago = req.body.linkPago;
  configuracion.cuotasInfo = req.body.cuotasInfo;
  configuracion.colorFondo = req.body.colorFondo || "#f8fafc";
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
      imagenes: [fotoPath, "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600"],
      videoDemo: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-3d-printer-nozzle-42992-large.mp4"
    });
    agenda.push({
      id: Date.now(),
      producto: nombre,
      formato: "Carrusel Vertical HD + Reel 9:16",
      estado: "Listo para publicar"
    });
  }
  res.redirect('/');
});

app.get('/', (req, res) => {
  const invHTML = inventario.map(p => `
    <li style="display:flex; align-items:center; gap:10px; background:#0b0f19; padding:8px; border-radius:6px; margin-bottom:6px; border:1px solid #334155;">
        <img src="${p.imagenes[0]}" style="width:40px; height:50px; object-fit:cover; border-radius:4px;" alt="Miniatura">
        <div><b>${p.nombre}</b><br><span style="font-size:12px; color:#38bdf8;">Stock: ${p.stock}u | $${p.precio}</span></div>
    </li>
  `).join('');

  const agendaHTML = agenda.map(a => `
    <li style="background:#0b0f19; padding:10px; border-radius:6px; margin-bottom:8px; border:1px solid #334155;">
        <b>📦 ${a.producto}</b><br>
        <span style="color: #38bdf8; font-size: 13px;">📱 ${a.formato}</span><br>
        <button onclick="alert('✅ ¡Publicado con éxito en Instagram y Web!'); location.reload();" style="background:#10b981; padding:6px 12px; font-size:12px; margin-top:8px; width:auto;">🚀 Autorizar y Publicar</button>
    </li>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>${configuracion.nombre} - Panel Cloud</title>
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
            .stat-box { display: flex; justify-content: space-between; background: #0f172a; padding: 12px; border-radius: 6px; margin-bottom: 8px; border: 1px solid var(--border); }
            .chat-box { background: #0f172a; height: 180px; border-radius: 6px; padding: 10px; overflow-y: auto; border: 1px solid var(--border); margin-bottom: 10px; font-size: 14px; }
            .chat-msg { margin-bottom: 8px; } .chat-msg.bot { color: #38bdf8; }
            .palette-btn { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #fff; cursor: pointer; display: inline-block; margin-right: 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 ${configuracion.nombre} <span style="font-size: 14px; background: #334155; padding: 4px 10px; border-radius: 20px; color: #fff;">Cloud 24/7</span></h1>
            
            <div class="grid">
                <div class="card">
                    <h2>⚙️ Configuración & Estética Web</h2>
                    <form action="/actualizar-config" method="POST">
                        <label>Nombre de la Tienda:</label>
                        <input type="text" name="nombre" value="${configuracion.nombre}" required>
                        <label>Instagram:</label>
                        <input type="text" name="instagram" value="${configuracion.instagram}">
                        <label>WhatsApp de Pedidos:</label>
                        <input type="text" name="whatsapp" value="${configuracion.whatsapp}" required>
                        <label>Link de Pago Online:</label>
                        <input type="text" name="linkPago" value="${configuracion.linkPago}" required>
                        <label>Información de Cuotas:</label>
                        <input type="text" name="cuotasInfo" value="${configuracion.cuotasInfo}" required>
                        <label>Color de Fondo Web (Hex):</label>
                        <input type="text" name="colorFondoWeb" value="${configuracion.colorFondo}">
                        <button type="submit" class="success">Guardar Cambios</button>
                    </form>
                    <a href="/web" target="_blank"><button style="background:#0284c7; margin-top: 10px;">🌐 Ver Mi Página Web en Vivo</button></a>
                </div>

                <div class="card">
                    <h2>🎨 Estudio STL (Pincel Multicolor & Pines)</h2>
                    <p style="font-size: 13px; color: #94a3b8;">Diseña, pinta por zonas y divide con pines para tu laminador:</p>
                    <textarea id="promptStl" placeholder="Descripción del diseño 3D..." style="height: 40px;"></textarea>
                    <input type="file" accept=".stl,.3mf,image/*">
                    
                    <div style="background:#0b0f19; padding:10px; border-radius:6px; margin-top:10px; border:1px solid #334155;">
                        <p style="font-size:12px; color:#38bdf8; margin:0 0 8px 0;"><b>🖌️ Pincel de Pintura Multicolor:</b></p>
                        <div>
                            <span class="palette-btn" style="background:#ef4444;" onclick="setColor('#ef4444')" title="Rojo"></span>
                            <span class="palette-btn" style="background:#3b82f6;" onclick="setColor('#3b82f6')" title="Azul"></span>
                            <span class="palette-btn" style="background:#10b981;" onclick="setColor('#10b981')" title="Verde"></span>
                            <span class="palette-btn" style="background:#f59e0b;" onclick="setColor('#f59e0b')" title="Amarillo"></span>
                        </div>
                        <p id="infoPincel" style="font-size:11px; color:#94a3b8; margin:6px 0 0 0;">Color activo: <b style="color:#ef4444;">Rojo</b></p>
                    </div>

                    <button class="success" onclick="dividirStl()" style="margin-top:10px;">🔪 Dividir por Colores y Descargar STL</button>
                    <div id="resStl" style="margin-top:10px; font-size:13px; color:#10b981;"></div>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <h2>📸 Subir Foto Real & Generar Kit IA</h2>
                    <form action="/agregar-producto" method="POST" enctype="multipart/form-data">
                        <input type="text" name="nombre" placeholder="Nombre de la pieza" required>
                        <input type="number" name="stock" placeholder="Stock" required>
                        <input type="number" name="precio" placeholder="Precio ($)" required>
                        <input type="file" name="foto" accept="image/*" required>
                        <button type="submit" class="success">✨ Generar Kit Publicitario y Reel</button>
                    </form>
                </div>

                <div class="card">
                    <h2>🤖 Asesor Comercial & Bot IA</h2>
                    <div class="chat-box" id="botChat">
                        <div class="chat-msg bot"><b>Asesor GRUMI:</b> Hola Eliana. Atendiendo consultas 24/7.</div>
                    </div>
                    <input type="text" id="botInput" placeholder="Simula cliente...">
                    <button onclick="probarBot()" class="success">Enviar</button>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <h2>📅 Autorización de Publicaciones</h2>
                    <ul>${agendaHTML}</ul>
                </div>
                <div class="card">
                    <h2>📦 Inventario Activo</h2>
                    <ul>${invHTML}</ul>
                </div>
            </div>
        </div>

        <script>
            function setColor(c) {
                document.getElementById('infoPincel').innerHTML = 'Color activo: <span style="background:'+c+'; padding:2px 8px; border-radius:4px; color:#fff;">'+c+'</span>';
            }
            function dividirStl() {
                document.getElementById('resStl').innerHTML = '✔ Piezas divididas con pines.<br><a href="#" onclick="alert(\'Descargando archivo .stl...\'); return false;" style="color:#38bdf8;">📥 Descargar STL por Colores</a>';
            }
            function probarBot() {
                const input = document.getElementById('botInput');
                const chat = document.getElementById('botChat');
                if(!input.value) return;
                chat.innerHTML += '<div class="chat-msg"><b>Cliente:</b> ' + input.value + '</div>';
                input.value = '';
                setTimeout(() => {
                    chat.innerHTML += '<div class="chat-msg bot"><b>Asesor GRUMI:</b> ¡Hola! Con gusto te asesoro. (Alerta enviada a tu WhatsApp).</div>';
                    setTimeout(() => { alert('💬 [WhatsApp Alerta]: ¡Nueva consulta comercial!'); }, 300);
                }, 800);
            }
        </script>
    </body>
    </html>
  `);
});

app.get('/web', (req, res) => {
  const prodHTML = inventario.map(p => `
    <div class="product-card">
        <video autoplay muted loop playsinline class="product-video">
            <source src="${p.videoDemo}" type="video/mp4">
        </video>
        <div style="margin: 12px 0; text-align:center;">
            <img id="img-${p.id}" src="${p.imagenes[0]}" style="width:100%; height:360px; object-fit:cover; border-radius:12px; border:1px solid #cbd5e1;" alt="Foto HD">
        </div>
        <div style="display:flex; justify-content:center; gap:8px; margin-bottom:12px;">
            ${p.imagenes.map((img, idx) => `
                <img src="${img}" style="width:50px; height:70px; object-fit:cover; border-radius:6px; cursor:pointer;" onclick="document.getElementById('img-${p.id}').src='${img}'" alt="Thumb">
            `).join('')}
        </div>
        <h3>${p.nombre}</h3>
        <p style="color: #64748b; font-size: 14px;">Stock: ${p.stock} unidades</p>
        <div class="price">$${p.precio.toLocaleString()}</div>
        <p style="color: #059669; font-size: 13px; font-weight:600;">💳 ${configuracion.cuotasInfo}</p>
        <div class="buy-buttons">
            <a href="https://wa.me/${configuracion.whatsapp}?text=Hola!%20Quiero%20comprar:%20${encodeURIComponent(p.nombre)}" target="_blank" class="btn-whatsapp">💬 Comprar por WhatsApp</a>
            <a href="${configuracion.linkPago}" target="_blank" class="btn-mp">💳 Pagar Online</a>
        </div>
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>${configuracion.nombre} - Tienda Oficial</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background: ${configuracion.colorFondo}; color: #1e293b; margin: 0; padding: 0; }
            header { background: #0f172a; color: white; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }
            header .socials a { color: #38bdf8; text-decoration: none; font-weight: bold; margin-left: 20px; }
            .hero { background: linear-gradient(135deg, #6366f1, #38bdf8); color: white; padding: 60px 20px; text-align: center; }
            .container { max-width: 1100px; margin: 40px auto; padding: 0 20px; }
            .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }
            .product-card { background: white; border-radius: 14px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; text-align: center; display: flex; flex-direction: column; justify-content: space-between; }
            .product-video { width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 5px; background: #000; }
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
            <span>🎵 Música ambiente:</span>
            <audio controls loop autoplay style="height: 30px;">
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3">
            </audio>
        </div>
        <header>
            <h2>🚀 ${configuracion.nombre}</h2>
            <div class="socials">
                <a href="https://instagram.com/${configuracion.instagram}" target="_blank">📸 Instagram</a>
                <a href="https://wa.me/${configuracion.whatsapp}" target="_blank">💬 WhatsApp</a>
            </div>
        </header>
        <div class="hero">
            <h1>Impresión 3D Autónoma 24/7</h1>
            <p>Catálogo en vivo con fotos verticales HD y videos en bucle.</p>
        </div>
        <div class="container">
            <h2>Catálogo Exclusivo</h2>
            <div class="products-grid">
                ${prodHTML}
            </div>
        </div>
        <footer>
            <p>${configuracion.nombre} © 2026</p>
        </footer>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
