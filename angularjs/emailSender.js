

(function () {
    var emailSenderFactory = function ($http) {
        var sendMail = function (models) {
            return $http.post('/MailSending/SendEmailToAdmin',
                { model: models })
                .then(function (response) {
                    return response;
                });
        };

        return {
            SendMail: sendMail
        };
    };

    medicareApp.factory('emailSenderFactory', emailSenderFactory);

})();

medicareApp.controller("emailSenderController", ['$http', '$scope', '$mdToast', '$uibModal', 'emailSenderFactory', function ($http, $scope, $mdToast, $uibModal, emailSenderFactory) {

    $scope.closeModel = function () {
        $scope.modalInstance.close();

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
            templateUrl: '/MailSending/SendMailToAdminView',
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
            emailSenderFactory.SendMail(m).then(function (response) {
                displaytToast("Email Send Successfully", "success");
                $scope.closeModel();
            });
        }
    };
    
    var displaytToast = function (msg) {
        $mdToast.show($mdToast.simple()
                .content(msg)
                .hideDelay(2000)
                .position('bottom right'));
    };
  
  
}]);

