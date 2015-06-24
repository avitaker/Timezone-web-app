var thisApp=angular.module('time_finder',[])
.factory("Data",['$http',function($http){
  var factory={};
  factory.getData=function(){return $http.get('http://localhost:8000/timezones.json')};
  return factory;
}]).controller("tzSelectCtrl",['$scope','Data','$interval',function($scope,Data,$interval){
  //Prepare the data here and set initial display
  Data.getData().success(function(arritems){
    $scope.testObj=arritems;
    $scope.timeCenterInfo="Your time";
    $scope.inRangeTimezones=$scope.testObj;
    var initialDate=new Date();
    $scope.timezoneName="Time difference from UTC is "+(initialDate.getTimezoneOffset()/(-60)) + " hours";
  });

  // Narrow down the area if desired
  var zoneObjDef=function(low,high,area){
    this.low=low;
    this.high=high;
    this.rangeString=low + " to " + high;
    this.area=area;
  }
  $scope.zones=[new zoneObjDef(-12,12,"All timezones"),
    new zoneObjDef(-12,-10,"IDL to Western Pacific Ocean, Hawaii"),
    new zoneObjDef(-10,-6,"North America (less East Coast), Central America"),
    new zoneObjDef(-6,-3,"North America East Coast, South America, Greenland"),
    new zoneObjDef(-3,0,"Eastern Atlantic Ocean, UK, Northwest Africa"),
    new zoneObjDef(0,3,"Western and Central Europe (less UK), West Russia, Central and East Africa, Middle East"),
    new zoneObjDef(3,7,"Eastern Europe, West Central Russia, Middle East, Southeast Asian subcontinent"),
    new zoneObjDef(7,9,"Central Russia, China and East Asia, Indian Ocean to East Pacific Ocean, West Australia"),
    new zoneObjDef(9,12,"Eastern Russia, Central and Eastern Australia, East Pacific Ocean to IDL")
  ];
  $scope.selectedRangeObj={};

  //Filter timezone options according to selected region
  $scope.setSelect=function(){
    $scope.inRangeTimezones=[];
    if (!$scope.selectedRangeObj.area){
      $scope.inRangeTimezones=$scope.testObj;
    }
    else {
      for (var i=0;i<$scope.testObj.length;i++){
        if ($scope.testObj[i].isdst===true){
          $scope.testObj[i].trueOffset=$scope.testObj[i].offset-1;
        }
        else {$scope.testObj[i].trueOffset=$scope.testObj[i].offset;}
        if ($scope.testObj[i].trueOffset>$scope.selectedRangeObj.low && $scope.testObj[i].trueOffset<=$scope.selectedRangeObj.high){
          $scope.inRangeTimezones.push($scope.testObj[i]);
        }
        else {continue};
      }
    }
  }

  //Reference map
  $scope.timezoneMapSrc="http://www.satellitecitymaps.com/gfx/map_of_timezones.jpg";
  $scope.showMap=false;
  var nowDate=new Date();

  //Function to change time according to selected timezone
  $scope.adjustHours=function(adj){
    var nowDate=new Date();
    var UTCHours=nowDate.getUTCHours();
    var UTCMinutes=nowDate.getUTCMinutes();
    var wrongDate=nowDate.getDate();
    var correctDate=nowDate.setDate(wrongDate+1);
    nowDate.setHours(UTCHours);
    nowDate.setMinutes(UTCMinutes+(adj*60));
    return nowDate;
  }
  $scope.dateOutput=nowDate;

  //Set displayed time according to current conditions
  $scope.setIt=function(){
    if (!$scope.offsetObj){
      var d=new Date();
      var n=d.getTimezoneOffset();
      $scope.thisIsTheOffset=(-n/60);
    }
    else if ($scope.offsetObj.abbr!="COMP"){
      $scope.thisIsTheOffset=$scope.offsetObj.offset||0;
    }
    else {
      var d=new Date();
      var n=d.getTimezoneOffset();
      $scope.thisIsTheOffset=(-n/60);
    }
    $scope.dateOutput=$scope.adjustHours($scope.thisIsTheOffset);
  }

  //Change time when a new option is selected
  $scope.changeIt=function(){
    $scope.setIt();
    if (!$scope.offsetObj){
      $scope.timeCenterInfo="Your time"
    }
    else {
      $scope.timeCenterInfo=$scope.offsetObj.text;
      $scope.timezoneName=$scope.offsetObj.value;
    }
  }

  //Update clock display every second
  $interval(function(){$scope.setIt()},1000);
}])
