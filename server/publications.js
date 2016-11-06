import { Advertisers } from '/imports/api/collections/advertisers.js';
import { Printeries } from '/imports/api/collections/printeries.js';


/******* subs for admin **********/

Meteor.publish("admin_list_advertisers", function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Advertisers.find();
  }
});

Meteor.publish("admin_list_printeries", function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Printeries.find();
  }
});

Meteor.publish("admin_list_users", function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Meteor.users.find({ roles: ['user'] }, {
      fields: {'emails': 1, 'profile': 1, 'roles': 1}
    });
  }
});
