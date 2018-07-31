$(function() {
    // var len = $('div[id^=s]').length; 
    // for(var i=0; i<len; i++) {
    //     $('#s'+i).click(function() {
    //         alert(this.id); 
    //     }); 
    // }
}); 


function getStudentData(studentID, teacherID, index) {
    $.ajax({
        url: '/getStudentData',
        method: 'GET',
        data: {
            teacherID,
            studentID
        }
    })
    .done(function (dataStr) {
        var a = JSON.parse(dataStr);
        console.log(a.length);
        console.log(a[0].modules);
        var i = index.id.slice(1); 
        console.log(i); 


        //To do.. 
        //Vis kursist svar på viewet på en pænt opstillet måde 


        var $answers = $('<div/>').text(a[0].modules[0].moduleType); 
        $('#s'+i).append($answers); 
        //return dataStr; 
    });
    
}
