import { Advertisers } from '/imports/api/collections/advertisers.js';
import { Printeries } from '/imports/api/collections/printeries.js';

import './layout.html';
import './ads.html';
import './printeries.html';
import './users.html';

/**********************************************
template helpers
***********************************************/
Template.AdminListAdvertisers.helpers({
  advertisers() {
    return Advertisers.find({}, {sort: {createdAt : -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});

Template.AdminListPrinteries.helpers({
  printeries() {
    return Printeries.find({}, {sort: {createdAt : -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});

Template.AdminListUsers.helpers({
  users() {
    return Meteor.users.find({ roles: ['user']}, {sort: {createdAt : -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});



/**********************************************
template events
***********************************************/


Template.AdminAddNewAdvertiser.onRendered(() => {
  $("#admin-add-new-advertiser-form").validate({
    rules: {
      add_new_advertiser_companyname : { required: true, },
      add_new_advertiser_email       : { required: true, email: true },
      add_new_advertiser_password    : { required: true }
    },
    messages: {
      add_new_advertiser_companyname : { required: "Bu alan boş bırakılamaz.", },
      add_new_advertiser_email       : { required: "Bu alan boş bırakılamaz.", email: "E-posta geçersiz."},
      add_new_advertiser_password    : { required: "Bu alan boş bırakılamaz.", },
    }
  })
});

Template.AdminAddNewAdvertiser.events({
  'submit #admin-add-new-advertiser-form'(event, instance) {
      event.preventDefault();

      const companyname = $('#add_new_advertiser_companyname').val();
      const email       = $('#add_new_advertiser_email').val();
      const password    = $('#add_new_advertiser_password').val();

      Meteor.call('add_new_company', 'advertiser', companyname, email, password, function (err, data) {
        if (err) {
          toastr.error(err.reason);
        }else {
          toastr.success('Yeni Reklamveren Eklendi!');
        }
      });
  },
  'click #admin-add-new-advertiser-form-reset'(event, instance) {
    $('#add_new_advertiser_companyname').val()?$('#add_new_advertiser_companyname').val(""):"";
    $('#add_new_advertiser_email').val()?$('#add_new_advertiser_email').val(""):"";
    $('#add_new_advertiser_password').val()?$('#add_new_advertiser_password').val(""):"";
  }
});


Template.AdminAddNewPrintery.onRendered(() => {
  $("#admin-add-new-printery-form").validate({
    rules: {
      add_new_printery_companyname : { required: true, },
      add_new_printery_email       : { required: true, email: true },
      add_new_printery_password    : { required: true }
    },
    messages: {
      add_new_printery_companyname : { required: "Bu alan boş bırakılamaz.", },
      add_new_printery_email       : { required: "Bu alan boş bırakılamaz.", email: "E-posta geçersiz."},
      add_new_printery_password    : { required: "Bu alan boş bırakılamaz.", },
    }
  })
});

Template.AdminAddNewPrintery.events({
  'submit #admin-add-new-printery-form'(event, instance) {
      event.preventDefault();

      const companyname = $('#add_new_printery_companyname').val();
      const email       = $('#add_new_printery_email').val();
      const password    = $('#add_new_printery_password').val();

      Meteor.call('add_new_company', 'printery', companyname, email, password, function (err, data) {
        if (err) {
          toastr.error(err.reason);
        }else {
          toastr.success('Yeni Matbaa Eklendi!');
        }
      });
  },
  'click #admin-add-new-printery-form-reset'(event, instance) {
    $('#add_new_printery_companyname').val()?$('#add_new_printery_companyname').val(""):"";
    $('#add_new_printery_email').val()?$('#add_new_printery_email').val(""):"";
    $('#add_new_printery_password').val()?$('#add_new_printery_password').val(""):"";
  }
});
