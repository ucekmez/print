import { ReactiveVar } from 'meteor/reactive-var';
import { Docs, Files } from '/imports/api/collections/docs.js';
import { Printeries } from '/imports/api/collections/printeries.js';

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
  },
  getNumPages(fid) {
    return ReactiveMethod.call("user_get_num_pages", fid, function(err, data) {
      if (err) { return 100; }
      else { return data;  }
    });
  }
});


Template.UserSeePickupLocations.helpers({
  mapOptions() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(39, 35),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    }
  }
});

Template.UserSeePickupLocations.onRendered(() => {
  GoogleMaps.load({ key: "AIzaSyDjQEx82cOtPuQ03iG3fPsfRV1dm-vbUUs", libraries: "places"});

  Tracker.autorun(function(){
    GoogleMaps.ready('pickupLocations', function(map) {
      // Add a marker to the map once it's ready
      map = map.instance;

      const printeries = Printeries.find().fetch();

      if (printeries) {
        const bounds = new google.maps.LatLngBounds();
        const marker_info = new google.maps.InfoWindow();
        printeries.forEach(function(p) {
          const printery_marker = new google.maps.Marker({
            map: map,
            icon: "/img/printery_icon_black.png",
            position: {lat: parseFloat(p.location_lat), lng: parseFloat(p.location_lng)},
            draggable: false
          });

          bounds.extend(printery_marker.getPosition());


          printery_marker.addListener('click', function() {
            marker_info.setContent('<h3 class="pickupH3">'+p.name+'</h3>'+p.address+'<br /><a style="cursor:pointer;color:green;font-weight:bold;font-size:1.4em;" id="pickup-'+p.shortid+'">Buradan teslim al!</a>');
            marker_info.open(map, printery_marker);
            $('#pickup-'+p.shortid).on('click', function(){
              $('#chosenPickup').css('display','block');
              $('#chosenPickupButton').css('display','block');
              $('#userPickupName').html(p.name?p.name:"");
              $('#userPickupAddress').html(p.address?p.address:"");
              $('#userPickupPhone').html(p.phone?p.phone:"");
              $('#userPickupEmail').html(p.email?p.email:"");
              SELECTED_PICKUP = p._id;
            });
          });
        });
        map.fitBounds(bounds);
        map.setZoom(map.getZoom()-1);
      }
    });
  });
});


Template.UserConfirmDocsAndPickup.onRendered(() => {
  GoogleMaps.load({ key: "AIzaSyDjQEx82cOtPuQ03iG3fPsfRV1dm-vbUUs", libraries: "places"});

  Tracker.autorun(function(){
    GoogleMaps.ready('pickupLocation', function(map) {
      // Add a marker to the map once it's ready
      map = map.instance;

      const doc = Docs.findOne({ 'user': Meteor.userId(), 'is_confirmed': false });
      if (doc) {
        const pickup = Printeries.findOne({ shortid: doc.pickup });
        if (pickup) {
          const marker_info = new google.maps.InfoWindow();
          const pickup_marker = new google.maps.Marker({
            map: map,
            icon: "/img/printery_icon_black.png",
            position: {lat: parseFloat(pickup.location_lat), lng: parseFloat(pickup.location_lng)},
            draggable: false
          });
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(pickup_marker.getPosition());

          pickup_marker.addListener('click', function() {
            marker_info.setContent('<h3>'+pickup.name+'</h3>'+ pickup.phone + '</br />' +pickup.address);
            marker_info.open(map, pickup_marker);
          });

          map.fitBounds(bounds);
          map.setZoom(map.getZoom()-2);

        }
      }

    });
  });
});

Template.UserConfirmDocsAndPickup.helpers({
  doc() {
    return Docs.findOne();
  },
  tmpfiles() {
    return Files.find({}, {sort: { 'meta.createdAt': -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
  getNumFiles() {
    const files = Files.find();
    if (files) {
      return files.count();
    }
  },
  getNumPages(fid) {
    return ReactiveMethod.call("user_get_num_pages", fid, function(err, data) {
      if (err) { return 100; }
      else { return data;  }
    });
  },
  mapOptions() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(39, 35),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    }
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
          meta: { 'user': Meteor.userId(), 'tmp': true, createdAt: new Date(), 'valid': false },
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
            Meteor.call('user_check_if_valid_num_pages', fileObj._id, function(err, data) {
              if (err) { toastr.error(err.reason); }
              else {
                if (data === "ok") {
                  toastr.info("Dosya başarılı bir şekilde yüklendi!");
                  Meteor.call('user_update_profile_for_recent_file', function(err, data) { if (err) { toastr.error(err.reason); } });
                  $('#user_click_to_choose').html("Buraya tıklayarak bir dosya seçin");
                }else {
                  toastr.error("En fazla 5 dosya ve toplam 100 sayfa yükleyebilirsiniz!");
                }
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

  'click #user_delete_recently_added_file'(event, instance) {
    Meteor.call('user_delete_recently_added_file', this._id, function(err, data) {
      if (err) {
        toastr.error(err.reason);
      }else {
        Meteor.call('user_update_profile_for_recent_file', function(err, data) { if (err) { toastr.error(err.reason); } });
        toastr.info("Dosya Silindi!");
      }
    });
  },

  'click #user_cancel_upload_file'(event, instance) {
    Meteor.call('user_cancel_upload_file', function(err, data) {
      if (err) { toastr.error(err.reason); }
      else {
        toastr.info("İşleminiz iptal edildi!");
        FlowRouter.go('user_dashboard');
      }
    });
  },

});

Template.UserSeePickupLocations.events({
  'click #chosenPickupButton'(event, instance) {
    if (SELECTED_PICKUP) {
      Meteor.call('user_assign_file_to_doc', SELECTED_PICKUP, function(err, data) {
        if (err) { toastr.error(err.reason); }
        else {
          toastr.info("Teslim noktası seçildi");
          FlowRouter.go('user_confirm_docs_and_pickup');
        }
      });
    }else {
      toastr.error("Lütfen bir teslim noktası seçin!");
    }
  },
});




///////////////// helpers


Template.registerHelper("getFileSize", function(size){
  const i = Math.floor( Math.log(size) / Math.log(1024) );
  return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
});

Template.registerHelper("pickupInformation", function(pid){
  return Printeries.findOne({ shortid: pid });
});
