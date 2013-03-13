
// lib/game/entities/monitor/statusideal.js
ig.baked = true;
ig.module('game.entities.monitor.statusideal').requires('impact.entity').defines(function () {
    EntityStatusideal = ig.Entity.extend({
        _wmIgnore: true,
        size: {
            x: 10,
            y: 44
        },
        animSheet: new ig.AnimationSheet('media/status-monitor/ideal.png', 10, 44),
        monitoringType: '',
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('ideal', 1, [0], true);
        },
        setMonitoring: function (type) {
            this.monitoringType = type;
        },
        updatePosition: function (min, max) {
            this.anims.ideal.sheet.width = Math.abs(max - min);
            this.pos.x = min;
        }
    });
})