{
    var totalLineCount;
    var count;
    var testlist;
    var audioCount = 0;
    var d = new Date();
    var startTime;
    var checkpoint;
    var timer;

    function initializeTest(testlist) {

        this.testlist = testlist;

        totalLineCount = testlist.files.length;
        count = 0;
        timer = 900000; // 15 min. 

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

        $lineInput = $('<textarea/>')
            .attr({
                class: 'h2size',
                id: 'input' + count,
                name: 'userinput',
                placeholder: 'Skriv brev'
            })
            .css({
                'width': '80%',
                'height': '30%'
            });


        $timestamp = $('<input/>').attr({
            type: 'hidden',
            id: 'timestamp' + count,
            name: 'timestamp'
        });


        // tilføjer alle elementer til siden 
        $('#subsection')
            .append($lineInput)
            .append($timestamp)
            .append('<br>');


        $submit = $('<input/>').attr({
            class: 'h2size',
            type: 'button',
            value: 'Gem'
        }).click(function () {
            setTime();
            addNextButton();
            this.remove();
        });

        $('#bottom').append($submit);

    }


    function setTime() {
        var d = new Date();
        var timestamp = (d.getTime() - checkpoint);
        console.log(timestamp);
        $('#timestamp' + count).val(timestamp);
        checkpoint = d.getTime();
    }


    function addNextButton() {
        $next = $('<input/>').attr({
            type: 'submit',
            value: 'Videre'
        });

        $('#bottom').append($next);
    }
}
