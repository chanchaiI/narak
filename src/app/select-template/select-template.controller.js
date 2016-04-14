export class SelectTemplateController {

    constructor($scope, CONSTANT, $state, DataService) {
        'ngInject';

        this.$scope = $scope;
        this.$state = $state;
        this.categories = CONSTANT.categories;
        this.templatePath = CONSTANT.templatePath;
        this.dataService = DataService;
        this.selectedTemplate = this.dataService.get('selectedTemplate') || null;
    }

    next(){
        this.$scope.selectForm.$submitted = true;
        if (this.$scope.selectForm.$valid) {
            this.dataService.set('selectedTemplate', this.selectedTemplate);
            this.$state.go('main');
        }
    }
}