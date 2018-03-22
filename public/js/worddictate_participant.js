function initializeTest(data) {

    $(function() {

        var d = new Date(); 
        var start_time = d.getTime(); 

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
            window.scrollTo(0,0); 
            $('#back').show();

            parts[count].hide(); 
            count++; 
           
            if(count == parts.length) { createSubmit(); } else {
                parts[count].show(); 
                if(count == parts.length-1) { $('#next').val("Færdig") }
            }

        }); 
        
        
        $('#back').click(function() {
            $('#next').val("Næste"); 

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
            var d2 = new Date(); 
            var end_time = d2.getTime() - start_time;
            $('#hidden').val(end_time);  

            $('#next').hide();
            $('#back').hide(); 

            $submit = $('<input>').attr({
                class: 'h3size',
                type: 'submit',
                value: 'Slut'
            }); 

            $text = $('<p>').text('Du er nu færdig! Klik på Slut');

            $done = $('<div>').attr('id', 'done');
            $done.append($text).append($submit);
            $('#bottom').append($done); 
        }
    });
}