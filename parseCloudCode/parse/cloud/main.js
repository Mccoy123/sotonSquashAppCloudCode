
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
console.log("hello5");
response.success("Doms Cloud Code");
});

Parse.Cloud.beforeSave("MatchScore", function(request, response) {
	//Insert code to update the leaderboards on ranking.
	//difficult bit will be getting both players ranking
  /*if (request.object.get("P10Score") > 3) {
	response.error("Games are first to 3");
    //return response.error(JSON.stringify({code: ErrorCodes["450"], message: "Games are first to 3"}));
  } else {
    response.success();
  }*/
});

//AddResult Function


//My Profile functions
//User opt in of leaderboard
   Parse.Cloud.define("joinLeaderboard", function(request, response) {
		//set the leaderboard flag to true
	    var currentUser = Parse.User.current();
	    currentUser.set("Leaderboard", true); //sets the leaderboard flag to true indicating they are in the leaderboard
	    currentUser.save();
		
		//Add user to the leaderboard
	    var AddLeaderboard = Parse.Object.extend("LeaderBoard");		
		var query = new Parse.Query(AddLeaderboard);
		query.notEqualTo("Ranking", 0); //returns all objects in leaderboard intentionally left as 0 as could be used for ghosting players
		query.count().then(function(count) {
				//success
				console.log(count);
				return count; //so can be accessed in next promise
		}).then (function(count) {
			var currentUser = Parse.User.current();
			var addLeaderboard = new AddLeaderboard();
			var newPlayerRanking = count + 1; //so new player is bottom of leaderboard
			addLeaderboard.save({Ranking: newPlayerRanking, playerID: currentUser}, {
			   success: function(object) {
					console.log("User added to the leaderboard!!");
					response.success("Learderboard Joined!!") //this is sent back to client
				  },
				  error: function(model, error) {
					console.error("Error User could not be added to the leaderboard");
				  }
			  });
		}, function(error) {
			//error
			console.log("User could not be added to the leaderboard");
			response.error("User could not be added to the leaderboard"); //sent back to client if an eror occurs
		});
	});
//User opt in of leaderboard
		
//User opt out of leaderboard
   Parse.Cloud.define("leaveLeaderboard", function(request, response) {
		//set the leaderboard flag to true
	    var currentUser = Parse.User.current();
	    currentUser.set("Leaderboard", false); //sets the leaderboard flag to false indicating they are not in the leaderboard
	    currentUser.save();
		
		//remove user to the leaderboard
	    var Leaderboard = Parse.Object.extend("LeaderBoard");		
		var query = new Parse.Query(Leaderboard);
		query.equalTo("playerID", currentUser); //returns all objects in leaderboard intentionally left as not 0 as could be used for ghosting players
		query.find().then(function(currentPlayerRank) {
			//success
			console.log(currentPlayerRank[0].get("Ranking"));
			var playerRank = currentPlayerRank[0].get("Ranking");
			var lessPlayerRank = new Parse.Query(Leaderboard);
			lessPlayerRank.greaterThan("Ranking", playerRank);
			return lessPlayerRank.find(); 
		}).then(function (lessPlayerRank) {
			for (var i = 0; i < lessPlayerRank.length; i++) {
				var rank = lessPlayerRank[i].get("Ranking");
				var updateRank = lessPlayerRank[i].set("Ranking", rank - 1);
				console.log(rank - 1);
				lessPlayerRank[i].save();
			}
			console.log("for loop ok");
		}).then (function () {
			var removePlayer = new Parse.Query(Leaderboard);
			removePlayer.equalTo("playerID", currentUser); //returns all objects in leaderboard intentionally left as not 0 as could be used for ghosting players
			return removePlayer.find()
		}).then(function(removePlayer) {
			//response.success(currentPlayerRank[0].id); //this is sent back to client
			removePlayer[0].destroy({
				success: function(removePlayer) {
				  // The object was deleted from the Parse Cloud.
				  console.log("The user was deleted from the leaderboard");
				  response.success("You have been removed from the leaderboard") //this is sent back to client
				},
				error: function(removePlayer, error) {
				  // The delete failed.
				  console.error("Error: the user was not deleted from the leaderboard");
				}
			});
		}, function(error) {
			//error
			response.error("Error: you have not been deleted from the leaderboard");
		});
	});
//end of User opt out of leaderboard
			
		

