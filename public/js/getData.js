

function getData() {
    var link;
    $.ajax({
        url: '/getAllData',
        method: 'GET',
        data: {}
    })
    .done(function (dataStr) {
        // handle DataStr
        console.log('Clientside id jhauh: ' + dataStr);
        $('#testLink').text("welcome" + JSON.parse(dataStr));
    });
     
}