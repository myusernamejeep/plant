// lib/game/screens/basescreen.js
ig.baked = true;
ig.module('game.screens.basescreen').requires('impact.game', 'game.facebook').defines(function () {
    BaseScreen = ig.Class.extend({
        id: 'base',
        content: '',
        holder: null,
        holderID: 'screens',
        classVar: 'screen',
        gamePostURL: 'http://game.koubachi.com/post.php',
        fbPostURL: '//social.tamba.co.uk/koubachi/game/post.php',
        postURL: '',
        postResponse: {},
        mediaPath: 'media/ui',
        player: null,
        bookmarkURL: 'http://www.tamba-games.co.uk/bookmarks.php',
        bookmarkClient: 'koubachi',
        init: function () {
            if (_facebook) this.postURL = this.fbPostURL;
            else this.postURL = this.gamePostURL;
            this.holder = $('#' + this.holderID);
            var html = '<div id="screen-' + this.id + '" class="screen">' + this.content + '</div>';
            this.holder.empty();
            this.holder.append(html);
        },
        switchScreen: function (screenID) {
            return 'ig.game.screenManager.switchScreen(\'' + screenID + '\'); return false;';
        },
        onPlayClicked: function () {
            if (_facebook == 1) {
                if (ig.game.fbid == '') {
                    ig.game.facebook.auth();
                    return false;
                } else {
                    ig.game.screenManager.launchGame();
                }
            } else {
                ig.game.screenManager.launchGame();
            }
        },
        playVideo: function () {
			this.onVideoComplete();
			return false;
            ig.game.screenManager.switchScreen('video');
            $('#video').html('<a href="#" onclick="' + this.func('onVideoComplete', null, false) + '" id="skip-intro">Skip video</a><video src="video/intro.mp4" width="960" height="640"></video>');
            var t = this;
            ig.game.introPlaying = true;
            $('audio,video').mediaelementplayer({
                success: function (player, node) {
                    setTimeout(function (thisO) {
                        thisO.eventClickTrigger()
                    }, 1000, t);
                    t.setVideoPlayer(player);
                    if (ig.music.volume <= 0) {
                        player.setVolume(0);
                    }
                    player.addEventListener('ended', function (e) {
                        t.onVideoComplete();
                    });
                }
            });
            return false;
        },
        eventClickTrigger: function () {
            $('.mejs-overlay-button').trigger('click');
        },
        setVideoPlayer: function (player) {
            this.player = player;
        },
        stopVideo: function () {
            $('#video').empty();
            ig.game.introPlaying = false;
        },
        onVideoComplete: function () {
            this.stopVideo();
            ig.game.screenManager.switchScreen('game');
        },
        showMessage: function (message) {
            var mHolder = $('#message');
            if (mHolder.length <= 0) {
                mHolder = this.holder.append('<div id="message"><div class="inner"></div></div>');
                mHolder = $('#message');
                mInner = $('#message .inner');
                mHolder.css('display', 'none');
                mHolder.fadeIn();
            }
            mInner.html(message);
        },
        post: function (task, params, callbackName) {
            this.postResponse = {};
            var t = this;
            params['task'] = task;
            $.post(this.postURL, params, function (response) {
                if (callbackName) {
                    t.postResponse = response;
                    eval('t.' + callbackName + '()');
                }
            });
        },
        func: function (method, arguments, useParent) {
            var func = 'ig.game.screenManager.';
            if (!useParent) func += this.classVar + '.';
            func += method + '(';
            if (arguments) {
                var j = arguments.length - 1;
                for (var i = 0; i <= j; i++) {
                    func += "'" + arguments[i] + "'";
                    if (i < j) func += ',';
                }
            }
            func += '); return false;';
            return func;
        },
        zeroFill: function (number, width) {
            width -= number.toString().length;
            if (width > 0) {
                return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
            }
            return number + "";
        },
        validateString: function (input) {
            return input.length >= 1;
        },
        validateEmail: function (email) {
            var regexp = eval("new RegExp(/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,4})+$/)");
            return regexp.test(email);
        },
        validateInt: function (n) {
            return n > 0;
        },
        zeroFill: function (number, width) {
            width -= number.toString().length;
            if (width > 0) {
                return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
            }
            return number + "";
        },
        update: function () {},
        gotoSocial: function (networkID) {
            ig.game.screenManager.track(networkID);
            if (_facebook == 1 && networkID == 'facebook') {
                ig.game.facebook.invite();
                return false;
            }
            var url = this.bookmarkURL + '?client=' + this.bookmarkClient + '&bookmark=' + networkID;
            window.open(url, '_blank');
            return true;
        },
    });
});
