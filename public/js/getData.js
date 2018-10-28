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
                    <td>` + 'Fornavn' + `</td>
                    <td>:</td>
                    <td>` + content.Fornavn + `</td>
                    `);
	var $tdLastname = $(`
                    <td>` + 'Efternavn' + `</td>
                    <td>:</td>
                    <td>` + content.Efternavn + `</td>
                    `);
	var $tdAge = $(`
                    <td>` + 'Alder' + `</td>
                    <td>:</td>
                    <td>` + content.Alder + `</td>
                    `);
	var $tdlang = $(`
                    <td>` + 'Har andet modersmål?' + `</td>
                    <td>:</td>
                    <td>` + content["Har du andet end dansk som modersmål"] + `</td>
                    `);
	var $tdlang2 = $(`
                    <td>` + 'Hvilket' + `</td>
                    <td>:</td>
                    <td>` + content["Hvad er dit modersmål"] + `</td>
                    `);
	// new info
	var $td11 = $(`
                    <td>` + 'År i Danmark' + `</td>
                    <td>:</td>
                    <td>` + content["Hvor længe har du boet i Danmark"] + `</td>
                    `);
	var $td12 = $(`
                    <td>` + 'Modtaget dansk undervisning' + `</td>
                    <td>:</td>
                    <td>` + content["Har du fået undervisning i dansk"] + `</td>
                    `);

	var $td131 = $(`
                    <td>` + 'Har bestået prøver' + `</td>
                    <td>:</td>
                    <td>` + content["Har du bestået nogen prøver"] + `</td>
                    `);
	var $td132 = $(`
                    <td>` + 'Beståede prøver' + `</td>
                    <td>:</td>
                    <td>` + content["Evt hvilke(n)"] + `</td>
                    `);
	var $td21 = $(`
                    <td>` + 'Modtaget specialundervisning skole' + `</td>
                    <td>:</td>
                    <td>` + content["Har du modtaget specialundervisningen i skolen"] + `</td>
                    `);
	var $td22 = $(`
                    <td>` + 'Modtaget specialundervisning voksen' + `</td>
                    <td>:</td>
                    <td>` + content["Har du modtaget specialundervisning som voksen"] + `</td>
                    `);
	var $td23 = $(`
                    <td>` + 'Hvilke fag og periode' + `</td>
                    <td>:</td>
                    <td>` + content["Evt i hvilke(t) fag og hvor længe"] + `</td>
                    `);
	var $td31 = $(`
                    <td>` + 'Skoletid' + `</td>
                    <td>:</td>
                    <td>` + content["Hvor længe har du gået i skole"] + `</td>
                    `);
	var $td32 = $(`
                    <td>` + 'Skoletid i hjemland' + `</td>
                    <td>:</td>
                    <td>` + content["Hvor længe har du gået i skole i dit hjemland"] + `</td>
                    `);
	var $td331 = $(`
                    <td>` + 'Har afsluttende eksamen' + `</td>
                    <td>:</td>
                    <td>` + content["Har du afsluttende eksamen fra din skole"] + `</td>
                    `);
	var $td332 = $(`
                    <td>` + 'Eksamener' + `</td>
                    <td>:</td>
                    <td>` + 'Eksamen:' + content["Evt i hvilke(n)"] + ',Land: ' + content["Fra hvilket land"] + `</td>
                    `);
	var $td341 = $(`
                    <td>` + 'Har uddannelse' + `</td>
                    <td>:</td>
                    <td>` + content["Har du en uddannelse"] + `</td>
                    `);
	var $td342 = $(`
                    <td>` + 'Uddannelse' + `</td>
                    <td>:</td>
                    <td>` + 'Uddannelse: ' + content["Evt hvilken"] + ', Land: ' + content["Evt fra hvilket land"] + `</td>
                    `);
	var $td351 = $(`
                    <td>` + 'Betydelig læse/stavevanskeligheder' + `</td>
                    <td>:</td>
                    <td>` + content["Har dine læse- og stavevanskeligheder haft betydning for skole og uddannelse"] + `</td>
                    `);
	var $td352 = $(`
                    <td>` + 'Hvilke måder' + `</td>
                    <td>:</td>
                    <td>` + content["Evt på hvilken måde"] + `</td>
                    `);
	var $td361 = $(`
                    <td>` + 'Er i job' + `</td>
                    <td>:</td>
                    <td>` + content["Er du i job"] + `</td>
                    `);
	var $td362 = $(`
                    <td>` + 'Hvilket job' + `</td>
                    <td>:</td>
                    <td>` + content["Evt hvilket"] + `</td>
                    `);
	var $td371 = $(`
                    <td>` + 'Indgår læsning/skriving i job' + `</td>
                    <td>:</td>
                    <td>` + content + `</td>
                    `);
	var $td372 = $(`
                    <td>` + 'På hvilken måde' + `</td>
                    <td>:</td>
                    <td>` + content["Evt på hvilken måde"] + `</td>
                    `);
	var $td38 = $(`
                    <td>` + 'Læse på job går' + `</td>
                    <td>:</td>
                    <td>` + content["Hvordan klarer du at læse på jobbet"] + `</td>
                    `);
	var $td39 = $(`
                    <td>` + 'Skrive på job går' + `</td>
                    <td>:</td>
                    <td>` + content["Hvordan klarer du at skrive på jobbet"] + `</td>
                    `);
	var $td391 = $(`
                    <td>` + 'Mest talte sprog på job' + `</td>
                    <td>:</td>
                    <td>` + content["Hvilket sprog taler du mest på dit job"] + `</td>
                    `);
	var $td4 = $(`
                    <td>` + 'Fagønsker' + `</td>
                    <td>:</td>
                    <td>` + content["Hvorfor vil du gerne gå til FVU-læsning"] + `</td>
                    `);
	

	var $trFirstName = $('<tr/>').append($tdFirstName);
	var $trLastname = $('<tr/>').append($tdLastname);
	var $trAge = $('<tr/>').append($tdAge);
	var $trlang = $('<tr/>').append($tdlang);
	var $trlang2 = $('<tr/>').append($tdlang2);
	// new info 
	var $tr11 = $('<tr/>').append($td11);
	var $tr12 = $('<tr/>').append($td12);
	var $tr131 = $('<tr/>').append($td131);
	var $tr132 = $('<tr/>').append($td132);
	var $tr21 = $('<tr/>').append($td21);
	var $tr22 = $('<tr/>').append($td22);
	var $tr23 = $('<tr/>').append($td23);
	var $tr31 = $('<tr/>').append($td31);
	var $tr32 = $('<tr/>').append($td32);
	var $tr331 = $('<tr/>').append($td331);
	var $tr332 = $('<tr/>').append($td332);
	var $tr341 = $('<tr/>').append($td341);
	var $tr342 = $('<tr/>').append($td342);
	var $tr351 = $('<tr/>').append($td351);
	var $tr352 = $('<tr/>').append($td352);
	var $tr361 = $('<tr/>').append($td361);
	var $tr362 = $('<tr/>').append($td362);
	var $tr371 = $('<tr/>').append($td371);
	var $tr372 = $('<tr/>').append($td372);
	var $tr38 = $('<tr/>').append($td38);
	var $tr39 = $('<tr/>').append($td39);
	var $tr391 = $('<tr/>').append($td391);
	var $tr4 = $('<tr/>').append($td4);


	$table.append($trFirstName);
	$table.append($tdLastname);
	$table.append($trAge);
//	$table.append($trS);
	$table.append($trlang);
	$table.append($trlang2);
	// new info
	$table.append($tr11);
	$table.append($tr12);
	$table.append($tr131);
	$table.append($tr132);
	$table.append($tr21);
	$table.append($tr22);
	$table.append($tr23);
	$table.append($tr31);
	$table.append($tr32);
	$table.append($tr331);
	$table.append($tr332);
	$table.append($tr341);
	$table.append($tr342);
	$table.append($tr351);
	$table.append($tr352);
	$table.append($tr361);
	$table.append($tr362);
	$table.append($tr371);
	$table.append($tr372);
	$table.append($tr38);
	$table.append($tr39);
	$table.append($tr391);
	$table.append($tr4);


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
		if (currentTest.type == 'orddiktat') {
			$th = $('<th>#</th><th>Kursist svar</th><th>Rigtige svar</th><th>Point</th>');

		} else {
			$th = $('<th>#</th><th>Kursist svar</th>');
		}
		$tr = $('<tr/>').append($th);
		$table.append($tr);
		var count = 0;

		for (var j = 0; j < currentTest.answers.length; j++) {
			var $td;
			if (currentTest.type == 'orddiktat') {
				$td = $(`
                    <td>` + j + `</td>
                    <td>` + currentTest.answers[j].answer + `</td>
                    <td>` + teacherAnswer[j] + `</td>
                    <td>` + currentTest.answers[j].point + `</td>
                    `);

			} else {
				$td = $(`
                    <td>` + j + `</td>
                    <td>` + currentTest.answers[j].answer + `</td>
                    `);
			}

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