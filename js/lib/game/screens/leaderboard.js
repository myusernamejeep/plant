// lib/game/screens/leaderboard.js
ig.baked = true;
ig.module('game.screens.leaderboard').requires('game.screens.basescreen').defines(function () {
    Leaderboard = BaseScreen.extend({
        id: 'scores',
        init: function () {
            this.content = '<div id="scores-loading"></div>' + '<div id="scrollbar"><div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div>' + '<div class="viewport"><div id="scores" class="overview"></div>' + '</div></div>' + '<ul class="screen-footer">' + '<li><a href="#" class="button play-small left" onclick="' + this.func('onPlayClicked', null, false) + '"></a></li>' + '</ul>';
            this.parent();
            this.getHighScores();
        },
        getHighScores: function () {
            this.post('getscores', {
                facebook: _facebook
            }, 'onScoresRetrieved');
        },
        onScoresRetrieved: function () {
            $('#scores-loading').css('display', 'none');
            var holder = $('#scores');
            var data = this.postResponse;
            if (data.length > 100) return;
            var j = data.length;
            for (var i = 0; i < j; i++) {
                var row = '<div class="row"><div class="name noselect">' + data[i].username + '</div> <div class="score noselect">' + data[i].points + '</div></div>'
                holder.append(row);
            }
            $('#scrollbar').tinyscrollbar({
                sizethumb: 49
            });
        }
    });
});
