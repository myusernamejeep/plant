// lib/game/hud.js
ig.baked = true;
ig.module('game.hud').requires('impact.entity', 'impact.font').defines(function () {
    HUD = ig.Entity.extend({
        timerSeconds: 0,
        timer: new ig.Timer(),
        timerActive: false,
        underlay: new ig.Image('media/hud/underlay.png'),
        mainFont: new ig.Font('media/fonts/arial-rounded-40.png'),
        init: function (x, y, settings) {
            this.parent(x, y, settings);
        },
        toggleTimer: function (active) {
            this.timer.set(this.maxSeconds)
            this.timerActive = active;
        },
        updateTimer: function () {
            if (this.timerActive) {
                var lastTimerSeconds = this.timerSeconds;
                this.timerSeconds = Math.round(this.timer.delta());
                if (this.timerSeconds > lastTimerSeconds && this.timerSeconds % 5 == 0) {
                    ig.game.updateScore();
                }
            }
        },
        zeroFill: function (number, width) {
            width -= number.toString().length;
            if (width > 0) {
                return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
            }
            return number + "";
        },
        update: function () {
            this.parent();
            this.updateTimer();
        },
        draw: function () {
            this.parent();
            this.underlay.draw(0, 0);
            var textY = 72;
            var mins = Math.floor((this.timerSeconds) / 60);
            var secs = this.timerSeconds % 60;
            var timerText = this.zeroFill(mins, 2) + ':' + this.zeroFill(secs, 2);
            this.mainFont.draw(timerText, 337, textY, ig.Font.ALIGN.LEFT);
            this.mainFont.draw(this.zeroFill(State.score, 6), 150, textY, ig.Font.ALIGN.LEFT);
            this.mainFont.draw('x' + State.lives, 113, textY + 5, ig.Font.ALIGN.RIGHT);
        },
    });
})
