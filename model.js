////////// Shared code (client and server) //////////

uNames = ["Catchy254", "Funky28", "Smiley20", "Crafty21", "21Hugs"]; //NB globals work differently in meteor


Meteor.users.deny({
	
	insert: function(user){return true;},
	remove: function(user){return true;}	

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


function getStatus(popularity){

	var pstr;
	switch(popularity){
		case 0: pstr = "unpopular"; break;
		case 1: pstr = "neutral"; break;
		case 2: pstr = "popular"; break;
	}

	return pstr;
}





