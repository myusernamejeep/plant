
// lib/game/entities/monitor/statusglow.js
ig.baked = true;
ig.module('game.entities.monitor.statusglow').requires('impact.entity').defines(function () {
    EntityStatusglow = ig.Entity.extend({
        _wmIgnore: true,
        size: {
            x: 300,
            y: 74
        },
        animSheet: new ig.AnimationSheet('media/status-monitor/glow.png', 300, 74),
        monitoringType: '',
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('on', 1, [0], true);
            this.currentAnim = this.anims['off'];
        },
        setMonitoring: function (type) {
            this.monitoringType = type;
        }
    });
})