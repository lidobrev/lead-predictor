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

  const startDateDisplay =
    document.getElementById('startDateDisplay');

  const endDateDisplay =
    document.getElementById('endDateDisplay');

  const yLabels = document.querySelector('.y-labels');

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
      avgOrderValue: 'Средна стойност',
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
    languageFlag.className =
      'flag-icon ' + currentLang();
  }

  function updateTexts() {
    const controlLabels =
      document.querySelectorAll(
        '.controls-panel label > span'
      );

    controlLabels[0].textContent =
      t('language');

    controlLabels[1].textContent =
      t('currency');

    controlLabels[2].textContent =
      t('campaignStart');

    controlLabels[3].textContent =
      t('campaignEnd');

    controlLabels[4].textContent =
      t('totalRevenue');

    controlLabels[5].textContent =
      t('avgOrderValue');

    document.querySelector(
      '.stat-card:nth-child(1) .stat-head b'
    ).textContent = t('prospects');

    document.querySelector(
      '.stat-card:nth-child(2) .stat-head b'
    ).textContent = t('leads');

    document.querySelector(
      '.stat-card:nth-child(3) .stat-head b'
    ).textContent = t('customers');

    document.querySelector(
      '.slider-row:nth-child(1) span'
    ).textContent = t('leadResponseRate');

    document.querySelector(
      '.slider-row:nth-child(2) span'
    ).textContent = t('prospectResponseRate');

    yTitle.textContent = t('months');

    document.querySelectorAll(
      '.x-labels span'
    ).forEach((item) => {
      const number =
        item.textContent.split(' ')[0];

      item.textContent =
        number + ' ' + t('people');
    });
  }

  function formatDate(value) {
    const date = new Date(value);

    if (isNaN(date)) return '';

    return date.toLocaleDateString(
      currentLang() === 'bg'
        ? 'bg-BG'
        : 'en-US',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  function updateDateDisplays() {
    if(startDateDisplay){
      startDateDisplay.textContent =
        formatDate(startDate.value);
    }

    if(endDateDisplay){
      endDateDisplay.textContent =
        formatDate(endDate.value);
    }
  }

  function setRangeFill(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const value = Number(input.value);

    const percent =
      ((value - min) / (max - min)) * 100;

    input.style.setProperty(
      '--fill',
      percent + '%'
    );
  }

  function calculate() {
    const totalRevenue =
      Number(revenue.value) || 0;

    const avgOrderValue =
      Number(aov.value) || 1;

    const leadResponseRate =
      Number(leadRate.value) || 1;

    const prospectResponseRate =
      Number(prospectRate.value) || 1;

    const customers =
      Math.ceil(
        totalRevenue / avgOrderValue
      );

    const leads =
      Math.ceil(
        (customers * 100) /
        leadResponseRate
      );

    const prospects =
      Math.ceil(
        (leads * 100) /
        prospectResponseRate
      );

    customersValue.textContent =
      customers;

    leadsValue.textContent =
      leads;

    prospectsValue.textContent =
      prospects;

    leadRateLabel.textContent =
      leadResponseRate.toFixed(2) + '%';

    prospectRateLabel.textContent =
      prospectResponseRate.toFixed(2) + '%';

    prospectPercent.textContent =
      '100%';

    leadPercent.textContent =
      Math.round(
        (leads / prospects) * 100
      ) + '%';

    customerPercent.textContent =
      Math.round(
        (customers / prospects) * 100
      ) + '%';

    leadBar.style.width =
      ((leads / prospects) * 100) + '%';

    customerBar.style.width =
      ((customers / prospects) * 100) + '%';

    setRangeFill(leadRate);
    setRangeFill(prospectRate);

    drawChart(
      prospects,
      leads,
      customers
    );
  }

function getMonthsCount() {
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  if (isNaN(start) || isNaN(end) || end <= start) {
    return 1;
  }

  const yearsDiff =
    end.getFullYear() -
    start.getFullYear();

  const monthsDiff =
    end.getMonth() -
    start.getMonth();

  return Math.max(
    1,
    yearsDiff * 12 + monthsDiff
  );
}

function drawChart(prospects, leads, customers) {
  chart.innerHTML = '';

  const months = getMonthsCount();
yLabels.innerHTML = '';

for (let i = 1; i <= months; i++) {
const label = document.createElement('span');

label.textContent = i;

yLabels.appendChild(label);
}
  const max = Math.max(prospects, 125);
  const rowHeight = 57;
  const barHeight = 51;

  const chartHeight = months * rowHeight;

  chart.style.height = chartHeight + 'px';
  chart.closest('.chart-wrap').style.minHeight = chartHeight + 39 + 'px';
  chart.closest('.chart-card').style.minHeight = chartHeight + 76 + 'px'; 

  for (let i = 1; i <= months; i++) {
    const row = document.createElement('div');
    row.className = 'month-row';

    row.style.top = ((i - 1) * rowHeight) + 'px';
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

    row.addEventListener('mousemove', (event) => {
    const chartRect = chart.getBoundingClientRect();

    tooltip.style.display = 'block';
    tooltip.style.left = event.clientX - chartRect.left + 12 + 'px';
    tooltip.style.top = event.clientY - chartRect.top + 12 + 'px';
    });

    row.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
    });

    row.appendChild(prospectsBar);
    row.appendChild(leadsBar);
    row.appendChild(customersBar);
    chart.appendChild(tooltip);

    chart.appendChild(row);
  }
}

  function updateCurrency() {
    revenueCurrency.textContent =
      currency.value;

    aovCurrency.textContent =
      currency.value;
  }

  revenue.addEventListener(
    'input',
    calculate
  );

  aov.addEventListener(
    'input',
    calculate
  );

  leadRate.addEventListener(
    'input',
    calculate
  );

  prospectRate.addEventListener(
    'input',
    calculate
  );

  startDate.addEventListener(
    'change',
    () => {
      updateDateDisplays();
      calculate();
    }
  );

  endDate.addEventListener(
    'change',
    () => {
      updateDateDisplays();
      calculate();
    }
  );

  currency.addEventListener(
    'change',
    () => {
      updateCurrency();
      calculate();
    }
  );

  language.addEventListener(
    'change',
    () => {
      updateLanguageFlag();
      updateTexts();
      updateDateDisplays();
      calculate();
    }
  );

  updateLanguageFlag();
  updateTexts();
  updateDateDisplays();
  updateCurrency();
  calculate();
});