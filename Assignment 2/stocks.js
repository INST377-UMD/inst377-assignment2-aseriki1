const POLYGON_API_KEY = 'Ql6jpSolMdiC5MVUhvvRVj3DVRLq_OoD';
const REDDIT_STOCKS_API = 'https://tradestie.com/api/v1/apps/reddit?date=2022-04-03';

// Fetch stock data and render the chart
async function fetchStock() {
    const ticker = document.getElementById('ticker').value.toUpperCase();
    const days = document.getElementById('days').value;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    try {
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${start}/${end}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            alert('No data found for this stock.');
            return;
        }

        const labels = data.results.map(item => new Date(item.t).toLocaleDateString());
        const values = data.results.map(item => item.c);

        renderChart(ticker, labels, values);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        alert('An error occurred while fetching stock data. Please try again.');
    }
}

// Render the chart using Chart.js
function renderChart(ticker, labels, values) {
    const ctx = document.getElementById('stock-chart').getContext('2d');

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `${ticker} Closing Prices`,
                data: values,
                borderColor: 'blue',
                backgroundColor: 'rgba(173, 216, 230, 0.5)',
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    }
                }
            }
        }
    });
}

// Fetch the top 5 Reddit stocks
async function fetchTopRedditStocks() {
    try {
        const response = await fetch(REDDIT_STOCKS_API);
        const data = await response.json();
        const top5 = data.slice(0, 5);

        const tableBody = document.querySelector('#reddit-stocks tbody');
        tableBody.innerHTML = '';

        top5.forEach(stock => {
            const sentimentIcon = stock.sentiment === 'Bullish' ? '🐂' : '🐻';
            const row = `
                <tr>
                    <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
                    <td>${stock.no_of_comments}</td>
                    <td>${sentimentIcon}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching Reddit stocks:', error);
    }
}

// Initialize the page
window.onload = () => {
    fetchTopRedditStocks();
};
