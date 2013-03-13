(function() {
  var EMPTY_FN, MAP_H, MAP_W, MESSAGE_SPACE, TILE_H, TILE_W, bindHashListener, destroyMessage, displayMessage, generateLevels, generateProtagonist, generateWorld, hashLoad, main, unbindHashListener;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  TILE_W = window.TILE_W = 16;
  TILE_H = window.TILE_H = 16;
  MAP_W = window.MAP_W = 41;
  MAP_H = window.MAP_H = 21;
  MESSAGE_SPACE = 60;
  EMPTY_FN = function() {
    return null;
  };
  Crafty.sprite(TILE_W, TILE_H, "images/sprites.png", {
    empty: [0, 0],
    wall: [1, 0],
    river: [2, 0],
    pink: [3, 0],
    orange: [4, 0],
    player: [0, 1],
    key: [0, 2],
    door: [1, 2],
    message: [0, 3]
  });
  Crafty.c("SliderMovementControls", {
    __move: {
      left: false,
      right: false,
      up: false,
      down: false
    },
    StopSlide: function() {
      var move;
      move = this.__move;
      return move.right = move.left = move.up = move.down = false;
    },
    SliderMovementControls: function(speed) {
      var move;
      if (speed == null) {
        speed = 4;
      }
      move = this.__move;
      this.bind('EnterFrame', function() {
        if (move.right || move.left || move.up || move.down) {
          this.trigger('Move');
        }
        if (move.right) {
          return this.attr({
            x: this.x + speed
          });
        } else if (move.left) {
          return this.attr({
            x: this.x - speed
          });
        } else if (move.up) {
          return this.attr({
            y: this.y - speed
          });
        } else if (move.down) {
          return this.attr({
            y: this.y + speed
          });
        }
      });
      this.collision();
      this.onHit("Solid", function() {
        if (move.right) {
          this.attr({
            x: this.x - speed
          });
        } else if (move.left) {
          this.attr({
            x: this.x + speed
          });
        } else if (move.up) {
          this.attr({
            y: this.y + speed
          });
        } else if (move.down) {
          this.attr({
            y: this.y - speed
          });
        }
        this.StopSlide();
        return this.trigger('EndMove');
      });
      this.onHit("exit", function() {
        move = this.__move;
        return this.StopSlide;
      });
      return this.BindKeyControls();
    },
    BindKeyControls: function() {
      var move;
      move = this.__move;
      return this.bind('KeyDown', function(e) {
        if (!(move.right || move.left || move.up || move.down)) {
          if (e.keyCode === Crafty.keys.RIGHT_ARROW || e.keyCode === Crafty.keys.D) {
            move.right = true;
          } else if (e.keyCode === Crafty.keys.LEFT_ARROW || e.keyCode === Crafty.keys.A) {
            move.left = true;
          } else if (e.keyCode === Crafty.keys.UP_ARROW || e.keyCode === Crafty.keys.W) {
            move.up = true;
          } else if (e.keyCode === Crafty.keys.DOWN_ARROW || e.keyCode === Crafty.keys.S) {
            move.down = true;
          }
          if (move.right || move.left || move.up || move.down) {
            return this.trigger('StartMove');
          }
        }
      });
    }
  });
  Crafty.c("Message", {
    text: '',
    set_message: function(message) {
      return this.text = message;
    },
    get_message: function() {
      return this.text;
    }
  });
  Crafty.scene("loading", function() {
    var loading_text, script;
    loading_text = Crafty.e("2D, DOM, Text");
    loading_text.attr({
      w: TILE_W * MAP_W,
      h: 20,
      x: 0,
      y: (TILE_H * MAP_H) / 2 - 10
    });
    loading_text.text("Loading...");
    loading_text.css({
      "text-align": "center",
      "color": "#FFF"
    });
    script = document.createElement('script');
    script.src = 'js/levels.js';
    document.body.appendChild(script);
    return script.onload = function() {
      return Crafty.load(["images/sprites.png"], function() {
        var hash;
        generateLevels();
        hash = window.location.hash.substring(1);
        if (hash) {
          Crafty.scene("level" + hash);
        } else {
          Crafty.scene("level0");
        }
		
		

		
        return bindHashListener();
      });
    };
  });
  Crafty.scene("victory", function() {
    var victory_text;
    victory_text = Crafty.e("2D, DOM, Text");
    victory_text.attr({
      w: TILE_W * MAP_W,
      h: 20,
      x: 0,
      y: (TILE_H * MAP_H) / 2 - 10
    });
    victory_text.text("To be continued...");
    return victory_text.css({
      "text-align": "center",
      "color": "#FFF"
    });
  });

  generateLevels = function() {
    var i, level, _fn, _i, _len, _results;
    i = 0;
    _fn = function(level, i) {
		
      return Crafty.scene("level" + i, function() {
        var m, message, player, restart_level_listener, text, text_entity, _j, _k, _len2, _len3, _ref, _ref2;
        unbindHashListener();
        window.location.hash = "" + i;
        setTimeout(bindHashListener, 0);
        generateWorld(level.map);
        if (level.texts) {
          _ref = level.texts;
          for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
            text = _ref[_j];
            text_entity = Crafty.e("2D, DOM, Text");
            text_entity.css({
              "text-align": "center",
              "color": "#FFF"
            });
            text_entity.attr(text.attrs);
            text_entity.text(text.text.replace('\n', '<br />'));
          }
        }
        if (level.messages) {
          _ref2 = level.messages;
          for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
            message = _ref2[_k];
            m = Crafty.e("2D, DOM, Message, message");
            m.attr(message.attrs);
            m.set_message(message.text);
          }
        }
        player = generateProtagonist(level.player_coords.x, level.player_coords.y);
        restart_level_listener = function(e) {
          if (e.keyCode === Crafty.keys.R) {
            this.unbind('KeyUp', this.restart_event);
            player.StopSlide();
            return Crafty.scene("level" + i);
          }
        };
        this.restart_event = this.bind('KeyUp', restart_level_listener);
        player.onHit("exit", EMPTY_FN, __bind(function() {
          this.unbind('KeyUp', this.restart_event);
          player.StopSlide();
          if (levels[i + 1]) {
            Crafty.scene("level" + (i + 1));
          } else {
            Crafty.scene("victory");
          }
          return this;
        }, this));
        player.onHit("river", function() {
          player.StopSlide();
          Crafty.scene("level" + i);
          return this;
        });
        player.onHit("key", function() {
          Crafty("door").destroy();
          Crafty("key").destroy();
          return this;
        });
        return player.onHit("Message", function(collisions) {
          return displayMessage(collisions[0].obj.text);
        }, function() {
          return destroyMessage();
        });
      });
    };
    _results = [];
    for (_i = 0, _len = levels.length; _i < _len; _i++) {
      level = levels[_i];
      _fn(level, i);
      _results.push(i++);
    }
    return _results;
  };
  generateWorld = function(matrix) {
    var cell, coords, row, tile, x_, y_, _i, _j, _len, _len2, _ref, _ref2, _results;
    x_ = 0;
    y_ = 0;
    _ref = matrix.split("\n");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      _ref2 = row.split("");
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        cell = _ref2[_j];
        coords = {
          'x': x_ * TILE_W,
          'y': y_ * TILE_H
        };
        switch (cell) {
          case "0":
            tile = {
              attr: function(coords) {}
            };
            break;
          case "1":
            tile = Crafty.e("2D, DOM, wall, Solid");
            break;
          case "2":
            tile = Crafty.e("2D, DOM, empty, exit");
            break;
          case "3":
            tile = Crafty.e("2D, DOM, key");
            break;
          case "4":
            tile = Crafty.e("2D, DOM, door, Solid");
            break;
          case "5":
            tile = Crafty.e("2D, DOM, river");
            break;
          default:
            tile = Crafty.e("2D, DOM, pink");
        }
        tile.attr(coords);
        x_++;
      }
      x_ = 0;
      _results.push(y_++);
    }
    return _results;
  };
  generateProtagonist = function(x, y) {
    var coords, player;
    coords = {
      x: x * TILE_W,
      y: y * TILE_H,
      z: 1
    };
    player = Crafty.e("2D, DOM, player, controls, Collision, SliderMovementControls, Tween, SpriteAnimation");
    player.attr(coords);
    player.animate("fadeOut", 0, 1, 5);
    player.animate("fadeIn", 5, 1, 10);
    player.bind("StartMove", function() {
      if (!this.isPlaying("fadeOut")) {
        return player.animate("fadeOut", 2, 0);
      }
    });
    player.bind("EndMove", function() {
      player.stop();
      return player.animate("fadeIn", 2, 0);
    });
    return player.SliderMovementControls();
  };
  displayMessage = function(message) {
    var height, text_entity, width, y_;
    if (Crafty("MessageText").length === 0) {
      height = MESSAGE_SPACE;
      width = TILE_W * MAP_W;
      y_ = TILE_H * MAP_H + 2;
      text_entity = Crafty.e("2D, DOM, Text, MessageText, Tween");
      text_entity.attr({
        x: 0,
        y: y_,
        w: width,
        h: height,
        alpha: 0.0
      });
      text_entity.css({
        "text-align": "center",
        "color": "#FFF",
        "font-family": "Just Me Again Down Here, cursive",
        "font-size": "20px",
        "line-height": "25px"
      });
      text_entity.text(message.replace('\n', '<br />'));
      return text_entity.tween({
        alpha: 1.0
      }, 20);
    }
  };
  destroyMessage = function() {
    var message;
    message = Crafty(Crafty("MessageText")[0]);
    message.tween({
      alpha: 0.0
    }, 20);
    return message.bind("TweenEnd", function() {
      return message.destroy();
    });
  };
  hashLoad = function() {
    var hash;
    hash = window.location.hash.substring(1);
    return Crafty.scene("level" + hash);
  };
  unbindHashListener = function() {
    return Crafty.removeEvent(this, window, "hashchange", hashLoad);
  };
  bindHashListener = function() {
    return Crafty.addEvent(this, window, "hashchange", hashLoad);
  };
  main = function() {
    Crafty.init(TILE_W * MAP_W, TILE_H * MAP_H + MESSAGE_SPACE);
    return Crafty.scene("loading");
  };
  window.onload = main;
}).call(this);
