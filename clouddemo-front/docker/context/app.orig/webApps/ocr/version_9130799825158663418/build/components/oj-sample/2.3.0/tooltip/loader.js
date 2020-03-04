/**
  Copyright (c) 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(['ojs/ojcomposite', 'text!./tooltip-view.html', './tooltip-viewModel', 'text!./component.json', 'css!./tooltip-styles.css'],
  function (Composite, view, viewModel, metadata) {
    Composite.register('oj-sample-tooltip', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);