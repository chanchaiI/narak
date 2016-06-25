export class MainController {
    constructor($scope, Upload, $timeout, $document, $window, $http, $state, CONSTANT, DataService, $log) {
        'ngInject';

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
        this.canvasSize = {
            width: 620,
            height: 620
        };
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
        this.baby.category_id = this.selectedTemplate.id;


        this.preview();
        this.$scope.$on('img-change', (event, value)=> {
            this.croppedImage = value;
            this.preview();
        });
    }

    preview() {
        if(!this.croppedImage){
            this.drawTemplate();
            return;
        }

        var canvas = angular.element(document.querySelector('#preview'))[0];
        var context = canvas.getContext('2d');
        var templateImage = new Image();

        templateImage.onload = () => {
            canvas.width = this.canvasSize.width;
            canvas.height = this.canvasSize.height;
            context.font = this.selectedTemplate.font.name || '36px db_helvethaicamon_x75_bd';
            var fontColor = this.selectedTemplate.font.color || '#CCC';

            var kidImage = new Image();
            kidImage.onload = () => {
                this.drawKidImage(context, this.selectedTemplate.position.kid.x || 30, this.selectedTemplate.position.kid.y || 40, kidImage);
                this.drawFrame(context, templateImage);

                var textPaddingLeft = 70;
                var name = this.baby.gender + ' ' + this.baby.name + ' ( น้อง' + this.baby.nickname + ' )';

                this.drawText(context, name, fontColor, {x: textPaddingLeft, y: canvas.height - 50});


                if (this.baby.years || this.baby.months) {
                    this.drawText(context, (this.baby.years ? this.baby.years + ' ปี ' : '') +
                        (this.baby.months ? this.baby.months + ' เดือน' : ''), fontColor,
                        {x: textPaddingLeft, y: canvas.height - 14});
                }
            };

            kidImage.src = this.croppedImage;

        };

        if(this.selectedTemplate){
            templateImage.src = this.constant.templatePath + this.selectedTemplate.path;
        }
    }

    drawTemplate(){
        var canvas = angular.element(document.querySelector('#preview'))[0];
        var context = canvas.getContext('2d');

        var templateImage = new Image();

        templateImage.onload = () => {
            canvas.width = this.canvasSize.width;
            canvas.height = this.canvasSize.height;
            context.font = this.selectedTemplate.font.name || '36px db_helvethaicamon_x75_bd';
            var fontColor = this.selectedTemplate.font.color || '#CCC';

            this.drawFrame(context,templateImage);

            var textPaddingLeft = 70;
            var name = this.baby.gender + ' ' + this.baby.name + ' ( น้อง' + this.baby.nickname + ' )';

            this.drawText(context, name, fontColor, {x: textPaddingLeft, y: canvas.height - 50});

            if (this.baby.years || this.baby.months) {
                this.drawText(context, (this.baby.years ? this.baby.years + ' ปี ' : '') +
                    (this.baby.months ? this.baby.months + ' เดือน' : ''), fontColor,
                    {x: textPaddingLeft, y: canvas.height - 14});
            }
        };

        if(this.selectedTemplate){
            templateImage.src = this.constant.templatePath + this.selectedTemplate.path;
        }
    }

    drawKidImage(context, x, y, imageObj) {
        context.drawImage(imageObj, x, y, imageObj.width, imageObj.height);
    }

    drawFrame(context, templateImage) {
        context.drawImage(templateImage, 0, 0, this.canvasSize.width, this.canvasSize.height);
    }

    drawText(context, text, style, position) {
        context.fillStyle = style;
        context.fillText(text, position.x, position.y);
    }

    submit() {
        this.$scope.mainForm.$submitted = true;

        if(this.$scope.mainForm.$valid){
            var uploadUrl = this.constant.serviceBaseUrl + 'post/' + this.user.id + '/upload';
            var canvas = angular.element(document.querySelector('#preview'))[0];
            var data = {
                baby: this.baby,
                template: this.selectedTemplate
            };

            this.upload.http({
                url: uploadUrl,
                headers: {
                    'Content-Type': this.croppedImage.type
                },
                data: canvas.toDataURL() + ',data=' + angular.toJson(data)
            }).success((response)=>{
                this.dataService.set('post', response.data);
                this.$state.go('share');
            }).error((response)=>{
                alert(response.message);
            });
        }
    }
}