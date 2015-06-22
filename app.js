var thisApp=angular.module('time_finder',[])
// .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
//   $stateProvider
//   .state('timezoneSelect',{
//     url:'/timezoneSelect',
//     templateUrl:'templates/selectTmpl.html',
//     controller:'tzSelectCtrl'
//   })
//   .state('referencePage',{
//     url:'/referencePage',
//     templateUrl:'templates/referenceTmpl.html'
//   });
//   $urlRouterProvider.otherwise('/timezoneSelect');
// }])
.factory("Data",['$http',function($http){
  var factory={};
  factory.getData=function(){return $http.get('http://localhost:8000/timezones.json')};
  return factory;
}]).controller("tzSelectCtrl",['$scope','Data','$interval',function($scope,Data,$interval){
  Data.getData().success(function(arritems){
    $scope.testObj=arritems;
    $scope.test="Your time: ";
  });
  $scope.timezoneMapSrc="http://www.satellitecitymaps.com/gfx/map_of_timezones.jpg";
  $scope.showMap=false;
  var nowDate=new Date();
  var currentOffset=nowDate.getTimezoneOffset();
  $scope.adjustHours=function(adj){
    var nowDate=new Date();
    var UTChours=nowDate.getUTCHours();
    nowDate.setHours(UTChours+adj);
    return nowDate;
  }
  $scope.offsetObj={};
  $scope.dateOutput=nowDate;
  $scope.addSecond=function(dateIn){
    var current=dateIn.getSeconds();
    dateIn.setSeconds(current+1);
  }
  $scope.setIt=function(){
    if ($scope.offsetObj.abbr!="COMP"){
      $scope.thisIsTheOffset=$scope.offsetObj.offset||0;
    }
    else {
      var d=new Date();
      var n=d.getTimezoneOffset();
      $scope.thisIsTheOffset=(-n/60);
    }
    $scope.dateOutput=$scope.adjustHours($scope.thisIsTheOffset);
    $scope.test=$scope.offsetObj.text;
  }
  $interval(function(){$scope.addSecond($scope.dateOutput)},1000);
}])
