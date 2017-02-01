angular.module('starter.controllers', ['ionic'])

.controller('LoginCtrl', function($rootScope, $scope, $state, $ionicPopup, LoginService, Backand, $http) {
    
    var login = this;
    var token;
    var appName = 'varsityfit';
    // var newPassword2;
    
    function signin() {
      LoginService.signin(login.email, login.password, appName)
        .then (function() {
          $rootScope.$broadcast("authorized");
          $state.go("tab.workout");
          
        }, function(error){
          $ionicPopup.alert({
                title: 'Login failed!',
                template: "error " + JSON.stringify(error) + typeof(error)
            });
          console.log(error);
        });
    }

    login.signin = signin;
    
    function requestResetPassword() {
      LoginService.requestResetPassword(login.userName)
        .then(function() {
          token = Backand.getToken();
          $rootScope.$broadcast("successful");
          $state.go("resetPassword");
        }, function(error){
          console.log(error);
        });
    }
    login.requestResetPassword = requestResetPassword;
    
    function resetPassword() {
      LoginService.resetPassword(login.resetToken, login.newPassword)
        .then (function() {
          $rootScope.$broadcast("authorized");
          alert('Your password was successfully changed');
          $state.go("login");
        }, function(error) {
          console.log(error);
        });
    }
    
    login.resetPassword = resetPassword;

    function changePassword() {
      if (login.newPassword == login.newPassword2) {
        LoginService.changePassword(login.oldPassword, login.newPassword)
          .then(function() {
            $rootScope.$broadcast("successful");
            $state.go("tab.account");
          }, function(error) {
            console.log(error);
          });
      }
    }
    
    login.changePassword = changePassword;

}) 

.controller('PreSurveyCtrl', function($rootScope, $scope, $state, PreSurveysModel, Backand) {
  var vm = this;
  var userDetail;
  var data2 = [];

  $scope.getUserDetails = function() {
    var user = Backand.getUserDetails();
    if(user.$$state.value !== null){
      $scope.currentUser = user.$$state.value.userId;
      userDetail = $scope.currentUser;
    }
    else {
      $scope.currentUser = null;
    }
  };
  



  function getAll(){
    PreSurveysModel.all()
      .then(function (result) {
            vm.allData = result.data.data;
        //else {
          
        //}
      });
  }
  
  function getSelected(){
    PreSurveysModel.all()
      .then(function (result) {
        for (var object in vm.allData) {
            var current = vm.allData[object];
            if (userDetail == current.user) {
              data2.push(vm.allData[object]);
            }
            
        }
        vm.data = data2;

      });
  }
  
  
  function create(object){
    PreSurveysModel.create(object)
      .then(function (result) {
        cancelCreate();
        getAll();
        
        $state.go("tab.workoutdetails");
      });
  }
  function initCreateForm() {
    $scope.getUserDetails();
    vm.newObject = { bodyWeightIn: '', hoursSleep: '', sleepQuality: '', stressLevel: '', muscleSoreness: '', fatigueLevelPre: '', date: '', user: userDetail}; 
  }
  function setEdited(object) {
    vm.edited = angular.copy(object);
    vm.isEditing = true;
  }
  
  function isCurrent(id) {
    return vm.edited !== null && vm.edited.id === id;
  }
  
  function cancelEditing() {
    vm.edited = null;
    vm.isEditing = false;
  }
  
  function cancelCreate() {
    initCreateForm();
    vm.isCreating = false;
  }
  
  vm.objects = [];
  vm.edited = null;
  vm.isEditing = false;
  vm.isCreating = false;
  vm.getAll = getAll;
  vm.create = create;
  vm.setEdited = setEdited;
  vm.isCurrent = isCurrent;
  vm.cancelEditing = cancelEditing;
  vm.cancelCreate = cancelCreate;
  $rootScope.$on("authorized", function() {
    getAll();
    getSelected();
  });
  
  initCreateForm();
  getAll();
  getSelected();
  
})

.controller('PostSurveyCtrl', function($rootScope, $scope, Backand, $state, PostSurveysModel) {
  var vm = this;
  var userDetail;
  var data2 = [];
  

  $scope.getUserDetails = function() {
    var user = Backand.getUserDetails();
    if(user.$$state.value !== null){
      $scope.currentUser = user.$$state.value.userId;
      userDetail = $scope.currentUser;
    }
    else {
      $scope.currentUser = null;
    }
  };
  function getAll(){
    PostSurveysModel.all()
      .then(function (result) {
            vm.allData = result.data.data;
      });
  }
  
  function getSelected(){
    PostSurveysModel.all()
      .then(function (result) {
        for (var object in vm.allData) {
            var current = vm.allData[object];
            if (userDetail == current.user) {
              data2.push(vm.allData[object]);
            }
            
        }
        vm.data = data2;

      });
  }
  
  
  function create(object){
    PostSurveysModel.create(object)
      .then(function (result) {
        cancelCreate();
        getAll();
        
        $state.go("tab.workoutdetails");
      });
  }
  function initCreateForm() {
    $scope.getUserDetails();
    vm.newObject = { bodyWeightOut: '', practiceDifficulty: '', fatigueLevelPost: '', date: '', user: userDetail}; 
  }
  
  function setEdited(object) {
    vm.edited = angular.copy(object);
    vm.isEditing = true;
  }
  
  function isCurrent(id) {
    return vm.edited !== null && vm.edited.id === id;
  }
  
  function cancelEditing() {
    vm.edited = null;
    vm.isEditing = false;
  }
  
  function cancelCreate() {
    initCreateForm();
    vm.isCreating = false;
  }
  
  vm.objects = [];
  vm.edited = null;
  vm.isEditing = false;
  vm.isCreating = false;
  vm.getAll = getAll;
  vm.create = create;
  vm.setEdited = setEdited;
  vm.isCurrent = isCurrent;
  vm.cancelEditing = cancelEditing;
  vm.cancelCreate = cancelCreate;
  $rootScope.$on("authorized", function() {
    getAll();
    getSelected();
  });
  
  
  initCreateForm();
  getAll();
  getSelected();
})


.controller('ExerciseCtrl', function($scope, $rootScope, Backand, $state, WorkoutsExercisesModel, ExerciseModel, CompletedModel, formData, exerciseData) {
  var ec = this;
  var userDetail;
  
  
  
  $scope.workout = formData.getForm();
  var workout_id = $scope.workout.id;
  var exercise_ids = $scope.workout.exercises;
  var exercise_names = [];
  
  
  
  $scope.exercise = {};
  $scope.exerciseInfo = exerciseData.getExercise();
  console.log("exInfo", JSON.stringify($scope.exerciseInfo));
 // console.log($scope.exerciseInfo);
  var exercise_id = $scope.exerciseInfo.id;
  
  
  $scope.submitExercise = function(exercise) {
    exerciseData.updateExercise(exercise);
    console.log("Retrieving form from service EC", JSON.stringify(exerciseData.getExercise()));
    $state.go('tab.exercisedetails');
    
  };
  
  $scope.getUserDetails = function() {
    var user = Backand.getUserDetails();
    if(user.$$state.value !== null){
      $scope.currentUser = user.$$state.value.userId;
      userDetail = $scope.currentUser;
    }
    else {
      $scope.currentUser = null;
    }
  };

  function getAll(){
    ExerciseModel.all()
      .then(function (result) {
            ec.data = result.data.data;
            console.log("ec_all", JSON.sringify(ec.data));
            
      });
  }

   $scope.getExerciseName = function() {
     ExerciseModel.all()
       .then(function (result) {
         ec.exercise_names = result.data.data;
         console.log("ec", JSON.stringify(ec.exercise_names));
         for(var object in ec.exercise_names) {
           var current = ec.exercise_names[object];
           var exercise_id = current.id;
             for(var exercise in exercise_ids) {
              if(exercise_id == exercise_ids[exercise]) {
                exercise_names.push(ec.exercise_names[object]);
              }
            }
        }
        ec.exercises = exercise_names;
      });
  };



  function create(object){
    CompletedModel.create(object)
      .then(function (result) {
        cancelCreate();
        
        $state.go("tab.workoutdetails");
      });
  }
  
  function initCreateForm() {
    $scope.getUserDetails();
    console.log("WORKOUT " + workout_id);
    console.log("EXERCISE " + exercise_id);
    console.log("USER " + userDetail);
    ec.newObject = {workout: workout_id, user: userDetail, exercise: exercise_id, weight: ''}; 
  }
  
  function setEdited(object) {
    ec.edited = angular.copy(object);
    ec.isEditing = true;
  }
  
  function isCurrent(id) {
    return ec.edited !== null && ec.edited.id === id;
  }
  
  function cancelEditing() {
    ec.edited = null;
    ec.isEditing = false;
  }
  
  function cancelCreate() {
    initCreateForm();
    ec.isCreating = false;
  }
  
  ec.objects = [];
  ec.edited = null;
  ec.isEditing = false;
  ec.isCreating = false;
  ec.getAll = getAll;
  ec.create = create;
  ec.setEdited = setEdited;
  ec.isCurrent = isCurrent;
  ec.cancelEditing = cancelEditing;
  ec.cancelCreate = cancelCreate;
  $rootScope.$on("authorized", function() {
    getAll();
  });
  
  initCreateForm();
  console.log("finish init");
  getAll();
  // $scope.getExerciseDetails();
  $scope.getExerciseName();
    


})

.controller('WorkoutCtrl', function($scope, $rootScope, Backand, $state, UsersSportsModel, SportsWorkoutsModel, WorkoutModel, WorkoutsExercisesModel, formData) {
  var wo = this;
  var userDetail;
  var sportDetail = [];
  var workoutDetail = [];
  //var exerciseDetail = [];
  var workout_names = [];
  //var exercise_names = [];
  var data2 = [];


  $scope.workout = {};
  
  
  $scope.submitForm = function(workout) {
    formData.updateForm(workout);
    console.log("Retrieving form from service", JSON.stringify(formData.getForm()));
    $state.go('tab.workoutdetails');
    
  };




  $scope.getUserDetails = function() {
    var user = Backand.getUserDetails();
    if(user.$$state.value !== null){
      user.$$state.value;
      $scope.currentUser = user.$$state.value.userId;
      userDetail = $scope.currentUser;
    }
    else {
      $scope.currentUser = null;
    }
    var p = Promise.resolve(userDetail);
          p.then(function() {
          $scope.getSportDetails();
          });
  };
  
  
  
  $scope.getSportDetails = function(){
    UsersSportsModel.all()
      .then(function (result) {
            var sports_temp = result.data.data;
            for (var object in sports_temp) {
              var current = sports_temp[object];
              var user_sport = current.user;
              if(userDetail == user_sport) {
                sportDetail.push(sports_temp[object]);
              }
            }
          wo.sports = sportDetail;
          var p = Promise.resolve(wo.sports);
          p.then(function() {
          $scope.getWorkoutDetails();
          });
      });
  
  };
  
  $scope.getWorkoutDetails = function() {
    SportsWorkoutsModel.all()
      .then(function (result) {
          wo.workouts = result.data.data;
          for (var object in wo.workouts) {
            var current = wo.workouts[object];
            var sport_workout = current.sport;
            for (var sport in sportDetail) {
              if(sport_workout == sportDetail[sport].sport) {
                workoutDetail.push(wo.workouts[object]);
              } 
            }
          }
          var p = Promise.resolve(workoutDetail);
          p.then(function() {
          $scope.getWorkoutName();
          });
      });
  };
  
  $scope.getWorkoutName = function() {
      WorkoutModel.all()
        .then(function (result) {
          wo.workout_names = result.data.data;
          for(var object in wo.workout_names) {
            var current = wo.workout_names[object];
            var workout_id = current.id;
              for(var workout in workoutDetail) {
                if(workout_id == workoutDetail[workout].workout) {
                  workout_names.push(wo.workout_names[object]);
                }
              }
          }
          wo.workouts = workout_names;
        });
  };



  function getAll(){
    WorkoutModel.all()
      .then(function (result) {
            wo.allData = result.data.data;
      });
  }
  
  function getSelected(){
    WorkoutModel.all()
      .then(function (result) {
        for (var object in wo.allData) {
            var current = wo.allData[object];
            if (userDetail == current.user) {
              data2.push(wo.allData[object]);
            }
            
        }
        wo.data = data2;
      });
  }
  
  
  function create(object){
    WorkoutModel.create(object)
      .then(function (result) {
        cancelCreate();
        getAll();
        
      });
  }
  
  function back(){
    cancelCreate();
    $scope.go('tab.workout');
  }
  function initCreateForm() {
    wo.newObject = { name: ''}; 
  }
  function setEdited(object) {
    wo.edited = angular.copy(object);
    wo.isEditing = true;
  }
  
  function isCurrent(id) {
    return wo.edited !== null && wo.edited.id === id;
  }
  
  function cancelEditing() {
    wo.edited = null;
    wo.isEditing = false;
  }
  
  function cancelCreate() {
    initCreateForm();
    wo.isCreating = false;
  }
  
  wo.objects = [];
  wo.edited = null;
  wo.isEditing = false;
  wo.isCreating = false;
  wo.getAll = getAll;
  wo.create = create;
  wo.setEdited = setEdited;
  wo.isCurrent = isCurrent;
  wo.cancelEditing = cancelEditing;
  wo.cancelCreate = cancelCreate;
  $rootScope.$on("authorized", function() {
    getAll();
    getSelected();
  });
  
  initCreateForm();
  getAll();
  getSelected();
  $scope.getUserDetails();
  //$scope.getSportDetails();
  //$scope.getWorkoutDetails();
  //$scope.getWorkoutName();

})


.controller('ReferencesCtrl', function($scope) {
  //$state.go('referenceslinks');

})


.controller('ReferencesLinksCtrl', function($scope) {
  
})

.controller('AccountCtrl', function($scope, Backand, $state) {

  var vm = this;
  
  function userDetails() {
    var user = Backand.getUserDetails();
    if(user.$$state.value !== null){
      $scope.currentUser = user.$$state.value.userId;
      vm.firstName = user.$$state.value.firstName;
      vm.lastName = user.$$state.value.lastName;
      vm.username = user.$$state.value.username;
      vm.fullName = user.$$state.value.fullName;
    }
    else {
      $scope.currentUser = null;
    }    
  }
  
  userDetails();
  
  


  
  $scope.signout = function () {
    return Backand.signout()
      .then(function (response) {
        userDetails();
        $state.go('login');
        return response;

    });
  };

});
