// lib/game/entities/bases/baseplant.js
ig.baked = true;
ig.module('game.entities.bases.baseplant').requires('game.entities.bases.base', 'game.entities.icons.icon').defines(function () {
    EntityBaseplant = EntityBase.extend({
        collides: ig.Entity.COLLIDES.NONE,
        size: {
            x: 272,
            y: 225
        },
        states: ['healthy', 'dying', 'dead'],
        thudSound: new ig.Sound('media/sound/thud.ogg'),
        deadSound: new ig.Sound('media/sound/deadplant.ogg'),
        isPlant: true,
        engagedWithTool: false,
        displayedOnStatusMonitor: false,
        vitality: 1,
        dead: false,
        status: {
            water: 0,
            mist: 0,
            heat: 0,
            light: 0,
            fertiliser: 0
        },
        desires: {
            water: .5,
            mist: .5,
            heat: .5,
            light: .5,
            fertiliser: .5
        },
        concerns: {
            water: false,
            mist: false,
            heat: false,
            light: false,
            fertiliser: false
        },
        decayRates: {
            water: 0.0002,
            mist: 0.0002,
            fertiliser: 0.0001
        },
        decayMultiplier: 2,
        leeway: .2,
        icons: [],
        iconPos: {
            x: 20,
            y: 50
        },
        bubbles: [],
        init: function (x, y, settings) {
            for (var s in this.desires) {
                this.status[s] = this.desires[s];
            }
            for (var i = 0; i < this.states.length; i++) {
                this.addAnim(this.states[i], 1, [i], true);
            }
            this.currentAnim = this.anims['healthy'];
            this.parent(x, y, settings);
        },
        setDifficulty: function (difficulty) {
            if (ig.game.totalPlants == 0) {
                this.status.water = .1;
                this.decayMultiplier = difficulty * 3;
                ig.game.totalPlants++;
            } else {
                this.decayMultiplier = difficulty * .7;
            }
        },
        onDrop: function () {
            var gridCoords = this.grid.pixelsToCoord(this.pos.x, this.pos.y);
            this.addToGrid(gridCoords.x, gridCoords.y, true);
            if (this.dragDistance > 10) {
                this.thudSound.play();
            }
        },
        onDoubleClick: function () {
            ig.game.launchStatusMonitor(this);
        },
        updateAllStatuses: function () {
            if (!this.engagedWithTool && !this.dead) {
                this.updateStatus('water', -this.decayRates.water * this.decayMultiplier);
                this.updateStatus('mist', -this.decayRates.mist * this.decayMultiplier);
                this.updateStatus('fertiliser', -this.decayRates.fertiliser * this.decayMultiplier);
            }
            var lightLevel = this.grid.getLightLevel(this.gridPos.x, this.gridPos.y);
            this.setStatus('light', lightLevel);
            var heatLevel = this.grid.getHeatLevel(this.gridPos.x, this.gridPos.y);
            this.setStatus('heat', heatLevel);
        },
        updateStatus: function (type, amount) {
            var newAmount = this.status[type] + amount * Config.gameSpeed;
            if (newAmount < 0) newAmount = 0;
            else if (newAmount > 1) newAmount = 1;
            this.status[type] = newAmount;
            this.checkStatuses()
        },
        setStatus: function (type, amount) {
            if (this.status[type]) {
                var newAmount = amount;
                if (newAmount < 0) newAmount = 0;
                else if (newAmount > 1) newAmount = 1;
                this.status[type] = newAmount;
            }
        },
        checkStatuses: function () {
            for (var s in this.status) {
                var current = this.status[s]
                var desire = this.desires[s];
                var diff = Math.abs(current - desire);
                var leeway = this.leeway;
                if (s == 'light') {
                    leeway = 0;
                }
                if (diff > leeway) {
                    this.addConcern(s)
                } else {
                    this.removeConcern(s)
                }
            }
        },
        addConcern: function (type) {
            if (!this.concerns[type]) {
                this.addBubble(type);
                this.concerns[type] = true;
                this.addIcon(type);
            }
        },
        removeConcern: function (type) {
            if (this.concerns[type]) {
                this.concerns[type] = false;
                this.removeIcon(type);
            }
        },
        updateVitality: function () {
            if (this.dead) return false;
            var totalConcerns = 0;
            var modifier = 0;
            for (var c in this.concerns) {
                if (this.concerns[c]) {
                    totalConcerns++;
                }
            }
            if (totalConcerns == 5) {
                modifier = -30;
            } else if (totalConcerns == 4) {
                modifier = -20;
            } else if (totalConcerns == 3) {
                modifier = -10;
            } else if (totalConcerns == 2) {
                modifier = 10;
            } else if (totalConcerns == 1) {
                modifier = 20;
            } else if (totalConcerns == 0) {
                modifier = 30;
            }
            modifier *= .0001;
            var newAmount = this.vitality + modifier;
            if (newAmount < 0) newAmount = 0;
            else if (newAmount > 1) newAmount = 1;
            this.vitality = newAmount;
            if (this.vitality > .75) this.currentAnim = this.anims['healthy'];
            else if (this.vitality > .25) this.currentAnim = this.anims['dying'];
            else this.currentAnim = this.anims['dead'];
            if (this.vitality <= 0) {
                this.die();
            }
        },
        die: function () {
            this.dead = true;
            this.deadSound.play();
            ig.game.showMessage('plantdead');
            this.setFade('out', .5, true);
            this.onDeathComplete();
            if (State.lives > 0) State.lives--;
            for (var i = 0; i < this.icons.length; i++) {
                this.icons[i].kill();
            }
        },
        onDeathComplete: function () {
            if (State.lives > 0) ig.game.spawnPlant(this.className);
        },
        addBubble: function (type) {
            var settings = {
                plant: this,
                index: this.bubbles.length,
                type: type,
                span: .25,
                fadeValue: 'in',
                name: 'name'
            }
            var bubble = ig.game.spawnEntity('EntityBubble', 0, 0, settings);
            this.bubbles.push(bubble);
        },
        removeBubble: function (type) {
            for (var i = 0; i < this.bubbles.length; i++) {
                if (this.bubbles[i].type == type) {
                    this.bubbles.splice(i, 1);
                    break;
                }
            }
        },
        addIcon: function (type) {
            var iconExists = false;
            for (var i = 0; i < this.icons.length; i++) {
                if (this.icons[i].type == type) {
                    return;
                }
            }
            var settings = {
                plant: this,
                index: this.icons.length,
                type: type
            }
            var icon = ig.game.spawnEntity('EntityIcon', 0, 0, settings);
            this.icons.push(icon);
        },
        removeIcon: function (type) {
            for (var i = 0; i < this.icons.length; i++) {
                if (this.icons[i].type == type) {
                    this.icons[i].kill();
                    this.icons.splice(i, 1);
                    break;
                }
            }
            for (var i = 0; i < this.icons.length; i++) {
                this.icons[i].setIndex(i);
            }
        },
        totalConcerns: function () {
            var totalConcerns = 0;
            for (var c in this.concerns) {
                if (this.concerns[c]) {
                    totalConcerns++;
                }
            }
            return totalConcerns;
        },
        update: function () {
            if (this.engagedWithTool || this.dead) {
                this.draggable = false;
            } else if (ig.game.selectedTool && !ig.game.selectedTool.empty) {
                this.draggable = false;
                if (ig.input.pressed('lbtn') && this.isMouseInside() && !ig.game.isMouseOverTools()) {
                    ig.game.selectedTool.deploy(this);
                }
            } else {
                this.draggable = true;
            }
            if (!this.dead && ig.game.gameActive) {
                this.updateAllStatuses();
                this.checkStatuses();
                this.updateVitality();
            }
            this.parent();
        }
    });
});

