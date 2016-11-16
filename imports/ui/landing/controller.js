import { Session } from 'meteor/session';

import './landing.html';
import './header.html';
import './footer.html';
import './loading.html';



/**********************************************
template helpers
***********************************************/


// loading mesajlari
Template.LoadingLayout.onRendered(function () {
  if ( ! Session.get('loadingSplash') ) {
    this.loading = window.pleaseWait({
      logo: '/img/logo.png',
      backgroundColor: '#7f8c8d',
      loadingHtml: '<p class="loading-message">Yükleniyor</p> <div class="spinner"><div><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>',
    });
    Session.set('loadingSplash', true); // just show loading splash once
  }
});

Template.LoadingLayout.onDestroyed(function () {
  if ( this.loading ) {
    this.loading.finish();
  }
});



/**********************************************
template events
***********************************************/
Template.Header.events({
  'click #logout'(event, instance) {
    AccountsTemplates.logout();
  }
});
