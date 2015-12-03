$( document ).ready(function() {

  // Width and height of the chart.
  var width = 2000;
  var height = 600;
	
  var bar_width = 1;

  // Loads the data through D3 using JSON.
  d3.json("http://api.uwaterloo.ca/v2/resources/tutors.json?key=dem0hash", function(error, data) {
    // The data is actaully in data.data since the data is modelled with two objects of meta and data.

    // The variable that is going to draw the chart, this is D3 using jquery to find the place
    // to put the chart.
    svg = d3.select("body").append("svg");

    // Set the height and width of the chart.  
    svg.attr("width", width);
    svg.attr("height", height);

    // D3 declartion of the bars on the chart.  
    svg.selectAll("rect")
        // Load the data in from the JSON object, use data.data as explained above.
        .data(data.data)
        .enter()
        .append("rect")

        // Set the x-coordinate of the bar.
        // Stepping through each data point and multiplying the counter (i) by the
        // bar width that we calculated above.
        .attr("x", function(d, i) {
          return i * bar_width;
        })

        // Set the y-coordinate of each bar.
        // Step through each data point and multiply it by the scaler to either
        // shrink or enlarge the bar.
        .attr("y", function(d) {
          return d;
        })

        // Set the width of each bar.
        //  Use the bar width calculated early and subtract the bar padding (space between each bar).
        .attr("width", bar_width)

        // Set the height of each bar
        // Step through each data point and divide it by the scaler to shrink or enlarge each bar.
        .attr("height", function(d) {
          return d.tutors_count;
        })
    });
});