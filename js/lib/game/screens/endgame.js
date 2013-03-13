// lib/game/screens/endgame.js
ig.baked = true;
ig.module('game.screens.endgame').requires('game.screens.basescreen').defines(function () {
    EndGame = BaseScreen.extend({
        id: 'endgame',
        voucherLink: 'http://store.koubachi.com/products/m9ur7zJkFw6Q9RB2tXRw',
        init: function () {
            var content = '';
            if (ig.game.gameWin) {
                content += '<a href="' + this.voucherLink + '" target="_blank" id="voucher" class="button">Claim my prize</a>';
            }
            content += '' + '<ul id="endgame-buttons">' + '<li><a href="#" class="button tell-more" onclick="' + this.func('gotoClient', null, false) + '">Tell me more</a></li>' + '<li><a href="#" class="button play-again" onclick="' + this.switchScreen('game') + '">Play again</a></li>' + '<li><a href="#" class="button send-friend" onclick="' + this.switchScreen('sendfriend') + '">Send to friends</a></li>' + '<li><a href="#" class="button leaderboard end" onclick="' + this.switchScreen('leaderboard') + '">Leaderboard</a></li>' + '</ul>';
            this.content = content;
            this.parent();
            if (ig.game.gameWin) {
                $('#screen-endgame').addClass('win');
            }
        },
        gotoClient: function () {
            window.open('http://www.koubachi.com', '_blank');
            return false;
        }
    });
});