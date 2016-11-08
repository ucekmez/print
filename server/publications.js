import { Advertisers } from '/imports/api/collections/advertisers.js';
import { Printeries } from '/imports/api/collections/printeries.js';
import { Docs, Files } from '/imports/api/collections/docs.js';


/******* subs for admin **********/

Meteor.publish("admin_list_advertisers", function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Advertisers.find();
  }
});

Meteor.publish("admin_single_advertiser", function(SID) {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Advertisers.find({ shortid: SID });
  }
});




Meteor.publish("admin_list_printeries", function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Printeries.find();
  }
});

Meteor.publish("admin_single_printery", function(SID) {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Printeries.find({ shortid: SID });
  }
});



Meteor.publish("admin_list_users", function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Meteor.users.find({ roles: ['user'] }, {
      fields: {'emails': 1, 'profile': 1, 'roles': 1}
    });
  }
});
