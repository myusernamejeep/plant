

// lib/game/entities/tools/wateringcan.js
ig.baked = true;
ig.module('game.entities.tools.wateringcan').requires('game.entities.bases.basetool').defines(function () {
    EntityWateringcan = EntityBasetool.extend({
        name: 'wateringcan',
        benefit: 'water',
        animSheet: new ig.AnimationSheet('media/tools/watering-can.png', 150, 150),
        deploySound: new ig.Sound('media/sound/watercan.ogg'),
        deployOffset: {
            x: 25,
            y: -5
        },
        refillOffset: {
            x: -5,
            y: 35
        }
    });
});
