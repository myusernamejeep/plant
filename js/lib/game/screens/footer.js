// lib/game/screens/footer.js
ig.baked = true;
ig.module('game.screens.footer').requires('game.screens.basescreen').defines(function () {
    Footer = BaseScreen.extend({
        id: 'footer',
        holderID: 'footer',
        classVar: 'footer',
        init: function () {
            this.content = '' + '<ul class="footer">' + '<li><a href="#" class="sound" id="btn-sound" onclick="' + this.func('toggleSound') + '">Sound on/off</a></li>' + '<li><a href="http://www.tamba.co.uk" class="tamba" target="_blank" id="btntamba">Game by TAMBA</a></li>' + '</ul>';
            this.parent();
        },
        hide: function () {
            $('#' + this.holderID).css('display', 'none');
        },
        show: function () {
            $('#' + this.holderID).css('display', 'block');
        },
        func: function (method, arguments, useParent) {
            var func = 'ig.game.footer.';
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
