// ============================================
// DASHBOARD DIRECTION COMMERCIALE B2B
// Version 3.0 - Stratégique & Prédictif
// ============================================

// DONNÉES
const DATA = {
    '01': {
        summary: { totalCA: 312960, totalVisites: 168, totalProspection: 73, totalWilayas: 12, joursOuvrables: 22 },
        commerciaux: [
            { nom: "HICHEM KHOUDRIA", wilaya: "MEDEA", visites: 26, prospection: 20, ca: 95000, initiales: "HK" },
            { nom: "SABRINA BARKAT", wilaya: "AIN TEMOUCHENT", visites: 39, prospection: 6, ca: 94500, initiales: "SB" },
            { nom: "HANKOUR AMINE", wilaya: "ORAN", visites: 14, prospection: 1, ca: 59460, initiales: "HA" },
            { nom: "NADJAT AISSOU", wilaya: "MOSTAGANEM", visites: 16, prospection: 5, ca: 37000, initiales: "NA" },
            { nom: "BELBALI SLYMAN", wilaya: "ADRAR", visites: 3, prospection: 1, ca: 11500, initiales: "BS" },
            { nom: "YASMINA TAIBI", wilaya: "SIDI BEL ABBES", visites: 23, prospection: 15, ca: 9000, initiales: "YT" },
            { nom: "BEKKAL-BRIKCI", wilaya: "TLEMCEN", visites: 29, prospection: 24, ca: 6500, initiales: "BB" },
            { nom: "AISSA DAHMOUNE", wilaya: "DJELFA", visites: 17, prospection: 1, ca: 0, initiales: "AD" }
        ],
        wilayas: [
            { nom: "AIN TEMOUCHENT", visites: 39, ca: 94500, potentiel: "Élevé" },
            { nom: "TIARET", visites: 4, ca: 80000, potentiel: "Élevé" },
            { nom: "ORAN", visites: 15, ca: 59460, potentiel: "Très élevé" },
            { nom: "MOSTAGANEM", visites: 16, ca: 37000, potentiel: "Moyen" },
            { nom: "ADRAR", visites: 3, ca: 11500, potentiel: "Faible" },
            { nom: "SIDI BEL ABBES", visites: 21, ca: 9000, potentiel: "Moyen" },
            { nom: "DJELFA", visites: 19, ca: 8000, potentiel: "Moyen" },
            { nom: "MEDEA", visites: 20, ca: 7000, potentiel: "Moyen" },
            { nom: "TLEMCEN", visites: 28, ca: 6500, potentiel: "Moyen" }
        ],
        topClients: [
            { nom: "EPIC TIARET NADHAFA", ca: 80000, wilaya: "TIARET" },
            { nom: "EURL CODIPROV ORAN", ca: 42000, wilaya: "AIN TEMOUCHENT" },
            { nom: "SARL LILAUZ", ca: 28000, wilaya: "AIN TEMOUCHENT" },
            { nom: "SPA SONATRACH LQS", ca: 15000, wilaya: "ORAN" },
            { nom: "EURL MIMOZA LUMIERE", ca: 15000, wilaya: "MOSTAGANEM" }
        ],
        topProduits: [
            { nom: "SKY-BUSINESS 1000 CONTROL", quantite: 8, ca: 56000 },
            { nom: "Revo Business 3500 Libre", quantite: 3, ca: 31500 },
            { nom: "Revo Business 1500 Ctrl", quantite: 3, ca: 13500 },
            { nom: "CARTE DE RECHARGE 2000 DA", quantite: 4, ca: 8000 },
            { nom: "BePro 2000", quantite: 2, ca: 4000 }
        ]
    },
    '02': {
        summary: { totalCA: 5480, totalVisites: 1, totalProspection: 0, totalWilayas: 1, joursOuvrables: 20 },
        commerciaux: [
            { nom: "HANKOUR AMINE", wilaya: "ORAN", visites: 1, prospection: 0, ca: 5480, initiales: "HA" }
        ],
        wilayas: [{ nom: "ORAN", visites: 1, ca: 5480, potentiel: "Très élevé" }],
        topClients: [{ nom: "SPA SNTF", ca: 5480, wilaya: "ORAN" }],
        topProduits: [{ nom: "SIM VOIX MVPN", quantite: 10, ca: 5480 }]
    }
};

// CONSTANTES STRATÉGIQUES
const OBJECTIF_CA_MENSUEL = 110000;
const OBJECTIF_PROSP_MENSUEL = 40;
const OBJECTIF_VISITES_JOUR = 4;
const SEUIL_ALERTE_ROUGE = 50;
const SEUIL_ALERTE_ORANGE = 70;
const SEUIL_OBJECTIF = 85;

// COORDONNÉES WILAYAS
const COORDS = {
    ORAN: { lat: 35.6969, lng: -0.6331 },
    TLEMCEN: { lat: 34.8828, lng: -1.3167 },
    'AIN TEMOUCHENT': { lat: 35.2974, lng: -1.14 },
    'SIDI BEL ABBES': { lat: 35.1904, lng: -0.6306 },
    MOSTAGANEM: { lat: 35.9311, lng: 0.0892 },
    TIARET: { lat: 35.3711, lng: 1.3172 },
    ADRAR: { lat: 27.8742, lng: -0.2939 },
    DJELFA: { lat: 34.6704, lng: 3.2503 },
    MEDEA: { lat: 36.2675, lng: 2.75 }
};

// VARIABLES GLOBALES
let map, markers;
let caChart, activityChart, rankingChart, compChart, wilayaChart, matriceChart;

// UTILITAIRES
const fmt = n => new Intl.NumberFormat('fr-DZ').format(Math.round(n)) + ' DA';
const fmtK = n => n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n;
const getStatusClass = pct => pct >= SEUIL_OBJECTIF ? 'success' : pct >= SEUIL_ALERTE_ORANGE ? 'warning' : 'danger';
const getStatusIcon = pct => pct >= SEUIL_OBJECTIF ? '🟢' : pct >= SEUIL_ALERTE_ORANGE ? '🟠' : '🔴';
const getGradient = pct => pct >= SEUIL_OBJECTIF ? 'success' : pct >= SEUIL_ALERTE_ORANGE ? 'warning' : 'danger';

// FILTRES
function toggleFilter(id) {
    document.querySelectorAll('.filter-menu').forEach(m => { if (m.id !== id) m.classList.remove('open'); });
    document.getElementById(id).classList.toggle('open');
}

document.addEventListener('click', e => {
    if (!e.target.closest('.filter-group')) {
        document.querySelectorAll('.filter-menu').forEach(m => m.classList.remove('open'));
    }
});

function initFilters() {
    const comms = new Set();
    Object.values(DATA).forEach(d => d.commerciaux?.forEach(c => comms.add(c.nom)));
    let h = '<label><input type="checkbox" value="all" checked onchange="updateAll()"> Toute l\'équipe</label>';
    comms.forEach(c => { h += `<label><input type="checkbox" value="${c}" onchange="updateAll()"> ${c.split(' ').pop()}</label>`; });
    document.getElementById('commMenu').innerHTML = h;
}

// NAVIGATION
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('page-' + tab.dataset.page).classList.add('active');
        if (tab.dataset.page === 'territoire' && !map) initMap();
    });
});

// GET DATA
function getData() {
    const mois = [...document.querySelectorAll('#moisMenu input:checked')].map(i => i.value);
    const comm = [...document.querySelectorAll('#commMenu input:checked')].map(i => i.value);
    const allComm = comm.includes('all');
    const numMois = mois.length;

    let totalCA = 0, totalVisites = 0, totalProsp = 0, joursOuvrables = 0;
    const commMap = {}, wilMap = {}, clientMap = {}, prodMap = {};

    mois.forEach(m => {
        const d = DATA[m];
        if (!d) return;
        joursOuvrables += d.summary.joursOuvrables || 22;

        d.commerciaux?.forEach(c => {
            if (!allComm && !comm.includes(c.nom)) return;
            if (!commMap[c.nom]) commMap[c.nom] = { ...c, visites: 0, prospection: 0, ca: 0 };
            commMap[c.nom].visites += c.visites;
            commMap[c.nom].prospection += c.prospection;
            commMap[c.nom].ca += c.ca;
            totalCA += c.ca;
            totalVisites += c.visites;
            totalProsp += c.prospection;
        });

        d.wilayas?.forEach(w => {
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

    const commerciaux = Object.values(commMap).sort((a, b) => b.ca - a.ca);
    const nbComm = commerciaux.length || 8;

    return {
        summary: {
            totalCA,
            totalVisites,
            totalProspection: totalProsp,
            totalWilayas: Object.keys(wilMap).length,
            numMois,
            joursOuvrables,
            nbCommerciaux: nbComm,
            objectifCA: nbComm * OBJECTIF_CA_MENSUEL * numMois,
            objectifProsp: nbComm * OBJECTIF_PROSP_MENSUEL * numMois
        },
        commerciaux,
        wilayas: Object.values(wilMap).sort((a, b) => b.ca - a.ca),
        topClients: Object.values(clientMap).sort((a, b) => b.ca - a.ca).slice(0, 5),
        topProduits: Object.values(prodMap).sort((a, b) => b.ca - a.ca).slice(0, 5)
    };
}

// UPDATE ALL
function updateAll() {
    const d = getData();
    updateKPIs(d);
    updateGauges(d);
    updateStar(d);
    updatePrediction(d);
    updateAlerts(d);
    updateTeamTable(d);
    updateCharts(d);
    updatePerformance(d);
    updateCoaching(d);
    if (map) updateMap(d);
    document.getElementById('periodeLabel').textContent = d.summary.numMois + ' mois';
    document.getElementById('teamCount').textContent = d.summary.nbCommerciaux + ' commerciaux';
}

// KPIs STRATEGIQUES
function updateKPIs(d) {
    const pctCA = Math.round(d.summary.totalCA / d.summary.objectifCA * 100) || 0;
    const pctP = Math.round(d.summary.totalProspection / d.summary.objectifProsp * 100) || 0;
    const ticketMoyen = d.summary.totalVisites ? Math.round(d.summary.totalCA / d.summary.totalVisites) : 0;
    const tauxConversion = d.summary.totalVisites ? Math.round((d.commerciaux.filter(c => c.ca > 0).length / d.summary.nbCommerciaux) * 100) : 0;

    document.getElementById('kpiGrid').innerHTML = `
        <div class="kpi-card ${getStatusClass(pctCA)}">
            <div class="kpi-icon">💰</div>
            <div class="kpi-label">CA Réalisé</div>
            <div class="kpi-value">${fmtK(d.summary.totalCA)} DA</div>
            <div class="kpi-sub">
                <span class="kpi-trend ${pctCA >= 100 ? 'up' : 'down'}">${getStatusIcon(pctCA)} ${pctCA}%</span>
                <span>vs objectif ${fmtK(d.summary.objectifCA)} DA</span>
            </div>
        </div>
        <div class="kpi-card ${getStatusClass(pctP)}">
            <div class="kpi-icon">🔍</div>
            <div class="kpi-label">Nouveaux Prospects</div>
            <div class="kpi-value">${d.summary.totalProspection}</div>
            <div class="kpi-sub">
                <span class="kpi-trend ${pctP >= 100 ? 'up' : 'down'}">${getStatusIcon(pctP)} ${pctP}%</span>
                <span>objectif: ${d.summary.objectifProsp}</span>
            </div>
        </div>
        <div class="kpi-card primary">
            <div class="kpi-icon">📍</div>
            <div class="kpi-label">Visites Terrain</div>
            <div class="kpi-value">${d.summary.totalVisites}</div>
            <div class="kpi-sub">
                <span>${d.summary.totalWilayas} wilayas couvertes</span>
            </div>
        </div>
        <div class="kpi-card primary">
            <div class="kpi-icon">💎</div>
            <div class="kpi-label">Ticket Moyen</div>
            <div class="kpi-value">${fmtK(ticketMoyen)} DA</div>
            <div class="kpi-sub">
                <span>par visite productive</span>
            </div>
        </div>
    `;
}

// JAUGES
function updateGauges(d) {
    const pctCA = Math.min(100, d.summary.totalCA / d.summary.objectifCA * 100) || 0;
    const angCA = -90 + pctCA * 1.8;
    const colorCA = pctCA >= 85 ? '#10b981' : pctCA >= 70 ? '#f59e0b' : '#ef4444';

    document.getElementById('gaugeCA').innerHTML = `
        <svg class="gauge-svg" viewBox="0 0 160 90">
            <defs>
                <linearGradient id="gCA" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#ef4444"/>
                    <stop offset="50%" stop-color="#f59e0b"/>
                    <stop offset="100%" stop-color="#10b981"/>
                </linearGradient>
            </defs>
            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#374151" stroke-width="12" stroke-linecap="round"/>
            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="url(#gCA)" stroke-width="12" stroke-linecap="round" 
                  stroke-dasharray="188" stroke-dashoffset="${188 - pctCA * 1.88}"/>
            <line x1="80" y1="80" x2="${80 + 45 * Math.cos(angCA * Math.PI / 180)}" y2="${80 + 45 * Math.sin(angCA * Math.PI / 180)}" 
                  stroke="${colorCA}" stroke-width="3" stroke-linecap="round"/>
            <circle cx="80" cy="80" r="6" fill="${colorCA}"/>
        </svg>
        <div class="gauge-value" style="color:${colorCA}">${Math.round(pctCA)}%</div>
        <div class="gauge-label">Réalisation objectif CA</div>
        <div class="gauge-target">${fmt(d.summary.totalCA)} / ${fmt(d.summary.objectifCA)}</div>
    `;

    const pctP = Math.min(100, d.summary.totalProspection / d.summary.objectifProsp * 100) || 0;
    const angP = -90 + pctP * 1.8;
    const colorP = pctP >= 85 ? '#10b981' : pctP >= 70 ? '#f59e0b' : '#ef4444';

    document.getElementById('gaugeProsp').innerHTML = `
        <svg class="gauge-svg" viewBox="0 0 160 90">
            <defs>
                <linearGradient id="gP" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#ef4444"/>
                    <stop offset="50%" stop-color="#f59e0b"/>
                    <stop offset="100%" stop-color="#10b981"/>
                </linearGradient>
            </defs>
            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#374151" stroke-width="12" stroke-linecap="round"/>
            <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="url(#gP)" stroke-width="12" stroke-linecap="round" 
                  stroke-dasharray="188" stroke-dashoffset="${188 - pctP * 1.88}"/>
            <line x1="80" y1="80" x2="${80 + 45 * Math.cos(angP * Math.PI / 180)}" y2="${80 + 45 * Math.sin(angP * Math.PI / 180)}" 
                  stroke="${colorP}" stroke-width="3" stroke-linecap="round"/>
            <circle cx="80" cy="80" r="6" fill="${colorP}"/>
        </svg>
        <div class="gauge-value" style="color:${colorP}">${Math.round(pctP)}%</div>
        <div class="gauge-label">Objectif prospection</div>
        <div class="gauge-target">${d.summary.totalProspection} / ${d.summary.objectifProsp} prospects</div>
    `;
}

// STAR PERFORMER
function updateStar(d) {
    if (!d.commerciaux.length) {
        document.getElementById('starBox').innerHTML = '<p style="text-align:center;color:var(--text-muted)">Aucune donnée</p>';
        return;
    }
    const objCA = OBJECTIF_CA_MENSUEL * d.summary.numMois;
    const objP = OBJECTIF_PROSP_MENSUEL * d.summary.numMois;

    const star = d.commerciaux.reduce((best, c) => {
        const scoreA = (best.ca / objCA) * 0.7 + (best.prospection / objP) * 0.3;
        const scoreB = (c.ca / objCA) * 0.7 + (c.prospection / objP) * 0.3;
        return scoreB > scoreA ? c : best;
    });

    const pctCA = Math.round(star.ca / objCA * 100);
    const pctP = Math.round(star.prospection / objP * 100);

    document.getElementById('starBox').innerHTML = `
        <div class="star-card">
            <div class="star-avatar">${star.initiales}</div>
            <div class="star-info">
                <div class="star-name">${star.nom}</div>
                <div class="star-stats">${star.wilaya} • ${star.visites} visites • ${fmt(star.ca)}</div>
                <div class="star-badges">
                    <span class="badge ${getStatusClass(pctCA)}">CA: ${pctCA}%</span>
                    <span class="badge ${getStatusClass(pctP)}">Prosp: ${pctP}%</span>
                </div>
            </div>
        </div>
    `;
}

// PREDICTION FIN DE MOIS
function updatePrediction(d) {
    const joursEcoules = 22; // À dynamiser
    const joursTotaux = d.summary.joursOuvrables || 22;
    const tauxJours = joursEcoules / joursTotaux;
    const projectionCA = Math.round(d.summary.totalCA / tauxJours);
    const pctProjection = Math.round(projectionCA / d.summary.objectifCA * 100);

    document.getElementById('predictionBox').innerHTML = `
        <div class="prediction-title">🔮 Projection Fin de Période</div>
        <div class="prediction-value" style="color:${pctProjection >= 100 ? 'var(--success)' : 'var(--warning)'}">${fmtK(projectionCA)} DA</div>
        <div class="prediction-detail">
            ${pctProjection >= 100 ? '✅' : '⚠️'} ${pctProjection}% de l'objectif projeté
        </div>
    `;
}

// ALERTES INTELLIGENTES
function updateAlerts(d) {
    const objCA = OBJECTIF_CA_MENSUEL * d.summary.numMois;
    const critiques = d.commerciaux.filter(c => (c.ca / objCA * 100) < SEUIL_ALERTE_ROUGE);
    const attention = d.commerciaux.filter(c => {
        const pct = c.ca / objCA * 100;
        return pct >= SEUIL_ALERTE_ROUGE && pct < SEUIL_ALERTE_ORANGE;
    });

    let html = '';
    if (critiques.length > 0) {
        html += `
            <div class="alert-box danger">
                <div class="alert-icon">🚨</div>
                <div class="alert-content">
                    <div class="alert-title">${critiques.length} commercial(s) en situation critique</div>
                    <div class="alert-text">${critiques.map(c => c.nom.split(' ').pop()).join(', ')} - Action immédiate requise</div>
                </div>
            </div>
        `;
    }
    if (attention.length > 0) {
        html += `
            <div class="alert-box warning" style="margin-top:0.5rem">
                <div class="alert-icon">⚠️</div>
                <div class="alert-content">
                    <div class="alert-title">${attention.length} commercial(s) à surveiller</div>
                    <div class="alert-text">${attention.map(c => c.nom.split(' ').pop()).join(', ')} - Suivi hebdomadaire recommandé</div>
                </div>
            </div>
        `;
    }
    if (critiques.length === 0 && attention.length === 0) {
        html = `
            <div class="alert-box success">
                <div class="alert-icon">✅</div>
                <div class="alert-content">
                    <div class="alert-title">Équipe performante</div>
                    <div class="alert-text">Tous les commerciaux sont en bonne voie pour atteindre leurs objectifs</div>
                </div>
            </div>
        `;
    }
    document.getElementById('alertsBox').innerHTML = html;
}

// TABLEAU ÉQUIPE
function updateTeamTable(d) {
    const tb = document.getElementById('teamTable');
    if (!d.commerciaux.length) {
        tb.innerHTML = '<tr><td colspan="9" style="text-align:center">Aucune donnée</td></tr>';
        return;
    }

    const objCA = OBJECTIF_CA_MENSUEL * d.summary.numMois;
    const objP = OBJECTIF_PROSP_MENSUEL * d.summary.numMois;

    tb.innerHTML = d.commerciaux.map((c, i) => {
        const pctCA = Math.round(c.ca / objCA * 100);
        const pctP = Math.round(c.prospection / objP * 100);
        const status = getStatusClass(pctCA);
        const trend = pctCA >= 85 ? '↑' : pctCA >= 70 ? '→' : '↓';
        const action = pctCA < SEUIL_ALERTE_ROUGE ? '🚨 Urgent' : pctCA < SEUIL_ALERTE_ORANGE ? '📞 Suivi' : '✅ OK';

        return `
            <tr>
                <td><span class="badge ${status}" style="min-width:24px;text-align:center">${i + 1}</span></td>
                <td><strong>${c.nom}</strong></td>
                <td>${c.wilaya}</td>
                <td>${c.visites}</td>
                <td>${c.prospection}</td>
                <td><strong>${fmt(c.ca)}</strong></td>
                <td>
                    <div style="display:flex;align-items:center;gap:0.5rem">
                        <div class="progress"><div class="progress-fill ${status}" style="width:${Math.min(100, pctCA)}%"></div></div>
                        <span class="badge ${status}">${pctCA}%</span>
                    </div>
                </td>
                <td style="font-size:1.2rem">${trend}</td>
                <td><span style="font-size:0.65rem">${action}</span></td>
            </tr>
        `;
    }).join('');
}

// GRAPHIQUES
function updateCharts(d) {
    // CA Chart (Donut)
    const ctxCA = document.getElementById('caChart');
    if (ctxCA) {
        if (caChart) caChart.destroy();
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];
        caChart = new Chart(ctxCA, {
            type: 'doughnut',
            data: {
                labels: d.commerciaux.map(c => c.nom.split(' ').pop()),
                datasets: [{
                    data: d.commerciaux.map(c => c.ca),
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: { position: 'right', labels: { color: '#9ca3af', font: { size: 10 }, boxWidth: 12 } }
                }
            }
        });
    }

    // Activity Chart (Bar)
    const ctxAct = document.getElementById('activityChart');
    if (ctxAct) {
        if (activityChart) activityChart.destroy();
        activityChart = new Chart(ctxAct, {
            type: 'bar',
            data: {
                labels: d.commerciaux.map(c => c.nom.split(' ').pop()),
                datasets: [
                    { label: 'Visites', data: d.commerciaux.map(c => c.visites), backgroundColor: '#3b82f6', borderRadius: 4 },
                    { label: 'Prospects', data: d.commerciaux.map(c => c.prospection), backgroundColor: '#10b981', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#9ca3af', font: { size: 10 } } } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#6b7280', font: { size: 9 } } },
                    y: { grid: { color: '#374151' }, ticks: { color: '#6b7280' } }
                }
            }
        });
    }
}

// PERFORMANCE PAGE
function updatePerformance(d) {
    // Ranking Chart
    const ctxRank = document.getElementById('rankingChart');
    if (ctxRank) {
        if (rankingChart) rankingChart.destroy();
        const sorted = [...d.commerciaux].sort((a, b) => b.ca - a.ca);
        const objCA = OBJECTIF_CA_MENSUEL * d.summary.numMois;
        rankingChart = new Chart(ctxRank, {
            type: 'bar',
            data: {
                labels: sorted.map(c => c.nom.split(' ').pop()),
                datasets: [{
                    label: 'CA',
                    data: sorted.map(c => c.ca),
                    backgroundColor: sorted.map(c => c.ca >= objCA ? '#10b981' : c.ca >= objCA * 0.7 ? '#f59e0b' : '#ef4444'),
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: '#374151' }, ticks: { color: '#6b7280' } },
                    y: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 10 } } }
                }
            }
        });
    }

    // Comparison Chart
    const ctxComp = document.getElementById('compChart');
    if (ctxComp) {
        if (compChart) compChart.destroy();
        const objCA = OBJECTIF_CA_MENSUEL * d.summary.numMois;
        compChart = new Chart(ctxComp, {
            type: 'bar',
            data: {
                labels: d.commerciaux.map(c => c.nom.split(' ').pop()),
                datasets: [
                    { label: 'Réalisé', data: d.commerciaux.map(c => c.ca), backgroundColor: '#3b82f6', borderRadius: 4 },
                    { label: 'Objectif', data: d.commerciaux.map(() => objCA), backgroundColor: '#374151', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#9ca3af', font: { size: 10 } } } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#6b7280', font: { size: 9 } } },
                    y: { grid: { color: '#374151' }, ticks: { color: '#6b7280' } }
                }
            }
        });
    }

    // Top Clients
    const topClientsEl = document.getElementById('topClients');
    if (topClientsEl) {
        topClientsEl.innerHTML = d.topClients.map((c, i) => `
            <div class="top-item">
                <span class="top-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'default'}">${i + 1}</span>
                <div class="top-info">
                    <div class="top-name">${c.nom}</div>
                    <div class="top-sub">${c.wilaya}</div>
                </div>
                <div class="top-value">${fmtK(c.ca)}</div>
            </div>
        `).join('');
    }

    // Top Produits
    const topProduitsEl = document.getElementById('topProduits');
    if (topProduitsEl) {
        topProduitsEl.innerHTML = d.topProduits.map((p, i) => `
            <div class="top-item">
                <span class="top-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'default'}">${i + 1}</span>
                <div class="top-info">
                    <div class="top-name">${p.nom}</div>
                    <div class="top-sub">Qté: ${p.quantite}</div>
                </div>
                <div class="top-value">${fmtK(p.ca)}</div>
            </div>
        `).join('');
    }

    // Key Metrics
    const keyMetricsEl = document.getElementById('keyMetrics');
    if (keyMetricsEl) {
        const avgVisites = d.summary.totalVisites / d.summary.nbCommerciaux;
        const avgCA = d.summary.totalCA / d.summary.nbCommerciaux;
        const conversionRate = d.summary.totalVisites ? (d.commerciaux.filter(c => c.ca > 0).length / d.summary.nbCommerciaux * 100) : 0;

        keyMetricsEl.innerHTML = `
            <div class="top-item"><span class="top-rank default">📊</span><div class="top-info"><div class="top-name">Moy. Visites/Commercial</div></div><div class="top-value">${avgVisites.toFixed(1)}</div></div>
            <div class="top-item"><span class="top-rank default">💰</span><div class="top-info"><div class="top-name">CA Moyen/Commercial</div></div><div class="top-value">${fmtK(avgCA)}</div></div>
            <div class="top-item"><span class="top-rank default">🎯</span><div class="top-info"><div class="top-name">Taux Productivité</div></div><div class="top-value">${conversionRate.toFixed(0)}%</div></div>
        `;
    }
}

// MAP
function initMap() {
    map = L.map('mapBox', { center: [34, 0], zoom: 5, scrollWheelZoom: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    markers = L.layerGroup().addTo(map);
    updateMap(getData());
}

function updateMap(d) {
    if (!map) return;
    markers.clearLayers();

    // Wilaya Chart
    const ctxWil = document.getElementById('wilayaChart');
    if (ctxWil) {
        if (wilayaChart) wilayaChart.destroy();
        wilayaChart = new Chart(ctxWil, {
            type: 'bar',
            data: {
                labels: d.wilayas.slice(0, 8).map(w => w.nom),
                datasets: [{ label: 'CA', data: d.wilayas.slice(0, 8).map(w => w.ca), backgroundColor: '#3b82f6', borderRadius: 6 }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: '#374151' }, ticks: { color: '#6b7280' } },
                    y: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 9 } } }
                }
            }
        });
    }

    // Territory Table
    const territoryTable = document.getElementById('territoryTable');
    if (territoryTable) {
        territoryTable.innerHTML = d.wilayas.map(w => {
            const comm = d.commerciaux.find(c => c.wilaya === w.nom);
            return `
                <tr>
                    <td><strong>${w.nom}</strong></td>
                    <td>${comm ? comm.nom : '-'}</td>
                    <td>${w.visites}</td>
                    <td>${fmt(w.ca)}</td>
                    <td><span class="badge ${w.potentiel === 'Très élevé' ? 'success' : w.potentiel === 'Élevé' ? 'primary' : 'warning'}">${w.potentiel || 'Moyen'}</span></td>
                </tr>
            `;
        }).join('');
    }

    // Map markers
    d.wilayas.forEach(w => {
        const coord = COORDS[w.nom];
        if (!coord) return;
        const r = 8 + (w.ca / 10000);
        const color = w.ca >= 50000 ? '#10b981' : w.ca >= 20000 ? '#f59e0b' : '#ef4444';
        L.circleMarker([coord.lat, coord.lng], {
            radius: r,
            fillColor: color,
            color: '#fff',
            weight: 2,
            fillOpacity: 0.8
        }).bindPopup(`<b>${w.nom}</b><br>CA: ${fmt(w.ca)}<br>Visites: ${w.visites}`).addTo(markers);
    });
}

// COACHING
function updateCoaching(d) {
    const objCA = OBJECTIF_CA_MENSUEL * d.summary.numMois;

    // Matrice Chart
    const ctxMat = document.getElementById('matriceChart');
    if (ctxMat) {
        if (matriceChart) matriceChart.destroy();
        const pts = d.commerciaux.map(c => ({
            x: c.visites,
            y: c.ca,
            label: c.nom.split(' ').pop(),
            pct: Math.round(c.ca / objCA * 100)
        }));

        matriceChart = new Chart(ctxMat, {
            type: 'scatter',
            data: {
                datasets: [{
                    data: pts,
                    backgroundColor: pts.map(p => p.pct >= 85 ? '#10b981' : p.pct >= 70 ? '#f59e0b' : '#ef4444'),
                    pointRadius: 12,
                    pointHoverRadius: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => `${ctx.raw.label}: ${ctx.raw.x} visites, ${fmt(ctx.raw.y)} (${ctx.raw.pct}%)`
                        }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Visites (Effort)', color: '#9ca3af' }, grid: { color: '#374151' }, ticks: { color: '#6b7280' } },
                    y: { title: { display: true, text: 'CA (Résultat)', color: '#9ca3af' }, grid: { color: '#374151' }, ticks: { color: '#6b7280' } }
                }
            }
        });
    }

    // Priority List
    const priorityEl = document.getElementById('priorityList');
    if (priorityEl) {
        const sorted = [...d.commerciaux].sort((a, b) => (a.ca / objCA) - (b.ca / objCA));
        const priorities = sorted.slice(0, 4);

        priorityEl.innerHTML = priorities.map((c, i) => {
            const pct = Math.round(c.ca / objCA * 100);
            const ecart = objCA - c.ca;
            return `
                <div class="alert-box ${pct < 50 ? 'danger' : 'warning'}" style="margin-bottom:0.5rem">
                    <div class="alert-icon">${i + 1}</div>
                    <div class="alert-content">
                        <div class="alert-title">${c.nom}</div>
                        <div class="alert-text">${c.wilaya} • ${pct}% objectif • Écart: ${fmt(ecart)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Coaching Table
    const coachingTable = document.getElementById('coachingTable');
    if (coachingTable) {
        const sorted = [...d.commerciaux].sort((a, b) => (a.ca / objCA) - (b.ca / objCA));

        coachingTable.innerHTML = sorted.map((c, i) => {
            const pct = Math.round(c.ca / objCA * 100);
            let diagnostic, action, delai;

            if (pct < 50) {
                diagnostic = '🔴 Situation critique - Écart majeur';
                action = 'Accompagnement terrain immédiat + Revue portefeuille + Formation closing';
                delai = 'Cette semaine';
            } else if (pct < 70) {
                diagnostic = '🟠 Retard significatif - Risque objectif';
                action = 'Coaching hebdomadaire + Analyse opportunités + Support négociation';
                delai = 'Sous 7 jours';
            } else if (pct < 85) {
                diagnostic = '🟡 Performance à consolider';
                action = 'Suivi bi-mensuel + Identification quick wins';
                delai = 'Sous 15 jours';
            } else {
                diagnostic = '🟢 Objectif en vue';
                action = 'Maintenir la dynamique + Partage bonnes pratiques';
                delai = 'Continu';
            }

            return `
                <tr>
                    <td><span class="badge ${pct < 50 ? 'danger' : pct < 70 ? 'warning' : 'success'}">${i + 1}</span></td>
                    <td><strong>${c.nom}</strong><br><span style="font-size:0.6rem;color:var(--text-muted)">${c.wilaya}</span></td>
                    <td style="font-size:0.65rem">${diagnostic}</td>
                    <td style="font-size:0.65rem">${action}</td>
                    <td><span class="badge ${pct < 70 ? 'danger' : 'primary'}">${delai}</span></td>
                </tr>
            `;
        }).join('');
    }
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    initFilters();
    updateAll();
});

// LOGOUT
function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}
