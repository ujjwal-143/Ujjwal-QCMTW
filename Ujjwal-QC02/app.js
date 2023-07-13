// app.js
var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
        templateUrl: "signup.html",
        controller: "SignupController"
      }).when("/login", {
      templateUrl: "login.html",
      controller: "LoginController"
    }).when("/dashboard", {
      templateUrl: "dashboard.html",
      controller: "myController"
    })
    .otherwise({
      templateUrl: "signup.html",
      controller: "SignupController"
    });
});

//
// app.js (continued)
  
  app.controller("SignupController", function($scope, $location, $http) {
    $scope.signup = function() {
      // Fetch user data from JSON file or server-side endpoint
      $http.get("users.json").then(function(response) {
        var users = response.data;
            $http({
            method:'POST',
            url:("http://localhost:3000/users"),
            data:$scope.user
        }).then(function (response) {
          alert("Signup successful");
            console.log(response);
             $location.path("/login");
        },function(error) {
            console.log(error)
        })
            // Redirect to login page
          });
        }});
 
        app.controller("LoginController", function($scope, $location, $http) {
          $scope.login = function() {
            // Fetch user data from JSON file or server-side endpoint
            $http.get("users.json").then(function(response) {
              var users = response.data.users;
              console.log(users);
              var flag=true;
              for(let obj of users){
                  if(obj.email===$scope.user.email && obj.password===$scope.user.password){
                      
                      alert('Congratulation you login sucessfully');
                     // console.log(userData);
                      flag=false;
                      $location.path("/dashboard");
                  }
              }
              if(flag){
                  alert('Invalid Creditional');
              }
            });
          };
        });

  
// Define a controller
app.controller('myController', function($scope, $http) {
  $scope.countries = [];
  $scope.filteredCountries = [];
  $scope.selectedAlphabet = '';
  $scope.selectedRegion = '';
  $scope.searchQuery = '';
  $scope.searchType = 'country';
  $scope.alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  $scope.regions = [];

  // Fetch country data from the API
  $scope.fetchCountryData = function() {
    $http.get('https://restcountries.com/v3.1/all')
      .then(function(response) {
        $scope.countries = response.data;
        $scope.filteredCountries = $scope.countries;
        $scope.extractRegions();
      })
      .catch(function(error) {
        console.error('Error:', error);
      });
  };

  // Extract unique regions from countries
  $scope.extractRegions = function() {
    var regions = [];
    $scope.countries.forEach(function(country) {
      if (country.region && !regions.includes(country.region)) {
        regions.push(country.region);
      }
    });
    $scope.regions = regions;
  };

  // Filter countries based on selected alphabet, region, and search query
  $scope.filterCountries = function() {
    var filteredCountries = $scope.countries;

    if ($scope.selectedAlphabet !== '') {
      filteredCountries = filteredCountries.filter(function(country) {
        return country.name.common.charAt(0).toUpperCase() === $scope.selectedAlphabet;
      });
    }

    if ($scope.selectedRegion !== '') {
      filteredCountries = filteredCountries.filter(function(country) {
        return country.region === $scope.selectedRegion;
      });
    }

    if ($scope.searchQuery !== '') {
      var query = $scope.searchQuery.toLowerCase();
      filteredCountries = filteredCountries.filter(function(country) {
        if ($scope.searchType === 'country') {
          return country.name.common.toLowerCase().includes(query);
        } else if ($scope.searchType === 'capital') {
          return country.capital && country.capital[0].toLowerCase().includes(query);
        }
      });
    }

    $scope.filteredCountries = filteredCountries;
  };

  // Get language names for each country
  $scope.getLanguageNames = function(country) {
    if (country.languages) {
      return Object.values(country.languages).join(', ');
    }
    return '';
  };
//Get the currency of each country
  $scope.getCurrencyNames = function(country) {
    if (country.currencies) {
      return Object.keys(country.currencies)[0];
    }
    return '';
  };

  // Get capital for each country
  $scope.getCapital = function(country) {
    if (country.capital) {
      return country.capital[0];
    }
    return '';
  };

  // Initialize the country data
  $scope.fetchCountryData();
});