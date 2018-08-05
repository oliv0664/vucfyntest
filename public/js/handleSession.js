$(function () {
	console.log('sessionHandler active');
	$('.form').bind('submit', function (event) {
		event.preventDefault(); //this will prevent the default submit

		// HER ER JEG KOMMET TIL OLIVER!
		// 1. de valgte moduler skal sættes på session storage.
		// 2. de valgte moduler skal sendes til server siden.
		var modules = [];
		var user = JSON.parse(sessionStorage.getItem('currentUser'));
		if (user) {
			var initials = user.username;
			console.log("##### ", initials);
		}




		//             $('#content').val(JSON.stringify(content));

		//             $(this).unbind('submit').submit(); // continue the submit unbind preventDefault
	});
});