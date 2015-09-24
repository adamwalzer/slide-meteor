// some sample subscribes
// Meteor.subscribe("users", function() {
// 	Session.set('usersLoaded',true);
// });
// Meteor.subscribe("messages");

// Meteor.subscribe("users");

// localUser = new Ground.Collection(Users);
// Session.set("userId",undefined);
// if(localUser.find({}).fetch()[0]) {
// 	Session.set("userId", localUser.find({}).fetch()[0]._id);
// }
// console.log(Session.get("userId"));
// if(!Session.get("userId")) {
// 	Session.set("userId",localUser.insert({"original-high-score":0}));
// 	console.log(Session.get("userId"));
// 	console.log(localUser.find({_id:Session.get("userId")}).fetch()[0]);
// }

Meteor.subscribe("high-scores");