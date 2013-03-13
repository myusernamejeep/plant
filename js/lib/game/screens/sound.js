// lib/game/screens/sound.js
ig.baked = true;
ig.module('game.screens.sound').requires('game.screens.basescreen').defines(function () {
    SoundManager = BaseScreen.extend({
        id: 'sound',
        holderID: 'soundmanager',
        classVar: 'sound',
        bookmarkURL: 'http://www.tamba-games.co.uk/bookmarks.php',
        bookmarkClient: 'koubachi',
        init: function () {
            this.content = '' + '<a href="#" onclick="' + this.func('toggleSound', null, false) + '" id="btnsound">Toggle sound</a>';
            this.parent();
        },
        toggleSound: function () {
            if (ig.music.volume > 0) {
                ig.Sound.enabled = false;
                ig.music.volume = 0;
                $('#btnsound').css('background-position', '0 -26px');
            } else {
                ig.Sound.enabled = true;
                ig.music.volume = 1;
                $('#btnsound').css('background-position', '0 0');
            }
        },
        hide: function () {
            $('#' + this.holderID).css('display', 'none');
        },
        show: function () {
            $('#' + this.holderID).css('display', 'block');
        },
        func: function (method, arguments, useParent) {
            var func = 'ig.game.sound.';
            func += method + '(';
            if (arguments) {
                var j = arguments.length - 1;
                for (var i = 0; i <= j; i++) {
                    func += "'" + arguments[i] + "'";
                    if (i < j) func += ',';
                }
            }
            func += '); return false;';
            return func;
        }
    });
});