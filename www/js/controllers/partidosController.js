allApp.controller('CrearFaltaUnoCtrl', function($scope, $ionicModal){
    
    if($scope.partido == undefined){
        $scope.partido = {
            soyYo: true
        };
    }
    
    $scope.cuantosFaltan = [];
    for(var cf = 1; cf <= 12; cf++) {
        $scope.cuantosFaltan.push(cf);
    }

    
    $scope.showForm = true;
    
    $scope.partido = {
        soyYo: true,
    };
    
    $scope.submit = function() {
        
        if(!$scope.partido.firstname) {
          alert('Info required');
          return;
        }
        
        $scope.showForm = false;
        $scope.partidos.push($scope.partido);
    };
        
    $scope.onChangeAdress = function(){
        if($scope.partido.ubicacion.direccion == undefined || $scope.partido.ubicacion.direccion == "") {
            delete $scope.partido.ubicacion;
        }
    };
    
    $scope.showMap = function() {
        
        $ionicModal.fromTemplateUrl('templates/map/map-modal.html', function(modal) {
            $scope.settingsModal = modal;
            
            $scope.tempAddress = {};
            
            modal.acceptMap = function() {
                $scope.partido.ubicacion = {
                    direccion: $scope.tempAddress.direccion,
                    lat: $scope.tempAddress.lat,
                    lng: $scope.tempAddress.lng
                }
                
                $scope.tempAddress = {};
                
                modal.remove();
            }
            
            $scope.markers = [];
            $scope.settingsModal.show();
            
            $scope.openInfoWindow = function(e, selectedMarker){
                e.preventDefault();
                google.maps.event.trigger(selectedMarker, 'click');
            }
            
            navigator.geolocation.getCurrentPosition(function(pos) {
                mapController.createMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude), $scope);    
            });
        });
    };
})
.directive('datePicker', function(){
    return {
        link: function(scope, element, attrs){
            $(element).pickadate();
        }
    }
});


var mapController = {

    createMap: function(posicion, $scope) {
                    var mapOptions = {
                        zoom: 15,
                        center: posicion,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                
                    var infoWindow = new google.maps.InfoWindow();

                    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

                    google.maps.event.addListener($scope.map, 'click', function(event) {
                        reloadMarker(mapController.createMarker(event.latLng, $scope));
                    });

                    function reloadMarker(marker) {
                        //Borro los markers
                        for(var iM = 0; iM < $scope.markers.length; iM ++){
                            $scope.markers[iM].setMap(null);
                        }

                        //Inicializo los markers para que sólo haya uno
                        $scope.markers = [];
                        $scope.markers.push(marker);
                    }

                    if($scope.partido.ubicacion != undefined &&
                       $scope.partido.ubicacion.lat != undefined && 
                       $scope.partido.ubicacion.lng != undefined){
                        var pos = new google.maps.LatLng($scope.partido.ubicacion.lat, $scope.partido.ubicacion.lng);
                        reloadMarker(mapController.createMarker(posicion, $scope));
                    }
                },
    
    createMarker: function (posicion, $scope) {
                    
                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: posicion,
                        icon: 'img/icons/markers/pin1.png'
                    });
                    
                    google.maps.event.addListener(marker, 'click', function(){
                        //Mostraría info si presionamos
                        //infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                        //infoWindow.open($scope.map, marker);
                    });
                    
                    //Centro el mapa en la posición
                    $scope.map.setCenter(posicion);
                    
                    mapController.getAddress(posicion, $scope);
                    
                    return marker;
                },
    
    getAddress: function(posicion, $scope) {
                    //Obtengo la dirección en formato address
                    var geocoder = new google.maps.Geocoder();                    
                    geocoder.geocode({
                        "latLng": posicion
                    }, 
                    function (results, status) {
                        console.log(results, status);
                        if (status == google.maps.GeocoderStatus.OK) {
                            //console.log(results);
                            var lat = results[0].geometry.location.lat(),
                                lng = results[0].geometry.location.lng(),
                                placeName = results[0].formatted_address,
                                latlng = new google.maps.LatLng(lat, lng);

                            $scope.tempAddress.direccion = placeName;
                            $scope.tempAddress.lat = lat;
                            $scope.tempAddress.lng = lng;
                        }
                    });
                }
};