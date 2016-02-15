/* global $ */
"use strict";

function templateInit(options) {
    
    var ui = {
        defaultButton: $('#idButton'),
        progressBar: $('#idProgress'),
        textarea: $('#idTextarea'),
        results: $('#idResults'),
        
        alertConnecting: $('#idAlertConnecting'),
        alertConnectionFailed: $('#idAlertConnectionFailed'),
        alertExecute: $('#idAlertExecute'),
        retryButton: $('#idButtonRetry')        
    }
    options.ui = ui;
    
    ui.progressBar.hide();
    
    ui.alertConnecting.hide();
    ui.alertConnectionFailed.hide();
    ui.alertExecute.hide();
    
}
