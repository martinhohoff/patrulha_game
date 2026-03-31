const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const targetDisplay = document.getElementById('target-display');
const promptLabel = document.getElementById('prompt-label');
const characterImg = document.getElementById('character-img');
const character = document.getElementById('character');
const obstaclesEl = document.getElementById('obstacles');
const progressEl = document.getElementById('progress');
const restartBtn = document.getElementById('restart');
const posterGrid = document.getElementById('poster-grid');
const track = document.getElementById('track');
const instructionEl = document.getElementById('instruction');
const mobileKeyboard = document.getElementById('mobile-keyboard');
const endInstructionEl = document.getElementById('end-instruction');

const characters = {
  1: { name: 'Marshall', say: 'Márchal', file: '1_marshall.png' },
  2: { name: 'Rubble', say: 'Rôbou', file: '2_rubble.png' },
  3: { name: 'Chase', say: 'Tchêiz', file: '3_chase.png' },
  4: { name: 'Rocky', say: 'Roque', file: '4_rocky.png' },
  5: { name: 'Zuma', say: 'Zuma', file: '5_zuma.png' },
  6: { name: 'Skye', say: 'Iskai', file: '6_skye.png' }
};

const stepsTotal = 10;
let currentStep = 0;
let currentTarget = '';
let currentType = 'Letra';
let selectedCharacter = null;
let isActive = false;
let inputLocked = false;
let startX = 20;
let endX = 0;
let stepDistance = 110;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function isPhoneLikeDevice() {
  return window.innerWidth <= 900 && (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

function applyMobileMode() {
  document.body.classList.toggle('mobile-mode', isPhoneLikeDevice());
}

function buildMobileKeyboard() {
  letters.forEach((letter) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mobile-key';
    button.textContent = letter;
    button.setAttribute('aria-label', `Letra ${letter}`);
    button.dataset.letter = letter;
    button.addEventListener('click', () => handleKeyInput(letter));
    mobileKeyboard.appendChild(button);
  });
  updateMobileKeyboard();
}

function updateMobileKeyboard() {
  if (!mobileKeyboard) return;
  mobileKeyboard.querySelectorAll('.mobile-key').forEach((button) => {
    button.disabled = !isActive || inputLocked;
    button.classList.toggle('is-target', button.dataset.letter === currentTarget && isActive && !inputLocked);
  });
}

function buildPoster() {
  Object.entries(characters).forEach(([id, info]) => {
    const card = document.createElement('div');
    card.className = 'poster-card';
    card.innerHTML = `
      <img src="${info.file}" alt="${info.name}" />
      <div>${id}. ${info.name}</div>
    `;
    posterGrid.appendChild(card);
  });
}

function showScreen(screen) {
  [startScreen, gameScreen, endScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
  document.body.classList.toggle('using-touch-phone', screen === gameScreen && isPhoneLikeDevice());
}

function speak(text, lang = 'pt-BR') {
  if (!('speechSynthesis' in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.9;
  utter.pitch = 1.1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function speakAsync(text, lang = 'pt-BR') {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.9;
    utter.pitch = 1.1;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  });
}
function playBeep(freq = 660, duration = 0.18) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.value = 0.1;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
  osc.onended = () => ctx.close();
}

function playCelebration() {
  const notes = [523, 659, 784, 1046];
  notes.forEach((f, i) => setTimeout(() => playBeep(f, 0.2), i * 220));
}

function playApplause() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const now = ctx.currentTime;
  for (let i = 0; i < 8; i++) {
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < data.length; j++) {
      data[j] = (Math.random() * 2 - 1) * 0.4;
    }
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.2, now + i * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.12);
    noise.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now + i * 0.12);
    noise.stop(now + i * 0.12 + 0.14);
  }
  setTimeout(() => ctx.close(), 1500);
}

function computeTrackMetrics() {
  const width = track.clientWidth;
  const treatWidth = 90;
  const rightPadding = 30;
  const leftPadding = 40;
  startX = leftPadding;
  endX = Math.max(startX + 260, width - treatWidth - rightPadding);
  stepDistance = (endX - startX) / stepsTotal;
}

function resetObstacles() {
  computeTrackMetrics();
  obstaclesEl.innerHTML = '';
  const obstacleSize = Math.max(40, Math.min(80, stepDistance * 0.6));
  for (let i = 1; i <= stepsTotal; i++) {
    const obs = document.createElement('div');
    obs.className = 'obstacle';
    const left = startX + i * stepDistance - obstacleSize / 2;
    obs.style.width = `${obstacleSize}px`;
    obs.style.height = `${obstacleSize}px`;
    obs.style.left = `${left}px`;
    obstaclesEl.appendChild(obs);
  }
}

function setTarget(letter) {
  currentType = 'Letra';
  currentTarget = letter;
  promptLabel.textContent = currentType;
  targetDisplay.textContent = currentTarget;
  updateMobileKeyboard();
}

function nextTarget() {
  setTarget(letters[Math.floor(Math.random() * letters.length)]);
  speak(`${currentType} ${currentTarget}`);
}

function startGame() {
  currentStep = 0;
  progressEl.textContent = `${currentStep}/${stepsTotal}`;
  isActive = true;
  inputLocked = true;
  instructionEl.textContent = isPhoneLikeDevice() ? 'Toque na letra certa' : 'Aperte a letra certa';
  showScreen(gameScreen);
  requestAnimationFrame(() => {
    computeTrackMetrics();
    character.style.left = `${startX}px`;
    resetObstacles();
  });
  updateMobileKeyboard();
}

function finishGame() {
  isActive = false;
  endInstructionEl.textContent = isPhoneLikeDevice()
    ? 'Toque em "Jogar de novo" para brincar mais uma vez.'
    : 'Aperte qualquer tecla para jogar de novo.';
  playCelebration();
  playApplause();
  setTimeout(() => {
    speak(
      isPhoneLikeDevice()
        ? 'Parabéns, você chegou até o biscoito! Toque em jogar de novo para brincar mais uma vez.'
        : 'Parabéns, você chegou até o biscoito! Aperte qualquer tecla para jogar de novo'
    );
  }, 900);
  showScreen(endScreen);
  updateMobileKeyboard();
}

function correctAnswer() {
  playBeep(880, 0.18);
  character.classList.add('jump');
  setTimeout(() => character.classList.remove('jump'), 650);

  currentStep += 1;
  progressEl.textContent = `${currentStep}/${stepsTotal}`;
  const moveTo = startX + currentStep * stepDistance;
  character.style.left = `${moveTo}px`;

  if (currentStep >= stepsTotal) {
    setTimeout(finishGame, 700);
  } else {
    setTimeout(nextTarget, 700);
  }
}

function handleKeyInput(key) {
  if (!isActive || inputLocked) return;
  const upper = key.toUpperCase();
  if (upper === currentTarget) {
    correctAnswer();
  }
}

async function selectCharacter(id) {
  const info = characters[id];
  if (!info) return;
  selectedCharacter = info;
  characterImg.src = `${info.file}`;
  await speakAsync(info.say, 'pt-BR');
  startGame();
  const firstLetter = letters[Math.floor(Math.random() * letters.length)];
  setTarget(firstLetter);
  instructionEl.textContent = 'Vamos lá!';
  await new Promise(r => setTimeout(r, 1000));
  speak('Vamos lá!');
  await new Promise(r => setTimeout(r, 1000));
  speak(`Letra ${firstLetter}`);
  instructionEl.textContent = isPhoneLikeDevice() ? 'Toque na letra certa' : 'Aperte a letra certa';
  inputLocked = false;
  updateMobileKeyboard();
}

function setupStartButtons() {
  document.querySelectorAll('.choices button').forEach(btn => {
    btn.addEventListener('click', () => selectCharacter(btn.dataset.id));
  });
}

window.addEventListener('keydown', (e) => {
  const key = e.key;
  if (startScreen.classList.contains('active')) {
    if (characters[key]) {
      selectCharacter(key);
    }
  } else if (endScreen.classList.contains('active')) {
    showScreen(startScreen);
  } else if (gameScreen.classList.contains('active')) {
    handleKeyInput(key);
  }
});

restartBtn.addEventListener('click', () => {
  showScreen(startScreen);
});

const handleTouchModeChange = () => {
  applyMobileMode();
  instructionEl.textContent = isPhoneLikeDevice() ? 'Toque na letra certa' : 'Aperte a letra certa';
  endInstructionEl.textContent = isPhoneLikeDevice()
    ? 'Toque em "Jogar de novo" para brincar mais uma vez.'
    : 'Aperte qualquer tecla para jogar de novo.';
  document.body.classList.toggle('using-touch-phone', gameScreen.classList.contains('active') && isPhoneLikeDevice());
};

window.addEventListener('resize', handleTouchModeChange);

buildPoster();
buildMobileKeyboard();
setupStartButtons();
showScreen(startScreen);
handleTouchModeChange();
