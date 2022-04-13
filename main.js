const canvas = document.querySelector('#gameCanvas');
const c = canvas.getContext('2d');

const scoreCount = document.querySelector('#scoreCount');
const highScoreCount = document.querySelector('#highScoreCount');
const bulletSpeedUpgradesPrompt = document.querySelector('#bulletSpeedUpgrades');

const enemyCount = document.querySelector('#enemyCount');
const bulletCount = document.querySelector('#bulletCount');
const enemySpeedFactorCount = document.querySelector('#enemySpeedCount');
const killCount = document.querySelector('#killCount');

const debugPanel = document.querySelector('#debug');
debugPanel.style.display = 'none';

canvas.width = innerWidth;
canvas.height = innerHeight;

// CLASSES

class Object {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fill();
        c.closePath();
    }
}

class MovingObject extends Object {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color);
        this.velocity = velocity;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Player extends Object {
    constructor(x, y, radius, color) {
        super(x, y, radius, color);
    }
}

class Bullet extends MovingObject {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);
    }
}

class Enemy extends MovingObject {
    constructor(x, y, radius, color) {
        super(x, y, radius, color, calculateVelocity(x, y, player.x, player.y));
    }

    update() {
        this.x += this.velocity.x * enemySpeedFactor;
        this.y += this.velocity.y * enemySpeedFactor;
    }
}

// UTIL

function calculateVelocity(originX, originY, targetX, targetY, speed) {
    const speedFactor = speed || 1;
    const angle = Math.atan2(targetY - originY, targetX - originX);

    return {
        x: Math.cos(angle) * speedFactor,
        y: Math.sin(angle) * speedFactor
    };
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=Strict";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
}



// GAME VARIABLES
const player = new Player(canvas.width / 2, canvas.height / 2, 15, 'white');

let bullets;
let enemies;
let score;
let enemySpeedFactor;
let bulletSpeedUpgrades;
let bulletSize;
let alive;
let spamming = false;

if (!getCookie('lifetimeKills')) {
    setCookie('lifetimeKills', '36505097', 365 * 10);
}

if (!getCookie('highScore')) {
    setCookie('highScore', '586740984', 365 * 10);
}

let lifetimeKills = parseInt(getCookie('lifetimeKills').substring(5, getCookie('lifetimeKills').length - 2));
let highScore = parseInt(getCookie('highScore').substring(5, getCookie('highScore').length - 3));

// GAME FUNCTION

let animationId;

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

    if (bullets.length > 20) {
        alert("bruh dont autoclick");
        spamming = true;
    }
    
    
    

    if (!document.hidden) {

        if (score > 1000) {
            enemySpeedFactor += 0.001;
        }

        enemySpeedFactorCount.innerHTML = enemySpeedFactor;
        enemyCount.innerHTML = enemies.length;
        bulletCount.innerHTML = bullets.length;
        scoreCount.innerHTML = score;
        killCount.innerHTML = lifetimeKills;
        highScoreCount.innerHTML = highScore;

        setCookie('lifetimeKills', `${Math.round(Math.random() * (99995 - 10000) + 10000)}${lifetimeKills}${Math.round(Math.random() * (95 - 10) + 10)}`, 365 * 10);

        if (score > highScore) {
            highScore = score;
            setCookie('highScore', `${Math.round(Math.random() * (99995 - 10000) + 10000)}${highScore}${Math.round(Math.random() * (995 - 100) + 100)}`, 365 * 10);
        }

        c.fillStyle = 'rgba(0, 0, 0, 0.1)';
        c.fillRect(0, 0, canvas.width, canvas.height);

        player.draw();

        bullets.forEach((bullet, bulletIndex) => {
            bullet.draw();
            bullet.update();

            if (bullet.x > canvas.width + bullet.radius || bullet.x < 0 - bullet.radius || bullet.y > canvas.height + bullet.radius || bullet.y < 0 - bullet.radius) {
                setTimeout(() => {
                    bullets.splice(bulletIndex, 1);
                }, 0);
            }
        });

        enemies.forEach((enemy, enemyIndex) => {
            enemy.draw();
            enemy.update();

            // Player collission
            if (Math.hypot(enemy.x - player.x, enemy.y - player.y) - player.radius - enemy.radius < 0) {
                alive = false;
                cancelAnimationFrame(animationId);
            }

            bullets.forEach((bullet, bulletIndex) => {
                // Bullet collision
                if (Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) - bullet.radius - enemy.radius < 0) {

                    score += calculateScore(enemy.radius);

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

function randomColor() {
    return `hsl(${Math.random() * 360}, 60%, 50%)`;
}

function calculateScore(enemyRadius) {
    
    let score = 0;

    if (enemyRadius < 5) {
        score = 300;
    } else if (enemyRadius < 10) {
        score = 200;
    } else if (enemyRadius < 20) {
        score = 150;
    } else {
        score = 100;
    }

    return score;
}

function startEnemySpawning() {
    setInterval(() => {

        if (!document.hidden) {

            let x, y;
            const radius = Math.random() * (30 - 3) + 3;
    
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
                y = Math.random() * canvas.height;
            } else {
                x = Math.random() * canvas.width;
                y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
            }
    
            const enemy = new Enemy(
                x,
                y,
                radius,
                randomColor()
            );
    
            enemies.push(enemy);
        }

    }, 1000);
}

addEventListener('click', (event) => {

    if (!document.hidden && !spamming) {
        const bullet = new Bullet(canvas.width / 2, canvas.height / 2, bulletSize, 'white', null);

        bullet.velocity = calculateVelocity(player.x, player.y, event.clientX, event.clientY, bulletSpeedUpgrades / 1.5 + 5);

        bullets.push(bullet);
    }
});

addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
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

init();
update();
startEnemySpawning();