Template.adminLogin.events({

  'focus #pwInput input':function(){

    Session.set("loginError", "");
    if($('#pwInput').hasClass("has-error")){
      $('#pwInput').removeClass("has-error");
    }

    $('#pwInput input').val("");

  },

  'click button#login': function () {

    var pw = $('#pwInput input').val();

    if(pw.length > 0){
 
        Meteor.loginWithPassword("kimonsatan", pw, function(error){

          if(error){
            $('#pwInput').addClass('has-error');

            Session.set("loginError", error.reason);
            console.log(error.reason);
          }

        });
    
    }

    event.preventDefault();

  }

});

Template.adminLogin.loginError = function(){ return Session.get("loginError"); }

/*---------------------------------------------------------------------------------------------*/

Template.admin.events({

  'click button#start' : function(){

    Meteor.call('startGame');
    event.preventDefault();
  },

  'click button#reset' : function(){

    var r = window.confirm("are you sure you want to do this ?");

    if(r){
      Meteor.call("resetGame");
    }else{
      console.log("aborted");
    }
    event.preventDefault();
  }



});

Template.admin.players = function(){return getPlayers();}
Template.admin.numNotifications = function(){
  return Notifications.find({username: this.username}).fetch().length;
}
