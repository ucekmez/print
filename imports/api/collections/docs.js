export const Docs = new Mongo.Collection("docs");
import { FilesCollection } from 'meteor/ostrio:files';

import shortid from 'shortid';

Docs.attachSchema(new SimpleSchema({
  user             : { type: String, optional: true },
  name             : { type: String, optional: true },
  file             : { type: String, optional: true },

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

Docs.allow({
  insert: function (userId, doc) {
    if (userId && Roles.userIsInRole(userId, ['admin', 'user'])) {
      return true;
    }
  },
  update: function (userId, doc, fields, modifier) {
    // burayi yalnizca oturum acan VE admin degistirebilir
    if (userId && ( Roles.userIsInRole(userId, ['admin']) || userId === doc.user )) {
      return true;
    }
  },
  // burayi sadece oturum acan ve admin degistirebilir
  remove: function (userId, doc, fields, modifier) {
    if (userId && ( Roles.userIsInRole(userId, ['admin']) || userId === doc.user )) {
      return true;
    }
  }
});


export const Files = new FilesCollection({
  collectionName: 'Files',
  allowClientCode: false,
  onBeforeUpload: function(file) {
    // if file size < 10x2 Mbyte and file extension is pdf
    if (file.size <= 10485760*5) {
      if (/pdf/i.test(file.extension)) {
        return true;
      }else {
        return "452"; // dosya pdf degil
      }
    }else {
      return "453"; // dosya cok buyuk
    }
  }
});
