
// lib/game/entities/tools/spray.js
ig.baked = true;
ig.module('game.entities.tools.spray').requires('game.entities.bases.basetool').defines(function () {
    EntitySpray = EntityBasetool.extend({
        name: 'spray',
        benefit: 'mist',
        animSheet: new ig.AnimationSheet('media/tools/spray.png', 150, 150),
        deploySound: new ig.Sound('media/sound/spray.ogg'),
        deployOffset: {
            x: 10,
            y: 10
        },
        refillOffset: {
            x: -4,
            y: 0
        }
    });
});