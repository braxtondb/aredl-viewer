// let users = [];
// let records = [];

// TODO: Input format checking and illegal char (comma) removal
// TODO: const everywhere
// maybe enter url or userid instead of dropdown to auto create if necessary (don't do this, need dropdown points)
// refresh button

let currentTab = 'levels';

class Level {
    constructor(id, position, name, publisherID, verificationID, creatorIDs, recordIDs, points, enjoyment) {
        this.id = Number(id);
        this.position = Number(position);
        this.name = name;
        this.publisherID = Number(publisherID);
        this.verificationID = Number(verificationID);
        this.creatorIDs = creatorIDs.map(i => Number(i));
        this.recordIDs = recordIDs.map(i => Number(i));
        this.points = Number(points);
        this.enjoyment = Number(enjoyment);
    }
}

class User {
    constructor(id, username) {
        this.id = Number(id);
        this.username = username;
    }
}

class Record {
    constructor(id, url, userID) {
        this.id = Number(id);
        this.url = url;
        this.userID = Number(userID);
    }
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function getLevels(callback) {
    httpGetAsync(`http://localhost:3000/getlevels`, callback);
}

function getUsers(callback) {
    httpGetAsync(`http://localhost:3000/getusers`, callback);
}

function getRecords(callback) {
    httpGetAsync(`http://localhost:3000/getrecords`, callback);
}

function responseToLevels(response) {
    const data = response.split(',');
    let levels = [];
    for (let i = 0; i < data.length; i += 9) {
        levels.push(new Level(data[i], data[i+1], data[i+2], data[i+3], data[i+4], (data[i+5] || '').split('|'), (data[i+6] || '').split('|'), data[i+7], data[i+8]));
    }
    return levels;
}

function responseToUsers(response) {
    const data = response.split(',');
    let users = [];
    for (let i = 0; i < data.length; i += 2) {
        users.push(new User(data[i], data[i+1]));
    }
    return users;
}

function responseToRecords(response) {
    const data = response.split(',');
    let records = [];
    for (let i = 0; i < data.length; i += 3) {
        records.push(new Record(data[i], data[i+1], data[i+2]));
    }
    return records;
}

function findID(list, id) {
    return list.find(i => i.id == id);
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

    httpGetAsync(`http://localhost:3000/addlevel?id=${id}&position=${position}&name=${name}&publisher=${publisher}&verification=${verification}&creators=${creators}&records=${records}&points=${points}&enjoyment=${enjoyment}`, function(response) {sortLevels()});

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

    httpGetAsync(`http://localhost:3000/editlevel?id=${id}&position=${position}&name=${name}&publisher=${publisher}&verification=${verification}&creators=${creators}&records=${records}&points=${points}&enjoyment=${enjoyment}`, function(response) {sortLevels()});

    $('#editlevel input').val('');
    $('#backdrop').css('display', 'none');
}

function deleteLevel() {
    let id = $('#deletelevel input')[0].value;

    httpGetAsync(`http://localhost:3000/deletelevel?id=${id}`, function(response) {sortLevels()});

    $('#deletelevel input').val('');
    $('#backdrop').css('display', 'none');
}

function addUser() {
    let id = $('#adduser input')[0].value;
    let username = $('#adduser input')[1].value;

    httpGetAsync(`http://localhost:3000/adduser?id=${id}&username=${username}`, function(response) {updateUserTable()});

    $('#adduser input').val('');
    $('#backdrop').css('display', 'none');
}

function editUser() {
    let id = $('#edituser input')[0].value;
    let username = $('#edituser input')[1].value;

    httpGetAsync(`http://localhost:3000/edituser?id=${id}&username=${username}`, function(response) {updateUserTable()});

    $('#edituser input').val('');
    $('#backdrop').css('display', 'none');
}

function deleteUser() {
    let id = $('#deleteuser input')[0].value;

    httpGetAsync(`http://localhost:3000/deleteuser?id=${id}`, function(response) {updateUserTable()});

    $('#deleteuser input').val('');
    $('#backdrop').css('display', 'none');
}

function addRecord() {
    let id = $('#addrecord input')[0].value;
    let url = $('#addrecord input')[1].value;
    let userid = $('#addrecord input')[2].value;

    httpGetAsync(`http://localhost:3000/addrecord?id=${id}&url=${url}&userid=${userid}`, function(response) {updateRecordTable()});

    $('#addrecord input').val('');
    $('#backdrop').css('display', 'none');
}

function editRecord() {
    let id = $('#editrecord input')[0].value;
    let url = $('#editrecord input')[1].value;
    let userid = $('#editrecord input')[2].value;

    httpGetAsync(`http://localhost:3000/editrecord?id=${id}&url=${url}&userid=${userid}`, function(response) {updateRecordTable()});

    $('#editrecord input').val('');
    $('#backdrop').css('display', 'none');
}

function deleteRecord() {
    let id = $('#deleterecord input')[0].value;

    httpGetAsync(`http://localhost:3000/deleterecord?id=${id}`, function(response) {updateRecordTable()});

    $('#deleterecord input').val('');
    $('#backdrop').css('display', 'none');
}

function openTab(tabid) {
    currentTab = tabid;
    $('.tabcont').css('display', 'none');
    $(`#${tabid}cont`).css('display', 'block');
    $('.tabbutton').removeClass('active');
    $(`#${tabid}tab`).addClass('active');
}

function openMenu(menuid) {
    $('#backdrop div').css('display', 'none');
    $(`#backdrop`).css('display', '');
    
    if (menuid == 'sortmenu') {
        menuid = 'sort' + currentTab;
        $(`#${menuid}`).css('display', '');
        return;
    }

    $(`#${menuid}`).css('display', '');
    checkInput(menuid);

    getUsers(response => {
        let users = responseToUsers(response);

        getRecords(response => {
            let records = responseToRecords(response);

            switch (menuid) {
                case 'addlevel':
                    $('#addlevel select').addClass('incomplete');
                    $("#addlevel option[value!='']").each((i, el) => { $(el).remove(); });

                    $('#addlevel .userdrop.incomplete').removeClass('.incomplete');
                    for (const usr of users) {
                        $('#addlevel .userdrop.incomplete').append($('<option>', { value: usr.id, text: `${usr.username} (id: ${usr.id})` }));
                    }

                    $('#addlevel .recorddrop.incomplete').removeClass('.incomplete');
                    for (const rec of records) {
                        $('#addlevel .recorddrop.incomplete').append($('<option>', { value: rec.id, text: `${rec.url} (by ${(findID(users, rec.userID) || {username:'N/A'}).username})` }));
                    }
                    break;

                case 'editlevel':
                    $('#editlevel select').addClass('incomplete');
                    $("#editlevel option[value!='']").each((i, el) => { $(el).remove(); });

                    $('#editlevel .userdrop.incomplete').removeClass('.incomplete');
                    for (const usr of users) {
                        $('#editlevel .userdrop.incomplete').append($('<option>', { value: usr.id, text: `${usr.username} (id: ${usr.id})` }));
                    }

                    $('#editlevel .recorddrop.incomplete').removeClass('.incomplete');
                    for (const rec of records) {
                        $('#editlevel .recorddrop.incomplete').append($('<option>', { value: rec.id, text: `${rec.url} (by ${(findID(users, rec.userID) || {username:'N/A'}).username})` }));
                    }
                    break;
            }
        });
    });
}

function updateLevelTable(users, records, levels) {
    $("#datalist table tr").each((i, el) => { $(el).remove(); });
    $("#datalist table").append('<tr><th>#</th><th>Name</th><th>Verifier</th><th>ID</th>><th>Points</th><th>Rating</th></tr>');

    for (const lvl of levels) {
        $("#datalist table").append(`<tr><td>${lvl.position}</td><td>${lvl.name}</td><td>${(findID(users, (findID(records, lvl.verificationID) || {userID:-Infinity}).userID) || {username:'N/A'}).username}</td><td>${lvl.id}</td><td>${Math.floor(lvl.points * 10) / 10 || 'N/A'}</td><td>${lvl.enjoyment ? Math.round(lvl.enjoyment) / 10 + '/10' : 'N/A'}</td></tr>`);
    }
}

function updateUserTable(users) {
    $("#datalist table tr").each((i, el) => { $(el).remove(); });
    $("#datalist table").append('<tr><th>ID</th><th>Username</th>');

    for (const usr of users) {
        $("#datalist table").append(`<tr><td>${usr.id}</td><td>${usr.username}</td>`);
    }
}

function updateRecordTable(users, records) {
    $("#datalist table tr").each((i, el) => { $(el).remove(); });
    $("#datalist table").append('<tr><th>ID</th><th>Url</th><th>Uploader</th>');

    for (const rec of records) {
        $("#datalist table").append(`<tr><td>${rec.id}</td><td>${rec.url}</td><td>${(findID(users, rec.userID) || {username:'N/A'}).username}</td>`);
    }
}

function sortLevels() {
    let type = $('#lvlsort')[0].value;
    let asc = $('#lvlsortsw')[0].checked;
    let mod = asc ? 1 : -1;
    $('#backdrop').css('display', 'none');

    getUsers(response => {
        let users = responseToUsers(response);

        getRecords(response => {
            let records = responseToRecords(response);

            getLevels(response => {
                let levels = responseToLevels(response);
                switch (type) {
                    case 'position':
                        levels = levels.sort((a, b) => (a.position < b.position ? -1 : 1) * mod);
                        break;
                    case 'name':
                        levels = levels.sort((a, b) => (a.name.localeCompare(b.name) ? a.name.localeCompare(b.name) : (a.position < b.position ? -1 : 1)) * mod);
                        break;
                    case 'verifier':
                        levels = levels.sort((a, b) => {let cmp = (findID(users, (findID(records, a.verificationID) || {userID:-Infinity}).userID) || {username:'N/A'}).username.localeCompare((findID(users, (findID(records, b.verificationID) || {userID:-Infinity}).userID) || {username:'N/A'}).username); return (cmp ? cmp : (a.position < b.position ? -1 : 1)) * mod; });
                        break;
                    case 'id':
                        levels = levels.sort((a, b) => (a.id < b.id ? -1 : 1) * mod);
                        break;
                    case 'points':
                        levels = levels.sort((a, b) => ((Number(a.points) || 0) < (Number(b.points) || 0) ? -1 : ((Number(a.points) || 0) > (Number(b.points) || 0) ? 1 : (a.position < b.position ? -1 : 1))) * mod);
                        break;
                    case 'enjoyment':
                        levels = levels.sort((a, b) => ((Number(a.enjoyment) || 0) < (Number(b.enjoyment) || 0) ? -1 : ((Number(a.enjoyment) || 0) > (Number(b.enjoyment) || 0) ? 1 : (a.position < b.position ? -1 : 1))) * mod);
                        break;
                    case 'publisher':
                        levels = levels.sort((a, b) => {let cmp = (findID(users, a.publisherID) || {username:'N/A'}).username.localeCompare((findID(users, b.publisherID) || {username:'N/A'}).username); return (cmp ? cmp : (a.position < b.position ? -1 : 1)) * mod; });
                        break;
                    case 'creator':
                        levels = levels.sort((a, b) => {let cmp = (findID(users, a.creatorIDs[0]) || {username:'N/A'}).username.localeCompare((findID(users, b.creatorIDs[0]) || {username:'N/A'}).username); return (cmp ? cmp : (a.position < b.position ? -1 : 1)) * mod; });
                        break;
                    case 'records':
                        levels = levels.sort((a, b) => {let cmp = (findID(users, (findID(records, a.recordIDs[0]) || {userID:-Infinity}).userID) || {username:'N/A'}).username.localeCompare((findID(users, (findID(records, b.recordIDs[0]) || {userID:-Infinity}).userID) || {username:'N/A'}).username); return (cmp ? cmp : (a.position < b.position ? -1 : 1)) * mod; });
                        break;
                }
                updateLevelTable(users, records, levels);
            });
        });
    });
}

function sortUsers() {
    let type = $('#usrsort')[0].value;
    let asc = $('#usrsortsw')[0].checked;
    let mod = asc ? 1 : -1;
    $('#backdrop').css('display', 'none');

    getUsers(response => {
        let users = responseToUsers(response);

        switch (type) {
            case 'id':
                users = users.sort((a, b) => (a.id < b.id ? -1 : 1) * mod);
                break;
            case 'username':
                users = users.sort((a, b) => (a.username.localeCompare(b.username) ? a.username.localeCompare(b.username) : (a.id < b.id ? -1 : 1)) * mod);
                break;
        }
        updateUserTable(users);
    });
}

function sortRecords() {
    let type = $('#recsort')[0].value;
    let asc = $('#recsortsw')[0].checked;
    let mod = asc ? 1 : -1;
    $('#backdrop').css('display', 'none');

    getUsers(response => {
        let users = responseToUsers(response);

        getRecords(response => {
            let records = responseToRecords(response);

            switch (type) {
                case 'id':
                    records = records.sort((a, b) => (a.id < b.id ? -1 : 1) * mod);
                    break;
                case 'url':
                    records = records.sort((a, b) => (a.url.localeCompare(b.url) ? a.url.localeCompare(b.url) : (a.id < b.id ? -1 : 1)) * mod);
                    break;
                case 'username':
                    records = records.sort((a, b) => {let cmp = (findID(users, a.userID) || {username:'N/A'}).username.localeCompare((findID(users, b.userID) || {username:'N/A'}).username); return (cmp ? cmp : (a.id < b.id ? -1 : 1)) * mod; });
                    break;
            }
            updateRecordTable(users, records);
        });
    });
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
    $('#backdrop').css('display', 'none');
    sortLevels();
    $('#backdrop').click(function(event) {if (!$(event.target).closest('div').length) { $(this).css('display', 'none'); } });
    $('#backdrop div').click(function(event) { event.stopPropagation(); });
}