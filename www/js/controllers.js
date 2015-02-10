'use strict';
var allApp = angular.module('starter.controllers', ['ionic', 'angular-datepicker']);

allApp
.controller('DashCtrl', function($scope, $state, $ionicLoading, $ionicModal) {

    $scope.goToMap = function(){
        $state.go("tab.dash-map");
    };
    
    $scope.createFaltaUno = function(){
        $state.go("tab.dash-new-faltaUno");
    }
    
    $scope.show = function() {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };
    
    $scope.hide = function(){
        $ionicLoading.hide();
    };
    
    $scope.date = new Date();
    $scope.time = new Date();
    
    $scope.options = {
        format: 'yyyy-mm-dd', // ISO formatted date
        onClose: function(e) {
            // do something when the picker closes   
        }
    }

})

.directive('googlePlaces', function(){
    return {
        restrict:'E',
        replace:true,
        // transclude:true,
        scope: {location:'='},
        template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level"/>',
        link: function($scope, elm, attrs){
            var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                $scope.$apply();
            });
        }
    }
})

.directive('map', function ($ionicLoading) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div></div>',
        link: function ($scope, $element, $attrs) {
          $ionicLoading.show({
              template: 'Cargando Mapa...'
          });
          function CreateMap(centro, withFinder) {
                var map = new google.maps.Map($element[0], {
                    //center: centro,
                    zoom: 17,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    //panControl: false,
                    streetViewControl: false,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_CENTER
                    }
                });
                
                var _markers = [];
              
                google.maps.event.addListener(map, 'click', function(event) {
                    addMarker(event.latLng);
                });

                function addMarker(location) {
                    var _marker = 
                        new google.maps.Marker({
                            position: location,
                            map: map,
                            draggable: true,
                            visible: true,
                            icon: 'img/icons/markers/pin3.png'
                        });
                    
                    for(var iM = 0; iM < _markers.length; iM ++){
                        _markers[iM].setMap(null);
                    }
                    
                    _markers = [];
                    
                    _markers.push(_marker);
                    
                    google.maps.event.addListener(_marker, 'click', function(event) {
                        _marker.setMap(null);
                    });
                }
  
              
                var styledMapType = new google.maps.StyledMapType([
                {
                    featureType: 'all',
                    elementType: 'all',
                    stylers: [
                    { saturation: -99 }
                  ]
                }], {
                    map: map,
                    name: 'Night Map'
                });
              
                map.setCenter(centro);
                var myLocation = new google.maps.Marker({
                    position: centro,
                    map: map,
                    title: "My Location",
                    icon: 'img/icons/markers/pin1.png'
                });
              
                if(withFinder == "true"){
                
                    var eAutoComplete = 
                        $('<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level"/>');

                    var findMe = 
                        $('<button class="button locate-custom icon ion-android-locate"></button>')
                            .click(function(){
                                navigator.geolocation.getCurrentPosition(function(pos) {
                                    setCenterOfMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                                });
                            });

                    $(eAutoComplete).insertBefore($element);
                    $(findMe).insertAfter(eAutoComplete);

                    $(eAutoComplete)
                        .css({
                            float: 'left',
                            width: ($($element).width() - $(findMe).width() - 30)
                        });
                    
                    

                    var autocomplete = new google.maps.places.Autocomplete($(eAutoComplete)[0], {});
                    google.maps.event.addListener(autocomplete, 'place_changed', function() {
                        var place = autocomplete.getPlace();
                        setCenterOfMap(place.geometry.location);
                    });
                }
              
                function setCenterOfMap(_center){
                    map.setCenter(_center);
                    var myLocation = new google.maps.Marker({
                        position: _center,
                        map: map,
                        title: "My Location",
                        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                    });
                }
              
                //$ionicLoading.hide();
            }

            navigator.geolocation.getCurrentPosition(function(pos) {
                CreateMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude), $attrs.mapWithFinder);    
            });
        }
    }
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1
   };
}



//Data
var cities = [
    {
        city : 'Toronto',
        desc : 'This is the best city in the world!',
        lat : 43.7000,
        long : -79.4000
    },
    {
        city : 'New York',
        desc : 'This city is aiiiiite!',
        lat : 40.6700,
        long : -73.9400
    },
    {
        city : 'Chicago',
        desc : 'This is the second best city in the world!',
        lat : 41.8819,
        long : -87.6278
    },
    {
        city : 'Los Angeles',
        desc : 'This city is live!',
        lat : 34.0500,
        long : -118.2500
    },
    {
        city : 'Las Vegas',
        desc : 'Sin City...\'nuff said!',
        lat : 36.0800,
        long : -115.1522
    }
];



