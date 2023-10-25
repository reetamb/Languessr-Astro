"""
Moran, Steven & McCloy, Daniel (eds.) 2019.
PHOIBLE 2.0.
Jena: Max Planck Institute for the Science of Human History.
(Available online at http://phoible.org, Accessed on 2023-05-25.)
"""

import json, random
from geopy.geocoders import Nominatim

plosives = "p b t d k ɡ ʈ ɖ ȶ ȡ ɟ c ʔ q ɢ".split(" ")
fricatives = "ɸ β f v θ ð s z ʆ ʓ ɬ ɮ ʃ ʒ ɕ ʑ ʂ ʐ ç ʝ x ɣ χ ʁ ħ ʕ ʜ ʡ ʢ h ɦ ɧ".split(" ")
nasals = "m ɱ n ȵ ɳ ɲ ŋ ɴ N".split(" ")
liquid = "ʙ ʋ ⱱ r ɹ ɾ l ʎ ʟ ɫ ʀ ɽ ɺ ɭ ȴ ɻ j ɰ w ɥ ʍ ᴅ R".split(" ")
nonpulmonic = "ɓ ɗ ᶑ ʄ ɠ ʛ ! ǃ ǀ ǂ ʘ ǁ".split(" ")

labial = "p b m ɱ ɸ β ʙ ⱱ ʋ v f w ʍ ʘ ɓ".split(" ")
coronal = "t d s z θ ð n r ɹ ɾ l ɬ ɮ ɺ ɫ ɗ ! ǃ ǁ ǀ ᴅ R N".split(" ")
retroflex = "ʈ ɖ ʂ ʐ ɳ ɽ ɻ ɭ ᶑ".split(" ")
palatal = "ȶ ȡ ɕ ʑ ʃ ʒ ʆ ʓ ȵ ɲ c ɟ ç ʝ j ʎ ȴ ɥ ʄ ɧ".split(" ")
velar = "k ɡ x ɣ ŋ ɰ ʟ ɠ".split(" ")
laryngeal = "q ɢ ɴ ʁ ʀ χ ʡ ħ ʜ ʕ ʢ ʔ h ɦ ʛ".split(" ")

front = "æ ɶ ɛ œ e ø ɪ ʏ i y".split(" ")
central = "ɨ ʉ ɜ ɵ ə ɚ ɘ ɞ ɐ a".split(" ")
back = "ɯ u ɤ o ʌ ɔ ɑ ɒ ʊ".split(" ")

close = "i y ɪ ʏ ɨ ʉ ʊ ɯ u".split(" ")
closemid = "e ø ɘ ɵ ɤ o".split(" ")
openmid = "ɛ ə ɚ œ ɜ ɞ ʌ ɔ".split(" ")
low = "a æ ɶ ɐ ɑ ɒ".split(" ")

tones = "˩ ˨ ˧ ˦ ˥ ↓".split(" ")

prearticulators = "ʼ ʰ ʷ ʱ ˀ"

def initialize():
    global languages, target, data, langs

    with open("src/scripts/data/languages.json", 'r', encoding='utf-8') as file:
        langs = json.load(file)

    languages = langs.keys()

    target = random.choice(list(languages))
    data = langs.get(target)

def allUniquePhonemes():
    classification = dict()
    with open("src/scripts/data/phonemes.json", 'w+', encoding='utf-8') as write:
        for lang in languages:
            index = langs.get(lang)
            phones = index.get("phonemes")
            for phone in phones:
                ind = 0
                if phone not in classification.keys():
                    while phone[ind] in prearticulators:
                        ind += 1

                    moa = ""
                    height = ""
                    t = False
                    if phone[ind] in plosives: 
                        moa = "plosive"
                        if (phone[min(ind+1, len(phone)-1)] in fricatives or
                             phone[min(ind+2, len(phone)-1)] in fricatives):
                            moa = "affricate"
                    elif phone[ind] in fricatives: moa = "fricative"
                    elif phone[ind] in nasals: moa = "nasal"
                    elif phone[ind] in liquid: moa = "liquid"
                    if (phone[ind] in nonpulmonic or 
                        phone[min(ind+1,len(phone)-1)] in nonpulmonic or 
                        phone[min(ind+2,len(phone)-1)] in nonpulmonic or 
                        phone[len(phone)-1] == "ʼ"): moa = "non-pulmonic"

                    elif phone[ind] in low: height = "open"
                    elif phone[ind] in openmid: height = "open-mid"
                    elif phone[ind] in closemid: height = "close-mid"
                    elif phone[ind] in close: height = "close"

                    elif phone[ind] in tones: t = True

                    poa = ""
                    bn = ""
                    c = None
                    if phone[ind] in labial: poa = "labial"
                    elif phone[ind] in coronal: 
                        poa = "coronal"
                        if moa == "affricate" or moa == "nasal":
                            if (phone[min(ind+1, len(phone)-1)] in palatal or
                                phone[min(ind+2, len(phone)-1)] in palatal or
                                phone[min(ind+3, len(phone)-1)] in palatal or
                                'ʃ' in phone or 'ʒ' in phone):
                                poa = "palatal"
                                print(phone)
                    elif phone[ind] in retroflex: poa = "retroflex"
                    elif phone[ind] in palatal: poa = "palatal"
                    elif phone[ind] in velar: poa = "velar"
                    elif phone[ind] in laryngeal: poa = "laryngeal"

                    elif phone[ind] in front: bn = "front"
                    elif phone[ind] in central: bn = "central"
                    elif phone[ind] in back: bn = "back"

                    elif t and len(phone) > 1: c = True
                    elif t and len(phone) == 1: c = False

                    type = ''
                    if poa != "": type = "consonant"
                    elif height != "": type = "vowel"
                    elif t: type = "tone"
                    classification[phone] = {
                        "type": type,
                        "place": poa, # string, empty = n/a
                        "manner": moa, # string, empty = n/a
                        "height": height, # 1a 2æ 3ɛ 4e̞ 5e 6ɪ 7i, 0 = n/a
                        "backness": bn, # string, empty = n/a
                        "tone": t, # True if tone
                        "contour": c, # True if contour, False if level, None = n/a
                    }
        json.dump(classification, write, indent=4)

def phonemes():
    return data.get("phonemes")

def language():
    return target

def location():
    geoLoc = Nominatim(user_agent="GetLoc")
    locname = geoLoc.reverse(data.get("location")[0] + ', ' + data.get("location")[1]).raw['address']
    return (locname['state'] + " in " + locname['country'])

initialize()
allUniquePhonemes()