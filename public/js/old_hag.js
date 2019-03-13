  function formSetup(myFunc){
        $('#form').bind('submit', function(event) {
            event.preventDefault();
            // ORDDIKTAT ER DU NÅET TIL
            $('#form input[type = submit]').remove();
            //this will prevent the default submit
            console.log('running form setup', myFunc);
            if(myFunc){
            myFunc();
            }

            $(this).unbind('submit').submit(); // continue the submit unbind preventDefault
        });
    }