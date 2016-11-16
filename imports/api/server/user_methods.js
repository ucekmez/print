import { Docs, Files } from '/imports/api/collections/docs.js';
import { Printeries } from '/imports/api/collections/printeries.js';

import PDFtools from 'fili1';


Meteor.methods({
  user_delete_recently_added_file(fid) {
    const file = Files.findOne(fid);
    if (file && file.meta.user == Meteor.userId()) {
      Files.remove(fid);
      Meteor.call('user_update_profile_for_recent_file', function(err, data) {});
    }else {
      throw new Meteor.Error(450, 'Hata! Yetki verilemedi');
    }
  },

  user_get_num_pages(fid) {
    const file = Files.findOne(fid);
    if (file && file.meta.user == Meteor.userId()) {
      return PDFtools.getNumPages(file.path);
    }else {
      throw new Meteor.Error(450, 'Hata! Yetki verilemedi');
    }
  },

  user_is_pdf_valid(fid) {
    const file = Files.findOne(fid);
    if (file && file.meta.user == Meteor.userId()) {
      return PDFtools.isPDFValid(file.path);
    }else {
      throw new Meteor.Error(450, 'Hata! Yetki verilemedi');
    }
  },

  user_check_if_valid_num_pages(fid) {
    const file = Files.findOne(fid);

    if (PDFtools.isPDFValid(file.path)) {
      if (file && file.meta.user == Meteor.userId()) {
        const file_numpages = PDFtools.getNumPages(file.path);
        const user = Meteor.user();
        const files_count = Files.find({ 'meta.user': user._id, 'meta.valid': true, 'meta.tmp': true }).count()
        if (file_numpages > 100 || user.recentpages+file_numpages > 100 || files_count > 4) {
          Files.remove(fid);
        }else {
          Files.update({ _id: fid }, { $set: { 'meta.valid': true }});
          return "ok";
        }
      }else {
        throw new Meteor.Error(450, 'Hata! Yetki verilemedi');
      }
    }else {
      Files.remove(fid);
      throw new Meteor.Error(448, 'Hata! Lütfen geçerli bir PDF yükleyin');
    }
  },

  user_update_profile_for_recent_file() {
    const files = Files.find({ 'meta.user': Meteor.userId(), 'meta.tmp': true }).fetch();
    let total_pages = 0;
    files.forEach(function(f) { total_pages += PDFtools.getNumPages(f.path); });
    Meteor.users.update({_id: Meteor.userId()}, { $set: {
      'recentpages': total_pages
    }});
  },

  user_cancel_upload_file() {
    const user_id = Meteor.userId();
    Files.remove({ 'meta.user': user_id});
    Meteor.call('user_update_profile_for_recent_file', function(err, data) {});
  },

  user_assign_file_to_doc(pickup_id) {
    const pickup = Printeries.findOne(pickup_id);
    if (pickup) {
      const files = new Array();
      Files.find({ 'meta.user': Meteor.userId(), 'meta.tmp': true }).fetch().forEach(function(f) {
        files.push(f._id);
      });

      const exists = Docs.findOne({'user': Meteor.userId(), 'is_confirmed': false });

      if (exists) {
        Docs.update({ _id: exists._id}, { $set: { 'pickup': pickup.shortid }});
        return exists._id;
      }else {
        const doc_id = Docs.insert({
          user: Meteor.userId(),
          files: files,
          pickup: pickup.shortid,
          is_confirmed: false,
        });

        return doc_id;
      }
    }
  }

});
