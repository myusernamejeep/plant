
// lib/game/levels/main.js
ig.baked = true;
ig.module('game.levels.main').requires('impact.image', 'game.entities.tools.tap', 'game.entities.tools.fertiliser', 'game.entities.tools.spray', 'game.entities.tools.wateringcan').defines(function () {
    LevelMain = {
        "entities": [{
            "type": "EntityTap",
            "x": 480,
            "y": 45,
            "settings": {
                "zIndex": -99999
            }
        }, {
            "type": "EntityFertiliser",
            "x": 568,
            "y": -16,
            "settings": {
                "zIndex": -9999
            }
        }, {
            "type": "EntitySpray",
            "x": 644,
            "y": -16,
            "settings": {
                "zIndex": -9999
            }
        }, {
            "type": "EntityWateringcan",
            "x": 740,
            "y": -16,
            "settings": {
                "zIndex": -9999
            }
        }],
        "layer": [{
            "name": "background",
            "width": 10,
            "height": 7,
            "linkWithCollision": false,
            "visible": 1,
            "tilesetName": "media/playfield/playfield-underlay.jpg",
            "repeat": false,
            "preRender": true,
            "distance": "1",
            "tilesize": 100,
            "foreground": false,
            "data": [
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
                [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
                [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
                [51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
                [61, 62, 63, 64, 65, 66, 67, 68, 69, 70]
            ]
        }]
    };
    LevelMainResources = [new ig.Image('media/playfield/playfield-underlay.jpg')];
});
