var nodemailer = require('nodemailer'); 

module.exports = {
    sendMail: function(mailTo, message) {
        //console.log(results);
        var transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'vucfyn.test@outlook.dk', //vucfyn.diktat.test@gmail.com 
                pass: 'Outlookvucfyntest2018'  //Gmailvucfyntest2018
            }
        });

        


        var mailOptions = {
            from: 'vucfyn.test@outlook.dk', //vucfyn.diktat.test@gmail.com
            to: mailTo, 
            subject: 'screeningtest resultater',
            // text: JSON.stringify(message)
            html: message
            
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Mail ERROR");
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },


    htmlBuilder: function(results) {


        var html; 

        for(var i=0; i<results.length; i++) {
            html += '<p>Spørgsmål ' + (i+1) + '</p>'; 
            html += '<p>kursist svar: ' + results[i].student_answer + '</p>'; 
            html += '<p>korrekt svar: ' + results[i].correct_answer + '</p>';
            html += '<p>points' + results[i].point + '</p>';
            html += '<br>'
        }

        return html; 
    
    }
}



function timeConverter(milliseconds) {
    var seconds = milliseconds / 1000; 
    var minutes = Math.floor(seconds / 60);
    var leftoverSeconds = Math.floor(seconds % 60);
    seconds = leftoverSeconds; 

    if(seconds.toString().length < 2) {
        seconds = "0" + seconds; 
    }

    return minutes + ":" + seconds; 
}