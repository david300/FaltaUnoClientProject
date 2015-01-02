'use strict';

angular.module('starter.controllers', ['ionic'])

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

})

.controller('CrearFaltaUnoCtrl', function($scope, $ionicModal){
    if($scope.falta == undefined){
        $scope.falta = {};
    }
    
    $scope.showForm = true;
    
    $scope.shirtSizes = [
    { text: 'Large', value: 'L' },
    { text: 'Medium', value: 'M' },
    { text: 'Small', value: 'S' }
    ];

    $scope.falta = {};
    $scope.submit = function() {
        
        if(!$scope.falta.firstname) {
          alert('Info required');
          return;
        }
        
        $scope.showForm = false;
        $scope.faltas.push($scope.falta);
    };
    
    /*Mapa*/
    
    
    $scope.showMap = function() {
        
        
        $ionicModal.fromTemplateUrl('templates/map/map-modal.html', function(modal) {
            $scope.settingsModal = modal;
            modal.acceptMap = function(){
                //console.log("Funciona");
                
                //var markers = $('#g-map').gmap('get','markers');
                //console.log(markers);
            }
            $scope.markers = [];
            $scope.settingsModal.show();
            
            function crearMapa(posicion){
               var mapOptions = {
                        zoom: 15,
                        center: posicion,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                
                var infoWindow = new google.maps.InfoWindow();
                
                $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
                
                google.maps.event.addListener($scope.map, 'click', function(event) {
                    createMarker(event.latLng);
                });
                
                var createMarker = function (info){
                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: info,
                        icon: 'img/icons/markers/pin1.png'
                    });
                    //marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

                    google.maps.event.addListener(marker, 'click', function(){
                        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                        infoWindow.open($scope.map, marker);
                    });
                    
                    for(var iM = 0; iM < $scope.markers.length; iM ++){
                        $scope.markers[iM].setMap(null);
                    }
                    
                    $scope.markers = [];
                    $scope.markers.push(marker);
                    
                    var geocoder = new google.maps.Geocoder();
                    
                    geocoder.geocode({
                        "latLng": info
                    }, 
                    function (results, status) {
                        console.log(results, status);
                        if (status == google.maps.GeocoderStatus.OK) {
                            console.log(results);
                            var lat = results[0].geometry.location.lat(),
                                lng = results[0].geometry.location.lng(),
                                placeName = results[0].formatted_address,
                                latlng = new google.maps.LatLng(lat, lng);
                            
                            $scope.falta.direccion = placeName;
                            $scope.falta.lat = lat;
                            $scope.falta.lng = lng;
                            
                            $scope.showAddress = true;
                        }
                    });
                };
            }
            
            $scope.openInfoWindow = function(e, selectedMarker){
                e.preventDefault();
                google.maps.event.trigger(selectedMarker, 'click');
            }
            
            navigator.geolocation.getCurrentPosition(function(pos) {
                crearMapa(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));    
            });
        });
    };
})

.controller('FindInMapCtrl', function($scope){
    console.log("paso por acá");
    
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
              
                $ionicLoading.hide();
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



