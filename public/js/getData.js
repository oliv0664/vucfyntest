function getStudentData(studentID, teacherID, index) {
    
    console.log(studentID);
    console.log(teacherID);

    $.ajax({
        url: '/getStudentData',
        method: 'GET',
        data: {
            teacherID,
            studentID
        }
    })
    .done(function (dataStr) {
        console.log(dataStr);
        var data = JSON.parse(dataStr);
        var ind = index.id.slice(1); 


        //To do.. 
        //Mangler at tage højde for kursist info

        for(var i=2; i<data.length; i++) {
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

    });
    
}

function removeAnswers(index) {
    console.log(index); 
    var ind = index.id.slice(1);
    console.log(ind);  
    $('#d'+ind).empty(); 


    //skal også fjerne + knappen, og tilføje den igen 
}