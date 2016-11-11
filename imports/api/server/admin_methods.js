import { Advertisers } from '/imports/api/collections/advertisers.js';
import { Printeries } from '/imports/api/collections/printeries.js';
import { Ads } from '/imports/api/collections/ads.js';


Meteor.methods({
  add_new_company(type, companyname, email, password){
    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      const user_id = Accounts.createUser({ email: email, password: password, });
      if (type == 'advertiser') {
        Roles.addUsersToRoles(user_id, ['advertiser']);
        const company_id = Advertisers.insert({ name: companyname, user: user_id, email: email});
      }else if (type == 'printery') {
        Roles.addUsersToRoles(user_id, ['printery']);
        const company_id = Printeries.insert({ name: companyname, user: user_id, email: email, });
      }else {
        return "error";
      }
    }
  },

  edit_company(type, sid, companyname, commercial_name, email, password, address, phone, authorized, authorized_phone){
    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      if (type == 'advertiser') {
        const company = Advertisers.findOne({ shortid: sid });

        try {
          Meteor.users.update({ _id: company.user}, { $set: { 'emails.0.address': email }});
        }catch (err) { throw new Meteor.Error(451, 'Hata! Bu Email zaten kayıtlı'); }
        Advertisers.update({ _id: company._id }, {
          $set: {
            name: companyname,
            email: email,
            address: address,
            phone: phone,
            commercial_name: commercial_name,
            authorized: authorized,
            authorized_phone: authorized_phone
          }
        });
        if (password) {
          Accounts.setPassword(company.user, password);
        }
      }else if (type == 'printery') {
        const company = Printeries.findOne({ shortid: sid });

        try {
          Meteor.users.update({ _id: company.user}, { $set: { 'emails.0.address': email }});
        }catch (err) { throw new Meteor.Error(451, 'Hata! Bu Email zaten kayıtlı'); }

        Printeries.update({ _id: company._id }, {
          $set: {
            name: companyname,
            email: email,
            address: address,
            phone: phone,
            commercial_name: commercial_name,
            authorized: authorized,
            authorized_phone: authorized_phone
          }
        });
        if (password) {
          Accounts.setPassword(company.user, password);
        }
      }else { return "error"; }
    }
  },

  edit_printery_location(sid, lat, lng) {
    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Printeries.update({ shortid: sid }, {
        $set: {
          location_lat: lat,
          location_lng: lng
        }
      });
    }
  },

  admin_remove_existing_tmpad(aid) {
    Ads.remove(aid);
  },


});
