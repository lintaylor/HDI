let table;
let years = [];
let minValue = Number.MAX_VALUE;
let maxValue = Number.MIN_VALUE;

function preload() {
    table = loadTable('hdis_02.csv', 'csv', 'header');
}

function setup() {
    createCanvas(800, 600);
    background(255);

    // Assuming the years are column headers starting from the second column
    years = table.columns.slice(1);

    const selectDropdown = select("#countrySelect");
    
    let i = 1;
    let uniqueCountries = new Set();
    table.rows.forEach(row => {
        const countryName = row.get("country");
        if (!uniqueCountries.has(countryName)) {
            uniqueCountries.add(countryName);
        
            const opt = document.createElement("option");
            opt.value = "option"+i;
            i++;
            opt.text = countryName;
            selectDropdown.elt.add(opt);
        }
    });

    

    // Calculate min and max values for the dataset
    table.rows.forEach(row => {
        years.forEach(year => {
            let val = Number(row.get(year));
            if (!isNaN(val)) {
                minValue = min(minValue, val);
                maxValue = max(maxValue, val);
            }
        });
    });

    let countrySelect = select('#countrySelect');
    countrySelect.changed(() => displayDataForCountry(countrySelect.value()));

    displayDataForCountry(countrySelect.value()); // Display initial country
}

function displayDataForCountry(countryName) {
    background(255); // Clear the background

    // Iterate through each row to find the matching country
    table.rows.forEach(row => {
        let country = row.get('Country'); // Adjust this if your country column has a different name
        let gender = row.get('Gender'); // Adjust this if your gender column has a different name

        if (country === countryName) {
            years.forEach(year => {
                let value = row.getNum(year);
                if (!isNaN(value)) {
                    // Map the year to the x position
                    let x = map(year, years[0], years[years.length - 1], 0, width);

                    // Map the value to the y position
                    let y = map(value, minValue, maxValue, height, 0);

                    if (gender === 'f') {
                        fill(255, 0, 0);  // Red for females
                        circle(x, y, 5);
                    } else if (gender === 'm') {
                        fill(0, 0, 255);  // Blue for males
                        drawPlus(x, y);
                    }
                }
            });
        }
    });
}

function drawPlus(x, y) {
    let size = 5;
    stroke(0, 0, 255);  // Blue color
    line(x - size, y, x + size, y);  // Horizontal line
    line(x, y - size, x, y + size);  // Vertical line
}
