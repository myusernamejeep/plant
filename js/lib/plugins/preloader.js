// lib/plugins/preloader.js
ig.baked = true;
ig.module('plugins.preloader').requires('impact.loader').defines(function () {
    ig.Preloader = ig.Loader.extend({
        backdrop: new ig.Image('media/ui/preloader.png'),
        draw: function () {
            this._drawStatus += (this.status - this._drawStatus) / 5;
            var s = ig.system.scale;
            var w = 497;
            var h = 15;
            var x = 234;
            var y = 482;
            ig.system.context.fillStyle = '#DAECF6';
            ig.system.context.fillRect(0, 0, 960, 640);
            this.backdrop.draw(0, 0);
            ig.system.context.fillStyle = '#2FA23D';
            ig.system.context.fillRect(x * s, y * s, w * s * this._drawStatus, h * s);
        }
    });
});