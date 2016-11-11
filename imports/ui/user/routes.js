import './layout.html';
import './profile.html';
import './docs.html';


/**********************************************
routes
***********************************************/

const userRoutes = FlowRouter.group({ prefix: '/user', name: 'user'});

userRoutes.route('/', { name: 'user_dashboard',
  action() {
    BlazeLayout.render('LandingLayout', { header: 'Header', footer: 'Footer', main: 'UserPanel' });
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
    BlazeLayout.render('LandingLayout', { header: 'Header', footer: 'Footer', main: 'UserAddNewDoc' });
    NProgress.done();
  }
});

userRoutes.route('/doc/history', { name: 'user_doc_history',
  action() {
    BlazeLayout.render('LandingLayout', { header: 'Header', footer: 'Footer', main: 'UserDocHistory' });
    NProgress.done();
  }
});
