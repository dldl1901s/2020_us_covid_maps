mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    projection: {
        name: 'albers'
    },
    center: [-96, 37.5], // starting position [lng, lat]
    zoom: 4 // starting zoom
});

const colorstop = [
    [0, 'rgb(247,251,255)'],
    [30, 'rgb(158,202,225)'],
    [70, 'rgb(66,146,198)'],
    [100, 'rgb(33,113,181)'],
    [130, 'rgb(8,48,107)']
];

map.on('load', () => {
    map.addSource('rate', {
        type: 'geojson',
        data: 'assets/us-covid-2020-rates.json'
    });

    map.addLayer({
        'id': 'rate-layer',
        'type': 'fill',
        'source': 'rate',
        'minzoom': 3,
        'paint': {
            'fill-color': {
                'property': 'rates',
                'stops': colorstop
            },
            'fill-opacity': 0.5
        }
    });

    map.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': 'rate',
        'paint': {
            'line-color': 'white',
            'line-width': 0.3,
            'line-opacity': 0.7
        }
    });


    map.on('click', 'rate-layer', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.lngLat)
            .setHTML(`<strong>County:</strong> ${event.features[0].properties.county}<br><strong>Rates:</strong> ${event.features[0].properties.rates}%`)
            .addTo(map);
    });

});

const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<strong>Percentages</strong>'],
    vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < 5; i++) {
    vbreak = colorstop[i][0];
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    labels.push(
        '<p class="break"><i class="rectangle" style="background:' + colorstop[i][1] + '; width: 25px; height: 25px;"></i> <span class="dot-label" style="top: 10px;">' + vbreak +
        '% </span></p>');
}
const source1 =
'<p style="text-align: right;  font-size:8pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times,</a><br></p>';

const source2 = 
'<p style="text-align: right;  font-size:8pt"><a href="https://data.census.gov/cedsci/table?g=0100000US.050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true"> Census Bureau</a><br></p>';

legend.innerHTML = labels.join('') + source1 + source2;





