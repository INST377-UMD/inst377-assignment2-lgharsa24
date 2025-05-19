let breedsList = [];

function loadDogCarousel() {
  fetch('https://api.thedogapi.com/v1/images/search?limit=10')
    .then(res => res.json())
    .then(images => {
      const carousel = document.getElementById('dogCarousel');
      carousel.innerHTML = '';
      images.forEach(img => {
        const image = document.createElement('img');
        image.src = img.url;
        image.alt = 'Dog';
        image.style.maxHeight = '230px';
        image.style.maxWidth = '90%';
        image.style.margin = '0 auto';
        carousel.appendChild(image);
      });
      simpleslider.getSlider();
    });
}

function showBreedInfo(breed) {
  const infoDiv = document.getElementById('breedInfo');
  infoDiv.innerHTML = `
    <h3>${breed.name}</h3>
    <p>${breed.description || 'No description available.'}</p>
    <p><b>Min Life:</b> ${breed.life_span ? breed.life_span.split(' - ')[0] : 'N/A'} years</p>
    <p><b>Max Life:</b> ${breed.life_span ? breed.life_span.split(' - ')[1] || breed.life_span.split(' - ')[0] : 'N/A'} years</p>
  `;
  infoDiv.style.display = 'block';
}

function loadBreedButtons() {
  fetch('https://api.thedogapi.com/v1/breeds')
    .then(res => res.json())
    .then(breeds => {
      breedsList = breeds;
      const btnsDiv = document.getElementById('breedButtons');
      btnsDiv.innerHTML = '';
      breeds.forEach(breed => {
        const btn = document.createElement('button');
        btn.innerText = breed.name;
        btn.className = 'custom-btn';
        btn.onclick = () => showBreedInfo(breed);
        btnsDiv.appendChild(btn);
      });
    });
}

window.addEventListener('DOMContentLoaded', () => {
  setupGlobalVoiceCommands({
    'load dog breed *breed': function(breedName) {
      const breed = breedsList.find(b => b.name.toLowerCase() === breedName.toLowerCase());
      if (breed) showBreedInfo(breed);
      else alert('Breed not found!');
    }
  });

  loadDogCarousel();
  loadBreedButtons();
});
