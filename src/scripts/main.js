import languages from './data/languages.json';
import phones from './data/phonemes.json';

var start = document.getElementById("start");
var dump = document.getElementById("dump");
var names = Object.keys(languages);
var answer = document.getElementById("answer");
var reveal = document.getElementById("reveal");
var name;
var location;
var consonants = document.getElementById("consonants");
var vowels = document.getElementById("vowels");
var tones = document.getElementById("tones")

start.onclick = newLanguage;
reveal.onclick = showAnswer;


function newLanguage() {
    answer.textContent = "";
    let index = Math.floor(Math.random() * names.length);
    name = names[index];
    location = languages[name]["location"];
    let phonemes = languages[name]["phonemes"]
    dump.textContent = phonemes;

    [consonants, vowels, tones].forEach((table) => {
        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            table.deleteRow(i);
        }
    })

    var cr = consonants.insertRow(0);
    var c = cr.insertCell(0);
    c.innerHTML = "<td>Consonants:</td>";

    var vr = vowels.insertRow(0);
    var v = vr.insertCell(0);
    v.innerHTML = "<td>Vowels:</td>";

    var tr = tones.insertRow(0);
    var t = tr.insertCell(0);
    t.innerHTML = "<td>Tones:</td>";

    phonemes.forEach((phoneme) => {
        let data = phones[phoneme];
        if (data.type == 'consonant') {
            let cn = cr.insertCell(-1);
            cn.innerHTML = `<td>${phoneme}</td>`;
        } else if (data.type == 'vowel') {
            let vn = vr.insertCell(-1);
            vn.innerHTML = `<td>${phoneme}</td>`;
        } else if (data.type == 'tone') {
            let tn = tr.insertCell(-1);
            tn.innerHTML = `<td>${phoneme}</td>`;
        }
    })
};
// AIzaSyC9UJUs0xwqKZ28p6MORyH4uVLpb-crauo

function showAnswer(){
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location}&key=AIzaSyC9UJUs0xwqKZ28p6MORyH4uVLpb-crauo`)
        .then(resp => resp.json())
        .then((data) => {
            answer.textContent = `The language is ${name}, 
            spoken in ${data["results"][3]["formatted_address"]}! 
            (${location[0]}, ${location[1]})!`;
    });
}

newLanguage();