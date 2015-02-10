allApp.controller('FindInMapCtrl', function($scope, $ionicModal, $ionicPopup, $ionicLoading, Partidos){
    function InitMap(){
        $ionicLoading.show({
            template: 'Cargando Mapa'
        });
        navigator.geolocation.getCurrentPosition(function(pos) {
            mapFinderController.createMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude), $scope);
            $ionicLoading.hide();
            $ionicLoading.show({
                template: 'Cargando Partidos'
            });
            Partidos.traerTodos()
            .success(function(data, status,headers, config){
                $ionicLoading.hide();
                var counter = 0;
                _.each(data, function(partido){
                    var latlng = new google.maps.LatLng(partido.ubicacion.lat, partido.ubicacion.lng);
                    mapFinderController.createMarker(latlng, $scope);
                    counter++;
                });
                console.log("Contador: " + counter);
            })
            .error(function(data, status,headers, config){
                $ionicLoading.hide();
                console.log("Error", data);
            });
            
        });
    }
    
    //Carga los partidos creados
    InitMap();
    
});

var mapFinderController = {

    createMap: function(posicion, $scope) {
                    var mapOptions = {
                        zoom: 15,
                        center: posicion,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                
                    var infoWindow = new google.maps.InfoWindow();

                    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

//                    google.maps.event.addListener($scope.map, 'click', function(event) {
//                        reloadMarker(mapFinderController.createMarker(event.latLng, $scope));
//                    });

                    function reloadMarker(marker) {
                        //Borro los markers
                        for(var iM = 0; iM < $scope.markers.length; iM ++){
                            $scope.markers[iM].setMap(null);
                        }

                        //Inicializo los markers para que sólo haya uno
                        $scope.markers = [];
                        $scope.markers.push(marker);
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
                    //$scope.map.setCenter(posicion);
                    
                    //mapFinderController.getAddress(posicion, $scope);
                    
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