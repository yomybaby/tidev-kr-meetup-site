var keystone = require('keystone'),
	Link = keystone.list('Link');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
	locals.title = 'Add a link - SydJS';
	
	view.on('post', { action: 'add-link' }, function(next) {

		// handle form
		var newLink = new Link.model({
				author: locals.user.id,
				state: 'published',
				publishedDate: new Date()
			}),

			updater = newLink.getUpdateHandler(req, res, {
				errorMessage: 'There was an error adding your link:'
			});
		
		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'href,label,description'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				req.flash('success', 'Your link has been added successfully.');
				return res.redirect('/links/link/' + newLink.slug);
			}
			next();
		});

	});
	
	view.render('site/createLink');
	
}
