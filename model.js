////////// Shared code (client and server) //////////

uNames = ["Catchy254", "Funky28", "Smiley20", "Crafty21", "21Hugs"]; //NB globals work differently in meteor


Meteor.users.deny({
	
	insert: function(user){return true;},
	remove: function(user){return true;}	

});


Notifications = new Meteor.Collection("notifications");
GameData = new Meteor.Collection("gameData");

//NB
//functions need to be declared as anonymous globals in meteor to be available universally

getPopularity = function(score){

	if(score < 25){
		return 0;
	}else if(score < 75){
		return 1;
	}else{
		return 2;
	}

}


getStatus = function(popularity){

	var pstr;
	switch(popularity){
		case 0: pstr = "unpopular"; break;
		case 1: pstr = "neutral"; break;
		case 2: pstr = "popular"; break;
	}

	return pstr;
}

getPlayers = function(){

	return Meteor.users.find({'profile.role':'player'}).fetch();

}



