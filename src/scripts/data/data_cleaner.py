# this is a script to generate the necessary json files and they are already generated so if you're going to keep using that format don't bother running this again
import json

with open('src/scripts/data/languages.json', 'r', encoding='utf-8') as file:
    langs = json.load(file)
    newlangs = dict()
    names = langs.keys()
    for name in names:
        phonemes = langs.get(name).get("phonemes")
        cleaned = list(set(phonemes))
        for i in range(len(cleaned)):
            if "|" in cleaned[i]:
                cleaned[i] = cleaned[i].split("|")[0]
        
        newname = name.title()
        langs[name]["phonemes"] = cleaned
        newlangs[newname] = langs[name]



copy = newlangs.copy()
for index, (key, value) in enumerate(langs.items()):
    if (value.get("location") == ("", "")):
        copy.pop(key)

json_object = json.dumps(copy, indent=4, ensure_ascii=False)
with open("src/scripts/data/languages.json", "w", encoding='utf-8') as outfile:
    outfile.write(json_object)