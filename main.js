function setupGlobalVoiceCommands(extraCommands = {}) {
    if (window.annyang) {
      const commands = {
        'hello': () => alert('Hello World'),
        'change the color to *color': color => document.body.style.backgroundColor = color,
        'navigate to *page': page => {
          const pageMap = { home: 'index.html', stocks: 'stocks.html', dogs: 'dogs.html' };
          const dest = pageMap[page.toLowerCase()];
          if (dest) window.location.href = dest;
        },
        ...extraCommands
      };
      annyang.removeCommands();
      annyang.addCommands(commands);
    }
  }
  
  function startAudio() {
    if (window.annyang) annyang.start();
  }
  function stopAudio() {
    if (window.annyang) annyang.abort();
  }
  window.startAudio = startAudio;
  window.stopAudio = stopAudio;
  
  window.addEventListener('DOMContentLoaded', () => {
    const onBtn = document.getElementById('audioOnBtn');
    const offBtn = document.getElementById('audioOffBtn');
    if (onBtn) onBtn.addEventListener('click', startAudio);
    if (offBtn) offBtn.addEventListener('click', stopAudio);
  });
  