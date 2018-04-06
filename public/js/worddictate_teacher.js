{


    // jquery start function
    $(function () {

        // når der klikkes på denne knap
        $('#addLine').click(function () {
            addLine();
        });

        // $('#form').bind('submit', function (event) {

        //     event.preventDefault(); //this will prevent the default submit

        //     console.log("##### ", audioFiles); 
        //     $('#intro').val(JSON.stringify(audioFiles[0]));

        //     var content = [];
        //     for (var i = 0; i < lineCount; i++) {
        //         var line1 = $('#line1' + i).val();
        //         var answer = $('#answer' + i).val();
        //         var line2 = $('#line2' + i).val();
        //         var file = $('#file' + i).val();

        //         var object = {
        //             "line1": line1,
        //             "answer": answer,
        //             "line2": line2
        //         }

        //         content.push(object);
        //     }

        //     $('#content').val(JSON.stringify(content));

        //     $(this).unbind('submit').submit(); // continue the submit unbind preventDefault
        // });
    });


    // holder styr på antal linjer/sætninger
    var lineCount = 0;

    // når der trykkes på knappen
    function addLine() {

        // opretter en ny linje/paragraf
        $newLine = $('<div/>')
            .attr({
                id: 'line' + lineCount,
                class: 'h2size'
            })
            .text((lineCount + 1) + '. ')
            .css({
                'margin-top': '50px',
                'margin-bottom': '100px'
            });

        // tilføjer linjen til body
        $('#subsection').append($newLine);



        //størrelsen på tekst input felterne 
        var size = 25;

        // tilføj et tekststykke
        $newLineText1 = $('<input/>').attr({
            class: 'h2size',
            id: 'line1' + lineCount,
            type: 'text',
            name: 'line' + lineCount, //[lineText1]
            placeholder: 'Indtast tekst her',
            size: size
        });


        $newLineTextAnswer = $('<input/>').attr({
            class: 'h2size',
            id: 'answer' + lineCount,
            type: 'text',
            name: 'line' + lineCount, //[lineTextAnswer]
            placeholder: 'Indsæt det korrekte ord',
            size: (size - 6)
        });


        // tilføj endnu et tekststykke
        $newLineText2 = $('<input/>').attr({
            class: 'h2size',
            id: 'line2' + lineCount,
            type: 'text',
            name: 'line' + lineCount, //[lineText2]
            placeholder: 'Indtast tekst her',
            size: size
        });


        // tilføj en lydfil
        $audioFile = $('<input/>').attr({
            type: 'file',
            class: 'h2size',
            id: 'file' + lineCount,
            name: 'file' + lineCount, //[file]
            accept: 'audio/*',
            onchange: 'readURL(this)'
        });


        // tilføj en lydkontroller til den givne lydfil
        $audioControl = $('<audio controls></audio>')
            // .append('</source>')
            .attr('id', 'soundSrc' + lineCount);


        // tilføj alle elementer til siden 
        $('#line' + lineCount)
            .append($newLineText1)
            .append($newLineTextAnswer)
            .append($newLineText2)
            .append($audioFile)
            .append($audioControl);







        // tilføjer en slet knap
        if (lineCount == 0) {
            $removeLineButton = $('<input/>').attr({
                class: 'h2size',
                id: 'removeLineButton',
                type: 'button',
                value: 'Fjern linje'
            }).click(function () {
                removeLine();
            });


            $('#subsubsection').append($removeLineButton);

        }



        lineCount++;
    }






    // fjerner slet knap når der ikke er flere linjer 
    function removeLine() {

        $('#line' + (lineCount - 1)).remove();

        lineCount--;


        if (lineCount == 0) {
            $('#removeLineButton').remove();
        }
    }


    var audioFiles = []; 

    // indlæser en fil, som input af brugeren
    function readURL(input) {
        console.log("file input " + input); 
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            var fileSrc = input.id.substring(4);

            reader.onload = function (e) {
                $('#soundSrc' + fileSrc)
                .attr('src', e.target.result)
            };
            
            console.log("input.files ", input.files[0]); 

            reader.readAsDataURL(input.files[0]);

            var audioFile = {
                id: fileSrc,
                name: input.files[0].name,
                file: input.files[0]
            }; 

            audioFiles.push(audioFile); 
        }
        console.log("audiofile ", audioFile); 
    }



    var initialsMain;

    // når der trykkes submit


    /*function submit() {
        
        
        var dataArray = []; 
        var lineText1Array = []; 
        var lineTextExampleArray = []; 
        var lineText2Array = []; 
        var audioSrcArray = []; 
        
        // alle de indtastede elementer bliver gemt i arrays
        for(var i=0; i<lineCount; i++) {
            
            lineText1Array[i] = $('#lineText1' + i).val(); 
            lineTextExampleArray[i] = $('#lineTextExample' + i).val(); 
            lineText2Array[i] = $('#lineText2' + i).val();
            audioSrcArray[i] = $('#soundSrc' + i).attr('src'); 
            
        }
        
        // alle arrays bliver til sidst smidt in i et stort array 
        dataArray[0] = lineText1Array;
        dataArray[1] = lineTextExampleArray; 
        dataArray[2] = lineText2Array; 
        //audio kan ikke gemmes i localstorage, venter på opdatering med database
        //dataArray[3] = audioSrcArray; 
        
        
        // gemmer titlen på testen (obligatorisk)
        var testTitle = $('#testTitle').val(); 
        if(testTitle == null) {
            alert('Du skal angive en titel til din test'); 
        } else {
            
            dataArray[3] = testTitle; 
            var output = dataArray;

            
        dette stykke gemmer til localstorage
        *    
        *    // spørger brugeren om deres initialer
        *    initialsMain = prompt('Skriv dine initialer');
        *    initialsMain = initialsMain.replace(/\s+/g, '');
        *    
        *    while(initialsMain.length > 3 || initialsMain.length < 3) {
        *        initialsMain = prompt('Dine initialer skal være 3 bogstaver!'); 
        *    } 
        *
        *    // gemmer testen under den angivne bruger (initialer) 
        *    localStorage.setItem(initialsMain, JSON.stringify(output)); 
        *
        
            
            
            
            // åbner et nyt vindue
            var url = "output.html";
            var openWindow = window.open(url);

            openWindow.dataFromParent = output;
            openWindow.addEventListener('load', function(){
                openWindow.init(); 
            });
            
        }
        
    }*/


}
