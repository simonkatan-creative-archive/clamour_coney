////////// Shared code (client and server) //////////

uNames = ["Catchy254", "Funky28", "Smiley20", "Crafty21", "21Hugs"]; //NB globals work differently in meteor


Meteor.users.deny({
	
	insert: function(user){return true;},
	remove: function(user){return true;}	

});








