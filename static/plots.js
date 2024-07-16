function createPlot(containerId, result, titleText, yLabelText, yActualKey, yPredKey, fontSize = 10, titleMargin = 20) {
    Plotly.newPlot(containerId, [{
        x: result.x,
        y: result[yActualKey],
        mode: 'lines',
        type: 'scatter',
        name: 'Actual'
    }, {
        x: result.x,
        y: result[yPredKey],
        mode: 'lines',
        type: 'scatter',
        name: 'Predicted'
    }], {
        title: { text: titleText, font: { size: fontSize } },
        margin: { t: titleMargin, b: 40, l: 50, r: 30 }, // Adjust margins
        xaxis: { title: { text: 'Time', font: { size: fontSize } }, tickfont: { size: fontSize } },
        yaxis: { title: { text: yLabelText, font: { size: fontSize } }, tickfont: { size: fontSize } },
        legend: { font: { size: fontSize } }
    });
}

function calculatePercentile(data, percentile) {
    const sortedData = data.slice().sort((a, b) => a - b); // Make a copy of data and sort
    const index = Math.floor(percentile / 100 * (sortedData.length - 1));
    return sortedData[index];
}

function createScatterPlot(containerId, model, reconstruction, titleText, fontSize = 10) {
    const minValue = Math.min(...model, ...reconstruction);
    const maxValue = Math.max(...model, ...reconstruction);

    // Calculate percentiles
    const percentiles = [10, 20, 30, 40, 50, 60, 70, 80, 90].map(p => {
        return {
            x: calculatePercentile(model, p),
            y: calculatePercentile(reconstruction, p)
        };
    });

    const perfectLine = {
        x: [minValue, maxValue],
        y: [minValue, maxValue],
        mode: 'lines',
        type: 'scatter',
        name: 'Perfect reconstruction',
        line: { dash: 'dash', color: 'red' }
    };

    const percentilesLine = {
        x: percentiles.map(p => p.x),
        y: percentiles.map(p => p.y),
        mode: 'lines+markers',
        type: 'scatter',
        name: 'Percentiles',
        marker: {
            symbol: 'diamond',
            size: 6,
            color: 'gray',
            line: { width: 1.5, color: 'black', opacity: 0.8}
        }
    };

    Plotly.newPlot(containerId, [{
        x: model,
        y: reconstruction,
        mode: 'markers',
        type: 'scatter',
        name: 'Data Points',
        opacity: 0.5
    }, perfectLine, percentilesLine], {
        title: { text: titleText, font: { size: fontSize } },
        margin: { t: 30, b: 40, l: 50, r: 30 }, // Adjust margins
        xaxis: { title: { text: 'Model', font: { size: fontSize } }, tickfont: { size: fontSize }, range: [minValue, maxValue] },
        yaxis: { title: { text: 'Reconstruction', font: { size: fontSize } }, tickfont: { size: fontSize }, range: [minValue, maxValue] },
        showlegend: false,
        legend: { font: { size: fontSize }, orientation: 'h', y: 1.1, x: 0.5, xanchor: 'center', yanchor: 'bottom', bgcolor: 'rgba(255, 255, 255, 0.5)' },
        aspectratio: { x: 1, y: 1 }
    });
}

export function plotUx(result, fontSize = 10, titleMargin = 20) {
    createPlot('plot-ux', result, 'Actual vs Predicted Time Series (u_x)', 'Current (m/s)', 'y_u_x', 'yPred_u_x', fontSize, titleMargin);
    createScatterPlot('scatter-ux', result.y_u_x, result.yPred_u_x, 'Scatter Plot (u_x)', fontSize);
}

export function plotUy(result, fontSize = 10, titleMargin = 20) {
    createPlot('plot-uy', result, 'Actual vs Predicted Time Series (u_y)', 'Current (m/s)', 'y_u_y', 'yPred_u_y', fontSize, titleMargin);
    createScatterPlot('scatter-uy', result.y_u_y, result.yPred_u_y, 'Scatter Plot (u_y)', fontSize);
}

export function plotWaterLevel(result, fontSize = 10, titleMargin = 20) {
    createPlot('plot-waterlevel', result, 'Actual vs Predicted Time Series (Water Level)', 'Water Level (m)', 'y_waterlevel', 'yPred_waterlevel', fontSize, titleMargin);
    createScatterPlot('scatter-waterlevel', result.y_waterlevel, result.yPred_waterlevel, 'Scatter Plot (Water Level)', fontSize);
}
