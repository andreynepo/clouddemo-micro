/*
 Copyright (c) 2019, Oracle and/or its affiliates.
 The Universal Permissive License (UPL), Version 1.0
 */
/*
 * QUnit Tests for Show-when-ready
 */

define(['ojs/ojcontext', 
        'knockout', 
        'oj-sample/show-when-ready/extension/tests/viewModels/testModel', 
        'text!oj-sample/show-when-ready/extension/tests/views/test.html'],
  function (Context, ko, TestModel, testMarkup) {
    QUnit.module("show-when-ready:properties");
    QUnit.test("Default properties test", function (assert) {
      //insert the testing DOM structure
      var insertSite = document.getElementById('qunit-fixture');
      var template = document.createElement('template');
      template.innerHTML = testMarkup;
      insertSite.appendChild(template.content);
      var done = assert.async();
      assert.expect(3);
      require(['oj-sample/show-when-ready/loader'], function () {
        var componentDom = document.getElementById('oj-sample-show-when-ready-tests');
        var testModel = new TestModel();
        var busyContext = Context.getContext(componentDom).getBusyContext();
        ko.applyBindings(testModel, componentDom);
        busyContext.whenReady().then(function () {
          //did it instanciate?
          var ccaElement = document.getElementById('show-when-ready');
          var readyState = ccaElement.getProperty('ready');
          assert.ok(!readyState, 'Default ready state is false');
          var state = ccaElement.getProperty('loadState');
          assert.equal(state,'loading', 'Default load state is loading');
          ccaElement.setProperty('ready',true);
          //Next test on a slight delay because of rate limiting on the component observables 
          window.setTimeout(function(){
            state = ccaElement.getProperty('loadState');
            assert.equal(state,'ready','Loaded state is \"ready\"');
            done();
          },200);

        });
      });
    });
  });