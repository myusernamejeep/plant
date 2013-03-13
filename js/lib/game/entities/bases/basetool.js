
// lib/game/entities/bases/basetool.js
ig.baked = true;
ig.module('game.entities.bases.basetool').requires('game.entities.bases.base').defines(function () {
    EntityBasetool = EntityBase.extend({
        _wmIgnore: false,
        size: {
            x: 150,
            y: 150
        },
        originPos: {
            x: 0,
            y: 0
        },
        animSheet: new ig.AnimationSheet('media/tools/fertiliser.png', 150, 150),
        activeSound: new ig.Sound('media/sound/pickup.ogg'),
        deactiveSound: new ig.Sound('media/sound/putdown.ogg'),
        refilledSound: new ig.Sound('media/sound/ping.ogg'),
        refillOffset: {
            x: 0,
            y: 0
        },
        deploySpeed: 0.2,
        deployLoops: 1,
        refillSpeed: 0.5,
        movementSpeed: 0.25,
        deployOffset: {
            x: 0,
            y: 0
        },
        fillLevel: 1,
        emptyRate: .2,
        empty: false,
        refilling: false,
        benefit: 'fertiliser',
        status: 'idle',
        isTool: true,
        autoRefill: false,
        active: false,
        deploying: false,
        draggable: false,
        targetPlant: null,
        init: function (x, y, settings) {
            this.initAnimation()
            this.parent(x, y, settings);
        },
        initAnimation: function () {
            var deployFrames = [4];
            for (var i = 0; i < this.deployLoops; i++) {
                deployFrames.push(5, 6);
            }
            deployFrames.push(7, 8);
            this.addAnim('idle', 1, [0], true);
            this.addAnim('active', 1, [1], true);
            this.addAnim('empty', 1, [2], true);
            this.addAnim('emptyactive', 1, [3], true);
            this.addAnim('refilling', this.refillSpeed, [9, 10, 11, 12, 13, 14, 15], true);
            this.addAnim('deploying', this.deploySpeed, deployFrames, true);
            this.currentAnim = this.anims['idle'];
            this.originPos = this.pos;
            if (this.fillLevel <= 0) this.setEmpty();
        },
        toggleActive: function () {
            if (!this.deploying && !this.refilling) {
                if (this.active) {
                    ig.game.selectedTool = null;
                    this.deactivate(true);
                } else {
                    ig.game.selectedTool = this;
                    this.activate();
                }
            }
        },
        activate: function () {
            if (this.empty) {
                this.currentAnim = this.anims['emptyactive'];
            } else {
                this.active = true;
                this.currentAnim = this.anims['active'];
            }
            this.activeSound.play();
            for (var i = 0; i < ig.game.entities.length; i++) {
                var entity = ig.game.entities[i];
                if (entity != this && entity.isTool) {
                    if (!entity.deploying) {
                        entity.deactivate(false);
                    }
                }
            }
        },
        deactivate: function (playSound) {
            if (this.refilling) return false;
            this.active = false;
            if (this.empty && !this.autoRefill) {
                this.currentAnim = this.anims['empty'];
            } else {
                this.currentAnim = this.anims['idle'];
            }
            if (playSound) this.deactiveSound.play();
        },
        deploy: function (plant) {
            if (!this.deploying && !this.empty && !plant.dead) {
                this.targetPlant = plant;
                this.targetPlant.engagedWithTool = true;
                this.deploying = true;
                this.zIndex = 9999;
                ig.game.sortEntitiesDeferred();
                ig.game.selectedTool = null;
                var targetX = (plant.pos.x - this.size.x) + this.deployOffset.x;
                var targetY = (plant.pos.y - this.size.y) + this.deployOffset.y;
                var onComplete = function () {
                        this.onTargetPlantReached()
                    }.bind(this);
                this.tween({
                    pos: {
                        x: targetX,
                        y: targetY
                    }
                }, this.movementSpeed, {
                    easing: ig.Tween.Easing.Quadratic.EaseOut,
                    onComplete: onComplete,
                }).start();
            }
        },
        onTargetPlantReached: function () {
            if (this.targetPlant.dead) {
                this.returnToOrigin();
                return
            }
            var hadConcern = false;
            if (this.targetPlant.concerns[this.benefit]) {
                hadConcern = true;
            }
            this.currentAnim = this.anims['deploying'].rewind();
            if (this.deploySound) this.deploySound.play();
            this.fillLevel -= this.emptyRate;
            this.targetPlant.updateStatus(this.benefit, this.emptyRate)
            if (this.fillLevel < 0) this.fillLevel = 0;
            if (hadConcern && !this.targetPlant.concerns[this.benefit]) {
                State.score += 100;
            }
        },
        returnToOrigin: function () {
            this.targetPlant.engagedWithTool = false;
            var onComplete = function () {
                    this.onDeploymentComplete();
                }.bind(this);
            if (this.deploySound) this.deploySound.stop();
            this.tween({
                pos: this.originPos,
            }, this.movementSpeed, {
                easing: ig.Tween.Easing.Quadratic.EaseIn,
                onComplete: onComplete,
            }).start();
        },
        onDeploymentComplete: function () {
            this.zIndex = -9999;
            ig.game.sortEntitiesDeferred();
            this.deploying = false;
            this.deactivate(false);
            if (this.fillLevel <= 0) this.setEmpty();
        },
        setEmpty: function () {
            this.empty = true;
            this.currentAnim = this.anims['empty'];
            if (this.autoRefill) this.refill();
        },
        refill: function () {
            this.currentAnim = this.anims['refilling'].rewind();
        },
        onRefillComplete: function () {
            this.empty = false;
            this.fillLevel = 1
            this.refilling = false;
            this.deactivate(false);
            this.refilledSound.play();
            if (ig.game.selectedTool == this) {
                ig.game.selectedTool = null;
            }
        },
        update: function () {
            if (this.currentAnim == this.anims['deploying'] && this.currentAnim.loopCount >= 1) {
                this.currentAnim = this.anims['idle'];
                this.returnToOrigin();
            } else if (this.currentAnim == this.anims['refilling']) {
                if (this.currentAnim.loopCount >= 1) {
                    this.onRefillComplete();
                } else {
                    this.refilling = true;
                }
            }
            this.parent();
        }
    });
});
