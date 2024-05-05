import React, { useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';

const Map = ({ mapUrl, deathsData, onStateHover }) => {
    const mapRef = useRef();
    const [highlightedState, setHighlightedState] = useState(null);

    useEffect(() => {
        if (deathsData.length > 0) {
            drawMap();
        }

        const resetHighlight = () => {
            d3.select(mapRef.current).selectAll('path')
                .style('stroke', '#fff')
                .style('stroke-width', 1);
        };

        const handleBodyClick = (event) => {
            if (!mapRef.current.contains(event.target)) {
                onStateHover(null);  // Reset to default state when clicked outside
                setHighlightedState(null);
                resetHighlight();
            }
        };

        document.body.addEventListener('click', handleBodyClick);

        return () => {
            document.body.removeEventListener('click', handleBodyClick);
        };

    }, [deathsData]);

    const drawMap = async () => {
        const us = await d3.json(mapUrl);
        const deathsByState = d3.rollup(deathsData, v => d3.sum(v, d => d.deaths), d => d.state);
        const maxDeaths = Math.max(...deathsByState.values());
        const colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, maxDeaths]);

        d3.select(mapRef.current).selectAll("svg").remove();
        const svg = d3.select(mapRef.current)
            .append('svg')
            .attr('width', 800)
            .attr('height', 500);

        const projection = d3.geoAlbersUsa().fitSize([800, 500], us);
        const pathGenerator = d3.geoPath().projection(projection);

        svg.selectAll('path')
            .data(us.features)
            .enter()
            .append('path')
            .attr('d', pathGenerator)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .attr('fill', feature => colorScale(deathsByState.get(feature.properties.name) || 0))
            .on('click', (event, d) => {
                event.stopPropagation(); 
                onStateHover(d.properties.name);
                setHighlightedState(d.properties.name); 
                highlightState(d.properties.name);
            });
            // .on('mouseover', (event, d) => onStateHover(d.properties.name))
            // .on("mouseout", () => onStateHover(null));
    
        const highlightState = (stateName) => {
            svg.selectAll('path')
                .style('stroke', feature => feature.properties.name === stateName ? 'black' : '#fff')
                .style('stroke-width', feature => feature.properties.name === stateName ? 2 : 1);
        };

        if (highlightedState) {
            highlightState(highlightedState);
        }

        const legendWidth = 200;
        const legendHeight = 10;
        const n = Math.round(legendWidth / legendHeight);
            
        const x = d3.scaleLinear()
            .domain([0, n - 1])
            .range([0, legendWidth]);
            
        const legend = svg.append("g")
            .attr("transform", "translate(450,480)");  // Positioning the legend at the bottom
            
        legend.selectAll("rect")
            .data(d3.range(n))
            .enter().append("rect")
            .attr("height", legendHeight)
            .attr("x", (d, i) => x(i))
            .attr("width", (d, i) => x(i + 1) - x(i))
            .attr("fill", d => colorScale(d * maxDeaths / n));
            
        // Add legend label
        legend.append("text")
            .attr("class", "legend-title")
            .attr("x", legendWidth / 2)
            .attr("y", -6)
            .attr("text-anchor", "middle")
            .text("Number of Deaths");
            
        // Add min and max labels under the legend
        legend.append("text")
            .attr("x", 0)
            .attr("y", legendHeight + 10)
            .attr("text-anchor", "start")
            .text(`0`);
        
        legend.append("text")
            .attr("x", legendWidth)
            .attr("y", legendHeight + 10)
            .attr("text-anchor", "end")
            .text(`${maxDeaths}`);
    };

    return (
        <div ref={mapRef}></div>
    );
};

export default Map;
