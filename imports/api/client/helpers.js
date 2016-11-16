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

Template.registerHelper('sexToString', function(s){
  if (s === '1') { return "Erkek-Kadın"; }
  if (s === '2') { return "Erkek"; }
  if (s === '3') { return "Kadın"; }
});



Template.registerHelper("isValidPDF", function(fid){
  return ReactiveMethod.call("user_is_pdf_valid", fid, function(err, data) {
    if (err) { return false; }
    else { return data;  }
  });
});
