// lib/game/screens/social.js
ig.baked = true;
ig.module('game.screens.social').requires('game.screens.basescreen').defines(function () {
    Social = BaseScreen.extend({
        id: 'social',
        holderID: 'social',
        classVar: 'social',
        init: function () {
            this.content = '' + '<ul class="social">' + '<li><a href="#" class="social facebook" onclick="' + this.func('gotoSocial', ['facebook']) + '">Facebook</a></li>' + '<li><a href="#" class="social twitter" onclick="' + this.func('gotoSocial', ['twitter']) + '">Twitter</a></li>' + '</ul>';
            this.parent();
        },
        hide: function () {
            $('#' + this.holderID).css('display', 'none');
        },
        show: function () {
            $('#' + this.holderID).css('display', 'block');
        },
        func: function (method, arguments, useParent) {
            var func = 'ig.game.social.';
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
