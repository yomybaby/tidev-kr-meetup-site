var keystone = require('keystone'),
	Types = keystone.Field.Types;

var User = new keystone.List('User', {
	autokey: { path: 'key', from: 'name', unique: true }
});

var deps = {
	mentoring: { 'mentoring.available': true }
}

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: false }
}, 'Profile', {
	organisation: { type: Types.Relationship, ref: 'Organisation' },
	github: { type: String, width: 'short' },
	twitter: { type: String, width: 'short' },
	website: { type: Types.Url },
	bio: { type: Types.Html, wysiwyg: true }
}, 'Mentoring', {
	mentoring: {
		available: { type: Boolean, label: 'Is Available' },
		free: { type: Boolean, label: 'For Free', dependsOn: deps.mentoring },
		paid: { type: Boolean, label: 'For Payment', dependsOn: deps.mentoring },
		swap: { type: Boolean, label: 'For Swap', dependsOn: deps.mentoring },
		have: { type: String, label: 'Has...', dependsOn: deps.mentoring },
		want: { type: String, label: 'Wants...', dependsOn: deps.mentoring }
	}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can Admin SydJS' }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

User.relationship({ ref: 'Post', refPath: 'author', path: 'talks' });
User.relationship({ ref: 'Talk', refPath: 'who', path: 'talks' });

User.addPattern('standard meta');
User.defaultColumns = 'name, email, twitter, isAdmin';
User.register();