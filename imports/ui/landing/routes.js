import './landing.html';
import './header.html';
import './footer.html';
import './login.html';
import './aboutus.html';
import './notfound.html';

/**********************************************
routes
***********************************************/

FlowRouter.route('/', { name: 'home',
  action() {
    BlazeLayout.render('LandingLayout', { header: 'Header', footer: 'Footer', main: 'LandingPage' });
    NProgress.done();
  }
});


FlowRouter.route('/login', { name: 'login',
  triggersEnter: [() => {
    if (Meteor.userId()) { FlowRouter.go('home'); }
  }],
  action() {
    BlazeLayout.render('LandingLayout', { header: 'Header', footer: 'Footer', main: 'LoginPage' });
    NProgress.done();
  }
});


FlowRouter.route('/about', { name: 'about',
  action() {
    BlazeLayout.render('LandingLayout', { header: 'Header', footer: 'Footer', main: 'AboutUsPage' });
    NProgress.done();
  }
});


FlowRouter.notFound = {
  name: 'notfound',
  action() {
    BlazeLayout.render('LandingLayout', { header: 'Header', footer: 'Footer', main: 'NotFoundPage' });
    NProgress.done();
  }
};
