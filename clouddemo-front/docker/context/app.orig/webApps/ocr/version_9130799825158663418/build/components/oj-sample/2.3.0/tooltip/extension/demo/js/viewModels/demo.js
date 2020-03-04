/**
  Copyright (c) 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
    ['ojs/ojcontext', 'knockout', 'oj-sample/tooltip/loader', 'ojs/ojbutton', 'ojs/ojformlayout', 'ojs/ojinputnumber', 'ojs/ojswitch'],
    function (Context, ko) {
        'use strict';
        function tooltipModuleViewModel(params) {
            var self = this;
            self.menuSignal;
            self.addNav = ko.observable(false);
            if (params && params.menuSignal) {
                self.menuSignal = params.menuSignal;
                self.addNav(true);
            }
            self.goBack = function (event) {
                if (self.menuSignal) {
                    self.menuSignal.dispatch('componentMenu');
                }
            };
            self.emulateDTMode = ko.observable(false);



            self.emulateDTMode.subscribe(function (switchedOn) {
                var element = document.getElementById('oj-sample-tooltip');
                if (switchedOn) {
                    element.setAttribute('data-vbdt-component', 'test');
                }
                else {
                    element.removeAttribute('data-vbdt-component');
                }
                element.refresh();
            });


            self.callShow = function (event, vm) {
                var element = document.getElementById('oj-sample-tooltip');
                element.show();
            }
            self.callHide = function (event, vm) {
                var element = document.getElementById('oj-sample-tooltip');
                element.hide();
            }

        };


        return tooltipModuleViewModel;
    });
