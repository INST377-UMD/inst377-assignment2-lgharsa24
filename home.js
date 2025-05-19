setupGlobalVoiceCommands();

window.addEventListener('DOMContentLoaded', () => {
  const stocksBtn = document.getElementById('stocksPageBtn');
  const dogsBtn = document.getElementById('dogsPageBtn');
  if (stocksBtn) stocksBtn.onclick = () => window.location = 'stocks.html';
  if (dogsBtn) dogsBtn.onclick = () => window.location = 'dogs.html';

  fetch('https://api.quotable.io/random')
    .then(res => res.json())
    .then(data => {
      document.getElementById('quote').innerText = `"${data.content}" - ${data.author}`;
    });
});
