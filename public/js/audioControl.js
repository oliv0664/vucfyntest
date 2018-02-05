var audioArray = []; 

function createAudio(audiofilesArray){
    console.log(audiofilesArray.length); 

    $('p').each(function(i) {

        $audioFile = $('<audio/>').attr({
            src: audiofilesArray[i] //data.content[count].file
        });
        
        var aCount = 0; 

        $audioControl = $('<input/>').attr({
            class: 'h2size',
            type: 'button',
            id: 'audioControl' + i,
            value: 'Afspil: ' + aCount
        }).click(function() {
            // execute play sound function
            $audioFile[0].play();
            console.log("click : " + $audioControl.aCount)
            if (this.value == "Afspil: 1") {
                this.remove();
            } else {
                this.value = "Afspil: 1";
            }
            //playAudio($audioFile);  
        }); 
        $(this).prepend($audioControl);  
        
    });
    
}