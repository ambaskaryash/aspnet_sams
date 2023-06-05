

(function () {
    var designationFactory = function ($http) {

        var saveData = function (model) {
            return $http.post('/AttendanceTracking/Designation/Save',
                { model: model })
                .then(function (response) {
                    return response;
                });
        };

        var getData = function (id) {
            return $http.get('/AttendanceTracking/Designation/Get?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };

        var deleteData = function (id) {
            return $http.get('/AttendanceTracking/Designation/Delete?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };

        return {
           
            SaveData: saveData,
            GetData: getData,
            DeleteData: deleteData
            
        };
    };

    medicareApp.factory('designationFactory', designationFactory);

})();

medicareApp.controller("designationController", ['$scope', '$uibModal', 'designationFactory', function ($scope, $uibModal, designationFactory) {
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
        var url = "/AttendanceTracking/Designation/GetAll";
        $("#gridList").jqGrid('setGridParam', { url: url });
        $("#gridList").trigger("reloadGrid");
    };
    $scope.AddOrEdit = function (id) {
        $scope.BusinessModel = {};

        if (id > 0) {
            designationFactory.GetData(id).then(function (response) {
                $scope.BusinessModel = response.data;
            });
        }

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/AttendanceTracking/Designation/Create',
            controller: 'designationController',
            backdrop: 'static',
            scope: $scope,
            size: 'md'
        });
    };

    $scope.closeModal = function () {
        $scope.modalInstance.close();
    };

    $scope.deleteData = function (id) {
        $.confirm({
            title: 'Confirmation required',
            content: 'Do you really want to delete?',
            buttons: {
                ok: {
                    action: function () {

                        designationFactory.DeleteData(id).then(function (response) {
                            if (response.data.Success) {
                                showMessage(response.data.Message, "success");
                                reloadList();
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


    $scope.Save = function () {
        if (validateForm("validator")) {
            designationFactory.SaveData($scope.BusinessModel).then(function (response) {
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


}]);

