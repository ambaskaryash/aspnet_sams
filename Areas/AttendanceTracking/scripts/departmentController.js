

(function () {
    var departmentFactory = function ($http) {

        var saveData = function (model) {
            return $http.post('/AttendanceTracking/Department/Save',
                { model: model })
                .then(function (response) {
                    return response;
                });
        };

        var getData = function (id) {
            return $http.get('/AttendanceTracking/Department/Get?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };

        var deleteData = function (id) {
            return $http.get('/AttendanceTracking/Department/Delete?id=' + id,
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

    medicareApp.factory('departmentFactory', departmentFactory);

})();

medicareApp.controller("departmentController", ['$scope', '$uibModal', 'departmentFactory', function ($scope, $uibModal, departmentFactory) {
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
        var url = "/AttendanceTracking/Department/GetAll";
        $("#gridList").jqGrid('setGridParam', { url: url });
        $("#gridList").trigger("reloadGrid");
    };
    $scope.AddOrEdit = function (id) {
        $scope.BusinessModel = {};

        if (id > 0) {
            departmentFactory.GetData(id).then(function (response) {
                $scope.BusinessModel = response.data;
            });
        }

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/AttendanceTracking/Department/Create',
           // controller: 'departmentController',
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
                        departmentFactory.DeleteData(id).then(function (response) {
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
            departmentFactory.SaveData($scope.BusinessModel).then(function (response) {
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

