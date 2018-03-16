module.exports = {

    evaluateWorddictate: function(postData, getData) { 
        console.log("1.5 " + JSON.stringify(postData)); 
        console.log("2: " + getData.tests[0].content[0].answer); 
        var answers = [];
        
        //count sættes til 27, da vi ved i denne test, at der er 27 svar
        count = 27;

        var temp = []; 
        for(var key in postData) {
            temp.push(postData[key]);  
        }
        
        // var len = data.content.length; 
        var answer; 
        for (var i = 0; i < count; i++) {
        // for(var key in postData) {
            // if(!postData.hasOwnProperty(key)) continue; 
            answer = JSON.stringify(temp[i]); 
            answer = answer.trim();
            
            console.log("EVALUATOR answer: " + answer);
            // answer = answer.toLowerCase();  
            var correct = JSON.stringify(getData.tests[0].content[i].answer);
            console.log("correct: " + correct); 
            var point = 0;
            
            if (answer == correct) { point = 1;}
            console.log("point: " + point); 
            // var time = $('#timestamp' + i).val();
            
            
            var object = {
                "answer": answer,
                "point": point
                // "time": time
            }
            answers.push(object);
            console.log("push" + i);
        }
        console.log(answers); 
        return answers; 

    }


}