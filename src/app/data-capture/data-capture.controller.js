
export class DataCaptureController {
    constructor(toastr, $scope, $state, DataService) {
        'ngInject';

        this.pageClass = 'page-data-capture';
        this.toastr = toastr;
        this.$scope = $scope;
        this.$state = $state;
        this.dataService = DataService;


        this.activate();
    }

    activate() {
        this.croppedImage = '';
        this.baby = this.dataService.get('baby') || {
            name: '',
            nickname: '',
            years: null,
            months: null
        };
    }

    next(){
        if (this.$scope.form.$valid) {
            this.dataService.set('baby', this.baby);
            this.$state.go('select-template');
        }
    }

}