
// Use Parse.Cloud.define to define as many cloud functions as you want.
//delete below function
// For example:
Parse.Cloud.define("hello", function(request, response) {
console.log("hello5");
response.success("Doms Cloud Code");
});

//for twitter api
var oauth = require('cloud/oauth.js');
var sha = require('cloud/sha1.js');

//general
Parse.Cloud.define("allActiveChallengesArray", function(request, response) {
	var Challenges = Parse.Object.extend("Challenges");
	var userChallengee = new Parse.Query(Challenges);
	userChallengee.equalTo("ChallengeeID", Parse.User.current()); //only returns challenges specific to the current user part1
	//retrieve challengees where the user is the challenger	
	var userChallenger = new Parse.Query(Challenges);
	userChallenger.equalTo("ChallengerID", Parse.User.current()); //only returns challenges specific to the current user part2
	//main query
	var queryActiveChallenges = new Parse.Query(Challenges);
	queryActiveChallenges = Parse.Query.or(userChallengee, userChallenger); //returns all challenges involving current user
	queryActiveChallenges.equalTo("Active", true); //only returns active challenges
	queryActiveChallenges.include("ChallengerID"); //includes the challenger user object
	queryActiveChallenges.include("ChallengeeID"); //includes the challengee user object
	queryActiveChallenges.find({
		success: function(allActiveChallengesArray) {
			response.success(allActiveChallengesArray);
		},
		error: function() {
			console.error("Challenge information could not be retrieved");
			response.error("Challenge information could not retrieved");
		}
	});
});

//gets a specific user object based on id
Parse.Cloud.define("getUserObject", function(request, response) {
	var User = Parse.Object.extend("User");
	var queryUser = new Parse.Query(User);
	var userID = request.params.userID;
	console.log(userID);
	queryUser.get(userID, {
	  success: function(userObjResult) {
		// The object was retrieved successfully.
		userObj = userObjResult;
		console.log("test2a");
		console.log(userObj);
		response.success(userObj);
	  },
	  error: function(object, error) {
		console.error("user object could not be retrieved");
		response.error("user object could not be retrieved");
	  }
	});
});

//awards a walkover 3-0 victory to a user
Parse.Cloud.define("awardWalkover", function(request, response) {
	var MatchScore = Parse.Object.extend("MatchScore");
	var matchScore = new MatchScore(); //create a new matchScore object
	//get the victor and loser IDs
	var VictorObbID = request.params.VictorID;
	var LoserObbID = request.params.LoserID;
	//get the victor and loser objects
	Parse.Cloud.run('getUserObject', {userID: VictorObbID}, {
		success: function(VictorObject) {
			var VictorObj = VictorObject;
			Parse.Cloud.run('getUserObject', {userID: LoserObbID}, {
				success: function(LoserObject) {
					var LoserObj = LoserObject;
					// set scores
					var VictorScore = "3";
					var LoserScore = "0";
					//save the result
					matchScore.save({VictorID: VictorObj, LoserID: LoserObj, VictorScore: VictorScore, LoserScore: LoserScore}, {
						success: function(object) {
							console.log("Score Successfully Added"); //User success message
							response.success("Challenge Declined Opponent awarded 3-0 Walkover");
						},
						error: function(model, error) {
							console.error("Challenge could not be declined as a new result could not be added");
							response.error("Challenge could not be declined as a new result could not be added");
						}
					});
				},
				error: function() {
					console.error("Loser Object could not retrieved");
					response.error("Loser Object could not retrieved");
				}
			});
		},
		error: function() {
			console.error("Challenge information could not be retrieved");
			response.error("Victor Object could not retrieved");
		}
	});
});

//end of general functions

//leaderboard
Parse.Cloud.define("fetchLeaderboard", function(request, response) {
	var Leaderboard = Parse.Object.extend("LeaderBoard");
	var queryLeaderboard = new Parse.Query(Leaderboard);
	queryLeaderboard.include("playerID");
	queryLeaderboard.find({
		success: function(leaderboardArrayRaw) {
			var leaderboardArray = [];
			for(var i = 0; i < leaderboardArrayRaw.length; i++) {
				var playerRank = leaderboardArrayRaw[i].get("Ranking");
				var playerObj = leaderboardArrayRaw[i].get("playerID");; //gets user object
				var playerName = playerObj.get("displayName");
				var leaderboardArrayObj = {playerRank: playerRank, playerName: playerName};
				leaderboardArray[leaderboardArray.length] = leaderboardArrayObj;
				console.log(leaderboardArrayObj);
			}
			leaderboardArray.sort(function(obj1, obj2){
				return  obj1.playerRank - obj2.playerRank; //sort in ascending order so highest rank first
			});
			console.log(leaderboardArray);
			response.success(leaderboardArray);
		},
		error: function() {
			console.error("leaderboard not retrieved");
			response.error("Leaderboard not retrieved");
		}
	});
});
//end of leaderboard functions

//MyChallenges Functions
//decline challenges
Parse.Cloud.define("declineChallenge", function(request, response) {
	var challengeObjectID = request.params.challengeObjectID;
	var Challenge = Parse.Object.extend("Challenges");
	var queryChallenge = new Parse.Query(Challenge);
	//retrieve the challenge object
	queryChallenge.get(challengeObjectID, {
		success: function(challengeObject) {
			//set Active flag to close challenge
			challengeObject.set("Active", false);
			challengeObject.save(null, {
				success: function() {
					//record walkover result
					var VictorObj = challengeObject.get("ChallengerID"); //victor as challengee has declined the challenge
					var VictorID = VictorObj.id;
					var LoserObj = challengeObject.get("ChallengeeID"); //loser as they declined the challenge
					var LoserID = LoserObj.id;
					console.log(LoserID);
					console.log(VictorID);
					Parse.Cloud.run('awardWalkover', {VictorID: VictorID, LoserID: LoserID }, {
						success: function(walkoverResponse) {
							console.log(walkoverResponse);
							console.log("Score Successfully Added"); //User success message
							response.success("Challenge Declined Opponent awarded 3-0 Walkover");
						},
						error: function() {
							console.error("Challenge information could not be retrieved");
							response.error("Challenge information could not retrieved");
						}
					});
				},
				error: function() {
					console.error("Challenge could not be declined as as active flag could not be changed");
					response.error("Challenge could not be Accepted check internet connection");
				}
			});
		},
		error: function() {
			console.error("Challenge could not be Accepted as challenge object could not be retrieved");
			response.error("Challenge could not be Accepted check internet connection");
		}
	});
});

//New Challenges
Parse.Cloud.define("newChallenges", function(request, response) {
	var Challenges = Parse.Object.extend("Challenges");
	var queryChallenges = new Parse.Query(Challenges);
	queryChallenges.equalTo("ChallengeeID", Parse.User.current()); //only returns challenges specific to the current user
	queryChallenges.equalTo("Active", true); //only returns active challenges
	queryChallenges.equalTo("Accepted", false); //An accepted challenge is not a new challenge but an outstanding one
	queryChallenges.include("ChallengerID"); //includes the challenger user object
	queryChallenges.find({
		success: function(newChallengesArrayRaw) {
			var newChallengesArray = [];
			for(var i = 0; i < newChallengesArrayRaw.length; i++) {
				var challengeSentDate = newChallengesArrayRaw[i].createdAt;
				var challengeObbID = newChallengesArrayRaw[i].id;
				var challengerObj = newChallengesArrayRaw[i].get("ChallengerID");; //gets user object
				var challengerName = challengerObj.get("displayName"); //gets the display name of whom sent the challenge
				var challengerArrayObj = {challengeSentDate: challengeSentDate, challengerName: challengerName, challengeObbID: challengeObbID };
				newChallengesArray[newChallengesArray.length] = challengerArrayObj;
				console.log(challengerArrayObj);
			}
			newChallengesArray.sort(function(obj1, obj2){
				return obj2.challengeSentDate - obj1.challengeSentDate; //sort in ascending order so newest first
			});
			console.log(newChallengesArray);
			response.success(newChallengesArray);
		},
		error: function() {
			console.error("New Challenges not retrieved");
			response.error("New Challenged not retrieved");
		}
	});
});

//Display Open Active Challenges
Parse.Cloud.define("displayActiveChallenges", function(request, response) {
	Parse.Cloud.run('allActiveChallengesArray', {}, {
		success: function(activeChallengesArrayRaw) {
			var activeChallengesArray = [];
			for(var i = 0; i < activeChallengesArrayRaw.length; i++) {
				var challengeUpdatedDateRaw = activeChallengesArrayRaw[i].updatedAt;
				var challengeUpdatedDate = new Date(Date.parse(challengeUpdatedDateRaw)).toUTCString();
				var challengeObbID = activeChallengesArrayRaw[i].id;
				var challengeAccepted = activeChallengesArrayRaw[i].get("Accepted");
				var oppnentInfo = "";
				var acceptedStatues ="";
				var opponentName = "";
				if (activeChallengesArrayRaw[i].get("ChallengerID").id == Parse.User.current().id){
					var opponentObj = activeChallengesArrayRaw[i].get("ChallengeeID"); //gets opponents user object
					opponentName = opponentObj.get("displayName"); //gets the display name of your opponent
					var challengeDetails = opponentName + " (" + challengeUpdatedDate + ")";
					var challengeAcceptence = "Your Match Request has been been accepted by ";
					var notAcceptedMessage = " Your Match Request has not yet been accepted by ";
					var userStatus ="Opponent";
				} 
				else {
					var opponentObj = activeChallengesArrayRaw[i].get("ChallengerID"); //gets opponents user object
					opponentName = opponentObj.get("displayName"); //gets the display name of your opponent
					//var challengeDetails = opponentName + " challenged you to a match "
					var challengeDetails = opponentName + "'s match request (" + challengeUpdatedDate + ")";
					var challengeAcceptence = "You have Accepted ";
					var notAcceptedMessage = "You have not yet replied to ";
					var userStatus ="User";
				}
				
				var opponentId = opponentObj.id; //gets the id of your opponent
				if (challengeAccepted == true){
					var challengeStatusMessage = challengeAcceptence + challengeDetails;
					var challengeStatus = "challengeAccepted"; //sets the challenge status used for formatting table
					var opponentemail = opponentObj.get("email"); //gets the email of your opponent
					var oppnentInfo = "Contact them to arrange a date and book a court At: <br /> " + opponentemail;
				}
				else {
					
					var challengeStatusMessage = notAcceptedMessage + challengeDetails ;
					var challengeStatus = "awaitingResponse" + userStatus; //sets the challenge status used for formatting table
				}
				//set up array object
				//store in array
				var activeChallengesArrayObj = {challengeStatus: challengeStatus, challengeStatusMessage: challengeStatusMessage, oppnentInfo: oppnentInfo, challengeObbID: challengeObbID, challengeUpdatedDateRaw: challengeUpdatedDateRaw };
				activeChallengesArray[activeChallengesArray.length] = activeChallengesArrayObj;
				console.log(activeChallengesArrayObj);
			}
			activeChallengesArray.sort(function(obj1, obj2){
				return obj2.challengeUpdatedDateRaw - obj1.challengeUpdatedDateRaw; //sort in ascending order so newest first
			});
			console.log(activeChallengesArray);
			response.success(activeChallengesArray);
		},
		error: function() {
			console.error("Challenge information could not be retrieved");
			response.error("Challenge information could not retrieved");
		}
	});
});
//end of myChallenges functions

//challengeOpponentFunctions
Parse.Cloud.define("fetchOpponents", function(request, response) {
	var currentUserRank = 0; //set current users rank
	var Leaderboard = Parse.Object.extend("LeaderBoard");
	var queryCurrentUserRank = new Parse.Query(Leaderboard);
	queryCurrentUserRank.equalTo("playerID",Parse.User.current()); //gets current users rank
	queryCurrentUserRank.find().then(function(currentUserRankObj) {
		console.log(currentUserRankObj);
		currentUserRank = currentUserRankObj[0].get("Ranking"); //retrieves current users ranking
		console.log(currentUserRank);
	}).then(function (findOpponents) {
		var queryFindOpponents = new Parse.Query(Leaderboard); //combines the two queries to find the valid opponents
		queryFindOpponents.lessThan("Ranking",currentUserRank); //gets all user with a superior rank
		queryFindOpponents.greaterThanOrEqualTo("Ranking",currentUserRank-3); //returns all users with a rank 3 superior and below the current user
		queryFindOpponents.include("playerID");
		return queryFindOpponents.find();
	}).then(function(opponentArrayRaw) {
		Parse.Cloud.run('allActiveChallengesArray', {}, {
			success: function(allActiveChallengesArray) {
				var activeChallengeOpponentArray = [];
				for(var i = 0; i < allActiveChallengesArray.length; i++) {
					var challengeeUserObb = allActiveChallengesArray[i].get("ChallengeeID");
					var challengerUserObb = allActiveChallengesArray[i].get("ChallengerID");
					if (challengeeUserObb.id == Parse.User.current().id){
						console.log("Opponent is Challenger");
						var oppId = challengerUserObb.id; 
					}
					else {
						console.log("Opponent is Challengee");
						var oppId = challengeeUserObb.id;
					}
					var activeChallengeOpponentObj = oppId;
					activeChallengeOpponentArray[activeChallengeOpponentArray.length] = activeChallengeOpponentObj;
					console.log(activeChallengeOpponentArray[i]);
				}
				console.log(activeChallengeOpponentArray); //array of usersIds user has an open challenge against
				var opponentArray = [];
				for(var i = 0; i < opponentArrayRaw.length; i++) {
					console.log("test");
					var oppObj = opponentArrayRaw[i].get("playerID");; //Opponents user object
					console.log(oppObj);
					if (activeChallengeOpponentArray.indexOf(oppObj.id) == -1){
						console.log("test2");
						var text = oppObj.get("displayName"); //opponents displayName
						var value = oppObj.id; //Opponents user objectID
						var opponentArrayObj = {text: text, value: value};
						//need to work out validation to not add object to array if an active challenge already exists.
						opponentArray[opponentArray.length] = opponentArrayObj;
						console.log(opponentArray[i]);
					}
					else {
						console.log("User already has an open challenge against user, remove do not add to opponentArray");
					}
				}
				console.log(opponentArray);
				response.success(opponentArray);
			},
			error: function() {
				console.error("Active Challenges could not retrieved");
				response.error("Active Challenges could not retrieved");
			}
		});
	})
});
//end of challenge Opponent Functions

//AddResult Function
//fetch Opponents
Parse.Cloud.define("fetchOpponentsAddResult", function(request, response) {
	console.log("Start Fetch opponents Function");
	var Challenges = Parse.Object.extend("Challenges");
	//retrieve challengees where the user is the challengee	
	var userChallengee = new Parse.Query(Challenges);
	userChallengee.equalTo("ChallengeeID", Parse.User.current()); //only returns challenges specific to the current user part1
	//retrieve challengees where the user is the challenger	
	var userChallenger = new Parse.Query(Challenges);
	userChallenger.equalTo("ChallengerID", Parse.User.current()); //only returns challenges specific to the current user part2
	//main query
	var queryChallenges = new Parse.Query(Challenges);
	queryChallenges = Parse.Query.or(userChallengee, userChallenger); //returns all challenges involving current user
	queryChallenges.equalTo("Active", true); //only returns active challenges
	queryChallenges.equalTo("Accepted", true); //only returns accepted challenges
	queryChallenges.include("ChallengerID"); //includes the challenger user object
	queryChallenges.include("ChallengeeID"); //includes the challengee user object
	queryChallenges.find({
		success: function(openChallengesArrayRaw) {
			console.log("QueryChallenges Successfully completed");
			console.log("Query Challenges Returns: " + openChallengesArrayRaw );
			var openChallengesArray = [];
			for(var i = 0; i < openChallengesArrayRaw.length; i++) {
				var challengeObbID = openChallengesArrayRaw[i].id;
				var challengeSentDate = openChallengesArrayRaw[i].createdAt;
				if (openChallengesArrayRaw[i].get("ChallengerID").id == Parse.User.current().id){
					console.log("Current User is not challenger");
					var opponentObj = openChallengesArrayRaw[i].get("ChallengeeID"); //gets opponents user object
					var opponentName = opponentObj.get("displayName"); //gets the display name of your opponent
					var opponentId = opponentObj.id; //gets the id of your opponent
				}
				else {
					console.log("Current User is the challenger");
					var opponentObj = openChallengesArrayRaw[i].get("ChallengerID"); //gets opponents user object
					var opponentName = opponentObj.get("displayName"); //gets the display name of your opponent
					var opponentId = opponentObj.id; //gets the id of your opponent
				}
				console.log("Opponent ID = " + opponentId);
				var openChallengesArrayObj = {opponentName: opponentName, opponentId: opponentId, challengeObbID: challengeObbID, challengeSentDate: challengeSentDate };
				openChallengesArray[openChallengesArray.length] = openChallengesArrayObj;
				console.log(openChallengesArrayObj);
			}
			console.log("For Loop of openChallengeArray complete");
			openChallengesArray.sort(function(obj1, obj2){
				return obj2.challengeSentDate - obj1.challengeSentDate; //sort in ascending order so newest first
			});
			console.log("OpenChallengeArraySorted");
			console.log(openChallengesArray);
			response.success(openChallengesArray);
		},
		error: function() {
			console.error("Challenge information could not be retrieved");
			response.error("Challenge information could not retrieved");
		}
	});
});

//Update the leaderboards rankings when a new match is logged.
Parse.Cloud.beforeSave("MatchScore", function(request, response) {
	
	//get player IDs
	var victorID = request.object.get("VictorID"); //get player 1 ID
	var loserID = request.object.get("LoserID"); //get player 1 ID
	
	var victorScore = request.object.get("VictorScore"); //get player 1 Score
	var loserScore = request.object.get("LoserScore"); //get player 1 Score
	console.log("Victors' Score: " + victorScore);
	console.log("Losers' Score: " + loserScore);
	
	//set Ranks
	var VictorRank = 0; 
	var LoserRank = 0;
	
	//set ranking queries
	var Leaderboard = Parse.Object.extend("LeaderBoard");
	var queryVictorRank = new Parse.Query(Leaderboard);
	queryVictorRank.equalTo("playerID", victorID); //get victor rank
	var queryLoserRank = new Parse.Query(Leaderboard);
	queryLoserRank.equalTo("playerID", loserID); //get loser rank
	
	//query ranks based on ID
	//calculate victor rank
	queryVictorRank.find().then(function(victorRankObj) {
		victorRanking = victorRankObj;
		console.log(victorRankObj);
		console.log(victorRanking);
		victorRank = victorRanking[0].get("Ranking"); //sets victor rank
		console.log("Victor Rank: " + victorRank); //Success message
	}, function(error) {
		console.error("Error: Victor Rank could not be fetched"); //error message
		response.error("Result not recorded");
	//calculate loser Rank
	}).then(function(query2) {
		return queryLoserRank.find();
	}).then(function(loserRankObj) {
		loserRanking = loserRankObj;
		loserRank = loserRanking[0].get("Ranking"); // sets loser rank
		console.log("Loser Rank: " + loserRank); //Success message
	}, function(error) {
		console.error("Error: Loser Rank could not be fetched"); //error message
		response.error("Result not recorded");
		//Update Leaderboard only if loser Rank is worse than victor rank
	}).then(function(updateLeaderboard) {
		if (victorRank < loserRank) { //checks if leaderboard needs to be updated
			console.log("Leaderboard Not required to be updated");
			response.success();
		}
		else {
			//update Leaderboard
			console.log("Leaderboard to be updated");
			var newRank = loserRank; //stores the victors new rank
			var Leaderboard3 = Parse.Object.extend("LeaderBoard");
			//fetch all users whose rank needs to be updated
			var queryUpdateLeaderboard = new Parse.Query(Leaderboard3);
			queryUpdateLeaderboard.greaterThanOrEqualTo("Ranking", loserRank);
			queryUpdateLeaderboard.lessThan("Ranking", victorRank);
			queryUpdateLeaderboard.find().then(function(results) {
			//update their ranks
				for (var i = 0; i < results.length; i++) {
					var oldRank = results[i].get("Ranking");
					var updateRank = results[i].set("Ranking", oldRank + 1);
					console.log(JSON.stringify(results[i].get("playerID")) + " Rank updated from " + oldRank + " to " + (oldRank + 1));
					results[i].save();
				}
				victorRanking[0].set("Ranking", newRank); //set the victors new rank
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
//end of add result functions

//Settings functions
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
		
//User opt out of leaderboard
   Parse.Cloud.define("leaveLeaderboard", function(request, response) {
		//set the leaderboard flag to false
	    var currentUser = Parse.User.current();
	    currentUser.set("Leaderboard", false); //sets the leaderboard flag to false indicating they are not in the leaderboard
	    currentUser.save();
		//close open challenges
		Parse.Cloud.run('allActiveChallengesArray', {}, {
			success: function(activeChallengesArrayRaw) {
				for (var i = 0; i < activeChallengesArrayRaw.length; i++) {
					var activeChallengesItem = activeChallengesArrayRaw[i];
					if (activeChallengesItem.get("Accepted") == false){
						activeChallengesItem.set("Active", false); //cancel challenge dont award walkover
						activeChallengesItem.save();
					} 
					else {
						activeChallengesItem.set("Active", false); //cancel challenge dont award walkover
						activeChallengesItem.save();
						//give opponent walkover
						//establish the victor and loser
						if (activeChallengesItem.get("ChallengeeID") == Parse.User.current()){
							var VictorObj = activeChallengesItem.get("ChallengerID"); //victor as challengee has declined the challenge
							var VictorID = VictorObj.id;
							var LoserObj = activeChallengesItem.get("ChallengeeID"); //loser as they declined the challenge
							var LoserID = LoserObj.id;
						} 
						else {
							var VictorObj = activeChallengesItem.get("ChallengeeID"); //victor as challengee has declined the challenge
							var VictorID = VictorObj.id;
							var LoserObj = activeChallengesItem.get("ChallengerID"); //loser as they declined the challenge
							var LoserID = LoserObj.id;
						}
						//record walkover result
						Parse.Cloud.run('awardWalkover', {VictorID: VictorID, LoserID: LoserID }, {
							success: function(walkoverResponse) {
								console.log(walkoverResponse);
								console.log("Score Successfully Added"); //User success message
								response.success("Challenge Declined Opponent awarded 3-0 Walkover");
							},
							error: function() {
								console.error("Challenge information could not be retrieved");
								response.error("Challenge information could not retrieved");
							}
						});
					}
				}
			},
			error: function() {
				console.error("Challenge information could not be retrieved");
				response.error("Challenge information could not retrieved");
			}
		});
		//remove user from the leaderboard
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

//get Player Stats
	//simple player stats will be expanded later
	Parse.Cloud.define("playerStats", function(request, response) {
		var MatchScore = Parse.Object.extend("MatchScore");		
		var queryMatchScore = new Parse.Query(MatchScore);
		//user total wins
		var totalWins = 0;
		var totalLosses = 0;
		var userVictories = new Parse.Query(MatchScore);
		userVictories.equalTo("VictorID", Parse.User.current()); //only returns matches specific to the current user
		userVictories.count().then(function(countVictories) {
			totalWins = countVictories;
			return totalWins;
		}).then(function(queryLosses) {
			var userLosses = new Parse.Query(MatchScore);
			userLosses.equalTo("LoserID", Parse.User.current()); //only returns matches specific to the current user
			return userLosses.count();
		}).then(function(countLosses) {
			var totalLosses = countLosses;
			return totalLosses;
		}).then(function(totalLosses) {
			console.log(totalLosses);
			console.log(totalLosses);
			//user total losses
			
			//Total matches played
			totalMatches = totalWins + totalLosses;
			//set up response object
			var playerStatsObj = {totalWins: totalWins, totalLosses: totalLosses, totalMatches: totalMatches}
			response.success(playerStatsObj);
		});
	});
//update displayName
	Parse.Cloud.define("updateDisplayName", function(request, response) {
		var newDisplayName = request.params.newDisplayName;
		var escapeNewDisplayName = escapeHtml(newDisplayName);
		var lengthEscapeNewDisplayName= escapeNewDisplayName.length;
		if (lengthEscapeNewDisplayName < 21) {
			console.log(escapeNewDisplayName);
			var currentUser = Parse.User.current();
			currentUser.set("displayName", escapeNewDisplayName); //sets the leaderboard flag to false indicating they are not in the leaderboard
			currentUser.save(null, {
				success: function(currentUser) {
					response.success("Your name has been updated");
				},
				error: function() {
					response.error("Displayname could not be updated. Please try again");
				}
			});
		} else {
			response.error("Use a shorter display name");
		}
		
	});
	//escape html function
	function escapeHtml(unsafe) {
		return unsafe
			 .replace(/&/g, "&amp;")
			 .replace(/</g, "&lt;")
			 .replace(/>/g, "&gt;")
			 .replace(/"/g, "&quot;")
			 .replace(/'/g, "&#039;");
	}
	
//end of Settings functions

//newsfeed
Parse.Cloud.define("newsfeed", function(request, response) {
	var newsfeed = [];
	
	Parse.Cloud.run('newsfeedMatchScore', {}, {
		success: function(MatchScoreArray) {
			console.log("MatchscoreArray: " + MatchScoreArray);
			newsfeed = newsfeed.concat(MatchScoreArray)
			var urlLink = 'https://api.twitter.com/1.1/statuses/home_timeline.json?screen_name=';
			var numberOfTweets = 5;
			Parse.Cloud.run('fetchTweetsNewsfeed', {url: urlLink, count: numberOfTweets}, {
			success: function(twitterArray) {
				console.log("twitterArray: " + twitterArray);
				//add new newsfeed objects to array
				newsfeed = newsfeed.concat(twitterArray);
				//set up next call
				var urlLink = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=';
				var numberOfTweets = 5;
				Parse.Cloud.run('fetchTweetsNewsfeed', {url: urlLink, count: numberOfTweets}, {
					success: function(twitterArray) {
						console.log("twitterArray: " + twitterArray);
						//console.log(twitterArray);
						//console.log(twitterArray.length);
						newsfeed = newsfeed.concat(twitterArray);
						console.log("newsfeed length: " + newsfeed.length);
						console.log("newsfeed: " + newsfeed);
						newsfeed.sort(function(obj1, obj2){
						return obj2.date - obj1.date; //sort in descending order so newest first
						});
						console.log("sorted newsfeed: " + newsfeed);
						response.success(newsfeed);
					},
					error: function(error){
						console.error("Twitter could not be sourced");
						response.error("Twitter could not be sourced");
					}
				});
			},
			error: function(error){
				console.error("Twitter could not be sourced");
				response.error("Twitter could not be sourced");
			}
		});
		},
		error: function(error){
			console.error("MatchScore could not be sourced");
			response.error("MatchScore could not be sourced");
		}
	});
});

Parse.Cloud.define("fetchTweetsNewsfeed", function(request, response) {
	
	
	//set up api request
    var screen_name = "sotonsquash";
    var count = request.params.count;
    var urlLink = request.params.url  + screen_name + '&count=' + count;
	var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();
	
	//define keys
    var consumerSecret = "ZIVOzcIvPHY23GJv1PHlwVuc2CGptkvYI55x0q8B0cLuc4rAs0";
	var tokenSecret = "vjVBxaTYXiNa1YqOgk0RwGhcBAWjrL1esYFvvZ1udaoiY";
	var oauth_consumer_key = "E3ohMxgsJ5lu1ymBwCDJO3jAM";
	var oauth_token = "921666319-C1ThsbP3YUEyxeVSHVQrVbZHUnWUTbXXz3hw7zsY";
	
	//get oauth signature
	var encodedSig = twitterApi(consumerSecret, tokenSecret, oauth_consumer_key, oauth_token, timestamp, nonce, urlLink);
	//oauth code twitter api requires oauth authentication prior to requests sourced from github (https://github.com/sreejithbnaick/Twitter-OAuth-1.1-Signature-Generator-js)
   
	
	//Twitter Api request
    Parse.Cloud.httpRequest({
        method: 'GET',
        url: urlLink,
        headers: {
            "Authorization": 'OAuth oauth_consumer_key="'+oauth_consumer_key+'", oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + 
			', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token="'+oauth_token+'", oauth_version="1.0"'
        },
        body: {
        },
        success: function(twitterResult) {
			console.log("test33");
			console.log(twitterResult.data);
			console.log(twitterResult.data.length);
			
			var twitterFeed = twitterResult;
			var twitterFeed2 = twitterFeed.data;
			console.log(twitterFeed2);
			console.log(twitterFeed2.length);
			twitterArray = [];
			for (i=0; i<twitterFeed2.length; i++){
				//parse tweets into a useable newsfeed format object
				var twitterUser = twitterFeed2[i].user.screen_name;
				var twitterUserPic = twitterFeed2[i].user.profile_image_url;
				var tweetText = twitterFeed2[i].text;
				var media ="1" //set media flag
				if ("media" in twitterFeed2[i].entities){
					if ("media_url" in twitterFeed2[i].entities.media[0]){
						var media = twitterFeed2[i].entities.media[0].media_url; //if there's an attachment assign it to media unsetting the flag
					} 
				}
				var content = "@" + twitterUser + " : " + tweetText;
				var userThumbnail = twitterUserPic;
				var twitterDate = normaliseTwitterDate(twitterFeed2[i].created_at);
				var contentDate = twitterDate;
				var type = "twitter";
				
				var twitterNewsfeedObj = {date: contentDate, content: content, type: type, userThumbnail: userThumbnail, media: media};
				//console.log(twitterNewsfeedObj);
						
				twitterArray[twitterArray.length] = twitterNewsfeedObj;
				//console.log(twitterArray);
			}
			response.success(twitterArray);
		}
	});
});
function twitterApi (consumerSecret, tokenSecret, oauth_consumer_key, oauth_token, timestamp, nonce, urlLink ) {
	
	var accessor = {
        "consumerSecret": consumerSecret,
        "tokenSecret": tokenSecret
    };
    var params = {
        "oauth_version": "1.0",
        "oauth_consumer_key": oauth_consumer_key,
        "oauth_token": oauth_token,
        "oauth_timestamp": timestamp,
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1"
    };
    var message = {
        "method": "GET",
        "action": urlLink,
        "parameters": params
    };
    //lets create oauth signature
    oauth.SignatureMethod.sign(message, accessor);
    var normPar = oauth.SignatureMethod.normalizeParameters(message.parameters);
    console.log("Normalized Parameters: " + normPar);
    var baseString = oauth.SignatureMethod.getBaseString(message);
    console.log("BaseString: " + baseString);
    var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
    console.log("Non-Encode Signature: " + sig);
    var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
    console.log("Encoded Signature: " + encodedSig);
	return encodedSig;
}

function normaliseTwitterDate(tweetDate)
{   
  return new Date(Date.parse(tweetDate.replace(/( \+)/, ' UTC$1')));
}

Parse.Cloud.define("newsfeedMatchScore", function(request, response) {
	//console.log("test2");
	var query = new Parse.Query("MatchScore");
	query.limit(20);
	query.descending("updatedAt");
	query.include("VictorID");
	query.include("LoserID");
	query.find({
		success: function(MatchScoreResults) {
			var MatchScoreArray = []
			console.log(MatchScoreResults);
			for (i=0; i<MatchScoreResults.length; i++){
				var victorName = MatchScoreResults[i].get("VictorID").get("displayName");
				var loserName = MatchScoreResults[i].get("LoserID").get("displayName");
				var victorScore = MatchScoreResults[i].get("VictorScore");
				var loserScore = MatchScoreResults[i].get("LoserScore");
			
				
				var content = victorName + " won against " + loserName + " : " + victorScore + "-" + loserScore;
				var contentDate = MatchScoreResults[i].updatedAt;
				var userThumbnail = "img/squashResultTumbnail.jpg";
				var type = "matchScore";
				var media = "1"; //adding media flag, future update adding media to match result. Photos/videos from game, or just victor profile
				
				var matchScoreNewsfeedObj = {date: contentDate, content: content, type: type, userThumbnail: userThumbnail,  media: media};
				//console.log(matchScoreNewsfeedObj);
				
				MatchScoreArray[MatchScoreArray.length] = matchScoreNewsfeedObj;
			}
			console.log("matchscore array: " + MatchScoreArray);
			response.success(MatchScoreArray);
		},
		error: function(error) {
			response.error("matchScore look up failed");
		}
	});
});