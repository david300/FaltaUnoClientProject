var urlBase = 'https://young-temple-5132.herokuapp.com/faltaUno/';
//var urlBase = 'http://localhost:3000/faltaUno/';

allServices
.factory('Partidos', ['$http', function($http){
    return {
        nuevoPartido: function(partido) {
            return $http({
                    url: urlBase + "partidos/add", 
                    data: JSON.stringify(partido),
                    dataType: "json",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
        },
        traerTodos: function(){
            return $http.get(urlBase + "partidos/get");
        }
    };
}]);