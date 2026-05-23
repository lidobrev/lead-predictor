document.addEventListener('DOMContentLoaded', () => {
  const revenue = document.getElementById('revenue');
  const aov = document.getElementById('aov');
  const currency = document.getElementById('currency');

  const revenueCurrency = document.getElementById('revenueCurrency');
  const aovCurrency = document.getElementById('aovCurrency');

  const leadRate = document.getElementById('leadRate');
  const prospectRate = document.getElementById('prospectRate');

  const leadRateLabel = document.getElementById('leadRateLabel');
  const prospectRateLabel = document.getElementById('prospectRateLabel');

  const prospectsValue = document.getElementById('prospectsValue');
  const leadsValue = document.getElementById('leadsValue');
  const customersValue = document.getElementById('customersValue');

  const prospectPercent = document.getElementById('prospectPercent');
  const leadPercent = document.getElementById('leadPercent');
  const customerPercent = document.getElementById('customerPercent');

  const leadBar = document.getElementById('leadBar');
  const customerBar = document.getElementById('customerBar');

  const chart = document.getElementById('chart');

  function setRangeFill(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const value = Number(input.value);

    const percent = ((value - min) / (max - min)) * 100;

    input.style.setProperty('--fill', percent + '%');
  }

  function calculate() {
    const totalRevenue = Number(revenue.value) || 0;
    const avgOrderValue = Number(aov.value) || 1;

    const leadResponseRate = Number(leadRate.value) || 1;
    const prospectResponseRate = Number(prospectRate.value) || 1;

    // Formula 01
    const customers = Math.ceil(totalRevenue / avgOrderValue);

    // Formula 02
    const leads = Math.ceil((customers * 100) / leadResponseRate);

    // Formula 03
    const prospects = Math.ceil((leads * 100) / prospectResponseRate);

    customersValue.textContent = customers;
    leadsValue.textContent = leads;
    prospectsValue.textContent = prospects;

    leadRateLabel.textContent =
      leadResponseRate.toFixed(2) + '%';

    prospectRateLabel.textContent =
      prospectResponseRate.toFixed(2) + '%';

    prospectPercent.textContent = '100%';

    leadPercent.textContent =
      Math.round((leads / prospects) * 100) + '%';

    customerPercent.textContent =
      Math.round((customers / prospects) * 100) + '%';

    leadBar.style.width =
      ((leads / prospects) * 100) + '%';

    customerBar.style.width =
      ((customers / prospects) * 100) + '%';

    setRangeFill(leadRate);
    setRangeFill(prospectRate);

    drawChart(prospects, leads, customers);
  }

  function drawChart(prospects, leads, customers) {
    chart.innerHTML = '';

    const months = 6;
    const max = 125;
    const rowHeight = 57;

    for (let i = 1; i <= months; i++) {

      const row = document.createElement('div');
      row.className = 'month-row';

      row.style.top =
        ((i - 1) * rowHeight) + 'px';

      row.style.width = '100%';

      const monthProspects =
        Math.ceil((prospects / months) * i);

      const monthLeads =
        Math.ceil((leads / months) * i);

      const monthCustomers =
        Math.ceil((customers / months) * i);

      // MAIN BAR
      const prospectsBar =
        document.createElement('span');

      prospectsBar.className = 'prospects';

      prospectsBar.style.width =
        Math.min((monthProspects / max) * 100, 100) + '%';

      // LEADS BAR
      const leadsBar =
        document.createElement('span');

      leadsBar.className = 'leads';

      leadsBar.style.width =
        Math.min((monthLeads / max) * 100, 100) + '%';

      // CUSTOMERS BAR
      const customersBar =
        document.createElement('span');

      customersBar.className = 'customers';

      customersBar.style.width =
        Math.min((monthCustomers / max) * 100, 100) + '%';

      // TOOLTIP
      const tooltip =
        document.createElement('div');

      tooltip.className = 'tooltip';

      tooltip.innerHTML = `
        Month #${i}<br>
        Prospects: ${monthProspects}<br>
        Leads: ${monthLeads}<br>
        Customers: ${monthCustomers}
      `;

      tooltip.style.display = 'none';

      row.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
      });

      row.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });

      row.appendChild(prospectsBar);
      row.appendChild(leadsBar);
      row.appendChild(customersBar);
      row.appendChild(tooltip);

      chart.appendChild(row);
    }
  }

  function updateCurrency() {
    revenueCurrency.textContent = currency.value;
    aovCurrency.textContent = currency.value;
  }

  revenue.addEventListener('input', calculate);
  aov.addEventListener('input', calculate);

  leadRate.addEventListener('input', calculate);
  prospectRate.addEventListener('input', calculate);

  currency.addEventListener('change', () => {
    updateCurrency();
    calculate();
  });

  updateCurrency();
  calculate();
});