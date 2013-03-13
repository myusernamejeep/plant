
// lib/game/entities/plants/euphorbia.js
ig.baked = true;
ig.module('game.entities.plants.euphorbia').requires('game.entities.bases.baseplant').defines(function () {
    EntityEuphorbia = EntityBaseplant.extend({
        className: 'EntityEuphorbia',
        plantName: ['Euphorbia', 'Pulcherrima'],
        size: {
            x: 144,
            y: 121
        },
        offset: {
            x: 69,
            y: 85
        },
        animSheet: new ig.AnimationSheet('media/plants/euphorbia.png', 144, 121),
        desires: {
            water: .5,
            mist: .6,
            heat: .4,
            light: 1,
            fertiliser: .8
        },
    });
});
