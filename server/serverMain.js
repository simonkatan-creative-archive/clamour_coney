Meteor.startup(function () {

	// code to run on server at startup
	console.log("starting up ... ");
	//create an admin if none exists

	if(Meteor.users.find({}).fetch().length  == 0){
		console.log("creating admin ...");
		Accounts.createUser({username: "kimonsatan", 
							password: "eggfliedlice",
							profile: {role: 'admin'}}
							);

		console.log("creating players ...");
		Meteor.call("resetGame");
	}



});

Meteor.publish('allPlayers', function(user){

	return Meteor.users.find({}); //return everyone except the admin

});

Meteor.publish('notifications', function(){

	return Notifications.find({}); 

});



Meteor.methods({

	resetGame: function(){

		Notifications.remove({});
		Meteor.users.remove({username: {$ne: "kimonsatan"}}); //remove everyone except the admin

		for(var i =0; i < uNames.length; i++){
			Accounts.createUser({username: uNames[i], 
							password: "1234", 
							profile: {view: 0, score: 50, popularity: 1 , likes: 0, nopes: 0, status: "inactive", role: 'player'}
						});
		}
	},

	startGame: function(){

		Meteor.users.update({'profile.role' : 'player', 
							'profile.status' : 'pending'}, 
							{$set: {'profile.view': 1, 'profile.status': 'neutral'}}, {multi: true});
	
	},

	increasePopularity: function(user){

		var ns = user.profile.score + 2;
		var popularity = getPopularity(ns);
		var pstr = getStatus(popularity);

		Meteor.users.update({username: user.username}, {$set: {'profile.score': ns}});
		Meteor.users.update({username: user.username}, {$set: {'profile.popularity': popularity, 'profile.status': pstr}});

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
		
		if(action == "like"){

			if(ap == tp){
				//if like someone of same status
				a_outcome = 1;  //you both get more pop
				t_outcome = 1;
			}else if(ap < tp){
				//like someone of a higher status
				a_outcome = 1; //you get more pop
				t_outcome = 0; //they stay the same
			}else if(ap > tp){
				//like someone of a lower status
				a_outcome = -1; //you get less pop
				t_outcome = 1; //they get more pop
			}

		}else if(action == "nope"){

			if(ap == tp){
				//nope someone of the same status
				a_outcome = 0;  //you stay the same
				t_outcome = -1; //they get less pop
				
			}else if(ap < tp){
				//nope someone of higher status
				a_outcome = -1; //you get less popular
				t_outcome = 0; //they stay the same
			}else if(ap > tp){
				//nope someone of a lower status
				a_outcome = 0; //you stay the same
				t_outcome = -1; //they get less popular
			}

		}

		var a_ns = actor.profile.score + a_outcome * 2;
		var t_incr = t_outcome * 2;
		var a_pop = getPopularity(a_ns);

		if(t_outcome != 0){
			var n = actor.username + " just " + action + "d you and " + ((t_outcome > 0) ? "increased" : "decreased" ) +  " your popularity.";
			Notifications.insert({username: target.username, actor: actor.username, message: n, incr: t_incr});
		}

		Meteor.users.update({username: actor.username}, {$set: {'profile.score': a_ns}});
		Meteor.users.update({username: actor.username}, {$set: {'profile.popularity': a_pop, 'profile.status': getStatus(a_pop)}});


	},

	applyNotification: function(notification){

		var t_ns = Meteor.users.findOne({username: notification.username}).profile.score + notification.incr;
		var t_pop = getPopularity(t_ns);

		Meteor.users.update({username: notification.username}, {$set: {'profile.score': t_ns}});
		Meteor.users.update({username: notification.username}, {$set: {'profile.popularity': t_pop, 'profile.status': getStatus(t_pop)}});
		Notifications.remove(notification._id);
	}



	
});
