define([
  "namespace",

  // Libs
  "use!backbone",

  // Modules
  "modules/player",
  "modules/game",

  // Plugins
  "use!plugins/backbone.layoutmanager"
],
/*
This module is an interface for tracking game action.
This module does not manage any of its own data but instead relies on its inherited modules.
*/
function(namespace, Backbone, Player, Game) {
	var app = namespace.app;
	var TrackedGame = namespace.module();

	//
	// ROUTER
	//
	TrackedGame.Router = Backbone.Router.extend({
		routes : {
			"track/:gameId": "trackGame",
		},
		trackGame: function (gameId) {
			//TODO: check to see if app.trackedGame exists, and if it has the same id as gameId
			//If so, use app.trackedGame, else create a new trackedGame.
			var trackedGame = new Game.Model({id: gameId});
			trackedGame.fetch();
			//This router won't get called again unless manually refreshed,
			//so pass the views as much data as they need.
			var myLayout = app.router.useLayout("tracked_game");
			myLayout.setViews({
				".sub_team_1": new TrackedGame.Views.SubTeam({model:trackedGame}),
				".sub_team_2": new TrackedGame.Views.SubTeam({model:trackedGame}),
				".t_game": new TrackedGame.Views.GameAction({model:trackedGame})
			});
			myLayout.render(function(el) {
				$("#main").html(el);
				$('.sub_team_1').hide();
				$('.sub_team_2').hide();
				$('.t_game').show();
			});//TODO: then hide sub_team_2 and t_game
		},
	});
	TrackedGame.router = new TrackedGame.Router();// INITIALIZE ROUTER
  	
	//
	// VIEWS
	//
	TrackedGame.Views.GameAction = Backbone.View.extend({
		template: "trackedgame/game_action",
		render: function(layout) {
			var view = layout(this);
			this.setViews({
				".scoreboard": new TrackedGame.Views.Scoreboard({model: this.model}),
				".player_area": new TrackedGame.Views.PlayerArea({model: this.model}),
				".action_area": new TrackedGame.Views.ActionArea({model: this.model, showing_alternate: false})
			});
			return view.render();
		},
		//render will be called anytime the data change.
		initialize: function() {this.model.bind("change", function() {this.render();}, this);}
	});
	TrackedGame.Views.Scoreboard = Backbone.View.extend({
		template: "trackedgame/scoreboard",
		serialize: function() {return this.model.toJSON();},
		initialize: function() {this.model.bind("change", function() {this.render();}, this);}
	});
	TrackedGame.Views.PlayerArea = Backbone.View.extend({
		template: "trackedgame/player_area",
		serialize: function() {return this.model.toJSON();},
		//Get what we need from this.options.trackedGame and set the player buttons
		initialize: function() {this.model.bind("change", function() {this.render();}, this);}
	});
	TrackedGame.Views.ActionArea = Backbone.View.extend({
		template: "trackedgame/action_area",
		events: {
			"click .undo": "undo",
			"click .misc": "misc",
			"click .score": "score",
			"click .completion": "completion",
			"click .throwaway": "throwaway",
			"click .dropped_pass": "dropped_pass",
			"click .defd_pass": "defd_pass",
			"click .unknown_turn": "unknown_turn",
			"click .timeout": "timeout",
			"click .end_of_period": "end_of_period",
			"click .injury": "injury"
		},
		undo: function(ev){
			console.log("TODO: undo")
		},
		misc: function(ev){//toggle which buttons are being displayed.
			if (this.options.showing_alternate) {
				this.$('.alternate_action').hide();
				this.$('.main_action').show();
				this.options.showing_alternate=false;
			}
			else {
				this.$('.main_action').hide();
				this.$('.alternate_action').show();
				this.options.showing_alternate=true;
			}
		},
		score: function(ev){
			console.log("TODO: score")
			//ev.currentTarget.classList
		},
		completion: function(ev){
			console.log("TODO: completion")
		},
		throwaway: function(ev){
			console.log("TODO: throwaway")
		},
		dropped_pass: function(ev){
			console.log("TODO: dropped_pass")
		},
		defd_pass: function(ev){
			console.log("TODO: defd_pass")
		},
		unknown_turn: function(ev){
			console.log("TODO: unknown_turn")
		},
		timeout: function(ev){
			console.log("TODO: timeout")
		},
		end_of_period: function(ev){
			console.log("TODO: end_of_period")
		},
		injury: function(ev){
			console.log("TODO: injury")
			//show the substitution screen for a team.
			$('.t_game').hide();
			$('.sub_team_1').show();
			$('.sub_team_2').hide();
		},
		
		render: function(layout) {
			var view = layout(this);
			return view.render().then(function(el) {
				this.misc();
			});
		},
		initialize: function() {this.model.bind("change", function() {this.render();}, this);}
	});
	
	TrackedGame.Views.SubTeam = Backbone.View.extend({
		template: "trackedgame/game_substitution",
		initialize: function() {this.model.bind("change", function() {this.render();}, this);},
		events: {
			"click .sub_next": "sub_next",
			"click .sub_done": "sub_done"
		},
		sub_next: function(ev){
			$('.sub_team_1').hide();
			$('.sub_team_2').show();
		},
		sub_done: function(ev){
			$('.sub_team_1').hide();
			$('.sub_team_2').hide();
			$('.t_game').show();
		}
	});
	
	return TrackedGame;
});