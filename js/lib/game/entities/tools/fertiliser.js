// lib/game/entities/tools/fertiliser.js
ig.baked = true;
ig.module('game.entities.tools.fertiliser').requires('game.entities.bases.basetool').defines(function () {
    EntityFertiliser = EntityBasetool.extend({
        name: 'fertiliser',
        benefit: 'fertiliser',
        animSheet: new ig.AnimationSheet('media/tools/fertiliser.png', 150, 150),
        deploySound: new ig.Sound('media/sound/fertiliser.ogg'),
        deployOffset: {
            x: 30,
            y: 10
        },
        autoRefill: true,
        refillSpeed: 1,
    });
});

