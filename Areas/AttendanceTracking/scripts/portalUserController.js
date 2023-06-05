

(function () {
    var portalUserFactory = function ($http) {

        var saveData = function (model) {
            return $http.post('/AttendanceTracking/UserSettings/Update',
                { model: model })
                .then(function (response) {
                    return response;
                });
        };

        var getData = function (id) {
            return $http.get('/AttendanceTracking/UserSettings/GetUserDetails?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };

        var removeDevice = function (uId) {
            return $http.get('/AttendanceTracking/UserSettings/RemoveDevice?uId=' + uId,
                {})
                .then(function (response) {
                    return response;
                });
        };

        var resetUserPass = function (uId) {
            return $http.get('/AttendanceTracking/UserSettings/ResetUserPass?uId=' + uId,
                {})
                .then(function (response) {
                    return response;
                });
        };

        return {

            SaveData: saveData,
            GetData: getData,
            RemoveDevice: removeDevice,
            ResetUserPass: resetUserPass
        };
    };

    medicareApp.factory('portalUserFactory', portalUserFactory);

})();

medicareApp.controller("portalUserController", ['$scope', '$uibModal', 'portalUserFactory', function ($scope, $uibModal, portalUserFactory) {

    var validateForm = function (group) {
        $scope.ErrorList = [];
        $("." + group).removeClass("invalid-field");
        var notFound = true;
        $("." + group).each(function () {
            if ($(this).hasClass("ng-invalid")) {
                $(this).addClass("invalid-field");
                var message = $(this).parent().prev("label").clone().children().remove().end().text();
                $scope.ErrorList.push({ Message: message + " is required." });
                notFound = false;
            }
        });
        return notFound;
    };

    var reloadList = function () {
        var url = "/AttendanceTracking/UserSettings/GetUserList";
        $("#gridList").jqGrid('setGridParam', { url: url });
        $("#gridList").trigger("reloadGrid");
    };
    $scope.AddOrEdit = function (id) {

        $scope.BusinessModel = {};

        portalUserFactory.GetData(id).then(function (response) {
            $scope.BusinessModel = response.data;
        });

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/AttendanceTracking/UserSettings/Create',
            backdrop: 'static',
            scope: $scope,
            size: 'md'
        });
    };

    $scope.closeModal = function () {
        $scope.modalInstance.close();
    };

    $scope.Save = function () {
        if (validateForm("validator")) {
            portalUserFactory.SaveData($scope.BusinessModel).then(function (response) {
                if (response.data.Success) {
                    showMessage("Saved Sucessfully", "success");
                    $scope.closeModal();
                    $scope.BusinessModel = {};
                    reloadList();
                }
                else {
                    showMessage(response.data.Message, "error");
                }
            });
        }
    };

    $scope.ResetPassConfirm = function (uId) {
        $.confirm({
            title: 'Confirmation required',
            content: 'Do you really want to reset password to 123456 for the user?',
            buttons: {
                ok: {
                    action: function () {
                        portalUserFactory.ResetUserPass(uId).then(function (response) {
                            if (response.data.Success) {
                                showMessage("Successfulle reset password for the user. Reset password is 123456", "success");
                                reloadList();
                            } else {
                                showMessage("something is wrong", "error");
                            }
                        });
                    }
                },
                cancel: function () {
                    // nothing to do
                }
            }
        });
    }

    $scope.removeRegisteredDevice = function (uId) {
        $.confirm({
            title: 'Confirmation required',
            content: 'Do you really want to remove registered device for new device registration?',
            buttons: {
                ok: {
                    action: function () {
                        portalUserFactory.RemoveDevice(uId).then(function (response) {
                            if (response.data.Success) {
                                showMessage("Successfulle remove registered device for the user", "success");
                                reloadHistoryList();
                            } else {
                                showMessage("something is wrong", "error");
                            }
                        });
                    }
                },
                cancel: function () {
                    // nothing to do
                }
            }
        });
    }

   

    var reloadHistoryList = function () {
        var url = "/AttendanceTracking/UserSettings/GetUserLoginHistoryList";
        $("#gridList").jqGrid('setGridParam', { url: url });
        $("#gridList").trigger("reloadGrid");
    };


}]);

