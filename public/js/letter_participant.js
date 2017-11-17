{
    var totalLineCount;
    var count;
    var testlist;
    var audioCount = 0;
    var endTime;
    var timer;
    var x;
    console.log("YEAH!");

    function initializeTest(testlist) {

        this.testlist = testlist;

        totalLineCount = testlist.files.length;
        count = 0;
        timer = 900000; // 15 min.

        $('#start').click(function () {
            setTime();

            endTime = startTime + timer;
            nextLine(count);
            x = setInterval(countdown, 1000);
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
            id: 'saveButton',
            type: 'button',
            value: 'Gem'
        }).click(function () {
            save()
        });

        $('#bottom').append($submit);

    }

    function save() {
        setCheckpoint();
        lockTextfield();
        addNextButton();
        $('#saveButton').remove();
    }


    /*function setTime() {
        var now = new Date().getTime();
        var distance = now - checkpoint;
        console.log(distance);
        var minutes = Math.floor((distance / (1000 * 60)) % 60);
        console.log(minutes);
        var seconds = Math.floor((distance / 1000) % 60);
        console.log(seconds);
        $('#timestamp' + count).val(minutes + "m " + seconds + "s");
        checkpoint = now;
    }*/


    function lockTextfield() {
        $('#input' + count).attr({
            readonly: 'readonly',
            id: 'lockedField'
        });
    }


    function addNextButton() {
        $next = $('<input/>').attr({
            type: 'submit',
            value: 'Videre'
        });

        $('#bottom').append($next);
    }


    function countdown() {
        var now = new Date().getTime();
        var distance = endTime - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        $('#timer').text(minutes + ":" + seconds);

        if (distance < 0) {
            clearInterval(x);
            $('#timer').text("Tiden er gået!");
            save();
        }
    }
}
