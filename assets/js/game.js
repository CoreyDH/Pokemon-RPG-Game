(function($) {

  $(function() {

    var imgPath = 'assets/images';

    function Pokemon() {

      return [
        {
          name: 'Pikachu',
          image: 'pikachu.gif',
          type: 'lightning',
          hp: 450,
          attack: 75,
          defense: 50,
          moves: [
            {
              name: 'Quick Attack',
              type: 'normal',
              power: 40,
              pp: 30,
              accuracy: 100,
            },
            {
              name: 'Thundershock',
              type: 'lightning',
              power: 40,
              pp: 30,
              accuracy: 100,
            },
            {
              name: 'Thunder',
              type: 'lightning',
              power: 110,
              pp: 10,
              accuracy: 70
            }
          ]
        },
        {
          name: 'Onyx',
          image: 'onyx.gif',
          type: 'rock',
          hp: 510,
          attack: 45,
          defense: 100,
          moves: [
            {
              name: 'Tackle',
              type: 'normal',
              power: 50,
              pp: 35,
              accuracy: 100
            },
            {
              name: 'Rock Throw',
              type: 'rock',
              power: 50,
              pp: 15,
              accuracy: 90
            },
            {
              name: 'Rock Slide',
              type: 'rock',
              power: 75,
              pp: 10,
              accuracy: 90,
            }
          ]
        },
        {
          name: 'Wartortle',
          image: 'wartortle.gif',
          type: 'water',
          hp: 500,
          attack: 63,
          defense: 80,
          moves: [
            {
              name: 'Bite',
              type: 'dark',
              power: 60,
              pp: 25,
              accuracy: 100
            },
            {
              name: 'Water Gun',
              type: 'water',
              power: 40,
              pp: 25,
              accuracy: 100
            },
            {
              name: 'Hydro Pump',
              type: 'water',
              power: 110,
              pp: 5,
              accuracy: 80,
            }
          ]
        },
        {
          name: 'Snorlax',
          image: 'snorlax.gif',
          type: 'normal',
          hp: 600,
          attack: 50,
          defense: 65,
          moves: [
            {
              name: 'Chip Away',
              type: 'normal',
              power: 70,
              pp: 20,
              accuracy: 100
            },
            {
              name: 'Body Slam',
              type: 'normal',
              power: 85,
              pp: 15,
              accuracy: 100,
            },
            {
              name: 'Giga Impact',
              type: 'normal',
              power: 150,
              pp: 5,
              accuracy: 90,
            },
          ]
        },
      ];
    }

    var game = {

      init: function() {

        this.inactivePokemon = new Pokemon();
        this.activePokemon = [];
        this.defendingPokemon = [];

        this.reset();
        this.loadCharacters('.rpg-select', this.inactivePokemon);
        this.loadSelectEvent();

      },

      reset: function() {

        $('.rpg-active').empty();
        $('.rpg-defender').empty();
        $('.rpg-inactive').empty();
        $('.alert').empty();

        $('.rpg-active-wrapper').hide();
        $('.rpg-defender-wrapper').hide();
        $('.rpg-inactive-wrapper').hide();

        this.unloadEvents();

      },

      loadCharacters: function(selector, obj) {

        var $characters = $(selector);
        $characters.empty();
        $(selector+'-wrapper').fadeIn();

        for(var i=0; i < obj.length; i++) {

          $characters.append('<li class="pokemon text-center pointer pull-left" id="'+obj[i].name+'"><table class="table pokemon-table"> <tr> <td class="text-center" colspan="2"><img src="'+imgPath+'/'+obj[i].image+'" class="rpg-image" /></td> </tr> <tr> <td>Name</td> <td><strong>'+obj[i].name+'</strong></td> </tr> <tr> <td>HP</td> <td class="rpg-hp">'+obj[i].hp+'</td> <tr> <td>Type</td> <td>'+obj[i].type+'</td> </tr> </tr> <tr> <td class="text-center rpg-moves-head" colspan="2">Moves</td> </tr> <tr> <td colspan="2"> <table class="table text-center rpg-moves"> </table> </td> </tr> </table></li>');

          for(var j=0; j < obj[i].moves.length; j++) {

            var $moves = $('#'+obj[i].name).find('.rpg-moves');
            $moves.append('<tr><td class="col-md-4">'+obj[i].moves[j].pp+'</td><td class="col-md-8"><a id="#'+obj[i].name+'-move-'+j+'" class="btn btn-primary btn-sm btn-block">'+obj[i].moves[j].name+'</a></td></tr>');

          }
        }
      },

      loadInactive: function() {

        $inactive = $('.rpg-inactive');
        $('.rpg-inactive-wrapper').fadeIn();

        for(var i=0; i < this.inactivePokemon.length; i++) {

          $inactive.append('<li class="pokemon text-center pointer pull-left" id="'+this.inactivePokemon[i].name+'"><img src="'+imgPath+'/'+this.inactivePokemon[i].image+'" /></li>');

        }

      },

      loadSelectEvent: function() {

        var self = this;
        $('.rpg-select-wrapper').show();

        $('.rpg-select li').on('click', function(event) {

          var index = $(this).index();  // Set index
          $('.rpg-select-wrapper').hide();
          $('.rpg-select').empty();

          self.activePokemon[0] = self.inactivePokemon[index]; // Set active pokemon based on index
          self.activePokemon[0].position = 'active';
          self.inactivePokemon.splice(index, 1); // Removed from Inactive

          self.loadInactive(); // Load inactive pokemon
          self.loadCharacters('.rpg-active', self.activePokemon);
          self.loadInactiveEvent();

        });

      },

      loadInactiveEvent: function() {

        var self = this;

        $('.rpg-inactive li').on('click', function() {

          var index = $(this).index();  // Set index
          $('.rpg-inactive-wrapper').slideToggle(); // Hide div

          self.defendingPokemon[0] = self.inactivePokemon[index]; // Set active pokemon based on index
          self.defendingPokemon[0].position = 'defender';
          self.inactivePokemon.splice(index, 1); // Removed from Inactive
          $('.rpg-inactive li').eq(index).remove();

          self.loadCharacters('.rpg-defender', self.defendingPokemon);
          self.loadMovesEvents(index);

        });

      },

      loadMovesEvents: function(index) {

        var self = this;

        $('.rpg-active').find('.rpg-moves').on('click', 'a', function() {

          var $this = $(this);
          var index = $this.attr('id').split('-')[2];  // Set index
          var defenderIndex = self.getRandomIndex(self.defendingPokemon[0].moves);

          var activeMove = self.activePokemon[0].moves[index]; // Specific move
          var defenderMove = self.defendingPokemon[0].moves[defenderIndex]; // Get random move

          var activeDmg = getDmg(self.activePokemon[0], self.defendingPokemon[0], activeMove);
          var defenderDmg = getDmg(self.defendingPokemon[0], self.activePokemon[0], defenderMove);
          var effective = '';

          self.defendingPokemon[0].hp -= activeDmg;
          drainPP(activeMove);
          displayDmg(self.activePokemon[0], activeMove, activeDmg);
          displayHP(self.defendingPokemon[0]);

          if(self.defendingPokemon[0].hp < 0) {

            self.unloadDefender();

          } else {

            self.activePokemon[0].hp -= defenderDmg;
            displayDmg(self.defendingPokemon[0], defenderMove, defenderDmg);
            displayHP(self.activePokemon[0]);

            if(self.activePokemon[0].hp < 0) {

              // Trigger loss
              self.lose();
            }
          }

          function getDmg(pkmn1, pkmn2, move) {

            var hitChance = move.accuracy;
            var hit = Math.floor(Math.random()*100) + 1;

            // If miss, 0 damage returned
            if(hitChance <= hit)
              return 0;

            var rand = Math.random()*(1-0.85) + 0.85;
            var typeMod;

            switch(true) {

              default:
                typeMod = 1;
                break;

              case (move.type === 'lightning' && pkmn2.type === 'water') :
                typeMod = 2;
                break;

              case (move.type === 'water' && pkmn2.type === 'lightning') :
                typeMod = 0.5;
                break;

              case (move.type === 'rock' && pkmn2.type === 'lightning') :
                typeMod = 2;
                break;

              case (move.type === 'lightning' && pkmn2.type === 'rock') :
                typeMod = 0.5;
                break;

              case (move.type === 'water' && pkmn2.type === 'rock') :
                typeMod = 2;
                break;

              case (move.type === 'normal' && pkmn2.type === 'rock') :
                typeMod = 0.5;
                break;

            }

            var modifier = typeMod * rand;
            var dmg = Math.floor(((pkmn1.attack/pkmn2.defense) * move.power + 2) * modifier); // formula from wiki

            return dmg;

          }

          function displayDmg(pkmn, move, dmg) {

            var selector = '.rpg-'+pkmn.position+'-wrapper';
            var msg = pkmn.name+' used '+move.name+'. ';

            msg += dmg > 0 ? 'It did '+dmg+' damage!' : 'It missed!';
            $(selector).find('.rpg-'+pkmn.position+'-alert').html(msg);

          }

          function displayHP(pkmn) {

            var selector = '.rpg-'+pkmn.position+'-wrapper';
            var $hp = $(selector).find('.rpg-hp');

            $hp.html(pkmn.hp);

          }

          function drainPP(move) {

            move.pp--;
            $this.parent().siblings('td').html(move.pp);

            if(move.pp === 0) {
              move.disabled = true;
              $this.addClass('disabled');
            }

          }

        });

      },

      loadRestartEvent: function() {

        var self = this;

        $('.rpg-active-alert').on('click', 'button', function() {

          self.init();

        });

      },

      unloadDefender: function() {

        this.unloadMovesEvents();

        $('.rpg-active-alert').html(this.defendingPokemon[0].name+' has fainted!');
        console.log(this.inactivePokemon.length);
        if(this.inactivePokemon.length === 0) {

          this.win();

        } else {

          $('.rpg-defender').empty().html('<h2>Please Choose Another Pokemon to Fight</h2>');
          $('.rpg-inactive-wrapper').slideToggle();

        }

      },

      unloadMovesEvents: function () {

        $('.rpg-active').find('.rpg-moves').off();

      },

      unloadEvents: function() {

        this.unloadMovesEvents();
        $('.rpg-active').find('.rpg-moves').off();
        $('.rpg-select li').off();
        $('.rpg-inactive li').off();
        $('.rpg-active-alert').off();

      },

      lose: function () {
        this.unloadMovesEvents();
        this.loadRestartEvent();
        $('.rpg-active-alert').html(this.activePokemon[0].name+' has fainted! You lose. <button type="button">Try again?</button>');

      },

      win: function() {
        this.unloadMovesEvents();
        this.loadRestartEvent();
        $('.rpg-active-alert').html(this.activePokemon[0].name+' has defeated all pokemon! You win!  <button type="button">Play again?</button>');
      },

      getRandomIndex: function (arr) {
        return Math.floor(Math.random()*arr.length);
      }

    };

    game.init();
    // $('#rpg-modal').modal('show');

  });

})(jQuery);
