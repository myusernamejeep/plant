// lib/game/entities/plants/calathea.js
ig.baked = true;
ig.module('game.entities.plants.calathea').requires('game.entities.bases.baseplant').defines(function () {
    EntityCalathea = EntityBaseplant.extend({
        className: 'EntityCalathea',
        plantName: ['Calathea', 'Zebrina'],
        size: {
            x: 186,
            y: 160
        },
        offset: {
            x: 88,
            y: 125
        },
        animSheet: new ig.AnimationSheet('media/plants/calathea.png', 186, 160),
        desires: {
            water: .5,
            mist: .2,
            heat: .6,
            light: .4,
            fertiliser: .5
        },
    });
});
