export function config ($logProvider, toastrConfig, FacebookProvider, cfpLoadingBarProvider) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);

  // Set options third-party lib
  toastrConfig.allowHtml = true;
  toastrConfig.timeOut = 3000;
  toastrConfig.positionClass = 'toast-top-right';
  toastrConfig.preventDuplicates = true;
  toastrConfig.progressBar = true;

  FacebookProvider.init('528815997279289'); // TODO: Add Facebook App Id

  cfpLoadingBarProvider.spinnerTemplate = '<div class="loading-backdrop"></div>';
}
