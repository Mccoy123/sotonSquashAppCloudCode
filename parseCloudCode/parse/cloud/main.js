
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
	console.log("hello");
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
		if (victorRank < loserRank) { //checks if leaderboard needs to be updated
			console.log("Leaderboard Not required to be updated");
			response.success();
		}
		else {
			console.log("Leaderboard to be updated");
			var newRank = loserRank; //stores the victors new rank
			var Leaderboard3 = Parse.Object.extend("LeaderBoard");
			//fetch all users whose rank needs to be updated
			var queryUpdateLeaderboard = new Parse.Query(Leaderboard3);
			queryUpdateLeaderboard.greaterThanOrEqualTo("Ranking", loserRank);
			queryUpdateLeaderboard.lessThan("Ranking", victorRank);
			queryUpdateLeaderboard.find().then(function(results) {
			//update their rank
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
			Parse.Cloud.run('newsfeedTwitter', {}, {
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
			console.error("MatchScore could not be sourced");
			response.error("MatchScore could not be sourced");
		}
	});
});

Parse.Cloud.define("newsfeedTwitter", function(request, response) {
	
	
	//set up api request
    var screen_name = "sotonsquash";
    var count = 10;
    var urlLink = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + screen_name + '&count=' + count;
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
	query.include("Player1ID");
	query.include("Player2ID");
	query.find({
		success: function(MatchScoreResults) {
			var MatchScoreArray = []
			for (i=0; i<MatchScoreResults.length; i++){
			
				var p1Name = MatchScoreResults[i].get("Player1ID").get("displayName");
				var p2Name = MatchScoreResults[i].get("Player2ID").get("displayName");
				var p1Score = MatchScoreResults[i].get("P1Score");
				var p2Score = MatchScoreResults[i].get("P2Score");
				
				if (p1Score < p2Score){
					var matchOutcome = " lost against ";
				} else {
					var matchOutcome = " won against ";
				}
				
				var content = p1Name + matchOutcome + p2Name + " : " + p1Score + "-" + p2Score;
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