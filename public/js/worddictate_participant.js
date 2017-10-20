{   
    var totalLineCount; 
    var count; 
    var testlist; 
    var audioCount = 0; 
    
    function initializeTest(testlist) {
        
        this.testlist = testlist; 
        
        totalLineCount = testlist.lines.length; 
        count = 0; 
        
        nextLine(count);    
        
    }
    
    
    function nextLine(count) {
        
         // indsætter det første linjestykke
        $lineP1 = $('<nobr/>')
            .attr({ class: 'newLine' })
            .text(testlist.lines[count][0]); 

        $lineInput = $('<input/>').attr({
            id: 'input' + count,
            name: 'userinput',
            placeholder: 'Indsæt ord'
        }); 


        $lineP2 = $('<nobr/>')
            .attr({ class: 'newLine' })
            .text(testlist.lines[count][2]);


        /*$audioControl = $('<audio controls></audio>')
            .append('</source>')
            .attr({
                id: 'soundSrc' + count,
                src: '../images/aaaah.wav'
            }); 

        $label = $('<label/>').text(testlist.files[count]);*/ 

        
        $audioFile = $('<audio/>').attr({ src: '../images/aaaah.wav' }); 
         
        $audioControl = $('<input/>').attr({
            type: 'button',
            id: 'audioControl' + count,
            value: 'Afspil'
        }).click(function() {
            $audioFile[0].play();
            
            if(audioCount > 0) { 
                this.remove(); 
                audioCount = 0; 
            } else { 
                audioCount++;
            }
            //playAudio($audioFile);  
        });
        

        // tilføjer alle elementer til siden 
        $('#main')
            .append($lineP1)
            .append($lineInput)
            .append($lineP2)
            .append($audioControl)
//            .append($label)
            .append('<br>'); 


        
        $('#input' + count).one('keyup', function() {
            $nextButton = $('<button/>').attr({ id: 'button' + count });

            if((count+1) < totalLineCount) {
                $nextButton
                    .click(function() { next(); })
                    .text('Næste');
            } else {
                $nextButton = $('<input/>').attr({
                    type: 'submit',
                    value: 'Gem/Videre'
                }); 
            }
            
            $('#bottom').append($nextButton);  
        }); 
    }
    
    
    /*function playAudio(audioFile) {
        audioFile[0].play();
    }*/
        
        
    function next() {
        $('#audioControl' + count).remove(); 
        audioCount = 0; 
        
        count++;

        nextLine(count);  

        $('#bottom').empty();
    }
    
    
    
    // kan måske bruges når der skal tjekkes svar !!
    
    
   /* $(function() {
        
        // når der klikkes, tjekkes svarene 
        $('#submit').click(function() {
            checkAnswer();     
        });
        
    });
    
    var lineAnswerArray = []; 
    
    // tjekker svar
    function checkAnswer() {
        
        for(var i=0; i<numberOfQuestions; i++) {
            // alle svar bliver sat til små bogstaver, og fjerner mellemrum
            lineAnswerArray[i] = $('#lineInput' + i).val().toLowerCase().trim();
            
            // de korrekte svar bliver ligeledes lavet til små bogstaver, og trimmet
            var correctAnswer = dataFromParent[1][i].toLowerCase().trim()
            
            // sammenligner svar med korrekte svar, og giver feedback 
            // VIGTIGT - skal fjernes når der kommer database 
            if(lineAnswerArray[i] == correctAnswer) {
                $('#newLine' + i)
                        .css('backgroundColor','lightGreen')
                        .append('   : Det korrekte ord: ' + correctAnswer);
            } else {
                $('#newLine' + i)
                    .css('backgroundColor', 'lightGrey')
                    .append('   : Det korrekte ord: ' + correctAnswer); 
            }
        }
        
        
    }
    */
    

}