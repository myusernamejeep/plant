// lib/game/facebook.js
ig.baked = true;
ig.module('game.facebook').requires('impact.game').defines(function () {
    Facebook = ig.Class.extend({
        scope: 'publish_stream,email',
        init: function () {},
        auth: function () {
            var t = this;
            FB.login(function (response) {
                if (response.authResponse) {
                    ig.game.fbid = response.authResponse.userID;
                    t.getEmail();
                    ig.game.screenManager.launchGame(true);
                } else {
                    ig.game.screenManager.switchScreen('title');
                }
            }, {
                scope: this.scope
            });
            return false;
        },
        invite: function () {
            FB.ui({
                method: 'apprequests',
                message: 'If you thought looking after plants was easy, think again! This fast-paced game of skill will challenge your reactions and give even the greenest of fingers a tough workout!',
            });
        },
        getEmail: function () {
            FB.api('/' + ig.game.fbid, function (response) {
                ig.game.fbEmail = response.email
            });
        },
        post: function () {
            var imageURL = document.location.protocol + '//social.tamba.co.uk/koubachi/game/images/fb-post.jpg';
            FB.ui({
                method: 'feed',
                name: 'Koubachi Game',
                link: 'http://apps.facebook.com/koubachigame',
                picture: imageURL,
                caption: '{*actor*} has scored ' + State.score + ' points on the Koubachi game!',
                description: 'Click the link (or the picture!) to try and beat their score and maybe you could win a voucher!'
            }, function (response) {});
            return false;
        }
    });
});
