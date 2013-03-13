
// lib/game/entities/monitor/statusbar.js
ig.baked = true;
ig.module('game.entities.monitor.statusbar').requires('impact.entity').defines(function () {
    EntityStatusbar = ig.Entity.extend({
        _wmIgnore: true,
        size: {
            x: 283,
            y: 48
        },
        animSheet: new ig.AnimationSheet('media/status-monitor/bars.png', 283, 48),
        monitoringType: '',
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('water', 1, [0], true);
            this.addAnim('mist', 1, [1], true);
            this.addAnim('light', 1, [2], true);
            this.addAnim('heat', 1, [3], true);
            this.addAnim('fertiliser', 1, [4], true);
            this.currentAnim = this.anims['water'];
        },
        setMonitoring: function (type) {
            this.monitoringType = type;
            this.currentAnim = this.anims[type];
        }
    });
})