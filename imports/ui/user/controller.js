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
  tmpfiles() {
    return Files.find({}, {sort: { 'meta.createdAt': -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  }
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
          meta: { 'user': Meteor.userId(), 'tmp': true, createdAt: new Date() },
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
            Meteor.call('user_assign_file_to_doc', fileObj._id, function(err, data) {
              if (err) {
                toastr.error(err);
              }else {
                console.log(data); // debug
                toastr.info("Dosya başarılı bir şekilde yüklendi!");
                $('#user_click_to_choose').html("Buraya tıklayarak bir dosya seçin");
              }
            });
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





///////////////// helpers


Template.registerHelper("getFileSize", function(size){
  const i = Math.floor( Math.log(size) / Math.log(1024) );
  return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
});



//
