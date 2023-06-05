

(function () {
    var changePasswordFactory = function ($http) {

        var getInitUser = function () {
            return $http.get('/AttendanceTracking/ChangePassword/GetInitUser',
                {})
                .then(function (response) {
                    return response;
                });
        };
        var updatePassword = function (model) {
            return $http.post('/AttendanceTracking/ChangePassword/UpdatePassword',
                { model: model })
                .then(function (response) {
                    return response;
                });
        };
        return {
            GetInitUser: getInitUser,
            UpdatePassword: updatePassword
        };
    };

    medicareApp.factory('changePasswordFactory', changePasswordFactory);

})();

medicareApp.controller("changePasswordController", ['$scope', '$window', '$interval', 'changePasswordFactory', function ($scope, $window, $interval, changePasswordFactory) {

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
    $scope.GetInitUser = function () {
        changePasswordFactory.GetInitUser().then(function (response) {
            $scope.PasswordModel = response.data;
        });
    };
    $scope.UpdatePassword = function () {
        if (validateForm("validator")) {
            if ($scope.PasswordModel.NewPassword != $scope.PasswordModel.ConfirmPassword) {
                showMessage('The new password and confirmation password do not match.', 'error');
                return;
            }
            addjsLoader();
            changePasswordFactory.UpdatePassword($scope.PasswordModel).then(function (response) {
                if (response.data.Success) {
                    showMessage("Password Changed Successfully", "success");
                    removejsLoader();
                    $interval(function () {
                        $window.location.href = '/Account/LogOff';
                    }, 1000)
                }
                else {
                    showMessage(response.data.Message, "error");
                    removejsLoader();
                }
            });
        }
    };
}]);

