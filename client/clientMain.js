


Template.hello.created = function(){


 

  Session.set("loginError",  "");
  $('#outer').removeClass('popular');
  $('#outer').removeClass('unpopular');
  $('#outer').removeClass('neutral');
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

      if(uName == "kimonsatan"){
        Session.set("isAdmin", true);
      }else{
        Meteor.loginWithPassword(uName, "1234", function(error){

          if(error){
            $('#idInput').addClass('has-error');

            Session.set("loginError", "Whoops I think you typed this wrong.");
            console.log(error.reason);
          }else{

            Meteor.users.update(Meteor.user()._id, {$set: {'profile.status': 'pending'}});
          }

        });
      }
    }

    event.preventDefault();

  }

});

Template.hello.loginError = function(){ return Session.get("loginError"); }

/*---------------------------------------------------------------------------------------*/

Template.scoreBar.score = function(){ return Meteor.user().profile.score; }
Template.scoreBar.popularity = function(){ 

  var ps = Meteor.user().profile.popularity;
  

  switch(ps){
    case 0:
    if($('#outer').hasClass('popular'))$('#outer').removeClass('popular');
    if($('#outer').hasClass('neutral'))$('#outer').removeClass('neutral');
    if($('#outer').hasClass('unpopular') == false)$('#outer').addClass('unpopular');
    return "unpopular";
    break;
    case 1:
    if($('#outer').hasClass('unpopular'))$('#outer').removeClass('unpopular');
    if($('#outer').hasClass('popular'))$('#outer').removeClass('popular');
    if($('#outer').hasClass('neutral') == false)$('#outer').addClass('neutral');
    return "neutral";
    break;
    case 2:
    if($('#outer').hasClass('unpopular'))$('#outer').removeClass('unpopular');
    if($('#outer').hasClass('neutral'))$('#outer').removeClass('neutral');
    if($('#outer').hasClass('popular') == false)$('#outer').addClass('popular');
    return "popular";
    break;

  }


}

/*----------------------------------------------------------------------------------------*/


Template.likenope.created = function(){setNextTarget();}
Template.likenope.target = function(){ return Session.get("target"); }




Template.likenope.events({
  'click button#like':function(){

    setNextTarget();
    Meteor.call("reconcileScores", Meteor.user(), Session.get("target"), "like");
    event.preventDefault();
  },

  'click button#nope':function(){

    setNextTarget();
    Meteor.call("reconcileScores", Meteor.user(), Session.get("target"), "nope");
    event.preventDefault();
  }

})


/*----------------------------------------------------------------------------------------*/

/*---------------------------------------HELPER FUNCTIONS---------------------------------*/

//navigation

UI.registerHelper("isAdmin", function(){ return Session.get("isAdmin")});
UI.registerHelper("preScreen", function(){ return (Meteor.user().profile.view == 0) });
UI.registerHelper("likenope", function(){return (Meteor.user().profile.view == 1) });
UI.registerHelper("notify", function(){return (Meteor.user().profile.view == 2) });


//others
function setNextTarget(){
  var u = Meteor.users.find({username: {$ne: Meteor.user().username}}).fetch(); //needs players not all users
  var i = Math.round(Math.random() * (u.length-1));
  Session.set("target", u[i]);
}



