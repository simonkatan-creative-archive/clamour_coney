Deps.autorun(function (){
  Meteor.subscribe('gameData');
});

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


Template.admin.isDaytime = function(){ if(GameData.findOne({item: 'dayNight' }).value  == 'daytime')return "checked"; }
Template.admin.isNighttime = function(){ if(GameData.findOne({item: 'dayNight' }).value  == 'nighttime')return "checked"; }
Template.admin.increments = function(){return [1,2,3,4,5,6,7,8,9,10];}

Template.admin.isIncr = function(){ 
  if(this == GameData.findOne({item: 'scoreIncr'}).value) return "selected"; 
}


Template.admin.events({

  'click button#start' : function(){

    Meteor.call('startGame');
    event.preventDefault();
  },

  'click button#end' : function(){

    var r = window.confirm("are you sure you want to do this ?");

    if(r){
      Meteor.call('endGame');
    }else{
      console.log("aborted");
    }
 
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
  },

  'click button#apply' : function(){

    var el = $('.reward input[type=checkbox]:checked').get();
    var t_users = [];

    for(var i = 0; i < el.length; i++){
      console.log(el[i].id);
      t_users.push(Meteor.users.findOne({username: el[i].id}));
    }

    $('.reward input[type=checkbox]').attr('checked', false);    

    Meteor.call('applyReward', t_users, $('select#amount').val());


    event.preventDefault();
  },

  'click .dayNight input#dayTime' : function(){

    Meteor.call('startDay');
    console.log("day");

  },

  'click .dayNight input#nightTime' : function(){

    Meteor.call('startNight');
    console.log("night");

  },

  'change #incr':function(){

    Meteor.call('changeIncr', $('select#incr').val());
    event.preventDefault();
  }


});

Template.admin.players = function(){return getPlayers();}
Template.admin.numNotifications = function(){
  return Notifications.find({username: this.username}).fetch().length;
}
