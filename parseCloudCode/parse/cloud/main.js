
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
console.log("hello5");
response.success("Doms Cloud Code");
});

//test function
/*Parse.Cloud.beforeSave("MatchScore", function(request, response) {
  if (request.object.get("P10Score") > 3) {
	response.error("Games are first to 3");
    //return response.error(JSON.stringify({code: ErrorCodes["450"], message: "Games are first to 3"}));
  } else {
    response.success();
  }
});*/

//test function
/*Parse.Cloud.beforeSave("MatchScore", function(request, response) {
	var player2ID = request.object.get("Player2ID");
	query.get(player2ID, {
		success: function(player2ID) {
			request.object.set("Player2ID", player2ID);
			response.success();
		},
		error: function(error) {
			response.error("Error: Opponent Object could not be retrieved");
		}
	});
});*/

//AddResult Function
//Update the leaderboards rankings when a new match is logged.
Parse.Cloud.beforeSave("MatchScore", function(request, response) {
	
	//get player IDs
	var player1ID = request.object.get("Player1ID"); //get player 1 ID
	var player2ID = request.object.get("Player2ID"); //get player 1 ID
	
	var p1score = request.object.get("P1Score"); //get player 1 Score
	var p2score = request.object.get("P2Score"); //get player 1 Score
	console.log("Player 1 Score: " + p1score);
	console.log("Player 2 Score: " + p2score);
	//calculate victor
	if (p1score > p2score){
		var victor = player1ID;
		var loser = player2ID;
	} else {
		var victor = player2ID;
		var loser = player1ID;
	}
	console.log("Victor: " + JSON.stringify(victor)); //calculate victor
	console.log("Loser: " + JSON.stringify(loser)); //calculate victor
	
	//set Ranks
	var VictorRank = 0; 
	var LoserRank = 0;
	
	//get rankings based on ID
	var Leaderboard1 = Parse.Object.extend("LeaderBoard");
	var queryVictorRank = new Parse.Query(Leaderboard1);
	queryVictorRank.equalTo("playerID", victor); //get victor rank
	
	var Leaderboard2 = Parse.Object.extend("LeaderBoard");
	var queryLoserRank = new Parse.Query(Leaderboard2);
	queryLoserRank.equalTo("playerID", loser); //get loser rank
	
	queryVictorRank.find().then(function(victorRankObj) {
		victorRanking = victorRankObj;
		victorRank = victorRanking[0].get("Ranking"); //sets victor rank
		console.log("Victor Rank: " + victorRank); //Success message
	}, function(error) {
		console.error("Error: Victor Rank could not be fetched"); //error message
		response.error("Result not recorded");
	}).then(function(query2) {
		return queryLoserRank.find();
	}).then(function(loserRankObj) {
		loserRanking = loserRankObj;
		loserRank = loserRanking[0].get("Ranking"); // sets loser rank
		console.log("Loser Rank: " + loserRank); //Success message
	}, function(error) {
		console.error("Error: Loser Rank could not be fetched"); //error message
		response.error("Result not recorded");
	}).then(function(updateLeaderboard) {
		if (victorRank < loserRank) {
			console.log("Leaderboard Not required to be updated");
			response.success();
		}
		else {
			console.log("Leaderboard to be updated");
			var newRank = loserRank;
			var Leaderboard3 = Parse.Object.extend("LeaderBoard");
			var queryUpdateLeaderboard = new Parse.Query(Leaderboard3);
			queryUpdateLeaderboard.greaterThanOrEqualTo("Ranking", loserRank);
			queryUpdateLeaderboard.lessThan("Ranking", victorRank);
			queryUpdateLeaderboard.find().then(function(results) {
				for (var i = 0; i < results.length; i++) {
					var oldRank = results[i].get("Ranking");
					var updateRank = results[i].set("Ranking", oldRank + 1);
					console.log(JSON.stringify(results[i].get("playerID")) + " Rank updated from " + oldRank + " to " + (oldRank + 1));
					results[i].save();
				}
				victorRanking[0].set("Ranking", newRank);
				victorRanking[0].save();
				console.log("The Victor is now Rank" + newRank);
			}, 	function(error){
				response.error("Result could not be recorded");
			}).then (function() {
			console.log("Result added and leaderboard updated");
			response.success();
			});
		}
	});
});

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
			var playerRank = currentPlayerRank[0].get("Ranking"); //The users Rank
			var lessPlayerRank = new Parse.Query(Leaderboard); 
			lessPlayerRank.greaterThan("Ranking", playerRank);
			return lessPlayerRank.find();  //returns all users with rank less than the user
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
			
		

