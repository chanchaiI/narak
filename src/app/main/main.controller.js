//import { NarakFileUploadComponent } from '../components/narak.fileupload/narak.fileupload'

export class MainController {
    constructor(toastr, $scope, Upload, $timeout, $document, $window, $http, $state, CONSTANT, DataService, $log) {
        'ngInject';

        this.toastr = toastr;
        this.$scope = $scope;
        this.upload = Upload;
        this.$timeout = $timeout;
        this.$document = $document;
        this.$window = $window;
        this.$http = $http;
        this.$state = $state;
        this.dataService = DataService;
        this.constant = CONSTANT;
        this.$log = $log;
        this.activate();
    }

    activate() {
        this.croppedImage = '';

        this.user = this.dataService.get('user');
        if(!this.user){
            this.$state.go('intro');
            return;
        }

        this.baby = this.dataService.get('baby');
        if (!this.baby) {
            this.$state.go('data-capture');
            return;
        }
        this.selectedTemplate = this.dataService.get('selectedTemplate');
        if(!this.selectedTemplate){
            this.$state.go('select-template');
            return;
        }

        this.$scope.$on('img-change', ()=> {
            this.preview();
        });
    }

    preview() {
        var canvas = angular.element(document.querySelector('#preview'))[0];
        var context = canvas.getContext('2d');

        var templateImage = new Image();

        templateImage.onload = () => {
            canvas.width = templateImage.width;
            canvas.height = templateImage.height;
            context.font = 'bold 13px Open Sans Condensed';
            context.font.fontcolor('#CCC');

            var kidImage = new Image();
            kidImage.onload = () => {
                drawKidImage(context, kidImage);
                drawTemplate(context, templateImage);

                var textPaddingLeft = 43;

                drawText(context, this.baby.name, '#FFF', {x: textPaddingLeft, y: templateImage.height - 28});
                var nameDetail = context.measureText(this.baby.name);

                drawText(context, '( น้อง' + this.baby.nickname + ' )', '#FFF',
                    {x: textPaddingLeft + 5 + nameDetail.width, y: templateImage.height - 28});

                if (!!this.baby.years || !!this.baby.months) {
                    drawText(context, (!!this.baby.years ? this.baby.years + ' ปี ' : '') +
                        (!!this.baby.months ? this.baby.months + ' เดือน' : ''), '#FFF',
                        {x: textPaddingLeft, y: templateImage.height - 10});
                }

                // open the image in a new browser tab
                // the user can right-click and save that image
                //var win= this.$window.open();
                //win.document.write('<img src="'+canvas.toDataURL()+'"/>');
            };

            kidImage.src = this.croppedImage;

            function drawKidImage(context, imageObj) {
                context.drawImage(imageObj, 30, 40, imageObj.width, imageObj.height);
            }

            function drawTemplate(context, templateImage) {
                context.drawImage(templateImage, 0, 0, templateImage.width, templateImage.height);
            }

            function drawText(context, text, style, position) {
                context.fillStyle = style;
                context.fillText(text, position.x, position.y);
            }
        };

        if(!!this.selectedTemplate){
            templateImage.src = this.constant.templatePath + this.selectedTemplate.path;
        }
    }

    submit() {
        var uploadUrl = this.constant.serviceBaseUrl + 'post/' + this.user.id + '/upload';
        var canvas = angular.element(document.querySelector('#preview'))[0];
        this.upload.http({
            url: uploadUrl,
            headers: {
                'Content-Type': this.croppedImage.type
            },
            data: canvas.toDataURL() + ',data=' + angular.toJson(this.baby)
        }).success((response)=>{
            this.dataService.set('post', response);
            this.$state.go('share');
        }).error((response)=>{
            alert(response.message);
        });
    }
}