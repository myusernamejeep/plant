// lib/game/main.js
ig.baked = true;
ig.module('game.main').requires('impact.game', 'impact.font', 'impact.sound', 'plugins.empika.game_utilities', 'plugins.preloader', 'game.facebook', 'game.grid', 'game.hud', 'game.screenmanager', 'game.screens.footer', 'game.screens.social', 'game.screens.sound', 'game.levels.main', 'game.utils.assetloader', 'game.entities.message', 'game.entities.icons.icon', 'game.entities.icons.bubble', 'game.entities.plants.zamioculcas', 'game.entities.plants.citrus', 'game.entities.plants.dionaea', 'game.entities.plants.dracaena', 'game.entities.plants.calathea', 'game.entities.plants.euphorbia', 'game.entities.monitor.statusmonitor').defines(function () {
    Koubachi = ig.Game.extend({
        coordScale: 1,
        mode: 'ui',
        nextScreen: 'title',
        skipIntro: false,
        introPlaying: false,
        fbid: '',
        fbEmail: '',
        gameWin: false,
        music: new ig.Music('media/sound/music_game.ogg'),
        levelUpSound: new ig.Sound('media/sound/levelup.ogg'),
        light: new ig.Image('media/playfield/playfield-light.png'),
        plants: ['Dracaena', 'Zamioculcas', 'Euphorbia', 'Citrus', 'Calathea', 'Dionaea'],
        gameActive: false,
        toolMouseDown: false,
        itemCarried: false,
        totalPlants: 0,
        grid: null,
        hud: null,
        statusMonitor: null,
        selectedTool: null,
        screenManager: null,
        social: null,
        footer: null,
        sound: null,
        facebook: new Facebook(),
        message: null,
        messageCallback: null,
        levelProgression: [25, 65, 125, 215, 325],
        levelProgressionIndex: 0,
        init: function () {
            if (_facebook == 1) {
                this.coordScale = 1.25;
            }
            if (isMobile) {
                this.skipIntro = true;
            }console.log('initSocial');
            ig.input.initMouse();
            ig.input.bind(ig.KEY.MOUSE1, 'lbtn');
            ig.music.add('media/sound/music_game.ogg');
            this.levelProgressionIndex = 0;
            this.initSocial();
            this.initFooter();
            this.initSoundManager();
            this.initScreenManager();
			
        },
        initScreenManager: function () {
            $('#screens').css('display', 'block');
            this.mode = 'ui';
            this.screenManager = new ScreenManager(this.nextScreen);
            this.toggleFooter(true);
        },
        resumeScreenManager: function () {
            $('#screens').css('display', 'block');
            this.mode = 'ui';
            this.screenManager.switchScreen(this.nextScreen);
            this.toggleFooter(true);
        },
        resetState: function () {
            State = {
                score: 0,
                level: 0,
                lives: 3
            };
        },
        initGame: function () {
            this.totalPlants = 0;
            this.levelProgressionIndex = 0;
            this.mode = 'game';
            this.resetState();
            this.grid = new Grid();
            this.hud = new HUD();
            this.statusMonitor = new StatusMonitor();
            this.loadLevel(LevelMain);
            this.increaseLevel();
            this.success = false;
            this.complete = false;
            this.toggleFooter(false);
            $('#screens').css({
                'display': 'none'
            });
            this.showMessage('getready', this.startGame)
            this.gameWin = false;
        },
        startGame: function () {
            this.hud.toggleTimer(true);
            this.gameActive = true;
            ig.music.play();
        },
        endGame: function (success) {
            if (this.gameActive) {
                this.gameActive = false;
                this.hud.toggleTimer(false);
                this.success = success;
                this.showMessage('gameover', this.gameOver);
            }
            return true;
        },
        gameOver: function () {
            this.nextScreen = 'submitscore';
            this.statusMonitor.hide();
            this.resumeScreenManager();
            ig.music.stop();
        },
        increaseLevel: function (animated) {
            var plant = this.spawnPlant('Entity' + this.plants[State.level]);
            State.level++;
            plant.setDifficulty(State.level);
        },
        spawnPlant: function (type) {
            var gridCoord = this.grid.getRandomFreeCoord();
            var fadeSettings = {
                span: 1,
                fadeValue: 'stop',
                name: 'name',
            }
            var plant = this.spawnEntity(eval(type), 0, 0, fadeSettings);
            plant.addToGrid(gridCoord.x, gridCoord.y);
            return plant;
        },
        showMessage: function (id, callback) {
            if (!this.message) {
                this.message = new EntityMessage(100, 100, {
                    id: id
                });
            }
            this.message.showMessage(id);
            this.messageCallback = callback;
            this.statusMonitor.hide()
        },
        checkToolClicks: function () {
            var mouseX = ig.input.mouse.x;
            var mouseY = ig.input.mouse.y;
            mouseX *= ig.game.coordScale;
            mouseY *= ig.game.coordScale;
            var boxLeftX = 510;
            if (!ig.input.state('lbtn')) this.toolMouseDown = false;
            if (ig.input.state('lbtn') && this.isMouseOverTools() && !this.toolMouseDown && !this.itemCarried) {
                this.toolMouseDown = true;
                var toolName = '';
                var localMouseX = mouseX - boxLeftX;
                if (localMouseX < 68) {
                    toolName = 'tap';
                } else if (localMouseX < 162) {
                    toolName = 'fertiliser';
                } else if (localMouseX < 227) {
                    toolName = 'spray';
                } else {
                    toolName = 'wateringcan';
                }
                var tool = ig.game.getEntityByName(toolName);
                if (tool) {
                    if (toolName == 'tap') {
                        tool.refillTool(this.selectedTool);
                    } else {
                        tool.toggleActive();
                    }
                }
            }
        },
        isMouseOverTools: function () {
            var boxLeftX = 510;
            var mouseX = ig.input.mouse.x;
            var mouseY = ig.input.mouse.y;
            mouseX *= ig.game.coordScale;
            mouseY *= ig.game.coordScale;
            return mouseY < 140 && mouseX > boxLeftX && mouseX < 850;
        },
        launchStatusMonitor: function (plant) {
            if (!this.statusMonitor.active) {
                this.statusMonitor.setPlant(plant);
            }
        },
        initFooter: function () {
            this.footer = new Footer();
        },
        initSocial: function () {
            this.social = new Social();
        },
        initSoundManager: function () {
            this.sound = new SoundManager();
        },
        toggleFooter: function (active) {
            if (!this.footer) return false;
            if (!active) {
                this.footer.hide();
            } else {
                this.footer.show();
            }
        },
        toggleSocial: function (active) {
            if (!this.social) return false;
            if (!active) {
                this.social.hide();
            } else {
                this.social.show();
            }
        },
        toggleSoundmanager: function (active) {
            if (!this.sound) return false;
            if (!active) {
                this.sound.hide();
            } else {
                this.sound.show();
            }
        },
        checkLevelProgression: function () {
            if (this.levelProgressionIndex < this.levelProgression.length) {
                var nextMilestone = this.levelProgression[this.levelProgressionIndex];
                var currentProgress = this.hud.timerSeconds;
                if (currentProgress >= nextMilestone) {
                    this.levelProgressionIndex++;
                    this.showMessage('levelup', this.increaseLevel);
                    return;
                }
            }
        },
        update: function () {
            if (this.screenManager) this.screenManager.update();
            if (State.lives <= 0) {
                if (this.gameActive) {
                    this.endGame(false)
                    this.gameActive = false;
                }
            }
            if (this.gameActive) {
                if (this.statusMonitor.active && ig.input.state('lbtn')) {
                    if (this.statusMonitor.hideable) {
                        this.statusMonitor.hide();
                    }
                }
                if (this.hud) this.hud.update();
                if (this.statusMonitor.active) this.statusMonitor.update();
                this.checkToolClicks();
                this.checkLevelProgression();
            }
            if (this.message) {
                this.message.update(0);
                if (this.message.complete) {
                    if (this.messageCallback) this.messageCallback()
                    this.message.complete = false;
                }
            }
            this.parent();
        },
        updateScore: function () {
            var baseScore = 5;
            var j = this.entities.length;
            for (var i = 0; i < j; i++) {
                var entity = this.entities[i];
                if (entity.isPlant) {
                    var award = Math.floor(baseScore * entity.vitality);
                    State.score += award;
                }
            }
        },
        draw: function () {
            if (this.introPlaying) return;
            this.parent();
            if (this.mode == 'ui') {
                this.screenManager.draw();
            } else {
                if (this.light) this.light.draw(0, 0);
                if (this.hud) this.hud.draw(0, 0);
                if (this.message) this.message.draw(0, 0);
                if (this.gameActive) {
                    if (this.statusMonitor.active) {
                        this.statusMonitor.draw(0, 0);
                    }
                }
            }
        }
    });
    if (ig.ua.mobile || BrowserDetect.browser == "Explorer") {
        ig.Sound.enabled = false;
    }
    if (ig.ua.iPhone || ig.ua.iPhone4 || ig.ua.android) {
        isMobile = true;
    }
    ig.Sound.use = [ig.Sound.FORMAT.M4A, ig.Sound.FORMAT.OGG, ig.Sound.FORMAT.MP3];
    ig.main('#canvas', Koubachi, 60, 960, 640, 1, ig.Preloader);
});