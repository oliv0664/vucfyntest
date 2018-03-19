module.exports = {

    evaluateWorddictate: function(postData, getData) { 
        var answers = [];
        var count = getData.tests[0].content.length; //50
        
        var temp = []; 
        var index;
        var previousIndex = 0; 
        for(var key in postData) {
            
            index = JSON.parse(key.slice(6)); 
            var obj = {
                "index": index,
                "value": postData[key]
            }
                           
            var difference = index - previousIndex;  

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

            if(i < temp.length){   
                answer = temp[i].value; 
                id = temp[i].index; 
                answer = answer.trim();

                if(answer == "") answer = "Svar mangler"; 
            }
            
            var correct;
            if(id != null) {
                correct = getData.tests[0].content[id].answer;
            }

            var point = 0;
            if (answer == correct) { point = 1; }
            
            var object = {
                "answer": answer,
                "point": point
            }
            answers.push(object);
        }
        return answers; 
    }
}