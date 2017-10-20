{
    var audioCount = 0; 
    
    function initializeTest(testlist) {
        
        this.testlist = testlist; 
        
        totalLineCount = testlist.files.length; 
        count = 0; 
        
        nextLine(count);    
    }
    
    
    function nextLine(count) {
        
        $lineInput = $('<input/>').attr({
            class: 'h2size',
            id: 'input' + count,
            name: 'userinput',
            placeholder: 'Indsæt ord'
        }); 
        
        
        /*$audioControl = $('<audio controls></audio>')
            .append('</source>')
            .attr({
                id: 'soundSrc' + count,
                src: '../images/aaaah.wav'
            }); 

        $label = $('<label/>').text(testlist.files[count]);*/ 

        
        $audioFile = $('<audio/>').attr({ src: '../images/aaaah.wav' }); 
         
        $audioControl = $('<input/>').attr({
            class: 'h2size',
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
        $('#subsection')
            .append($lineInput)
            .append($audioControl)
            .append('<br>'); 
        
        
        $('#input' + count).one('keyup', function() {
            $nextButton = $('<button/>').attr({ id: 'button' + count });

            if((count+1) < totalLineCount) {
                $nextButton
                    .click(function() { next(); })
                    .text('Næste');
                $('#subsubsection').append($nextButton);  
            } else {
                $submit = $('<input/>').attr({
                    type: 'submit',
                    value: 'Gem/Videre'
                }); 
                $('#bottom').append($submit); 
            }
        }); 
    }
    
    
    function next() {
        $('#audioControl' + count).remove(); 
        audioCount = 0; 
        
        count++;

        nextLine(count);  

        $('#subsubsection').empty();
    }
}