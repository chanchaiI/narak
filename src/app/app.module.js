/* global malarkey:false, moment:false */

import { config } from './app.config';
import { routerConfig } from './app.route';
import { runBlock } from './app.run';
import { MainController } from './main/main.controller';
import { } from './components/narak.fileupload/narak.fileupload';

angular.module('narak', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ngMaterial', 'toastr', 'facebook', 'narakFileUpload'])
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .controller('MainController', MainController);
