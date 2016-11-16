import './layout.html';
import './ads.html';
import './printeries.html';
import './users.html';


/**********************************************
routes
***********************************************/

const adminRoutes = FlowRouter.group({ prefix: '/manage', name: 'admin'});

adminRoutes.route('/', { name: 'admin_dashboard',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('admin_list_samples', Meteor.subscribe("admin_list_samples"));
    }
  },
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminFirstPage' });
    NProgress.done();
  }
});


///////////////////////////////////////////// adminAdRoutes


const adminAdRoutes = adminRoutes.group({ prefix: "/ads", name: "admin_ads"});

adminAdRoutes.route('/', { name: 'admin_ads_index',
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminAdsIndex' });
    NProgress.done();
  }
});

adminAdRoutes.route('/new', { name: 'admin_ads_add_new_advertiser',
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminAddNewAdvertiser' });
    NProgress.done();
  }
});

adminAdRoutes.route('/show/:advSID', { name: 'admin_ads_show_advertiser',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('admin_single_advertiser', Meteor.subscribe("admin_single_advertiser", params.advSID));
    }
  },
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminShowAdvertiser' });
    FlowRouter.subsReady("admin_single_advertiser", function() {
      NProgress.done();
    });
  }
});

adminAdRoutes.route('/edit/:advSID', { name: 'admin_ads_edit_advertiser',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('admin_single_advertiser', Meteor.subscribe("admin_single_advertiser", params.advSID));
    }
  },
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminEditAdvertiser' });
    FlowRouter.subsReady("admin_single_advertiser", function() {
      NProgress.done();
    });
  }
});


adminAdRoutes.route('/list', { name: 'admin_ads_list_advertisers',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('admin_list_advertisers', Meteor.subscribe("admin_list_advertisers"));
    }
  },
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminListAdvertisers' });
    FlowRouter.subsReady("admin_list_advertisers", function() {
      NProgress.done();
    });
  }
});

adminAdRoutes.route('/:advSID/ads', { name: 'admin_ads_list_advertiser_ads',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('admin_list_ads_for_advertiser', Meteor.subscribe("admin_list_ads_for_advertiser", params.advSID));
      this.register('admin_single_advertiser_name', Meteor.subscribe("admin_single_advertiser_name", params.advSID));
    }
  },
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminListAdvertiserAds' });
    FlowRouter.subsReady("admin_list_ads_for_advertiser", function() {
      NProgress.done();
    });
  }
});

adminAdRoutes.route('/:advSID/new', { name: 'admin_ads_add_new_advertiser_ad',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('admin_recenty_added_advertiser_ad', Meteor.subscribe("admin_recenty_added_advertiser_ad", params.advSID));
    }
  },
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminAddNewAdvertiserAd' });
    FlowRouter.subsReady("admin_recenty_added_advertiser_ad", function() {
      NProgress.done();
    });
  }
});

adminAdRoutes.route('/:advSID/new/continue', { name: 'admin_ads_add_new_advertiser_ad_continue',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('admin_recenty_added_advertiser_ad', Meteor.subscribe("admin_recenty_added_advertiser_ad", params.advSID));
    }
  },
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminAddNewAdvertiserAdContinue' });
    FlowRouter.subsReady("admin_recenty_added_advertiser_ad", function() {
      NProgress.done();
    });
  }
});

adminAdRoutes.route('/:FID/edit', { name: 'admin_ads_add_new_advertiser_ad_continue_edit',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('admin_single_advertiser_ad', Meteor.subscribe("admin_single_advertiser_ad", params.FID));
    }
  },
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminAddNewAdvertiserAdContinueEdit' });
    FlowRouter.subsReady("admin_single_advertiser_ad", function() {
      NProgress.done();
    });
  }
});

adminAdRoutes.route('/preview/:FID', { name: 'admin_add_preview_on_pdf',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('admin_single_advertiser_ad', Meteor.subscribe("admin_single_advertiser_ad", params.FID));
      this.register('admin_list_samples', Meteor.subscribe("admin_list_samples", params.FID));
    }
  },
  action(params) {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminAdvertiserAdPreviewOnPDF' });
    FlowRouter.subsReady("admin_single_advertiser_ad", function() {
      NProgress.done();
    });
  }
});




///////////////////////////////////////////// adminPrinteryRoutes


const adminPrinteryRoutes = adminRoutes.group({ prefix: "/printeries", name: "admin_printeries"});
adminPrinteryRoutes.route('/', { name: 'admin_printeries_index',
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminPrinteriesIndex' });
    NProgress.done();
  }
});

adminPrinteryRoutes.route('/new', { name: 'admin_printeries_add_new_printery',
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminAddNewPrintery' });
    NProgress.done();
  }
});

adminPrinteryRoutes.route('/edit/:prntSID', { name: 'admin_printeries_edit_printery',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('admin_single_printery', Meteor.subscribe("admin_single_printery", params.prntSID));
    }
  },
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminEditPrintery' });
    FlowRouter.subsReady("admin_single_printery", function() {
      NProgress.done();
    });
  }
});

adminPrinteryRoutes.route('/list', { name: 'admin_printeries_list_printeries',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('admin_list_printeries', Meteor.subscribe("admin_list_printeries"));
    }
  },
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminListPrinteries' });
    FlowRouter.subsReady("admin_list_printeries", function() {
      NProgress.done();
    });
  }
});

///////////////////////////////////////////// adminUserRoutes


const adminUserRoutes = adminRoutes.group({ prefix: "/users", name: "admin_users"});
adminUserRoutes.route('/', { name: 'admin_users_index',
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminUsersIndex' });
    NProgress.done();
  }
});

adminUserRoutes.route('/list', { name: 'admin_list_users',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('admin_list_users', Meteor.subscribe("admin_list_users"));
    }
  },
  action() {
    BlazeLayout.render('AdminLayout', { header: 'Header', footer: 'Footer', panel: 'AdminPanel', main: 'AdminListUsers' });
    FlowRouter.subsReady("admin_list_users", function() {
      NProgress.done();
    });
  }
});







//
