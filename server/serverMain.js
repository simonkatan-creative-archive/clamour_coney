Meteor.startup(function () {
// code to run on server at startup

});

Meteor.publish('players', function(user){ 

	return Meteor.users.find({});	
	
});


Meteor.methods({

	resetGame: function(){

		
		Meteor.users.remove({});


		for(var i =0; i < uNames.length; i++){
		Accounts.createUser({username: uNames[i], 
							password: "1234", 
							profile: {score: 50, popularity: 1 ,likes: 0, nopes: 0}
						});
		}
	},

	increasePopularity: function(user){

		var ns = user.profile.score + 5;
		var popularity;
		
		

		Meteor.users.update({username: user.username}, {$set: {'profile.score': ns}});
		Meteor.users.update({username: user.username}, {$set: {'profile.popularity': getPopularity(ns)}});

	}

	
});

function getPopularity(score){

	if(score < 25){
		return 0;
	}else if(score < 75){
		return 1;
	}else{
		return 2;
	}

}