

Template.hello.created = function(){
  Session.set("loginError",  "");
}

Template.hello.events({

  'focus #idInput input':function(){

    Session.set("loginError", "");
    if($('#idInput').hasClass("has-error")){
      $('#idInput').removeClass("has-error");
    }

    $('#idInput input').val("");

  },

  'click button#login': function () {

    var uName = $('#idInput input').val();

    if(uName.length > 0){
        Meteor.loginWithPassword(uName, "1234", function(error){

            if(error){
              $('#idInput').addClass('has-error');
              
              Session.set("loginError", "Whoops I think you typed this wrong.");
              console.log(error.reason);
            }

        });
    }

    event.preventDefault();

  }

});

Template.hello.loginError = function(){ return Session.get("loginError"); }


