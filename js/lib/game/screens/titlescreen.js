// lib/game/screens/titlescreen.js
ig.baked = true;
ig.module('game.screens.titlescreen').requires('game.screens.basescreen').defines(function () {
    TitleScreen = BaseScreen.extend({
        id: 'title',
        init: function () {
            this.content = '' + '<ul class="buttons">' + '<li><a href="#" class="button play" onclick="' + this.func('onPlayClicked', null, false) + '">Play Game</a></li>' + '<li><a href="#" class="button instruct" onclick="' + this.switchScreen('instruct') + '">Instructions</a></li>' + '<li><a href="#" class="button leaderboard" onclick="' + this.switchScreen('leaderboard') + '">Leaderboard</a></li>' + '</ul><a href="#" id="title-terms" onclick="' + this.switchScreen('terms') + '">Terms and Conditions</a>';
            this.parent();
        }
    });
});