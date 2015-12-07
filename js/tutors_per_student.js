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
    // Set the tutors data to the global variable tutors_obj.
    tutors_obj = tutors;
  });

  // Loads the data through D3 using JSON.
  d3.json("https://api.uwaterloo.ca/v2/terms/1159/enrollment.json?key=<insert_key_here>", function (error, students_full) {
    var students = {};

    // Get the actual student data using alasql.
    students = alasql('SELECT students.subject as subject, students.catalog_number as catalog_number, SUM(tutors.tutors_count) as tutors_count, SUM(students.enrollment_total) as enrollment_total, (SUM(tutors.tutors_count) / SUM(students.enrollment_total) * 100) as ratio, tutors.title as title FROM ? as tutors INNER JOIN ? as students ON (tutors.subject = students.subject AND tutors.catalog_number = students.catalog_number) WHERE (students.enrollment_total > 0) AND students.section LIKE "LEC%" GROUP BY students.subject, students.catalog_number', [tutors_obj.data, students_full.data]);

    // Calculate the maximum point using D3's max function.
    max_point = d3.max(students, function (d) {
      return +d.ratio;
    });

    // Calculate the bar width by dividing the width of the chart by the number of data points.
    bar_width = width / students.length;

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
    var gradient = svg.append("svg:defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("svg:stop")
      .attr("offset", "0%")
      .attr("stop-color", "#0c0")
      .attr("stop-opacity", 1);

    gradient.append("svg:stop")
      .attr("offset", "100%")
      .attr("stop-color", "#c00")
      .attr("stop-opacity", 1);


    // Declare the tip which is actually the description.
    tip = d3.tip()
      // Add the class from CSS of d3-tip (see css/vertical_chart.css).
      .attr('class', 'd3-tip')
      // Placement from top of data point.
      .offset([-10, 0])
      // Set the html for the tip using the students object.
      .html(function (f) {
        var ratio_number = f.ratio;
        return f.subject + f.catalog_number + ": " + ratio_number.toFixed(1) + "%<br />Enrollment: " + f.enrollment_total + "<br />" + "Tutors: " + f.tutors_count;
      });

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .style("text-anchor", "middle")
      .style('font-size', '30px')
      .text("Percentage of Tutors per Students");

    // D3 declartion of the bars on the chart.  
    svg.selectAll("rect")
      // Load the data in from the JSON object, use students data.
      .data(students)
      .enter()
      .append("rect")

    // Set the x-coordinate of the bar.
    // Stepping through each data point and multiplying the counter (i) by the
    // bar width that we calculated above.
    .attr("x", function (d, i) {
      return i * bar_width;
    })

    // Set the y-coordinate of each bar.
    // Step through each data point and multiply it by the scaler to either
    // shrink or enlarge the bar.
    .attr("y", function (d) {
      return (((height - (d.ratio / scaler)) + margin.bottom));
    })

    // Set the width of each bar.
    //  Use the bar width calculated early and subtract the bar padding (space between each bar).
    .attr("width", bar_width - bar_padding)

    // Set the height of each bar
    // Step through each data point and divide it by the scaler to shrink or enlarge each bar.
    .attr("height", function (d) {
      return d.ratio / scaler;
    })

    // Setting the gradient as defined above.
    .attr("fill", "url(#gradient)")

    // Set the mouseover and mouseout to the tip show and hide.
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

    // Add the tip to each bar.
    .call(tip);

  });

});