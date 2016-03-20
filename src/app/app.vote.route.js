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
    ;

    $urlRouterProvider.otherwise('/');
}
