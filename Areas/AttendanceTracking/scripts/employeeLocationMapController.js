

(function () {
    var employeeLocationMapFactory = function ($http) {

        var getLocationData = function () {
            return $http.get('/AttendanceTracking/EmployeeLocationMap/GetEmployeeCurrentLatLong',
                {})
                .then(function (response) {
                    return response;
                });
        };


        return {
            GetLocationData: getLocationData
        };
    };

    medicareApp.factory('employeeLocationMapFactory', employeeLocationMapFactory);

})();

medicareApp.controller("employeeLocationMapController", ['$scope', '$uibModal', '$interval', 'employeeLocationMapFactory', function ($scope, $uibModal, $interval, employeeLocationMapFactory ) {

    var map;
    var markers = [];
    $scope.centerLat = 0;
    $scope.centerLng = 0;

    $scope.loadLocationMap = function () {
        employeeLocationMapFactory.GetLocationData().then(function (response) {
            initMap(response.data);
        });
    };

    function initMap(sData) {
        if (sData != null && sData.length > 0) {
            loadMapIfData(sData);
        }
        else {
            loadMapIfNoData();
        }
    }

    function loadMapIfNoData() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 12
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('Your current location.');
                infoWindow.open(map);
                map.setCenter(pos);
            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    };
    function loadMapIfData(sData) {
        $scope.centerLat = sData[0].Latitude;
        $scope.centerLng = sData[0].Longitude;

        var mapOptions = {
            zoom: 10,
            center: new google.maps.LatLng($scope.centerLat, $scope.centerLng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        setMarkers(sData);
    };
    function setMarkers(sData) {

        var infowindow = new google.maps.InfoWindow();

        $scope.centerLat = sData[0].Latitude;
        $scope.centerLng = sData[0].Longitude;

        angular.forEach(sData, function (item, key) {

            var myLatLng = new google.maps.LatLng(item.Latitude, item.Longitude);
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                animation: google.maps.Animation.DROP
            });

            google.maps.event.addListener(marker, 'click', (function (marker, key) {
                return function () {
                    infowindow.setContent("Employee Name : " + item.UserName + ",  Location : " + item.LogLocation+".");
                    infowindow.open(map, marker);
                }
            })(marker, key));

            markers.push(marker);
        });
    };

    $scope.reloadMarkers = function () {

        for (var i = 0; i < markers.length; i++) {

            markers[i].setMap(null);
        }

        markers = [];
        employeeLocationMapFactory.GetLocationData().then(function (response) {
            setMarkers(response.data);
        });
    }

    $interval(function () {
        $scope.reloadMarkers();
        var theTime = new Date().toLocaleTimeString();
        console.log(theTime);
    }, 300000)

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

}]);