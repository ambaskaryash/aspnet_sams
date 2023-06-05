

(function () {
    var empdashBoardFactory = function ($http) {

        var getAttendanceFeed = function () {
            return $http.get('/AttendanceTracking/Dashboard/GetAttendanceFeed',
                {})
                .then(function (response) {
                    return response;
                });
        };
 
        var getNoticeBoard = function () {
            return $http.get('/AttendanceTracking/Dashboard/GetNoticeBoard',
                {})
                .then(function (response) {
                    return response;
                });
        };
        return {
            GetAttendanceFeed: getAttendanceFeed,
            GetNoticeBoard: getNoticeBoard
        };
    };

    medicareApp.factory('empdashBoardFactory', empdashBoardFactory);

})();

medicareApp.controller("empDashboardController", ['$scope', '$uibModal', 'empdashBoardFactory', function ($scope, $uibModal, dashBoardFactory) {


    $scope.TodayAttendance = {};
    $scope.GetTodayAttendanceFeed = function () {
        dashBoardFactory.GetAttendanceFeed().then(function (response) {
            $scope.TodayAttendance = response.data;
        });
    };

   
    $scope.NoticeList = [];
    $scope.LoadNoticeBoard = function () {
        dashBoardFactory.GetNoticeBoard().then(function (response) {
            $scope.NoticeList = response.data;
        });
    };
    
}]);

