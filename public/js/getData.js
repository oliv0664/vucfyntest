function getStudentData(studentID, teacherID, index, contentdb) {

	var content = JSON.parse(contentdb);
var teacherAnswer = [
		"cyklede", "job", "klokken", "sent", "sneet", "natten", "isglat", "kørte", "taxaerne", "lys", "kørte", "krydset", "Møllegade", "Pludselig", "orange", "stationcar", "bremsede", "kollision", "gled", "asfalten", "væk", "hospital", "sygemeldt", "måned", "problem", "bilister"
	];

	console.log(content);

	var ind = index.id.slice(1);
	console.log('watch this: ' + ind);

	$('#b' + ind).hide();

	var $divInfo = $('<div/>');

	var $headInfo = $('<h3/>').text('Kursist data');
	$divInfo.append($headInfo);

	$table = $('<table border="1"/> ');

	
	var $tdFirstName = $(`
                    <td>` + ' Fornavn' + `</td>
                    <td>:</td>
                    <td>` + content.Fornavn + `</td>
                    `);
	var $tdLastname = $(`
                    <td>` + ' Efternavn' + `</td>
                    <td>:</td>
                    <td>` + content.Efternavn + `</td>
                    `);
	var $tdAge = $(`
                    <td>` + ' Alder' + `</td>
                    <td>:</td>
                    <td>` + content.Alder + `</td>
                    `);
	var $tdS = $(`
                    <td>` + ' something' + `</td>
                    <td>:</td>
                    <td>` + content["Hvad vil du gerne blive bedre til"] + `</td>
                    `);
	var $tdlang = $(`
                    <td>` + ' Har andet modersmål?' + `</td>
                    <td>:</td>
                    <td>` + content["Har du andet end dansk som modersmål"] + `</td>
                    `);


	var $trFirstName = $('<tr/>').append($tdFirstName);
	var $trLastname = $('<tr/>').append($tdLastname);
//	var $trInfo = $('<tr/>').append($tdAge);
//	var $trInfo = $('<tr/>').append($tdS);
//	var $trInfo = $('<tr/>').append($tdlang);
	$table.append($trFirstName);
	$table.append($tdLastname);

	$divInfo.append($table)
	$('#d' + ind).append($divInfo);

	for (i = 0; i < content.tests.length; i++) {
		var currentTest = content.tests[i];
		var $div = $('<div/>');
		var $head = $('<h3/>').text(currentTest.type);
		$div.append($head);
		var $table = $('<table border="1">');
		var $th = $('<th>#</th><th>Kursist svar</th><th>Rigtige svar</th><th>Point</th>');
		var $tr = $('<tr/>').append($th);
		$table.append($tr);
		var count = 0;

		for (var j = 0; j < currentTest.answers.length; j++) {
			var $td = $(`
                    <td>` + j + `</td>
                    <td>` + currentTest.answers[j].answer + `</td>
                    <td>` + teacherAnswer[j] + `</td>
                    <td>` + currentTest.answers[j].point + `</td>
                    `);
			var $tr = $('<tr/>').append($td);
			$table.append($tr);

			if (currentTest.answers[j].point == "1") {
				count++;
			}
		}

		$div.append($table).append('<div>Antal rigtige i alt: ' + count + '</div>');

		$('#d' + ind).append($div);



		$('#r' + ind).show();

	}



};

function removeAnswers(index) {

	var ind = index.id.slice(1);

	$('#r' + ind).hide();
	$('#d' + ind).empty();
	$('#b' + ind).show();
}