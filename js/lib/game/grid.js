// lib/game/grid.js
ig.baked = true;
ig.module('game.grid').defines(function () {
    Grid = ig.Class.extend({
        bounds: [44, 182, 880, 440],
        size: [8, 4],
        maxHeat: 0.5,
        coordToPixels: function (gx, gy) {
            var squareSize = this.squareSize();
            var halfSquareSize = squareSize * .5;
            var xPos = (squareSize * gx) + this.bounds[0];
            var yPos = (squareSize * gy) + this.bounds[1];
            return {
                x: xPos + halfSquareSize,
                y: yPos + halfSquareSize
            }
        },
        pixelsToCoord: function (px, py) {
            px -= this.bounds[0];
            py -= this.bounds[1];
            var squareSize = this.squareSize();
            var xPos = Math.floor(px / squareSize);
            var yPos = Math.floor(py / squareSize);
            if (xPos < 0) xPos = 0;
            else if (xPos > this.size[0] - 1) xPos = this.size[0] - 1;
            if (yPos < 0) yPos = 0;
            else if (yPos > this.size[1] - 1) yPos = this.size[1] - 1;
            return {
                x: xPos,
                y: yPos
            }
        },
        coordIsOccupied: function (gx, gy, excludedEntity) {
            var entities = ig.game.entities;
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i]
                var gridPos = entity.gridPos;
                if (gridPos) {
                    var toCheck = true;
                    if (excludedEntity && entity == excludedEntity) {
                        toCheck = false;
                    }
                    if (toCheck && gridPos.x == gx && gridPos.y == gy) {
                        return true;
                    }
                }
            }
            return false
        },
        getRandomFreeCoord: function () {
            var freeCoords = [];
            for (var gy = 0; gy < this.size[1]; gy++) {
                for (var gx = 0; gx < this.size[0]; gx++) {
                    if (!this.coordIsOccupied(gx, gy)) {
                        freeCoords.push({
                            x: gx,
                            y: gy
                        });
                    }
                }
            }
            var r = Math.floor(Math.random() * freeCoords.length);
            return freeCoords[r];
        },
        squareSize: function () {
            return this.bounds[2] / this.size[0];
        },
        getHeatLevel: function (gx, gy) {
            var index = this.size[0] - gx;
            var heat = index * .125;
            return heat
        },
        getLightLevel: function (gx, gy) {
            var light = 0;
            if (gx <= 3) {
                if (gy == 0) light = .8;
                else if (gy == 1) light = .6;
                else if (gy == 2) light = .4;
                else if (gy == 3) light = .4;
            } else {
                if (gy == 0) light = .4;
                else if (gy == 1) light = .4;
                else if (gy == 2) light = .8;
                else if (gy == 3) light = 1;
            }
            return light;
        }
    });
})
