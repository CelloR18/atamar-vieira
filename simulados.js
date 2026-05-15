
window.addEventListener('load', () => {
  const loading = document.getElementById('loadingScreen');

  setTimeout(() => {
    loading.style.opacity = '0';
    loading.style.pointerEvents = 'none';
  }, 1800);
});

const searchInput = document.getElementById('searchInput');
const cards = document.querySelectorAll('.simulado-card');

searchInput.addEventListener('keyup', () => {

  const value = searchInput.value.toLowerCase();

  cards.forEach(card => {

    const name = card.dataset.name.toLowerCase();

    if(name.includes(value)){
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }

  });

});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

const installButtons = [
  document.getElementById('installBtn'),
  document.getElementById('installBtnHero')
];

installButtons.forEach(button => {

  button.addEventListener('click', async () => {

    if(deferredPrompt){

      deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;

      if(outcome === 'accepted'){
        console.log('App instalado');
      }

      deferredPrompt = null;

    } else {
      alert('Para instalar no iPhone use: Compartilhar > Adicionar à Tela Inicial');
    }

  });

});

if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}

const progressValue = document.getElementById('progressValue');

let progress = 0;

const progressAnimation = setInterval(() => {

  progress++;
  progressValue.innerHTML = progress + '%';

  if(progress >= 78){
    clearInterval(progressAnimation);
  }

}, 30);