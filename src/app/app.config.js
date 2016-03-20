export function config ($logProvider, FacebookProvider, cfpLoadingBarProvider, $locationProvider) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);
  $locationProvider.html5Mode(true);
  FacebookProvider.init('528812520612970'); // TODO: Add Facebook App Id

  cfpLoadingBarProvider.spinnerTemplate = '<div class="loading-backdrop"></div>';
}
