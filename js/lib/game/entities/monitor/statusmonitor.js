
// lib/game/entities/monitor/statusmonitor.js
ig.baked = true;
ig.module('game.entities.monitor.statusmonitor').requires('impact.entity', 'plugins.impact-tween.tween', 'game.entities.monitor.statusbar', 'game.entities.monitor.statusglow', 'game.entities.monitor.statusideal').defines(function () {
    StatusMonitor = ig.Entity.extend({
        size: {
            x: 960,
            y: 640
        },
        overlay: new ig.Image('media/status-monitor/overlay.png'),
        underlay: new ig.Image('media/status-monitor/underlay.png'),
        nameFont: new ig.Font('media/fonts/arial-rounded-30-black.png'),
        activeSound: new ig.Sound('media/sound/pickup.ogg'),
        deactiveSound: new ig.Sound('media/sound/putdown.ogg'),
        plant: null,
        displayPlant: null,
        active: false,
        hideable: false,
        hideTimer: new ig.Timer(),
        barSettings: {
            water: {
                y: 180
            },
            mist: {
                y: 245
            },
            light: {
                y: 311
            },
            heat: {
                y: 377
            },
            fertiliser: {
                y: 444
            }
        },
        bars: [],
        barX: 230,
        barMaxX: 470,
        totalBars: 0,
        glows: [],
        glowX: 457,
        ideals: [],
        idealX: 490,
        glowSettings: {
            water: {
                y: 164
            },
            mist: {
                y: 230
            },
            light: {
                y: 296
            },
            heat: {
                y: 362
            },
            fertiliser: {
                y: 429
            }
        },
        init: function (x, y, settings) {
            this.initBars();
            this.parent(x, y, settings);
        },
        initBars: function () {
            for (var s in this.barSettings) {
                var statusBar = new EntityStatusbar(0, 0);
                statusBar.pos.x = this.barX;
                statusBar.pos.y = this.barSettings[s].y;
                statusBar.setMonitoring(s);
                this.bars.push(statusBar);
                var glow = new EntityStatusglow(0, 0);
                glow.pos.x = this.glowX;
                glow.pos.y = this.glowSettings[s].y;
                this.glows.push(glow)
                var ideal = new EntityStatusideal(0, 0);
                ideal.pos.x = 600;
                ideal.pos.y = this.glowSettings[s].y + 16;
                this.ideals.push(ideal);
                ideal.setMonitoring(s);
            }
            this.totalBars = this.bars.length;
        },
        setPlant: function (plant) {
            this.hideable = false;
            this.active = true;
            this.hideTimer.reset();
            this.plant = plant;
            this.displayPlant = new(eval(plant.className));
            this.displayPlant.displayedOnStatusMonitor = true;
            this.displayPlant.pos = {
                x: 335,
                y: 350
            };
            this.activeSound.play();
        },
        update: function () {
            if (this.plant) {
                if (this.hideTimer.delta() > .25) {
                    this.hideable = true;
                }
                var j = this.totalBars;
                for (var i = 0; i < j; i++) {
                    var bar = this.bars[i];
                    var glow = this.glows[i];
                    var diff = this.barMaxX - this.barX;
                    var monitorType = bar.monitoringType;
                    var attributeValue = this.plant.status[monitorType];
                    bar.pos.x = (diff * attributeValue) + this.barX
                    if (this.plant.concerns[monitorType]) {
                        glow.currentAnim = glow.anims['on'];
                    } else {
                        glow.currentAnim = glow.anims['off'];
                    }
                    var ideal = this.ideals[i];
                    monitorType = ideal.monitoringType;
                    attributeValue = this.plant.desires[monitorType];
                    var attrMin = this.plant.desires[monitorType] - this.plant.leeway;
                    var attrMax = this.plant.desires[monitorType] + this.plant.leeway;
                    var min = (diff * attrMin) + this.idealX;
                    var max = (diff * attrMax) + this.idealX;
                    ideal.updatePosition(min, max);
                }
                if (this.plant.dead) {
                    this.hide();
                }
            }
            this.parent();
        },
        draw: function () {
            this.parent();
            if (this.plant) {
                this.underlay.draw(470, 180);
                var j = this.totalBars;
                for (var i = 0; i < j; i++) {
                    this.bars[i].draw();
                }
                for (var i = 0; i < j; i++) {
                    this.ideals[i].draw();
                }
                this.overlay.draw(0, 0);
                if (this.displayPlant) this.displayPlant.draw();
                var textX = 340;
                var textY = 432;
                this.nameFont.draw(this.plant.plantName[0], textX, textY, ig.Font.ALIGN.CENTER);
                this.nameFont.draw(this.plant.plantName[1], textX, textY + 32, ig.Font.ALIGN.CENTER);
                for (var i = 0; i < j; i++) {
                    this.glows[i].draw();
                }
            }
        },
        hide: function () {
            if (this.displayPlant) {
                this.hideTimer.reset();
                this.displayPlant.kill();
                this.displayPlant = null;
                this.deactiveSound.play();
            }
            this.active = false;
        }
    });
})
