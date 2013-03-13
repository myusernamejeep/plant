// lib/game/screens/submitscore.js
ig.baked = true;
ig.module('game.screens.submitscore').requires('game.screens.basescreen').defines(function () {
    SubmitScore = BaseScreen.extend({
        id: 'submitscore',
        canSubmit: true,
        voucherScore: 1000,
        salt: 'kCamcRNNxZ',
        init: function () {
            var score = State.score;
            this.content = '<div id="score-title">MY SCORE: ' + score + '</div><div id="score-message"></div>' + '<div class="error" id="error-yourname"></div>' + '<div class="error" id="error-youremail"></div>' + '<ul id="score-buttons">' + '<li><a href="#" class="btn2" onclick="' + this.func('submitScore', null, false) + '"></a></li>' + '<li><a href="#" class="btn1" onclick="' + this.switchScreen('game') + '"></a></li>' + '</ul>' + '<ul id="score-social">' + '<li><a href="#" class="facebook" onclick="' + this.func('gotoSocial', ['facebook']) + '">Facebook</a></li>' + '<li><a href="#" class="twitter" onclick="' + this.func('gotoSocial', ['twitter']) + '">Twitter</a></li>' + '</ul>' + '<input type="text" class="input left" id="yourname" maxlength="30" value="" />' + '<input type="text" class="input right" id="youremail" maxlength="100" value="' + ig.game.fbEmail + '" />';
            this.parent();
            if (score >= this.voucherScore) {
                $('#score-message').addClass('active');
                $('#score-buttons .btn1').addClass('win');
                $('#score-buttons .btn2').addClass('win');
                ig.game.gameWin = true;
            } else {
                $('#score-buttons .btn1').addClass('lose');
                $('#score-buttons .btn2').addClass('lose');
                ig.game.gameWin = false;
            }
        },
        submitScore: function () {
            if (!this.canSubmit) return false;
            var name = jQuery.trim($('#yourname').val());
            var email = jQuery.trim($('#youremail').val());
            $('#error-yourname').removeClass('active');
            $('#error-youremail').removeClass('active');
            if (!this.validateString(name)) {
                $('#error-yourname').addClass('active');
            } else if (!this.validateEmail(email)) {
                $('#error-youremail').addClass('active')
            } else {
                this.postScore();
            }
            return false;
        },
        postScore: function () {
            this.canSubmit = false;
            this.showMessage('Please wait...');
            var name = jQuery.trim($('#yourname').val());
            var email = jQuery.trim($('#youremail').val());
            var hash = hex_md5('client=' + this.salt + '&username=' + name + '&email=' + email + '&score=' + State.score);
            this.post('setscore', {
                name: name,
                email: email,
                score: State.score,
                fbid: ig.game.fbid,
                hash: hash
            }, 'onScoreSubmitComplete');
        },
        onScoreSubmitComplete: function () {
            if (_facebook) {
                ig.game.facebook.post()
            }
            ig.game.screenManager.switchScreen('endgame');
        }
    });
});