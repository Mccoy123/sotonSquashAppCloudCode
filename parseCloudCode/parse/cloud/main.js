
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
	   currentUser.set("Leaderboard", true);
	   currentUser.save();
	   var AddLeaderboard = Parse.Object.extend("LeaderBoard");	
	   
	    var AddLeaderboard = Parse.Object.extend("LeaderBoard");	
		var query = new Parse.Query(AddLeaderboard);
		query.notEqualTo("Ranking", 0);
		query.count().then(function(count) {
				//success
				console.log(count);
				return count;
			}).then (function(count) {
				var currentUser = Parse.User.current();
				var addLeaderboard = new AddLeaderboard();
				var newPlayerRanking = count + 1;
				addLeaderboard.save({Ranking: newPlayerRanking, playerID: currentUser}, {
				   success: function(object) {
						console.log("User added to the leaderboard55");
						response.success("Learderboard Joined!!")
					  },
					  error: function(model, error) {
						console.error("Error User could not be added to the leaderboard");
					  }
				  });
			}, function(error) {
				//error
				console.log("error5");
				response.error("error5");
			});
	});

