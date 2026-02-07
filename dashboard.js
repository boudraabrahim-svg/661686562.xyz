// ============================================
// DONNÉES COMMERCIAUX
// ============================================
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
        topProduits: [{ nom: "SKY-BUSINESS 1000 CONTROL", quantite: 8, ca: 56000 }, { nom: "CARTE DE RECHARGE 2000 DA", quantite: 4, ca: 8000 }, { nom: "Revo Business 1500 Ctrl", quantite: 3, ca: 13500 }, { nom: "Revo Business 3500 Libre", quantite: 3, ca: 31500 }, { nom: "BePro 2000", quantite: 2, ca: 4000 }]
    },
    '02': {
        summary: { totalCA: 5480, totalVisites: 1, totalProspection: 0, totalWilayas: 1 },
        commerciaux: [{ nom: "HANKOUR AMINE", wilaya: "ORAN", visites: 1, prospection: 0, ca: 5480, objectifCA: 110000, objectifProsp: 40, initiales: "HA" }],
        wilayas: [{ nom: "ORAN", visites: 1, ca: 5480 }],
        topClients: [{ nom: "SPA SNTF", ca: 5480, wilaya: "ORAN" }],
        topProduits: [{ nom: "SIM VOIX MVPN", quantite: 10, ca: 5480 }]
    }
};

const COORDS = { ORAN: { lat: 35.6969, lng: -0.6331 }, TLEMCEN: { lat: 34.8828, lng: -1.3167 }, 'AIN TEMOUCHENT': { lat: 35.2974, lng: -1.14 }, 'SIDI BEL ABBES': { lat: 35.1904, lng: -0.6306 }, MOSTAGANEM: { lat: 35.9311, lng: 0.0892 }, TIARET: { lat: 35.3711, lng: 1.3172 }, ADRAR: { lat: 27.8742, lng: -0.2939 }, DJELFA: { lat: 34.6704, lng: 3.2503 }, MEDEA: { lat: 36.2675, lng: 2.75 } };

let map, markers, caChart, wilayaChart, matriceChart, perfChart, visitesChart;

// FORMAT
const fmt = n => new Intl.NumberFormat('fr-DZ').format(n) + ' DA';
const getStatus = pct => pct >= 85 ? 'green' : pct >= 70 ? 'orange' : 'red';
const getIcon = pct => pct >= 85 ? '🟢' : pct >= 70 ? '🟠' : '🔴';

// TOGGLE FILTER
function toggleFilter(id) {
    document.querySelectorAll('.filter-menu').forEach(m => { if (m.id !== id) m.classList.remove('open') });
    document.getElementById(id).classList.toggle('open');
}
document.addEventListener('click', e => { if (!e.target.closest('.filter-dropdown')) document.querySelectorAll('.filter-menu').forEach(m => m.classList.remove('open')) });

// INIT FILTERS
function initFilters() {
    const allComm = new Set(), allWil = new Set();
    Object.values(DATA).forEach(d => {
        d.commerciaux?.forEach(c => { allComm.add(c.nom); allWil.add(c.wilaya) });
    });
    let h = '<label><input type="checkbox" value="all" checked onchange="updateAll()"> Tous</label>';
    allComm.forEach(c => { h += `<label><input type="checkbox" value="${c}" onchange="updateAll()"> ${c.split(' ').pop()}</label>` });
    document.getElementById('commMenu').innerHTML = h;
    h = '<label><input type="checkbox" value="all" checked onchange="updateAll()"> Toutes</label>';
    allWil.forEach(w => { h += `<label><input type="checkbox" value="${w}" onchange="updateAll()"> ${w}</label>` });
    document.getElementById('wilMenu').innerHTML = h;
}

// PAGE NAV
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('page-' + t.dataset.page).classList.add('active');
    if (t.dataset.page === 'territoire' && !map) initMap();
}));

// GET FILTERED DATA
function getData() {
    const mois = [...document.querySelectorAll('#moisMenu input:checked')].map(i => i.value);
    const comm = [...document.querySelectorAll('#commMenu input:checked')].map(i => i.value);
    const wil = [...document.querySelectorAll('#wilMenu input:checked')].map(i => i.value);
    const allComm = comm.includes('all'), allWil = wil.includes('all');

    let totalCA = 0, totalVisites = 0, totalProsp = 0;
    const commMap = {}, wilMap = {}, clientMap = {}, prodMap = {};

    mois.forEach(m => {
        const d = DATA[m]; if (!d) return;
        d.commerciaux?.forEach(c => {
            if (!allComm && !comm.includes(c.nom)) return;
            if (!allWil && !wil.includes(c.wilaya)) return;
            if (!commMap[c.nom]) commMap[c.nom] = { ...c, visites: 0, prospection: 0, ca: 0 };
            commMap[c.nom].visites += c.visites;
            commMap[c.nom].prospection += c.prospection;
            commMap[c.nom].ca += c.ca;
            totalCA += c.ca; totalVisites += c.visites; totalProsp += c.prospection;
        });
        d.wilayas?.forEach(w => {
            if (!allWil && !wil.includes(w.nom)) return;
            if (!wilMap[w.nom]) wilMap[w.nom] = { ...w, visites: 0, ca: 0 };
            wilMap[w.nom].visites += w.visites;
            wilMap[w.nom].ca += w.ca;
        });
        d.topClients?.forEach(c => {
            if (!clientMap[c.nom]) clientMap[c.nom] = { ...c, ca: 0 };
            clientMap[c.nom].ca += c.ca;
        });
        d.topProduits?.forEach(p => {
            if (!prodMap[p.nom]) prodMap[p.nom] = { ...p, quantite: 0, ca: 0 };
            prodMap[p.nom].quantite += p.quantite;
            prodMap[p.nom].ca += p.ca;
        });
    });

    return {
        summary: { totalCA, totalVisites, totalProspection: totalProsp, totalWilayas: Object.keys(wilMap).length },
        commerciaux: Object.values(commMap).sort((a, b) => b.ca - a.ca),
        wilayas: Object.values(wilMap).sort((a, b) => b.ca - a.ca),
        topClients: Object.values(clientMap).sort((a, b) => b.ca - a.ca).slice(0, 5),
        topProduits: Object.values(prodMap).sort((a, b) => b.ca - a.ca).slice(0, 5)
    };
}

// UPDATE ALL
function updateAll() {
    const d = getData();
    updateKPIs(d); updateGauges(d); updateStar(d); updateCAChart(d); updateTeamTable(d);
    if (map) updateMap(d);
    updateTopClients(d); updateTopProduits(d); updateWilayaChart(d); updateVisitesChart(d);
    updateMatrice(d); updatePerfChart(d); updateCoaching(d);
}

// KPIs
function updateKPIs(d) {
    const nb = d.commerciaux.length || 8;
    const objCA = nb * 110000, objP = nb * 40;
    const pctCA = Math.round(d.summary.totalCA / objCA * 100) || 0;
    const pctP = Math.round((d.summary.totalProspection || 0) / objP * 100) || 0;
    const caPerV = d.summary.totalVisites ? Math.round(d.summary.totalCA / d.summary.totalVisites) : 0;

    document.getElementById('kpiGrid').innerHTML = `
    <div class="kpi-card ${getStatus(pctCA)}"><div class="kpi-label">💰 CA Réalisé</div><div class="kpi-value">${fmt(d.summary.totalCA)}</div><div class="kpi-sub ${getStatus(pctCA)}">${getIcon(pctCA)} ${pctCA}% objectif</div></div>
    <div class="kpi-card ${getStatus(pctCA)}"><div class="kpi-label">🎯 Objectif CA</div><div class="kpi-value">${fmt(objCA)}</div><div class="kpi-sub">${nb} × 110 000 DA</div></div>
    <div class="kpi-card ${getStatus(pctP)}"><div class="kpi-label">🔍 Prospection</div><div class="kpi-value">${d.summary.totalProspection || 0} / ${objP}</div><div class="kpi-sub ${getStatus(pctP)}">${getIcon(pctP)} ${pctP}% objectif</div></div>
    <div class="kpi-card"><div class="kpi-label">📍 Visites / Wilayas</div><div class="kpi-value">${d.summary.totalVisites} / ${d.summary.totalWilayas}</div><div class="kpi-sub">CA/visite: ${fmt(caPerV)}</div></div>`;
}

// JAUGES
function updateGauges(d) {
    const nb = d.commerciaux.length || 8;
    // Jauge CA
    const objCA = nb * 110000, pctCA = Math.min(100, d.summary.totalCA / objCA * 100);
    const angCA = -90 + pctCA * 1.8;
    document.getElementById('gaugeCA').innerHTML = `<svg class="gauge-svg" viewBox="0 0 140 80"><defs><linearGradient id="gCA"><stop offset="0%" stop-color="#f85149"/><stop offset="50%" stop-color="#d29922"/><stop offset="100%" stop-color="#3fb950"/></linearGradient></defs><path d="M 15 70 A 55 55 0 0 1 125 70" fill="none" stroke="#30363d" stroke-width="10" stroke-linecap="round"/><path d="M 15 70 A 55 55 0 0 1 125 70" fill="none" stroke="url(#gCA)" stroke-width="10" stroke-linecap="round" stroke-dasharray="173" stroke-dashoffset="${173 - pctCA * 1.73}"/><line x1="70" y1="70" x2="${70 + 40 * Math.cos(angCA * Math.PI / 180)}" y2="${70 + 40 * Math.sin(angCA * Math.PI / 180)}" stroke="#f0f6fc" stroke-width="2" stroke-linecap="round"/><circle cx="70" cy="70" r="4" fill="#f0f6fc"/></svg><div class="gauge-value">${Math.round(pctCA)}%</div><div class="gauge-label">${fmt(d.summary.totalCA)} / ${fmt(objCA)}</div>`;
    // Jauge Prosp
    const objP = nb * 40, pctP = Math.min(100, (d.summary.totalProspection || 0) / objP * 100);
    const angP = -90 + pctP * 1.8;
    document.getElementById('gaugeProsp').innerHTML = `<svg class="gauge-svg" viewBox="0 0 140 80"><defs><linearGradient id="gP"><stop offset="0%" stop-color="#f85149"/><stop offset="50%" stop-color="#d29922"/><stop offset="100%" stop-color="#3fb950"/></linearGradient></defs><path d="M 15 70 A 55 55 0 0 1 125 70" fill="none" stroke="#30363d" stroke-width="10" stroke-linecap="round"/><path d="M 15 70 A 55 55 0 0 1 125 70" fill="none" stroke="url(#gP)" stroke-width="10" stroke-linecap="round" stroke-dasharray="173" stroke-dashoffset="${173 - pctP * 1.73}"/><line x1="70" y1="70" x2="${70 + 40 * Math.cos(angP * Math.PI / 180)}" y2="${70 + 40 * Math.sin(angP * Math.PI / 180)}" stroke="#f0f6fc" stroke-width="2" stroke-linecap="round"/><circle cx="70" cy="70" r="4" fill="#f0f6fc"/></svg><div class="gauge-value">${Math.round(pctP)}%</div><div class="gauge-label">${d.summary.totalProspection || 0} / ${objP} visites</div>`;
}

// STAR
function updateStar(d) {
    if (!d.commerciaux.length) { document.getElementById('starBox').innerHTML = '<p style="text-align:center;color:var(--text2);font-size:.7rem">Pas de données</p>'; return; }
    const star = d.commerciaux.reduce((a, b) => {
        const sA = (a.ca / a.objectifCA) + (a.prospection / a.objectifProsp);
        const sB = (b.ca / b.objectifCA) + (b.prospection / b.objectifProsp);
        return sA > sB ? a : b;
    });
    const pCA = Math.round(star.ca / star.objectifCA * 100), pP = Math.round(star.prospection / star.objectifProsp * 100);
    document.getElementById('starBox').innerHTML = `<div class="star-mini"><div class="star-avatar">${star.initiales}</div><div class="star-info"><div class="star-name">${star.nom}</div><div class="star-stats">${star.wilaya} • ${star.visites}v • ${fmt(star.ca)}</div><div class="star-badges"><span class="badge ${getStatus(pCA)}">CA:${pCA}%</span><span class="badge ${getStatus(pP)}">Pr:${pP}%</span></div></div></div>`;
}

// TEAM TABLE
function updateTeamTable(d) {
    const tb = document.getElementById('teamTable');
    if (!d.commerciaux.length) { tb.innerHTML = '<tr><td colspan="9" style="text-align:center">Pas de données</td></tr>'; return; }
    tb.innerHTML = d.commerciaux.map(c => {
        const pCA = Math.round(c.ca / c.objectifCA * 100), pP = Math.round(c.prospection / c.objectifProsp * 100);
        const action = pCA < 70 ? '⚡ Coaching urgent' : pCA < 85 ? '📞 Suivi hebdo' : '✅ Maintenir';
        return `<tr><td><strong>${c.nom}</strong></td><td>${c.wilaya}</td><td>${c.visites}</td><td>${c.prospection}</td><td>${fmt(c.ca)}</td><td><div class="progress-mini"><div class="progress-fill" style="width:${Math.min(100, pCA)}%;background:var(--${getStatus(pCA)})"></div></div>${pCA}%</td><td><div class="progress-mini"><div class="progress-fill" style="width:${Math.min(100, pP)}%;background:var(--${getStatus(pP)})"></div></div>${pP}%</td><td><span class="badge ${getStatus(pCA)}">${getIcon(pCA)}</span></td><td style="font-size:.55rem">${action}</td></tr>`;
    }).join('');
}

// CA CHART
function updateCAChart(d) {
    const ctx = document.getElementById('caChart'); if (!ctx) return;
    if (caChart) caChart.destroy();
    const f = d.commerciaux.filter(c => c.ca > 0); if (!f.length) return;
    caChart = new Chart(ctx, { type: 'doughnut', data: { labels: f.map(c => c.nom.split(' ').pop()), datasets: [{ data: f.map(c => c.ca), backgroundColor: ['#58a6ff', '#3fb950', '#d29922', '#f85149', '#a371f7', '#79c0ff'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#8b949e', font: { size: 9 }, boxWidth: 10 } } }, cutout: '55%' } });
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
        const r = 5 + (w.visites / 40) * 8;
        const col = w.ca >= 50000 ? '#3fb950' : w.ca >= 10000 ? '#d29922' : '#f85149';
        L.circleMarker([c.lat, c.lng], { radius: r, fillColor: col, color: '#fff', weight: 1, fillOpacity: .7 }).bindPopup(`<b>${w.nom}</b><br>CA: ${fmt(w.ca)}<br>Visites: ${w.visites}`).addTo(markers);
    });
}

// TOP CLIENTS & PRODUITS
function updateTopClients(d) {
    const el = document.getElementById('topClients'); if (!el) return;
    if (!d.topClients?.length) { el.innerHTML = '<p style="color:var(--text2);font-size:.7rem">Pas de données</p>'; return; }
    el.innerHTML = d.topClients.map((c, i) => `<div class="top-item"><div class="top-rank ${['gold', 'silver', 'bronze', 'other', 'other'][i]}">${i + 1}</div><div class="top-info"><div class="top-name">${c.nom}</div><div class="top-detail">${c.wilaya}</div></div><div class="top-value">${fmt(c.ca)}</div></div>`).join('');
}
function updateTopProduits(d) {
    const el = document.getElementById('topProduits'); if (!el) return;
    if (!d.topProduits?.length) { el.innerHTML = '<p style="color:var(--text2);font-size:.7rem">Pas de données</p>'; return; }
    el.innerHTML = d.topProduits.map((p, i) => `<div class="top-item"><div class="top-rank ${['gold', 'silver', 'bronze', 'other', 'other'][i]}">${i + 1}</div><div class="top-info"><div class="top-name">${p.nom}</div><div class="top-detail">${p.quantite} unités</div></div><div class="top-value">${fmt(p.ca)}</div></div>`).join('');
}

// WILAYA CHART
function updateWilayaChart(d) {
    const ctx = document.getElementById('wilayaChart'); if (!ctx) return;
    if (wilayaChart) wilayaChart.destroy(); if (!d.wilayas.length) return;
    wilayaChart = new Chart(ctx, { type: 'bar', data: { labels: d.wilayas.slice(0, 6).map(w => w.nom), datasets: [{ data: d.wilayas.slice(0, 6).map(w => w.ca), backgroundColor: '#58a6ff', borderRadius: 3 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: '#30363d' }, ticks: { color: '#8b949e', font: { size: 8 } } }, y: { grid: { display: false }, ticks: { color: '#8b949e', font: { size: 8 } } } } } });
}

// VISITES CHART
function updateVisitesChart(d) {
    const ctx = document.getElementById('visitesChart'); if (!ctx) return;
    if (visitesChart) visitesChart.destroy(); if (!d.commerciaux.length) return;
    visitesChart = new Chart(ctx, { type: 'bar', data: { labels: d.commerciaux.map(c => c.nom.split(' ').pop()), datasets: [{ label: 'Visites', data: d.commerciaux.map(c => c.visites), backgroundColor: '#58a6ff' }, { label: 'Prosp.', data: d.commerciaux.map(c => c.prospection), backgroundColor: '#3fb950' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b949e', font: { size: 8 }, boxWidth: 8 } } }, scales: { x: { grid: { display: false }, ticks: { color: '#8b949e', font: { size: 7 } } }, y: { grid: { color: '#30363d' }, ticks: { color: '#8b949e' } } } } });
}

// MATRICE
function updateMatrice(d) {
    const ctx = document.getElementById('matriceChart'); if (!ctx) return;
    if (matriceChart) matriceChart.destroy(); if (!d.commerciaux.length) return;
    const pts = d.commerciaux.map(c => ({ x: c.visites, y: c.ca / 1000, l: c.nom.split(' ').pop() }));
    const cols = pts.map(p => p.y >= 50 && p.x >= 20 ? '#3fb950' : p.y >= 50 ? '#58a6ff' : p.x >= 20 ? '#d29922' : '#f85149');
    matriceChart = new Chart(ctx, { type: 'bubble', data: { datasets: [{ data: pts.map(p => ({ x: p.x, y: p.y, r: 8 })), backgroundColor: cols.map(c => c + 'cc'), borderColor: cols, borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${pts[c.dataIndex].l}: ${pts[c.dataIndex].y.toFixed(0)}K, ${pts[c.dataIndex].x}v` } } }, scales: { x: { title: { display: true, text: 'Visites', color: '#8b949e', font: { size: 9 } }, grid: { color: '#30363d' }, ticks: { color: '#8b949e' }, min: 0 }, y: { title: { display: true, text: 'CA (K)', color: '#8b949e', font: { size: 9 } }, grid: { color: '#30363d' }, ticks: { color: '#8b949e' }, min: 0 } } }, plugins: [{ afterDraw: ch => { const c = ch.ctx; ch.data.datasets[0].data.forEach((_, i) => { const m = ch.getDatasetMeta(0).data[i]; c.fillStyle = '#f0f6fc'; c.font = 'bold 8px Inter'; c.textAlign = 'center'; c.fillText(pts[i].l, m.x, m.y + 3) }) } }] });
}

// PERF CHART
function updatePerfChart(d) {
    const ctx = document.getElementById('perfChart'); if (!ctx) return;
    if (perfChart) perfChart.destroy(); if (!d.commerciaux.length) return;
    perfChart = new Chart(ctx, { type: 'bar', data: { labels: d.commerciaux.map(c => c.nom.split(' ').pop()), datasets: [{ label: 'Réalisé', data: d.commerciaux.map(c => c.ca), backgroundColor: '#58a6ff', borderRadius: 3 }, { label: 'Objectif', data: d.commerciaux.map(c => c.objectifCA), backgroundColor: '#30363d', borderRadius: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b949e', font: { size: 8 }, boxWidth: 10 } } }, scales: { x: { grid: { display: false }, ticks: { color: '#8b949e', font: { size: 7 } } }, y: { grid: { color: '#30363d' }, ticks: { color: '#8b949e', callback: v => v >= 1000 ? (v / 1000) + 'K' : v } } } } });
}

// COACHING
function updateCoaching(d) {
    const tb = document.getElementById('coachingTable'); if (!tb) return;
    if (!d.commerciaux.length) { tb.innerHTML = '<tr><td colspan="8">Pas de données</td></tr>'; return; }
    tb.innerHTML = d.commerciaux.map(c => {
        const pCA = Math.round(c.ca / c.objectifCA * 100), pP = Math.round(c.prospection / c.objectifProsp * 100);
        let zone = 'Danger', diag = 'CA et activité insuffisants', action = '🔴 Plan de redressement + accompagnement terrain';
        if (pCA >= 85 && pP >= 85) { zone = 'Excellence'; diag = 'Performance optimale'; action = '🟢 Féliciter + responsabilités accrues'; }
        else if (pCA >= 85) { zone = 'Excellence'; diag = 'Bon CA, prospection à renforcer'; action = '🟢 Objectiver sur nouveaux clients'; }
        else if (pCA >= 70) { zone = 'Progression'; diag = 'En voie, besoin de soutien'; action = '🟠 Suivi hebdo + formation produits'; }
        else if (c.visites >= 20) { zone = 'Effort'; diag = 'Activité OK, conversion faible'; action = '🟠 Revoir argumentaire + ciblage'; }
        return `<tr><td><strong>${c.nom}</strong></td><td><span class="badge ${getStatus(pCA)}">${zone}</span></td><td>${fmt(c.ca)}</td><td>${pCA}%</td><td>${c.visites}</td><td>${c.prospection}</td><td style="font-size:.55rem">${diag}</td><td style="font-size:.55rem">${action}</td></tr>`;
    }).join('');
}

// INIT
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
function logout() { sessionStorage.clear(); location.href = 'index.html'; }
initFilters();
updateAll();
