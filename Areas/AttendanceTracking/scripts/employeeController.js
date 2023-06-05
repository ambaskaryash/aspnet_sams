

(function () {
    var employeeFactory = function ($http) {

        var saveData = function (model) {
            
            model.CountryList = null;
            model.DepartmentList = null;
            model.DesignationList = null;
            model.HomeAirportList = null;
            model.MotherTongueList = null;
            model.NationalityList = null;
            model.ProjectList = null;
            model.ReligionList = null;
            model.WorkingCompanyList = null;
            model.WorkingLocationList = null;
            return $http.post('/AttendanceTracking/Employee/Save',
                { model: model })
                .then(function (response) {
                    return response;
                });
        };

        var getData = function (id) {
            return $http.get('/AttendanceTracking/Employee/Get?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };

        var deleteData = function (id) {
            return $http.get('/AttendanceTracking/Employee/Delete?id=' + id,
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

    medicareApp.factory('employeeFactory', employeeFactory);

})();

medicareApp.controller("employeeController", ['$scope', '$uibModal', 'employeeFactory', function ($scope, $uibModal, employeeFactory) {
    $scope.ActiveTab = 1;
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
        var url = "/AttendanceTracking/Employee/GetAll";
        $("#gridList").jqGrid('setGridParam', { url: url });
        $("#gridList").trigger("reloadGrid");
    };
    $scope.AddOrEdit = function (id) {
        $scope.Employee = {};

        employeeFactory.GetData(id).then(function (response) {
            $scope.Employee = response.data;
        });

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/AttendanceTracking/Employee/Create',
            controller: 'employeeController',
            backdrop: 'static',
            scope: $scope,
            size: 'xl'
        });
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
    $scope.deleteData = function (id, IsDeleteable) {
        if (IsDeleteable == false || IsDeleteable==null) {
            $.confirm({
                title: 'Confirmation required',
                content: 'Do you really want to delete?',
                buttons: {
                    ok: {
                        action: function () {
                            employeeFactory.DeleteData(id).then(function (response) {
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
        }
    };
    $scope.closeModal = function () {
        $scope.modalInstance.close();
    };
    $scope.Save = function () {
        if (validateForm("validator")) {
            $('#employeeDetails').loader('show');
            employeeFactory.SaveData($scope.Employee).then(function (response) {
                if (response.data.Success) {
                    showMessage("Saved Sucessfully", "success");
                    $scope.closeModal();
                    $scope.Employee = {};
                    reloadList();
                }
                else {
                    showMessage(response.data.Message, "error");

                }
                $('#employeeDetails').loader('hide');
            });
        }
    };


    $scope.uploadEmployeeBatchExcelFile = function (isValidateEmpCode) {

        var fileUpload = $("#employeeBatchExcel").get(0);
        var files = fileUpload.files;
        if (files.length <= 0) {
            showMessage("Please select a file.", 'error');
            $('#divWrapper').loader('hide');
            return;
        }
        $('#divWrapper').loader('show');
        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            data.append(files[i].name, files[i]);
        }
        $.ajax({
            type: "POST",
            url: "/AttendanceTracking/Employee/UploadEmployeeBatchExcelFile",
            contentType: false,
            processData: false,
            data: data,
            success: function (response) {
                $("#employeeBatchExcel").val("");
                $('#divWrapper').loader('hide');
                reloadList();
            },
            error: function () {
                $('#divWrapper').loader('hide');
                //alert("There was error uploading files!");
            }
        });
    };

    $scope.employeeExportToExcel = function (op) {
        if (validateForm("previewInfo")) {
            var search = $("#gridList").jqGrid('getGridParam', 'postData');
            window.location = "/Employee/ExportEmployeeList?_search=" + search._search + "&nd=" + search.nd + "&rows=" + search.rows + "&page=" + search.page + "&sidx=" + search.sidx + "&sord=" + search.sord + "&filters=" + search.filters;
        }
    }
    $scope.uploadEmpImage = function () {
        var fileUpload = $("#empImageData").get(0);
        var files = fileUpload.files;
        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            data.append(files[i].name, files[i]);
        }

        $.ajax({
            type: "POST",
            url: "/AttendanceTracking/Employee/UploadEmployeeImage?empId=" + $scope.Employee.Id,
            contentType: false,
            processData: false,
            data: data,
            success: function (imgSrc) {

                if (imgSrc != null) {
                    $(".empImage").attr('src', "");
                    $(".empImage").attr('src', imgSrc.FilePath);
                    $scope.Employee.ImageFileName = imgSrc.FileName;
                    $scope.Employee.ImagePath = imgSrc.FilePath;
                }
            },
            error: function () {
                //alert("There was error uploading files!");
            }
        });
    };

}]);

