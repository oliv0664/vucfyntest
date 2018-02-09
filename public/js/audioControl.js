var audioArray = [];
var audioIsPlaying = false;

function createAudio(audiofilesArray) {

    $('p').each(function (i) {

        //an array of audiofiles 
        audioArray[i] = $('<audio/>').attr('src', audiofilesArray[i]);

        // a counter for checking amount of clicked
        var aCount = 0;

        //audiocontrol for each audiofiles
        $audioControl = $('<input/>').attr({
            class: 'h2size',
            type: 'button',
            id: 'audioControl' + i,
            value: 'Afspil: ' + aCount
        }).click(function () {

            //when clicked, set boolean to false
            audioIsPlaying = false; 

            //check every audiofiles
            for (var j = 0; j < audioArray.length; j++) {
                //if any audio is playing (not paused)
                if (!audioArray[j][0].paused) {
                    audioIsPlaying = true;
                }
            }

            //if no audio is playing => play sound
            if (!audioIsPlaying) {
                audioArray[i][0].play();

                //check if button has been clicked
                if (this.value == "Afspil: 1") {
                    this.remove();
                } else {
                    this.value = "Afspil: 1";
                }
            }
        });
        $(this).prepend($audioControl);

    });

}