let table;

function preload() {
    // Load your CSV file
    table = loadTable('hdis_02.csv', 'csv', 'header');
}

function setup() {
    createCanvas(800, 600);
    background(255);

    // Get the rows of the table
    let rows = table.getRows();

    // Iterate over all rows
    for (let r of rows) {
        // Extract data for the year 2020
        let value = r.getNum("2020");
        let country = r.getString("country");

        // Map the value to a y position
        // Assuming the HDI value ranges from 0 to 1
        let yPos = map(value, 0, 1, height, 0);

        // Map the countries to an x position (this is a simple way)
        let xPos = map(rows.indexOf(r), 0, rows.length, 0, width);

        // Draw an ellipse for each data point
        ellipse(xPos, yPos, 5, 5);

        // Optionally, add text labels for countries or values
        // textSize(8);
        // text(country, xPos, yPos);
    }
}
