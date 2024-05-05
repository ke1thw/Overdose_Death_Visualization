# Visualization of Opioid Overdose Deaths and Unemployment Rates in the USA

## Overview
This project provides a dynamic visualization dashboard that integrates various datasets to present a multi-faceted view of opioid overdose deaths and unemployment rates across the United States. It aims to aid in understanding the correlation between opioid misuse and economic factors by providing interactive and detailed visual representations.

## Features
- **Interactive Map**: Displays opioid overdose deaths by state. Users can click on a state to view detailed statistics.
- **Line Chart**: Shows trends over time for opioid overdose death rates, crude rates, or prescriptions dispensed, depending on user selection.
- **Bar Chart**: Presents unemployment rates across different states and years, allowing for temporal comparisons.
- **Responsive Design**: Ensures that the dashboard is accessible across various devices and screen sizes.

## Setup
To run this project locally, you'll need Node.js installed on your machine. Follow these steps:

1. Clone the repository:
`git clone [repository-url]`
`cd [project-folder]`
2. Install dependencies:
`npm install`
3. Start the development server:
`npm start`
The dashboard will be available at `http://localhost:3000`.

## Components
- `Map.js`: Manages the interactive map visualization.
- `LineChart.js`: Handles the rendering of the line chart based on the selected state and data type.
- `UnemploymentBarChart.js`: Controls the bar chart visualization of unemployment data.
- `opdeath.js`: Serves as the main component that integrates all individual components and manages state interactions.

## Data Sources
The data for this project is sourced from:
- **Opioid Overdose Deaths**: `https://gist.githubusercontent.com/ke1thw/66611f79a85552e39816ed4356f64e0a/raw/92819b8d627e95edd80bfb28eeead778e768fef8/Opioid_Overdose_Deaths.csv`
- **Unemployment Rates**: `https://gist.githubusercontent.com/ke1thw/3ad13e0b168f9dd72286f0fb792f16f9/raw/2b6232fb8e454fe9e943f406aea6d3f02edb00b4/Unemployment_in_America.csv`

## Usage
Upon loading the dashboard, users can interact with the map to select a state. This action updates the other components (line chart and bar chart) to reflect data relevant to the selected state. Users can switch the type of data displayed in the line chart using a dropdown menu.

### Dashboard Interaction
- **Select a State on the Map**: Click on any state to filter data across other components.
- **Change Data Type in Line Chart**: Use the dropdown menu to switch between death rates, crude rates, or prescription data.

## Vercel
You can also visit the webpage via `https://opioiddeath.vercel.app/`.
## Contributing
Contributions to enhance the dashboard are welcome. Please follow the standard fork-and-pull request workflow on GitHub. Ensure that your code adheres to existing style guidelines and has been tested adequately.

## License
This project is licensed under the [MIT License](LICENSE).
