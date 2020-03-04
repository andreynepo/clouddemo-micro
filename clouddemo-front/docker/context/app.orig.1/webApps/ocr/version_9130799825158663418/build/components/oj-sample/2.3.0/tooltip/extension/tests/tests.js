/*
 Copyright (c) 2019, Oracle and/or its affiliates.
 The Universal Permissive License (UPL), Version 1.0
 */
/*
 * QUnit Tests for Show-when-ready
 */

define(['ojs/ojcontext',
  'knockout',
  'oj-sample/tooltip/extension/tests/viewModels/testModel',
  'text!oj-sample/tooltip/extension/tests/views/test.html'],
  function (Context, ko, TestModel, testMarkup) {
    QUnit.module("tooltip:properties");
    QUnit.test("Default properties test", function (assert) {
      //insert the testing DOM structure
      var insertSite = document.getElementById('qunit-fixture');
      var template = document.createElement('template');
      template.innerHTML = testMarkup;
      insertSite.appendChild(template.content);
      var done = assert.async();
      assert.expect(2);
      require(['oj-sample/tooltip/loader'], function () {
        var componentDom = document.getElementById('oj-sample-tooltip-tests');
        var testModel = new TestModel();
        var busyContext = Context.getContext(componentDom).getBusyContext();
        ko.applyBindings(testModel, componentDom);
        busyContext.whenReady().then(function () {
          console.log("Tooltip");
          var ccaElement = document.getElementById('tooltip');
          var delay = ccaElement.getProperty('openDelay');
          console.log("Tooltip openDelay: " + delay);
          assert.equal(delay, 500, 'Default openDelay is 500ms');
          var duration = ccaElement.getProperty('displayDuration');
          console.log("Tooltip duration: " + duration);
          assert.equal(duration, 3000, 'Default displayDuration is 3000ms');
          done();
        });
      });
    });
  });