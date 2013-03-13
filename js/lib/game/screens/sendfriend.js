// lib/game/screens/sendfriend.js
ig.baked = true;
ig.module('game.screens.sendfriend').requires('game.screens.basescreen').defines(function () {
    SendFriend = BaseScreen.extend({
        id: 'sendfriend',
        maxFriends: 3,
        canSubmit: true,
        init: function () {
            var html = '<div class="content">' + '<div class="formrow" id="you"><input type="text" class="input left" id="yourname" maxlength="30" value="" />' + '<input type="text" class="input right" id="youremail" maxlength="100" value="" /></div><div class="friends">' + '<ul class="screen-footer">' + '<li><a href="#" class="button friendsubmit left" onclick="' + this.func('submitSendFriend', null, false) + '"></a></li>' + '<li><a href="#" class="button friendback left" onclick="' + this.switchScreen('endgame') + '"></a></li>' + '</ul>';
            for (var i = 1; i <= this.maxFriends; i++) {
                html += '<div class="formrow" id="friend-' + i + '"><input type="text" class="input left" id="friendname_' + i + '" value="" maxlength="30" /><input type="text" class="input right" id="friendemail_' + i + '" value="" maxlength="100" /></div>';
            }
            html += '</div></div>';
            this.content = html;
            this.parent();
        },
        submitSendFriend: function () {
            if (!this.canSubmit) return false;
            this.resetErrors();
            var senderName = jQuery.trim($('#yourname').val());
            var senderEmail = jQuery.trim($('#youremail').val());
            if (!this.validateString(senderName)) {
                $('#you').addClass('active');
            } else if (!this.validateEmail(senderEmail)) {
                $('#you').addClass('active');
            } else if (this.validateFriends()) {
                this.sendToFriends();
            }
            return false;
        },
        validateFriends: function () {
            var totalFriends = 0;
            for (var i = 1; i <= this.maxFriends; i++) {
                var name = jQuery.trim($('#friendname_' + i).val());
                var email = jQuery.trim($('#friendemail_' + i).val());
                if (name || email) {
                    if (!this.validateString(name)) {
                        $('#friend-' + i).addClass('active');
                        return false;
                    } else if (!this.validateEmail(email)) {
                        $('#friend-' + i).addClass('active');
                        return false;
                    }
                    totalFriends++;
                }
            }
            if (totalFriends <= 0) {
                for (var i = 1; i <= this.maxFriends; i++) {
                    $('#friend-' + i).addClass('active')
                }
                return false;
            }
            return true;
        },
        sendToFriends: function () {
            this.showMessage('Please wait...');
            var senderName = jQuery.trim($('#yourname').val());
            var senderEmail = jQuery.trim($('#youremail').val());
            this.canSubmit = false;
            for (var i = 1; i <= this.maxFriends; i++) {
                var recipientName = jQuery.trim($('#friendname_' + i).val());
                var recipientEmail = jQuery.trim($('#friendemail_' + i).val());
                var params = {
                    sender_name: senderName,
                    sender_email: senderEmail,
                    recipient_name: recipientName,
                    recipient_email: recipientEmail
                };
                this.post('sendfriend', params);
            }
            this.onSendComplete();
        },
        onSendComplete: function () {
            this.canSubmit = true;
            this.showMessage('Emails sent! Send more?');
            this.resetForm();
        },
        resetForm: function () {
            for (var i = 1; i <= this.maxFriends; i++) {
                $('#friendname_' + i).val('');
                $('#friendemail_' + i).val('');
            }
            this.resetErrors();
        },
        resetErrors: function () {
            $('#you').removeClass('active');
            for (var i = 1; i <= this.maxFriends; i++) {
                $('#friend-' + i).removeClass('active')
            }
        }
    });
});
