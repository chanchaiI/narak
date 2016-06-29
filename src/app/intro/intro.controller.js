export class IntroController {

    constructor($scope, $window, $state) {
        'ngInject'
        this.$state = $state;
    }

    go(state){
        this.$state.go(state);
    }
}