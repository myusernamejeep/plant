
// lib/game/entities/plants/dracaena.js
ig.baked = true;
ig.module('game.entities.plants.dracaena').requires('game.entities.bases.baseplant').defines(function () {
    EntityDracaena = EntityBaseplant.extend({
        className: 'EntityDracaena',
        plantName: ['Dracaena', 'Fragrans'],
        size: {
            x: 138,
            y: 166
        },
        offset: {
            x: 70,
            y: 130
        },
        animSheet: new ig.AnimationSheet('media/plants/dracaena.png', 138, 166),
        desires: {
            water: .5,
            mist: .6,
            heat: .9,
            light: .4,
            fertiliser: .8
        },
    });
});