// VarsityFit App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'varsityfit' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'varsityfit.services' is found in services.js
angular.module('starter', ['ionic', 'backand', 'starter.controllers', 'starter.services'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})


.config(function(BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

 
  var appName = 'varsityfit';

  BackandProvider.setAppName('varsityfit'); 
/*
  BackandProvider.setSignUpToken('4ce88904-75c5-412c-8365-df97d9e18a8f'); //token that enable sign up. see http://docs.backand.com/en/latest/apidocs/security/index.html#sign-up
  BackandProvider.setAnonymousToken('85e64ce8-9e56-4543-b071-961ae65a4f28'); // token is for anonymous login. see http://docs.backand.com/en/latest/apidocs/security/index.html#anonymous-access
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
    function httpInterceptor($q, $log, $cookieStore) {
       return {
         request: function(config) {
           config.headers['Authorization'] = 
             $cookieStore.get('backand_token');
           return config;
         }
       };
    }

  $httpProvider.interceptors.push(httpInterceptor);
*/
  $stateProvider
  
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl as login'
  })
  

  .state('requestResetPassword', {
    url: '/requestResetPassword',
    templateUrl: 'templates/requestResetPassword.html',
    controller: 'LoginCtrl as login'
  })
  
  .state('resetPassword', {
    url: '/resetPassword',
    templateUrl: 'templates/resetPassword.html',
    controller: 'LoginCtrl as login'
  })
  
  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.presurvey', {
    url: '/presurvey',
    views: {
      'tab-workout': {
        templateUrl: 'templates/tab-presurvey.html',
        controller: 'PreSurveyCtrl as vm'
      }
    }
  })
  
  .state('tab.postsurvey', {
    url: '/postsurvey',
    views: {
      'tab-workout': {
        templateUrl: 'templates/tab-postsurvey.html',
        controller: 'PostSurveyCtrl as vm'
      }
    }
  })

  .state('tab.references', {
      url: '/references',
      views: {
        'tab-references': {
          templateUrl: 'templates/tab-references.html',
          controller: 'ReferencesCtrl'
        }
      }
    })
    
  .state('tab.referenceslinks', {
      url: '/referenceslinks',
      views: {
        'tab-references': {
          templateUrl: 'templates/tab-referenceslinks.html',
          controller: 'ReferencesCtrl'
        }
      }
    })
    
    .state('tab.workout', {
      url: '/workout',
      views: {
        'tab-workout': {
          templateUrl: 'templates/tab-workout.html',
          controller: 'WorkoutCtrl as wo'
        }
      }
    })
    
    .state('tab.workoutdetails', {
      url: '/workoutdetails',
      views: {
        'tab-workout': {
          templateUrl: 'templates/tab-workoutdetails.html',
          controller: 'ExerciseCtrl as ec'
        }
      }
    })
    
    .state('tab.exercisedetails', {
      url: '/exercisedetails',
      views: {
        'tab-workout': {
          templateUrl: 'templates/tab-exercisedetails.html',
          controller: 'ExerciseCtrl as ec'
        }
      }
    })    

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl as vm'
      }
    }
  })  
  .state('tab.accountdetails', {
    url: '/accountdetails',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-accountdetails.html',
        controller: 'AccountCtrl as vm'
      }
    }
  })
  
    .state('tab.sets', {
    url: '/sets',
    views: {
      'tab-sets': {
        templateUrl: 'templates/tab-sets.html',
        controller: 'WorkoutCtrl as wo'
      }
    }
  })
  
  .state('tab.surveys', {
    url: '/surveys', 
    views: {
      'tab-account': {
          templateUrl: 'templates/tab-surveys.html',
          controller: 'PreSurveyCtrl'  
      }
    }
  })
  
  .state('tab.changepassword', {
    url: '/changepassword', 
    views: {
      'tab-account': {
          templateUrl: 'templates/tab-changepassword.html',
          controller: 'LoginCtrl as login'  
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab/login');
  $urlRouterProvider.otherwise('/login');

  $httpProvider.interceptors.push('APIInterceptor');
    
});

/*
  .run(function ($rootScope, $state, LoginService, Backand) {

        function unauthorized() {
            console.log("user is unauthorized, sending to login");
            $state.go('login');
        }

      //  function signout() {
        //    LoginService.signout();
        //}

        $rootScope.$on('unauthorized', function () {
            unauthorized();
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.name == 'login') {
                signout();
            }
            else if (toState.name != 'login' && Backand.getToken() === undefined) {
                unauthorized();
            }
        });

    })
*/