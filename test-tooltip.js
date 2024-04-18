let table;
let years = [];
let minValue = Number.MAX_VALUE;
let maxValue = Number.MIN_VALUE;
let uniqueCountries = new Set();

function preload() {
    table = loadTable("hdis_02.csv", "csv", "header");
}

function setup() {
    createCanvas(900, 600);
    textSize(14);
    processTable(); // Process table for min/max values and unique countries
    initializeDropdown(); // Setup the dropdown once countries are identified
    drawPoints(); // Draw initial points
    drawYearLines(); // Add year lines and labels
}

function processTable() {
    years = table.columns.filter(column => /^\d+$/.test(column)); // Filter only year columns
    table.rows.forEach(row => {
        let country = row.get("country");
        if (country && !uniqueCountries.has(country)) {
            uniqueCountries.add(country);
        }
        years.forEach(year => {
            let value = Number(row.get(year));
            if (!isNaN(value)) {
                minValue = min(minValue, value);
                maxValue = max(maxValue, value);
            }
        });
    });
}

function initializeDropdown() {
    let selectDropdown = select("#countrySelect");
    selectDropdown.elt.innerHTML = ""; // Clear existing options
    uniqueCountries.forEach(country => {
        let opt = createElement('option', country);
        opt.value(country); // Set the option value
        opt.parent(selectDropdown);
    });
}

function drawPoints() {
    background(255);
    stroke(0);
    fill(150);
    let selectedCountry = select("#countrySelect").value();
    table.rows.forEach(row => {
        if (row.get("country") === selectedCountry) {
            years.forEach((year, index) => {
                let value = Number(row.get(year));
                if (!isNaN(value)) {
                    let x = map(index, 0, years.length - 1, 50, width - 50);
                    let y = map(value, minValue, maxValue, height - 50, 50);
                    ellipse(x, y, 5, 5); // Draw data point
                }
            });
        }
    });
}

function drawYearLines() {
    stroke(180);
    textAlign(CENTER);
    textSize(12);
    fill(0);
    years.forEach((year, index) => {
        let x = map(index, 0, years.length - 1, 50, width - 50);
        line(x, 50, x, height - 50); // Draw vertical line for each year
        text(year, x, height - 35); // Label each line with the year
    });
}


