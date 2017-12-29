{
    var totalLineCount;
    var count = 0;
    var data;
    var audioCount = 0;
    var endTime;
    var timer;
    var x;
    var checkpoint;

    $(function () {
        $('#start').click(function () {
            setTime();

            endTime = checkpoint + timer;
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



        $('#form').bind('submit', function (event) {
            event.preventDefault(); //this will prevent the default submit

            var answers = [];
            //            for (var i = 0; i <= count; i++) {
            var answer = $('#answer').val();
            console.log(answer);
            var point = 0;
            if (answer != null) {
                point = 1;
            }

            var time = $('#timestamp' + i).val();


            var object = {
                "answer": answer,
                "point": point,
                "time": time
            }

            answers.push(object);
            //            }

            $('#answers').val(JSON.stringify(answers));




            //            $(this).unbind('submit').submit(); // continue the submit unbind preventDefault
        });
    });

    function initializeTest(data) {

        this.data = data;

        totalLineCount = data.content.length;
        count = 0;
        timer = 900000; // 15 min.
    }





    function nextLine(count) {

        $lineInput = $('<textarea/>')
            .attr({
                class: 'h2size',
                id: 'answer',
                //name: 'userinput',
                placeholder: 'Skriv brev'
            })
            .css({
                'width': '80%',
                'height': '30%'
            });


        $timestamp = $('<input/>').attr({
            type: 'hidden',
            id: 'timestamp' + count
            //name: 'timestamp'
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
        setTime();
        lockTextfield();
        addNextButton();
        $('#saveButton').remove();
    }


    function setTime() {
        var d = new Date();
        var timestamp = (d.getTime() - checkpoint);
        $('#timestamp' + count).val(timestamp);
        checkpoint = d.getTime();
    }


    function lockTextfield() {
        $('#answer' + count).attr({
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
