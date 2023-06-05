var mApp = angular.module("mApp", ['ui.bootstrap']);


(function () {
    var homeFactory = function ($http) {

        var getAllDoctor = function () {
            return $http.get('/Home/GetAllDoctor', {}).then(function (response) { return response; });
        };
        var getSliderDoctors = function () {
            return $http.get('/Home/GetTopDoctors', {}).then(function (response) { return response; });
        };
        var getDoctorById = function (id) {
            return $http.get('/Home/GetDoctorById?id=' + id, {}).then(function (response) { return response; });
        };
        var getAllDrug = function () {
            return $http.get('/Home/GetAllDrug?companyId=null&groupId=null&genericId=null', {}).then(function (response) { return response; });
        };
        return {
            GetAllDoctor: getAllDoctor,
            GetDoctorById: getDoctorById,
            GetAllDrug: getAllDrug,
            GetSliderDoctors: getSliderDoctors
        };
    };

    mApp.factory('homeFactory', homeFactory);

})();



mApp.controller("homeController", ['$scope', 'homeFactory', function ($scope, homeFactory) {
    $scope.viewby = 8; 
    $scope.currentPage = 1;
    $scope.itemsPerPage = $scope.viewby;
    $scope.maxSize =10; //Number of pager buttons to show
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.currentPage);
    };
    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first page
    }
    $scope.GetAllDoctor = function () {
        homeFactory.GetAllDoctor().then(function (response) {
            $scope.doctorList = response.data;
            $scope.totalItems = $scope.doctorList.length;
        });
    }
    $scope.GetSliderDoctors = function () {
        homeFactory.GetSliderDoctors().then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var ob = response.data[i];
                var imgName = "img" + (i + 1);
                var drName = "drName" + (i + 1);
                var drExperience = "drExperience" + (i + 1);
                var drExperience = "drExperience" + (i + 1);
                var drDesignation = "drDesignation" + (i + 1);
                $scope[imgName] = ob.PhotoPath;
                $scope[drName] = ob.Name;
                $scope[drExperience] = ob.Experience;
                $scope[drDesignation] = ob.Designation;
                }
        });
    };
    $scope.GetSliderDoctors();
    $scope.GetDoctorById = function () {
        homeFactory.GetDoctorById(getQueryStringValue("doctor")).then(function (response) {
            $scope.doctorDetails = response.data;

        });
    };

    $(document).ready(function () {

        var owl = $("#owl-demo");

        owl.owlCarousel({
            items: 5,
            itemsDesktop: [1199, 3],
            itemsDesktopSmall: [979, 3],
            navigation: true,
            autoPlay:true
        });
        // Custom Navigation Events
        $(".next").click(function () {
            owl.trigger('owl.next');
        })
        $(".prev").click(function () {
            owl.trigger('owl.prev');
        })
        $(".play").click(function () {
            owl.trigger('owl.play', 1000); //owl.play event accept autoPlay speed as second parameter
        })
        $(".stop").click(function () {
            owl.trigger('owl.stop');
        })
    });

}]);

