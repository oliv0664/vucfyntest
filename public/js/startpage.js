$(function() {

    $('.showIfYes').each(function() {
        $(this).hide(); 
    });
    
    $('.checkIfYes').children('select').change(function() {
        if( $(this).val() == "Ja" ) {
            $(this).parent('.checkIfYes').children('.showIfYes').show(); 
        } else {
            $(this).parent('.checkIfYes').children('.showIfYes').hide(); 
        }
    }); 
    
    

}); 