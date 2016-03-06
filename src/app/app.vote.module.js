/* global malarkey:false, moment:false */

import { config } from './app.config';
import { routerConfig } from './app.vote.route';
import { runBlock } from './app.run';
import { constant } from './app.constant';
import { DataService } from './services/data.service';
import { VoteController } from './vote/vote.controller';
import { VoteDetailController } from './vote-detail/vote-detail.controller';
import { } from './components/narak.fileupload/narak.fileupload';

angular.module('narak', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ngMaterial', 'toastr', 'facebook', 'angular-loading-bar'])
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('CONSTANT', constant)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .service('DataService', DataService)
    .controller('VoteController', VoteController)
    .controller('VoteDetailController', VoteDetailController)
;
