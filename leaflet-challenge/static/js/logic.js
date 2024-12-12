// Earthquake Visualization

const earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Innitialize the map
const map_location = L.map("map").setView([39.8283, -98.5795], 4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map_location);

// Define the color of the circle based on the depth
function getColor(depth) {
    return depth > 90 ? '#8B0000' :
        depth > 70 ? '#FF4500' :
        depth > 50 ? '#FFA500' :
        depth > 30 ? '#FFFF00' :
        depth > 0 ? '#ADFF2F' :
                     '#00FF00';
}
    // Fetch earthquake data
  d3.json(earthquakeData)
  .then(data =>{ 

    // Loop through each feature in the GeoJSON data and extract latitude, longitude, depth, and magnitude
    data.features.forEach(feature => {
        const [longitude, latitude, depth] = feature.geometry.coordinates;
        const magnitude = feature.properties.mag;
        const markerSize = magnitude * 5;
        const depthColor = getColor(depth);
  
          // Create a circle marker for the eartquake location
        L.circleMarker([latitude, longitude], {
          radius: markerSize,
          fillColor: depthColor,
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        })
  
        // Add a popup of eartquake details
        .bindPopup(`<strong>Magnitude:</strong> ${magnitude}<br>
          <strong>Depth:</strong> ${depth} km<br>
          <strong>Location:</strong> ${feature.properties.place}`)
  
          // Add the marker to the map
        .addTo(map_location);
      });
    });

    // Create a legend
  const legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map_location) {
    const div = L.DomUtil.create("div", "info legend");

    // Labels of depth ranges and colors
    const depths = [0, 30, 50, 70, 90];
    const colors = ["#00FF00", "#FFFF00", "#FFA500", "#FF4500", "#8B0000"];
    
    // Legend container for better visibilty
    div.style.backgroundColor = 'white';
    div.style.padding = '8px';
    div.style.borderRadius = '5px';
  
    // Loop through depth intervals to generate labels for legend
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
    `<i style="background:${colors[i]}; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></i> ` +
    `${depths[i]}${depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km' : '+ km'}<br>`;
  }

  console.log(div.innerHTML);

  return div;

  };
  
  legend.addTo(map_location);