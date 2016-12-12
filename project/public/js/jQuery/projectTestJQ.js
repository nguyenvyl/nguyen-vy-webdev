// $.ajax({
//     url: 'https://trailapi-trailapi.p.mashape.com/', // The URL to the API. You can get this in the API page of the API you intend to consume
//     type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
//     data: {}, // Additional parameters here
//     dataType: 'json',
//     success: function(data) { console.dir((data.source)); },
//     error: function(err) { alert(err); },
//     beforeSend: function(xhr) {
//         xhr.setRequestHeader("X-Mashape-Authorization", "1qo8s7goIcmshmLvARBEqmmVWkmpp12rej1jsn4ut2EvqOy17u"); // Enter here your Mashape key
//     }
// });