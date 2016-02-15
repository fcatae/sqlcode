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
    attention: processXEvents(ReportAttention),
    duration: processXEvents(ReportDuration),
    stmtDuration: processXEvents(ReportStmtDuration),
    waitinfo: processXEvents(ReportWaitInfo)
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
        
var _parser = XmlParser.init(window.sax);

function processXEvents(app) {
    
    var renderTextFunction = function(text, selector) {
        var data = _parser.parse(text);
        ReactDOM.render(React.createElement(app, {"data": data}), document.querySelector(selector));
    }
    
    return renderTextFunction;
}
