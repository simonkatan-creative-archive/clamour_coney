Meteor.startup(function () {
// code to run on server at startup

});

  Meteor.publish('players', function(user){ 

	return Meteor.users.find({});	
	
});


Meteor.methods({

	resetAccounts: function(){

		
		Meteor.users.remove({});


		for(var i =0; i < uNames.length; i++){
		Accounts.createUser({username: uNames[i], 
							password: "1234", 
							profile: {score: 0, likes: 0, nopes: 0}
						});
	}

	}

});