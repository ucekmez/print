import './layout.html';
import './profile.html';
import './docs.html';


/**********************************************
routes
***********************************************/

const userRoutes = FlowRouter.group({ prefix: '/user', name: 'user',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('user_info', Meteor.subscribe("user_info"));
    }
  },
});

userRoutes.route('/', { name: 'user_dashboard',
  action() {
    BlazeLayout.render('UserLayout', { header: 'Header', footer: 'Footer', main: 'UserPanel' });
    NProgress.done();
  }
});

userRoutes.route('/doc/new', { name: 'user_add_new_doc',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('user_list_recent_files', Meteor.subscribe("user_list_recent_files"));
    }
  },
  action() {
    BlazeLayout.render('UserLayout', { header: 'Header', footer: 'Footer', main: 'UserAddNewDoc' });
    FlowRouter.subsReady("user_list_recent_files", function() {
      NProgress.done();
    });
  }
});

userRoutes.route('/pickup/locations', { name: 'user_see_available_pickups',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('user_list_pickup_locations', Meteor.subscribe("user_list_pickup_locations"));
    }
  },
  action() {
    BlazeLayout.render('UserLayout', { header: 'Header', footer: 'Footer', main: 'UserSeePickupLocations' });
    FlowRouter.subsReady("user_list_pickup_locations", function() {
      NProgress.done();
    });
  }
});


userRoutes.route('/confirm', { name: 'user_confirm_docs_and_pickup',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('user_selected_doc_process', Meteor.subscribe("user_selected_doc_process"));
    }
  },
  action() {
    BlazeLayout.render('UserLayout', { header: 'Header', footer: 'Footer', main: 'UserConfirmDocsAndPickup' });
    FlowRouter.subsReady("user_selected_doc_process", function() {
      NProgress.done();
    });
  }
});





userRoutes.route('/doc/history', { name: 'user_doc_history',
  action() {
    BlazeLayout.render('UserLayout', { header: 'Header', footer: 'Footer', main: 'UserDocHistory' });
    NProgress.done();
  }
});
