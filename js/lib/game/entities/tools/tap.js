
// lib/game/entities/tools/tap.js
ig.baked = true;
ig.module('game.entities.tools.tap').requires('game.entities.bases.base').defines(function () {
    EntityTap = EntityBase.extend({
        name: 'tap',
        _wmIgnore: false,
        size: {
            x: 150,
            y: 150
        },
        animSheet: new ig.AnimationSheet('media/tools/tap.png', 150, 150),
        draggable: false,
        engaged: false,
        pourSound: new ig.Sound('media/sound/pour.ogg'),
        tool: null,
        init: function (x, y, settings) {
            this.addAnim('off', 1, [0], true);
            this.addAnim('on', 1, [1], true);
            this.addAnim('flowing', .2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], false);
            this.parent(x, y, settings);
        },
        refillTool: function (tool) {
            if (!tool || this.engaged) return;
            if (tool.empty && !tool.autoRefill) {
                this.tool = tool;
                tool.zIndex = -1000;
                ig.game.sortEntitiesDeferred();
                this.engaged = true;
                var onComplete = function () {
                        this.beginRefill()
                    }.bind(this);
                tool.tween({
                    pos: {
                        x: this.pos.x + tool.refillOffset.x,
                        y: this.pos.y + tool.refillOffset.y
                    }
                }, .2, {
                    easing: ig.Tween.Easing.Quadratic.EaseOut,
                    onComplete: onComplete,
                }).start();
            }
        },
        beginRefill: function () {
            this.tool.refill();
            this.currentAnim = this.anims['flowing'];
            this.pourSound.play();
            State.score += 50;
        },
        update: function () {
            if (this.engaged) {
                if (!this.tool.empty) {
                    this.engaged = false;
                    this.currentAnim = this.anims['off'];
                    this.pourSound.stop();
                    var onComplete = function () {
                            this.beginRefill()
                        }.bind(this);
                    var tool = this.tool
                    tool.tween({
                        pos: tool.originPos
                    }, .2, {
                        easing: ig.Tween.Easing.Quadratic.EaseOut,
                    }).start();
                }
            }
            this.parent();
        }
    });
});