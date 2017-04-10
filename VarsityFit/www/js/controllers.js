angular.module('starter.controllers', ['ionic'])

.filter('exerciseFilter', function(){
  return function(exercise, searchText){
    
    var filteredExercises = [];
    searchText = searchText || '' ;
    
    if (searchText.val == ''){
      return exercise;
    }
    searchText.val = searchText.val.toLowerCase();
    for (var obj in exercise){
      var an_exercise = exercise[obj];
      if ((an_exercise.name.toLowerCase().includes(searchText.val))){
        filteredExercises.push(an_exercise);
      }
    }
    return filteredExercises;
  };
})

.controller('LoginCtrl', function($rootScope, $scope, $state, $ionicPopup, LoginService, Backand, $http) {
    
    var login = this;
    var token;
    var appName = 'varsityfit';
    // var newPassword2;
    
    function signin() {
      LoginService.signin(login.email, login.password, appName)
        .then (function() {
          $rootScope.$broadcast("authorized");
          $state.go("tab.sets");
          
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

.controller('PreSurveyCtrl', function($rootScope, $scope, $state, $ionicPopup, CompletedModel, PreSurveysModel, Backand) {
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
    console.log("new", JSON.stringify(object), object.bodyWeightIn == null);
    if (object.date == 'undefined' || object.bodyWeightIn == 'null' 
    || object.sleepQuality.length == 0 || object.muscleSoreness.length == 0 
    || object.stressLevel.length == 0 || object.fatigueLevelPre.length == 0){
      
       $ionicPopup.alert({
          title: "Incomplete Survey",
          template: "Please fill in all parts of the survey before submitting."
        });
    }
    
    else {
     CompletedModel.create(object)
      .then(function (result) {
        $rootScope.presurvey = object;
        cancelCreate();
        getAll();
        console.log("metastuff", JSON.stringify(result.data));
        $rootScope.surveyID = result.data.__metadata.id;
        $state.go("tab.workoutdetails");
      }); 
    }
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

.controller('PostSurveyCtrl', function($rootScope, $scope, Backand, $state, $ionicPopup, PostSurveysModel, CompletedModel) {
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
    var completed_object = object;
    console.log("wut", JSON.stringify(completed_object), JSON.stringify(object));
    if (completed_object.bodyWeightOut == null || completed_object.practiceDifficulty == "" || completed_object.fatigueLevelPost == "" || completed_object.date == null){
       $ionicPopup.alert({
          title: "Incomplete Survey",
          template: "Please fill in all parts of the survey before submitting."
    });
    }
    else{
      completed_object.bodyWeightIn = $rootScope.presurvey.bodyWeightIn;
      completed_object.hoursSleep = $rootScope.presurvey.hoursSleep;
      completed_object.sleepQuality = $rootScope.presurvey.sleepQuality;
      completed_object.stressLevel = $rootScope.presurvey.stressLevel;
      completed_object.muscleSoreness = $rootScope.presurvey.muscleSoreness;
      completed_object.fatigueLevelPre = $rootScope.presurvey.fatigueLevelPre;
      completed_object.id = $rootScope.surveyID;
      CompletedModel.update(completed_object).then(function(result){
        $state.go("tab.workoutdetails");
    });
    }
   
    // PostSurveysModel.create(object)
    //   .then(function (result) {
    //     cancelCreate();
    //     getAll();
    // });
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

.controller('ExerciseCtrl', function($scope, $ionicHistory, $ionicPopup, $rootScope, ExerciseSurveyService, Backand, $state, WorkoutsExercisesModel, ExerciseModel, CompletedModel, formData, exerciseData) {
  var ec = this;
  var userDetail;
  
  if(!angular.isDefined($scope.searchText)){
    $scope.searchText = {};
    $scope.searchText.val='';
  } 
  
  if (!angular.isDefined($rootScope.finishedExercises)){
    $rootScope.finishedExercises = {};
  }
  ec.finishedExercises = {} ;
  //ec.exercises = [];
  
  
  $scope.workout = formData.getForm();
  var workout_id = $scope.workout.id;
  var exercise_ids = $scope.workout.exercises;
  var exercise_names = [];
  console.log("the length",exercise_ids.length)
  
  
  ec.links = [];
  $scope.exercise = {};
  $scope.exerciseInfo = exerciseData.getExercise();
  var exercise_id = $scope.exerciseInfo.id;
  
  $scope.numsets = $scope.exerciseInfo.sets;
  $scope.getNumber = function(num) {
    return new Array(num);   
  };
  $scope.weightArray = [];
  
  $scope.submitExercise = function(exercise) {
    exerciseData.updateExercise(exercise);
    console.log("Retrieving form from service EC");
    if (typeof $rootScope.surveyID == 'undefined'){
        $ionicPopup.alert({
          title: "Incomplete Survey",
          template: "Please complete the presurvey before submiting weights."
        });
      }
    else{
      $state.go('tab.exercisedetails'); 
    }
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
    ec.data = [];
    ExerciseModel.all()
      .then(function (result) {
        result.data.data.forEach(function(ex){
          ec.data.push(ex);
        });
        
        ec.data.forEach(function(ex){
          if (ex.url != null){
            ec.links.push(ex);
          }
        });
    });
  }

   $scope.getExerciseName = function() {
     return ExerciseModel.all()
       .then(function (result) {
         ec.exercise_names = result.data.data;
         for(var object in ec.exercise_names) {
           var current = ec.exercise_names[object];
           var exercise_id = current.id;
             for(var exercise in exercise_ids) {
              if(exercise_id == parseInt(exercise)) {
                exercise_names.push(ec.exercise_names[object]);
              }
            }
        }
        ec.exercises = exercise_names;
      });
  };
  
   function postSurvey(){
    console.log("post survey fun", JSON.stringify($rootScope.surveyID));
    ExerciseSurveyService.get($rootScope.surveyID).then(function (result){
      console.log("postSurvey", $scope.workout.exercises.split(',').length);
      if (result.data.totalRows < $scope.workout.exercises.split(',').length){
        $ionicPopup.alert({
          title: 'Unfinished Exercises',
          template: "Please complete all exercises and submit before doing the post-survey."
        });
      }
      
      else{
        $state.go('tab.postsurvey'); 
      }
    }, function(error) {
      console.log("postSurvey error", JSON.stringify(error));
    });
  }
  
  function finishedExercises(exercise){
    if ($rootScope.finishedExercises[exercise.id] == 0){
      return false;
    }
    else{
      return true;
    }
  }
  
  function create(object){
    console.log("create new weights", JSON.stringify(object));
    if (object.weight.length < $scope.exerciseInfo.sets){
        $ionicPopup.alert({
          title: 'Missing Weights',
          template: 'Please fill in a weight for each set'
        });
      }
    
    else if (filledWeights(object.weight) || false){
       $ionicPopup.alert({
            title: 'Missing Weights',
            template: 'Please make sure all the weights have been filled in. '
          });
    }
    
    else {
      var exercise_survey = {};
      exercise_survey.exercise = exercise_id;
      exercise_survey.completed_survey = parseInt($rootScope.surveyID);
      exercise_survey.weights = object.weight.toString();
      ExerciseSurveyService.update(exercise_survey);
      $rootScope.finishedExercises[exercise_id] = 0;
      console.log('ec.finishedExercises', JSON.stringify(ec.finishedExercises), JSON.stringify($rootScope.finishedExercises));
      //$rootScope.exerciseSurveys.push(exercise_id);
      $ionicHistory.goBack(); 
    }
  }
  
  function filledWeights(weights){
    var i;
    for (i = 0; i < weights.length; i++){
      if(weights[i] == null){
        return true;
      }
    }
  }
  
  function initCreateForm() {
    $scope.getUserDetails();
    console.log("WORKOUT " + workout_id, "EXERCISE " + exercise_id, "USER " + userDetail);
    ec.newObject = {workout: workout_id, user: userDetail, exercise: exercise_id, weight: []}; 
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
  ec.setEdited = setEdited;
  ec.isCurrent = isCurrent;
  ec.cancelEditing = cancelEditing;
  ec.cancelCreate = cancelCreate;
  ec.create = create;
  ec.postSurvey = postSurvey;
  ec.finishedExercises = finishedExercises;
  $rootScope.$on("authorized", function() {
    getAll();
  });
  
  initCreateForm();
  getAll();
  // $scope.getExerciseDetails();
  var namePromise = $scope.getExerciseName();
  namePromise.then(function (result){
    if ($rootScope.finishedExercises.length < 1){
      ec.exercises.forEach(function(exercise){
      $rootScope.finishedExercises[exercise.id] = 1;
      });
    }
    
  });
  console.log("finished", JSON.stringify($rootScope.finishedExercises));


})

.controller('WorkoutCtrl', function($scope, $rootScope, Backand, $state, CompletedModel, UsersSportsModel, SportsWorkoutsModel, WorkoutModel, WorkoutsExercisesModel, SetsModel, formData) {
  var wo = this;
  var userDetail;
  var sportDetail = [];
  var workoutDetail = [];
  //var exerciseDetail = [];
  var workout_names = [];
  //var exercise_names = [];
  var data2 = [];
  
  $scope.workout = {};
  if (typeof $rootScope.presurvey == undefined){
    $rootScope.presurvey = {};
  }
  
  $scope.submitForm = function(workout) {
    formData.updateForm(workout);
    console.log("Retrieving form from Workout service");
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
          $scope.getSetDetails();
          $scope.getWorkoutDetails();
          });
      });
  
  };
  
  $scope.getSetDetails = function(){
    console.log(JSON.stringify(SetsModel.getSet(sportDetail.sport)));
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
            var wm = WorkoutModel.getSet('1');
            wm.then(function(success){
            });
  
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
