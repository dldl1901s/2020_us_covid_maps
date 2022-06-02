mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    projection: {
        name: 'albers'
    },
    center: [-96, 37.5], // starting position [lng, lat]
    zoom: 4 // starting zoom
});

const colorstop = [
    [100, 'rgb(247,251,255)'],
    [1000, 'rgb(158,202,225)'],
    [10000, 'rgb(66,146,198)'],
    [30000, 'rgb(33,113,181)'],
    [60000, 'rgb(8,48,107)']
];

const sizestop = [
    [100, 3],
    [1000, 7],
    [10000, 11],
    [30000, 15],
    [60000, 19]
]

map.on('load', () => {
    map.addSource('counts', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.json'
    });

    map.addLayer({
        'id': 'counts-point',
        'type': 'circle',
        'source': 'counts',
        'minzoom': 3,
        'paint': {
            'circle-radius': {
                'property': 'cases',
                'stops': sizestop
            },
            'circle-color': {
                'property': 'cases',
                'stops': colorstop
            },
            'circle-stroke-color': 'black',
            'circle-stroke-width': 1,
            'circle-opacity': 0.8
        }
    });

    map.on('click', 'counts-point', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>County:</strong> ${event.features[0].properties.county}<br><strong>Cases:</strong> ${event.features[0].properties.cases}`)
            .addTo(map);
    });

});

const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<strong>Size and Cases</strong>'],
    vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < 5; i++) {
    vbreak = sizestop[i][0];
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colorstop[i][1] + '; width: ' + sizestop[i][1]*2.1 +
        'px; height: ' +
        sizestop[i][1]*2.1 + 'px; "></i> <span class="dot-label" style="top: ' + sizestop[i][1] + 'px;">' + vbreak +
        '</span></p>');
}
const source1 =
'<p style="text-align: right;  font-size:8pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times,</a><br></p>';

const source2 = 
'<p style="text-align: right;  font-size:8pt"><a href="https://data.census.gov/cedsci/table?g=0100000US.050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true"> Census Bureau</a><br></p>';

legend.innerHTML = labels.join('') + source1 + source2;
