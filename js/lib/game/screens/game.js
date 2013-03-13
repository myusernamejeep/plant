// lib/game/screens/game.js
ig.baked = true;
ig.module('game.screens.game').requires('game.screens.basescreen').defines(function () {
    GameScreen = BaseScreen.extend({
        id: 'game',
        init: function () {
            this.content = '';
            this.parent();
        },
    });
});
