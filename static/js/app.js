// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filteredMetadata = metadata.find(selected => selected.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panelSelected = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panelSelected.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredMetadata).forEach(([key, value]) => {
      panelSelected.append("p").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredSample = samples.filter(sampleObject => sampleObject.id == sample);
    let selectedData   = filteredSample[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids       = selectedData.otu_ids;
    let otu_labels    = selectedData.otu_labels;
    let sample_values = selectedData.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {     x : otu_ids,
                            y : sample_values,
                         text : otu_labels,
                         mode : 'markers',
                       marker : {      size : sample_values,
                                      color : otu_ids,
                                 colorscale : 'YlGnBu'}
                       };

    let bubbleLayout = {title : 'Bubble Chart of Sample Data',
                      xaxis : { title: 'OTU ID' },
                      yaxis : { title: 'Sample Values' }
                      };




    // Render the Bubble Chart
    Plotly.newPlot('bubble',
                   [bubbleTrace],
                   bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks    = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let barValues = sample_values.slice(0, 10).reverse();
    let barLabels = otu_labels.slice(0, 10).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace = {          x : barValues,
                              y : yticks,
                           text : barLabels,
                           type : 'bar',
                    orientation : 'h',
                         marker : {color: 'rgba(97, 157, 196, 0.85)',
                                  line: {color: 'rgb(8,48,107)',
                                         width: 0.5}
                                   }
                    };

    let barLayout = {title : 'Top 10 OTUs Found in Sample',
                     xaxis : { title: 'Sample Values' },
                     yaxis : { title: 'OTU ID'}
                     };

    // Render the Bar Chart
    Plotly.newPlot('bar',
                   [barTrace],
                   barLayout);
});
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownSelected = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {dropdownSelected.append("option")
                                               .text(sample)
                                               .property("value", sample);
                               }); // code for the loop obtained via use of ChatGPT

    // Get the first sample from the list
    let nameFirst = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(nameFirst);
    buildMetadata(nameFirst);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
