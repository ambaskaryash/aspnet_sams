(function () {
    var attendanceReportFactory = function ($http) {

        var getInitMonthYear = function () {
            return $http.get('/AttendanceTracking/AttendanceReport/GetInitMonthYear', {}).then(function (response) { return response; });
        };
        var getReports = function (monthId, yearId) {
            return $http.get('/AttendanceTracking/AttendanceReport/GetMonthlyAttendanceReports?monthId=' + monthId + '&yearId=' + yearId, {}).then(function (response) { return response; });
        };
        var getAllUserReports = function (monthId, yearId) {
            return $http.get('/AttendanceTracking/AttendanceReport/GetAllUserAttendanceReports?monthId=' + monthId + '&yearId=' + yearId, {}).then(function (response) { return response; });
        };
        return {
            GetInitMonthYear: getInitMonthYear,
            GetReports: getReports,
            GetAllUserReports: getAllUserReports
        };
    };

    medicareApp.factory('attendanceReportFactory', attendanceReportFactory);

})();
medicareApp.controller("attendanceReportController", ['$scope', '$uibModal', 'attendanceReportFactory', function ($scope, $uibModal, attendanceReportFactory) {

    $scope.ViewMonthlyEmployeeDetails = function (id, month, year) {

        $scope.EmployeeUserId = id;
        $scope.EmployeeMonth = month;
        $scope.EmployeeYear = year;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/AttendanceTracking/AttendanceReport/MonthlyAttendanceReportDetails',
            backdrop: 'static',
            scope: $scope,
            controller: 'attendanceReportController',
            size: 'xl'
        });
    };
    $scope.GetInitTransactionData = function () {

        attendanceReportFactory.GetInitMonthYear().then(function (response) {
            $scope.MonthList = response.data.monthList;
            $scope.YearList = response.data.yearList;
            $scope.MonthId = response.data.selectedMonth;
            $scope.YearId = response.data.selectedYear;

            attendanceReportFactory.GetReports($scope.MonthId, $scope.YearId).then(function (response) {
                $scope.ReportData = response.data;
                LoadAttendanceData($scope.ReportData);
            });
        });
    };
    $scope.GetInitTransactionDataForAll = function () {

        attendanceReportFactory.GetInitMonthYear().then(function (response) {
            $scope.MonthList = response.data.monthList;
            $scope.YearList = response.data.yearList;
            $scope.MonthId = response.data.selectedMonth;
            $scope.YearId = response.data.selectedYear;

            attendanceReportFactory.GetAllUserReports($scope.MonthId, $scope.YearId).then(function (response) {
                $scope.AllUserReportData = response.data;
                LoadAllAttendanceData($scope.AllUserReportData);
            });
        });
    };
    $scope.GetMonthlyReportList = function (monthId, yearId) {
        attendanceReportFactory.GetReports(monthId, yearId).then(function (response) {
            $scope.ReportData = response.data;
            LoadAttendanceData($scope.ReportData);
            $('#monthlyGridList').jqGrid('clearGridData');
            $("#monthlyGridList").jqGrid('setGridParam', { data: $scope.ReportData, datatype: 'local' }).trigger('reloadGrid');
        });
    };
    $scope.MonthlyAttendanceReportExportToExcel = function (monthId, yearId) {
        window.location = "/AttendanceTracking/AttendanceReport/MonthlyAttendanceReportExportToExcel?monthId=" + monthId + '&yearId=' + yearId;
    };
    $scope.EmployeeMonthlyAttendanceReportExportToExcel = function () {
        window.location = "/AttendanceTracking/AttendanceReport/EmployeeMonthlyAttendanceReportExportToExcel?employeeId=" + $scope.EmployeeUserId + '&monthId=' + $scope.EmployeeMonth + '&yearId=' + $scope.EmployeeYear;
    };
    $scope.GetMonthlyAttendanceReports = function () {
        getMonthlyDetails('/AttendanceTracking/AttendanceReport/GetMonthlyUserReports?employeeId=' + $scope.EmployeeUserId + '&monthId=' + $scope.EmployeeMonth + '&yearId=' + $scope.EmployeeYear);
    };
    $scope.AllReportExportToExcel = function (monthId, yearId) {
        window.location = "/AttendanceTracking/AttendanceReport/AllUserReportExportToExcel?monthId=" + monthId + '&yearId=' + yearId;
    };
    $scope.GetAllReportList = function (monthId, yearId) {
        attendanceReportFactory.GetAllUserReports(monthId, yearId).then(function (response) {
            $scope.AllUserReportData = response.data;
            LoadAllAttendanceData($scope.AllUserReportData);
            $('#allUserGridList').jqGrid('clearGridData');
            $("#allUserGridList").jqGrid('setGridParam', { data: $scope.AllUserReportData, datatype: 'local' }).trigger('reloadGrid');
        });
    };
    $scope.closeModal = function () {
        $scope.modalInstance.close();
    };
}]);