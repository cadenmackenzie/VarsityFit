angular.module('starter.services', [])

    .service('APIInterceptor', function ($rootScope, $q) {
        var service = this;

        service.responseError = function (response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return $q.reject(response);
        };
    })

    .service('PreSurveysModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'presurvey/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function () {
            return $http.get(getUrl());
        };

        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };

        service.create = function (object) {
            return $http.post(getUrl(), object);
        };
    })
    
    .service('PostSurveysModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'postsurvey/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function () {
            return $http.get(getUrl());
        };

        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };

        service.create = function (object) {
            return $http.post(getUrl(), object);
        };
    })
    
    .service('WorkoutModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'workouts/';
            console.log("Backand.get", JSON.stringify(Backand.getApiUrl()));

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function () {
            return $http.get(getUrl());
        };

        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };

        service.create = function (object) {
            return $http.post(getUrl(), object);
        };
        
        service.getSet = function (id){
            return $http ({
              method: 'GET',
              url: Backand.getApiUrl() + baseUrl + objectName,
              params: {
                  pageSize: '20',
                  pageNumber: '1',
                  filter: [{"fieldName": "set", "operator": "in", "value": id}]
              }
            });
        };
    })

    .service('UsersSportsModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'users_sports/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function () {
            return $http.get(getUrl());
        };

        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };

        service.create = function (object) {
            return $http.post(getUrl(), object);
        };
    })  

    .service('SportsWorkoutsModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'sports_workouts/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function () {
            return $http.get(getUrl());
        };

        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };

        service.create = function (object) {
            return $http.post(getUrl(), object);
        };
    })
    
    .service('SetsModel', function ($http, Backand) {
    var service = this,
        baseUrl = '/1/objects/',
        objectName = 'sets/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }
    
        function getUrlForId(id) {
            return getUrl() + id;
        }
    
        service.all = function () {
            return $http.get(getUrl());
        };
    
        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };
    
        service.create = function (object) {
            return $http.post(getUrl(), object);
        };
        
         service.getSet = function (id){
            return $http ({
              method: 'GET',
              url: Backand.getApiUrl() + baseUrl + objectName,
              params: {
                  pageSize: '20',
                  pageNumber: '1',
                  filter: [{"fieldName": "sport", "operator": "in", "value": id}]
              }
            });
        };
    })

    .service('WorkoutsExercisesModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'workouts_exercises/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function () {
            return $http.get(getUrl());
        };

        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };

        service.create = function (object) {
            return $http.post(getUrl(), object);
        };
    })
    
    .service('WorkoutSetModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'se/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function () {
            return $http.get(getUrl());
        };

        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };

        service.create = function (object) {
            return $http.post(getUrl(), object);
        };
        
    })    

    .service('ExerciseModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'exercises/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function () {
            return $http.get(getUrl(), {
                params: {
                    pageSize:'200'
                }
            });
        };
        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };

        service.create = function (object) {
            return $http.post(getUrl(), object);
        };
    })
    
    .service('CompletedModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'completed/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function () {
            return $http.get(getUrl());
        };

        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };

        service.create = function (object) {
            return $http.post(getUrl(), object);
        };
    })
    
    .service('formData', function() {
        
        return {
            form: {},
            getForm: function() {
                return this.form;
            },
            updateForm: function(form) {
                this.form = form;
            }
        };
    })
    
    .service('exerciseData', function() {
        
        return {
            exercise: {},
            getExercise: function() {
                return this.exercise;
            },
            updateExercise: function(exercise) {
                this.exercise = exercise;
            }
        };
    })

    .service('LoginService', function (Backand, $http, $ionicPopup) {
        var service = this;
        service.signin = function (email, password, appName) {
            
           Backand.setAppName(appName);
           return Backand.signin(email, password, appName);
            
        };

        service.signout = function () {
            return Backand.signOut();
        };
        
      service.resetPassword = function (resetToken, newPassword) {
          return $http({
              method: 'POST',
              url : Backand.getApiUrl() + '/1/user/resetPassword',
              data: 
                {
                  "resetToken": resetToken,
                  "newPassword": newPassword
                }
          });
      };
            service.requestResetPassword = function (userName) {
             return $http({
                  method: 'POST',
                  url : Backand.getApiUrl() + '/1/user/requestResetPassword',
                  data: 
                    {
                      "appName": 'varsityfit',
                      "username": userName
                    }
            });
        };        
        
        
    service.changePassword = function (oldPassword, newPassword) {
          return $http({
              method: 'POST',
              url : Backand.getApiUrl() + '/1/user/changePassword',
              data: 
                {
                  "oldPassword": oldPassword,
                  "newPassword": newPassword
                }
          })
      };
    })   

    .service('AccountService', function(Backand){
        var service = this;

        service.signout = function() {
            return Backand.signout();
        };
        
        

    });
    
