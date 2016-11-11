import { Meteor } from 'meteor/meteor';
import '/imports/startup/server';

import shortid from 'shortid';


/**********************************************
      init the admin user
**********************************************/
Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    const users = [ {
        email: "ugur@fililabs.com",
        roles: ['admin'],
        profile : {'name': "Ugur Cekmez", 'gender': "M", 'age': "27", 'address': "YTU Teknopark", 'shortid': shortid.generate()}
      }
    ];

    users.forEach(function(user) {
      const id = Accounts.createUser({
        email: user.email,
        password: "asdasd",
        profile: user.profile
      });

      if (user.roles.length > 0) { Roles.addUsersToRoles(id, user.roles); }
      console.log("User " + user.profile.name + " added in role(s) " + user.roles);
    });
  }
});


/**********************************************
      add user role after sign up
**********************************************/
AccountsTemplates.configure({
  postSignUpHook: function(userId, info) {
    Roles.addUsersToRoles(userId, ['user']);
    profile = {'name': "", 'gender': "", 'age': "", 'address': "", 'shortid': shortid.generate()};
    Meteor.users.update({ _id: userId}, {$set: { profile: profile }});
  },
});
