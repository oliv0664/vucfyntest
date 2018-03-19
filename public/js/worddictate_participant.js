function initializeTest(data) {

    $(function() {

        $('#back').hide(); 

        var parts = [];

        var $1 = $('#første_del');
        var $2 = $('#anden_del'); 
        var $3 = $('#tredje_del'); 
        var $4 = $('#fjerde_del');
        var $5 = $('#femte_del'); 

        parts.push($2, $3, $4, $5);  
        parts.forEach(function(e) { e.hide(); });
        parts.unshift($1); 

        var count = 0; 

        $('#next').click(function() {
            $('#back').show();

            parts[count].hide(); 
            count++; 
            if(count == parts.length) { createSubmit(); } else {
                parts[count].show(); 
            }

        }); 
        
        
        $('#back').click(function() {

            if(count < parts.length) { 
                parts[count].hide(); 
            } else {
                $('#done').remove(); 
                $('#next').show(); 
            } 
            count--; 
            parts[count].show(); 
            
            if(count == 0) { $('#back').hide(); } 
        }); 



        function createSubmit() {
            $('#next').hide();

            $submit = $('<input>').attr({
                class: 'h3size',
                type: 'submit',
                value: 'Færdig'
            }); 

            $text = $('<p>').text('Du er nu færdig! Klik på Færdig');

            $done = $('<div>').attr('id', 'done');
            $done.append($text).append($submit);
            $('#bottom').append($done); 
        }
    });
}