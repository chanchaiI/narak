
export class HowToPlayController {
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
        this.activate();
    }

    activate() {

    }
}