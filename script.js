// Elements
const totalRevenueInput = document.getElementById('total-revenue');
const avgOrderValueInput = document.getElementById('avg-order-value');
const leadResponseSlider = document.getElementById('lead-response-slider');
const prospectResponseSlider = document.getElementById('prospect-response-slider');

const customersValue = document.getElementById('customers-value');
const customersPercentage = document.getElementById('customers-percentage');
const customersProgress = document.getElementById('customers-progress');

const leadsValue = document.getElementById('leads-value');
const leadsPercentage = document.getElementById('leads-percentage');
const leadsProgress = document.getElementById('leads-progress');

const leadResponseValue = document.getElementById('lead-response-value');
const prospectResponseValue = document.getElementById('prospect-response-value');

const canvas = document.getElementById('revenueChart');
const ctx = canvas.getContext('2d');

// Chart dimensions
const chartWidth = canvas.offsetWidth;
const chartHeight = canvas.offsetHeight;

// Event listeners
totalRevenueInput.addEventListener('change', recalculate);
avgOrderValueInput.addEventListener('change', recalculate);
leadResponseSlider.addEventListener('input', handleLeadResponseChange);
prospectResponseSlider.addEventListener('input', handleProspectResponseChange);

totalRevenueInput.addEventListener('input', recalculate);
avgOrderValueInput.addEventListener('input', recalculate);

// Handle slider changes
function handleLeadResponseChange(e) {
    const value = parseFloat(e.target.value);
    leadResponseValue.textContent = value.toFixed(2) + '%';
    recalculate();
}

function handleProspectResponseChange(e) {
    const value = parseFloat(e.target.value);
    prospectResponseValue.textContent = value.toFixed(2) + '%';
    recalculate();
}

// Main calculation function
function recalculate() {
    const totalRevenue = parseFloat(totalRevenueInput.value) || 0;
    const avgOrderValue = parseFloat(avgOrderValueInput.value) || 1;
    const leadResponseRate = parseFloat(leadResponseSlider.value) || 1;
    const prospectResponseRate = parseFloat(prospectResponseSlider.value) || 1;

    // Formula 01: Customers = Revenue / Avg Order Value
    const customers = Math.round(totalRevenue / avgOrderValue);

    // Formula 02: Leads = (Customers * 100) / Lead Response Rate
    const leads = Math.round((customers * 100) / leadResponseRate);

    // Formula 03: Prospects = (Leads * 100) / Prospect Response Rate
    const prospects = Math.round((leads * 100) / prospectResponseRate);

    // Update UI
    updateCustomersCard(customers, prospects);
    updateLeadsCard(leads, prospects);
    updateChart(prospects, leads, customers);
}

function updateCustomersCard(customers, prospects) {
    customersValue.textContent = customers;
    const percentage = prospects > 0 ? (customers / prospects) * 100 : 0;
    customersPercentage.textContent = percentage.toFixed(1) + '%';
    customersProgress.style.width = Math.min(percentage, 100) + '%';
}

function updateLeadsCard(leads, prospects) {
    leadsValue.textContent = leads;
    const percentage = prospects > 0 ? (leads / prospects) * 100 : 0;
    leadsPercentage.textContent = percentage.toFixed(1) + '%';
    leadsProgress.style.width = Math.min(percentage, 100) + '%';
}

function updateChart(prospects, leads, customers) {
    // Clear canvas
    ctx.fillStyle = '#1a1f36';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Data
    const data = [
        { label: '2 weeks', value: prospects, color: '#4a6fa5' },
        { label: '3 weeks', value: prospects * 0.85, color: '#5a7fb5' },
        { label: '4 weeks', value: prospects * 0.7, color: '#6a8fc5' },
        { label: '5 weeks', value: prospects * 0.55, color: '#5a7fb5' },
        { label: '6 weeks', value: prospects * 0.4, color: '#4a6fa5' },
        { label: '10 weeks', value: prospects * 0.25, color: '#3a5f95' },
        { label: '20 weeks', value: prospects * 0.1, color: '#2a4f85' }
    ];

    const maxValue = prospects || 100;
    const padding = 40;
    const barWidth = (canvas.width - padding * 2) / data.length;
    const chartArea = canvas.height - padding * 2;

    // Draw title and labels
    ctx.fillStyle = '#e0e0e0';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Prospects by Period', padding, 25);

    // Draw bars
    data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * chartArea;
        const x = padding + index * barWidth + 15;
        const y = canvas.height - padding - barHeight;

        // Draw bar
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth - 30, barHeight);

        // Draw value on bar
        if (barHeight > 20) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(Math.round(item.value), x + (barWidth - 30) / 2, y + barHeight - 8);
        }
    });

    // Draw Y-axis
    ctx.strokeStyle = '#3a4455';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();

    // Draw X-axis
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw Y-axis labels
    ctx.fillStyle = '#8a9aaa';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round((maxValue / 5) * i);
        const y = canvas.height - padding - (chartArea / 5) * i;
        ctx.fillText(value, padding - 10, y + 4);

        // Grid lines
        if (i > 0) {
            ctx.strokeStyle = '#2a3f55';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }
    }

    // Draw X-axis labels
    ctx.fillStyle = '#8a9aaa';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    data.forEach((item, index) => {
        const x = padding + index * barWidth + barWidth / 2;
        ctx.fillText(item.label, x, canvas.height - padding + 20);
    });
}

// Initial calculation
recalculate();

// Resize handler
window.addEventListener('resize', () => {
    recalculate();
});
