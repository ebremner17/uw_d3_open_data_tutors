$(document).ready(function () {

  var tutors_obj;
  var students;

  // Width and height of the chart.
  var width = 2400;
  var height = 600;

  // Set the margins for the vertical chart.
  var margin = {
    top: 20,
    right: 20,
    bottom: 70,
    left: 40
  };

  // Used to store the actual data.
  var data;

  // The padding between each bar of the chart.
  var bar_padding;

  // The maximum point of the data set.
  // Used to calculate scales and placements
  var max_point;

  // The value used to scale the data points.
  var scaler;

  // The width of each bar in the chart.  
  var bar_width;

  // Loads the data through D3 using JSON.
  d3.json("http://api.uwaterloo.ca/v2/resources/tutors.php?key=<insert_key_here>", function (error, tutors) {
    // Store the data in the global variable.
    tutors_obj = tutors;

    // Calculate the maximum point using D3's max function.
    max_point = d3.max(tutors.data, function (d) {
      return +d.tutors_count;
      });

    // Calculate the bar width by dividing the width of the chart by the number of data points.
    bar_width = width / tutors.data.length;

    // Set the bar padding (space between bars).
    bar_padding = 0.75;

    // Calculate the scaling factor for each bar by diving the maximum point by the height.
    // This will either shrink or grow the bar, depending on the values that are being charted.
    scaler = max_point / height;

    // The variable that is going to draw the chart, this is D3 using jquery to find the place
    // to put the chart.
    svg = d3.select("body").append("svg");

    // Set the height and width of the chart.  
    svg.attr("width", width);
    svg.attr("height", (height + margin.top + margin.bottom));

    // Set the colour of each bar.
    // Start with the orange colour and get light as it the data gets higher
    var gradient = svg
      .append("linearGradient")
      .attr("y1", "0")
      .attr("y2", max_point)
      .attr("x1", "0")
      .attr("x2", "0")
      .attr("id", "gradient")
      .attr("gradientUnits", "userSpaceOnUse")

    gradient
      .append("stop")
      .attr("offset", "0")
      .attr("stop-color", "#ff0")

    gradient
      .append("stop")
      .attr("offset", "0.5")
      .attr("stop-color", "#f00")

    // Declare the tip which is actually the description.
    tip = d3.tip()
      // Add the class from CSS of d3-tip (see css/vertical_chart.css).
      .attr('class', 'd3-tip')
      // Placement from top of data point.
      .offset([-10, 0])
      // Set the html for the tip using the data.data object.
      .html(function (f) {
        return f.subject + f.catalog_number + ": " + f.tutors_count;
      });

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .style("text-anchor", "middle")
      .style('font-size', '30px')
      .text("Number of Tutors per Course");

    // D3 declartion of the bars on the chart.  
    svg.selectAll("rect")
    // Load the data in from the JSON object, use data.data as explained above.
      .data(tutors.data)
      .enter()
      .append("rect")

      // Set the x-coordinate of the bar.
      // Stepping through each data point and multiplying the counter (i) by the
      // bar width that we calculated above.
      .attr("x", function (d, i) {
        return i * bar_width;
      })

    // Setting the gradient as defined above.
    .attr("fill", "url(#gradient)")

    // Set the y-coordinate of each bar.
    // Step through each data point and multiply it by the scaler to either
    // shrink or enlarge the bar.
    .attr("y", function (d) {
      return (((height - (d.tutors_count / scaler)) + margin.bottom));
    })

    // Set the width of each bar.
    //  Use the bar width calculated early and subtract the bar padding (space between each bar).
    .attr("width", bar_width - bar_padding)

    // Set the height of each bar
    // Step through each data point and divide it by the scaler to shrink or enlarge each bar.
    .attr("height", function (d) {
      return d.tutors_count / scaler;
    })

    // Set the mouseover and mouseout to the tip show and hide.
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

    // Add the tip to each bar.
    .call(tip);

  });

});