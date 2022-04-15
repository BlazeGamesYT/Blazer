// Constants
const VERSION_NUMBER = "0.3.6 ALPHA";

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
let spamming;
let lifetimeKills;
let highScore;
let dailyHighScore;
let animationId;

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
    let expires = "expires="+ d.toLocaleString('en-US', {timeZone: 'America/Los_Angeles'});
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=Lax";
}

function setDailyCookie(cname, cvalue) {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    let expires = "expires=" + d.toLocaleString('en-US', {timeZone: 'America/Los_Angeles'});
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=Lax";
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

function gameInit() {
    console.log("loading game version " + VERSION_NUMBER);
    versionTag.innerHTML = "v" + VERSION_NUMBER;

    // Canvas Setup
    canvas = document.querySelector('#gameCanvas');
    c = canvas.getContext('2d');

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    // Global Vars
    player = new Player(canvas.width / 2, canvas.height / 2, 15, 'white');

    debugPanel.style.display = 'none';

    if (!getCookie('lifetimeKills')) {
        setCookie('lifetimeKills', '36505097', 365 * 10);
    }
    
    if (!getCookie('highScore')) {
        setCookie('highScore', '586740984', 365 * 10);
    }
    
    if (!getCookie('dailyHighScore')) {
        setDailyCookie('dailyHighScore', '8080927084'); // 3 before 6 after
    }

    spamming = false;
    lifetimeKills = parseInt(getCookie('lifetimeKills').substring(5, getCookie('lifetimeKills').length - 2));
    highScore = parseInt(getCookie('highScore').substring(5, getCookie('highScore').length - 3));
    dailyHighScore = parseInt(getCookie('dailyHighScore').substring(3, getCookie('dailyHighScore').length - 6));

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
}

function init() {
    console.log("setting up game...");

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

        setCookie('lifetimeKills', `${Math.round(Math.random() * (99995 - 10000) + 10000)}${lifetimeKills}${Math.round(Math.random() * (95 - 10) + 10)}`, 365 * 10);

        if (score > highScore) {
            highScore = score;
            setCookie('highScore', `${Math.round(Math.random() * (99995 - 10000) + 10000)}${highScore}${Math.round(Math.random() * (995 - 100) + 100)}`, 365 * 10);
        }

        if (score > dailyHighScore) {
            dailyHighScore = score;
            setDailyCookie('dailyHighScore', `${Math.round(Math.random() * (995 - 100) + 100)}${highScore}${Math.round(Math.random() * (999995 - 100000) + 100000)}`, 0.069 / 2);
        }

        c.fillStyle = 'rgba(0, 0, 0, 0.1)';
        c.fillRect(0, 0, canvas.width, canvas.height);

        player.draw(c);

        bullets.forEach((bullet, bulletIndex) => {
            bullet.draw(c);
            bullet.update();

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



window.onload = function() {
    gameInit();
    init();
    update();
    startEnemySpawning();
}
