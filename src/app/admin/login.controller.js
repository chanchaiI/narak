export class AdminLoginController {
    constructor($http, CONSTANT, $state, AuthService, $mdDialog, $document) {
        'ngInject';
        this.$state = $state;
        this.$http = $http;
        this.constant = CONSTANT;
        this.authService = AuthService;
        this.$mdDialog = $mdDialog;
        this.$document = $document;
        this.user = {
            username: '',
            password: ''
        }
    }

    login(){
        this.authService.login(this.user).then(()=>{
            this.$state.go('admin-main');
        }).catch((response)=>{
            this.$mdDialog.show(
                this.$mdDialog.alert()
                    .parent(angular.element(this.$document.body))
                    .clickOutsideToClose(true)
                    .title('Error')
                    .textContent(response)
                    .ariaLabel('Error')
                    .ok('OK')
            );
            this.user = {
                username: '',
                password: ''
            }
        });
    }
}