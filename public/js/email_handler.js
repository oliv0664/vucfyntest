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
            //text: JSON.stringify(message)
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

        var html = 
            `<h1>Testresultater</h1>
            <p>Lærer ID: ` + results.teacherID + `</p>
            <table border="1" width="100%">
            <tr>`; 
    
        for(var i=1; i<Object.keys(results).length-1; i++) {
            html += `<td style="width: 600px">`+Object.keys(results)[i]+`</td>`
        }
    
        for(var i=0; i<results.tests.length; i++) {
            html += `<td style="width: 600px">`+Object.keys(results.tests[i])[0]+`</td>`
            for(var j=0; j<results.tests[i].answers.length-1; j++) {
                html += `<td style="width: 600px">svar `+j+`</td>`;
                html += `<td>point</td>`; 
            }   
            html += "<td style='width: 600px'>tid</td>"
        }
        // html += `<td>tid</td>`;
    
        html += 
            `</tr>`;
            `<tr>`
    
        var arr = []; 
        for(var key in results) { arr.push(key) }
    
        for(var i=1; i<Object.keys(results).length-1; i++) {
            html += `<td style="width: 600px">`+results[arr[i]]+`</td>`;
        }
    
        for(var i=0; i<results.tests.length; i++) {
            html += `<td style="width: 600px">`+results.tests[i].type+`</td>`
            for(var j=0; j<results.tests[i].answers.length-1; j++) {
                html += `<td style="width: 600px">`+results.tests[i].answers[j].answer+`</td>
                <td>` + results.tests[i].answers[j].point + `</td>`
            }   
            html += '<td style="width: 600px">'+timeConverter(results.tests[i].answers[50].time)+'</td>';
        }
    
        // var time = timeConverter(results.tests[1].answers[0].time); 

        // html +=
        //     `<td style="width: 600px">`+ time +`</td>
        //     </tr>
        //     </table>`;
    
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