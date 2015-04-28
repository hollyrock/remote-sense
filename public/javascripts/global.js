var DeviceListData = [];

//
//  populateTable:
//  Fill out table with all devices
//  
function populateTable() {

    $('#deviceList table tbody').on('click','td a.linkshowdevice',showDeviceInfo);
    
    var tableContent = '';

    // Get query data by router.get in routes/users.js
    $.getJSON( '/users/capdata', function( data ) {

        DeviceListData = data;

        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowdevice" rel="' + this.unitname + '">' + this.unitname + '</a></td>';
            tableContent += '<td>' + this.sigstrength + '</td>';
            tableContent += '<td>' + this.thermal + '</td>';
            tableContent += '<td>' + this.himidity + '</td>';
            tableContent += '<td>' + this.pressure + '</td>';
            tableContent += '<td>' + this.interval + '</td>';
            tableContent += '<td>' + this.mdate + '</td>';
            tableContent += '<td>' + this.sdate + '</td>';
            tableContent += '<td>' + this.edate + '</td>';
            tableContent += '<td><a href="#" class="linkdeletedevice" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

         $('#deviceList table tbody').html(tableContent);
    });
};


//
// showDeviceInfo:
// Show Device Details
//
function showDeviceInfo(event){
    
    event.preventDefault();
    
    var thisDeviceName = $(this).attr('rel');
    var arrayPosition = DeviceListData.map(
            function(arrayItem) {
                return arrayItem.unitname;
            }
        ).indexOf(thisDeviceName);
    var thisDeviceObject = DeviceListData[arrayPosition];
    
    $('#unitInfoUnitName').text(thisDeviceObject.unitname);
    $('#unitInfoSigStrength').text(thisDeviceObject.sigstrength);
    $('#CapturedThermalData').text(thisDeviceObject.thermal);
    $('#CapturedTime').text(thisDeviceObject.mdate);
    
};

// 
// addDevice
// Add new device into db
//
function addDevice(event) {
    event.preventDefault();

    var errorCount = 0;
    $('#addDevice input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if(errorCount === 0) {

        var newDevice = {
            'unitname': $('#addDevice fieldset input#inputDeviceName').val(),
            'interval': $('#addDevice fieldset input#inputInterval').val(),
            'sigstrength': $('#addDevice fieldset input#inputSigStrength').val(),
            'thermal': $('#addDevice fieldset input#inputThermal').val(),
            'humidity': $('#addDevice fieldset input#inputHumidity').val(),
            'mdate': $('#addDevice fieldset input#inputMeasuredDate').val()
        }

        $.ajax({
            type: 'POST',
            data: newDevice,
            url: '/users/adddevice',
            dataType: 'JSON'
        }).done(function( response ) {

            if (response.msg === '') {
                $('#addDevice fieldset input').val('');
                populateTable();
            }
            else {
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        alert('Please fill in all fields');
        return false;
    }
};

//
// deleteDevice:
// Remove specific device from db
//
function deleteDevice(event) {

    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete this Device?');

    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/users/deletedevice/' + $(this).attr('rel')
        }).done(function( response ) {
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
            populateTable();
        });
    }
    else {
        return false;
    }
};


// Send Message to Raspberry PI ============================
// You need add Browser -> Raspi --> XBee code below
var socket = io.connect('');
function sendMsg2xbee(event) {
    
    event.preventDefault();

    //XBee command needs to send following format
    var frame_obj = {
        type: 0x01,
        id: 0x01,
        destination16:"4321",
        options: 0x00,
        data: "I am a frame from web-client (global.js!)"
    };
    
    socket.emit('webc_command', frame_obj);
    console.log("Bang!"); // for debug
};


// DOM Ready ===============================================
$(document).ready(function() {

    populateTable();
    
    // Button
    $('#btnAddDevice').on('click', addDevice);
    $('#deviceList table tbody').on('click', 'td a.linkdeletedevice', deleteDevice);
    $('#btnSendMsg').on('click', sendMsg2xbee);

    // if you receive somthing from Node server (Rasberry Pi)
    socket.on('pi_response', function(from_pi) {
        console.log(from_pi);
    });
});
