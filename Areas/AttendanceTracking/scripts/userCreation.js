(function () {
    var userFactory = function ($http) {
        var sendMail = function (models) {
            return $http.post('/MailSending/SendEmailToDoctors',
                { model: models })
                .then(function (response) {
                    return response;
                });
        };

        var updateDoctor = function (model) {
            return $http.post('/Doctor/UpdateDoctor',
                { model: model })
                .then(function (response) {
                    return response;
                });
        };

        var getDoctorSetupData = function (id) {
            return $http.get('/Doctor/SetupData',
                {})
                .then(function (response) {
                    return response;
                });
        };

        var getDoctorDetails = function (id) {
            return $http.get('/Doctor/GetDoctorDetails?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };
        var getLoggedInDoctorDetails = function () {
            return $http.get('/Doctor/GetLoggedInDoctorDetails',
                {})
                .then(function (response) {
                    return response;
                });
        };
        var getDoctorDetailsById = function (id) {
            return $http.get('/Doctor/GetDoctorDetailsById?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };
        var assignApplicationSetup = function (id) {
            return $http.get('/Doctor/AssignApplicationSetup?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };

        var addDcotorTemplate = function (id,userName) {
            return $http.get('/Doctor/AddDcotorTemplate?id=' + id + '&userName=' + userName,
                {})
                .then(function (response) {
                    return response;
                });
        };
        var getAllUserData = function () {
            return $http.get('/User/GetUserListData',
                {})
                .then(function (response) {
                    return response;
                });
        };
        var resetPassword = function (userInitial, email) {
            return $http.get("/MailSending/ResetPassword?userInitial=" + userInitial + "&email=" + email,
                {})
                .then(function (response) {
                    return response;
                });
        };
        return {
            //Save: save,
            SendMail: sendMail,
            GetDoctorSetupData: getDoctorSetupData,
            GetDoctorDetails: getDoctorDetails,
            UpdateDoctor: updateDoctor,
            GetDoctorDetailsById: getDoctorDetailsById,
            AssignApplicationSetup: assignApplicationSetup,
            GetAllUserData: getAllUserData,
            GetLoggedInDoctorDetails: getLoggedInDoctorDetails,
            ResetPassword: resetPassword,
            AddDcotorTemplate: addDcotorTemplate
        };
    };

    medicareApp.factory('userFactory', userFactory);
})();

medicareApp.controller("userController", ['$http', '$scope', '$mdToast', '$uibModal', '$mdDialog', 'userFactory', '$sce', function ($http, $scope, $mdToast, $uibModal, $mdDialog, userFactory, $sce) {
    $scope.popupDoctorProfile = function (id) {
        $scope.doctorId = id;
        $scope.modalInstance = $uibModal.open({
            templateUrl: '/MedicareLanding/UpdateDoctor',
            controller: 'userController',
            scope: $scope,
            size: 'lg',
            backdrop: false
        });
        $scope.modalInstance.result.then(function () {
            //Call function to reload the list
            //$scope.loadUserList();
        });
    };

    $scope.closeModel = function () {
        $scope.modalInstance.close();
    };
    $scope.loadUserList = function () {
        var url = "/User/GetAll";
        $("#userList").jqGrid('setGridParam', { url: url });
        $("#userList").trigger("reloadGrid");
    };

    var validateForm = function (group) {
        $scope.ErrorList = [];
        $("." + group).removeClass("invalid-field");
        var notFound = true;
        $("." + group).each(function () {
            if ($(this).hasClass("ng-invalid")) {
                $(this).addClass("invalid-field");
                var message = $(this).parent().prev("label").clone().children().remove().end().text();
                $scope.ErrorList.push({ Name: $(this).prop("id"), Message: message + " is required." });
                notFound = false;
            }
        });
        return notFound;
    };

    $scope.popupSendmail = function () {
        $scope.isLoading = true;
        $scope.modalInstance = $uibModal.open({
            templateUrl: '/User/MailSendView',
            scope: $scope,
            size: 'md',
            backdrop: false
        });
        $scope.modalInstance.rendered.then(function () {
            $scope.isLoading = false;
        }, function () {
        });
    };

    $scope.submitEmail = function (m) {
        if (validateForm("EmailRequired")) {
            userFactory.SendMail(m).then(function (response) {
                displaytToast("Message Send Successfully", "success");
                $scope.closeModel();
            });
        }
    };
    

    $scope.InitializeDoctorProfileData = function () {
        userFactory.GetDoctorSetupData().then(function (response) {
            $scope.DoctorSetup = response.data;
            getLoggedInDoctorDetails();
        });
    };

    var getLoggedInDoctorDetails = function () {
        userFactory.GetLoggedInDoctorDetails().then(function (response) {
            $scope.DoctorDetails = response.data;
        });
    };

    $scope.GetDoctorDetails = function () {
        userFactory.GetDoctorDetails($scope.doctorId).then(function (response) {
            $scope.DoctorDetails = response.data;
        });
    };

    $scope.InitializeDoctorSetupData = function () {
        userFactory.GetDoctorSetupData().then(function (response) {
            $scope.DoctorSetup = response.data;
            $scope.GetDoctorDetails();
        });
    };

    $scope.GetDoctorDetails = function () {
        userFactory.GetDoctorDetails($scope.doctorId).then(function (response) {
            $scope.DoctorDetails = response.data;
        });
    };

    $scope.UpdateDoctorProfile = function () {
        userFactory.UpdateDoctor($scope.DoctorDetails).then(function (response) {
            if (response.data.Success) {
                displaytToast("Success: Your profile information updated sucessfully", "success");
            } else {
                displaytToast("Error in update", "error");
            }
        });
    };

    $scope.UpdateDoctor = function () {
        userFactory.UpdateDoctor($scope.DoctorDetails).then(function (response) {
            if (response.data.Success) {
                $scope.closeModel();
                $scope.loadUserList();
                displaytToast("Updated sucessfully", "success");
            } else {
                displaytToast("Error in update", "error");
            }
        });
    };
    $scope.isLoading = false;
    $scope.AssignApplicationSetup = function (id) {
        $scope.isLoading = true;
        userFactory.AssignApplicationSetup(id).then(function (response) {
            if (response.data.Success) {
                displaytToast("Success: Doctors default data sucessfully added.", "success");
            } else {
                displaytToast("Error in update", "error");
            }
            $scope.isLoading = false;
        });
    };

    $scope.AddDcotorTemplate = function (id,userName) {
        $scope.isLoading = true;
        userFactory.AddDcotorTemplate(id,userName).then(function (response) {
            if (response.data.Success) {
                $scope.DoctorDetails.IsTemplateAdded = true;
                displaytToast("Success: Doctors default template sucessfully added.", "success");
            } else {
                displaytToast("User Name is empty or internal exception occured.", "error");
            }
            $scope.isLoading = false;
        });
    };

    var displaytToast = function (msg) {
        $mdToast.show($mdToast.simple()
            .content(msg)
            .hideDelay(2000)
            .position('bottom right'));
    };

    $scope.uploadImage = function () {
        var fileUpload = $("#imageFiles").get(0);
        var files = fileUpload.files;
        var personId = $scope.DoctorDetails.UserId;
        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            data.append(files[i].name, files[i], personId);
        }
        $.ajax({
            type: "POST",
            url: "/Doctor/UploadProfileImage",
            contentType: false,
            processData: false,
            data: data,
            success: function (imgSrc) {
                if (imgSrc != null) {
                    $(".profileImage").attr('src', "");
                    $(".profileImage").attr('src', imgSrc);
                    //$scope.GetPerson();
                }
            },
            error: function () {
                //alert("There was error uploading files!");
            }
        });
    };
   
    $scope.uploadNotificationImage = function () {
        var fileUpload = $("#imageFiles").get(0);
        var files = fileUpload.files;
        var formData = new FormData();
        $scope.notificationSetupModel.BlobType = 1
        $http({
            method: "post",
            url: '/User/UploadNotificationFile/',
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                formData.append('notification', JSON.stringify(data.notification));
                for (var i = 0; i < data.postFile.length; i++) {
                    formData.append('postFile[' + i + ']', data.postFile[i]);
                }
                return formData;
            },
            data: {
                'notification': $scope.notificationSetupModel
                , 'postFile': files
            },
            dataType: "json"
        }).then(function successCallback(response) {
            if (response.data.Error === true) {
                noty({ text: response.data.Message, layout: 'topRight', type: 'error' });
            }
            else {
                $scope.BlobType = 1;
                if (response.data != null) {
                    $scope.notificationSetupModel.FilePath = response.data;
                    if ($scope.notificationSetupModel.FilePath != null) {
                        $(".profileImage").attr('src', "");
                        $(".profileImage").attr('src', $scope.notificationSetupModel.FilePath);
                    }
                }
            }
        }), function errorCallBack(response) {
        }
    }
    $scope.uploadVideo = function () {
        var fileUpload = $("#videoFiles").get(0);
        var files = fileUpload.files;
        var formData = new FormData();
        $scope.notificationSetupModel.BlobType = 2
        $http({
            method: "post",
            url: '/User/UploadNotificationFile/',
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                formData.append('notification', JSON.stringify(data.notification));
                for (var i = 0; i < data.postFile.length; i++) {
                    formData.append('postFile[' + i + ']', data.postFile[i]);
                }
                return formData;
            },
            data: {
                'notification': $scope.notificationSetupModel
                , 'postFile': files
            },
            dataType: "json"
        }).then(function successCallback(response) {
            if (response.data.Error === true) {
                noty({ text: response.data.Message, layout: 'topRight', type: 'error' });
            }
            else {
                $scope.BlobType = 2;
                if (response.data != null) {
                    $scope.notificationSetupModel.FilePath = $sce.trustAsResourceUrl(response.data);
                    var vEs = angular.element(document.querySelector('#videoSrc'));
                    var vid = document.getElementById("myVideo");
                    vEs[0].src = $scope.notificationSetupModel.FilePath;
                    vid.load();
                }
            }
        }), function errorCallBack(response) {
        }
    }
    $scope.sendResetPassword = function (ev, userInitial, email) {
        var confirm = $mdDialog.confirm()
            .title('Confirmation!')
            .textContent('Do you want to reset password for the user?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(function (result) {
            userFactory.ResetPassword(userInitial, email).then(function (response) {
                displaytToast("Password reset successfully.Please chek your mail inbox and after login change your password.");
            });
        }, function () {
        });
    }
}]);