export function routerConfig($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('vote', {
            url: '/',
            templateUrl: 'app/vote/vote.html',
            controller: 'VoteController',
            controllerAs: 'vm'
        })
        .state('detail', {
            url: '/detail/{postId:int}',
            templateUrl: 'app/vote-detail/vote-detail.html',
            controller: 'VoteDetailController',
            controllerAs: 'vm'
        })
    ;

    $urlRouterProvider.otherwise('/');
}
