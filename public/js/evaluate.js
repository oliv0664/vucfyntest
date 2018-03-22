module.exports = {

    evaluateWorddictate: function(postData, getData) { 
        //empty array to keep all answers, and return value
        var answers = [];
        var count = getData.tests[0].content.length; //50

        //temporary array for converting object to array 
        var temp = []; 
        var index;
        var previousIndex = 0; 
        for(var key in postData) {

            //get answer number, from string 'answer0'
            index = JSON.parse(key.slice(6));
            //make new object with answer number, and answer value
            var obj = {
                "index": index,
                "value": postData[key]
            }
                           
            //calculate length from last answer with a value, to now 
            var difference = index - previousIndex;  

            //for every answer without a value, insert placeholder value
            for(var i=1; i<difference; i++) {
                var emptyObj = {
                    "index": (previousIndex + i),
                    "value": "Svar mangler"
                }
                temp.push(emptyObj); 
            }

            previousIndex = index; 
            temp.push(obj);  
        }

        for (var i = 0; i < count; i++) {
            var answer = "svar mangler"; 
            var id = null;

            //for every answer in the temp array 
            if(i < temp.length-1){   
                //get the answer value
                answer = temp[i].value;
                //get answer number 
                id = temp[i].index; 
                answer = answer.trim();

                //if answer value is empty, insert placeholder
                if(answer == "") answer = "Svar mangler"; 
            }
            
            var correct;

            if(id == 7) {
                //special answer for 'answer7'
                if(answer)
                answer = answer.replace(",", "."); 
                answer = Number(answer);  
                if(answer != NaN) { 
                    if(answer > 0.5 && answer < 0.6) { correct = answer; }
                }
            } else if(id != null) {
                //if there is given an answer value, get the correct
                correct = getData.tests[0].content[id].answer;
            }
             
            var point = 0;
            //check if answer value is correct
            if(typeof answer == 'string') { answer = answer.toLowerCase(); }
            if(typeof correct == 'string') { correct = correct.toLowerCase(); } 
            if (answer == correct) { point = 1; }
            
            var object = {
                "answer": answer,
                "point": point
            }
            answers.push(object);
        }
        answers.push({ "time": temp[temp.length-1].value });
        return answers; 
    }
}