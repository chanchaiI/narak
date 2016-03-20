/* global malarkey:false, moment:false */

import { config } from './app.config';
import { routerConfig } from './app.vote.route';
import { runBlock } from './app.run';
import { constant } from './app.constant';
import { DataService } from './services/data.service';
import { PostService } from './services/post.service';
import { ImageDialogController } from './vote/image.dialog.controller'
import { VoteController } from './vote/vote.controller';

angular.module('narak', ['ngAnimate', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ngMaterial', 'facebook', 'angular-loading-bar'])
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('CONSTANT', constant)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .service('DataService', DataService)
    .service('PostService', PostService)
    .controller('ImageDialogController', ImageDialogController)
    .controller('VoteController', VoteController)
;
