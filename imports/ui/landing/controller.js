import './landing.html';
import './header.html';
import './footer.html';



/**********************************************
template helpers
***********************************************/



/**********************************************
template events
***********************************************/
Template.Header.events({
  'click #logout'(event, instance) {
    AccountsTemplates.logout();
  }
});
