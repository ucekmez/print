import { Advertisers } from '/imports/api/collections/advertisers.js';
import { Printeries } from '/imports/api/collections/printeries.js';


Meteor.methods({
  add_new_company(type, companyname, email, password){
    // yeni bir kullanici olusturuyoruz
    const user_id = Accounts.createUser({
      email: email,
      password: password,
    });
    // olusturdugumuz kullaniciya firma rolunu veriyoruz
    if (type == 'advertiser') {
      Roles.addUsersToRoles(user_id, ['advertiser']);
      // yeni bir firma olusturuyoruz
      const company_id = Advertisers.insert({
        name: companyname,
        commercial_name: "",
        address: "",
        phone: "",

      });
      // olusturdugumuz firmanin yetkilisi olacak kullaniciyi bagliyoruz
      Advertisers.update(company_id, { $set: {user: user_id, email: email}});
    }else if (type == 'printery') {
      Roles.addUsersToRoles(user_id, ['printery']);
      // yeni bir firma olusturuyoruz
      const company_id = Printeries.insert({
        name: companyname,
        commercial_name: "",
        address: "",
        phone: "",

      });
      // olusturdugumuz firmanin yetkilisi olacak kullaniciyi bagliyoruz
      Printeries.update(company_id, { $set: {user: user_id, email: email}});
    }else {
      return "error";
    }

  },


});
