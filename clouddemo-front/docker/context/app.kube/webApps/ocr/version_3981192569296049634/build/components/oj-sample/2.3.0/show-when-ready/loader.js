/**
  Copyright (c) 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(['ojs/ojcomposite', 'text!./show-when-ready-view.html', './show-when-ready-viewModel', 'text!./component.json','css!./show-when-ready-styles.css'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('oj-sample-show-when-ready', {
      view: view, 
      viewModel: viewModel, 
      metadata: JSON.parse(metadata)
    });
  }
);