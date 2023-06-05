

(function () {
    var leaveFactory = function ($http) {

        var getData = function (id) {
            return $http.get('/AttendanceTracking/Leave/Get?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };
        var approveOrRejectLeave = function (model) {
            return $http.post('/AttendanceTracking/Leave/ApproveOrRejectLeave',
                { model: model })
                .then(function (response) {
                    return response;
                });
        };

        return {
            GetData: getData,
            ApproveOrRejectLeave: approveOrRejectLeave
        };
    };

    medicareApp.factory('leaveFactory', leaveFactory);

})();

medicareApp.controller("leaveController", ['$scope', '$uibModal', 'leaveFactory', function ($scope, $uibModal, leaveFactory) {

    var addjsLoader = function () {
        $('body').addClass('loading')
            .loader('show', {
                overlay: false
            });
    };

    var removejsLoader = function () {
        if ($('body').hasClass('loading')) {
            $('body').removeClass('loading')
                .loader('hide');
        }
    };

    $scope.ViewLeave = function (id) {
        $scope.BusinessModel = {};

        leaveFactory.GetData(id).then(function (response) {
            $scope.BusinessModel = response.data;
        });
        $scope.modalInstance = $uibModal.open({
            templateUrl: '/AttendanceTracking/Leave/LeaveDetails',
            backdrop: 'static',
            scope: $scope,
            size: 'xl'
        });
    };
    $scope.ReloadGrid = function () {

        var url = "/AttendanceTracking/Leave/GetUserLeaves";
        $("#gridList").jqGrid('setGridParam', { url: url });
        $("#gridList").trigger("reloadGrid");
    };
    $scope.ReloadPendingGrid = function () {

        var url = "/AttendanceTracking/Leave/GetUserPendingLeaves";
        $("#pendingGridList").jqGrid('setGridParam', { url: url });
        $("#pendingGridList").trigger("reloadGrid");
    };
    $scope.ApproveLeave = function () {
        $.confirm({
            title: 'Confirmation required',
            content: 'Do you really want to Approve?',
            buttons: {
                ok: {
                    action: function () {
                        addjsLoader();
                        $scope.BusinessModel.IsApproved = true;
                        leaveFactory.ApproveOrRejectLeave($scope.BusinessModel).then(function (response) {
                            if (response.data.Success) {
                                showMessage("Successfully Approved", "success");
                                $scope.ReloadGrid();
                                $scope.ReloadPendingGrid();
                                $scope.closeModal();
                            } else {
                                showMessage("Error in approve", "error");
                            }
                            removejsLoader();
                        });
                    }
                },
                cancel: function () {
                    // nothing to do
                }
            }
        });
    };
    $scope.RejectLeave = function () {
        $.confirm({
            title: 'Confirmation required',
            content: 'Do you really want to Reject?',
            buttons: {
                ok: {
                    action: function () {
                        $scope.modalInstanceReject = $uibModal.open({
                            templateUrl: '/AttendanceTracking/Leave/RejectReason',
                            backdrop: 'static',
                            scope: $scope,
                            size: 'sm'
                        });
                    }
                },
                cancel: function () {
                    // nothing to do
                }
            }
        });
    };
    $scope.SaveRejectLeave = function (reason) {
        $scope.BusinessModel.IsRejected = true;
        $scope.BusinessModel.RejectReason = reason;
        addjsLoader();
        $scope.BusinessModel.Approved = true;
        leaveFactory.ApproveOrRejectLeave($scope.BusinessModel).then(function (response) {
            if (response.data.Success) {
                showMessage("Successfully Rejected", "success");
                $scope.ReloadGrid();
                $scope.ReloadPendingGrid();
                $scope.closeModal();
                $scope.closeRejectModal();
            } else {
                showMessage("Error in approve", "error");
            }
            removejsLoader();
        });
    };
    $scope.closeModal = function () {
        $scope.modalInstance.close();
    };
    $scope.closeRejectModal = function () {
        $scope.modalInstanceReject.close();
    };
}]);