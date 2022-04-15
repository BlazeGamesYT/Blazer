// Constants
const VERSION_NUMBER = "0.3.6 ALPHA";

// Game Variables (somehow organize these)
let canvas;
let c;
let player;
let bullets;
let enemies;
let score;
let enemySpeedFactor;
let bulletSpeedUpgrades;
let bulletSize;
let alive;
let animationId;

let lifetimeKills;
let highScore;
let dailyHighScore;

function initInput() {
    addEventListener('click', (event) => {

        if (!document.hidden && !spamming) {
            bullets.push(new Bullet(player, event.clientX, event.clientY));
        }

    });
    
    addEventListener('keydown', (event) => {
        if (!document.hidden) {
    
            if (!alive) {
                init();
                update();
                return;
            }
    
            if (event.code === 'Backquote') {
                debugPanel.style.display === 'none' ? debugPanel.style.display = '' : debugPanel.style.display = 'none';
            }
    
            if (event.key === 'b') {
                if (score >= 2500) {
                    if (bulletSpeedUpgrades < 5) {
                        score -= 2500;
                        bulletSpeedUpgrades += 1;
                        bulletSpeedUpgradesPrompt.innerHTML = bulletSpeedUpgrades;
                    } else {
                        bulletSpeedUpgradesPrompt.innerHTML = 'MAX';
                    }
                    
                }
            }
        }
    });
}

function gameInit() {
    console.log("loading game with version " + VERSION_NUMBER + "...");

    // Html Init
    versionTag.innerHTML = "v" + VERSION_NUMBER;
    debugPanel.style.display = 'none';

    // Canvas Setup
    canvas = document.querySelector('#gameCanvas');
    c = canvas.getContext('2d');

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    // Game Init
    player = new Player(canvas);

    addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        player.centerPosition(canvas);
    });

    console.log("loading data...");
    utils.initCookies();
    console.log("setting up round...")
    init();
    console.log("starting gameloop...")
    update();
    startEnemySpawning();
    console.log("starting input...")
    initInput();
    console.log("game loaded!")
}

function init() {
    bullets = [];
    enemies = [];
    score = 0;
    enemySpeedFactor = 1;
    bulletSpeedUpgrades = 0;
    bulletSize = 5;
    spamming = false;

    alive = true;
}

function update() {

    animationId = requestAnimationFrame(update);
    

    if (!document.hidden) {

        if (score > 1000) {
            enemySpeedFactor += 0.001;
        }

        if (bullets.length > 30 && !spamming) {
            alert("bruh stop spamming it ruins the game");
            spamming = true;
        }

        enemySpeedFactorCount.innerHTML = enemySpeedFactor;
        enemyCount.innerHTML = enemies.length;
        bulletCount.innerHTML = bullets.length;
        scoreCount.innerHTML = score;
        killCount.innerHTML = lifetimeKills;
        highScoreCount.innerHTML = highScore;
        dailyHighScoreCount.innerHTML = dailyHighScore;

        utils.setCookie('lifetimeKills', `${Math.round(Math.random() * (99995 - 10000) + 10000)}${lifetimeKills}${Math.round(Math.random() * (95 - 10) + 10)}`, 365 * 10);

        if (score > highScore) {
            highScore = score;
            utils.setCookie('highScore', `${Math.round(Math.random() * (99995 - 10000) + 10000)}${highScore}${Math.round(Math.random() * (995 - 100) + 100)}`, 365 * 10);
        }

        if (score > dailyHighScore) {
            dailyHighScore = score;
            utils.setDailyCookie('dailyHighScore', `${Math.round(Math.random() * (995 - 100) + 100)}${highScore}${Math.round(Math.random() * (999995 - 100000) + 100000)}`, 0.069 / 2);
        }

        c.fillStyle = 'rgba(0, 0, 0, 0.1)';
        c.fillRect(0, 0, canvas.width, canvas.height);

        player.draw(c);

        bullets.forEach((bullet, bulletIndex) => {
            bullet.draw(c);
            bullet.update(bulletSpeedUpgrades);

            if (bullet.x > canvas.width + bullet.radius || bullet.x < 0 - bullet.radius || bullet.y > canvas.height + bullet.radius || bullet.y < 0 - bullet.radius) {
                setTimeout(() => {
                    bullets.splice(bulletIndex, 1);
                }, 0);
            }
        });

        enemies.forEach((enemy, enemyIndex) => {
            enemy.draw(c);
            enemy.update();

            // Player collission
            if (Math.hypot(enemy.x - player.x, enemy.y - player.y) - player.radius - enemy.radius < 0) {
                alive = false;
                cancelAnimationFrame(animationId);
            }

            bullets.forEach((bullet, bulletIndex) => {
                // Bullet collision
                if (Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) - bullet.radius - enemy.radius < 0) {

                    score += utils.calculateScore(enemy.radius);

                    lifetimeKills += 1;

                    setTimeout(() => {
                        bullets.splice(bulletIndex, 1);
                        enemies.splice(enemyIndex, 1);
                    }, 0);
                }
            });
        });
    }

}

function startEnemySpawning() {
    setInterval(() => {
        if (!document.hidden) {
            enemies.push(new Enemy(enemySpeedFactor, player));
        }
    }, 1000);
}

console.log("loading page...");

window.onload = function() {
    console.log("page loaded!");
    gameInit();
    startEnemySpawning();
}
