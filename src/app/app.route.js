export function routerConfig($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('vote', {
            url: '/',
            templateUrl: 'app/vote/vote.html',
            controller: 'VoteController',
            controllerAs: 'vm'
        })
        .state('admin-login', {
            url: '/narakadmin/login',
            templateUrl: 'app/admin/login.html',
            controller: 'AdminLoginController',
            controllerAs: 'vm'
        })
        .state('admin-main', {
            url: '/narakadmin/main',
            templateUrl: 'app/admin/main.html',
            controller: 'AdminMainController',
            controllerAs: 'vm'
        })
        .state('intro', {
            url: '/facebookApp/',
            templateUrl: 'app/intro/intro.html',
            controller: 'IntroController',
            controllerAs: 'vm'
        })
        .state('data-capture', {
            url: '/facebookApp/data-capture',
            templateUrl: 'app/data-capture/data-capture.html',
            controller: 'DataCaptureController',
            controllerAs: 'vm'
        })
        .state('select-template', {
            url: '/facebookApp/select-template',
            templateUrl: 'app/select-template/select-template.html',
            controller: 'SelectTemplateController',
            controllerAs: 'vm'
        })
        .state('main', {
            url: '/facebookApp/main',
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'vm'
        })
        .state('share', {
            url: '/facebookApp/share',
            templateUrl: 'app/share/share.html',
            controller: 'ShareController',
            controllerAs: 'vm'
        })
        .state('term', {
            url: '/facebookApp/term',
            templateUrl: 'app/term/term.html',
            controller: 'TermController',
            controllerAs: 'vm'
        });

    $urlRouterProvider.otherwise('/');
}