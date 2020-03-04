/**
  Copyright (c) 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/

define(
    ['ojs/ojcontext', 'knockout', 'ojL10n!./resources/nls/tooltip-strings', 'ojs/ojpopup'], function (ojContext, ko, componentStrings) {

        function TooltipComponentModel(context) {
            var self = this;
            self.composite = context.element;
            self.loggingIdentity = 'oj-sample-tooltip (' + context.uniqueId + '): ';
            self.contentSubId = context.uniqueId + '-content';
            self.popupSubId = context.uniqueId + '-popup';
            self.properties = context.properties;
            self.res = componentStrings.ojsampleTooltip;
            self.isVBCSDT = ko.observable(self._detectDTMode(context.element));

            self.setupComplete = new Promise(function (resolve) {
                self.markSetupComplete = resolve;
            });
        }

        TooltipComponentModel.prototype.bindingsApplied = function (context) {
            var self = this;
            self.markSetupComplete();
            delete self.markSetupComplete;
        }

        TooltipComponentModel.prototype.connected = function (context) {
            var self = this;
            self.setupComplete.then(function () {
                if (!self.popupElement) {
                    self.popupElement = document.getElementById(self.popupSubId);
                    var callbackClearTimeout = self._handleClearTimeout.bind(self);
                    var callbackSetTimeout = self._handleSetTimeout.bind(self);
                    self.popupElement.addEventListener("ojOpen", callbackSetTimeout);
                    self.popupElement.addEventListener("ojBeforeClose", callbackClearTimeout);
                    self.popupElement.addEventListener("ojFocus", callbackClearTimeout);
                    self._callbackOpen = self._handleOpen.bind(self);
                    self._callbackClose = self._handleClose.bind(self);
                }
                var callbackOpen = self._callbackOpen
                self.composite.addEventListener("mouseenter", callbackOpen, true);
                self.composite.addEventListener("focus", callbackOpen, true);
            });
        };

        TooltipComponentModel.prototype.disconnected = function (context) {
            var self = this;
            if (self.popupElement) {
                var callbackOpen = self._callbackOpen
                self.composite.removeEventListener("mouseenter", callbackOpen, true);
                self.composite.removeEventListener("focus", callbackOpen, true);
            }
        };

        TooltipComponentModel.prototype.refresh = function () {
            var self = this;
            self.isVBCSDT(self._detectDTMode(self.composite));
        };

        TooltipComponentModel.prototype.show = function () {
            var self = this;
            self.popupElement.open(self.composite);
        };

        TooltipComponentModel.prototype._handleOpen = function (event) {
            var self = this;
            if (!self.openInProgress) {
                self.openInProgress = true;
                setTimeout(function () {
                    self.popupElement.open(event.target);
                }.bind(this),
                    self.properties.openDelay);
            }
        };

        TooltipComponentModel.prototype._handleClose = function (event) {
            var self = this;
            var isOpen = !self.popupElement.isOpen();
            if (!isOpen) {
                self.popupElement.close();
            }
        };

        TooltipComponentModel.prototype._handleSetTimeout = function (event) {
            var self = this;
            self._timeoutId = window.setTimeout(self._callbackClose, self.properties.displayDuration);
            if (self.openInProgress) {
                self.openInProgress = false;
            }
        };

        TooltipComponentModel.prototype._handleClearTimeout = function (event) {
            var self = this;
            var timeoutId = self._timeoutId;
            delete self._timeoutId;
            window.clearTimeout(timeoutId);
        };

        TooltipComponentModel.prototype.hide = function () {
            var self = this;
            // no-op
        };

        TooltipComponentModel.prototype._detectDTMode = function (component) {
            if (component.getAttribute('data-vbdt-component')) {
                return true;
            }
            else {
                return false;
            }
        };
        return TooltipComponentModel;
    });