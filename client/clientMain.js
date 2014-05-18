
var preIndex = 0;
var preSwitcher;

Deps.autorun(function (){
  Meteor.subscribe('allPlayers');
  Meteor.subscribe('notifications');

  if(! Meteor.user()){
    Session.set("isAdmin", false);
  }else{
    if(Meteor.user().profile.role == 'admin'){
        Session.set("isAdmin", true);
        console.log("admin");
    }else{
      Session.set("isAdmin", false);
    }
  }
});

Template.hello.created = function(){


  Session.set("loginError",  "");
  Session.set("currentNotification", "");
  Session.set("preMessage", "");
 
  $('#outer').removeClass('popular');
  $('#outer').removeClass('unpopular');
  $('#outer').removeClass('neutral');
  $('#outer').removeClass('daytimeReward');
  $('#outer').removeClass('daytime');

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

      uName = uName.toLowerCase();

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

Template.preScreen.created = function(){

  preIndex = 0;
  Session.set("preMessage", "Welcome !");
  window.scrollTo(0,0);

  preSwitcher = window.setInterval(function(){

    preIndex = (preIndex + 1)%5;

    switch(preIndex){
      case 0: Session.set("preMessage", "Welcome !"); break;
      case 1: Session.set("preMessage", "We're almost ready to play Clamour"); break;
      case 2: Session.set("preMessage", "A game of good friends"); break;
      case 3: Session.set("preMessage", "Remember to keep your user name secret"); break;
      case 4: Session.set("preMessage", "It's on the card in your pocket"); break;
    }
    

  

  }, 4000);
  

}

Template.preScreen.destroyed = function(){

  window.clearInterval(preSwitcher);

}

Template.preScreen.message = function(){return Session.get('preMessage'); }

Template.hello.loginError = function(){ return Session.get("loginError"); }

/*---------------------------------------------------------------------------------------*/

Template.scoreBar.created = function(){

  $('#outer').removeClass('daytime');
$('#outer').removeClass('daytimeReward');
}
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
  'click #likenope button':function(event){

    var action = event.target.id;

    Meteor.users.update(Meteor.user()._id, {$set: {'profile.view': 2}});
    Meteor.call("reconcileScores", Meteor.user(), Session.get("target"), action);


    setTimeout(getNotifications,2000);

    event.preventDefault();
  },



})


/*----------------------------------------------------------------------------------------*/

Template.notify.events({

  'click button#ok':function(){

    $('#notify').slideUp(1000, function(){

     getNotifications();

   });
    event.preventDefault();
  }

});

Template.notify.notification = function(){

  return Session.get("currentNotification");

}

/*---------------------------------------------------------------------------------------*/

Template.wait.popular = function(){return (Meteor.user().profile.popularity == 2)};
Template.wait.unpopular = function(){return (Meteor.user().profile.popularity == 0)};
Template.wait.neutral = function(){return Meteor.user().profile.popularity == 1};

/*----------------------------------------------------------------------------------------*/

Template.daytime.created = function(){

  $('#outer').removeClass('unpopular');
  $('#outer').removeClass('popular');
  $('#outer').removeClass('neutral');
  $('#outer').removeClass('daytimeReward');
  $('#outer').addClass('daytime');

  
}

/*----------------------------------------------------------------------------------------*/

Template.dayNotify.created = function(){

  $('#outer').removeClass('unpopular');
  $('#outer').removeClass('popular');
  $('#outer').removeClass('neutral');
  $('#outer').removeClass('daytime');
  $('#outer').addClass('daytimeReward');

  
}


Template.dayNotify.events({

  'click button#ok':function(){

    $('#notify').slideUp(2000, function(){

      Meteor.users.update(Meteor.user()._id, {$set: {'profile.view': 4}});
      Meteor.call('clearReward', Meteor.user());

   });
    event.preventDefault();
  }

});

Template.dayNotify.notification = function(){
  return Notifications.findOne({username: Meteor.user().username});
}


/*----------------------------------------------------------------------------------------*/

Template.gameOver.created = function(){


  $('#outer').removeClass('unpopular');
  $('#outer').removeClass('popular');
  $('#outer').removeClass('neutral');
  $('#outer').removeClass('daytimeReward');
  $('#outer').addClass('daytime');

}


/*---------------------------------------HELPER FUNCTIONS---------------------------------*/

//navigation

UI.registerHelper("isAdmin", function(){ return Session.get("isAdmin")});
UI.registerHelper("preScreen", function(){ return (Meteor.user().profile.view == 0) });
UI.registerHelper("likenope", function(){return (Meteor.user().profile.view == 1) });
UI.registerHelper("wait", function(){return (Meteor.user().profile.view == 2) });
UI.registerHelper("notify", function(){return (Meteor.user().profile.view == 3) });
UI.registerHelper("daytime", function(){return (Meteor.user().profile.view == 4) });
UI.registerHelper("dayNotify", function(){return (Meteor.user().profile.view == 5) });
UI.registerHelper("gameOver", function(){return (Meteor.user().profile.view == 6) });

//others
function setNextTarget(){


  var u = Meteor.users.find({'profile.role' : 'player',
    'profile.status' : {$ne: 'inactive'},
    username: {$ne: Meteor.user().username}
                            }).fetch(); //needs players not all users


  //now filter out any players who already have notifications from the user
  var uf = [];

  for(var i = 0; i < u.length; i++){
   if(Notifications.find({username: u[i].username, actor: Meteor.user().username}).fetch().length == 0){
    uf.push(u[i]);
  }
}

var i = Math.round(Math.random() * (uf.length-1));
if(uf.length > 0){
  Session.set("target", uf[i]);
  return true;
}else{
    //set a time out to try again
    console.log("no available players");
    return false;

  }
}

function getNotifications(){

  var n = Notifications.find({username: Meteor.user().username}).fetch();

  if(n.length == 0){

    var proceed = false;

    Meteor.users.update(Meteor.user()._id, {$set: {'profile.view': 2}});   
    
    var gt = setInterval(function(){

      if(setNextTarget() == true){
        console.log("clearInterval")
        clearInterval(gt);
        Meteor.users.update(Meteor.user()._id, {$set: {'profile.view': 1}});   
        Session.set("currentNotification", "");   
      }else{
        console.log("fail");
      }

    },500);
    

  }else{

    Session.set("currentNotification", Notifications.findOne({username: Meteor.user().username}));
    

    if(Meteor.user().profile.view != 3){
      Meteor.users.update(Meteor.user()._id, {$set: {'profile.view': 3}}, function(){

        setTimeout(function() {

          $('#notify').slideDown(1000, function(){Meteor.call("applyNotification", Session.get("currentNotification"))});

        }, 50); //a little time to create the elements
        

      });
    }else{

        $('#notify').slideDown(1000, function(){Meteor.call("applyNotification", Session.get("currentNotification"))});

    }

    
  }
}



