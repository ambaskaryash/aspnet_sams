

(function () {
    var setupFactory = function ($http) {

        var getAllInputHelpType = function () {
            return $http.get('/AttendanceTracking/MasterDataSetup/GetAllInputHelpType',
                {})
                .then(function (response) {
                    return response;
                });
        };

        var saveInputHelp = function (model) {
            return $http.post('/AttendanceTracking/MasterDataSetup/SaveInputHelp',
                { model: model })
                .then(function (response) {
                    return response;
                });
        };

        var getInputHelp = function (id) {
            return $http.get('/AttendanceTracking/MasterDataSetup/GetInputHelp?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };
        var deleteInputHelp = function (id) {
            return $http.get('/AttendanceTracking/MasterDataSetup/DeleteInputHelp?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };

        return {
           
            GetAllInputHelpType: getAllInputHelpType,
            SaveInputHelp: saveInputHelp,
            DeleteInputHelp: deleteInputHelp,
            GetInputHelp: getInputHelp
            
        };
    };

    medicareApp.factory('setupFactory', setupFactory);

})();

medicareApp.controller("setupController", ['$scope', '$uibModal', 'setupFactory', 'employeeFactory', function ($scope, $uibModal, setupFactory, employeeFactory) {
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
    $scope.GenerateQrCode = function () {

        var model = [];

        var selectedRows = $('#employeeQrList').jqGrid("getGridParam", 'selarrrow');
        
        for (var i = 0; i < selectedRows.length; i++) {

            var selectedRowData = $('#employeeQrList').getRowData(selectedRows[i]);
            
            model.push(selectedRowData.Id);
        }
        if (model.length > 0) {
            window.open("/AttendanceTracking/MasterDataSetup/GenerateQrCodeToPdf?model=" + model, "_blank");
        }
        else {
            showMessage("Please check at least one checkbox", "error");
        }
    };
    $scope.ViewEmployee = function (id) {
        $scope.Employee = {};

        if (id > 0) {
            employeeFactory.GetData(id).then(function (response) {
                $scope.Employee = response.data;
            });
        }

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/AttendanceTracking/Employee/Details',
            controller: 'employeeController',
            backdrop: 'static',
            scope: $scope,
            size: 'xl'
        });
    };
    var getAllInputHelpData = function () {
        var url = "/AttendanceTracking/MasterDataSetup/GetAll";
        $("#setupDataList").jqGrid('setGridParam', { url: url });
        $("#setupDataList").trigger("reloadGrid");
    };
    $scope.AddMasterData = function (id) {
        $scope.InputHelpModel = { IsActive: true };

        $scope.InputHelpTypeList = [];
        setupFactory.GetAllInputHelpType().then(function (response) {
            $scope.InputHelpTypeList = response.data;
        });

        if (id > 0) {
            setupFactory.GetInputHelp(id).then(function (response) {
                $scope.InputHelpModel = response.data;
            });
        }

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/AttendanceTracking/MasterDataSetup/Create',
            controller: 'setupController',
           // backdrop: 'static',
            scope: $scope,
            size: 'md'
        });
    };

    $scope.closeModal = function () {
        $scope.modalInstance.close();
    };

    $scope.deleteMasterData = function (id) {
        $.confirm({
            title: 'Confirmation required',
            content: 'Do you really want to delete?',
            buttons: {
                ok: {
                    action: function () {
                        setupFactory.DeleteInputHelp(id).then(function (response) {
                            if (response.data.Success) {
                                showMessage(response.data.Message, "success");
                                getAllInputHelpData();
                            } else {
                                showMessage(response.data.Message, "error");
                            }
                        });
                    }
                },
                cancel: function () {
                    // nothing to do
                }
            }
        });
    };


    $scope.SaveInputHelp = function () {
        if (validateForm("InputHelp")) {
            setupFactory.SaveInputHelp($scope.InputHelpModel).then(function (response) {
                if (response.data.Success) {
                    showMessage("Saved Sucessfully", "success");
                    $scope.closeModal();
                    $scope.InputHelpModel = {};
                    getAllInputHelpData();
                }
                else {
                    showMessage(response.data.Message, "error");

                }
            });
        }
    };


}]);

