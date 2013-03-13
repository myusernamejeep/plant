// lib/plugins/fading.js
ig.baked = true;
ig.module('plugins.fading').requires('impact.entity', 'impact.input').defines(function () {
    ig.Entity.inject({
        span: 0,
        fadeValue: 'stop',
        readyToKill: false,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            if (this.fadeValue == 'in') {
                this.currentAnim.alpha = 0;
            } else if (this.fadeValue == 'out') {
                this.currentAnim.alpha = 1;
            }
            this.timer = new ig.Timer(this.span);
        },
        update: function () {
            this.parent();
            if (this.fadeValue == 'in') {
                this.fadeIn()
            }
            if (this.fadeValue == 'out') {
                this.fadeOut();
            }
            if (this.fadeValue == 'stop' && this.readyToKill) {
                this.kill();
            }
        },
        fadeIn: function () {
            if (this.timer.delta() <= 0) {
                this.currentAnim.alpha = 1 + (this.timer.delta() / this.span);
            } else {
                this.fadeValue = 'stop';
            }
        },
        fadeOut: function () {
            if (this.timer.delta() <= 0) {
                this.currentAnim.alpha = 0 - (this.timer.delta() / this.span);
            } else {
                this.fadeValue = 'stop';
            }
        },
        setFade: function (fadeValue, span, readyToKill) {
            this.fadeValue = fadeValue;
            this.timer.set(span);
            this.readyToKill = readyToKill;
        },
    });
});
