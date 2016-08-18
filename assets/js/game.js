(function($) {

  $(function() {

    var imgPath = 'assets/images';

    var pokemon = [
      {
        name: 'Pikachu',
        image: 'pikachu.gif',
        type: 'lightning',
        hp: 400,
        attack: 55,
        defense: 40,
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
        defense: 160,
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
        hp: 800,
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

    var inactivePokemon = pokemon;
    var activePokemon = [];
    var defendingPokemon = [];

    loadCharacters('.rpg-select', pokemon);
    loadSelectEvent();

    function loadCharacters(selector, obj) {

      var $characters = $(selector);
      $characters.empty();

      for(var i=0; i < obj.length; i++) {

        $characters.append('<li class="pokemon text-center pointer pull-left" id="'+obj[i].name+'"><table class="table pokemon-table"> <tr> <td class="text-center" colspan="2"><img src="'+imgPath+'/'+obj[i].image+'" class="rpg-image" /></td> </tr> <tr> <td>Name</td> <td><strong>'+obj[i].name+'</strong></td> </tr> <tr> <td>HP</td> <td class="rpg-hp">'+obj[i].hp+'</td> <tr> <td>Type</td> <td>'+obj[i].type+'</td> </tr> </tr> <tr> <td class="text-center rpg-moves-head" colspan="2">Moves</td> </tr> <tr> <td colspan="2"> <table class="table text-center rpg-moves"> </table> </td> </tr> </table></li>');

        for(var j=0; j < obj[i].moves.length; j++) {

          var $moves = $('#'+obj[i].name).find('.rpg-moves');
          $moves.append('<tr><td class="col-md-4">'+obj[i].moves[j].pp+'</td><td class="col-md-8"><a id="#'+obj[i].name+'-move-'+j+'" class="btn btn-primary btn-sm btn-block">'+obj[i].moves[j].name+'</a></td></tr>');

        }
      }
    }

    function loadInactive(selector) {

      $inactive = $(selector);

      for(var i=0; i < inactivePokemon.length; i++) {

        $inactive.append('<li class="pokemon text-center pointer pull-left" id="'+inactivePokemon[i].name+'"><img src="'+imgPath+'/'+inactivePokemon[i].image+'" /></li>');

      }

    }

    function loadSelectEvent() {

      $('.rpg-select li').on('click', function(event) {

        var index = $(this).index();  // Set index
        $('.rpg-select-wrapper').remove(); // Remove div

        activePokemon[0] = inactivePokemon[index]; // Set active pokemon based on index
        inactivePokemon.splice(index, 1); // Removed from Inactive

        loadInactive('.rpg-inactive'); // Load inactive pokemon
        loadCharacters('.rpg-active', activePokemon);
        loadInactiveEvent();

      });

    }

    function loadInactiveEvent() {

      $('.rpg-inactive li').on('click', function() {

        var index = $(this).index();  // Set index
        $('.rpg-inactive-wrapper').slideToggle(); // Hide div

        defendingPokemon[0] = inactivePokemon[index]; // Set active pokemon based on index
        inactivePokemon.splice(index, 1); // Removed from Inactive
        $('.rpg-inactive li').eq(index).remove();

        loadCharacters('.rpg-defender', defendingPokemon);
        loadMovesEvents(index);

      });

    }

    function unloadDefender() {

      unloadMovesEvents();

      $('.rpg-active-alert').html(defendingPokemon[0].name+' has fainted!');
      $('.rpg-defender').empty().html('<h2>Please Choose Another Pokemon to Fight</h2>');
      $('.rpg-inactive-wrapper').slideToggle(); // Show div

    }

    function loadMovesEvents(index) {

      $('.rpg-active').find('.rpg-moves').on('click', 'a', function() {

        var $this = $(this);
        var index = $this.attr('id').split('-')[2];  // Set index
        var defenderIndex = getRandomIndex(defendingPokemon[0].moves);

        var activeMove = activePokemon[0].moves[index]; // Specific move
        var defenderMove = defendingPokemon[0].moves[defenderIndex]; // Get random move

        var activeDmg = getDmg(activePokemon[0], defendingPokemon[0], activeMove);
        var defenderDmg = getDmg(defendingPokemon[0], activePokemon[0], defenderMove);

        activePokemon[0].hp -= defenderDmg;
        defendingPokemon[0].hp -= activeDmg;

        drainPP(activeMove);
        displayDmg();

        if(defendingPokemon[0].hp < 0) {

          unloadDefender();

        } else if(activePokemon[0].hp < 0) {

          // Trigger loss
          lose();

        }

        function getDmg(pkmn1, pkmn2, move) {

          var hit = move.accuracy;

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

        function displayDmg() {

          var $hp = $('.rpg-hp');

          $('.rpg-active-wrapper').find('.rpg-active-alert').html(activePokemon[0].name+' used '+activeMove.name+'. It did '+activeDmg+' damage!');
          $('.rpg-defender-wrapper').find('.rpg-active-alert').html(defendingPokemon[0].name+' used '+defenderMove.name+'. It did '+defenderDmg+' damage!');

          $hp.eq(0).html(activePokemon[0].hp);
          $hp.eq(1).html(defendingPokemon[0].hp);

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

    }

    function unloadMovesEvents() {
      $('.rpg-active').find('.rpg-moves').off();
    }

    function lose() {
      unloadMovesEvents();
      $('.rpg-active-alert').html(activePokemon[0].name+' has fainted! You lose');
    }


    function getRandomIndex(arr) {
      return Math.floor(Math.random()*arr.length);
    }

  });

})(jQuery);
