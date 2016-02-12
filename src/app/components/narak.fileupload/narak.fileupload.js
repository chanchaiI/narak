

export function NarakFileUploadComponent(){
    "use strict";

    function NarakFileUploadController(){
        'ngInject';


    }

    return {
        transclude: true,
        controller: NarakFileUploadController,
        templateUrl: 'app/components/narak,fileupload/narak.fileupload.html'
    }
}

angular
    .module('narakFileUpload', ['ngFileUpload'])
    .component('NarakFileUpload', NarakFileUploadComponent);