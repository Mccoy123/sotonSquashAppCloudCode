
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
console.log("hello5");
response.success("Doms Cloud Code");
});

//test function
Parse.Cloud.beforeSave("MatchScore", function(request, response) {
  if (request.object.get("P10Score") > 3) {
	response.error("Games are first to 3");
    //return response.error(JSON.stringify({code: ErrorCodes["450"], message: "Games are first to 3"}));
  } else {
    response.success();
  }
});

//User opt in/out of leaderboard
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
						console.log("User added to the leaderboard55");
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

