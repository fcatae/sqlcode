/* global $ */ 

function loadData(path) {
    
    var returnValue = null;
    
    $.ajax({
        async: false,
        url: path,
        success: function(data) { returnValue = data; },
        dataType: 'text'
    });

    return returnValue;
}

var data = {
    sql: loadData('data/sqlprofile.xml'),
    waits: loadData('data/waits.xml')
};

var processors = {
    attention: showCommand,
    duration: showCommand,
    waitinfo: showCommand,
    testParser: testParser
};

$(document).ready(function() {
    
    var ui = {
        progressBar: $('#idProgress'),
        //selectInput: $('#idSelect'),
        dropdownTemplates: $('#idDropdown .dropdown-menu'),
        textarea: $('#idTextarea'),
        button: $('#idButton'),
        dropdownProcessorName: $('#idDropdownProcessor .name'),
        dropdownProcessors: $('#idDropdownProcessor .dropdown-menu'),
        results: $('#idResults')
    } 
    ui.progressBar.hide();
        
    // load data
    for(name in data) {
        ui.dropdownTemplates.append(`<li><a href="#" data-id="${name}">${name}</a></li>`);
        //ui.selectInput.append(`<option value="${name}">${name}</option>`);    
    }
    ui.dropdownTemplates.click(function(e) {
        var value = e.target.dataset.id;        
        (data[value]) && ui.textarea.val(data[value]);
    })
    
    for(name in processors) {
        ui.dropdownProcessors.append(`<li><a href="#">${name}</a></li>`);
    }
    ui.dropdownProcessorName.text(name);

    ui.dropdownProcessors.click(function(e) {
        var value = e.target.textContent;
        ui.dropdownProcessorName.text(value);    
    })
    
    ui.button.click(function() {
        var value = ui.dropdownProcessorName[0].textContent;
        
        var command = processors[value];
        var text = ui.textarea.val();
        var dest = ui.results.selector;
        
        (command) && command(text, dest);

    })
});
        
function showCommand(text, dest) {
    var cmd = $('#idDropdownProcessor .name')[0].textContent;
    alert(cmd);
    console.log('text: ');
    console.log(text);
    console.log('dest: ' + dest);
}

function testParser(text, dest) {

    var parser = XmlParser.init(window.sax);
    var data = parser.parse(text);

    //$(dest).text(text);
    renderXmlDisplay(dest, data);
    
}

