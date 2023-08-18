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
var score = document.getElementById("score");
var newgame = document.getElementById("new");
var name;
var location;
var latlng;
var consonants = document.getElementById("consonants");
var vowels = document.getElementById("vowels");
var tones = document.getElementById("tones")
var points = 0;
var round = 0;
const earth = 6371;

start.onclick = newLanguage;
reveal.onclick = showAnswer;
newgame.onclick = function (){
    points = 0;
    round = 0;
    name = "";
    location = [];
    latlng = {};
    newLanguage();
}

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
    var dLat = deg2rad(pos2.lat-pos1.lat);  // deg2rad below
    var dLon = deg2rad(pos2.lng-pos1.lng); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(pos1.lat)) * Math.cos(deg2rad(pos2.lat)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = earth * c; // Distance in km
    return parseFloat(Math.floor(d));
}
  
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function newLanguage() {
    answer.textContent = "";
    result.textContent = "";
    round += 1;
    score.innerHTML = `Round ${round} - Score: ${points}`;
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
function compareStrings(s1, s2) {
    [s1, s2].forEach(string => {
        string = string.toLowerCase();
        string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    })
    return s1 == s2;
}

async function showAnswer(){
    if (reveal.classList.contains('legal-button')) {
        let guess = "";
        let distance = getDistance(latlng, guessMarker.position);
        let pointsThisRound = 5000;
        pointsThisRound -= Math.floor(5000 * (distance / (earth * Math.PI)));
        if (pointsThisRound >= 4900) {
            guess = prompt("You got really close: try typing the name of the language you think it is for a chance to get all 5000 points!");
            if (guess == "" || guess == null) {
                alert("Better luck next time...");
            } else if (compareStrings(guess, name)) {
                alert("Holy shit you got it right");
                pointsThisRound = 5000;
            } else {
                alert("Better luck next time...");
            }
        }
        
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const { PinElement } = await google.maps.importLibrary("marker");

        answer.textContent = `The language is ${name}!`
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location}&key=AIzaSyC9UJUs0xwqKZ28p6MORyH4uVLpb-crauo`)
            .then(resp => resp.json())
            .then((data) => {
                answer.textContent = `The language is ${name},  
                spoken in ${data["results"][3]["formatted_address"]}! 
                (${location[0]}, ${location[1]})`;
        });
        let colors = new PinElement({
            background: "#8BEA35",
            borderColor: "#69B312",
            glyphColor: "#69B312",
        });
        correctMarker = new AdvancedMarkerElement({
            map: map,
            position: latlng,
            title: name,
            content: colors.element,
        });
        map.panTo(latlng);
        points += Math.floor(pointsThisRound);
        score.innerHTML = `Round ${round} - Score: ${points}`;
        
        if (guessMarker != null) {
            if (compareStrings(guess, name)) {
                result.textContent = "Your guess was exactly right, earning you all 5000 points!"
            } else {
                result.textContent = `Your guess was ${distance} km away from the correct location, which is worth ${pointsThisRound} points out of 5000 possible.`;
            }
        }

        reveal.classList.remove('legal-button');
    }
}

document.addEventListener("keydown", showAnswer);

newLanguage();