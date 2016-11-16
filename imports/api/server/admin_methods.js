import { Advertisers } from '/imports/api/collections/advertisers.js';
import { Printeries } from '/imports/api/collections/printeries.js';
import { Ads } from '/imports/api/collections/ads.js';
import { Samples } from '/imports/api/collections/docs.js';

import fs from 'fs';
import PDFtools from 'fili1';

SITE_ADDRESS = "http://localhost:3000";

Meteor.methods({
  add_new_company(type, companyname, email, password){
    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      const user_id = Accounts.createUser({ email: email, password: password, });
      if (type == 'advertiser') {
        Roles.addUsersToRoles(user_id, ['advertiser']);
        const company_id = Advertisers.insert({ name: companyname, user: user_id, email: email});
        return Advertisers.findOne(company_id).shortid;
      }else if (type == 'printery') {
        Roles.addUsersToRoles(user_id, ['printery']);
        const company_id = Printeries.insert({ name: companyname, user: user_id, email: email, });
        return Printeries.findOne(company_id).shortid;
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

  admin_advertiser_ad_make_resident(ad_id, keywords, showcount, sex, age_min, age_max) {
    const ad = Ads.findOne(ad_id);
    if (ad) {
      Ads.update({ _id: ad_id }, {
        $set: {
          'meta.tmp': false,
          'meta.keywords': keywords,
          'meta.showcount': showcount,
          'meta.sex': sex,
          'meta.age_min': age_min,
          'meta.age_max': age_max,
      }});
    }
  },

  admin_preview_ad_a4(ad_id) {
    const ad = Ads.findOne(ad_id);

    const exists = Samples.findOne({ 'meta.ad': ad_id });

    if (exists) {
      return exists._id;
    }else {
      let new_file_id = "";
      const uploadInstance = Samples.load(SITE_ADDRESS + '/samples/1_page_a4.pdf', {
        meta: { 'createdAt': new Date(), 'adminsample': true, 'ad':ad_id },
        fileName: '1_page_a4.pdf',
      }, function(err, file) {
        new_file_id = file._id;

        if (file && PDFtools.isPDFValid(file.path) && ad) {

          // Session ac.
          const session = PDFtools.startEdit(file.path, {
              media: 'A4',
              writePageMetadataIntoFile: true,
              forceEdit: false,
              checkProportions: false,
            },
            {
              onComplete: function (report,library) {
                fs.rename(file.path.replace('.pdf','_processed.pdf'), file.path.replace('_processed.pdf','.pdf'), function(err) {
                  if (err) console.log('ERROR_renaming_file : ' + err);
                });
              },
              onError: function (err) {
                  PDFtools.PDFErrorHandler(err, true);
              }
          });

          // Belirlenemeyen hatalar için uyarı döndür
          process.on('uncaughtException', session.getErrorHandler());


          session
            .loadImage([
                PDFtools.image("logo", 'http://localhost:3000/img/logo_for_pages.jpg', true),
                PDFtools.image("example", ad.path, false),
            ])

            .loadText([
                PDFtools.text("numara", "__", "center", "Arial", 14, 0x999999, function (line, page) {
                    return line.replace("__", page.index+1);
                })
            ])

            .loadFont(PDFtools.font('Arial', '/Users/ugur/Desktop/FILISRC/print/data/arial.ttf'))

            .setInfo({
                author: 'Fili Labs Ltd.',
                //title: 'Fili Labs Ltd.',
                //subject: 'Fili Labs Ltd.',
                creator: 'Fili Labs Ltd.'
            })

            .select("all", function (page) {
                page.setStyle({
                    "valign": "top",
                    "margin": [10, '10%', 10, '10%'],
                    "horizontalSides": {
                        "mode": "singleSided", // doubleSided
                        "startFrom": "right",
                        "swap": "odd"
                    }
                })
                  .addBanner("logo", "right", {
                      "valign": "top",
                      "align": "center"
                  })
                  .addBanner("example", "bottom", {})
                  .addText("numara", "right", {
                      "valign": "top",
                      "align": "center",
                      "scale": "original",
                      "margin":[14, 0, 80, 0]
                  });
            })

            .save(file.path.replace('.pdf','_processed.pdf'));


        }else {
          throw new Meteor.Error(449, 'Hata! Lütfen geçerli bir PDF yükleyiniz.');
        }
      });

      if (new_file_id) { return new_file_id; }
      else { return -1; }
    }
  },

  admin_activate_ad(ad_id) {
    const ad = Ads.findOne(ad_id);
    if (ad) {
      Ads.update({ _id: ad._id}, {
        $set: {
          'meta.activated': true
        }
      })
    }
  },

  admin_passivate_ad(ad_id) {
    const ad = Ads.findOne(ad_id);
    if (ad) {
      Ads.update({ _id: ad._id}, {
        $set: {
          'meta.activated': false
        }
      })
    }
  },


});
