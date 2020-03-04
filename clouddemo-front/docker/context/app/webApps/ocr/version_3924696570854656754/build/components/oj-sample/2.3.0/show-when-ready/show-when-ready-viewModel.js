/**
  Copyright (c) 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/

define(
    ['ojs/ojcontext', 'knockout', 'ojL10n!./resources/nls/show-when-ready-strings'], function (Context, ko, componentStrings) {

        function ShowWhenReadyComponentModel(context) {
            var self = this;
            self.composite = context.element;
            self.loggingIdentity = 'oj-sample-show-when-ready (' + context.uniqueId + '): ';
            self.slotWrapperSubId = context.uniqueId + '-content';
            self.properties = context.properties;

            self.res = componentStrings.ojsampleShowWhenReady;

            //Display control
            self.externalReadyFlag = ko.observable(self.properties.ready);
            self.shownAtLeastOnce = ko.observable(self.properties.ready ? true : false);
            self.allReady = ko.pureComputed(function () {
                if (self.isVBCSDT()) {
                    return true;
                }
                else {
                    if (self.properties.loadState !== 'timeout') {
                        if (self.externalReadyFlag()) {
                            self._setLoadState('ready');
                            return true;
                        }
                        else {
                            self._setLoadState('loading');
                            return false;

                        }
                    }
                    else {
                        return false;
                    }
                }
            }
            );

            self.displayControl = ko.pureComputed(function () {
                return self.allReady() ? 'block' : 'none';
            });

            // Setup the loading image if there is not an override from the user
            self.loadingImage = ko.observable();
            self.loadingAltText = ko.observable(self.res.pageLoading);
            if (!context.slotCounts.loading) {
                self._patchLoadingImage(context.properties.imageSource);
                if (context.properties.translations.pageLoading) {
                    self.loadingAltText(context.properties.translations.pageLoading);
                }
            }

            self.isVBCSDT = ko.observable(self._detectDTMode(context.element));

        };

        ShowWhenReadyComponentModel.prototype.connected = function (context) {
            var self = this;
            self.refresh();
        };

        ShowWhenReadyComponentModel.prototype.disconnected = function (context) {
            var self = this;
            self._setLoadState('unmonitored');
        };

        ShowWhenReadyComponentModel.prototype.propertyChanged = function (context) {
            var self = this;
            if (context.updatedFrom === 'external') {
                switch (context.property) {
                    case 'ready':
                        self.refresh(context.value);
                        break;
                    case 'imageSource':
                        self._patchLoadingImage(value);
                        break;
                    case 'translations':
                        self.loadingAltText(value.pageLoading);
                        break;
                }
            }
        };

        ShowWhenReadyComponentModel.prototype.refresh = function (newReadyState) {
            var self = this;
            //self._setLoadState('loading');
            self.isVBCSDT(self._detectDTMode(self.composite));
            var busyContext = Context.getPageContext().getBusyContext();
            busyContext.whenReady().then(function () {
                if (newReadyState !== undefined) {
                    if (!self.shownAtLeastOnce() && newReadyState) {
                        self.shownAtLeastOnce(true);
                    }
                    self.externalReadyFlag(newReadyState);
                }
            });
        }

        ShowWhenReadyComponentModel.prototype._setLoadState = function (state) {
            var self = this;
            var existingState = self.properties.loadState;
            if (!existingState || existingState !== state) {
                self.properties.setProperty('loadState', state);
            }
        }

        ShowWhenReadyComponentModel.prototype._patchLoadingImage = function (image) {
            var self = this;
            if (image && image.length > 0) {
                self.loadingImage(image);
            }
            else {
                self.loadingImage(require.toUrl('oj-sample/show-when-ready/resources/images/spinner_full.gif'));
            }
        };

        ShowWhenReadyComponentModel.prototype._detectDTMode = function (component) {
            if (component.getAttribute('data-vbdt-component')) {
                return true;
            }
            else {
                return false;
            }
        };
        return ShowWhenReadyComponentModel;
    });