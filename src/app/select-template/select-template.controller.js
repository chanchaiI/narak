export class SelectTemplateController {

    constructor(CONSTANT, $state, DataService) {
        'ngInject';

        this.$state = $state;
        this.categories = CONSTANT.categories;
        this.templatePath = CONSTANT.templatePath;
        this.dataService = DataService;
        this.selectedTemplate = null;
    }

    next(){
        this.dataService.set('selectedTemplate', this.selectedTemplate);
        this.$state.go('main');
    }
}