import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/landing/loading.html';

/************************************************
router files
*************************************************/
import '/imports/ui/landing/routes.js';
import '/imports/ui/admin/routes.js';
import '/imports/ui/printery/routes.js';
import '/imports/ui/user/routes.js';


/************************************************
controller files
*************************************************/
import '/imports/ui/landing/controller.js';
import '/imports/ui/admin/controller.js';
import '/imports/ui/printery/controller.js';
import '/imports/ui/user/controller.js';


/************************************************
routes
*************************************************/

FlowRouter.triggers.enter([() => {
  if (Meteor.loggingIn()) { BlazeLayout.render('LoadingLayout');}
  NProgress.start();
}]);
