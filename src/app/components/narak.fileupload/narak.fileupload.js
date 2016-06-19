

export class NarakFileUploadComponent{

    static get IMAGE_SUBMITTED_EVENT(){
       return 'imageSubmitted';
    }

    constructor(){
        this.templateUrl = 'app/components/narak.fileupload/narak.fileupload.html';
        this.bindings = {
            model: '='
        }
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

        $scope.image = this.model;

        $scope.$watch('image', (newModel)=>{
            this.model = newModel;
            $rootScope.$broadcast('img-change');
        });

        $scope.cropperReady = function(api){
            $scope.image = api.crop();
        };

        $scope.updateResultImage = function(base64) {
            $scope.image = base64;
            $scope.$apply(); // Apply the changes.

            // $rootScope.$broadcast('img-change');
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