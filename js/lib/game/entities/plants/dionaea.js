
// lib/game/entities/plants/dionaea.js
ig.baked = true;
ig.module('game.entities.plants.dionaea').requires('game.entities.bases.baseplant').defines(function () {
    EntityDionaea = EntityBaseplant.extend({
        className: 'EntityDionaea',
        plantName: ['Dionaea', 'Muscipula'],
        size: {
            x: 120,
            y: 110
        },
        offset: {
            x: 60,
            y: 78
        },
        iconPos: {
            x: 5,
            y: 50
        },
        animSheet: new ig.AnimationSheet('media/plants/dionaea.png', 120, 110),
        desires: {
            water: .75,
            mist: .15,
            heat: .6,
            light: .8,
            fertiliser: .2
        },
    });
});