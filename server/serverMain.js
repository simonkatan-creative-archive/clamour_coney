Meteor.startup(function () {
// code to run on server at startup

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

		var ns = user.profile.score + 2;
		var popularity;
		
		

		Meteor.users.update({username: user.username}, {$set: {'profile.score': ns}});
		Meteor.users.update({username: user.username}, {$set: {'profile.popularity': getPopularity(ns)}});

	},

	decreasePopularity: function(user){

		var ns = user.profile.score - 2;
		var popularity;
		
		

		Meteor.users.update({username: user.username}, {$set: {'profile.score': ns}});
		Meteor.users.update({username: user.username}, {$set: {'profile.popularity': getPopularity(ns)}});

	},

	reconcileScores: function(actor, target, action){

		//implement scores here
		var ap = actor.profile.popularity;
		var tp = target.profile.popularity;

		var a_outcome, t_outcome;

		//TODO these will need checking
		
		if(action == "like"){

			if(ap == tp){
				a_outcome = 1;
				t_outcome = 1;
			}else if(ap < tp){
				a_outcome = 1;
				t_outcome = 0;
			}else if(ap > tp){
				a_outcome = -1;
				t_outcome = 1;
			}

		}else if(action == "nope"){

			if(ap == tp){
				a_outcome = 0;
				t_outcome = -1;
			}else if(ap < tp){
				a_outcome = -1;
				t_outcome = 0;
			}else if(ap > tp){
				a_outcome = 0;
				t_outcome = -1;
			}

		}

		var a_ns = actor.profile.score + a_outcome * 2;
		var t_ns = target.profile.score + t_outcome * 2;

		Meteor.users.update({username: actor.username}, {$set: {'profile.score': a_ns}});
		Meteor.users.update({username: actor.username}, {$set: {'profile.popularity': getPopularity(a_ns)}});

		Meteor.users.update({username: target.username}, {$set: {'profile.score': t_ns}});
		Meteor.users.update({username: target.username}, {$set: {'profile.popularity': getPopularity(t_ns)}});

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