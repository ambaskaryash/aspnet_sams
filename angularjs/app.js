


var medicareApp = angular.module("medicareApp", ['ui.bootstrap', 'ngMaterial', 'ngRoute', 'vsGoogleAutocomplete','angularjs-dropdown-multiselect']);

medicareApp.directive('ckEditor', function () {
    return {
        require: '?ngModel',
        link: function (scope, elm, attr, ngModel) {
            var ck = CKEDITOR.replace(elm[0]);
            if (!ngModel) return;
            ck.on('instanceReady', function () {
                ck.setData(ngModel.$viewValue);
            });
            function updateModel() {
                scope.$apply(function () {
                    ngModel.$setViewValue(ck.getData());
                });
            }
            ck.on('change', updateModel);
            ck.on('key', updateModel);
            ck.on('dataReady', updateModel);

            ngModel.$render = function (value) {
                ck.setData(ngModel.$viewValue);
            };
        }
    };
});
medicareApp.directive('compile', compile)
compile.$inject = ['$compile'];
function compile($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                return scope.$eval(attrs.compile);
            },
            function (value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        );
    };
}
medicareApp.filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});

medicareApp.filter('ctime', function () {
    return function (jsonDate) {
        if (typeof jsonDate !== 'undefined' && jsonDate !== null) {
            var date = new Date(parseInt(jsonDate.substr(6)));
            return date;
        }
        return "";
    };
});

medicareApp.directive("angdatepicker", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                showOn: "both",
                buttonImage: "/Content/images/Calendar.gif",
                buttonImageOnly: true,
                dateFormat: "dd/mm/yy",
                changeYear: true,
                yearRange: "-100:+100",
                onSelect: function (dateText) {
                    updateModel(dateText);
                } 
            };
            elem.datepicker(options);
        }
    };
});

medicareApp.directive('validNumber', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^0-9\.]/g, '');
                var decimalCheck = clean.split('.');

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

medicareApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, { 'event': event });
                });

                event.preventDefault();
            }
        });
    };
});


medicareApp.directive('setFocus', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                $('#' + attrs.setFocus).show().focus();
            });
        }
    };
});

medicareApp.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
        }
    };
}]);

medicareApp.directive('selectOnDoubleClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('dblclick', function () {
                this.select();
            });
        }
    };
}]);

medicareApp.directive('myTooltip', function () {
    return {
        link: function (scope, element, attrs) {
            var changeTooltipPosition = function (event) {
                var tooltipX = event.pageX - 5 - $('div.mytooltip').width();
                var tooltipY = event.pageY + 5;
                $('div.mytooltip').css({ top: tooltipY, left: tooltipX });
            };

            var showTooltip = function (event) {
                $('div.mytooltip').remove();
                $("<div class='mytooltip'>" + attrs.myTooltip + "</div>").appendTo('body');
                changeTooltipPosition(event);
            };

            var hideTooltip = function () {
                $('div.mytooltip').remove();
            };

            element.bind({
                mousemove: changeTooltipPosition,
                mouseenter: showTooltip,
                mouseleave: hideTooltip
            });

        }
    };
});

medicareApp.directive("bangla", function () {
    return {
        restrict: "A",
        link: function (scope, elem, attr, ctrl) {
            //$(elem).bnKb({
            //    'switchkey': { "webkit": "k", "mozilla": "y", "safari": "k", "chrome": "k", "msie": "y" },
            //    'driver': phonetic
            //});
            // Load the Google Transliterate API
           
        }
    };
});

medicareApp.directive('focusNext', function () {
    return {
        restrict: 'A',
        link: function($scope, elem, attrs) {
            elem.bind("keydown keypress", function (e) {
                var code = e.keyCode || e.which;
                if (code === 13) {
                    e.preventDefault();
                    var fields = $('#autoFocusable').find('input, textarea, select');
                    var index = fields.index(this);
                    if (index > -1 && (index + 1) < fields.length)
                        fields.eq(index + 1).focus();
                }
            });
        }
    };
});

var getQueryStringValue = function (name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results === null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
};

var getToday = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = dd + '/' + mm + '/' + yyyy;
    return today;
};

var initializeDateRangePicker = function () {
    var dateFormat = "dd/mm/yy",
        from = $("#startDate")
            .datepicker({
                //defaultDate: "+1w",
                dateFormat: 'dd/mm/yy',
                changeMonth: true,
                numberOfMonths: 1
            })
           .on("change", function () {
               to.datepicker("option", "minDate", getDate(this));
           }),
         to = $("#endDate").datepicker({
             defaultDate: "+1w",
             dateFormat: 'dd/mm/yy',
             changeMonth: true,
             numberOfMonths: 1
         })
         .on("change", function () {
             from.datepicker("option", "maxDate", getDate(this));
         });

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }
};

medicareApp.directive("autocompleteDrug", function () {
    return {
        restrict: "A",
        scope: {
            ngModel: "=",
            ngDrug: "=",
            callbackFn: '&'
        },
        link: function (scope, elem, attr, ctrl) {
            var updateModel = function (ui, duplicateCheck) {
                scope.$apply(function () {
                    scope.callbackFn({ arg1: ui.item.m, duplicateCheck: duplicateCheck });
                });
            };
            var dModel = { url: "/SetupApi/GetDrugList", isNew: true };
            elem.bind("keydown", function (evt) {
                var keycode = evt.charCode || evt.keyCode;
                if (keycode == 118 && scope.ngDrug.GenericId != "" && scope.ngDrug.GenericId != null) {
                    dModel.url = "/SetupApi/GetDrugListByGeneric";
                    dModel.isNew = false;
                    evt.preventDefault();
                } else {
                    dModel = { url: "/SetupApi/GetDrugList", isNew: true };
                }
            });
                          
            
            elem.autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: dModel.url,       
                        type: "GET",
                        dataType: "json",
                        data: dModel.isNew ? { prefix: request.term } : { genericId: scope.ngDrug.GenericId, brandId: scope.ngDrug.BrandId },
                        success: function (data) {
                            response($.map(data, function (item) {
                                return { label: item.BrandName, id: item.BrandId, desc: item.Description, m: item};
                            }));
                        }
                    });
                },
                autoFocus: true,
                select: function (event, ui) {
                    updateModel(ui, dModel.isNew);
                    event.preventDefault();
                }
            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                  .append("<div>" + "<span style='font-weight:bold;'>" + item.label + "</span><br><span style='font-style:italic'>" + item.desc + "</span></div>")
                  .appendTo(ul);
            };
        }
    };
});

var numbersE = {
    0: '০',
    1: '১',
    2: '২',
    3: '৩',
    4: '৪',
    5: '৫',
    6: '৬',
    7: '৭',
    8: '৮',
    9: '৯'
};

var replaceNumbersE2B = function (input) {
    var output = [];
    for (var i = 0; i < input.length; ++i) {
        if (numbersE.hasOwnProperty(input[i])) {
            output.push(numbersE[input[i]]);
        } else {
            output.push(input[i]);
        }
    }
    return output.join('');
};

var toFirstLetterCapital = function(selector) {
    jQuery(selector).keyup(function() {
        var str = jQuery(selector).val();
        var spart = str.split(" ");
        for (var i = 0; i < spart.length; i++) {
            var j = spart[i].charAt(0).toUpperCase();
            spart[i] = j + spart[i].substr(1);
        }
        jQuery(selector).val(spart.join(" "));

    });
};

medicareApp.directive("anglettercapital", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            elem.keyup(function () {
                var str = jQuery(this).val();
                var spart = str.split(" ");
                for (var i = 0; i < spart.length; i++) {
                    var j = spart[i].charAt(0).toUpperCase();
                    spart[i] = j + spart[i].substr(1);
                }
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(spart.join(" "));
                    ngModelCtrl.$render();
                });
            });
        }
    };
});

medicareApp.directive("rowsortable", function () {
    return {
        restrict: "A",
        scope: {
            callbackFn: '&'
        },
        link: function (scope, elem, attr, ctrl) {
            elem.sortable({
                items: 'tr:has(td)',
                cursor: "move",
                opacity: 0.75,
                stop: function (event, ui) {
                    scope.callbackFn({ arg1: ui });
                }
            });
        }
    };
});

medicareApp.controller("userPopupMenuController", ['$http', '$scope', '$uibModal', '$sce', function ($http, $scope, $uibModal, $sce) {
    $scope.isMenuLoading = false;
    $scope.openCommonModal = function (url) {
        $scope.isMenuLoading = true;
        $scope.modalInstance = $uibModal.open({
            templateUrl: url,
            scope: $scope,
            size: 'lg',
            backdrop: false
        });
        $scope.modalInstance.rendered.then(function () {
            $scope.isMenuLoading = false;
        }, function () {
        });
    };
    $scope.closeCommonModal = function () {
        $scope.modalInstance.close();
    };

}]);



var showMessage = function (message, type) {
    $.toast({
        text: message,
        icon: type,
        showHideTransition: 'slide',
        position: 'top-center'
    });
};