// ============================================================
// BOUCHAMA HEITHEM - SITE VITRINE INTERACTIVE SCRIPT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Site Vitrine BOUCHAMA HEITHEM Initialisé avec succès (661686562.xyz)');

  // --- NAVBAR SCROLL EFFECT ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.padding = '12px 0';
      navbar.style.background = 'rgba(10, 14, 23, 0.92)';
    } else {
      navbar.style.padding = '18px 0';
      navbar.style.background = 'rgba(10, 14, 23, 0.75)';
    }
  });

  // --- CALCULATEUR DE DEVIS EXPRESS ---
  const devisForm = document.getElementById('devis-form');
  const resultBox = document.getElementById('devis-result');

  if (devisForm) {
    devisForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const clientName = document.getElementById('client-name').value;
      const clientPhone = document.getElementById('client-phone').value;
      const powerNeeded = document.getElementById('power-select').value;
      const durationDays = parseInt(document.getElementById('duration-select').value) || 1;
      const serviceType = document.getElementById('service-type').value;

      // Calcul indicatif pour l'estimation
      let baseRatePerDay = 15000; // Tarif de base indicative par jour en DZD
      if (powerNeeded.includes('400')) baseRatePerDay = 25000;
      if (powerNeeded.includes('800')) baseRatePerDay = 45000;

      const totalEstimated = baseRatePerDay * durationDays;

      // Formatage du message
      const summaryText = `Bonjour M. BOUCHAMA,\nJe souhaite recevoir un devis officiel :\n\n- Client : ${clientName}\n- Téléphone : ${clientPhone}\n- Puissance requise : ${powerNeeded}\n- Durée : ${durationDays} jour(s)\n- Prestation : ${serviceType}\n- Estimation indicative : ${totalEstimated.toLocaleString()} DZD`;

      // Affichage du résultat dans l'interface
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div style="background: rgba(0, 210, 255, 0.1); border: 1px solid var(--accent-cyan); padding: 20px; border-radius: var(--radius-sm); margin-top: 20px;">
          <h4 style="color: var(--accent-cyan); margin-bottom: 8px;">✓ Estimation Générée</h4>
          <p style="margin-bottom: 12px; font-size: 0.95rem;">Estimation indicative : <strong>${totalEstimated.toLocaleString()} DZD HT</strong> pour ${durationDays} jour(s).</p>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="https://wa.me/213559860024?text=${encodeURIComponent(summaryText)}" target="_blank" class="btn btn-primary" style="padding: 10px 18px; font-size: 0.9rem;">
              💬 Envoyer la demande par WhatsApp (0559 86 00 24)
            </a>
            <a href="mailto:contact@661686562.xyz?subject=Demande%20de%20Devis%20BOUCHAMA&body=${encodeURIComponent(summaryText)}" class="btn btn-outline" style="padding: 10px 18px; font-size: 0.9rem;">
              ✉️ Envoyer par Email
            </a>
          </div>
        </div>
      `;
    });
  }
});
