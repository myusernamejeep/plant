// lib/plugins/empika/game_utilities.js
ig.baked = true;
ig.module('plugins.empika.game_utilities').requires('impact.game').defines(function () {
    ig.Game.inject({
        entitiesUnderMouse: function () {
            var mouse_x = ig.input.mouse.x
            var mouse_y = ig.input.mouse.y;
            mouse_x *= ig.game.coordScale;
            mouse_y *= ig.game.coordScale;
            var entities = this.entities;
            var under_mouse = [];
            for (var x = 0; x < entities.length; x = x + 1) {
                var entity = entities[x];
                var pos_x = entity.pos.x - entity.offset.x;
                var pos_y = entity.pos.y - entity.offset.y;
                if (pos_x <= mouse_x && mouse_x <= pos_x + entity.size.x && pos_y <= mouse_y && mouse_y <= pos_y + entity.size.y) {
                    if (!entity.ignoreMouse) {
                        under_mouse.push(entity);
                    }
                }
            }
            return under_mouse;
        }
    });
});
