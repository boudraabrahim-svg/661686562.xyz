// DONNÉES
const DATA = {
    '01': {
        summary: { totalCA: 312960, totalVisites: 168, totalProspection: 73, totalWilayas: 12 },
        commerciaux: [
            { nom: "HICHEM KHOUDRIA", wilaya: "MEDEA", visites: 26, prospection: 20, ca: 95000, objectifCA: 110000, objectifProsp: 40, initiales: "HK" },
            { nom: "SABRINA BARKAT", wilaya: "AIN TEMOUCHENT", visites: 39, prospection: 6, ca: 94500, objectifCA: 110000, objectifProsp: 40, initiales: "SB" },
            { nom: "HANKOUR AMINE", wilaya: "ORAN", visites: 14, prospection: 1, ca: 59460, objectifCA: 110000, objectifProsp: 40, initiales: "HA" },
            { nom: "NADJAT AISSOU", wilaya: "MOSTAGANEM", visites: 16, prospection: 5, ca: 37000, objectifCA: 110000, objectifProsp: 40, initiales: "NA" },
            { nom: "BELBALI SLYMAN", wilaya: "ADRAR", visites: 3, prospection: 1, ca: 11500, objectifCA: 110000, objectifProsp: 40, initiales: "BS" },
            { nom: "YASMINA TAIBI", wilaya: "SIDI BEL ABBES", visites: 23, prospection: 15, ca: 9000, objectifCA: 110000, objectifProsp: 40, initiales: "YT" },
            { nom: "BEKKAL-BRIKCI", wilaya: "TLEMCEN", visites: 29, prospection: 24, ca: 6500, objectifCA: 110000, objectifProsp: 40, initiales: "BB" },
            { nom: "AISSA DAHMOUNE", wilaya: "DJELFA", visites: 17, prospection: 1, ca: 0, objectifCA: 110000, objectifProsp: 40, initiales: "AD" }
        ],
        wilayas: [{ nom: "AIN TEMOUCHENT", visites: 39, ca: 94500 }, { nom: "TIARET", visites: 4, ca: 80000 }, { nom: "ORAN", visites: 15, ca: 59460 }, { nom: "MOSTAGANEM", visites: 16, ca: 37000 }, { nom: "ADRAR", visites: 3, ca: 11500 }, { nom: "SIDI BEL ABBES", visites: 21, ca: 9000 }, { nom: "DJELFA", visites: 19, ca: 8000 }, { nom: "MEDEA", visites: 20, ca: 7000 }, { nom: "TLEMCEN", visites: 28, ca: 6500 }],
        topClients: [{ nom: "EPIC TIARET NADHAFA", ca: 80000, wilaya: "TIARET" }, { nom: "EURL CODIPROV ORAN", ca: 42000, wilaya: "AIN TEMOUCHENT" }, { nom: "SARL LILAUZ", ca: 28000, wilaya: "AIN TEMOUCHENT" }, { nom: "SPA SONATRACH LQS", ca: 15000, wilaya: "ORAN" }, { nom: "EURL MIMOZA LUMIERE", ca: 15000, wilaya: "MOSTAGANEM" }],
        topProduits: [{ nom: "SIM VOIX MVPN", quantite: 45, ca: 150000 }, { nom: "Pack Be Pro", quantite: 32, ca: 85000 }, { nom: "MoobiCorp", quantite: 18, ca: 45000 }, { nom: "Data Pro SIM", quantite: 12, ca: 25000 }, { nom: "Terminal Corporate", quantite: 5, ca: 7960 }]
    },
    '02': { summary: { totalCA: 5480, totalVisites: 1, totalProspection: 0, totalWilayas: 1 }, commerciaux: [{ nom: "HANKOUR AMINE", wilaya: "ORAN", visites: 1, prospection: 0, ca: 5480, objectifCA: 110000, objectifProsp: 40, initiales: "HA" }], wilayas: [{ nom: "ORAN", visites: 1, ca: 5480 }], topClients: [{ nom: "SPA SNTF", ca: 5480, wilaya: "ORAN" }], topProduits: [{ nom: "SIM VOIX MVPN", quantite: 10, ca: 5480 }] }
};

const COORDS = { ORAN: { lat: 35.6969, lng: -0.6331 }, TLEMCEN: { lat: 34.8828, lng: -1.3167 }, 'AIN TEMOUCHENT': { lat: 35.2974, lng: -1.14 }, 'SIDI BEL ABBES': { lat: 35.1904, lng: -0.6306 }, MOSTAGANEM: { lat: 35.9311, lng: 0.0892 }, TIARET: { lat: 35.3711, lng: 1.3172 }, ADRAR: { lat: 27.8742, lng: -0.2939 }, DJELFA: { lat: 34.6704, lng: 3.2503 }, MEDEA: { lat: 36.2675, lng: 2.75 } };

let map, markers, caChart, wilayaChart, matriceChart;

// FORMAT
const fmt = (n) => new Intl.NumberFormat('fr-DZ').format(n) + ' DA';
const getStatus = (pct) => pct >= 85 ? 'green' : pct >= 70 ? 'orange' : 'red';

// PAGE NAV
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('page-' + t.dataset.page).classList.add('active');
    if (t.dataset.page === 'territoire' && !map) initMap();
}));

// GET DATA
function getData() {
    const m = document.getElementById('monthFilter').value;
    return DATA[m] || DATA['01'];
}

// UPDATE ALL
function updateAll() {
    const d = getData();
    updateKPIs(d); updateStar(d); updateTeamTable(d); updateCAChart(d);
    if (map) updateMap(d);
    updateTopClients(d); updateTopProduits(d); updateWilayaChart(d);
    updateMatrice(d); updateGauge(d); updateCoaching(d);
}

// KPIs
function updateKPIs(d) {
    const nb = d.commerciaux.length || 8;
    const objCA = nb * 110000, objP = nb * 40;
    const pctCA = Math.round(d.summary.totalCA / objCA * 100);
    const pctP = Math.round((d.summary.totalProspection || 0) / objP * 100);
    const caPerV = d.summary.totalVisites ? Math.round(d.summary.totalCA / d.summary.totalVisites) : 0;

    document.getElementById('kpiGrid').innerHTML = `
    <div class="kpi-card ${getStatus(pctCA)}"><div class="kpi-label">💰 CA Réalisé</div><div class="kpi-value">${fmt(d.summary.totalCA)}</div><div class="kpi-sub ${getStatus(pctCA)}">${pctCA}% de l'objectif</div></div>
    <div class="kpi-card ${getStatus(pctCA)}"><div class="kpi-label">🎯 Objectif CA</div><div class="kpi-value">${fmt(objCA)}</div><div class="kpi-sub">${nb} commerciaux × 110 000</div></div>
    <div class="kpi-card"><div class="kpi-label">📍 Visites</div><div class="kpi-value">${d.summary.totalVisites}</div><div class="kpi-sub">${nb} commerciaux</div></div>
    <div class="kpi-card ${getStatus(pctP)}"><div class="kpi-label">🔍 Prospection</div><div class="kpi-value">${d.summary.totalProspection || 0}</div><div class="kpi-sub ${getStatus(pctP)}">${pctP}% obj (${objP})</div></div>
    <div class="kpi-card"><div class="kpi-label">🗺️ Wilayas</div><div class="kpi-value">${d.summary.totalWilayas}</div><div class="kpi-sub">Région Ouest</div></div>
    <div class="kpi-card"><div class="kpi-label">📊 CA/Visite</div><div class="kpi-value">${fmt(caPerV)}</div><div class="kpi-sub">Productivité</div></div>`;
}

// STAR - Meilleur % combiné CA + Prospection
function updateStar(d) {
    if (!d.commerciaux.length) { document.getElementById('starCommercial').innerHTML = '<p>Pas de données</p>'; return; }
    const star = d.commerciaux.reduce((a, b) => {
        const scoreA = (a.ca / a.objectifCA * 100) + (a.prospection / a.objectifProsp * 100);
        const scoreB = (b.ca / b.objectifCA * 100) + (b.prospection / b.objectifProsp * 100);
        return scoreA > scoreB ? a : b;
    });
    const pctCA = Math.round(star.ca / star.objectifCA * 100);
    const pctP = Math.round(star.prospection / star.objectifProsp * 100);
    const avgPct = Math.round((pctCA + pctP) / 2);
    document.getElementById('starCommercial').innerHTML = `<div class="star-card"><div class="star-avatar">${star.initiales}</div><div class="star-name">${star.nom}</div><div class="star-stats">${star.wilaya} • ${star.visites} visites</div><div class="star-ca">${fmt(star.ca)}</div><div style="display:flex;gap:1rem;justify-content:center;margin-top:.5rem"><span class="badge ${getStatus(pctCA)}">CA: ${pctCA}%</span><span class="badge ${getStatus(pctP)}">Prosp: ${pctP}%</span></div><div style="margin-top:.5rem;font-size:.7rem;color:var(--text2)">Score global: ${avgPct}%</div></div>`;
}

// TEAM TABLE
function updateTeamTable(d) {
    const tb = document.getElementById('teamTable');
    if (!d.commerciaux.length) { tb.innerHTML = '<tr><td colspan="8">Pas de données</td></tr>'; return; }
    tb.innerHTML = d.commerciaux.map(c => {
        const pCA = Math.round(c.ca / c.objectifCA * 100), pP = Math.round(c.prospection / c.objectifProsp * 100);
        return `<tr><td><strong>${c.nom}</strong></td><td>${c.wilaya}</td><td>${c.visites}</td><td>${c.prospection}</td><td>${fmt(c.ca)}</td><td><div class="progress-mini"><div class="progress-fill" style="width:${Math.min(100, pCA)}%;background:var(--${getStatus(pCA)})"></div></div>${pCA}%</td><td><div class="progress-mini"><div class="progress-fill" style="width:${Math.min(100, pP)}%;background:var(--${getStatus(pP)})"></div></div>${pP}%</td><td><span class="badge ${getStatus(pCA)}">${pCA >= 85 ? '🟢' : pCA >= 70 ? '🟠' : '🔴'}</span></td></tr>`;
    }).join('');
}

// CA CHART
function updateCAChart(d) {
    const ctx = document.getElementById('caChart'); if (!ctx) return;
    if (caChart) caChart.destroy();
    const f = d.commerciaux.filter(c => c.ca > 0);
    if (!f.length) return;
    caChart = new Chart(ctx, { type: 'doughnut', data: { labels: f.map(c => c.nom.split(' ').pop()), datasets: [{ data: f.map(c => c.ca), backgroundColor: ['#58a6ff', '#3fb950', '#d29922', '#f85149', '#a371f7', '#79c0ff'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#8b949e' } } }, cutout: '60%' } });
}

// MAP
function initMap() {
    map = L.map('mapBox', { center: [34, 0], zoom: 5, scrollWheelZoom: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    markers = L.layerGroup().addTo(map);
    updateMap(getData());
}
function updateMap(d) {
    if (!map) return; markers.clearLayers();
    d.wilayas.forEach(w => {
        const c = COORDS[w.nom]; if (!c) return;
        const r = 6 + (w.visites / 40) * 10;
        const col = w.ca >= 50000 ? '#3fb950' : w.ca >= 10000 ? '#d29922' : '#f85149';
        L.circleMarker([c.lat, c.lng], { radius: r, fillColor: col, color: '#fff', weight: 1, fillOpacity: .7 }).bindPopup(`<b>${w.nom}</b><br>CA: ${fmt(w.ca)}<br>Visites: ${w.visites}`).addTo(markers);
    });
}

// TOP CLIENTS
function updateTopClients(d) {
    const el = document.getElementById('topClients'); if (!el) return;
    if (!d.topClients || !d.topClients.length) { el.innerHTML = '<p>Pas de données</p>'; return; }
    el.innerHTML = d.topClients.map((c, i) => `<div class="top-item"><div class="top-rank ${i == 0 ? 'gold' : i == 1 ? 'silver' : i == 2 ? 'bronze' : 'other'}">${i + 1}</div><div class="top-info"><div class="top-name">${c.nom}</div><div class="top-detail">${c.wilaya}</div></div><div class="top-value">${fmt(c.ca)}</div></div>`).join('');
}

// TOP PRODUITS
function updateTopProduits(d) {
    const el = document.getElementById('topProduits'); if (!el) return;
    if (!d.topProduits || !d.topProduits.length) { el.innerHTML = '<p>Pas de données</p>'; return; }
    el.innerHTML = d.topProduits.map((p, i) => `<div class="top-item"><div class="top-rank ${i == 0 ? 'gold' : i == 1 ? 'silver' : i == 2 ? 'bronze' : 'other'}">${i + 1}</div><div class="top-info"><div class="top-name">${p.nom}</div><div class="top-detail">${p.quantite} unités</div></div><div class="top-value">${fmt(p.ca)}</div></div>`).join('');
}

// WILAYA CHART
function updateWilayaChart(d) {
    const ctx = document.getElementById('wilayaChart'); if (!ctx) return;
    if (wilayaChart) wilayaChart.destroy();
    if (!d.wilayas.length) return;
    wilayaChart = new Chart(ctx, { type: 'bar', data: { labels: d.wilayas.slice(0, 8).map(w => w.nom), datasets: [{ data: d.wilayas.slice(0, 8).map(w => w.ca), backgroundColor: '#58a6ff', borderRadius: 4 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: '#30363d' }, ticks: { color: '#8b949e' } }, y: { grid: { display: false }, ticks: { color: '#8b949e', font: { size: 10 } } } } } });
}

// MATRICE
function updateMatrice(d) {
    const ctx = document.getElementById('matriceChart'); if (!ctx) return;
    if (matriceChart) matriceChart.destroy();
    if (!d.commerciaux.length) return;
    const pts = d.commerciaux.map(c => ({ x: c.visites, y: c.ca / 1000, l: c.nom.split(' ').pop() }));
    const cols = pts.map(p => p.y >= 50 && p.x >= 20 ? '#3fb950' : p.y >= 50 ? '#58a6ff' : p.x >= 20 ? '#d29922' : '#f85149');
    matriceChart = new Chart(ctx, { type: 'bubble', data: { datasets: [{ data: pts.map(p => ({ x: p.x, y: p.y, r: 10 })), backgroundColor: cols.map(c => c + 'cc'), borderColor: cols, borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${pts[c.dataIndex].l}: ${pts[c.dataIndex].y.toFixed(0)}K DA, ${pts[c.dataIndex].x} visites` } } }, scales: { x: { title: { display: true, text: 'Visites', color: '#8b949e' }, grid: { color: '#30363d' }, ticks: { color: '#8b949e' }, min: 0 }, y: { title: { display: true, text: 'CA (K DA)', color: '#8b949e' }, grid: { color: '#30363d' }, ticks: { color: '#8b949e' }, min: 0 } } } });
}

// GAUGE
function updateGauge(d) {
    const el = document.getElementById('gaugeBox'); if (!el) return;
    const nb = d.commerciaux.length || 8;
    const obj = nb * 40, real = d.summary.totalProspection || 0;
    const pct = Math.min(100, real / obj * 100);
    const angle = -90 + pct * 1.8;
    el.innerHTML = `<div class="gauge-wrap"><svg class="gauge-svg" viewBox="0 0 200 120"><defs><linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#f85149"/><stop offset="50%" style="stop-color:#d29922"/><stop offset="100%" style="stop-color:#3fb950"/></linearGradient></defs><path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#30363d" stroke-width="14" stroke-linecap="round"/><path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gg)" stroke-width="14" stroke-linecap="round" stroke-dasharray="251.2" stroke-dashoffset="${251.2 - pct * 2.512}"/><line x1="100" y1="100" x2="${100 + 60 * Math.cos(angle * Math.PI / 180)}" y2="${100 + 60 * Math.sin(angle * Math.PI / 180)}" stroke="#f0f6fc" stroke-width="3" stroke-linecap="round"/><circle cx="100" cy="100" r="6" fill="#f0f6fc"/><text x="20" y="115" fill="#8b949e" font-size="10">0</text><text x="175" y="115" fill="#8b949e" font-size="10">${obj}</text></svg><div class="gauge-value">${real}</div><div class="gauge-label">visites prospection sur ${obj}</div></div>`;
}

// COACHING TABLE
function updateCoaching(d) {
    const tb = document.getElementById('coachingTable'); if (!tb) return;
    if (!d.commerciaux.length) { tb.innerHTML = '<tr><td colspan="5">Pas de données</td></tr>'; return; }
    tb.innerHTML = d.commerciaux.map(c => {
        const pCA = Math.round(c.ca / c.objectifCA * 100);
        let zone = 'Danger', action = '🔴 Coaching urgent + plan action';
        if (pCA >= 85) { zone = 'Excellence'; action = '🟢 Féliciter + partage best practices'; }
        else if (pCA >= 70) { zone = 'Attention'; action = '🟠 Suivi hebdo + support ciblé'; }
        return `<tr><td>${c.nom}</td><td><span class="badge ${getStatus(pCA)}">${zone}</span></td><td>${fmt(c.ca)}</td><td>${c.visites}</td><td>${action}</td></tr>`;
    }).join('');
}

// INIT
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
document.getElementById('monthFilter').addEventListener('change', updateAll);
function logout() { sessionStorage.clear(); location.href = 'index.html'; }
updateAll();
