

(function () {
    var dashBoardFactory = function ($http) {

        var getAttendanceFeed = function () {
            return $http.get('/AttendanceTracking/Dashboard/GetAttendanceFeed',
                {})
                .then(function (response) {
                    return response;
                });
        };
       
        var getLeaveStatus = function () {
            return $http.get('/AttendanceTracking/Dashboard/GetLeaveStatus',
                {})
                .then(function (response) {
                    return response;
                });
        };
        var getDocExpiryCount = function () {
            return $http.get('/AttendanceTracking/Dashboard/GetDocExpiryCount',
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
            GetLeaveStatus: getLeaveStatus,
            GetDocExpiryCount: getDocExpiryCount,
            GetNoticeBoard: getNoticeBoard
        };
    };

    medicareApp.factory('dashBoardFactory', dashBoardFactory);

})();

medicareApp.controller("attendanceDashboardController", ['$scope', '$uibModal', 'dashBoardFactory', function ($scope, $uibModal, dashBoardFactory) {


    $scope.TodayAttendance = {};
    $scope.GetTodayAttendanceFeed = function () {
        dashBoardFactory.GetAttendanceFeed().then(function (response) {
            $scope.TodayAttendance = response.data;
        });
    };

    $scope.DocExpiryList = [];
    $scope.LoadDocExpiryCount = function () {
        dashBoardFactory.GetDocExpiryCount().then(function (response) {
            $scope.DocExpiryList = response.data;
        });
    };

    $scope.NoticeList = [];
    $scope.LoadNoticeBoard = function () {
        dashBoardFactory.GetNoticeBoard().then(function (response) {
            $scope.NoticeList = response.data;
        });
    };
    $scope.HealthCardExpired = function (code) {
        if (code == 'Expired')
            $scope.ExpiryId = 1;
        if (code == 'Expiring in 90 days')
            $scope.ExpiryId = 2;
        if (code == 'Expiring in 60 days')
            $scope.ExpiryId = 3;
        if (code == 'Expiring in 30 days')
            $scope.ExpiryId = 4;
        $scope.modalInstance = $uibModal.open({
            templateUrl: '/AttendanceTracking/Dashboard/ExpiryDetails',
            backdrop: 'static',
            scope: $scope,
            size: 'xl'
        });
    };
    $scope.GetExpiryReports = function () {
        getExpiryDetails('/AttendanceTracking/Dashboard/GetExpiryReports?expiryId=' + $scope.ExpiryId);
    };
    $scope.ExpiryReportExportToExcel = function () {
        window.location = "/AttendanceTracking/Dashboard/ExpiryReportExportToExcel?expiryId=" + $scope.ExpiryId;
    };
    $scope.closeModal = function () {
        $scope.modalInstance.close();
    };
}]);

