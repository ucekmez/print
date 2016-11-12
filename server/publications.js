import { Advertisers } from '/imports/api/collections/advertisers.js';
import { Printeries } from '/imports/api/collections/printeries.js';
import { Docs, Files } from '/imports/api/collections/docs.js';
import { Ads } from '/imports/api/collections/ads.js';


/******* subs for admin **********/

            /*     advertiser */

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

Meteor.publish("admin_single_advertiser_name", function(SID) {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Advertisers.find({ shortid: SID }, { fields: { 'name': 1, 'shortid': 1 } });
  }
});

Meteor.publish("admin_list_ads_for_advertiser", function(advSID) {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Ads.find({ 'meta.advertiser': advSID }).cursor;
  }
});


Meteor.publish("admin_recenty_added_advertiser_ad", function(advSID) {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Ads.find({ 'meta.advertiser': advSID, 'meta.tmp': true }).cursor;
  }
});

Meteor.publish("admin_single_advertiser_ad", function(FID) {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Ads.find(FID).cursor;
  }
});








            /*     printery */

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


            /*     user */



Meteor.publish("admin_list_users", function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Meteor.users.find({ roles: ['user'] }, {
      fields: {'emails': 1, 'profile': 1, 'roles': 1}
    });
  }
});






/******* subs for user **********/

Meteor.publish("user_list_recent_files", function() {
  if (Roles.userIsInRole(this.userId, ['user'])) {
    return Files.find({ 'meta.user': this.userId, 'meta.tmp': true }).cursor;
  }
});
