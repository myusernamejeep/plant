
// lib/game/entities/bases/base.js
ig.baked = true;
ig.module('game.entities.bases.base').requires('impact.entity', 'plugins.impact-tween.tween', 'plugins.fading', 'game.grid').defines(function () {
    EntityBase = ig.Entity.extend({
        _wmIgnore: false,
        collides: ig.Entity.COLLIDES.NONE,
        isClicked: false,
        isPlant: false,
        isTool: false,
        draggable: true,
        dragDistance: 0,
        dragOrigin: {
            x: 0,
            y: 0
        },
        doubleClickTimer: null,
        checkForDoubleClick: true,
        ignoreMouse: false,
        grid: new Grid(),
        posDelta: {
            x: 0,
            y: 0
        },
        modX: {
            x: 0,
            y: 0
        },
        gridPos: {
            x: -1,
            y: -1
        },
        init: function (x, y, settings) {
            this.doubleClickTimer = new ig.Timer(0.3);
            this.parent(x, y, settings);
        },
        addToGrid: function (gx, gy, correct) {
            if (this.grid.coordIsOccupied(gx, gy, this)) {
                this.addToGrid(this.gridPos.x, this.gridPos.y, true);
                return;
            }
            var pixelCoords = this.grid.coordToPixels(gx, gy);
            if (correct) {
                this.tween({
                    pos: {
                        x: pixelCoords.x,
                        y: pixelCoords.y
                    }
                }, .15, {
                    easing: ig.Tween.Easing.Quadratic.EaseIn
                }).start();
            } else {
                this.pos.y = -this.size.y * 2;
                this.pos.x = pixelCoords.x;
                var onComplete = function () {
                        this.onLandedOnGrid()
                    }.bind(this);
                this.tween({
                    pos: {
                        x: pixelCoords.x,
                        y: pixelCoords.y
                    }
                }, .4, {
                    easing: ig.Tween.Easing.Quadratic.EaseIn,
                    onComplete: onComplete
                }).start();
            }
            this.gridPos = {
                x: gx,
                y: gy
            };
            this.zIndex = (gy - this.grid.size[1]) * 20;
            ig.game.sortEntitiesDeferred();
        },
        onLandedOnGrid: function () {
            this.thudSound.play();
        },
        dragAndDrop: function () {
            var mouse_x = ig.input.mouse.x;
            var mouse_y = ig.input.mouse.y;
            var modX = 0;
            var mod_y = 0;
            var isClicked = this.isClicked;
            if (isClicked && ig.input.state('lbtn')) {
                this.pos.x = mouse_x - this.posDelta.x;
                this.pos.y = mouse_y - this.posDelta.y;
                this.zIndex = 999;
                ig.game.itemCarried = true;
                ig.game.sortEntitiesDeferred();
            } else if (isClicked) {
                this.isClicked = false;
                ig.game.itemCarried = false;
                var x2 = this.pos.x;
                var x1 = this.dragOrigin.x;
                var y2 = this.pos.y;
                var y1 = this.dragOrigin.y;
                var xd = x2 - x1;
                var yd = y2 - y1;
                this.dragDistance = Math.sqrt(xd * xd + yd * yd)
                this.onDrop();
            } else if (ig.input.pressed('lbtn') && this.isMouseInside()) {
                this.posDelta.x = mouse_x - this.pos.x;
                this.posDelta.y = mouse_y - this.pos.y;
                this.isClicked = true;
                this.dragOrigin = this.pos;
                this.onDragStart();
            } else {
                this.isClicked = false;
            }
        },
        onDragStart: function () {},
        onDrop: function () {},
        isMouseInside: function () {
            var entities = ig.game.entitiesUnderMouse();
            if (this == entities[entities.length - 1]) {
                return true;
            }
            return false;
        },
        checkDoubleClick: function () {
            if (ig.input.pressed('lbtn') && this.isMouseInside()) {
                if (this.checkForDoubleClick && (this.doubleClickTimer.delta() < 0)) {
                    this.onDoubleClick();
                } else {
                    this.doubleClickTimer.reset();
                }
                this.checkForDoubleClick = false;
            } else {
                this.checkForDoubleClick = true;
            }
        },
        onDoubleClick: function () {},
        update: function () {
            if (ig.game.gameActive) {
                if (this.draggable) this.dragAndDrop(false, true);
                this.checkDoubleClick();
            }
            this.parent();
        },
        draw: function () {
            this.parent();
        }
    });
})