// lib/game/entities/icons/bubble.js
ig.baked = true;
ig.module('game.entities.icons.bubble').requires('impact.entity').defines(function () {
    EntityBubble = ig.Entity.extend({
        _wmIgnore: true,
        size: {
            x: 134,
            y: 1215
        },
        animSheet: new ig.AnimationSheet('media/icons/bubbles.png', 134, 129),
        plant: null,
        index: 0,
        type: '',
        ignoreMouse: true,
        offset: {
            x: -30,
            y: 130
        },
        holdTimer: null,
        holdDuration: 1,
        exiting: false,
        init: function (x, y, settings) {
            this.addAnim('water_left', 1, [0], true);
            this.addAnim('water_right', 1, [1], true);
            this.addAnim('mist_left', 1, [2], true);
            this.addAnim('mist_right', 1, [3], true);
            this.addAnim('light_left', 1, [4], true);
            this.addAnim('light_right', 1, [5], true);
            this.addAnim('heat_left', 1, [6], true);
            this.addAnim('heat_right', 1, [7], true);
            this.addAnim('fertiliser_left', 1, [8], true);
            this.addAnim('fertiliser_right', 1, [9], true);
            this.parent(x, y, settings);
            var animName = this.type + '_left';
            this.currentAnim = this.anims[animName];
            this.holdTimer = new ig.Timer();
            if (this.plant.pos.x < 480) {
                this.currentAnim = this.anims[this.type + '_left'];
                this.offset.x = -30;
            } else {
                this.currentAnim = this.anims[this.type + '_right'];
                this.offset.x = 160;
            }
        },
        update: function () {
            this.parent();
            this.pos.x = this.getXPos();
            this.pos.y = this.plant.pos.y;
            this.zIndex = this.plant.zIndex + (this.index + 1);
            ig.game.sortEntitiesDeferred();
            if (this.holdTimer.delta() > this.holdDuration) {
                this.startExit();
                this.plant.removeBubble(this.type);
            } else {}
        },
        startExit: function () {
            if (!this.exiting) {
                this.setFade('out', .5, true);
                this.exiting = true;
            }
        },
        getXPos: function () {
            return this.plant.pos.x
        },
        setIndex: function (index) {
            this.index = index;
        },
    });
})