
const POLYGON_API_KEY = 'HTkQa8lspwhoCNFiSSTwx70dhXue_uHw';

let chartInstance = null;

function renderChart(labels, data) {
  const ctx = document.getElementById('stockChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Closing Price',
        data: data,
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
        tension: 0.2
      }]
    }
  });
}

function fetchStockData(ticker, days) {
  const end = Math.floor(Date.now() / 1000);
  const start = end - days * 24 * 3600;
  const startDate = new Date(start * 1000).toISOString().split('T')[0];
  const endDate = new Date(end * 1000).toISOString().split('T')[0];

  fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (!data.results || !data.results.length) {
        alert('No data found for this ticker.');
        renderChart([], []);
        return;
      }
      const labels = data.results.map(d => new Date(d.t).toLocaleDateString());
      const prices = data.results.map(d => d.c);
      renderChart(labels, prices);
    })
    .catch(() => {
      alert('Error fetching stock data.');
      renderChart([], []);
    });
}

function fetchRedditStocks() {
  fetch('https://tradestie.com/api/v1/apps/reddit')
    .then(res => res.json())
    .then(data => {
      const top5 = data.slice(0, 5);
      const tbody = document.querySelector('#redditTable tbody');
      tbody.innerHTML = '';
      top5.forEach(stock => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${stock.ticker}</td>
          <td>${stock.no_of_comments}</td>
          <td class="${stock.sentiment === 'Bullish' ? 'bullish' : 'bearish'}">
            ${stock.sentiment === 'Bullish' ? '🐂' : '🐻'} ${stock.sentiment}
          </td>
          <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">Yahoo Finance</a></td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(() => {

      const tbody = document.querySelector('#redditTable tbody');
      tbody.innerHTML = '<tr><td colspan="4">Failed to load Reddit stocks.</td></tr>';
    });
}

window.addEventListener('DOMContentLoaded', () => {

  document.getElementById('lookupBtn').onclick = () => {
    const ticker = document.getElementById('tickerInput').value.trim();
    const days = parseInt(document.getElementById('daysSelect').value, 10);
    if (!ticker) return alert('Please enter a ticker.');
    fetchStockData(ticker, days);
  };


  fetchRedditStocks();


 setupGlobalVoiceCommands({
    'lookup *stock': function(stock) {
      document.getElementById('tickerInput').value = stock.toUpperCase();
      document.getElementById('daysSelect').value = '30';
      fetchStockData(stock, 30);
    }
  });
});
