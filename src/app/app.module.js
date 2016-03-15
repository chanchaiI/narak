/* global malarkey:false, moment:false */

import { config } from './app.config';
import { routerConfig } from './app.route';
import { runBlock } from './app.run';
import { constant } from './app.constant';
import { DataService } from './services/data.service';
import { IntroController } from './intro/intro.controller';
import { DataCaptureController } from './data-capture/data-capture.controller';
import { SelectTemplateController } from './select-template/select-template.controller';
import { MainController } from './main/main.controller';
import { ShareController } from './share/share.controller';
import { } from './components/narak.fileupload/narak.fileupload';
import { VoteController } from './vote/vote.controller';

angular.module('narak', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ngMaterial', 'toastr', 'facebook', 'narakFileUpload', 'angular-loading-bar'])
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('CONSTANT', constant)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .service('DataService', DataService)
    .controller('IntroController', IntroController)
    .controller('DataCaptureController', DataCaptureController)
    .controller('SelectTemplateController', SelectTemplateController)
    .controller('MainController', MainController)
    .controller('ShareController', ShareController)
    .controller('VoteController', VoteController)
;
