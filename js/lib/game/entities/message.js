// lib/game/entities/message.js
ig.baked = true;
ig.module('game.entities.message').requires('plugins.impact-tween.tween', 'game.entities.bases.base').defines(function () {
    EntityMessage = EntityBase.extend({
        size: {
            x: 493,
            y: 81
        },
        collides: ig.Entity.COLLIDES.NONE,
        animSheet: new ig.AnimationSheet('media/messages.png', 493, 79),
        animSpeed: 30,
        timer: null,
        holdDuration: 1,
        exiting: false,
        complete: false,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.initAnims();
            this.timer = new ig.Timer();
        },
        initAnims: function () {
            this.addAnim('getready', this.animSpeed, [0], true);
            this.addAnim('levelup', this.animSpeed, [1], true);
            this.addAnim('gameover', this.animSpeed, [2], true);
            this.addAnim('plantdead', this.animSpeed, [3], true);
        },
        showMessage: function (id) {
            this.pos.x = -this.size.x
            this.pos.y = ((Config.size.y - this.size.y) / 2) + 40;
            this.timer.reset();
            this.complete = false;
            this.exiting = false;
            var onComplete = function () {
                    this.onEnterComplete()
                }.bind(this);
            this.tween({
                pos: {
                    x: (Config.size.x - this.size.x) / 2
                }
            }, .5, {
                delay: .5,
                easing: ig.Tween.Easing.Back.EaseOut,
                onComplete: onComplete
            }).start();
            this.currentAnim = this.anims[id];
        },
        startExit: function () {
            if (!this.exiting) {
                var onComplete = function () {
                        this.onExitComplete()
                    }.bind(this);
                this.tween({
                    pos: {
                        x: Config.size.x
                    }
                }, .5, {
                    easing: ig.Tween.Easing.Back.EaseIn,
                    onComplete: onComplete
                }).start();
                this.exiting = true;
            }
        },
        onEnterComplete: function () {
            this.timer.reset();
        },
        onExitComplete: function () {
            if (!this.complete) {
                this.complete = true;
            }
        },
        update: function () {
            this.parent();
            if (this.timer.delta() > this.holdDuration) {
                this.startExit();
            }
        },
        draw: function () {
            this.parent();
        }
    });
});