setInterval(function() { Session.set("time", new Date()); }, 60000);
Template.registerHelper("dateFromNow", function(date){
  Session.get('time');
  return moment(date).fromNow();
});

Template.registerHelper('equals', function(s1, s2){
  return s1 === s2;
});


Template.registerHelper('page', function(s1){
  return FlowRouter.getRouteName() == s1;
});
