

(function () {
    var taskFactory = function ($http) {

        var deleteTaskAttachment = function (model) {
            return $http.post('/AttendanceTracking/Task/DeleteAttachedFile',
                { model: model })
                .then(function (response) {
                    return response;
                });
        };
        var saveData = function (model) {
            return $http.post('/AttendanceTracking/Task/Save',
                { model: model })
                .then(function (response) {
                    return response;
                });
        };

        var getData = function (id) {
            return $http.get('/AttendanceTracking/Task/Get?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };
        var getDDL = function () {
            return $http.get('/AttendanceTracking/Task/Getddl',
                {})
                .then(function (response) {
                    return response;
                });
        };
        var getCalenderTaskList = function () {
            return $http.get('/AttendanceTracking/Task/GetCalenderTaskList',
                {})
                .then(function (response) {
                    console.log(response,'main f......')
                    return response;
                });
        };
        var deleteData = function (id) {
            return $http.get('/AttendanceTracking/Task/Delete?id=' + id,
                {})
                .then(function (response) {
                    return response;
                });
        };
        var getAllWithOutFilter = function () {
            return $http.get('/AttendanceTracking/Task/GetAllWithOutFilter', {}).then(function (response) { return response; });
        };
       
        var getAllTaskTypeFilter = function (TaskTypeId) {
            return $http.get('/AttendanceTracking/Task/GetAllTaskTypeFilter?TaskTypeId=' + TaskTypeId, {}).then(function (response) { return response; });
        };
        var getAllWithFilter = function (StatusId, DateTypeId) {
            return $http.get('/AttendanceTracking/Task/GetAllWithFilter?StatusId=' + StatusId + '&DateTypeId=' + DateTypeId, {}).then(function (response) { return response; });
        };
        return {
            DeleteTaskAttachment: deleteTaskAttachment,
            SaveData: saveData,
            GetData: getData,
            GetDDL: getDDL,
            DeleteData: deleteData,
            GetCalenderTaskList: getCalenderTaskList,
            GetAllWithFilter: getAllWithFilter,
            GetAllWithOutFilter: getAllWithOutFilter,
            GetAllTaskTypeFilter: getAllTaskTypeFilter,
        };
    };

    medicareApp.factory('taskFactory', taskFactory);

})();

medicareApp.controller("taskController", ['$scope', '$uibModal', 'taskFactory', function ($scope, $uibModal, taskFactory) {
    $scope.options = {
        types: ['(cities)'],
        componentRestrictions: { country: 'FR' }  
    };
    $scope.filter = {
        StatusId: 0,
        DateTypeId: 0,
        TypeId:0,
    }

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
    var postRequestData = function (url, model, callback) {
        var formData = new FormData();

        if (model.TaskDocumentList != null && model.TaskDocumentList.length > 0) {
            for (var i = 0; i < model.TaskDocumentList.length; i++) {
                formData.append(model.TaskDocumentList[i].FileName, model.TaskDocumentList[i].FileData);
            }
        }
        formData.append("jsonString", JSON.stringify(model));

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.addEventListener("load", function (evt) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(JSON.parse(xhr.responseText));
            }
        }, false);
        xhr.addEventListener("error", function (evt) {
            alert('Error: ' + evt.statusText);
        }, false);

        xhr.send(formData);

    };
    //$scope.SelectedEmployee = [];
    $scope.setting1 = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: true
    };

    $scope.setting2 = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: false
    };

    //var reloadList = function () {
    //    var url = "/AttendanceTracking/Task/GetAll";
    //    $("#gridList").jqGrid('setGridParam', { url: url });
    //    $("#gridList").trigger("reloadGrid");
    //};
    var reloadList = function () {
        $scope.filter.StatusId = 0;
        $scope.filter.DateTypeId = 0;
        $scope.filter.TypeId = 0;
       
        taskFactory.GetAllWithOutFilter().then(function (response) {
            $scope.Data = response.data;
            getAllData($scope.Data);
            $('#gridList').jqGrid('clearGridData');
            $("#gridList").jqGrid('setGridParam', { data: $scope.Data, datatype: 'local' }).trigger('reloadGrid');
        });
       
    };
    $scope.AddOrEdit = function (id) {
        $scope.SelectedEmployee = [];
        $scope.BusinessModel = {};
        $scope.address = {
            name: '',
            place: '',
            components: {
                placeId: '',
                streetNumber: '',
                street: '',
                city: '',
                state: '',
                countryCode: '',
                country: '',
                postCode: '',
                district: '',
                location: {
                    lat: '',
                    long: ''
                }
            }
        };
        taskFactory.GetData(id).then(function (response) {
            $scope.BusinessModel = response.data;
            $scope.SelectedEmployee = $scope.BusinessModel.EmpAssignedList;
            $scope.address.name =$scope.BusinessModel.OutDoorAddr;
            $scope.address.components.location.lat = $scope.BusinessModel.OurDoorLat;
            $scope.address.components.location.long = $scope.BusinessModel.OurDoorLong;
        });

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/AttendanceTracking/Task/Create',
            controller: 'taskController',
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
                        taskFactory.DeleteData(id).then(function (response) {
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
    $scope.LoadMasterData = function () {
        $scope.ddlModel = {};
        taskFactory.GetDDL().then(function (response) {
            $scope.ddlModel = response.data;
        });
        taskFactory.GetAllWithOutFilter().then(function (response) {
            $scope.getAllData = response.data;
            getAllData($scope.getAllData);
        });
    }
    $scope.select = function () {
        $scope.filter.StatusId = 0;
        $scope.filter.DateTypeId = 0;
        $scope.filter.TypeId = 0;
        $scope.ActiveTab = 2;
        taskFactory.GetAllWithOutFilter().then(function (response) {
            $scope.getAllData = response.data;
            getAllData($scope.getAllData);
        });
       }
    $scope.Save = function (model) {
        if (validateForm("validator")) {
            
            $('#taskCreate').loader('show');
            model.AssignedToldList = $scope.SelectedEmployee;
            model.OutDoorAddr = $scope.address.name;
            model.OurDoorLat = $scope.address.components.location.lat;
            model.OurDoorLong = $scope.address.components.location.long;
            postRequestData("/AttendanceTracking/Task/SaveTask", model, function (data) {
                
                if (data.Success) {
                    reloadList(); 
                    $scope.loadTaskCalendar();
                    showMessage("Save successfully", 'success');
                    $scope.closeModal();

                } else {
                    showMessage(data.Message, 'error');
                }
                $('#taskCreate').loader('hide');
            });
        }
    };
    $scope.taskAttachement = function (selector) {
        var files = selector.files;
        if (files.length > 0) {
            var file = selector.files[0];
            $scope.$apply(function () {
                $scope.BusinessModel.TaskDocumentList.push({ FileName: file.name, FileData: file, IsNew: true });
            });
        }
    };
    $scope.AzureDocumentDownload = function (fileUrl) {
        window.open(fileUrl, "_blank");
    };
    $scope.DeleteAttachedDoc = function (list, idx) {
        list.splice(idx, 1);
    };
    $scope.DeleteUplodedDoc = function (model, idx) {
        $.confirm({
            title: 'Confirmation required',
            content: 'Do you really want to delete?',
            buttons: {
                ok: {
                    action: function () {
                        $('#taskCreate').loader('show');
                        taskFactory.DeleteTaskAttachment(model).then(function (response) {
                            if (response.data.Success) {
                                $scope.DeleteExistingDoc(idx);
                                showMessage("Deleted successfully", 'success');
                            }
                            else {
                                showMessage("Error has been occured.", 'error');
                            }
                            $('#taskCreate').loader('hide');
                        });
                    }
                },
                cancel: function () {
                    // nothing to do
                }
            }
        });
    };
    $scope.DeleteExistingDoc = function (idx) {
        $scope.BusinessModel.TaskDocumentList[idx].IsDeleted = true;
    };

    $scope.loadTaskCalendar= function () {
        taskFactory.GetCalenderTaskList().then(function (responseModel) {
            //var my_events = {
            //    events: [
            //        {
            //            title: 'event 1',
            //            start: '2021-01-04',
            //            end: '2021-01-04',
            //            color: 'tomato'
            //        },
            //        {
            //            title: 'event 1',
            //            start: '2021-01-04',
            //            end: '2021-01-04',
            //            color: 'tomato'
            //        },
            //    ]
            //};

            console.log(responseModel.data, '-----------');
            loadCalenderView("#taskCalendar", responseModel.data);
        });
    };
    $scope.GetAllDataWithFilter = function (StatusId, DateTypeId) {
        $scope.ActiveTab = 2;
        if (DateTypeId == null) {
            $scope.filter.DateTypeId = null;
            $scope.filter.TypeId = null;
        } else {
            $scope.filter.StatusId = null;
            $scope.filter.TypeId = null;
        }
        taskFactory.GetAllWithFilter(StatusId, DateTypeId).then(function (response) {
            $scope.Data = response.data;
            getAllData($scope.Data);
            $('#gridList').jqGrid('clearGridData');
            $("#gridList").jqGrid('setGridParam', { data: $scope.Data, datatype: 'local' }).trigger('reloadGrid');
        });
    };
    $scope.GetAllTaskTypeFilter = function (TaskTypeId) {
        $scope.filter.DateTypeId = 0;
        $scope.filter.StatusId = 0;       
        taskFactory.GetAllTaskTypeFilter(TaskTypeId).then(function (response) {
            $scope.Data = response.data;
            getAllData($scope.Data);
            $('#gridList').jqGrid('clearGridData');
            $("#gridList").jqGrid('setGridParam', { data: $scope.Data, datatype: 'local' }).trigger('reloadGrid');
        });
    };
    var loadCalenderView = function (elem, data) {
        for (var i = 0; i < data.length; i++) {
            data[i].start = convertToDate(data[i].start);
        }
        $(elem).fullCalendar('removeEvents');
        $(elem).fullCalendar('addEventSource', data);
        $(elem).fullCalendar('rerenderEvents');
        $(elem).fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            defaultDate: getCurrentDateForCal(),
            editable: true,
            eventLimit: true,
            events: data,
            eventRender: function (event, element) {
                element.bind('click', function () {
                    $scope.AddOrEdit(event.Id);
                  //  taskboardSharedService.taskNoBroadcast(event.id);
                });
            },
            dayRender: function (date, element, view) {
            }
        });
    };
    var getCurrentDateForCal = function () {
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();

        var output = d.getFullYear() + '-' +
            (month < 10 ? '0' : '') + month + '-' +
            (day < 10 ? '0' : '') + day;
        return output;
    };
    var convertToDate = function (userDate) {
        if (userDate == null) {
            return null;
        }
        var from = userDate.split("/");
        var f = new Date(from[2], from[1], from[0]);
        var month = f.getMonth();
        var day = f.getDate();
        var output = f.getFullYear() + '-' +
            (month < 10 ? '0' : '') + month + '-' +
            (day < 10 ? '0' : '') + day;
        return output;
    };

}]);