let table;
let years = [];
let minValue = Number.MAX_VALUE;
let maxValue = Number.MIN_VALUE;
let uniqueCountries = new Set();
let div;
let hover;

function preload() {
    table = loadTable("hdis_02.csv", "csv", "header");
}

function setup() {
    hover = '';
    div = createDiv(hover);
    div.position(0,0);
    const canvas = createCanvas(900, 600); // Match the size to your CSS dimensions
    canvas.parent('canvas-container'); // This makes the canvas a child of the container
    background(255);

    years = table.columns
        .filter(column => /^\d+$/.test(column))
        .filter(year => year >= 1990 && year <= 2021);

    const selectDropdown = select("#countrySelect");

    table.rows.forEach(row => {
        const countryName = row.get("country");
        if (!uniqueCountries.has(countryName)) {
            uniqueCountries.add(countryName);

            const opt = document.createElement("option");
            opt.value = countryName;
            opt.text = countryName;
            selectDropdown.elt.add(opt);
        }

        years.forEach(year => {
            const value = Number(row.get(year));
            if (!isNaN(value)) {
                if (value < minValue) minValue = value;
                if (value > maxValue) maxValue = value;
            }
        });
    });

    selectDropdown.changed(drawScatterplot);
    drawScatterplot();
}

function draw() {
    const selectDropdown = select("#countrySelect");
    selectDropdown.changed(drawScatterplot);
    drawScatterplot();
}

function drawScatterplot() {
    const selectedCountry = select("#countrySelect").value();
   // console.log(selectedCountry);
    clear();
    background(255);

    // Set text properties
    textFont('adelle-sans-condensed'); // Use your specific font
    textSize(12);
    fill('grey'); // Set the text fill color

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const xOffset = 10;
    const tickLength = 5;
    const femaleColor = color(255, 105, 180);
    const maleColor = color(0, 0, 255);

    // Draw tick marks and labels for the x-axis
    textAlign(CENTER, TOP); // Center-align x-axis labels horizontally
    years.forEach((year, index) => {
        const x = map(index, 0, years.length - 1, margin.left + xOffset, width - margin.right);
        stroke(0);  // Ensure stroke is set for lines
        line(x, height - margin.bottom, x, height - margin.bottom + tickLength);

        // Only draw the label for every other year
        if (index % 2 === 0) {
            noStroke(); // Disable stroke for text drawing
            text(year, x, height - margin.bottom + 20);
        }

        stroke(0); // Re-enable stroke for subsequent lines
    });

    // Draw tick marks and labels for the y-axis
    const tickCount = 10;
    textAlign(RIGHT, CENTER); // Right-align y-axis labels
    for (let i = 0; i <= tickCount; i++) {
        const value = map(i, 0, tickCount, minValue, maxValue);
        const y = map(value, minValue, maxValue, height - margin.bottom, margin.top);
        
        stroke(0); // Ensure stroke is set for lines
        line(margin.left, y, margin.left - tickLength, y);
        noStroke(); // Disable stroke for text drawing
        text(value.toFixed(2), margin.left - 10, y);
        stroke(0); // Re-enable stroke for subsequent lines
    }

    // Draw the data points and check for hover
    let hoverText = null;
    let hoverX = 0;
    let hoverY = 0;

    table.rows.forEach(row => {
        const countryName = row.get("country");
        const gender = row.get("gender");

        if (countryName === selectedCountry) {
            years.forEach((year, index) => {
                let value = row.get(year);
                if (value === null || value === '' || isNaN(value)) {
                    return;
                }

                value = Number(value);
                const x = map(index, 0, years.length - 1, margin.left + xOffset, width - margin.right);
                const y = map(value, minValue, maxValue, height - margin.bottom, margin.top);

                // Check for hover on each point
                const distance = dist(mouseX, mouseY, x, y);
                if (distance < 5) {  // 5 pixels radius for hover detection
                    hoverText = `${year}: ${value}`;
                    hoverX = x;
                    hoverY = y;
                }

                if (gender === 'f') {
                    noFill();
                    stroke(femaleColor);
                    ellipse(x, y, 10, 10);
                } else if (gender === 'm') {
                    stroke(maleColor);
                    line(x - 5, y - 5, x + 5, y + 5);
                    line(x + 5, y - 5, x - 5, y + 5);
                }
            });
        }
    });

    // Draw the axis lines
    stroke(0);
    line(margin.left, height - margin.bottom, width - margin.right, height - margin.bottom); // X-axis
    line(margin.left, margin.top, margin.left, height - margin.bottom); // Y-axis

    // Display hover text if applicable
    if (hoverText) {
        fill('black');
        noStroke();
        textSize(14);
        hover = hoverText;
        div.position(hoverX + 10, hoverY);
        background(255);
         // Increase text size for visibility
    }
}
