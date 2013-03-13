// lib/game/entities/plants/zamioculcas.js
ig.baked = true;
ig.module('game.entities.plants.zamioculcas').requires('game.entities.bases.baseplant').defines(function () {
    EntityZamioculcas = EntityBaseplant.extend({
        className: 'EntityZamioculcas',
        plantName: ['Zamioculcas', 'Zamiifolia'],
        size: {
            x: 167,
            y: 139
        },
        offset: {
            x: 80,
            y: 100
        },
        animSheet: new ig.AnimationSheet('media/plants/zamioculcas.png', 167, 139),
        desires: {
            water: .5,
            mist: 1,
            heat: .4,
            light: .8,
            fertiliser: .5
        },
    });
});