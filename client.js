angular.module('acmeApp', [])
  .controller('acmeController', function($http, $scope, $interval, $timeout) {
    //timer for get requests
    $scope.clock = 0;

    //changes colors based on current clock
    $scope.$watch('clock', function() {
      if($scope.clock <= 2) {
        $('.seconds').css('color', 'green');
      } else if($scope.clock >= 3 && $scope.clock <= 4) {
        $('.seconds').css('color', 'orange');
      } else if($scope.clock >= 5) {
        $('.seconds').css('color', 'red');
      }
    });
    
    //used later on for $interval
    $scope.timer;
    
    //displayed quotes
    $scope.fortune = [""];
    
    //hard-coded quotes in case of get request failure
    $scope.preselectedQuotes = [
      "Your eyes can deceive you; don't trust them.",
      "Fear is the path to the Dark Side. Fear leads to anger, anger leads to hate, hate leads to suffering.",
      "Luminous beings are we. Not this crude matter.",
      "Adventure. Excitement. A Jedi craves not these things.",
      "There is no emotion, there is peace..."
    ];

    //once button is clicked, remove both button and ACME title
    $scope.clickable = true;

    //sets link on bottom right to be clickable
    $scope.truthClickable = false;

    //DOM element that is removed and added for animation purposes
    $scope.loading;

    //quotes shouldn't show until animation is done
    $scope.showQuote = false;

    //returns an integer between @min and @max (all inclusive)
    $scope.randomGenerator = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    //get request
    $scope.fetchData = function() {
      $scope.animation();

      //set button clickability to false
      $scope.clickable = false;

      //reset quotes and clock
      $scope.fortune = [];
      $scope.clock = 1;

      //start timer
      $scope.timer = $interval(function() {
        $scope.clock++;
      }, 1000);

      $http.get('http://api.acme.international/fortune').
        //if the get request is a success
        success(function(data) {
          if(data.fortune) {
            //put quotes on display
            data.fortune.forEach(function(element) {
              $scope.fortune.push(element);
            });

            //stop timer
            $interval.cancel($scope.timer);
          } else {
            //in case corrupted data is returned
            $scope.getQuotes();
            $interval.cancel($scope.timer);
          }
        }).
        //if the get request fails
        error(function() {
          //set quotes in case of failed get request
          $scope.getQuotes();

          //stop timer
          $interval.cancel($scope.timer);
        });
    };

    $scope.getQuotes = function() {
      //remove currently displayed quotes
      $scope.fortune = [];
      
      //insert pseudorandom hard-coded quote
      var randomIndex = $scope.randomGenerator(0, $scope.preselectedQuotes.length - 1);
      $scope.fortune.push($scope.preselectedQuotes[randomIndex]);
    };

    $scope.animation = function() {
      //create a span tag with a class called "loading"
      $('body').append('<span class="loading"></span>');
      
      //enable animation for "loading"
      $('.loading').css({
        /*
          for google chrome, safari, and opera
          animates for 4 seconds and then stops
        */
        '-webkit-animation': 'expand 4s',
        '-webkit-animation-fill-mode': 'forwards',
        '-webkit-animation-timing-function': 'ease-in',
        
        /*
          for firefox
          animates for 4 seconds and then stops
        */
        '-moz-animation': 'expand 4s',
        '-moz-animation-fill-mode': 'forwards',
        '-moz-transition-timing-function': 'ease-in'
      });

      $timeout(function() {
        //reveals bottom right link
        $scope.showQuote = true;
        $scope.truthClickable = true;

        //quotation fade-in animation
        $('.quote').css({
          //safari, chrome, and opera
          '-webkit-animation': 'fade 2s',
          '-webkit-animation-fill-mode': 'forwards', 
          '-webkit-animation-timing-function': 'ease-in',

          //firefox
          '-moz-animation': 'fade 2s',
          '-moz-animation-fill-mode': 'forwards',
          '-moz-animation-timing-function': 'ease-in'
        });
      }, 4000);
    };

    $scope.reset = function() {

      //resert quotes and timer
      $scope.fortune = [];
      $scope.clock = 0;

      //renders bottom right link unclickable
      $scope.truthClickable = false;

      //reset button to be clickable again
      $scope.clickable = true;

      $scope.loading = $('.loading').remove();

      //once reset occurs, quote are removed
      $scope.showQuote = false;
    };
  });