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


    .service('SurveysModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'surveys/';

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

        service.update = function (id, object) {
            return $http.put(getUrlForId(id), object);
        };

        service.delete = function (id) {
            return $http.delete(getUrlForId(id));
        };
    })

    .service('LoginService', function (Backand) {
        var service = this;
        service.signin = function (email, password, appName) {
            //call Backand for sign in
            console.log("check 4");
            Backand.setAppName(appName);
            console.log("check 5");
            return Backand.signin(email, password);
        };

        service.signout = function () {
            return Backand.signout();
        };
    });