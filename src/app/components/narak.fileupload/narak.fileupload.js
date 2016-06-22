

export class NarakFileUploadComponent{

    static get IMAGE_SUBMITTED_EVENT(){
       return 'imageSubmitted';
    }

    constructor(){
        this.templateUrl = 'app/components/narak.fileupload/narak.fileupload.html';
    }

    controller($scope, $rootScope, $document){
        'ngInject';

        $scope.buttonLabels = {
            rotateLeft: '<i class="material-icons">rotate_left</i>',
            rotateRight: '<i class="material-icons">rotate_right</i>',
            zoomIn: '<i class="material-icons">zoom_in</i>',
            zoomOut: '<i class="material-icons">zoom_out</i>',
            fit: '<i class="material-icons">refresh</i>'
        };

        $scope.cropperReady = (api) =>{
            $scope.image = api.crop();
        };

        $scope.updateResultImage = (base64) => {
            $rootScope.$broadcast('img-change', base64);
        };
        
        $scope.openBrowseFile = function(){
            $document[0].querySelector('#picFile').click();
        };

        $scope.deleteImage = function(){
            $scope.picFile = null;
        };
    }
}

angular
    .module('narakFileUpload', ['ngFileUpload', 'imageCropper'])
    .component('narakFileUpload',new NarakFileUploadComponent());