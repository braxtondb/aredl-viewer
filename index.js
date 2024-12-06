// let users = [];
// let records = [];

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function addLevel() {
    let id = $('#addlevel input')[0].value;
    let position = $('#addlevel input')[1].value;
    let name = $('#addlevel input')[2].value;
    let publisher;
    let verification;
    let creators = "";
    let records = "";
    let points = $('#addlevel input')[3].value;
    let enjoyment = $('#addlevel input')[4].value;
    $('#addlevel .userdrop').each((i, el) => { if (i == 0) { publisher = el.value } else { creators += ',' + el.value } });
    $('#addlevel .recorddrop').each((i, el) => { if (i == 0) { verification = el.value } else { records += ',' + el.value } });
    creators = creators.slice(1);
    records = records.slice(1);

    httpGetAsync(`http://localhost:3000/addlevel?id=${id}&position=${position}&name=${name}&publisher=${publisher}&verification=${verification}&creators=${creators}&records=${records}&points=${points}&enjoyment=${enjoyment}`, function(response) {});

    $('#addlevel input').val('');
    $('#backdrop').css('display', 'none');
}

function editLevel() {
    let id = $('#editlevel input')[0].value;
    let position = $('#editlevel input')[1].value;
    let name = $('#editlevel input')[2].value;
    let publisher;
    let verification;
    let creators = "";
    let records = "";
    let points = $('#editlevel input')[3].value;
    let enjoyment = $('#editlevel input')[4].value;
    $('#editlevel .userdrop').each((i, el) => { if (i == 0) { publisher = el.value } else { creators += ',' + el.value } });
    $('#editlevel .recorddrop').each((i, el) => { if (i == 0) { verification = el.value } else { records += ',' + el.value } });
    creators = creators.slice(1);
    records = records.slice(1);

    httpGetAsync(`http://localhost:3000/editlevel?id=${id}&position=${position}&name=${name}&publisher=${publisher}&verification=${verification}&creators=${creators}&records=${records}&points=${points}&enjoyment=${enjoyment}`, function(response) {});

    $('#editlevel input').val('');
    $('#backdrop').css('display', 'none');
}

function deleteLevel() {
    let id = $('#deletelevel input')[0].value;

    httpGetAsync(`http://localhost:3000/deletelevel?id=${id}`, function(response) {});

    $('#deletelevel input').val('');
    $('#backdrop').css('display', 'none');
}

function addUser() {
    let id = $('#adduser input')[0].value;
    let username = $('#adduser input')[1].value;

    httpGetAsync(`http://localhost:3000/adduser?id=${id}&username=${username}`, function(response) {});

    $('#adduser input').val('');
    $('#backdrop').css('display', 'none');
}

function editUser() {
    let id = $('#edituser input')[0].value;
    let username = $('#edituser input')[1].value;

    httpGetAsync(`http://localhost:3000/edituser?id=${id}&username=${username}`, function(response) {});

    $('#edituser input').val('');
    $('#backdrop').css('display', 'none');
}

function deleteUser() {
    let id = $('#deleteuser input')[0].value;

    httpGetAsync(`http://localhost:3000/deleteuser?id=${id}`, function(response) {});

    $('#deleteuser input').val('');
    $('#backdrop').css('display', 'none');
}

function addRecord() {
    let id = $('#addrecord input')[0].value;
    let url = $('#addrecord input')[1].value;
    let userid = $('#addrecord input')[2].value;

    httpGetAsync(`http://localhost:3000/addrecord?id=${id}&url=${url}&userid=${userid}`, function(response) {});

    $('#addrecord input').val('');
    $('#backdrop').css('display', 'none');
}

function editRecord() {
    let id = $('#editrecord input')[0].value;
    let url = $('#editrecord input')[1].value;
    let userid = $('#editrecord input')[2].value;

    httpGetAsync(`http://localhost:3000/editrecord?id=${id}&url=${url}&userid=${userid}`, function(response) {});

    $('#editrecord input').val('');
    $('#backdrop').css('display', 'none');
}

function deleteRecord() {
    let id = $('#deleterecord input')[0].value;

    httpGetAsync(`http://localhost:3000/deleterecord?id=${id}`, function(response) {});

    $('#deleterecord input').val('');
    $('#backdrop').css('display', 'none');
}

function openTab(tabid) {
    $('.tabcont').css('display', 'none');
    $(`#${tabid}cont`).css('display', 'block');
    $('.tabbutton').removeClass('active');
    $(`#${tabid}tab`).addClass('active');
}

function openMenu(menuid) {
    $('#backdrop div').css('display', 'none');
    $(`#${menuid}`).css('display', '');
    $(`#backdrop`).css('display', '');
    checkInput(menuid);

    switch (menuid) {
        case 'addlevel':
            $('#addlevel select').addClass('incomplete');
            $("#addlevel option[value!='']").each((i, el) => { $(el).remove(); });
            httpGetAsync(`http://localhost:3000/getusers`, function(response) {
                let data = response.split(',');
                for (let i = 0; i < data.length; i += 2) {
                    $('#addlevel .userdrop.incomplete').append($('<option>', { value: data[i], text: `${data[i+1]} (user_id: ${data[i]})` }));
                }
                $('#addlevel .userdrop.incomplete').removeClass('.incomplete');
            });
            httpGetAsync(`http://localhost:3000/getrecords`, function(response) {
                let data = response.split(',');
                for (let i = 0; i < data.length; i += 3) {
                    $('#addlevel .recorddrop.incomplete').append($('<option>', { value: data[i], text: `${data[i+1]} (rec_id: ${data[i]})` }));
                }
                $('#addlevel .recorddrop.incomplete').removeClass('.incomplete');
            });
            break;
        case 'editlevel':
            $('#editlevel select').addClass('incomplete');
            $("#editlevel option[value!='']").each((i, el) => { $(el).remove(); });
            httpGetAsync(`http://localhost:3000/getusers`, function(response) {
                let data = response.split(',');
                for (let i = 0; i < data.length; i += 2) {
                    $('#editlevel .userdrop.incomplete').append($('<option>', { value: data[i], text: `${data[i+1]} (user_id: ${data[i]})` }));
                }
                $('#editlevel .userdrop.incomplete').removeClass('.incomplete');
            });
            httpGetAsync(`http://localhost:3000/getrecords`, function(response) {
                let data = response.split(',');
                for (let i = 0; i < data.length; i += 3) {
                    $('#editlevel .recorddrop.incomplete').append($('<option>', { value: data[i], text: `${data[i+1]} (rec_id: ${data[i]})` }));
                }
                $('#editlevel .recorddrop.incomplete').removeClass('.incomplete');
            });
            break;
    }
}

function checkInput(menuid) {
    $(`#${menuid} .multi`).each((i, el) => {
        if (el.value && !el.nextElementSibling) {
            $(el.parentElement).append(el.cloneNode(true));
            el.nextElementSibling.value = '';
        }
        if (!el.value && el.nextElementSibling) {
            $(el).remove();
        }
    });

    $('#backdrop div button').prop('disabled', true);

    let filled = true;
    $(`#${menuid} input`).each((i, el) => { if (!el.value && !$(el).attr('placeholder')) filled = false; });
    $(`#${menuid} select`).each((i, el) => { if (!el.value && !$(el).hasClass('multi')) filled = false; });

    if (filled) $('#backdrop div button').prop('disabled', false);
}

window.onload = function() {
    openTab('levels');
    $('#backdrop div').click(function(event) {event.preventDefault(); event.stopPropagation()});
    $('#backdrop').css('display', 'none');
}