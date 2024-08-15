// script.js
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's' , 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const words = [
    "standardize", "enormous", "coffee", "apple", "animal", "alter", 
    "suitcase", "tiger", "python", "jargon", "eagle", "mankind", "choose", 
    "illegal", "black", "white", "green", "purple", "burble", "mathematics",
    "science", "chemistry", "snack", "article", "book",
];
let chance = 9;// 기회는 9로 설정
let suspend = 0; // 정답을 맞추지 못한 횟수를 기록하는 변수
let score = localStorage.getItem("hangman-score") ?? 0;
let selectedWord = words[Math.floor(Math.random() * words.length)];
let guessedLetters = [];

const wordDisplay = document.getElementById('word-display');
const messageDisplay = document.getElementById('message');
const keyboard = document.getElementById('keyboard');
const scorePanel = document.getElementById('score-panel');
const remainChanceDisplay = document.getElementById('remain_chance');
const restartBtn = document.getElementById('restart-btn');
const canvas = document.getElementById('hangman-canvas');
const context = canvas.getContext('2d');

const displayWord =() => wordDisplay.innerHTML = selectedWord.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
const displayChance = letter => remainChanceDisplay.innerText = `남은기회 : ${chance - suspend}`;

function updateGameStatus() {
    if (wordDisplay.innerText.split(' ').join('') === selectedWord) {
        messageDisplay.innerText = 'Congratulations! You won!';
        score = parseInt(score) + 100;
        keyboard.innerHTML = '';
    } else if (suspend >= chance) {
        messageDisplay.innerText = `You lost!\n정답: ${selectedWord}`;
        score = parseInt(score) - 100;
        keyboard.innerHTML = '';
    }
    localStorage.setItem("hangman-score", score);
    scorePanel.innerText = `Score: ${score}`;
   
}

function createKeyboard() {
    keyboard.innerHTML = ''; 
    letters.forEach(letter => {
        const button = document.createElement('button');
        button.id = `${letter}-btn`;
        button.innerText = letter;
        button.addEventListener('click', () => {
            let clickBtn = confirm(`"${letter}"를 선택하시겠습니까?`);
            if (clickBtn) {
                handleGuess(letter);
            }
        });
        keyboard.appendChild(button);
    });
}

function handleGuess(letter) {
    if (selectedWord.includes(letter)) {
        if (!guessedLetters.includes(letter)) {
            guessedLetters.push(letter);
            displayWord();
        }
    } else {
            suspend++; // 정답이 아닌 경우 suspend를 증가시킴
            displayChance(letter);
            drawHangman(suspend);
    }
    const alphabet = document.getElementById(`${letter}-btn`);
    if (alphabet) {
        alphabet.disabled = true;
    }
    updateGameStatus();
}

function drawHangman(step) {
    switch (step) {
        case 1:
            // 기둥 그리기
            context.moveTo(10, 150);
            context.lineTo(10, 10);
            context.stroke();
            break;
        case 2:
            // 가로줄 그리기
            context.moveTo(10, 10);
            context.lineTo(80, 10);
            context.stroke();
            break;
        case 3:
            // 내려오는 줄 그리기
            context.moveTo(80, 10);
            context.lineTo(80, 30);
            context.stroke();
            break;
        case 4:
            // 머리 그리기
            context.beginPath();
            context.arc(80, 40, 10, 0, Math.PI * 2, true);
            context.stroke();
            break;
        case 5:
            // 몸통 그리기
            context.moveTo(80, 50);
            context.lineTo(80, 100);
            context.stroke();
            break;
        case 6:
            // 왼팔 그리기
            context.moveTo(80, 60);
            context.lineTo(60, 80);
            context.stroke();
            break;
        case 7:
            // 오른팔 그리기
            context.moveTo(80, 60);
            context.lineTo(100, 80);
            context.stroke();
            break;
        case 8:
            // 왼다리 그리기
            context.moveTo(80, 100);
            context.lineTo(60, 130);
            context.stroke();
            break;
        case 9:
            // 오른다리 그리기
            context.moveTo(80, 100);
            context.lineTo(100, 130);
            context.stroke();
            break;
    }
}

function resetGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    suspend = 0;
    messageDisplay.innerText = '';
    displayWord();
    createKeyboard();
    remainChanceDisplay.innerText = ``;
    context.clearRect(0, 0, canvas.width, canvas.height);
}

displayWord();
createKeyboard();
scorePanel.innerText = `Score: ${score}`;

restartBtn.addEventListener('click', resetGame);
