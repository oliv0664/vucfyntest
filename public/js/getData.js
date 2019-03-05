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
        var data = JSON.parse(dataStr);
        var ind = index.id.slice(1); 
        
        $('#b'+ind).hide(); 


        for(var i=2; i<data.length; i++) {

            if(data[i].type.toLowerCase() == "kursistinfo") {

                var $div = $('<div/>'); 
                
                var $head = $('<h3/>').text(data[i].type); 
                $div.append($head);

                $table = $('<table/>'); 
                
                for(var k=0; k<data[i].answers.length; k++) {
                    var $td = $(`
                    <td>`+data[i].answers[k].correct_answer+`</td>
                    <td>:</td>
                    <td>`+data[i].answers[k].student_answer+`</td>
                    `);  

                    var $tr = $('<tr/>').append($td); 
                    $table.append($tr);     
                }
                $div.append($table) 
                $('#d'+ind).append($div);

            } else {
    
                var $div = $('<div/>'); 
                
                var $head = $('<h3/>').text(data[i].type); 
                $div.append($head); 
                
                var $table = $('<table border="1">'); 
                var $th = $('<th>#</th><th>Kursist svar</th><th>Rigtige svar</th><th>Point</th>');
                var $tr = $('<tr/>').append($th); 
                $table.append($tr); 
                
                var count = 0; 
                
                for(var j=0; j<data[i].answers.length; j++) {
                    var $td = $(`
                    <td>`+j+`</td>
                    <td>`+data[i].answers[j].student_answer+`</td>
                    <td>`+data[i].answers[j].correct_answer+`</td>
                    <td>`+data[i].answers[j].point+`</td>
                    `);
                    var $tr = $('<tr/>').append($td); 
                    $table.append($tr); 
                    
                    if(data[i].answers[j].point == "1") {
                        count++; 
                    }
                }
                
                $div.append($table).append('<div>Antal rigtige i alt: '+count+'</div>'); 
                
                $('#d'+ind).append($div); 
            }
        }

        $('#r'+ind).show(); 
    });


}

function removeAnswers(index) {
    
    var ind = index.id.slice(1);
    
    $('#r'+ind).hide(); 
    $('#d'+ind).empty(); 
    $('#b'+ind).show();
}




//CODE TO DO!! 
//MAKE THE DATA OUTPUT NICE 
//FIRST MAKE A OVERVIEW PAGE 
//--> THIS SHOULD SHOW THE DIFFERENT TESTS AND THE AVERAGE SCORE

function getOverviewData(studentIDs, teacherID, index) {
    console.log("OOOOOOOOOOOOOOOOOOOOOOOOOO " + typeof JSON.parse(studentIDs)); 
    var ids = JSON.parse(studentIDs);
    var studentID = ids[0];  

    $.ajax({
        url: '/getStudentData',
        method: 'GET',
        data: {
            teacherID,
            studentID
        }
    })
    .done(function (dataStr) {
        var data = JSON.parse(dataStr);
        //var ind = index.id.slice(1);

        for(var i=3; i<data.length; i++) {
            
            $tr = $('<tr>'); 

            $td1 = $('<td>'+data[i].type+'</td>');
            $td2 = $('<td>Gennemsnit: '+calculateAverageScore(ids, teacherID, i)+'</td>'); 

            $('#content-table').append($tr.append($td1, $td2)); 
        }
    }); 
}


function calculateAverageScore(studentIDs, teacherID, index) {

    var totalScore = 0;

    for(var i=0; i<studentIDs.length; i++) {
        
        var studentID = studentIDs[i]; 

        $.ajax({
            url: '/getStudentData',
            method: 'GET',
            data: {
                teacherID,
                studentID
            }
        })
        .done(function (dataStr) {
            var data = JSON.parse(dataStr);
            
            for(var j=0; j<data[index].answers.length; j++) {
                if(data[index].answers[j].point == "1") {
                    totalScore++; 
                }
            }
        }); 

    }

    return totalScore; 
}
