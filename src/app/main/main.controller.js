//import { NarakFileUploadComponent } from '../components/narak.fileupload/narak.fileupload'

export class MainController {
    constructor(toastr, $scope, Upload, $timeout, $document, $window) {
        'ngInject';

        this.toastr = toastr;
        this.$scope = $scope;
        this.upload = Upload;
        this.$timeout = $timeout;
        this.$document = $document;
        this.$window = $window;


        this.activate();
    }

    activate(){
        this.croppedImage = '';
        this.baby = {
            name: '',
            nickname: '',
            years: null,
            months: null
        };
    }

    preview() {
        if(this.$scope.form.$valid){
            var canvas = angular.element(document.querySelector('#preview'))[0];
            var context = canvas.getContext('2d');

            var templateImage = new Image();

            templateImage.onload = () =>{
                canvas.width = templateImage.width;
                canvas.height = templateImage.height;
                context.font = 'bold 13px Open Sans Condensed';
                context.font.fontcolor('#CCC');

                var kidImage = new Image();
                kidImage.onload = () =>{
                    drawKidImage(context, kidImage);
                    drawTemplate(context, templateImage);

                    var textPaddingLeft = 43;

                    drawText(context, this.baby.name, '#FFF', {x: textPaddingLeft, y:templateImage.height - 28});
                    var nameDetail = context.measureText(this.baby.name);

                    drawText(context, '( น้อง' + this.baby.nickname + ' )' , '#FFF',
                        {x: textPaddingLeft + 5 + nameDetail.width, y:templateImage.height - 28});

                    if(!!this.baby.years || !!this.baby.months){
                        drawText(context, (!!this.baby.years ? this.baby.years +' ปี ': '') +
                        (!!this.baby.months ?  this.baby.months + ' เดือน': ''), '#FFF',
                            {x: textPaddingLeft , y:templateImage.height - 10});
                    }

                    // open the image in a new browser tab
                    // the user can right-click and save that image
                    //var win= this.$window.open();
                    //win.document.write('<img src="'+canvas.toDataURL()+'"/>');
                };

                kidImage.src = this.croppedImage;

                function drawKidImage(context, imageObj){
                    context.drawImage(imageObj, 30, 40, imageObj.width, imageObj.height);
                }

                function drawTemplate(context, templateImage){
                    context.drawImage(templateImage, 0, 0, templateImage.width, templateImage.height);
                }

                function drawText(context, text, style, position){
                    context.fillStyle = style;
                    context.fillText(text, position.x, position.y);
                }
            };

            templateImage.src = 'assets/images/narak_template.png';
        }
    }

    upload(){

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
    }
}