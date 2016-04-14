
export class DataCaptureController {
    constructor($scope, $state, DataService) {
        'ngInject';

        this.pageClass = 'page-data-capture';
        this.$scope = $scope;
        this.$state = $state;
        this.dataService = DataService;


        this.activate();
    }

    activate() {
        this.croppedImage = '';
        this.baby = this.dataService.get('baby') || {
                gender: 'ด.ช.',
                name: '',
                nickname: '',
                years: null,
                months: null
            };
    }

    next(){
        this.$scope.form.$submitted = true;
        if(this.baby.years == 7 && this.baby.months > 0){
            this.$scope.form.$valid = false;
            this.$scope.form.babyYears.$error.max = true;
        }
        if(this.$scope.form.$valid) {
            this.dataService.set('baby', this.baby);
            this.$state.go('select-template');
        }
    }

}