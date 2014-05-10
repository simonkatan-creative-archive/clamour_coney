

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


Template.likenope.target = function(){ return uNames[0]; }
Template.scoreBar.score = function(){ return Meteor.user().profile.score; }
Template.scoreBar.popularity = function(){ 

  var ps = Meteor.user().profile.popularity;


  switch(ps){
    case 0:
      return "unpopular";
    break;
    case 1:
      return "neutral";
    break;
    case 2:
      return "popular";
    break;

  }


}

