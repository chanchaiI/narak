export function routerConfig($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('intro', {
            url: '/',
            templateUrl: 'app/intro/intro.html',
            controller: 'IntroController',
            controllerAs: 'vm'
        })
        .state('data-capture', {
            url: '/data-capture',
            templateUrl: 'app/data-capture/data-capture.html',
            controller: 'DataCaptureController',
            controllerAs: 'vm'
        })
        .state('select-template', {
            url: '/select-template',
            templateUrl: 'app/select-template/select-template.html',
            controller: 'SelectTemplateController',
            controllerAs: 'vm'
        })
        .state('main', {
            url: '/main',
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'vm'
        })
        .state('share', {
            url: '/share',
            templateUrl: 'app/share/share.html',
            controller: 'ShareController',
            controllerAs: 'vm'
        });

    $urlRouterProvider.otherwise('/');
}
