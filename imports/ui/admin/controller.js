import { Advertisers } from '/imports/api/collections/advertisers.js';
import { Printeries } from '/imports/api/collections/printeries.js';
import { Ads } from '/imports/api/collections/ads.js';

import './layout.html';
import './ads.html';
import './printeries.html';
import './users.html';

/**********************************************
template helpers
***********************************************/

/////////////////////////////////////// advertiser
Template.AdminListAdvertisers.helpers({
  advertisers() {
    return Advertisers.find({}, {sort: {createdAt : -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});

Template.AdminShowAdvertiser.helpers({
  advertiser() {
    return Advertisers.findOne();
  },
});

Template.AdminEditAdvertiser.helpers({
  advertiser() {
    return Advertisers.findOne();
  },
});


Template.AdminListAdvertiserAds.helpers({
  ads() {
    return Ads.find({}, { sort: { 'meta.createdAt': -1 }})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
  advertiser() {
    return Advertisers.findOne();
  },
});

Template.AdminAddNewAdvertiserAd.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.AdminAddNewAdvertiserAd.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  tmpad() {
    return Ads.findOne();
  },
  url() {
    return FlowRouter.getParam('advSID');
  },
});

Template.AdminAddNewAdvertiserAdContinue.helpers({
  tmpad() {
    return Ads.findOne();
  },
  SID() {
    return FlowRouter.getParam('advSID');
  },
});

/////////////////////////////////////// printery


Template.AdminListPrinteries.helpers({
  printeries() {
    return Printeries.find({}, {sort: {createdAt : -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});

Template.AdminEditPrintery.helpers({
  printery() {
    return Printeries.findOne({shortid : FlowRouter.getParam('prntSID')});
  },
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(39, 35),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    }
  }
});




/////////////////////////////////////// user

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

/////////////////////////////////////// advertiser

Template.AdminAddNewAdvertiser.events({
  'click #admin_add_new_advertiser_save'(event, instance) {

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
    });

    if ($("#admin-add-new-advertiser-form").valid()) {
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
    }else {
      toastr.warning("Lütfen tüm alanları doldurun.");
    }


  },
  'click #admin-add-new-advertiser-form-reset'(event, instance) {
    $('#add_new_advertiser_companyname').val()?$('#add_new_advertiser_companyname').val(""):"";
    $('#add_new_advertiser_email').val()?$('#add_new_advertiser_email').val(""):"";
    $('#add_new_advertiser_password').val()?$('#add_new_advertiser_password').val(""):"";
  }
});

Template.AdminEditAdvertiser.events({
  'click #admin_edit_advertiser_save'(event, instance) {

    $("#admin-edit-advertiser-form").validate({
      rules: {
        edit_advertiser_companyname      : { required: true, },
        edit_advertiser_commercial_name  : { required: true, },
        edit_advertiser_email            : { required: true, email: true },
        edit_advertiser_address          : { required: true },
        edit_advertiser_phone            : { required: true },
        edit_advertiser_authorized       : { required: true },
        edit_advertiser_authorized_phone : { required: true },
      },
      messages: {
        edit_advertiser_companyname      : { required: "Bu alan boş bırakılamaz.", },
        edit_advertiser_commercial_name  : { required: "Bu alan boş bırakılamaz.", },
        edit_advertiser_email            : { required: "Bu alan boş bırakılamaz.", email: "E-posta geçersiz."},
        edit_advertiser_address          : { required: "Bu alan boş bırakılamaz.", },
        edit_advertiser_phone            : { required: "Bu alan boş bırakılamaz.", },
        edit_advertiser_authorized       : { required: "Bu alan boş bırakılamaz.", },
        edit_advertiser_authorized_phone : { required: "Bu alan boş bırakılamaz.", },
      }
    });

    if ($("#admin-edit-advertiser-form").valid()) {
      const companyname      = $('#edit_advertiser_companyname').val();
      const commercial_name  = $('#edit_advertiser_commercial_name').val();
      const email            = $('#edit_advertiser_email').val();
      const password         = $('#edit_advertiser_password').val();
      const address          = $('#edit_advertiser_address').val();
      const phone            = $('#edit_advertiser_phone').val();
      const authorized       = $('#edit_advertiser_authorized').val();
      const authorized_phone = $('#edit_advertiser_authorized_phone').val();

      Meteor.call('edit_company', 'advertiser', FlowRouter.getParam('advSID'), companyname, commercial_name, email, password, address, phone, authorized, authorized_phone, function (err, data) {
        if (err) {
          toastr.error(err.reason);
        }else {
          toastr.success('Reklamveren Güncellendi!');
          FlowRouter.go('admin_ads_show_advertiser', { advSID: FlowRouter.getParam('advSID')});
        }
      });
    }else {
      toastr.warning("Lütfen tüm alanları doldurun.");
    }


  }
});


Template.AdminAddNewAdvertiserAd.events({
  'click #adminFileInput_save'(event, instance) {
    event.preventDefault();
    const input = $('.admin-inputfile')[0];
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file) {
        const existing = Ads.findOne();
        if (existing) { Meteor.call('admin_remove_existing_tmpad', existing._id, function(err, data){
            if (err) { toastr.error(err); }
          })
        }
        const uploadInstance = Ads.insert({
          file: file,
          meta: { 'advertiser': FlowRouter.getParam('advSID'), 'tmp': true, createdAt: new Date() },
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function() {
          instance.currentUpload.set(this);
        });

        uploadInstance.on('end', function(err, fileObj) {
          if (err) {
            if (err.reason === "452") {
              toastr.warning("Yalnızca JPG ve PNG yükleyebilirsiniz.");
            }else {
              toastr.warning("Azami dosya boyutu: 20 MByte");
            }
          }else {
            //Meteor.call('user_assign_file_to_doc', fileObj._id, function(err, data) {
            //  if (err) {
            //    toastr.error(err);
            //  }else {
            //    console.log(data); // debug
            //    toastr.info("Dosya başarılı bir şekilde yüklendi!");
            //    $('#user_click_to_choose').html("Buraya tıklayarak bir dosya seçin");
            //  }
            //});
            toastr.info("Dosya başarılı bir şekilde yüklendi!");
            $('#admin_click_to_choose').html("Buraya tıklayarak bir dosya seçin");
          }
          instance.currentUpload.set(false);
        });

        uploadInstance.start();
      }
    }
  },

  'change #adminFileInput'(event, instance) {
    const input = $('.admin-inputfile')[0];
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file) {
        $('#admin_click_to_choose').html(file.name);
        $('#adminFileInput_save').prop('disabled',false);
      }
    }
  },

});


















////////////////////////////////////////////////////////
                                                    ////
/////////////////////////////////////// printery    ////
                                                    ////
////////////////////////////////////////////////////////

Template.AdminAddNewPrintery.events({
  'click #admin_add_new_printery_save'(event, instance) {

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
    });

    if ($("#admin-add-new-printery-form").valid()) {
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
    }else {
      toastr.warning("Lütfen tüm alanları doldurun.");
    }


  },
  'click #admin-add-new-printery-form-reset'(event, instance) {
    $('#add_new_printery_companyname').val()?$('#add_new_printery_companyname').val(""):"";
    $('#add_new_printery_email').val()?$('#add_new_printery_email').val(""):"";
    $('#add_new_printery_password').val()?$('#add_new_printery_password').val(""):"";
  }
});

markerClicked = function(lat, lng) {
  Meteor.call('edit_printery_location', FlowRouter.getParam('prntSID'), lat, lng, function(err, data) {
    if (err) {
      toastr.error(err);
    }else {
      toastr.info("Lokasyon güncellendi!");
      MARKER_INFO.close();
      PRINTERY_MARKER.setIcon("/img/printery_icon_chosen.png");
    }
  });
}

Template.AdminEditPrintery.onRendered(() => {
  GoogleMaps.load({ key: "AIzaSyDjQEx82cOtPuQ03iG3fPsfRV1dm-vbUUs", libraries: "places"});

  Tracker.autorun(function(){
    GoogleMaps.ready('printeryMap', function(map) {
      // Add a marker to the map once it's ready
      map = map.instance;

      const printery = Printeries.findOne({ shortid: FlowRouter.getParam('prntSID')});

      if (printery && printery.location_lat && printery.location_lng) {
        const printery_marker = new google.maps.Marker({
          map: map,
          icon: "/img/printery_icon_chosen.png",
          position: {lat: parseFloat(printery.location_lat), lng: parseFloat(printery.location_lng)},
          draggable: true
        });
        PRINTERY_MARKER = printery_marker;

        map.setCenter(printery_marker.getPosition());
        map.setZoom(14);




        MARKER_INFO = new google.maps.InfoWindow({
          content: '<input type="button" onclick="markerClicked('+printery_marker.position.lat()+','+printery_marker.position.lng()+');" class="button alt" value="Bu işaretçiyi seç">'
        });
        printery_marker.addListener('click', function() {
          MARKER_INFO.open(map, printery_marker);
        });
        printery_marker.addListener('dragend', function() {
          MARKER_INFO.setContent('<input type="button" onclick="markerClicked('+printery_marker.position.lat()+','+printery_marker.position.lng()+');" class="button alt" value="Bu işaretçiyi seç">');
          printery_marker.setIcon("/img/printery_icon.png")
        });

        map.addListener('rightclick', function(e) {
          printery_marker.setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        });
      }


      var input = document.getElementById('edit_printery_address_map');
      var searchBox = new google.maps.places.SearchBox(input);

      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });


      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }


        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });


    });
  });
});

Template.AdminEditPrintery.events({
  'click #admin_edit_printery_save'(event, instance) {

    $("#admin-edit-printery-form").validate({
      focusInvalid: false,
      rules: {
        edit_printery_companyname      : { required: true, },
        edit_printery_commercial_name  : { required: true, },
        edit_printery_email            : { required: true, email: true },
        edit_printery_address          : { required: true },
        edit_printery_phone            : { required: true },
        edit_printery_authorized       : { required: true },
        edit_printery_authorized_phone : { required: true },
      },
      messages: {
        edit_printery_companyname      : { required: "Bu alan boş bırakılamaz.", },
        edit_printery_commercial_name  : { required: "Bu alan boş bırakılamaz.", },
        edit_printery_email            : { required: "Bu alan boş bırakılamaz.", email: "E-posta geçersiz."},
        edit_printery_address          : { required: "Bu alan boş bırakılamaz.", },
        edit_printery_phone            : { required: "Bu alan boş bırakılamaz.", },
        edit_printery_authorized       : { required: "Bu alan boş bırakılamaz.", },
        edit_printery_authorized_phone : { required: "Bu alan boş bırakılamaz.", },
      }
    });

    if ($("#admin-edit-printery-form").valid()) {
      const companyname      = $('#edit_printery_companyname').val();
      const commercial_name  = $('#edit_printery_commercial_name').val();
      const email            = $('#edit_printery_email').val();
      const password         = $('#edit_printery_password').val();
      const address          = $('#edit_printery_address').val();
      const phone            = $('#edit_printery_phone').val();
      const authorized       = $('#edit_printery_authorized').val();
      const authorized_phone = $('#edit_printery_authorized_phone').val();

      Meteor.call('edit_company', 'printery', FlowRouter.getParam('prntSID'), companyname, commercial_name, email, password, address, phone, authorized, authorized_phone, function (err, data) {
        if (err) {
          toastr.error(err.reason);
        }else {
          toastr.success('Matbaa Güncellendi!');
        }
      });
    }else {
      toastr.warning("Lütfen tüm alanları doldurun.");
    }



  }
});
