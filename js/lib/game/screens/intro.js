// lib/game/screens/intro.js
ig.baked = true;
ig.module('game.screens.intro').requires('game.screens.basescreen').defines(function () {
    Intro = BaseScreen.extend({
        id: 'intro',
        player: null,
        init: function () {
            this.content = '<div id="intro-loading"></div>';
            this.parent();
        }
    });
});