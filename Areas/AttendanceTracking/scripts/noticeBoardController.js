

(function () {
    var noticeBoardFactory = function ($http) {

        var saveData = function (model) {
            return $http.post('/AttendanceTracking/NoticeBoard/Save',
                { model: model })
                .then(function (response) {
                    return response;
                });
        };

        var getData = function (id) {
            return $http.get('/AttendanceTracking/NoticeBoard/Get?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };

        var deleteData = function (id) {
            return $http.get('/AttendanceTracking/NoticeBoard/Delete?id=' + id,
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

    medicareApp.factory('noticeBoardFactory', noticeBoardFactory);

})();

medicareApp.controller("noticeBoardController", ['$scope', '$uibModal', 'noticeBoardFactory', function ($scope, $uibModal, noticeBoardFactory) {
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
    var reloadList = function () {
        var url = "/AttendanceTracking/NoticeBoard/GetAll";
        $("#gridList").jqGrid('setGridParam', { url: url });
        $("#gridList").trigger("reloadGrid");
    };
    $scope.AddOrEdit = function (id) {
        $scope.BusinessModel = {};

        noticeBoardFactory.GetData(id).then(function (response) {
            $scope.BusinessModel = response.data;
        });

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/AttendanceTracking/NoticeBoard/Create',
            controller: 'noticeBoardController',
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
                        noticeBoardFactory.DeleteData(id).then(function (response) {
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
    $scope.uploadNoticeImage = function () {

        var noticeId = $scope.BusinessModel.Id;
        if (noticeId == null)
            noticeId = "0";

        var fileUpload = $("#noticeImageData").get(0);
        var files = fileUpload.files;
        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            data.append(files[i].name, files[i]);
        }
        addjsLoader();
        $.ajax({
            type: "POST",
            url: "/AttendanceTracking/NoticeBoard/UploadNoticeImage?noticeId=" + $scope.BusinessModel.Id,
            contentType: false,
            processData: false,
            data: data,
            success: function (imgSrc) {

                if (imgSrc != null) {
                    $(".image").attr('src', "");
                    $(".image").attr('src', imgSrc.FilePath);
                    $scope.BusinessModel.ImageFileName = imgSrc.FileName;
                    $scope.BusinessModel.ImagePath = imgSrc.FilePath;
                }
                removejsLoader();
            },
            error: function () {
                removejsLoader();
            }
        });
    };
    $scope.Save = function () {
        if (validateForm("validator")) {
            noticeBoardFactory.SaveData($scope.BusinessModel).then(function (response) {
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

