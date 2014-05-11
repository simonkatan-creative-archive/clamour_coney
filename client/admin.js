Template.adminLogin.events({

  'focus #idInput input':function(){

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
            $('#idInput').addClass('has-error');

            Session.set("loginError", error.reason);
            console.log(error.reason);
          }

        });
    
    }

    event.preventDefault();

  }

});


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

Template.admin.players = function(){return Meteor.users.find({username: {$ne: "kimonsatan"}}).fetch();}