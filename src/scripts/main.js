import languages from './data/languages.json';
import phones from './data/phonemes.json';
import { Loader } from "@googlemaps/js-api-loader"

let map;
let correctMarker = null;
let guessMarker = null;
var start = document.getElementById("start");
var names = Object.keys(languages);
var answer = document.getElementById("answer");
var result = document.getElementById("result");
var reveal = document.getElementById("reveal");
var name;
var location;
var latlng;
var consonants = document.getElementById("consonants");
var vowels = document.getElementById("vowels");
var tones = document.getElementById("tones")

start.onclick = newLanguage;
reveal.onclick = showAnswer;

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

    google.maps.event.addListener(map, 'click', function(event) {
        if (guessMarker == null) {
            guessMarker = new AdvancedMarkerElement({
                map: map,
                position: event.latLng,
                title: "Marker",
            });
        } else {
            guessMarker.position = event.latLng;
        }

        reveal.classList.add('legal-button');
    });

});

function getDistance(pos1, pos2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(pos2.lat-pos1.lat);  // deg2rad below
    var dLon = deg2rad(pos2.lng-pos1.lng); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(pos1.lat)) * Math.cos(deg2rad(pos2.lat)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return parseFloat(Math.floor(d));
}
  
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function newLanguage() {
    answer.textContent = "";
    result.textContent = "";
    if (correctMarker != null) {
        correctMarker.setMap(null);
        correctMarker = null;
    }
    if (guessMarker != null) {
        guessMarker.setMap(null);
        guessMarker = null;
    }
    reveal.classList.remove('legal-button');
    let index = Math.floor(Math.random() * names.length);
    name = names[index];
    location = languages[name]["location"];
    latlng = { lat: parseFloat(location[0]), lng: parseFloat(location[1]) };
    let phonemes = languages[name]["phonemes"];

    [consonants, vowels].forEach((table) => {
        var rowCount = table.rows.length;
        for (var i = 1; i < rowCount; i++) {
            var cellCount = table.rows[i].cells.length;
            for (var j = 1; j < cellCount; j++) {
                table.rows[i].cells[j].innerHTML = "";
            }
        }
    })
    tones.rows[1].cells[0].innerHTML = "";
    tones.rows[1].cells[1].innerHTML = "";

    let row, col;
    phonemes.forEach((phoneme) => {
        let data = phones[phoneme];
        row, col = 0;
        if (data.type == 'consonant') {
            if (data.manner == 'nasal') { row = 1; }
            if (data.manner == 'plosive') { row = 2; }
            if (data.manner == 'fricative') { row = 3; }
            if (data.manner == 'liquid') { row = 4; }
            if (data.manner == 'non-pulmonic') { row = 5; }

            if (data.place == 'labial') { col = 1; }
            if (data.place == 'coronal') { col = 2; }
            if (data.place == 'retroflex') { col = 3; }
            if (data.place == 'palatal') { col = 4; }
            if (data.place == 'velar') { col = 5; }
            if (data.place == 'laryngeal') { col = 6; }

            consonants.rows[row].cells[col].innerHTML += phoneme + " ";
        } else if (data.type == 'vowel') {
            if (data.height == 'close') { row = 1; }
            if (data.height == 'close-mid') { row = 2; }
            if (data.height == 'open-mid') { row = 3; }
            if (data.height == 'open') { row = 4; }
            
            if (data.backness == 'front') { col = 1; }
            if (data.backness == 'central') { col = 2; }
            if (data.backness == 'back') { col = 3; }

            vowels.rows[row].cells[col].innerHTML += phoneme + " ";
        } else if (data.type == 'tone') {
            col = 0;
            if (data.contour) { col = 1 }

            tones.rows[1].cells[col].innerHTML += phoneme + " ";
        }
    })
};
// API-KEY: AIzaSyC9UJUs0xwqKZ28p6MORyH4uVLpb-crauo

async function showAnswer(){
    if (reveal.classList.contains('legal-button')) {

        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location}&key=AIzaSyC9UJUs0xwqKZ28p6MORyH4uVLpb-crauo`)
            .then(resp => resp.json())
            .then((data) => {
                answer.textContent = `The language is ${name}, 
                spoken in ${data["results"][3]["formatted_address"]}! 
                (${location[0]}, ${location[1]})`;
        });
        correctMarker = new AdvancedMarkerElement({
            map: map,
            position: latlng,
            title: name,
        });

        map.panTo(latlng);

        if (guessMarker != null) {
            result.textContent = `Your guess was ${getDistance(latlng, guessMarker.position)} km away from the correct location.`;
        }
    }
}

newLanguage();