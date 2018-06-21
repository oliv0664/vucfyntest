$(function() {

    $('#addButton').click(function() {

        //get number of elements 
        var len = $('#section div').length; 

        //create empty div to hold input fields
        var element = $('<div/>').attr({
            id: 'element' + len
        }).css({
            width: '100%',
            marginBottom: '20px'
        }); 

        //create input field for teacher_input
        var teacher_input = $('<input/>').attr({
            type: 'text',
            name: 'element'+len,
            placeholder: 'Skriv en titel til indtastningsfeltet'
        }).width('40vw'); 

        //create text label for student_input
        var student_input = $('<span/>').css({
            marginLeft: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            border: "1px solid black"
        }).text('Her kommer kursistens svarfelt til at være'); 

        //append elements
        element.append(teacher_input).append(student_input);
        $('#section').append(element); 
    }); 



    $('#removeButton').click(function() {
        var len = $('#section div').length; 
        console.log(len); 
        
        $('#element' + (len-1)).remove();         
    }); 

}); 