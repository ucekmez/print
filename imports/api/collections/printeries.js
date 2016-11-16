export const Printeries = new Mongo.Collection("printeries");

import shortid from 'shortid';

Printeries.attachSchema(new SimpleSchema({
  name             : { type: String, max: 256 },
  user             : { type: String, optional: true },
  email            : { type: String, optional: true },
  commercial_name  : { type: String, optional: true },
  address          : { type: String, optional: true },
  phone            : { type: String, optional: true },
  authorized       : { type: String, optional: true },
  authorized_phone : { type: String, optional: true },
  location_lat     : { type: String, optional: true },
  location_lng     : { type: String, optional: true },
  pickup           : { type: Boolean, optional: true },

  shortid : {
    type: String,
    autoValue: function() { if (this.isInsert) { return shortid.generate(); } },
    optional: true
  },
  createdAt       : {
    type: Date,
    autoValue: function() {
      if (this.isInsert) { return new Date(); }
      else if (this.isUpsert) { $setOnInsert: new Date(); }
      else { this.unset(); }
    }
  },
  updatedAt       : {
    type: Date,
    autoValue: function() { if (this.isInsert) { return new Date(); } else if (this.isUpdate) { return new Date(); } },
    optional: true
  }
}));

Printeries.allow({
  insert: function (userId, doc) {
    if (userId && Roles.userIsInRole(userId, ['admin'])) {
      return true;
    }
  },
  update: function (userId, doc, fields, modifier) {
    // burayi yalnizca oturum acan VE admin degistirebilir
    if (userId && (Roles.userIsInRole(userId, ['admin']) || userId === doc.user )) {
      return true;
    }
  },
  // burayi sadece oturum acan ve admin degistirebilir
  remove: function (userId, doc, fields, modifier) {
    if (userId && Roles.userIsInRole(userId, ['admin'])) {
      return true;
    }
  }
});
