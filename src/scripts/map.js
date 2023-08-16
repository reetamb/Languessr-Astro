import { Loader } from "@googlemaps/js-api-loader"

let map;

const loader = new Loader({
    apiKey: "AIzaSyC9UJUs0xwqKZ28p6MORyH4uVLpb-crauo",
    version: "weekly",
});
  
loader.load().then(async () => {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        mapId: "Languessr Map"
    });

    var marker = new AdvancedMarkerElement({
        map: map,
        position: { lat: 0, lng: 0 },
        title: "Marker",
    });
});