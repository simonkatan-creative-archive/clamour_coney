////////// Shared code (client and server) //////////

var uNames = ["Catchy254", "Funky28", "Smiley20", "Crafty21", "21Hugs"];

var players = new Meteor.Collection("players");

Meteor.users.deny({
	
	insert: function(user){return true;},
	remove: function(user){return true;}	

});








