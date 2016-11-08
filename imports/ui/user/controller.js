import { ReactiveVar } from 'meteor/reactive-var';
import { Files } from '/imports/api/collections/docs.js';

import './layout.html';
import './profile.html';
import './docs.html';

/**********************************************
template helpers
***********************************************/
Template.UserAddNewDoc.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.UserAddNewDoc.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
});




/**********************************************
template events
***********************************************/

Template.UserAddNewDoc.events({
  'click #userFileInput_save'(event, instance) {
    event.preventDefault();
    const input = $('.user-inputfile')[0];
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file) {
        const uploadInstance = Files.insert({
          file: file,
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function() {
          instance.currentUpload.set(this);
        });

        uploadInstance.on('end', function(err, fileObj) {
          if (err) {
            if (err.reason === "452") {
              toastr.warning("Yalnızca PDF yükleyebilirsiniz.");
            }else {
              toastr.warning("Azami dosya boyutu: 50 MByte");
            }
          }else {
            /*Meteor.call('user_assign_file', function(err, data) {
              if (err) {
                toastr.error(err);
              }else {
                toastr.info("Dosya başarılı bir şekilde yüklendi!");
              }
            });*/
            toastr.info("Dosya başarılı bir şekilde yüklendi!");
            $('#user_click_to_choose').html("Buraya tıklayarak bir dosya seçin");
          }
          instance.currentUpload.set(false);
        });

        uploadInstance.start();
      }
    }
  },

  'change #userFileInput'(event, instance) {
    const input = $('.user-inputfile')[0];
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file) {
        $('#user_click_to_choose').html(file.name);
        $('#userFileInput_save').prop('disabled',false);
      }
    }
  },

});
