function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the selected options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  d3.json("samples.json").then((data) => {
      console.log(data)});
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var allSamples = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = allSamples.filter(sampleAttribute => sampleAttribute.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    var singleSample = filteredSamples[0]
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = singleSample.otu_ids
    var otuLabels = singleSample.otu_labels
    var sampleValues = singleSample.sample_values
    // 7. Create the yticks for the bar chart.
    //  so the otu_ids with the most bacteria are last. 
    Values = sampleValues.slice(0,10).reverse()
    IDs = otuIDs.slice(0,10).map(item => `OTU ${item} `).reverse()
    console.log(IDs)
    // // 8. Create the trace for the bar chart. 
    var barData = [{
      x: Values,
      y: IDs,
      type:'bar',
      orientation: 'h'
    }];
    // // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found'
  }
    // // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
   
    // 1. Create the trace for the bubble chart.
    xvalues = otuIDs.reverse()
    yvalues = sampleValues.reverse()
    sizes = yvalues.map(item => item*(.3*item))
    bubbleText = otuLabels.reverse()
    var bubbleData = [{
      x: xvalues,
      y: yvalues,
      text: bubbleText,
      mode: 'markers',
      marker: {
        sizemode: 'area',
        size: sizes,
        color: xvalues,
        colorscale: 'Earth'
      }
    }];
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      yaxis: {
        range: [0,250]
      },
      showlegend: false,
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  });
};
