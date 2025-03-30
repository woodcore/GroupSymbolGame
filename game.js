const gameData = [
    { symbol: 'C<sub>1</sub>', image: './images/C1.png' },
    { symbol: 'C<sub>2</sub>', image: './images/C2.png' },
    { symbol: 'C<sub>3</sub>', image: './images/C3.png' },
    { symbol: 'C<sub>4</sub>', image: './images/C4.png' },
    { symbol: 'C<sub>6</sub>', image: './images/C6.png'},
    { symbol: 'C<sub>1h</sub>', image: './images/C1h.png'},
    { symbol: 'C<sub>2h</sub>', image: './images/C2h.png'},
    { symbol: 'C<sub>3h</sub>', image: './images/C3h.png'},
    { symbol: 'C<sub>4h</sub>', image: './images/C4h.png'},
    { symbol: 'C<sub>6h</sub>', image: './images/C6h.png'},
    { symbol: 'C<sub>2v</sub>', image: './images/C2v.png'},
    { symbol: 'C<sub>3v</sub>', image: './images/C3v.png'},
    { symbol: 'C<sub>4v</sub>', image: './images/C4v.png'},
    { symbol: 'C<sub>6v</sub>', image: './images/C6v.png'},
    { symbol: 'S<sub>2</sub>', image: './images/S2.png'},
    { symbol: 'S<sub>4</sub>', image: './images/S4.png'},
    { symbol: 'S<sub>6</sub>', image: './images/S6.png'},
    { symbol: 'D<sub>2</sub>', image: './images/D2.png'},
    { symbol: 'D<sub>3</sub>', image: './images/D3.png'},
    { symbol: 'D<sub>4</sub>', image: './images/D4.png'},
    { symbol: 'D<sub>6</sub>', image: './images/D6.png'},
    { symbol: 'D<sub>2h</sub>', image: './images/D2h.png'},
    { symbol: 'D<sub>3h</sub>', image: './images/D3h.png'},
    { symbol: 'D<sub>4h</sub>', image: './images/D4h.png'},
    { symbol: 'D<sub>6h</sub>', image: './images/D6h.png'},
    { symbol: 'D<sub>2d</sub>', image: './images/D2d.png'},
    { symbol: 'D<sub>3d</sub>', image: './images/D3d.png'},
];

let score = 0;
let selectedSymbol = null;
let selectedImage = null;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createGame() {
    const symbolsArea = document.getElementById('symbolsArea');
    const imagesArea = document.getElementById('imagesArea');
    
    symbolsArea.innerHTML = '';
    imagesArea.innerHTML = '';
    
    const shuffledSymbols = shuffle([...gameData]);
    const shuffledImages = shuffle([...gameData]);
    
    shuffledSymbols.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = item.symbol;
        div.dataset.symbol = item.symbol;
        div.addEventListener('touchstart', (e) => {
            e.preventDefault();
            selectSymbol(div);
        });
        div.addEventListener('click', () => selectSymbol(div));
        symbolsArea.appendChild(div);
    });
    
    shuffledImages.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        const img = document.createElement('img');
        img.src = item.image;
        div.dataset.symbol = item.symbol;
        div.addEventListener('touchstart', (e) => {
            e.preventDefault();
            selectImage(div);
        });
        div.addEventListener('click', () => selectImage(div));
        div.appendChild(img);
        imagesArea.appendChild(div);
    });
}

function selectSymbol(element) {
    if (selectedSymbol) {
        selectedSymbol.classList.remove('selected');
    }
    selectedSymbol = element;
    element.classList.add('selected');
    checkMatch();
}

function selectImage(element) {
    if (selectedImage) {
        selectedImage.classList.remove('selected');
    }
    selectedImage = element;
    element.classList.add('selected');
    checkMatch();
}

let timer = null;
let gameMode = null;
let startTime = null;
let timeLimit = 300; // 5分钟 = 300秒

function startGame(mode) {
    gameMode = mode;
    score = 0;
    document.getElementById('score').textContent = '0';
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    
    if (mode === 'normal') {
        startTime = new Date();
        updateTimer();
    } else if (mode === 'countdown') {
        timeLimit = 300;
        startCountdown();
    }
    
    createGame();
}

function updateTimer() {
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timer = setTimeout(updateTimer, 1000);
}

function startCountdown() {
    const minutes = Math.floor(timeLimit / 60);
    const seconds = timeLimit % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLimit > 0) {
        timeLimit--;
        timer = setTimeout(startCountdown, 1000);
    } else {
        endGame('时间到！');
    }
}

function endGame(message) {
    clearTimeout(timer);
    alert(`${message}\n最终得分：${score}`);
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('modeSelection').style.display = 'block';
}

// 修改 checkMatch 函数
function checkMatch() {
    if (selectedSymbol && selectedImage) {
        if (selectedSymbol.dataset.symbol === selectedImage.dataset.symbol) {
            setTimeout(() => {
                selectedSymbol.style.visibility = 'hidden';
                selectedImage.style.visibility = 'hidden';
                selectedSymbol = null;
                selectedImage = null;
                score += 10;
                document.getElementById('score').textContent = score;
                
                // 检查是否所有卡片都已匹配
                const remainingCards = document.querySelectorAll('.item:not([style*="visibility: hidden"])');
                if (remainingCards.length === 0) {
                    if (gameMode === 'normal') {
                        endGame('恭喜完成游戏！');
                    }
                }
            }, 300);
        } else {
            setTimeout(() => {
                selectedSymbol.classList.remove('selected');
                selectedImage.classList.remove('selected');
                selectedSymbol = null;
                selectedImage = null;
                score -= 5;
                document.getElementById('score').textContent = score;
            }, 500);
        }
    }
}

// 移除原有的 window.onload
window.onload = function() {
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('modeSelection').style.display = 'block';
};

// 添加阻止页面缩放的功能
document.addEventListener('touchmove', function(e) {
    if(e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });