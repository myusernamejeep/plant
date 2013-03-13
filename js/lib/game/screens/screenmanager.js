// lib/game/screenmanager.js
ig.baked = true;
ig.module('game.screenmanager').requires('impact.game', 'game.screens.titlescreen', 'game.screens.instructions', 'game.screens.leaderboard', 'game.screens.submitscore', 'game.screens.sendfriend', 'game.screens.endgame', 'game.screens.terms', 'game.screens.intro', 'game.screens.game').defines(function () {
    ScreenManager = ig.Class.extend({
        idTable: {
            'title': 'TitleScreen',
            'instruct': 'Instructions',
            'leaderboard': 'Leaderboard',
            'sendfriend': 'SendFriend',
            'submitscore': 'SubmitScore',
            'game': 'GameScreen',
            'terms': 'Terms',
            'video': 'Intro',
            'endgame': 'EndGame'
        },
        showSocialOn: ['instruct', 'leaderboard', 'sendfriend'],
        showSoundOn: ['title', 'game'],
        screen: null,
        screenID: '',
        screenCount: 0,
        transitionsLocked: false,
        backdrop: new ig.Image('media/ui/bg.jpg'),
        init: function (screenID) {
            this.clearColor = null;
            this.switchScreen(screenID);
        },
        switchScreen: function (screenID) {
            if (screenID == this.screenID) return false;
            if (_facebook == 1) {
                if (screenID == 'sendfriend') {
                    ig.game.facebook.invite();
                    return false;
                }
            }
            if (!this.transitionsLocked) {
                this.screenID = screenID;
                if (this.screen) {
                    this.removeScreen();
                } else {
                    this.addScreen();
                }
            }
            return true;
        },
        addScreen: function () {
            var p = this;
            if (this.idTable[this.screenID]) {
                for (var i = 0; i < this.showSocialOn.length; i++) {
                    if (this.showSocialOn[i] != this.screenID) {
                        ig.game.toggleSocial(false);
                    } else {
                        ig.game.toggleSocial(true);
                        break;
                    }
                }
                this.screen = eval('new ' + this.idTable[this.screenID] + '()');
                if (this.screenCount > 0) {
                    this.track(this.idTable[this.screenID]);
                    $('#' + this.screen.holderID).animate({
                        width: '960px'
                    }, {
                        duration: 250,
                        complete: function () {
                            p.transitionsLocked = false;
                        }
                    });
                }
                this.screenCount++;
            }
        },
        removeScreen: function () {
            if (this.screenID == 'game') {
                this.startGame();
            }
            this.transitionsLocked = true;
            var p = this;
            $('#' + this.screen.holderID).animate({
                width: '0px'
            }, {
                duration: 250,
                complete: function () {
                    p.addScreen();
                }
            });
        },
        initGame: function () {
            ig.game.initGame();
        },
        startGame: function () {
            ig.game.initGame();
        },
        launchGame: function () {
            if (ig.game.skipIntro) {
                this.switchScreen('game');
            } else {
                this.switchScreen('video');
                this.screen.playVideo();
                ig.game.skipIntro = true;
            }
        },
        track: function (id) {
            if (_gaq) {
                _gaq.push(['_trackEvent', 'game', 'userAction', id]);
            }
        },
        update: function () {
            if (this.screen) {
                this.screen.update();
            }
        },
        draw: function () {
            this.backdrop.draw(0, 0)
        }
    });
});