{
    
    
    
    /*var testName = prompt('Skriv dine initialer'); 
    if(testName.length > 3 || testName.length < 3) {
        prompt('Dine initialer skal være 3 bogstaver!'); 
    }*/
    
    // spørger brugeren om deres initialer
    // VIGTIGT - skal ændres når database skal implementeres, så krusisten ikke skal indtaste initialer
    /*var initialsOutput = prompt('Skriv dine initialer'); 
    initialsOutput = initialsOutput.replace(/\s+/g, ''); 
    
    while(localStorage.getItem(initialsOutput) === null) {
        alert('Der findes ingen test med disse initialer'); 
        initialsOutput = prompt('Skriv dine initialer'); 
    } 
    
    
    // henter data ud fra initialer 
    var dataFromParent = JSON.parse(localStorage.getItem(initialsOutput));
    
    
    // dataFrom Parent ==> array 
    // dataFromParent[0] ==> lineText1Array
    // dataFromParent[1] ==> lineTextExampleArray
    // dataFromParent[2] ==> lineText2Array
    // dataFromParent[3] ==> audioSrcArray   //UPDATE - virker ikke med localstorage
    // dataFromParent[3] ==> title //UPDATE - kun så længe audio ikke virker
    
    var numberOfQuestions = dataFromParent[0].length; 
    */
    //function init() {
    
    // indsætter alle elementer fra databasen 
    
    
    var totalLineCount; 
    var count; 
    var testlist; 
    
    function initializeTest(testlist) {
        
        this.testlist = testlist; 
        
        $('#head').append('<h3>' + testlist.title + '</h3>');
        console.log(testlist.initials); 
        console.log(testlist.lines); 
        console.log(testlist.lines[0]);
        console.log(testlist.lines[0][0]);
        
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
            name: 'input',
            placeholder: 'Indsæt ord'
        }); 


        $lineP2 = $('<nobr/>')
            .attr({ class: 'newLine' })
            .text(testlist.lines[count][2]);


        $audioControl = $('<audio controls></audio>')
            .append('</source>')
            .attr({
                id: 'soundSrc' + count,
                src: testlist.files[count]
            }); 

        $label = $('<label/>').text(testlist.files[count]); 


        // tilføjer alle elementer til siden 
        $('#main')
            .append($lineP1)
            .append($lineInput)
            .append($lineP2)
            .append($audioControl)
            .append($label)
            .append('<br>'); 


        
        $('#input' + count).one('keyup', function() {
            $nextButton = $('<button/>').attr({ id: 'button' + count });

            if((count+1) < totalLineCount) {
                $nextButton
                    .click(function() { next(); })
                    .text('Næste');
            } else {
                $nextButton
                    .click(function() { save(); })
                    .text('Gem/Videre');
            }
            
            $('#bottom').append($nextButton);  
        }); 
    }
    
    
        
        
    function next() {
        count++;

        nextLine(count);  

        $('#bottom').empty();  
    }
        
        
    function save() {
        console.log('save'); 
    }
    
    
   /* $(function() {
        
        
        
        
        console.log("something"); 
        
        
    
        
        
        
        
        
        
        
        
        
    //}

    
    
    
    
    
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