var main_zoom = 13
var redColor= "rgb(250,70,0)";
var map_center = [31.39732070281275, 51.53429993623848];

const bounds = [
    [30.5121,50.2234], // Southwest coordinates
    [33.4476,52.6351] // Northeast coordinates
    ];

mapboxgl.accessToken = 'pk.eyJ1IjoiZXZnZXNoYWRyb3pkb3ZhIiwiYSI6ImNqOWRhbnk3MDI4MGIycW9ya2hibG9pNm8ifQ.8VxS8cKEypk08xfgUgbsHw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'data/positron2.json',
//style: 'mapbox://styles/mapbox/satellite-streets-v9',
    center: map_center,
    zoom: main_zoom,
    minZoom: 7,
    maxZoom: 14,
    pitch: 0,
    bearing: 0,
    antialias: true,
    // maxBounds: bounds
});

map.on('style.load', () => {
    map.addSource('mapbox-dem', {
    'type': 'raster-dem',
    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
    'tileSize': 512,
    'maxzoom': 14
    });
    // add the DEM source as a terrain layer with exaggerated height
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
    });


map.scrollZoom.disable();
map.addControl(new mapboxgl.NavigationControl(),  'top-left');

map.on("click", function(e){
    console.log(map.getCenter())
})

map.on('load', function () {



    map.addSource("polygons", {
        "type": "geojson",
        'data': "data/chernihiv_poly.geojson"
    });

    map.addSource("lines", {
        "type": "geojson",
        'data': "data/chernihiv_line2.geojson"
    });

    map.addSource("icons", {
        "type": "geojson",
        'data': "data/true_arrows.geojson"
    });

    map.addSource("arrows", {
        "type": "geojson",
        "lineMetrics": true,
        'data': "data/chernihiv_arrow.geojson"
    });

    map.addSource("dots", {
        "type": "geojson",
        'data': "data/chernihiv_dot.geojson"
    });
          
  
    //polygon stroke
    map.addLayer({
        "id": "polygons-layer",
        'type': 'fill',
        "source": "polygons",
        'paint': {
            'fill-color': [
                'match',
                ['get', 'side'],
                'ru', redColor,
                'ua','#00A68E',
                'grey'
            ],
            'fill-opacity': 0.5
            // 'line-width': 2
        }
    });


  map.addLayer({
        "id": "projects-pulse",
        'type': 'circle',
        "source": "dots",
        'paint': {
            'circle-radius': 4,
            'circle-color': [
                'match',
                ['get', 'side'],
                'ru', redColor,
                'ua','#00A68E',
                'grey'
            ]
        }
    });

    map.addLayer({
        "id": "lines-layer",
        'type': 'line',
        "source": "lines",
        'paint': {
            'line-color': [
                'match',
                ['get', 'side'],
                'ru', redColor,
                'ua','#00A68E',
                'grey'

            ],
            'line-width': 3
        }
    });


    map.addLayer({
        "id": "points-layer",
        'type': 'circle',
        "source": "dots",
        'paint': {
            'circle-radius': 4,
            'circle-color': [
                    'match',
                    ['get', 'side'],
                    'ru', redColor,
                    'ua','#00A68E',
                    'grey'

            ],
            "circle-stroke-width": 1,
            "circle-stroke-color": "white"
        }
    });

    var red_url = 'img/red-triangle.png';
    map.loadImage(red_url, function (err, red) {
        if (err) {
            console.error('err image', err);
            return;
        }
        map.addImage('red_arrow', red);
    });




    map.addLayer({
        id: 'arrow-icons',
        source: 'icons',
        type: 'symbol',
        maxzoom: 11,
        layout: {
          visibility: 'visible',
          'symbol-placement': "line-center",
          'symbol-spacing': 1,
          'icon-size': 0.08,
          'icon-image': 'red_arrow',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        },
      })

  

    //points
 

    map.addLayer({
        "id": "arrows-layer",
        'type': 'line',
        "source": "arrows",
        "maxzoom": 11,
        'paint': {
            'line-color': redColor,
            'line-width': 6,
            'line-gradient': [
                'interpolate',
                ['linear'],
                ['line-progress'],
                0,
                'rgba(250, 70, 0, 0)',
                0.1,
                'rgba(250, 70, 0, 0.3)',
                0.3,
                'rgba(250, 70, 0, 0.4)',
                0.5,
                 'rgba(250, 70, 0, 0.6)',
                0.7,
                'rgba(250, 70, 0, 0.8)',
                1,
                'rgba(250, 70, 0, 0.9)'
                ]
        }
    });


    map.addLayer({
        "id": "lines-text",
        "minzoom": 8,
        "maxzoom": 19,
        'type': 'symbol',
        "source": "lines",
        'layout': {
            'text-field': [
                "concat",
                "",
                ['get', 'Name']
            ],
            'text-anchor': "left",
            'text-radial-offset': 0,
            'text-justify': 'auto',
            'text-size': 12,
            "text-font": ["Noto Sans Italic"]
            },
        'paint': {
            'text-color': 'white'        
        }
    });

    map.addLayer({
        "id": "points-text",
        "minzoom": 8,
        "maxzoom": 19,
        'type': 'symbol',
        "source": "dots",
        'layout': {
            'text-field': [
                "concat",
                "",
                ['get', 'Name']
            ],
            'text-anchor': "right",
            'text-radial-offset': 1,
            'text-justify': 'auto',
            'text-size': 12,
            "text-font": ["Noto Sans Italic"],
            'icon-ignore-placement': true
            },
        'paint': {
            'text-color': 'white',     
        }
    });

    map.addLayer({
        "id": "poly-text",
        "minzoom": 8,
        "maxzoom": 19,
        'type': 'symbol',
        "source": "polygons",
        'layout': {
            'text-field': [
                "concat",
                "",
                ['get', 'Name']
            ],
            'text-anchor': "center",
            'text-radial-offset': 1,
            'text-justify': 'auto',
            'text-size': 12,
            "text-font": ["Noto Sans Italic"],
            "text-offset": [1, 0.2],
            'icon-ignore-placement': true
            },
        'paint': {
            'text-color': 'white',         
        }
    });

    map.setFilter(  'polygons-layer', ["match", ["get", "id"], ["p1"], true, false])
    map.setFilter(  'points-layer', ["match", ["get", "id"], [""], true, false])
    map.setFilter(  'lines-layer', ["match", ["get", "id"], [""], true, false])
    map.setFilter(  'arrows-layer', ["match", ["get", "id"], [""], true, false])
    map.setFilter(  'arrow-icons', ["match", ["get", "id"], [""], true, false])


    map.setFilter(  'lines-text', ["match", ["get", "id"], [""], true, false])
    map.setFilter(  'points-text', ["match", ["get", "id"], [""], true, false])
    map.setFilter(  'poly-text', ["match", ["get", "id"], ["p1"], true, false])

    map.setFilter(  'projects-pulse', ["match", ["get", "id"], [""], true, false])


    var framesPerSecond = 2;
    var multiplier = 0.1;
    var opacity = .1;
    var circleRadius = 2;
  
    function pulseMarker(timestamp){
      setTimeout(function() {
        requestAnimationFrame(pulseMarker)
        multiplier += .1;
        opacity -= ( .3 / framesPerSecond );
        circleRadius += ( 10 / framesPerSecond );
  
        map.setPaintProperty('projects-pulse', 'circle-opacity', opacity)
        map.setPaintProperty('projects-pulse', 'circle-radius', circleRadius)
  
        if (opacity <= 0.1) {
          opacity = 1;
          circleRadius = 2;
        }
  
      }, 1000 / framesPerSecond );
    }



   

var scroller = scrollama();

 
function handleStepEnter(r) {

    // полігони, лінії і точки
    let myarr_p = $(r.element).data("polygons");
    let myarr_l = $(r.element).data("lines");
    let myarr_d = $(r.element).data("points");

    // анімовані точки
    let myarr_pulse = $(r.element).data("pulse");

    // фото і відео
    let img_src = $(r.element).data("picture");
    let video_src = $(r.element).data("video");

     // широта і довгота
    let step_latlng = $(r.element).data("coords");
    let step_zoom = $(r.element).data("zoom");

    // console.log(step_latlng)

    // filter layers
    map.setFilter('lines-text', ["match", ["get", "id"], myarr_l, true, false]);
    map.setFilter('points-text', ["match", ["get", "id"], myarr_d, true, false]);
    map.setFilter('poly-text', ["match", ["get", "id"], myarr_p, true, false]);

    map.setFilter('polygons-layer', ["match", ["get", "id"], myarr_p, true, false]);
    map.setFilter('lines-layer', ["match", ["get", "id"], myarr_l, true, false]);
    map.setFilter('arrows-layer', ["match", ["get", "id"], myarr_l, true, false])
    map.setFilter('arrow-icons', ["match", ["get", "id"], myarr_l, true, false])

    map.setFilter('points-layer', ["match", ["get", "id"], myarr_d, true, false]);
    map.setFilter('projects-pulse', ["match", ["get", "id"], myarr_pulse, true, false]);


    

    pulseMarker(0);


    if(img_src){
        $("#cover-picture").css("background-image", 'url(' + img_src[0]+ ')')
        $("#cover-picture").css("display", "block")
        $("#cover-video").css("display", "none")
        $("#map").css("display", "none")
       
       
    } else if(video_src){
        var video = document.getElementById('cover-video');
        video.src = video_src;
        video.play();
        $("#cover-video").css("display", "block")
        
        $("#map").css("display", "none")
        $("#cover-picture").css("display", "none")
    }
    else {
        $("#map").css("display", "block")
         $("#cover-picture").css("display", "none")
         $("#cover-video").css("display", "none")
    }

    if(r.index === 0){
        $(".scroll__text").css("display", "block")
    }



    map.flyTo({
        center: step_latlng,
        zoom: step_zoom,
        duration: 3000, 
       // essential: true
    })

    $(".scroll__text").css("width", "100%")
    
}
      
function init() {   
    scroller.setup({
        container: '#scroll',
        graphic: '.scroll__graphic',
        text: '.scroll__text',
        step: '.scroll__text .step',
        offset: 0.9,
        debug: false
    })
        .onStepEnter(handleStepEnter);

}
init();
});
