/**
  Copyright (c) 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
    ['ojs/ojcontext', 'knockout', 'oj-sample/show-when-ready/loader','ojs/ojbutton','ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojswitch'],
    function (Context, ko) {
        'use strict';
        function showWhenReadyModuleViewModel(params) {
            var self = this;
            self.menuSignal;
            self.addNav = ko.observable(false);
            if (params && params.menuSignal){
                self.menuSignal = params.menuSignal;
                self.addNav(true);
            }
            self.goBack = function(event){
                if (self.menuSignal){
                    self.menuSignal.dispatch('componentMenu');
                }
            };
            self.emulateDTMode = ko.observable(false);
            self.emulateBusyState = ko.observable(false);
            self.readyValue = ko.observable(false);
            self.state = ko.observable();


            self.emulateBusyState.subscribe(function(switchedOn){
                var busyContext = Context.getPageContext().getBusyContext();
                var element = document.getElementById('oj-sample-show-when-ready');
                if (switchedOn){
                    var options = {"description": "Emulating Busy Load for Show When Ready Component"};
                    self.resolveCurrentBusyState = busyContext.addBusyState(options);
                    element.refresh();
                }
                else {
                    if (self.resolveCurrentBusyState){
                        self.resolveCurrentBusyState();
                    }
                }
                busyContext.dump();
            });
            self.emulateDTMode.subscribe(function(switchedOn){
                var element = document.getElementById('oj-sample-show-when-ready');
                if(switchedOn){
                    element.setAttribute('data-vbdt-component','test');
                }
                else {
                    element.removeAttribute('data-vbdt-component');
                }
                element.refresh();
            });


            self.callRefresh = function(event,vm){
                var element = document.getElementById('oj-sample-show-when-ready');
                element.refresh();
            }
        };


        return showWhenReadyModuleViewModel;
    });
