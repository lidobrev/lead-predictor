document.addEventListener('DOMContentLoaded', () => {
  const language = document.getElementById('language');
  const languageFlag = document.getElementById('languageFlag');

  const revenue = document.getElementById('revenue');
  const aov = document.getElementById('aov');
  const currency = document.getElementById('currency');

  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');

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

  const yTitle = document.querySelector('.y-title');

  const labels = {
    us: {
      language: 'Language',
      currency: 'Currency',
      campaignStart: 'Campaign Start',
      campaignEnd: 'Campaign End',
      totalRevenue: 'Total Revenue',
      avgOrderValue: 'Avg. Order Value',
      prospects: 'Prospects',
      leads: 'Leads',
      customers: 'Customers',
      leadResponseRate: 'Lead Response Rate',
      prospectResponseRate: 'Prospect Response Rate',
      months: 'Months',
      month: 'Month',
      people: 'people'
    },
    bg: {
      language: 'Език',
      currency: 'Валута',
      campaignStart: 'Начало на кампанията',
      campaignEnd: 'Край на кампанията',
      totalRevenue: 'Общ оборот',
      avgOrderValue: 'Средна стойност на поръчка',
      prospects: 'Контакти',
      leads: 'Потенциални клиенти',
      customers: 'Клиенти',
      leadResponseRate: 'Процент отговори от потенциални клиенти',
      prospectResponseRate: 'Процент отговори от контакти',
      months: 'Месеци',
      month: 'Месец',
      people: 'души'
    }
  };

  function currentLang() {
    return language.value;
  }

  function t(key) {
    return labels[currentLang()][key];
  }

  function updateLanguageFlag() {
    languageFlag.className = 'flag-icon ' + currentLang();
  }

  function updateTexts() {
    const controlLabels = document.querySelectorAll('.controls-panel > label > span');

    controlLabels[0].textContent = t('currency');
    controlLabels[1].textContent = t('campaignStart');
    controlLabels[2].textContent = t('campaignEnd');
    controlLabels[3].textContent = t('totalRevenue');
    controlLabels[4].textContent = t('avgOrderValue');

    const languageLabel = document.querySelector('.language-label');
    if (languageLabel) languageLabel.textContent = t('language');

    document.querySelector('.stat-card:nth-child(1) .stat-head b').textContent = t('prospects');
    document.querySelector('.stat-card:nth-child(2) .stat-head b').textContent = t('leads');
    document.querySelector('.stat-card:nth-child(3) .stat-head b').textContent = t('customers');

    document.querySelector('.slider-row:nth-child(1) span').textContent = t('leadResponseRate');
    document.querySelector('.slider-row:nth-child(2) span').textContent = t('prospectResponseRate');

    yTitle.textContent = t('months');

    document.querySelectorAll('.x-labels span').forEach((item) => {
      const number = item.textContent.split(' ')[0];
      item.textContent = number + ' ' + t('people');
    });
  }

  function setRangeFill(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const value = Number(input.value);
    const percent = ((value - min) / (max - min)) * 100;

    input.style.setProperty('--fill', percent + '%');
  }

  function getMonthsCount() {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    if (isNaN(start) || isNaN(end) || end <= start) {
      return 1;
    }

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    return Math.max(1, years * 12 + months + 1);
  }

  function calculate() {
    const totalRevenue = Number(revenue.value) || 0;
    const avgOrderValue = Number(aov.value) || 1;

    const leadResponseRate = Number(leadRate.value) || 1;
    const prospectResponseRate = Number(prospectRate.value) || 1;

    const customers = Math.ceil(totalRevenue / avgOrderValue);
    const leads = Math.ceil((customers * 100) / leadResponseRate);
    const prospects = Math.ceil((leads * 100) / prospectResponseRate);

    customersValue.textContent = customers;
    leadsValue.textContent = leads;
    prospectsValue.textContent = prospects;

    leadRateLabel.textContent = leadResponseRate.toFixed(2) + '%';
    prospectRateLabel.textContent = prospectResponseRate.toFixed(2) + '%';

    prospectPercent.textContent = '100%';
    leadPercent.textContent = Math.round((leads / prospects) * 100) + '%';
    customerPercent.textContent = Math.round((customers / prospects) * 100) + '%';

    leadBar.style.width = ((leads / prospects) * 100) + '%';
    customerBar.style.width = ((customers / prospects) * 100) + '%';

    setRangeFill(leadRate);
    setRangeFill(prospectRate);

    drawChart(prospects, leads, customers);
  }

  function drawChart(prospects, leads, customers) {
    chart.innerHTML = '';

    const months = 6;
    const max = Math.max(prospects, 125);
    const rowHeight = 57;
    const barHeight = 51;
    const startTop = 0;

    for (let i = 1; i <= months; i++) {
      const row = document.createElement('div');
      row.className = 'month-row';
      row.style.top = startTop + (i - 1) * rowHeight + 'px';
      row.style.height = barHeight + 'px';
      row.style.width = '100%';

      const monthProspects = Math.ceil((prospects / months) * i);
      const monthLeads = Math.ceil((leads / months) * i);
      const monthCustomers = Math.ceil((customers / months) * i);

      const prospectsBar = document.createElement('span');
      prospectsBar.className = 'prospects';
      prospectsBar.style.width = Math.min((monthProspects / max) * 100, 100) + '%';

      const leadsBar = document.createElement('span');
      leadsBar.className = 'leads';
      leadsBar.style.width = Math.min((monthLeads / max) * 100, 100) + '%';

      const customersBar = document.createElement('span');
      customersBar.className = 'customers';
      customersBar.style.width = Math.min((monthCustomers / max) * 100, 100) + '%';

      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.innerHTML = `
        ${t('month')} #${i}<br>
        ${t('prospects')}: ${monthProspects}<br>
        ${t('leads')}: ${monthLeads}<br>
        ${t('customers')}: ${monthCustomers}
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
  startDate.addEventListener('change', calculate);
  endDate.addEventListener('change', calculate);

  currency.addEventListener('change', () => {
    updateCurrency();
    calculate();
  });

  language.addEventListener('change', () => {
    updateLanguageFlag();
    updateTexts();
    calculate();
  });

  updateLanguageFlag();
  updateTexts();
  updateCurrency();
  calculate();
});