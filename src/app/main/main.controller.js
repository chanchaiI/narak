import { NarakFileUploadComponent } from '../components/narak.fileupload/narak.fileupload'

export class MainController {
    constructor(toastr, $scope, Upload, $timeout, $document, $window) {
        'ngInject';

        this.toastr = toastr;
        this.$scope = $scope;
        this.upload = Upload;
        this.$timeout = $timeout;
        this.$document = $document;
        this.$window = $window;
        this.croppedImage = '';
        this.babyName = '';
        this.activate();

        this.$scope.$on(NarakFileUploadComponent.IMAGE_SUBMITTED_EVENT, (event, data)=>{

            var canvas = angular.element('<canvas/>')[0];
            var context = canvas.getContext('2d');
            var imageObj = new Image();
            imageObj.onload = () =>{
                canvas.width = imageObj.width;
                canvas.height = imageObj.height;
                context.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);
                context.font = '20px Open Sans Condensed';
                context.fillText(this.babyName, 0, imageObj.height/2);

                // open the image in a new browser tab
                // the user can right-click and save that image
                var win= this.$window.open();
                win.document.write('<img src="'+canvas.toDataURL()+'"/>');
            };

            imageObj.src = data;

            //this.upload.upload({
            //    url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
            //    data: {
            //        file: this.upload.dataUrltoBlob(dataUrl)
            //    }
            //}).then((response) => {
            //    this.timeout(function () {
            //        this.$scope.result = response.data;
            //    });
            //}, (response) => {
            //    if (response.status > 0)
            //        this.$scope.errorMsg = response.status + ': ' + response.data;
            //}, (evt) => {
            //    this.$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            //});
        });
    }

    activate(){

    }

    showToastr() {
        alert('hello');
    }
}