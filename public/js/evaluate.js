module.exports = {

    evaluateWorddictate: function(postData, getData) { 
        //empty array to keep all answers, and return value
        var answers = [];
        var count = getData.tests[0].content.length; //50

        //temporary array for converting object to array 
        var temp = []; 
        var index;
        var previousIndex = 0; 
        var c = 0; 
        for(var key in postData) {

            //get answer number, from string 'answer0'
            index = JSON.parse(key.slice(6));
            //make new object with answer number, and answer value
            if(c == 0 && c != index) {
                var obj = {
                    "index": 0,
                    "value": "svar mangler"
                }
                temp.push(obj); 
            }
            c++; 

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
                console.log("answer id " + id + ", value " + answer); 
                //if answer value is empty, insert placeholder
                if(answer == "") { answer = "svar mangler" }; 
            }
            
            var correct;
            console.log("BEFORE SWITCH ID " + id);
            
            switch(id) {
                case 7: 
                    //special answer for 'answer7'
                    correct = evaluateInterval(answer, 0.5, 0.6); 
                    if(correct == null) { answer = "svar mangler"; } else {
                    answer = correct;
                    }
                    break; 
                
                case 34: 
                    correct = evaluateInterval(answer, 11, 13); 
                    if(correct == null) { answer = "svar mangler"; } else {
                    answer = correct;
                    }
                    break;

                case 36: 
                    correct = evaluateInterval(answer, 6, 9);
                    if(correct == null) { answer = "svar mangler"; } else {
                    answer = correct;
                    }
                    break; 

                case 39: 
                    correct = evaluateInterval(answer, 5, 6); 
                    if(correct == null) { answer = "svar mangler"; } else {
                    answer = correct;
                    }
                    break; 

                case 41: 
                    correct = evaluateInterval(answer, 80, 100); 
                    if(correct == null) { answer = "svar mangler"; } else {
                    answer = correct;
                    }
                    break; 
                
                case 43: 
                    correct = evaluateInterval(answer, 4, 6); 
                    if(correct == null) { answer = "svar mangler"; } else {
                    answer = correct;
                    }
                    break; 
                                        
                
                case 45: 
                    correct = evaluateInterval(answer, 10, 15); 
                    if(correct == null) { answer = "svar mangler"; } else {
                    answer = correct;
                    }
                    break; 
                
                default:
                    correct = getData.tests[0].content[id].answer;
            }
            console.log("AFTER SWITCH ID " + id);
             
            var point = 0;
            //check if answer value is correct
            if(typeof answer == 'string') { answer = answer.toLowerCase(); }
            if(typeof correct == 'string') { correct = correct.toLowerCase(); } 
            console.log("answer: " + answer + ", correct: " + correct); 
            if (answer == correct) { 
                console.log("id: " + id + ", WIN!"); 
                point = 1; }
            
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

function evaluateInterval(input, min, max) {
    var correct; 
    console.log("evaluate input " + input + ", min " + min + ", max " + max); 
    input = input.replace(",", ".");
    console.log("replaced: " + input); 
    input = Number(input); 
    if(input != NaN) {
        if(input >= 11 && input <= 13) { correct = input; }
    }
    return correct; 
}