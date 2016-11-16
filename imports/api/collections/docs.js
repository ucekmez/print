export const Docs = new Mongo.Collection("docs");

import { FilesCollection } from 'meteor/ostrio:files';

import shortid from 'shortid';


Docs.attachSchema(new SimpleSchema({
  user             : { type: String, optional: true },
  files            : { type: [String], optional: true },
  pickup           : { type: String, optional: true },
  is_confirmed     : { type: Boolean, optional: true },
  is_printed       : { type: Boolean, optional: true },

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
  storagePath: function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return '/Users/ugur/Desktop/FILISRC/print/data/files/'+year+'/'+month;
  },
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



export const Samples = new FilesCollection({
  collectionName: 'Samples',
  allowClientCode: false,
  storagePath: function () {

    return '/Users/ugur/Desktop/FILISRC/print/data/samples/files/';
  },
  onBeforeUpload: function(file) {
    // if file size < 10x2 Mbyte and file extension is pdf
    if (file.size <= 10485760*1) {
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
