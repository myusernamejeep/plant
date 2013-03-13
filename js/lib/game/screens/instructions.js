// lib/game/screens/instructions.js
ig.baked = true;
ig.module('game.screens.instructions').requires('game.screens.basescreen').defines(function () {
    Instructions = BaseScreen.extend({
        id: 'instruct',
        index: 0,
        maxIndex: 4,
        init: function () {
            this.content = '' + '<ul class="instruct-nav">' + '<li><a href="#" class="button prev" onclick="' + this.func('onPrevClicked', null, false) + '"></a></li>' + '<li><a href="#" class="button next" onclick="' + this.func('onNextClicked', null, false) + '"></a></li>' + '</ul>' + '<ul id="instruct-holder">' + '<li id="instruct-0">Screen 1</li>' + '<li id="instruct-1">Screen 2</li>' + '<li id="instruct-2">Screen 3</li>' + '<li id="instruct-3">Screen 4</li>' + '<li id="instruct-4">Screen 5</li>' + '</ul><div id="instruct-page">1/' + (this.maxIndex + 1) + '</div>' + '<ul class="screen-footer">' + '<li><a href="#" class="button play-small left" onclick="' + this.func('onPlayClicked', null, false) + '"></a></li>' + '</ul>';
            this.parent();
            $('#instruct-holder li').css('display', 'none');
            $('#instruct-0').css('display', 'block');
        },
        showScreen: function () {
            var currentID = 'instruct-' + this.index;
            var fadeDuration = 250;
            $('#instruct-holder li').each(function () {
                var id = $(this).attr('id');
                if (id == currentID) {
                    $(this).fadeIn(fadeDuration);
                } else {
                    $(this).fadeOut(fadeDuration);
                }
            });
            $('#instruct-page').text((this.index + 1) + '/' + (this.maxIndex + 1))
        },
        onPrevClicked: function () {
            this.index--;
            if (this.index < 0) this.index = this.maxIndex;
            this.showScreen();
        },
        onNextClicked: function () {
            this.index++;
            if (this.index > this.maxIndex) this.index = 0;
            this.showScreen();
        }
    });
});