
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
console.log("hello5");
var twitterFeed = [{"created_at":"Sun Mar 15 17:23:15 +0000 2015","id":577158126174126100,"id_str":"577158126174126080","text":"RT @sotonvarsity: Final score of 156-88!","source":"<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":921666319,"id_str":"921666319","name":"Southampton Squash ","screen_name":"sotonsquash","location":"Southampton","profile_location":null,"description":"Official Tweets from Southampton University Squash Club. The nicest and fittest club in the AU.","url":"http://t.co/Vf9HdhuM6f","entities":{"url":{"urls":[{"url":"http://t.co/Vf9HdhuM6f","expanded_url":"http://www.sotonsquash.com/","display_url":"sotonsquash.com","indices":[0,22]}]},"description":{"urls":[]}},"protected":false,"followers_count":231,"friends_count":279,"listed_count":8,"created_at":"Fri Nov 02 19:49:53 +0000 2012","favourites_count":50,"utc_offset":null,"time_zone":null,"geo_enabled":true,"verified":false,"statuses_count":342,"lang":"en","contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"C0DEED","profile_background_image_url":"http://pbs.twimg.com/profile_background_images/563429389921026048/xaZ7F_w6.png","profile_background_image_url_https":"https://pbs.twimg.com/profile_background_images/563429389921026048/xaZ7F_w6.png","profile_background_tile":false,"profile_image_url":"http://pbs.twimg.com/profile_images/2798293895/b0b5a1a4ef034633d07b8eaa0880de60_normal.png","profile_image_url_https":"https://pbs.twimg.com/profile_images/2798293895/b0b5a1a4ef034633d07b8eaa0880de60_normal.png","profile_banner_url":"https://pbs.twimg.com/profile_banners/921666319/1352038091","profile_link_color":"DD2E44","profile_sidebar_border_color":"000000","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"default_profile":false,"default_profile_image":false,"following":false,"follow_request_sent":false,"notifications":false},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweeted_status":{"created_at":"Sun Mar 15 17:22:11 +0000 2015","id":577157860062314500,"id_str":"577157860062314496","text":"Final score of 156-88!","source":"<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":3048192977,"id_str":"3048192977","name":"Team Soton Varsity","screen_name":"sotonvarsity","location":"","profile_location":null,"description":"Follow for live updates from #TeamSoton at #Varsity2015","url":null,"entities":{"description":{"urls":[]}},"protected":false,"followers_count":235,"friends_count":40,"listed_count":1,"created_at":"Fri Feb 20 22:43:36 +0000 2015","favourites_count":2,"utc_offset":null,"time_zone":null,"geo_enabled":false,"verified":false,"statuses_count":142,"lang":"en","contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"000000","profile_background_image_url":"http://abs.twimg.com/images/themes/theme1/bg.png","profile_background_image_url_https":"https://abs.twimg.com/images/themes/theme1/bg.png","profile_background_tile":false,"profile_image_url":"http://pbs.twimg.com/profile_images/576308834253213696/F8TSRjF1_normal.png","profile_image_url_https":"https://pbs.twimg.com/profile_images/576308834253213696/F8TSRjF1_normal.png","profile_banner_url":"https://pbs.twimg.com/profile_banners/3048192977/1424473192","profile_link_color":"800000","profile_sidebar_border_color":"000000","profile_sidebar_fill_color":"000000","profile_text_color":"000000","profile_use_background_image":false,"default_profile":false,"default_profile_image":false,"following":true,"follow_request_sent":false,"notifications":false},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":34,"favorite_count":14,"entities":{"hashtags":[],"symbols":[],"user_mentions":[],"urls":[]},"favorited":false,"retweeted":true,"lang":"en"},"retweet_count":34,"favorite_count":0,"entities":{"hashtags":[],"symbols":[],"user_mentions":[{"screen_name":"sotonvarsity","name":"Team Soton Varsity","id":3048192977,"id_str":"3048192977","indices":[3,16]}],"urls":[]},"favorited":false,"retweeted":true,"lang":"en"},{"created_at":"Sun Mar 15 17:23:09 +0000 2015","id":577158103675830300,"id_str":"577158103675830272","text":"RT @sotonvarsity: Team Southampton are the official winners of Varsity 2015!","source":"<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":921666319,"id_str":"921666319","name":"Southampton Squash ","screen_name":"sotonsquash","location":"Southampton","profile_location":null,"description":"Official Tweets from Southampton University Squash Club. The nicest and fittest club in the AU.","url":"http://t.co/Vf9HdhuM6f","entities":{"url":{"urls":[{"url":"http://t.co/Vf9HdhuM6f","expanded_url":"http://www.sotonsquash.com/","display_url":"sotonsquash.com","indices":[0,22]}]},"description":{"urls":[]}},"protected":false,"followers_count":231,"friends_count":279,"listed_count":8,"created_at":"Fri Nov 02 19:49:53 +0000 2012","favourites_count":50,"utc_offset":null,"time_zone":null,"geo_enabled":true,"verified":false,"statuses_count":342,"lang":"en","contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"C0DEED","profile_background_image_url":"http://pbs.twimg.com/profile_background_images/563429389921026048/xaZ7F_w6.png","profile_background_image_url_https":"https://pbs.twimg.com/profile_background_images/563429389921026048/xaZ7F_w6.png","profile_background_tile":false,"profile_image_url":"http://pbs.twimg.com/profile_images/2798293895/b0b5a1a4ef034633d07b8eaa0880de60_normal.png","profile_image_url_https":"https://pbs.twimg.com/profile_images/2798293895/b0b5a1a4ef034633d07b8eaa0880de60_normal.png","profile_banner_url":"https://pbs.twimg.com/profile_banners/921666319/1352038091","profile_link_color":"DD2E44","profile_sidebar_border_color":"000000","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"default_profile":false,"default_profile_image":false,"following":false,"follow_request_sent":false,"notifications":false},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweeted_status":{"created_at":"Sun Mar 15 17:21:41 +0000 2015","id":577157734317056000,"id_str":"577157734317056000","text":"Team Southampton are the official winners of Varsity 2015!","source":"<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":3048192977,"id_str":"3048192977","name":"Team Soton Varsity","screen_name":"sotonvarsity","location":"","profile_location":null,"description":"Follow for live updates from #TeamSoton at #Varsity2015","url":null,"entities":{"description":{"urls":[]}},"protected":false,"followers_count":235,"friends_count":40,"listed_count":1,"created_at":"Fri Feb 20 22:43:36 +0000 2015","favourites_count":2,"utc_offset":null,"time_zone":null,"geo_enabled":false,"verified":false,"statuses_count":142,"lang":"en","contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"000000","profile_background_image_url":"http://abs.twimg.com/images/themes/theme1/bg.png","profile_background_image_url_https":"https://abs.twimg.com/images/themes/theme1/bg.png","profile_background_tile":false,"profile_image_url":"http://pbs.twimg.com/profile_images/576308834253213696/F8TSRjF1_normal.png","profile_image_url_https":"https://pbs.twimg.com/profile_images/576308834253213696/F8TSRjF1_normal.png","profile_banner_url":"https://pbs.twimg.com/profile_banners/3048192977/1424473192","profile_link_color":"800000","profile_sidebar_border_color":"000000","profile_sidebar_fill_color":"000000","profile_text_color":"000000","profile_use_background_image":false,"default_profile":false,"default_profile_image":false,"following":true,"follow_request_sent":false,"notifications":false},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":101,"favorite_count":44,"entities":{"hashtags":[],"symbols":[],"user_mentions":[],"urls":[]},"favorited":false,"retweeted":true,"lang":"en"},"retweet_count":101,"favorite_count":0,"entities":{"hashtags":[],"symbols":[],"user_mentions":[{"screen_name":"sotonvarsity","name":"Team Soton Varsity","id":3048192977,"id_str":"3048192977","indices":[3,16]}],"urls":[]},"favorited":false,"retweeted":true,"lang":"en"},{"created_at":"Sun Mar 15 15:13:42 +0000 2015","id":577125526336368600,"id_str":"577125526336368640","text":"SotonSquash victory burgers #playtowin #playtoeat #Varsity2015 http://t.co/87sl4ppFrt","source":"<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android</a>","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":921666319,"id_str":"921666319","name":"Southampton Squash ","screen_name":"sotonsquash","location":"Southampton","profile_location":null,"description":"Official Tweets from Southampton University Squash Club. The nicest and fittest club in the AU.","url":"http://t.co/Vf9HdhuM6f","entities":{"url":{"urls":[{"url":"http://t.co/Vf9HdhuM6f","expanded_url":"http://www.sotonsquash.com/","display_url":"sotonsquash.com","indices":[0,22]}]},"description":{"urls":[]}},"protected":false,"followers_count":231,"friends_count":279,"listed_count":8,"created_at":"Fri Nov 02 19:49:53 +0000 2012","favourites_count":50,"utc_offset":null,"time_zone":null,"geo_enabled":true,"verified":false,"statuses_count":342,"lang":"en","contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"C0DEED","profile_background_image_url":"http://pbs.twimg.com/profile_background_images/563429389921026048/xaZ7F_w6.png","profile_background_image_url_https":"https://pbs.twimg.com/profile_background_images/563429389921026048/xaZ7F_w6.png","profile_background_tile":false,"profile_image_url":"http://pbs.twimg.com/profile_images/2798293895/b0b5a1a4ef034633d07b8eaa0880de60_normal.png","profile_image_url_https":"https://pbs.twimg.com/profile_images/2798293895/b0b5a1a4ef034633d07b8eaa0880de60_normal.png","profile_banner_url":"https://pbs.twimg.com/profile_banners/921666319/1352038091","profile_link_color":"DD2E44","profile_sidebar_border_color":"000000","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"default_profile":false,"default_profile_image":false,"following":false,"follow_request_sent":false,"notifications":false},"geo":{"type":"Point","coordinates":[50.7953752,-1.1075899]},"coordinates":{"type":"Point","coordinates":[-1.1075899,50.7953752]},"place":{"id":"511655fc081bb251","url":"https://api.twitter.com/1.1/geo/id/511655fc081bb251.json","place_type":"city","name":"Portsmouth","full_name":"Portsmouth, England","country_code":"GB","country":"United Kingdom","contained_within":[],"bounding_box":{"type":"Polygon","coordinates":[[[-1.117912,50.778429],[-1.0160589,50.778429],[-1.0160589,50.8593],[-1.117912,50.8593]]]},"attributes":{}},"contributors":null,"retweet_count":0,"favorite_count":0,"entities":{"hashtags":[{"text":"playtowin","indices":[28,38]},{"text":"playtoeat","indices":[39,49]},{"text":"Varsity2015","indices":[50,62]}],"symbols":[],"user_mentions":[],"urls":[],"media":[{"id":577125511593340900,"id_str":"577125511593340929","indices":[63,85],"media_url":"http://pbs.twimg.com/media/CAJcmFVWMAEVU7l.jpg","media_url_https":"https://pbs.twimg.com/media/CAJcmFVWMAEVU7l.jpg","url":"http://t.co/87sl4ppFrt","display_url":"pic.twitter.com/87sl4ppFrt","expanded_url":"http://twitter.com/sotonsquash/status/577125526336368640/photo/1","type":"photo","sizes":{"small":{"w":340,"h":453,"resize":"fit"},"medium":{"w":600,"h":800,"resize":"fit"},"thumb":{"w":150,"h":150,"resize":"crop"},"large":{"w":768,"h":1024,"resize":"fit"}}}]},"extended_entities":{"media":[{"id":577125511593340900,"id_str":"577125511593340929","indices":[63,85],"media_url":"http://pbs.twimg.com/media/CAJcmFVWMAEVU7l.jpg","media_url_https":"https://pbs.twimg.com/media/CAJcmFVWMAEVU7l.jpg","url":"http://t.co/87sl4ppFrt","display_url":"pic.twitter.com/87sl4ppFrt","expanded_url":"http://twitter.com/sotonsquash/status/577125526336368640/photo/1","type":"photo","sizes":{"small":{"w":340,"h":453,"resize":"fit"},"medium":{"w":600,"h":800,"resize":"fit"},"thumb":{"w":150,"h":150,"resize":"crop"},"large":{"w":768,"h":1024,"resize":"fit"}}}]},"favorited":false,"retweeted":false,"possibly_sensitive":false,"lang":"en"}]
//console.log(twitterFeed);
//console.log(twitterFeed.text);
var twitterFeed2 = twitterFeed; //this would be .data in live version
console.log(twitterFeed2);
console.log(twitterFeed2.length);
twitterArray = [];
for (i=0; i<twitterFeed2.length; i++){

	var twitterUser = twitterFeed2[i].user.screen_name;
	var twitterUserPic = twitterFeed2[i].user.profile_image_url;
	var tweetText = twitterFeed2[i].text;
	//var media = twitterFeed2[i].entities.media[0].media_url; //need to control if there isn't an attachment
	
	var content = "@" + twitterUser + " : " + tweetText;
	var contentDate = twitterFeed2[i].created_at;
	var type = "twitter";
	
	var twitterNewsfeedObj = {content: content, date: contentDate, type: type};
	console.log(twitterNewsfeedObj);
			
	twitterArray[twitterArray.length] = twitterNewsfeedObj;
	console.log(twitterArray);
	
	/*console.log(twitterFeed2[i]);
	console.log(twitterFeed2[i].created_at);
	console.log(twitterFeed2[i].text);
	console.log(twitterFeed2[i].user.name);
	console.log(twitterFeed2[i].user.screen_name);
	console.log(twitterFeed2[i].user.profile_image_url);
	console.log(twitterFeed2[i].entities)
	if (typeof twitterFeed2[i].entities.media != "undefined"){
		console.log(twitterFeed2[i].entities.media);
		if (typeof twitterFeed2[i].entities.media[0].media_url != "undefined"){
			console.log(twitterFeed2[i].entities.media[0].media_url);
		}
	}*/
}

response.success("Doms Cloud Code");
});

//for twitter api
var oauth = require('cloud/oauth.js');
var sha = require('cloud/sha1.js');

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