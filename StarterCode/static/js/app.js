function createPlots() {

    // Use D3 library to read in samples.json from URL
    const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

    // Read in json file
    d3.json(url).then(dataset => {
        console.log(dataset)

        // Create variables for bar chart
        var sampleValues = dataset.samples[0].sample_values.slice(0,10).reverse();
        console.log(sampleValues)
        
        var otuIds = dataset.samples[0].otu_ids;
        console.log(otuIds)
        
        var otuLabels = dataset.samples[0].otu_labels.slice(0,10).reverse();
        console.log(`OTU labels: ${otuLabels}`)
        
        var topOtuIds = dataset.samples[0].otu_ids.slice(0,10).reverse();
		
        var otuIdLabels = topOtuIds.map(d => "OTU " + d);
        console.log(`OTU ids: ${otuIdLabels}`)
		
        // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
        
        // Bar chart
        var barChart = {
            x: sampleValues,
            y: otuIdLabels,
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };
        
        var barData = [barChart];
        var layout = {
            title: "Top 10 OTUs Found in Individual",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Create bar chart
        Plotly.react("bar", barData, layout);

        // Create a bubble chart that displays each sample
        var bubChart = {
            x: dataset.samples[0].otu_ids,
            y: dataset.samples[0].sample_values,
            mode: "markers",
            marker:{
                size: dataset.samples[0].sample_values,
                color: dataset.samples[0].otu_ids
            },
            text: dataset.samples[0].otu_labels
        };

        
        var bubData = [bubChart];
        var layout1 = {
            title: "OTU Sample Counts",
            xaxis: {title: "OTU ID"},
            height: 600,
            width: 1200
        };

        // Create bubble chart
        Plotly.react("bubble", bubData, layout1);

        // Dropdown option
        dropdown = document.getElementById('selDataset');
        defaultOption = document.createElement('option')
        options = dataset.names
		
        for (i=0; i < options.length; i++){
            option = document.createElement('option');
            option.text = options[i];
            option.value = options[i];
            dropdown.add(option);
        };
        
        var metadata = dataset.metadata;
        console.log(metadata)
        
        var id = 940;
        
        var result = metadata.filter(meta => meta.id === id)[0];
        console.log(result)
        
        var demographicInfo = d3.select("#sample-metadata");
        
        demographicInfo.html("");
        
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
            });
        });
    };  

// Update based on dropdown selection change
d3.selectAll("#selDataset").on("change", getData);

function getData() {

    dropDown = d3.select("#selDataset");
    idInfo = dropDown.property("value");
    console.log(idInfo)
    d3.json("samples.json").then(dataset => {
        idNo = dataset.names
        for (i = 0; i < idNo.length; i++) {
            if (idInfo == idNo[i]) {
				
                // Update bar chart
                console.log("success")
                var otuIds = dataset.samples[i].otu_ids;
                var sampleValues = dataset.samples[i].sample_values.slice(0,10).reverse();
                var otuLabels = dataset.samples[i].otu_labels.slice(0,10).reverse();
                var topOtuIds = dataset.samples[i].otu_ids.slice(0,10).reverse();
                var otuIdLabels = topOtuIds.map(d => "OTU " + d);

                var barChart = {
                    x: sampleValues,
                    y: otuIdLabels,
                    text: otuLabels,
                    type: "bar",
                    orientation: "h"
                };

                var bubData = [barChart];
                var layout = {
                    title: "Top 10 OTUs Found in Individual",
                    margin: {
                        l: 100,
                        r: 100,
                        t: 100,
                        b: 100
                    }
                };

                // Update bubble Chart
                var bubChart = {
                    x: dataset.samples[i].otu_ids,
                    y: dataset.samples[i].sample_values,
                    mode: "markers",
                    marker:{
                        size: dataset.samples[i].sample_values,
                        color: dataset.samples[i].otu_ids
                    },
                    text: dataset.samples[i].otu_labels
                };

                var bubData2 = [bubChart];
                var layout1 = {
                    title: "Top 10 OTUs Found in Individual",
                    xaxis: {title: "OTU ID"},
                    height: 600,
                    width: 1200
                };

                // Update demographics
                var metadata = dataset.metadata;

                console.log(metadata)
                var result = metadata.filter(meta => meta.id === +idInfo)[0];
        
                var demographicInfo = d3.select("#sample-metadata");

                demographicInfo.html("");
                console.log(result)
                Object.entries(result).forEach((key) => {
                    demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
                });
        updatePlotly(bubData, bubData2, result)
            }
        }
    });
}

function updatePlotly(newdata1, newdata2, result) {
    var layout1 = {
        title: 'Top 10 OTUs Found in Individual',
        xaxis: {
            title: {
              text: 'OTU IDs'}}
        };
    
    var layout2 = {
        height: 600,
        width: 1200,
        title: 'OTU Sample Counts',
        xaxis: {
            title: {
              text: 'OTU IDs'}}
        };
    Plotly.react('bar',newdata1, layout1);
    Plotly.react('bubble', newdata2, layout2);

    box = d3.selectAll('#sample-metadata');
    box.html('');
    
    Object.entries(result).forEach(([key,value]) => {
        console.log(`${key}: ${value}`);
        box.append('ul').text(`${key}: ${value}`);
    });
}

getData();
createPlots();