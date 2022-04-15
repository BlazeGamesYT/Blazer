const utils = {
    randomColor() {
        return `hsl(${Math.random() * 360}, 60%, 50%)`;
    },

    calculateVelocity(originX, originY, targetX, targetY) {
        const angle = Math.atan2(targetY - originY, targetX - originX);

        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    },

    getCookie(cname) {
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
    },

    setDailyCookie(cname, cvalue) {
        const d = new Date();
        d.setHours(24, 0, 0, 0);
        let expires = "expires=" + d.toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}) + " PST";
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=Strict";
    },

    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}) + " PST";
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=Strict";
    },

    initCookies() {
        if (!utils.getCookie('lifetimeKills')) {
            utils.setCookie('lifetimeKills', '36505097', 365 * 10);
        }
        
        if (!utils.getCookie('highScore')) {
            utils.setCookie('highScore', '586740984', 365 * 10);
        }
        
        if (!utils.getCookie('dailyHighScore')) {
            utils.setDailyCookie('dailyHighScore', '8080927084'); // 3 before 6 after
        }
    
        lifetimeKills = parseInt(utils.getCookie('lifetimeKills').substring(5, utils.getCookie('lifetimeKills').length - 2));
        highScore = parseInt(utils.getCookie('highScore').substring(5, utils.getCookie('highScore').length - 3));
        dailyHighScore = parseInt(utils.getCookie('dailyHighScore').substring(3, utils.getCookie('dailyHighScore').length - 6));
    },

    calculateScore(enemyRadius) {
    
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
}