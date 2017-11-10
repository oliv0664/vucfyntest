{
    var totalLineCount;
    var count;
    var testlist;
    var audioCount = 0;
    var d = new Date();
    var startTime;
    var checkpoint;

    function initializeTest(testlist) {

        this.testlist = testlist;

        totalLineCount = testlist.files.length;
        count = 0;

        $('#start').click(function () {
            startTime = d.getTime();
            checkpoint = startTime;
            console.log(startTime);

            nextLine(count);
            this.remove();
        });


        //lydfil til at afspille opgavebeskrivelsen
        $audioFile = $('<audio/>').attr({
            src: '../images/aaaah.wav'
        });

        $audioControl = $('<input/>').attr({
            class: 'h2size',
            type: 'button',
            id: 'audioControl' + count,
            value: 'Afspil'
        }).click(function () {
            $audioFile[0].play();

            if (audioCount > 0) {
                this.remove();
                audioCount = 0;
            } else {
                audioCount++;
            }
            //playAudio($audioFile);  
        });

        $('#subsection').prepend($audioControl);
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


        $audioFile = $('<audio/>').attr({
            src: '../images/aaaah.wav'
        });

        $audioControl = $('<input/>').attr({
            class: 'h2size',
            type: 'button',
            id: 'audioControl' + count,
            value: 'Afspil'
        }).click(function () {
            $audioFile[0].play();

            if (audioCount > 0) {
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


        $('#input' + count).one('keyup', function () {
            $nextButton = $('<button/>').attr({
                class: 'h2_size',
                id: 'button' + count
            });

            if ((count + 1) < totalLineCount) {
                $nextButton
                    .click(function () {
                        next();
                    })
                    .text('Næste');
                $('#subsubsection').append($nextButton);
            } else {
                $submit = $('<input/>').attr({
                    type: 'submit',
                    value: 'Gem/Videre'
                }).click(submitForm());
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

    function submitForm() {
        setTime();

        $('#form').submit();
    }


    function setTime() {
        var d = new Date();
        var timestamp = (d.getTime() - checkpoint);
        console.log(timestamp);
        $('#timestamp' + count).val(timestamp);
        checkpoint = d.getTime();
    }
}
