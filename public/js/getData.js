function getStudentData(studentID, teacherID, index) {
    
    $.ajax({
        url: '/getStudentData',
        method: 'GET',
        data: {
            teacherID,
            studentID
        },error: function(data) {
        alert('Der gik noget galt og brugeren kan ikke findes.'); //or whatever
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

function getOverviewData(studentIDs, teacherID) {

    $.ajax({
        url: '/getTestTypes',
        method: 'GET',
        data: {
            teacherID
        }
    })
    .done(function (dataStr) {
        var data = JSON.parse(dataStr);
        var ids = JSON.parse(studentIDs);

        for(var i=0; i<data.length; i++) {


            //CODE TO DO..
            //GET THE SCORE OF EACH STUDENT AND THE TOTAL POSSIBLE SCORE --> TO CALCULATE AVERAGE 
            //CONTINUE CODE ON INDEX.JS LINE 1828
            var studentID = ids[i]; 

            $.ajax({
                url: '/getStudentScore',
                method: 'GET',
                data: {
                    teacherID,
                    studentID        
                }
            })
            .done(function (dataStr) {
                var data = JSON.parse(dataStr);
                
                console.log(data); 
            }); 

            //^ ^ ^ CODE UP TO HERE ^ ^ ^ 



            if(data[i].moduleType.toLowerCase() == "kursistinfo") { continue };

            var $tr = $('<tr>').attr('id', 'tr'+i); 

            var $btn1 = $('<button>').text('+').attr('id','expandBtn'+i).click(function() { showMoreInfo(ids, this.id); }); 
            var $btn2 = $('<button>').text('-').attr('id', 'minimizeBtn'+i).click(function() { showLessInfo(ids, this.id); }).hide();

            var $td1 = $('<td>').append($btn1, $btn2); 
            var $td2 = $('<td>'+data[i].moduleType+'</td>');
            var $td3 = $('<td>Gennemsnit:</td>');

            $('#content-table').append($tr.append($td1, $td2, $td3)); 
        }
    }); 
}

function showMoreInfo(studentdIDs, btnID) {
    $('#'+btnID).hide();
    var id = btnID.slice(9);  
    $('#minimizeBtn'+id).show(); 

    for(var i=0; i<studentdIDs.length; i++) {
        var $tr = $('<tr>').attr('id','tr'+id+'-'+i); 
        var $td1 = $('<td>'+studentdIDs[i]+'</td>'); 
        if(i==0) $tr.append($td1).insertAfter($('#tr'+id)); 
        else $tr.append($td1).insertAfter($('#tr'+id+'-'+(i-1)));
        
    }
}


function showLessInfo(studentdIDs, btnID) {
    $('#'+btnID).hide();
    var id = btnID.slice(11);  
    $('#expandBtn'+id).show();

    for(var i=0; i<studentdIDs.length; i++) {
        $('#tr'+id+'-'+i).remove(); 
    }
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
