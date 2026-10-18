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
const wifiLabels = {
  es: { intro: 'Elige tu suite o villa para ver la red que te corresponde.', unit: 'Unidad', ssid: 'Nombre de la red', password: 'Contraseña', copy: 'Copiar', copied: 'Copiado' },
  en: { intro: 'Choose your suite or villa to see your network.', unit: 'Unit', ssid: 'Network name', password: 'Password', copy: 'Copy', copied: 'Copied' }
};
function wifiSheetHtml(lang = 'es') {
  const L = wifiLabels[lang] || wifiLabels.es;
  const suites = units.filter(u => u.group === 'Suites').map(chipHtml).join('');
  const villasHtml = units.filter(u => u.group === 'Villas').map(chipHtml).join('');
  return `
    <p>${L.intro}</p>
    <div class="suite-groups">
      <div class="suite-group"><strong>Suites</strong><div class="suite-chips">${suites}</div></div>
      <div class="suite-group"><strong>Villas</strong><div class="suite-chips">${villasHtml}</div></div>
    </div>
    <div class="wifi-result" id="wifiResult" hidden>
      <div class="data-row"><strong>${L.unit}</strong><small id="wifiUnitLabel"></small></div>
      <div class="data-row copy-row"><div><strong>${L.ssid}</strong><small id="wifiSsid"></small></div><button type="button" data-copy="ssid">${L.copy}</button></div>
      <div class="data-row copy-row"><div><strong>${L.password}</strong><small id="wifiPass"></small></div><button type="button" data-copy="password">${L.copy}</button></div>
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
      <div class="data-row"><strong>Pineda</strong><small>Buen lugar de mariscos, con una bonita vista de toda la bahía.</small><a class="row-phone" href="https://www.google.com/maps/search/?api=1&query=Restaurante+Pineda+Carr.+a+Los+Ayala+5+Rinc%C3%B3n+de+Guayabitos+63724" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>Buhardilla</strong><small>Ideal para cenar: un lugar agradable, con buen ambiente y un toque especial.</small><a class="row-phone" href="https://www.google.com/maps/search/?api=1&query=Buhardilla+Retorno+Jacarandas+4+Rinc%C3%B3n+de+Guayabitos+63724" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>Mariscos Chabe</strong><small>Entregan a domicilio. Ideal para ceviches y aguachiles.</small><a class="row-phone" href="tel:+523222305953">322-230-5953</a></div>
      <div class="data-row"><strong>Mariscos El Compa Félix</strong><small>Mariscos estilo Nayarit. Su especialidad es el vaso marisquero.</small><a class="row-phone" href="https://maps.app.goo.gl/rTvzLQe1xVzfgcnq8" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>Cevichería Coral</strong><small>Ideal para pedir ceviches a domicilio, por medio o kilo.</small><a class="row-phone" href="tel:+523271053962">327-105-3962</a></div>
      <div class="data-row"><strong>Hanami Sushi</strong><small>Buen sushi para comer ahí o pedir a domicilio.</small><a class="row-phone" href="https://share.google/rHHzfinMlFgo2iTDn" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>YESI</strong><small>Un lugar muy agradable para desayunar.</small><a class="row-phone" href="https://www.google.com/maps/search/?api=1&query=Restaurant+Yesi+Grill+Emiliano+Zapata+25+La+Pe%C3%B1ita+de+Jaltemba+63720" target="_blank" rel="noreferrer">Ver ubicación</a></div>
      <div class="data-row"><strong>ALOHA</strong><small>Pizza y grill.</small><a class="row-phone" href="https://share.google/RkjexoP3aac7IWgFB" target="_blank" rel="noreferrer">Ver ubicación</a></div>
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
  }
};
const layer = document.querySelector('#sheetLayer');
const sheetTitle = document.querySelector('#sheetTitle');
const sheetKicker = document.querySelector('#sheetKicker');
const sheetContent = document.querySelector('#sheetContent');
const sheetIcon = document.querySelector('#sheetIcon');
let lastTrigger = null;
let selectedUnit = null;
let currentSheet = null;
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
        const L = wifiLabels[currentLang] || wifiLabels.es;
        btn.textContent = L.copied;
        setTimeout(() => { btn.textContent = L.copy; }, 1200);
      } catch (_) {}
    });
  });
}
function openSheet(name, trigger) {
  const item = (currentLang === 'en' ? sheetsEn : sheets)[name];
  if (!item) return;
  lastTrigger = trigger;
  currentSheet = name;
  selectedUnit = null;
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
const sheetsEn = {
  wifi: { icon: 'wifi', kicker: 'Get connected', title: 'Wi‑Fi', html: wifiSheetHtml('en') },
  arrival: {
    icon: 'clock', kicker: 'Your stay', title: 'Check-in & check-out', html: `
      <p>Here are the times for your stay. If you need a little flexibility, just message us ahead of time.</p>
      <div class="data-row"><strong>Check-in time</strong><small>3:00 p.m.</small></div>
      <div class="data-row"><strong>Check-out time</strong><small>11:00 a.m.</small></div>
      <div class="data-row"><strong>Arrival instructions</strong><small>When you arrive, someone from our team will welcome you and walk you to your suite.</small></div>
      <div class="data-row"><strong>Check-out</strong><small>Please let us know when you’re heading out so we can do a quick inventory check and collect your keys.</small></div>`
  },
  rules: {
    icon: 'home', kicker: 'Living together', title: 'House rules', html: `
      <p>A few notes for short stays. We want everyone to enjoy a calm, pleasant atmosphere.</p>
      <div class="data-row"><strong>Hours</strong><small>Check-in 3:00 p.m. · Check-out 11:00 a.m.</small></div>
      <div class="data-row"><strong>Pool</strong><small>Open from 8:00 a.m. to 9:00 p.m.<br>Children must be accompanied by an adult at all times.<br>No glass containers and no eating around the pool.</small></div>
      <div class="data-row"><strong>Common area hours</strong><small>From 8:00 a.m. to 11:00 p.m.</small></div>
      <div class="data-row"><strong>Access</strong><small>Please always keep the street door closed, and locked after 8:00 p.m.</small></div>
      <div class="data-row"><strong>Pets</strong><small>Pets are not allowed.</small></div>
      <div class="data-row"><strong>Noise</strong><small>Speakers are not allowed in common areas.</small></div>
      <div class="data-row"><strong>Smoking</strong><small>Smoking is not allowed anywhere on the property.</small></div>
      <div class="data-row"><strong>Extra guests</strong><small>Without prior notice: an additional charge of $750 per night.</small></div>
      <div class="data-row"><strong>Damages</strong><small>Any damage to the facilities, furniture, towels, bed linens or common areas must be covered by the guest.</small></div>
      <div class="data-row"><strong>Payment</strong><small>Payments are non-refundable and non-transferable.</small></div>
      <div class="data-row"><strong>Dates and suites</strong><small>The dates and minimum number of suites in your agreement must be honored; otherwise a penalty may apply.</small></div>
      <div class="data-row"><strong>Rule violations</strong><small>We reserve the right to end or refuse a stay if the house rules are not followed.</small></div>`
  },
  eat: {
    icon: 'utensils', kicker: 'Local flavors', title: 'Where to eat', html: `
      <p>Our house favorites, close to you in Rincón de Guayabitos.</p>
      <div class="data-row featured"><strong>Buonissimo Gelato &amp; Café</strong><small>Crêpes, waffles and smoothies. Order via WhatsApp; allow 35 min.</small><a href="https://wa.me/523222102354">322-210-2354</a></div>
      <div class="data-row"><strong>Pineda</strong><small>Great seafood spot with a beautiful view of the whole bay.</small><a class="row-phone" href="https://www.google.com/maps/search/?api=1&query=Restaurante+Pineda+Carr.+a+Los+Ayala+5+Rinc%C3%B3n+de+Guayabitos+63724" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>Buhardilla</strong><small>Perfect for dinner: a lovely place with a great atmosphere and a special touch.</small><a class="row-phone" href="https://www.google.com/maps/search/?api=1&query=Buhardilla+Retorno+Jacarandas+4+Rinc%C3%B3n+de+Guayabitos+63724" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>Mariscos Chabe</strong><small>Home delivery. Perfect for ceviche and aguachile.</small><a class="row-phone" href="tel:+523222305953">322-230-5953</a></div>
      <div class="data-row"><strong>Mariscos El Compa Félix</strong><small>Nayarit-style seafood. Their specialty is the vaso marisquero, a seafood cocktail served in a cup.</small><a class="row-phone" href="https://maps.app.goo.gl/rTvzLQe1xVzfgcnq8" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>Cevichería Coral</strong><small>Great for ceviche delivery, by the half kilo or kilo.</small><a class="row-phone" href="tel:+523271053962">327-105-3962</a></div>
      <div class="data-row"><strong>Hanami Sushi</strong><small>Good sushi to enjoy there or order for delivery.</small><a class="row-phone" href="https://share.google/rHHzfinMlFgo2iTDn" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>YESI</strong><small>A really lovely spot for breakfast.</small><a class="row-phone" href="https://www.google.com/maps/search/?api=1&query=Restaurant+Yesi+Grill+Emiliano+Zapata+25+La+Pe%C3%B1ita+de+Jaltemba+63720" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>ALOHA</strong><small>Pizza and grill.</small><a class="row-phone" href="https://share.google/RkjexoP3aac7IWgFB" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>Mona Lisa</strong><small>Pizza, on Sol Nuevo.</small></div>`
  },
  visit: {
    icon: 'beach', kicker: 'Explore', title: 'What to see', html: `
      <p>Nearby outings recommended by the house.</p>
      <div class="data-row"><strong>Playa Guayabitos · residential area</strong><small>The quietest part of Guayabitos, away from the noise. Perfect for a walk and a relaxed swim.</small><a class="row-phone" href="https://maps.app.goo.gl/Jpr5ntzbSsvfURUw9" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>Playa Fríderas</strong><small>A beach we recommend near Guayabitos.</small><a class="row-phone" href="https://maps.app.goo.gl/q6kGiXe8Jg9ihpHq7" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>Playa del Toro Hike</strong><small>A walk out to Playa del Toro.</small><a class="row-phone" href="https://loc.wiki/t/238742085?wa=sc" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>Chacala</strong><small>A nearby town and beach, perfect for a short outing.</small><a class="row-phone" href="https://maps.app.goo.gl/CphYW7ufBAfKfdHo6" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>Lo de Marcos</strong><small>A nearby spot for exploring the coast.</small><a class="row-phone" href="https://maps.app.goo.gl/zWvqGkRqr1uPNrPLA" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>Playa Los Venados</strong><small>A beach we recommend near Guayabitos.</small><a class="row-phone" href="https://maps.app.goo.gl/7iwpXzpasXWptBfd7" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>Platanitos</strong><small>A beach we recommend for a getaway.</small><a class="row-phone" href="https://maps.app.goo.gl/bGiFoxjsgm4wD1fS6" target="_blank" rel="noreferrer">View location</a></div>`
  },
  beachclubs: {
    icon: 'beach', kicker: 'Sun and sea', title: 'Beach Clubs', html: `
      <p>Our favorite beach clubs in the area.</p>
      <div class="data-row"><strong>Guayami Vice</strong><small>A beach club we recommend.</small><a class="row-phone" href="https://share.google/yb7CZir0Q1l9KlbZb" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>Victor's Beach Club</strong><small>Local vibe.</small><a class="row-phone" href="https://share.google/AtYJjejCIyZiUo4IK" target="_blank" rel="noreferrer">View location</a></div>
      <div class="data-row"><strong>El Barracuda</strong><small>40 min away. Perfect if you’re looking for something different, or a full-day getaway with great food.</small><a class="row-phone" href="https://share.google/m1SprRMkTbfslIXu8" target="_blank" rel="noreferrer">View location</a></div>`
  },
  spaces: {
    icon: 'home', kicker: 'The house', title: 'Our spaces', html: `
      <p>Contemporary architecture, tropical gardens, a pool and suites made for slow, restful days.</p>
      <div class="data-row"><strong>Pool and common area information</strong><small><span class="pending">To be confirmed</span></small></div>`
  },
  faq: {
    icon: 'help', kicker: 'Quick help', title: 'Frequently asked questions', html: `
      <div class="faq-item"><strong>What’s the Wi‑Fi password?</strong><span>Choose your suite in the Wi‑Fi section. Almost all of them use the same password; villas may differ.</span></div>
      <div class="faq-item"><strong>What time are check-in and check-out?</strong><span>Check-in 3:00 p.m. · Check-out 11:00 a.m. When you arrive, someone from our team will welcome you.</span></div>
      <div class="faq-item"><strong>Are pets allowed?</strong><span>Pets are not allowed.</span></div>
      <div class="faq-item"><strong>Can I smoke or use speakers?</strong><span>Smoking is not allowed on the property, and speakers are not allowed in common areas.</span></div>
      <div class="faq-item"><strong>Is there a taxi you trust?</strong><span>Tony Taxi (speaks English): <a href="https://wa.me/523221099223">322 109 9223</a></span></div>
      <div class="faq-item"><strong>Can I order food delivery?</strong><span>Buonissimo Gelato &amp; Café: WhatsApp <a href="https://wa.me/528120027975">812 002 7975</a> (order 35 min ahead). Ceviche Coral: <a href="tel:+523271053962">327 105 3962</a>.</span></div>
      <div class="faq-item"><strong>Where can I find a doctor nearby?</strong><span>Dr. Edgar Guzmán in La Peñita, WhatsApp <a href="https://wa.me/523221175855">322 117 5855</a>. For serious emergencies, go to a major hospital.</span></div>
      <div class="faq-item"><strong>How do I contact the house?</strong><span>La Casa: <a href="tel:+523222102354">322 210 2354</a>. Adriana: <a href="https://wa.me/528120027975">812 002 7975</a>.</span></div>`
  },
  map: {
    icon: 'map', kicker: 'Location', title: 'How to get here', html: `
      <p>La Casa de Consuelo is at Av. Sol Nuevo 86, Rincón de Guayabitos, one block from the beach and the restaurant area.</p>
      <div class="sheet-actions"><a target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=Av.+Sol+Nuevo+86%2C+Rinc%C3%B3n+de+Guayabitos">Open in Maps</a></div>`
  },
  emergency: {
    icon: 'alert', kicker: 'Quick help', title: 'Emergencies', html: `
      <p>Save these contacts. In a serious emergency, call 911 or go to a major hospital.</p>
      <div class="data-row featured"><strong>Hospital La Joya · La Peñita</strong><small>The closest one. You can also request an ambulance.</small><a href="tel:+523271070508">327 107 0508</a></div>
      <div class="data-row"><strong>La Casa team</strong><small>Raúl · <a href="tel:+523222151717">322 215 1717</a><br>Alan · <a href="tel:+523223705126">322 370 5126</a><br>Adriana · <a href="tel:+528120027975">812 002 7975</a></small></div>
      <div class="data-row"><strong>911</strong><small>National emergency line</small></div>
      <div class="data-row"><strong>Guayabitos Fire Department</strong><small><a href="tel:+523272743578">327 274 3578</a></small></div>
      <div class="data-row"><strong>Police</strong><small><a href="tel:+523276901160">327 690 1160</a> · <a href="tel:+523113161090">311 316 1090</a></small></div>
      <div class="data-row"><strong>Dr. Edgar Guzmán · La Peñita</strong><small>Private practice. WhatsApp <a href="https://wa.me/523221175855">322 117 5855</a><br>Vasco de Gama #12 A</small></div>
      <div class="data-row"><strong>Hospitals in Bucerías</strong><small>CMQ Riviera Nayarit · <a href="tel:+523292980717">329 298 0717</a></small></div>
      <div class="data-row"><strong>Hospitals in Puerto Vallarta</strong><small>La Joya · <a href="tel:+523222261010">322 226 1010</a><br>CMQ Centro · <a href="tel:+523222231173">322 223 1173</a><br>Hospiten · <a href="tel:+523222262080">322 226 2080</a></small></div>
      <div class="data-row"><strong>La Casa de Consuelo</strong><small><a href="tel:+523222102354">322 210 2354</a></small></div>
      <div class="sheet-actions"><a href="tel:911">Call 911</a><a class="secondary" href="tel:+523222102354">Call La Casa</a></div>`
  }
};
const staticEn = {
  pageTitle: 'La Casa de Consuelo · Guest Guide',
  metaDesc: 'Mobile guide for guests of La Casa de Consuelo.',
  altHero: 'Pool and gardens of La Casa de Consuelo at sunset',
  ariaBrand: 'La Casa de Consuelo, home',
  ariaLang: 'Change language',
  eyebrow: 'Your stay in Guayabitos',
  heroTitle: 'Welcome<br>home.',
  heroText: 'Everything you need to enjoy a few easygoing days, at your own pace.',
  whereTitle: 'Where are we?',
  whereText: 'One block from the beach',
  hello: 'Hello!',
  welcomeTitle: 'May your only rush<br>be getting to the beach.',
  nearYou: 'Near you',
  discover: 'Discover Guayabitos',
  altFood: 'Seafood platter with Pineda beers by the sea',
  eatKicker: 'Local flavors', eatTitle: 'Where to eat',
  altVisit: 'Cliffside lookout over the turquoise sea',
  visitKicker: 'Beaches and nearby getaways', visitTitle: 'What to see',
  altBeach: 'Palapa and table on the beach facing the sea',
  beachKicker: 'Sun and sea',
  altVilla: 'Terrace with outdoor kitchen and lit garden',
  spacesKicker: 'Inside the house', spacesTitle: 'Our spaces',
  essentials: 'The essentials', atHand: 'Quick access', guestGuide: 'Guest guide',
  wifiSub: 'Network and password',
  arrivalTitle: 'Check-in & check-out', arrivalSub: 'Times and steps',
  rulesTitle: 'House rules', rulesSub: 'For a peaceful stay',
  contactUs: 'Contact us',
  altHelp: 'Two-bed suite in soft tones',
  weAreClose: 'We’re close by', needTitle: 'Need anything?',
  needText: 'Find quick answers or get in touch with us.',
  emergencies: 'Emergencies', seeFaq: 'See FAQs', callNow: 'Call now',
  footerNote: 'Made for an unhurried stay.',
  ariaNav: 'Main navigation', navHome: 'Home', navExplore: 'Explore', navHelp: 'Help', navContact: 'Contact',
  ariaClose: 'Close'
};
const LANG_KEY = 'cc-lang';
const i18nAttrs = [['i18n', null], ['i18nAlt', 'alt'], ['i18nAria', 'aria-label'], ['i18nContent', 'content']];
const staticEs = { pageTitle: document.title };
document.querySelectorAll('[data-i18n],[data-i18n-alt],[data-i18n-aria],[data-i18n-content]').forEach(el => {
  i18nAttrs.forEach(([key, attr]) => {
    const k = el.dataset[key];
    if (k && !(k in staticEs)) staticEs[k] = attr ? el.getAttribute(attr) : el.innerHTML;
  });
});
function readSavedLang() { try { return localStorage.getItem(LANG_KEY); } catch (_) { return null; } }
function initialLang() {
  const param = new URLSearchParams(location.search).get('lang');
  if (param === 'es' || param === 'en') { try { localStorage.setItem(LANG_KEY, param); } catch (_) {} return param; }
  const saved = readSavedLang();
  if (saved === 'es' || saved === 'en') return saved;
  return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'es';
}
let currentLang = initialLang();
function applyLang(lang) {
  currentLang = lang === 'en' ? 'en' : 'es';
  const dict = currentLang === 'en' ? staticEn : staticEs;
  document.documentElement.lang = currentLang;
  document.title = dict.pageTitle;
  document.querySelectorAll('[data-i18n],[data-i18n-alt],[data-i18n-aria],[data-i18n-content]').forEach(el => {
    i18nAttrs.forEach(([key, attr]) => {
      const k = el.dataset[key];
      if (!k || !(k in dict)) return;
      if (attr) el.setAttribute(attr, dict[k]); else el.innerHTML = dict[k];
    });
  });
  document.querySelectorAll('#langToggle [data-lang]').forEach(s => s.classList.toggle('active', s.dataset.lang === currentLang));
  if (layer.classList.contains('open') && currentSheet) openSheet(currentSheet, lastTrigger);
}
document.querySelector('#langToggle').addEventListener('click', () => {
  const next = currentLang === 'en' ? 'es' : 'en';
  try { localStorage.setItem(LANG_KEY, next); } catch (_) {}
  applyLang(next);
});

renderIcons();
applyLang(currentLang);
