
// lib/game/entities/plants/citrus.js
ig.baked = true;
ig.module('game.entities.plants.citrus').requires('game.entities.bases.baseplant').defines(function () {
    EntityCitrus = EntityBaseplant.extend({
        className: 'EntityCitrus',
        plantName: ['Citrus', 'x Limon'],
        size: {
            x: 138,
            y: 127
        },
        offset: {
            x: 70,
            y: 95
        },
        iconPos: {
            x: 13,
            y: 50
        },
        animSheet: new ig.AnimationSheet('media/plants/citrus.png', 138, 127),
        desires: {
            water: 0.25,
            mist: .4,
            heat: .5,
            light: 1,
            fertiliser: .8
        },
    });
});