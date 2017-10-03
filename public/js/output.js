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
    
    
    
    
    function initializeTest(testlist) {
        
        
        $('#head').append('<h3>' + testlist.title + '</h3>');
        console.log(testlist.initials); 
        console.log(testlist.lines); 
        console.log(testlist.lines.line0);
        console.log(testlist.lines.line0[0]);
        
            //console.log(a.lineText1); 
            // indsætter det første linjestykke
            $lineP1 = $('<nobr/>   ')
                .attr({ class: 'newLine' })
                .text(testlist.lines.line0[0]); 
            
            $lineInput = $('   <input/>   ').attr({
                id: 'input',
                name: 'input',
                placeholder: 'Indsæt ord'
            }); 
        
        
            $lineP2 = $('   <nobr/>')
                .attr({ class: 'newLine' })
                .text(testlist.lines.line0[2]);
            
            // indsætter et input felt, hvor kursisten kan indtaste svar
            /*$lineInputP = $('<input/>').attr({
                id: 'lineInput' + i,
                type: 'text',
                placeholder: 'Indsæt et ord her'
            }); 
            
            // andet linjestykke
            $line2P = $('<nobr/>')
                .attr({ 
                    class: 'newline',
                    id: 'newLine' + i 
                })
                .text(dataFromParent[2][i]); */
            
            
            // virker ikke med localstorage
            /*$audioControl = $('<audio controls></audio>')
                .append('</source>')
                .attr({
                    id: 'soundSrc' + i,
                    src: dataFromParent[3][i]
                });*/ 
            
            
            // tilføjer alle elementer til siden 
            $('#main')
                .append($lineP1)
                .append($lineInput)
                .append($lineP2); 
                /*.append($lineInputP)
                .append($line2P)
                //.append($audioControl)
                .append('<br>'); */
            
          
            
        
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