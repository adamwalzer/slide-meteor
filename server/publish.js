// some sample publishes
// Meteor.publish('contacts', function() {
// 	return Contacts.find({userId: this.userId});
// });

// Meteor.publish('users', function() {
// 	ids = [this.userId];
//   i = Contacts.find({userId: this.userId}).fetch()
// 	_.each(i, function(j) {
// 		ids.push(j.contactId);
// 	});
//   return Meteor.users.find({_id: {$in: ids}},{fields:{services:0}});
// });

// Meteor.publish('conversations', function() {
// 	return Conversations.find({$and: [{users: {$elemMatch: {userId: this.userId}}}, {deleted: {$exists: false}}]});
// });

// Meteor.publish('messages', function() {
// 	return Messages.find({}, { sort: { time: 1}});
// });

// Meteor.publish('users', function() {
// 	return Users.find();
// });

Meteor.publish('high-scores', function() {
	return HighScores.find({userId: this.userId});
});