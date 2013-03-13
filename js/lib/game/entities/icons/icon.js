// lib/game/entities/icons/icon.js
ig.baked = true;
ig.module('game.entities.icons.icon').requires('impact.entity').defines(function () {
    EntityIcon = ig.Entity.extend({
        _wmIgnore: true,
        size: {
            x: 34,
            y: 34
        },
        animSheet: new ig.AnimationSheet('media/icons/icons.png', 34, 34),
        monitoringType: '',
        plant: null,
        index: 0,
        type: '',
        ignoreMouse: true,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('fertiliser', 1, [0], true);
            this.addAnim('heat', 1, [1], true);
            this.addAnim('light', 1, [2], true);
            this.addAnim('mist', 1, [3], true);
            this.addAnim('water', 1, [4], true);
            this.currentAnim = this.anims[this.type];
        },
        update: function () {
            this.parent();
            this.pos.x = this.getXPos();
            this.pos.y = this.plant.pos.y;
            this.zIndex = this.plant.zIndex + (this.index + 1);
            ig.game.sortEntitiesDeferred();
        },
        getXPos: function () {
            return this.plant.pos.x - this.plant.offset.x + this.plant.iconPos.x + (this.index * 18)
        },
        setIndex: function (index) {
            this.index = index;
        },
    });
})
