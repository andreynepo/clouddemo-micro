# Oracle JET - Show When Ready Component

The **`<oj-sample-show-when-ready>`** component provides you with a convenient way of showing a loading icon whilst background activity is taking place and then revealing the content of the component once the task has completed.

The display of the content area (the default slot) is controlled by two factors - the overall busy state of the page managed by JET itself and the state of the **`ready`** property which you will control.  When this flag is set to *false*, then the loading icon (or slot) is displayed, when the value of the property changes to *true*, provided that the page as a whole is no longer busy, then the contents of the default slot will be shown and the loading icon hidden. If the ready state is true, but the page as a whole is still busy then the loading indicator will continue to display until the page is not longer busy.

## Using the Component

To use the component you just need to include it into your page, set the **ready** property to either a boolean variable (in Visual Builder) or a boolean observable in JET.  Then add the content that you want to reveal when the page is ready as children of the component.

Your page initialization code can then initially set the value of the control variable to false and then reset it to true once you have all the data that you need.  In Visual Builder you would (for example) set the control variable as the last step in the **`vbEnter`** action chain

### Example - Oracle Visual Builder

``` HTML
<oj-sample-show-when-ready ready="{{$page.variables.pageIsReady }}">
    <oj-table data="{{$page.variables.employeeSDP}}"
       ....
    </oj-table>
</oj-sample-show-when-ready>
```

### Configuring the Loading Screen

The default loading icon is a centered 48x48px spinner.  You may provide your own image using the **`imageSource`** property (image-source tag attribute), which will also be set to this size.  If you want more control over the contents of the loading screen then you can provide your own implementation using the  **loading** slot.

The alt text for the default loading image may be set using the **`translations.page-loading`** attribute on the tag. 

### Advanced Usage

If you want to execute further code at the point in time that the component becomes completely ready, then you can listen for changes on the **`loadState`** property for the component. When this is set the the value *ready* then the component will have had toggled to the ready state - this includes the overall page state as well, i.e. both your ready flag is set to true *and* the page is not in an overall busy state.

## Support Information

This component is an unsupported sample for demonstration purposes only. If you encounter any problems feel free to report them via the Oracle forums and we will do our best to address them, however, note that this will be on a best-effort basis only.