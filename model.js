////////// Shared code (client and server) //////////

uNames = [
"angry11",
"bunny13",
"canny17",
"ditzy19",
"emoty23",
"flaky29",
"grimy31",
"honey37",
"irony41",
"jazzy43",
"kooky47",
"loopy53",
"mucky59",
"nerdy61",
"oddly67",
"pesky71",
"quaky73",
"rusty79",
"shiny83",
"teeny89"

]; //NB globals work differently in meteor


scoreIncr = 5;

Meteor.users.deny({
	
	insert: function(user){return true;},
	remove: function(user){return true;}	

});


Notifications = new Meteor.Collection("notifications");
GameData = new Meteor.Collection("gameData");

//NB
//functions need to be declared as anonymous globals in meteor to be available universally

getPopularity = function(score){

	if(score < 33.3){
		return 0;
	}else if(score < 66.6){
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

	return Meteor.users.find({'profile.role':'player'}, {sort: { "profile.status": -1}}).fetch();

}



