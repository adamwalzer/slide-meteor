Template.optionPanel.events({
    'click .facebook-login': function(e) {
        e.stopPropagation();
        ga('send', 'facebook-login');
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
        });
    },
    'click .facebook-logout': function(e) {
        e.stopPropagation();
        ga('send', 'facebook-logout');
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        });
    }
});