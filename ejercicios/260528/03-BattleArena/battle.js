const MOVES = {
  tackle: { name: 'Tackle', type: 'normal', power: 40, accuracy: 100 },
  scratch: { name: 'Scratch', type: 'normal', power: 40, accuracy: 100 },
  ember: { name: 'Ember', type: 'fire', power: 40, accuracy: 100 },
  'water-gun': { name: 'Water Gun', type: 'water', power: 40, accuracy: 100 },
  'vine-whip': { name: 'Vine Whip', type: 'grass', power: 45, accuracy: 100 },
  'thunder-shock': { name: 'Thunder Shock', type: 'electric', power: 40, accuracy: 100 },
  'karate-chop': { name: 'Karate Chop', type: 'fighting', power: 50, accuracy: 95 },
  'dragon-punch': { name: 'Dragon Punch', type: 'fighting', power: 60, accuracy: 90 }
};

const TYPE_CHART = {
  fire: { grass: 2, water: 0.5, fire: 0.5, bug: 2, ice: 2 },
  water: { fire: 2, grass: 0.5, water: 0.5, ground: 2, rock: 2 },
  grass: { water: 2, fire: 0.5, grass: 0.5, ground: 2, rock: 2, bug: 0.5 },
  electric: { water: 2, grass: 0.5, electric: 0.5, flying: 2 },
  normal: {},
  fighting: { normal: 2, ice: 2, dark: 2 }
};

const EVOLUTIONS = {
  charmander: { level: 16, evolved: 'charmeleon', second: 'charizard', secondLevel: 36 },
  bulbasaur: { level: 16, evolved: 'ivysaur', second: 'venusaur', secondLevel: 32 },
  squirtle: { level: 16, evolved: 'wartortle', second: 'blastoise', secondLevel: 36 },
  chikorita: { level: 16, evolved: 'bayleef', second: ' Meganium', secondLevel: 32 },
  cyndaquil: { level: 16, evolved: 'quilava', second: 'typhlosion', secondLevel: 36 },
  totodile: { level: 16, evolved: 'croconaw', second: 'feraligatr', secondLevel: 30 },
  treecko: { level: 16, evolved: 'grovyle', second: 'sceptile', secondLevel: 36 },
  torchic: { level: 16, evolved: 'combusken', second: 'blaziken', secondLevel: 36 },
  mudkip: { level: 16, evolved: 'marshtomp', second: 'swampert', secondLevel: 36 }
};

const DIFFICULTY_MULTIPLIERS = {
  easy: { enemyAttack: 0.7, scoreMultiplier: 1 },
  medium: { enemyAttack: 1, scoreMultiplier: 1.5 },
  hard: { enemyAttack: 1.3, scoreMultiplier: 2.5 }
};

let gameState = {
  difficulty: 'medium',
  selectedPokemon: 'charmander',
  playerPokemon: null,
  enemyPokemon: null,
  playerHP: 0,
  enemyHP: 0,
  maxPlayerHP: 0,
  maxEnemyHP: 0,
  playerLevel: 1,
  enemyLevel: 1,
  score: 0,
  highScore: parseInt(localStorage.getItem('pokemonHighScore')) || 0,
  isPlayerTurn: true,
  battleActive: false,
  selectedMoveIndex: 0
};

const titleScreen = document.getElementById('title-screen');
const battleScreen = document.getElementById('battle-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const starterGrid = document.getElementById('starter-grid');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const startBtn = document.getElementById('start-btn');
const attackBtn = document.getElementById('attack-btn');
const moveOptions = document.querySelectorAll('.move-option');
const battleMessages = document.getElementById('battle-messages');

function init() {
  document.getElementById('highscore').textContent = gameState.highScore;
  
  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      gameState.difficulty = btn.dataset.difficulty;
    });
  });
  
  starterGrid.querySelectorAll('.starter-card').forEach(card => {
    card.addEventListener('click', () => {
      starterGrid.querySelectorAll('.starter-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      gameState.selectedPokemon = card.dataset.pokemon;
    });
  });
  
  startBtn.addEventListener('click', startGame);
  
  attackBtn.addEventListener('click', () => {
    if (gameState.isPlayerTurn && gameState.battleActive) {
      const moveKey = moveOptions[gameState.selectedMoveIndex].dataset.move;
      playerAttack(moveKey);
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (!battleScreen.classList.contains('hidden') && gameState.battleActive) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        gameState.selectedMoveIndex = (gameState.selectedMoveIndex - 1 + moveOptions.length) % moveOptions.length;
        updateMoveSelection();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        gameState.selectedMoveIndex = (gameState.selectedMoveIndex + 1) % moveOptions.length;
        updateMoveSelection();
      }
    }
  });
  
  document.getElementById('play-again-btn').addEventListener('click', () => location.reload());
  document.getElementById('return-title-btn').addEventListener('click', () => location.reload());
}

async function startGame() {
  startBtn.disabled = true;
  startBtn.textContent = 'Cargando...';
  
  const playerResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${gameState.selectedPokemon}`);
  gameState.playerPokemon = await playerResponse.json();
  
  const pool = ['pikachu', 'charmander', 'bulbasaur', 'squirtle', 'charizard', 'venusaur', 'blastoise', 'raichu', 'gengar'];
  const enemyName = pool[Math.floor(Math.random() * pool.length)];
  const enemyResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${enemyName}`);
  gameState.enemyPokemon = await enemyResponse.json();
  
  const hpStat = gameState.playerPokemon.stats.find(s => s.stat.name === 'hp');
  gameState.maxPlayerHP = hpStat.base_stat + 50;
  gameState.playerHP = gameState.maxPlayerHP;
  
  const enemyHpStat = gameState.enemyPokemon.stats.find(s => s.stat.name === 'hp');
  gameState.maxEnemyHP = enemyHpStat.base_stat + 50;
  gameState.enemyHP = gameState.maxEnemyHP;
  
  gameState.battleActive = true;
  gameState.isPlayerTurn = true;
  gameState.score = 0;
  
  titleScreen.classList.add('hidden');
  battleScreen.classList.remove('hidden');
  
  setupBattleUI();
  addMessage(`¡${gameState.playerPokemon.name.toUpperCase()} vs ${gameState.enemyPokemon.name.toUpperCase()}!`);
  addMessage(`¡Batalla iniciada! Usa ↑ ↓ para elegir, CLICK en ATTACK`);
}

function setupBattleUI() {
  const playerAnimUrl = gameState.playerPokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || gameState.playerPokemon.sprites.front_default;
  const enemyAnimUrl = gameState.enemyPokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || gameState.enemyPokemon.sprites.front_default;
  
  document.getElementById('player-name').textContent = gameState.playerPokemon.name.toUpperCase();
  document.getElementById('player-sprite').src = playerAnimUrl;
  document.getElementById('player-types').innerHTML = gameState.playerPokemon.types.map(t => `<span class="tipo-${t.type.name}">${t.type.name}</span>`).join('');
  document.getElementById('player-level').textContent = gameState.playerLevel;
  document.getElementById('player-lvl-display').textContent = gameState.playerLevel;
  
  document.getElementById('enemy-name').textContent = gameState.enemyPokemon.name.toUpperCase();
  document.getElementById('enemy-sprite').src = enemyAnimUrl;
  document.getElementById('enemy-types').innerHTML = gameState.enemyPokemon.types.map(t => `<span class="tipo-${t.type.name}">${t.type.name}</span>`).join('');
  document.getElementById('enemy-level').textContent = gameState.enemyLevel;
  
  document.getElementById('score').textContent = gameState.score;
  document.getElementById('difficulty-display').textContent = gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);
  
  updateHealthBars();
  updateMoveSelection();
}

function updateHealthBars() {
  const playerPercent = (gameState.playerHP / gameState.maxPlayerHP) * 100;
  const enemyPercent = (gameState.enemyHP / gameState.maxEnemyHP) * 100;
  
  document.getElementById('player-health').style.width = `${Math.max(0, playerPercent)}%`;
  document.getElementById('enemy-health').style.width = `${Math.max(0, enemyPercent)}%`;
  
  document.getElementById('player-health-text').textContent = `${Math.max(0, gameState.playerHP)} / ${gameState.maxPlayerHP}`;
  document.getElementById('enemy-health-text').textContent = `${Math.max(0, gameState.enemyHP)} / ${gameState.maxEnemyHP}`;
  
  document.getElementById('player-health').classList.toggle('low', playerPercent < 30);
  document.getElementById('enemy-health').classList.toggle('low', enemyPercent < 30);
}

function updateMoveSelection() {
  moveOptions.forEach((opt, idx) => {
    opt.classList.toggle('selected', idx === gameState.selectedMoveIndex);
  });
  attackBtn.disabled = !gameState.isPlayerTurn || !gameState.battleActive;
}

async function playerAttack(moveKey) {
  if (!gameState.isPlayerTurn || !gameState.battleActive) return;
  
  gameState.isPlayerTurn = false;
  updateMoveSelection();
  
  const move = MOVES[moveKey];
  addMessage(`¡${gameState.playerPokemon.name} usa ${move.name}!`);
  
  const playerSprite = document.getElementById('player-sprite');
  playerSprite.classList.add('attacking');
  setTimeout(() => playerSprite.classList.remove('attacking'), 400);
  
  playSound(gameState.playerPokemon.id);
  
  const damage = calculateDamage(move, gameState.playerPokemon, gameState.enemyPokemon, true);
  gameState.enemyHP = Math.max(0, gameState.enemyHP - damage);
  
  const enemySprite = document.getElementById('enemy-sprite');
  enemySprite.classList.add('hit');
  setTimeout(() => enemySprite.classList.remove('hit'), 300);
  
  updateHealthBars();
  
  const effectiveness = getEffectiveness(move, gameState.playerPokemon, gameState.enemyPokemon);
  addMessage(`💥 ¡Daño: ${damage}!`);
  if (effectiveness > 1) addMessage('¡Súper efectivo!');
  else if (effectiveness < 1 && effectiveness > 0) addMessage('No es muy efectivo...');
  
  if (gameState.enemyHP > 0) {
    gameState.score += Math.floor(20 * DIFFICULTY_MULTIPLIERS[gameState.difficulty].scoreMultiplier);
    document.getElementById('score').textContent = gameState.score;
    checkLevelUp();
  }
  
  if (gameState.enemyHP <= 0) {
    winBattle();
    return;
  }
  
  setTimeout(enemyAttack, 1500);
}

async function enemyAttack() {
  if (!gameState.battleActive) return;
  
  const moves = Object.keys(MOVES);
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  const move = MOVES[randomMove];
  
  addMessage(`¡${gameState.enemyPokemon.name} usa ${move.name}!`);
  
  const enemySprite = document.getElementById('enemy-sprite');
  enemySprite.classList.add('attacking');
  setTimeout(() => enemySprite.classList.remove('attacking'), 400);
  
  playSound(gameState.enemyPokemon.id);
  
  const damage = calculateDamage(move, gameState.enemyPokemon, gameState.playerPokemon, false);
  gameState.playerHP = Math.max(0, gameState.playerHP - damage);
  
  const playerSprite = document.getElementById('player-sprite');
  playerSprite.classList.add('hit');
  setTimeout(() => playerSprite.classList.remove('hit'), 300);
  
  updateHealthBars();
  addMessage(`💥 ¡Daño: ${damage}!`);
  
  if (gameState.playerHP <= 0) {
    loseBattle();
    return;
  }
  
  gameState.isPlayerTurn = true;
  updateMoveSelection();
  addMessage(`¡Tu turno!`);
}

function calculateDamage(move, attacker, defender, isPlayer) {
  const attackStat = attacker.stats.find(s => ['attack', 'special-attack'].includes(s.stat.name)).base_stat;
  const defenseStat = defender.stats.find(s => ['defense', 'special-defense'].includes(s.stat.name)).base_stat;
  const effectiveness = getEffectiveness(move, attacker, defender);
  const multiplier = isPlayer ? 1 : DIFFICULTY_MULTIPLIERS[gameState.difficulty].enemyAttack;
  const baseDamage = move.power * (attackStat / defenseStat) * multiplier;
  const randomFactor = 0.85 + Math.random() * 0.15;
  return Math.max(1, Math.floor(baseDamage * effectiveness * randomFactor));
}

function getEffectiveness(move, attacker, defender) {
  const defenderType = defender.types[0].type.name;
  if (TYPE_CHART[move.type] && TYPE_CHART[move.type][defenderType]) {
    return TYPE_CHART[move.type][defenderType];
  }
  return 1;
}

function checkLevelUp() {
  const nextLevel = gameState.playerLevel + 1;
  if (gameState.score >= nextLevel * 30 && gameState.playerLevel < 50) {
    gameState.playerLevel = nextLevel;
    document.getElementById('player-level').textContent = gameState.playerLevel;
    document.getElementById('player-lvl-display').textContent = gameState.playerLevel;
    addMessage(`⭐ ¡Subiste al nivel ${gameState.playerLevel}!`);
    gameState.playerHP = Math.min(gameState.maxPlayerHP, gameState.playerHP + Math.floor(gameState.maxPlayerHP * 0.2));
    updateHealthBars();
  }
}

function playSound(pokemonId) {
  const url = `https://raw.githubusercontent.com/PokeAPI/cries/master/cries/pokemon/latest/${pokemonId}.ogg`;
  const audio = new Audio(url);
  audio.play().catch(() => {});
}

function addMessage(text) {
  const p = document.createElement('p');
  p.textContent = text;
  battleMessages.appendChild(p);
  battleMessages.scrollTop = battleMessages.scrollHeight;
}

function winBattle() {
  gameState.battleActive = false;
  const bonus = 100 * DIFFICULTY_MULTIPLIERS[gameState.difficulty].scoreMultiplier;
  gameState.score += bonus;
  document.getElementById('score').textContent = gameState.score;
  addMessage(`🏆 ¡GANASTE! +${bonus} puntos`);
  
  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
    localStorage.setItem('pokemonHighScore', gameState.highScore);
    document.getElementById('highscore').textContent = gameState.highScore;
  }
  
  setTimeout(() => showGameOver(true), 2000);
}

function loseBattle() {
  gameState.battleActive = false;
  addMessage(`💀 Derrotado...`);
  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
    localStorage.setItem('pokemonHighScore', gameState.highScore);
  }
  setTimeout(() => showGameOver(false), 2000);
}

function showGameOver(won) {
  battleScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
  document.getElementById('game-over-title').textContent = won ? '🏆 ¡VICTORIA!' : '💀 GAME OVER';
  document.getElementById('game-over-message').textContent = won ? `¡Bien hecho! Puntuación: ${gameState.score}` : `Puntuación final: ${gameState.score}`;
  document.getElementById('final-score').textContent = gameState.score;
}

init();