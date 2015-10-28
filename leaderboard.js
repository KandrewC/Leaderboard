PlayersList = new Mongo.Collection('players');
UserAccounts = new Mongo.Collection('user');

if(Meteor.isClient){

  Template.leaderboard.helpers({
    //Sorts players created by the currently logged in user by score and name
    'player': function(){
    	var currentUserId = Meteor.userId()
        return PlayersList.find({createdBy: currentUserId}, {sort: {score: -1, name: 1} })
    },
    //Determines if a player has been selected
    'selectedClass': function(){
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if(playerId == selectedPlayer){
          return "selected"
      }
    },
    //Shows the selected player at the bottom of the screen
    'showSelectedPlayer': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne(selectedPlayer)
    }, 
    //Displays the player count for the current user
    'countPlayers': function() {
    	var currentUserId = Meteor.userId()
    	return PlayersList.find({createdBy: currentUserId}).count();
    },

  });

  Template.leaderboard.events({
    //Checks if the click is on a player
    'click .player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
    },
    //Button to increment points (+5)
    'click .increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: 5} });
    },
    //Button to decrement points (-5)
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: -5} });
    },
    //Button to remove a player
    'click .remove': function(){
    	var selectedPlayer = Session.get('selectedPlayer');
 	    if(confirm('Are you sure you want to remove'))
   		  PlayersList.remove(selectedPlayer);
      }
  });

  //Adds a player into the leaderboard
	Template.addPlayerForm.events({
		'submit form': function(event, template){
			event.preventDefault(); 
			var currentUserId = Meteor.userId();
			var playerNameVar = event.target.playerName.value;
			PlayersList.insert({ 
				name: playerNameVar,
				score: 0,
				createdBy: currentUserId
			});
			template.find("form").reset(); //Resets the form after entering a name
		}
	});
}

	

if(Meteor.isServer){
    // this code only runs on the server
}
