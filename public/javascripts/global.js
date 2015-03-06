// Devicelist data array for filling in info Content table
var DeviceListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the device table on initial page load
    populateTable();
    
    //Add Device button click
    $('#btnAddDevice').on('click', addDevice);
    
    // Delete Device link click
    $('#deviceList table tbody').on('click', 'td a.linkdeletedevice', deleteDevice);

});


// Functions =============================================================
// Fill table with data
function populateTable() {

    // DevicenameLink click
    $('#deviceList table tbody').on('click','td a.linkshowdevice',showDeviceInfo);
    
    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    // Get query data by router.get in routes/users.js
    $.getJSON( '/users/capdata', function( data ) {

        // Stick our device data array into a capdata variable in the global object
        DeviceListData = data;

        // For each item in our JSON, add a table row and cells to the content string
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

        // Inject the whole content string into our existing HTML table
         $('#deviceList table tbody').html(tableContent);
    });
};

// Show Device Info
function showDeviceInfo(event){
    
    //Prevent Link from Firing
    event.preventDefault();
    
    //Prevent Link from link rel attribute
    var thisDeviceName = $(this).attr('rel');
    
    //Get Index of object based on id value
    var arrayPosition = DeviceListData.map(function(arrayItem) {return arrayItem.unitname; }).indexOf(thisDeviceName);
    
    //Get our Device Object
    var thisDeviceObject = DeviceListData[arrayPosition];
    
    //Populate Info Box
    $('#unitInfoUnitName').text(thisDeviceObject.unitname);
    $('#unitInfoSigStrength').text(thisDeviceObject.sigstrength);
    $('#CapturedThermalData').text(thisDeviceObject.thermal);
    $('#CapturedTime').text(thisDeviceObject.mdate);
    
};

// Add Devices
function addDevice(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addDevice input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newDevice = {
            'unitname': $('#addDevice fieldset input#inputDeviceName').val(),
            'interval': $('#addDevice fieldset input#inputInterval').val(),
            'sigstrength': $('#addDevice fieldset input#inputSigStrength').val(),
            'thermal': $('#addDevice fieldset input#inputThermal').val(),
            'humidity': $('#addDevice fieldset input#inputHumidity').val(),
            'mdate': $('#addDevice fieldset input#inputMeasuredDate').val()
        }

        // Use AJAX to post the object to our adddevice service
        $.ajax({
            type: 'POST',
            data: newDevice,
            url: '/users/adddevice',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addDevice fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Device
function deleteDevice(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this Device?');

    // Check and make sure the Device confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deletedevice/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
