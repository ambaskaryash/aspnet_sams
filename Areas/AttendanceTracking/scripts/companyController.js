

(function () {
    var companyFactory = function ($http) {

        var deleteCompanyAttachments = function (model) {
            return $http.post('/AttendanceTracking/CompanySettings/DeleteAttachedFile',
                { model: model })
                .then(function (response) {
                    return response;
                });
        };
        var getData = function (id) {
            return $http.get('/AttendanceTracking/CompanySettings/Get?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };

        var deleteData = function (id) {
            return $http.get('/AttendanceTracking/CompanySettings/Delete?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };

        return {
            DeleteCompanyAttachments: deleteCompanyAttachments,
            GetData: getData,
            DeleteData: deleteData
        };
    };

    medicareApp.factory('companyFactory', companyFactory);

})();

medicareApp.controller("companyController", ['$scope', '$uibModal', 'companyFactory', function ($scope, $uibModal, companyFactory) {

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
        var url = "/AttendanceTracking/CompanySettings/GetAll";
        $("#gridList").jqGrid('setGridParam', { url: url });
        $("#gridList").trigger("reloadGrid");
    };
    $scope.AddOrEdit = function (id) {
        $scope.BusinessModel = {};

        companyFactory.GetData(id).then(function (response) {
            $scope.BusinessModel = response.data;
        });

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/AttendanceTracking/CompanySettings/Create',
            controller: 'companyController',
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
                        companyFactory.DeleteData(id).then(function (response) {
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
    var initialiseAttacheList = function (model) {
        if (angular.isUndefined((model.DocumentList) || model.DocumentList === null)) {
            model.DocumentList = [];
        }
    };
    $scope.HasMessage = false;
    $scope.WarningMessage = "";
    $scope.Save = function () {
        $scope.HasMessage = false;
        if (validateForm("validator")) {
            $('#companyCreate').loader('show');
            initialiseAttacheList($scope.BusinessModel);
            postRequestData('/AttendanceTracking/CompanySettings/AddOrUpdateCompany', $scope.BusinessModel, function (data) {
                if (data.Success) {
                    showMessage("Saved Sucessfully", "success");
                    $scope.closeModal();
                    $scope.BusinessModel = {};
                    reloadList();
                    $('#companyCreate').loader('hide');

                } else {
                    $scope.HasMessage = true;
                    $scope.WarningMessage = data.Message;
                    $('#companyCreate').loader('hide');
                    $scope.$apply();
                }
            });
        }
    };
    $scope.CRFilettachment = function (selector) {
        var files = selector.files;
        if (files.length > 0) {
            initialiseAttacheList($scope.BusinessModel);
            var file = selector.files[0];
            $scope.$apply(function () {
                $scope.BusinessModel.DocumentList.push({ FileName: file.name, AttachmentType: "CompanyRegistration", FileData: file, IsNew: true });
            });
        }
    };
    $scope.establishmentCardFilettachment = function (selector) {
        var files = selector.files;
        if (files.length > 0) {
            initialiseAttacheList($scope.BusinessModel);
            var file = selector.files[0];
            $scope.$apply(function () {
                $scope.BusinessModel.DocumentList.push({ FileName: file.name, AttachmentType: "EstablishmentCard", FileData: file, IsNew: true });
            });
        }
    };
    $scope.tradeLicenseFilettachment = function (selector) {
        var files = selector.files;
        if (files.length > 0) {
            initialiseAttacheList($scope.BusinessModel);
            var file = selector.files[0];
            $scope.$apply(function () {
                $scope.BusinessModel.DocumentList.push({ FileName: file.name, AttachmentType: "TradeAndMunicipalLicense", FileData: file, IsNew: true });
            });
        }
    };
    $scope.othersFilettachment = function (selector) {
        var files = selector.files;
        if (files.length > 0) {
            initialiseAttacheList($scope.BusinessModel);
            var file = selector.files[0];
            $scope.$apply(function () {
                $scope.BusinessModel.DocumentList.push({ FileName: file.name, AttachmentType: "Others", FileData: file, IsNew: true });
            });
        }
    };
    $scope.DeleteAttachedDoc = function (list, idx) {
        list.splice(idx, 1);
    };
    $scope.DeleteExistingDoc = function (list, idx) {
        list[idx].IsDeleted = true;
    };
    $scope.AzureDocumentDownload = function (fileUrl) {
        window.open(fileUrl, "_blank");
    };
    var postRequestData = function (url, model, callback) {
        var formData = new FormData();

        if (model.DocumentList !== null) {
            for (var k = 0; k < model.DocumentList.length; k++) {
                if (model.DocumentList[k].IsNew) {
                    formData.append(model.DocumentList[k].AttachmentType, model.DocumentList[k].FileData);
                }
            }
        }

        formData.append("jsonString", JSON.stringify(model));

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.addEventListener("load", function (evt) {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        }, false);
        xhr.addEventListener("error", function (evt) {
            CommonApi.Common.RemovejsLoader();
            CommonApi.Common.ShowMessage(evt.responseText, 'error');
        }, false);

        xhr.send(formData);
    };
    $scope.DeleteUplodedDoc = function (model, idx) {
        $.confirm({
            title: 'Confirmation required',
            content: 'Do you really want to delete?',
            buttons: {
                ok: {
                    action: function () {
                        $('#companyCreate').loader('show');
                        model[idx].IsDeleted = true;
                        companyFactory.DeleteCompanyAttachments(model).then(function (response) {
                            if (response.data.Success) {
                                $scope.DeleteExistingDoc(model, idx);
                                showMessage("Deleted successfully", 'success');
                            }
                            else {
                                showMessage("Error has been occured.", 'error');
                            }
                            $('#companyCreate').loader('hide');
                        });
                    }
                },
                cancel: function () {
                    // nothing to do
                }
            }
        });
    };
}]);

