const icons = {
  menu: '<path d="M5 8h14M5 16h14"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  arrow: '<path d="m9 18 6-6-6-6"/>',
  wifi: '<path d="M5 12.5a10.5 10.5 0 0 1 14 0M8 16a6 6 0 0 1 8 0M11 19.5a1.5 1.5 0 0 1 2 0"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  home: '<path d="m3 11 9-7 9 7M5 10v10h14V10M9 20v-6h6v6"/>',
  phone: '<path d="M8 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-3l-4-1-2 2c-3.7-1.6-6.4-4.3-8-8l2-2-1-4Z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.5 2.1c-.8.5-1.3.9-1.3 2.1M12 17h.01"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
  alert: '<path d="M10.2 4.2 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.8 4.2a2 2 0 0 0-3.6 0Z"/><path d="M12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  utensils: '<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M16 3v18M16 3c3 2 4 6 0 10"/>',
  beach: '<path d="M3 17c3-2 6-2 9 0s6 2 9 0M5 13 12 4l7 9H5ZM12 4v13"/>',
};
function renderIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.dataset.icon;
    el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.info}</svg>`;
  });
}
const suiteNumbers = [7,8,9,11,12,13,14,15,16,17,18,19,20];
const villas = ['A','B','C','1','2','3'];
const units = [
  { id: 'suites-1-6', label: 'Suites 1–6', group: 'Suites' },
  ...suiteNumbers.map(n => ({ id: `suite-${n}`, label: `Suite ${n}`, group: 'Suites' })),
  ...villas.map(n => ({ id: `villa-${n}`, label: `Villa ${n}`, group: 'Villas' })),
  { id: 'ph', label: 'PH', group: 'Penthouse' }
];
const DEFAULT_WIFI_PASSWORD = 'C@saconsuel0';
const villaPasswords = {
  'villa-A': DEFAULT_WIFI_PASSWORD,
  'villa-B': DEFAULT_WIFI_PASSWORD,
  'villa-C': 'Villa1CC',
  'villa-1': 'Villa1CC',
  'villa-2': 'Villa2CC',
  'villa-3': 'Villa3CC'
};
const wifiByUnit = Object.fromEntries(units.map(u => [u.id, {
  ssid: ({ 'suites-1-6': 'CC HALL N2' })[u.id] || '',
  password: villaPasswords[u.id] || DEFAULT_WIFI_PASSWORD
}]));
function chipHtml(unit) {
  return `<button class="suite-chip" type="button" data-unit="${unit.id}">${unit.label.replace(/^Suites? |^Villa /, '')}</button>`;
}
function wifiSheetHtml() {
  const suites = units.filter(u => u.group === 'Suites').map(chipHtml).join('');
  const villasHtml = units.filter(u => u.group === 'Villas').map(chipHtml).join('');
  return `
    <p>Elige tu suite o villa para ver la red que te corresponde.</p>
    <div class="suite-groups">
      <div class="suite-group"><strong>Suites</strong><div class="suite-chips">${suites}</div></div>
      <div class="suite-group"><strong>Villas</strong><div class="suite-chips">${villasHtml}</div></div>
    </div>
    <div class="wifi-result" id="wifiResult" hidden>
      <div class="data-row"><strong>Unidad</strong><small id="wifiUnitLabel"></small></div>
      <div class="data-row copy-row"><div><strong>Nombre de la red</strong><small id="wifiSsid"></small></div><button type="button" data-copy="ssid">Copiar</button></div>
      <div class="data-row copy-row"><div><strong>Contraseña</strong><small id="wifiPass"></small></div><button type="button" data-copy="password">Copiar</button></div>
    </div>`;
}
const sheets = {
  wifi: { icon: 'wifi', kicker: 'Conéctate', title: 'Wi‑Fi', html: wifiSheetHtml() },
  arrival: {
    icon: 'clock', kicker: 'Tu estancia', title: 'Llegada y salida', html: `
      <p>Estos son los horarios de tu estancia. Si necesitas flexibilidad, escríbenos con anticipación.</p>
      <div class="data-row"><strong>Hora de llegada</strong><small>3:00 p.m.</small></div>
      <div class="data-row"><strong>Hora de salida</strong><small>11:00 a.m.</small></div>
      <div class="data-row"><strong>Instrucciones de acceso</strong><small>Al llegar, alguien del equipo te recibe y te acompaña a tu suite.</small></div>
      <div class="data-row"><strong>Salida</strong><small>Por favor avísanos cuando vayas a salir para hacer la revisión de inventario y que nos regreses las llaves.</small></div>`
  },
  rules: {
    icon: 'home', kicker: 'Convivencia', title: 'Reglamento de la casa', html: `
      <p>Notas para estancias cortas. Queremos que todas las personas disfruten un ambiente tranquilo y agradable.</p>
      <div class="data-row"><strong>Horarios</strong><small>Llegada 3:00 p.m. · Salida 11:00 a.m.</small></div>
      <div class="data-row"><strong>Alberca</strong><small>Horario de 8:00 a.m. a 9:00 p.m.<br>Los menores deben estar acompañados de un adulto siempre.<br>Prohibido usar envases de vidrio y comer alrededor de la alberca.</small></div>
      <div class="data-row"><strong>Horario de áreas comunes</strong><small>De 8:00 a.m. a 11:00 p.m.</small></div>
      <div class="data-row"><strong>Acceso</strong><small>Mantén siempre cerrada la puerta de la calle, y con llave después de las 8:00 p.m.</small></div>
      <div class="data-row"><strong>Mascotas</strong><small>No se permiten mascotas.</small></div>
      <div class="data-row"><strong>Ruido</strong><small>Se prohíbe el uso de bocinas en áreas comunes.</small></div>
      <div class="data-row"><strong>Fumar</strong><small>Prohibido fumar dentro del complejo.</small></div>
      <div class="data-row"><strong>Persona extra</strong><small>Sin previo aviso: costo adicional de $750 por noche.</small></div>
      <div class="data-row"><strong>Daños</strong><small>Cualquier daño a instalaciones, mobiliario, toallas, ropa de cama o zonas comunes deberá cubrirlo el huésped.</small></div>
      <div class="data-row"><strong>Pago</strong><small>El pago no es reembolsable ni transferible.</small></div>
      <div class="data-row"><strong>Fechas y suites</strong><small>Las fechas y el número mínimo de suites del contrato deben cumplirse; de lo contrario puede aplicarse una penalidad.</small></div>
      <div class="data-row"><strong>Incumplimiento</strong><small>Nos reservamos el derecho de terminar o denegar la estancia si se viola el reglamento.</small></div>`
  },
  eat: {
    icon: 'utensils', kicker: 'Sabores locales', title: 'Dónde comer', html: `
      <p>Recomendaciones de la casa, cerca de ti en Rincón de Guayabitos.</p>
      <div class="data-row featured"><strong>Buonissimo Gelato &amp; Café</strong><small>Hay crepas, waffles y smoothies. Pedidos por WhatsApp; anticipa 35 min.</small><a href="https://wa.me/523222102354">322-210-2354</a></div>
      <div class="data-row"><strong>Pineda</strong><small>Buen lugar de mariscos, con una bonita vista de toda la bahía.</small><a class="row-phone" href="https://www.google.com/maps/search/?api=1&query=Restaurante+Pineda+Carr.+a+Los+Ayala+5+Rinc%C3%B3n+de+Guayabitos+63724" target="_blank" rel="noreferrer">Carr. a Los Ayala 5, Centro, CP 63724</a></div>
      <div class="data-row"><strong>Buhardilla</strong><small>Ideal para cenar: un lugar agradable, con buen ambiente y un toque especial.</small><a class="row-phone" href="https://www.google.com/maps/search/?api=1&query=Buhardilla+Retorno+Jacarandas+4+Rinc%C3%B3n+de+Guayabitos+63724" target="_blank" rel="noreferrer">Rtno. Jacarandas 4, CP 63724</a></div>
      <div class="data-row"><strong>Mariscos Chabe</strong><small>Entregan a domicilio. Ideal para ceviches y aguachiles.</small><a class="row-phone" href="tel:+523222305953">322-230-5953</a></div>
      <div class="data-row"><strong>Mariscos El Compa Félix</strong><small>Mariscos estilo Nayarit. Su especialidad es el vaso marisquero.</small><a class="row-phone" href="https://maps.app.goo.gl/rTvzLQe1xVzfgcnq8" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>Cevichería Coral</strong><small>Ideal para pedir ceviches a domicilio, por medio o kilo.</small><a class="row-phone" href="tel:+523271053962">327-105-3962</a></div>
      <div class="data-row"><strong>Hanami Sushi</strong><small>Buen sushi para comer ahí o pedir a domicilio.</small><a class="row-phone" href="https://share.google/rHHzfinMlFgo2iTDn" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>YESI</strong><small>Un lugar muy agradable para desayunar.</small><a class="row-phone" href="https://www.google.com/maps/search/?api=1&query=Restaurant+Yesi+Grill+Emiliano+Zapata+25+La+Pe%C3%B1ita+de+Jaltemba+63720" target="_blank" rel="noreferrer">Emiliano Zapata 25, Centro, La Peñita de Jaltemba, CP 63720</a></div>
      <div class="data-row"><strong>ALOHA</strong><small>Pizza y grill.</small></div>
      <div class="data-row"><strong>Mona Lisa</strong><small>Pizzas, en Sol Nuevo.</small></div>`
  },
  visit: {
    icon: 'beach', kicker: 'Explora', title: 'Qué visitar', html: `
      <p>Planes cercanos recomendados por la casa.</p>
      <div class="data-row"><strong>Playa Guayabitos · zona residencial</strong><small>La parte más tranquila de Guayabitos, sin ruido. Ideal para caminar y nadar con calma.</small><a class="row-phone" href="https://maps.app.goo.gl/Jpr5ntzbSsvfURUw9" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>Playa Fríderas</strong><small>Playa recomendada cerca de Guayabitos.</small><a class="row-phone" href="https://maps.app.goo.gl/q6kGiXe8Jg9ihpHq7" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>Hike Playa del Toro</strong><small>Caminata hacia la playa del Toro.</small><a class="row-phone" href="https://loc.wiki/t/238742085?wa=sc" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>Chacala</strong><small>Pueblo y playa cercanos, perfectos para una salida corta.</small><a class="row-phone" href="https://maps.app.goo.gl/CphYW7ufBAfKfdHo6" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>Lo de Marcos</strong><small>Destino cercano para explorar la costa.</small><a class="row-phone" href="https://maps.app.goo.gl/zWvqGkRqr1uPNrPLA" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>Playa Los Venados</strong><small>Playa recomendada cerca de Guayabitos.</small><a class="row-phone" href="https://maps.app.goo.gl/7iwpXzpasXWptBfd7" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>Platanitos</strong><small>Playa recomendada para una escapada.</small><a class="row-phone" href="https://maps.app.goo.gl/bGiFoxjsgm4wD1fS6" target="_blank" rel="noreferrer">Ver ubicación</a></div>`
  },
  beachclubs: {
    icon: 'beach', kicker: 'Sol y mar', title: 'Beach Clubs', html: `
      <p>Nuestros beach clubs recomendados en la zona.</p>
      <div class="data-row"><strong>Guayami Vice</strong><small>Beach club recomendado.</small><a class="row-phone" href="https://share.google/yb7CZir0Q1l9KlbZb" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>Victor's Beach Club</strong><small>Ambiente local.</small><a class="row-phone" href="https://share.google/AtYJjejCIyZiUo4IK" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>El Barracuda</strong><small>A 40 min. Ideal si buscas algo diferente y para una escapada de todo el día con buena comida.</small><a class="row-phone" href="https://share.google/m1SprRMkTbfslIXu8" target="_blank" rel="noreferrer">Ver ubicación</a></div>`
  },
  spaces: {
    icon: 'home', kicker: 'La casa', title: 'Nuestros espacios', html: `
      <p>Arquitectura contemporánea, jardines tropicales, alberca y suites para descansar con calma.</p>
      <div class="data-row"><strong>Información de alberca y áreas comunes</strong><small><span class="pending">Por confirmar</span></small></div>`
  },
  faq: {
    icon: 'help', kicker: 'Ayuda rápida', title: 'Preguntas frecuentes', html: `
      <div class="faq-item"><strong>¿Cuál es la clave de Wi‑Fi?</strong><span>Elige tu suite en la sección Wi‑Fi. Casi todas usan la misma clave; las villas pueden variar.</span></div>
      <div class="faq-item"><strong>¿A qué hora es la llegada y la salida?</strong><span>Llegada 3:00 p.m. · Salida 11:00 a.m. Al llegar, alguien del equipo te recibe.</span></div>
      <div class="faq-item"><strong>¿Se permiten mascotas?</strong><span>No se permiten mascotas.</span></div>
      <div class="faq-item"><strong>¿Puedo fumar o usar bocinas?</strong><span>Prohibido fumar en el complejo y usar bocinas en áreas comunes.</span></div>
      <div class="faq-item"><strong>¿Hay taxi de confianza?</strong><span>Tony Taxi (habla inglés): <a href="https://wa.me/523221099223">322 109 9223</a></span></div>
      <div class="faq-item"><strong>¿Puedo pedir comida a domicilio?</strong><span>Buonissimo Gelato &amp; Café: WhatsApp <a href="https://wa.me/528120027975">812 002 7975</a> (pide con 35 min de anticipación). Ceviche Coral: <a href="tel:+523271053962">327 105 3962</a>.</span></div>
      <div class="faq-item"><strong>¿Dónde hay un médico cercano?</strong><span>Dr. Edgar Guzmán en La Peñita, WhatsApp <a href="https://wa.me/523221175855">322 117 5855</a>. Para emergencias graves, ve a un hospital grande.</span></div>
      <div class="faq-item"><strong>¿Cómo contacto a la casa?</strong><span>La Casa: <a href="tel:+523222102354">322 210 2354</a>. Adriana: <a href="https://wa.me/528120027975">812 002 7975</a>.</span></div>`
  },
  map: {
    icon: 'map', kicker: 'Ubicación', title: 'Cómo llegar', html: `
      <p>La Casa de Consuelo está en Av. Sol Nuevo 86, Rincón de Guayabitos, a una cuadra de la playa y la zona gastronómica.</p>
      <div class="sheet-actions"><a target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=Av.+Sol+Nuevo+86%2C+Rinc%C3%B3n+de+Guayabitos">Abrir en mapas</a></div>`
  },
  emergency: {
    icon: 'alert', kicker: 'Ayuda rápida', title: 'Emergencias', html: `
      <p>Guarda estos contactos. En una emergencia grave, llama al 911 o ve a un hospital grande.</p>
      <div class="data-row featured"><strong>Hospital La Joya · La Peñita</strong><small>El más cercano. También puedes pedir ambulancia.</small><a href="tel:+523271070508">327 107 0508</a></div>
      <div class="data-row"><strong>Equipo de La Casa</strong><small>Raúl · <a href="tel:+523222151717">322 215 1717</a><br>Alan · <a href="tel:+523223705126">322 370 5126</a><br>Adriana · <a href="tel:+528120027975">812 002 7975</a></small></div>
      <div class="data-row"><strong>911</strong><small>Emergencias nacionales</small></div>
      <div class="data-row"><strong>Bomberos Guayabitos</strong><small><a href="tel:+523272743578">327 274 3578</a></small></div>
      <div class="data-row"><strong>Policía</strong><small><a href="tel:+523276901160">327 690 1160</a> · <a href="tel:+523113161090">311 316 1090</a></small></div>
      <div class="data-row"><strong>Dr. Edgar Guzmán · La Peñita</strong><small>Consultorio privado. WhatsApp <a href="https://wa.me/523221175855">322 117 5855</a><br>Vasco de Gama #12 A</small></div>
      <div class="data-row"><strong>Hospitales en Bucerías</strong><small>CMQ Riviera Nayarit · <a href="tel:+523292980717">329 298 0717</a></small></div>
      <div class="data-row"><strong>Hospitales en Puerto Vallarta</strong><small>La Joya · <a href="tel:+523222261010">322 226 1010</a><br>CMQ Centro · <a href="tel:+523222231173">322 223 1173</a><br>Hospiten · <a href="tel:+523222262080">322 226 2080</a></small></div>
      <div class="data-row"><strong>La Casa de Consuelo</strong><small><a href="tel:+523222102354">322 210 2354</a></small></div>
      <div class="sheet-actions"><a href="tel:911">Llamar al 911</a><a class="secondary" href="tel:+523222102354">Llamar a La Casa</a></div>`
  },
  menu: {
    icon: 'compass', kicker: 'Tu guía', title: '¿Qué necesitas?', html: `
      <div class="data-row"><strong>Wi‑Fi</strong><small>Elige tu suite y consulta la red.</small></div>
      <div class="data-row"><strong>Llegada, salida y reglamento</strong><small>Todo para una estancia tranquila.</small></div>
      <div class="data-row"><strong>Explorar y comer</strong><small>Recomendaciones locales, próximamente.</small></div>
      <div class="sheet-actions"><a href="tel:+523222102354">Contactar</a></div>`
  }
};
const layer = document.querySelector('#sheetLayer');
const sheetTitle = document.querySelector('#sheetTitle');
const sheetKicker = document.querySelector('#sheetKicker');
const sheetContent = document.querySelector('#sheetContent');
const sheetIcon = document.querySelector('#sheetIcon');
let lastTrigger = null;
let selectedUnit = null;
function pending(text) {
  return text === 'Por confirmar' ? `<span class="pending">${text}</span>` : text;
}
function selectUnit(unitId) {
  selectedUnit = units.find(u => u.id === unitId);
  if (!selectedUnit) return;
  sheetContent.querySelectorAll('.suite-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.unit === unitId);
  });
  const data = wifiByUnit[unitId];
  const result = sheetContent.querySelector('#wifiResult');
  result.hidden = false;
  sheetContent.querySelector('#wifiUnitLabel').textContent = selectedUnit.label;
  sheetContent.querySelector('#wifiSsid').innerHTML = pending(data.ssid);
  sheetContent.querySelector('#wifiSsid').closest('.data-row').hidden = !data.ssid;
  sheetContent.querySelector('#wifiPass').innerHTML = pending(data.password);
}
function bindWifiSheet() {
  sheetContent.querySelectorAll('[data-unit]').forEach(btn => {
    btn.addEventListener('click', () => selectUnit(btn.dataset.unit));
  });
  sheetContent.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!selectedUnit) return;
      const data = wifiByUnit[selectedUnit.id];
      const value = btn.dataset.copy === 'ssid' ? data.ssid : data.password;
      if (value === 'Por confirmar') return;
      try {
        await navigator.clipboard.writeText(value);
        btn.textContent = 'Copiado';
        setTimeout(() => { btn.textContent = 'Copiar'; }, 1200);
      } catch (_) {}
    });
  });
}
function openSheet(name, trigger) {
  const item = sheets[name];
  if (!item) return;
  lastTrigger = trigger;
  sheetTitle.textContent = item.title;
  sheetKicker.textContent = item.kicker;
  sheetContent.innerHTML = typeof item.html === 'function' ? item.html() : item.html;
  sheetIcon.dataset.icon = item.icon;
  renderIcons(layer);
  if (name === 'wifi') bindWifiSheet();
  layer.classList.add('open');
  layer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('sheet-open');
  setTimeout(() => document.querySelector('.sheet-close').focus(), 80);
}
function closeSheet() {
  layer.classList.remove('open');
  layer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('sheet-open');
  if (lastTrigger) lastTrigger.focus();
}
document.querySelectorAll('[data-open]').forEach(el => el.addEventListener('click', () => openSheet(el.dataset.open, el)));
document.querySelector('.sheet-close').addEventListener('click', closeSheet);
document.querySelector('.sheet-backdrop').addEventListener('click', closeSheet);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && layer.classList.contains('open')) closeSheet(); });
document.querySelectorAll('.bottom-nav a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  document.querySelectorAll('.bottom-nav a').forEach(item => item.classList.remove('active'));
  link.classList.add('active');
}));
renderIcons();
