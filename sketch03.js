let table;
let years = [];
let minValue = Number.MAX_VALUE;
let maxValue = Number.MIN_VALUE;

function preload() {
  table = loadTable("hdis_02.csv", "csv", "header");
}

function setup() {
  createCanvas(800, 600);
  background(255);

  // Assuming the years are column headers starting from the second column
  years = table.columns.slice(1);

  const selectDropdown = select("#countrySelect");

  let i = 1;
  let uniqueCountries = new Set();
  table.rows.forEach((row) => {
    const countryName = row.get("country");
    if (!uniqueCountries.has(countryName)) {
      uniqueCountries.add(countryName);

      const opt = document.createElement("option");
      opt.value = "option" + i;
      i++;
      opt.text = countryName;
      selectDropdown.elt.add(opt);
    }
    // Update min and max values
    years.forEach((year) => {
      const value = Number(row.get(year));
      if (value < minValue) minValue = value;
      if (value > maxValue) maxValue = value;
    });
  });

  selectDropdown.changed(drawScatterplot);
}

function drawScatterplot() {
  const selectedCountry = select("#countrySelect").value();
  clear();
  background(255);

  // Draw scatterplot for the selected country
  table.rows.forEach((row) => {
    const countryName = row.get("country");
    if (countryName === selectedCountry) {
      years.forEach((year, index) => {
        const value = Number(row.get(year));
        const x = map(index, 0, years.length - 1, 0, width);
        const y = map(value, minValue, maxValue, height, 0);

        fill(0);
        ellipse(x, y, 10, 10);
        textAlign(CENTER);
        text(year, x, height - 10);
      });
    }
  });
}
