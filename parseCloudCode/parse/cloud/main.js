
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

//MyChallenges Functions
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
Parse.Cloud.define("activeChallenges", function(request, response) {
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
		success: function(activeChallengesArrayRaw) {
			var activeChallengesArray = [];
			for(var i = 0; i < activeChallengesArrayRaw.length; i++) {
				var challengeUpdatedDateRaw = activeChallengesArrayRaw[i].updatedAt;
				var challengeUpdatedDate = new Date(Date.parse(challengeUpdatedDateRaw)).toUTCString();
				var challengeObbID = activeChallengesArrayRaw[i].id;
				var challengeAccepted = activeChallengesArrayRaw[i].get("Accepted");
				var oppnentInfo = "";
				if (activeChallengesArrayRaw[i].get("ChallengerID").id == Parse.User.current().id){
					var opponentObj = activeChallengesArrayRaw[i].get("ChallengeeID"); //gets opponents user object
					var opponentName = opponentObj.get("displayName"); //gets the display name of your opponent
					var opponentId = opponentObj.id; //gets the id of your opponent
					var challengeDetails = "You challenged " + opponentName + " to a match"
					if (challengeAccepted == true){
						var challengeStatusMessage = "Challenge Accepted " + challengeUpdatedDate;
						var challengeStatus = "challengeAccepted"; //sets the challenge status used for formatting table
						var oppnentInfo = opponentObj.get("email"); //gets the display name of your opponent
					}
					else {
						var challengeStatusMessage = "Awaiting reply from opponent (Challenge sent  " + challengeUpdatedDate + ")";
						var challengeStatus = "awaitingResponseOpponent"; //sets the challenge status used for formatting table
					}
				}
				else {
					var opponentObj = activeChallengesArrayRaw[i].get("ChallengerID"); //gets opponents user object
					var opponentName = opponentObj.get("displayName"); //gets the display name of your opponent
					var opponentId = opponentObj.id; //gets the id of your opponent
					var challengeDetails = opponentName + " challenged you to a match"
					if (challengeAccepted == false){
						var challengeStatusMessage = "You Accepted " + challengeUpdatedDate;
						var challengeStatus = "challengeAccepted"; //sets the challenge status used for formatting table
						var oppnentInfo = opponentObj.get("email"); //gets the display name of your opponent
					}
					else {
						var challengeStatusMessage = "You have not yet replied (Challenge sent  " + challengeUpdatedDate + ")";
						var challengeStatus = "awaitingResponseUser"; //sets the challenge status used for formatting table
					}
				}
				//set up array object
				//store in array
				var activeChallengesArrayObj = {challengeDetails: challengeDetails, challengeStatus: challengeStatus, challengeStatusMessage: challengeStatusMessage, oppnentInfo: oppnentInfo, challengeObbID: challengeObbID, challengeUpdatedDateRaw: challengeUpdatedDateRaw }
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
		var opponentArray = []
		for(var i = 0; i < opponentArrayRaw.length; i++) {
			var oppObj = opponentArrayRaw[i].get("playerID");; //Opponents user object
			var text = oppObj.get("displayName"); //opponents displayName
			var value = oppObj.id; //Opponents user objectID
			var opponentArrayObj = {text: text, value: value};
			//need to work out validation to not add object to array if an active challenge already exists.
			opponentArray[opponentArray.length] = opponentArrayObj;
			console.log(opponentArray[i]);
		}
		console.log(opponentArray);
		response.success(opponentArray);
	})
});

//AddResult Function
//fetch Opponents
Parse.Cloud.define("fetchOpponentsAddResult", function(request, response) {
	console.log("hello");
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
			var openChallengesArray = [];
			for(var i = 0; i < openChallengesArrayRaw.length; i++) {
				var challengeObbID = openChallengesArrayRaw[i].id;
				var challengeSentDate = openChallengesArrayRaw[i].createdAt;
				if (openChallengesArrayRaw[i].get("ChallengerID").id == Parse.User.current().id){
					var opponentObj = openChallengesArrayRaw[i].get("ChallengeeID"); //gets opponents user object
					var opponentName = opponentObj.get("displayName"); //gets the display name of your opponent
					var opponentId = opponentObj.id; //gets the id of your opponent
				}
				else {
					var opponentObj = openChallengesArrayRaw[i].get("ChallengerID"); //gets opponents user object
					var opponentName = opponentObj.get("displayName"); //gets the display name of your opponent
					var opponentId = opponentObj.id; //gets the id of your opponent
				}
				var openChallengesArrayObj = {opponentName: opponentName, opponentId: opponentId, challengeObbID: challengeObbID, challengeSentDate: challengeSentDate };
				openChallengesArray[openChallengesArray.length] = openChallengesArrayObj;
				console.log(openChallengesArrayObj);
			}
			openChallengesArray.sort(function(obj1, obj2){
				return obj2.challengeSentDate - obj1.challengeSentDate; //sort in ascending order so newest first
			});
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