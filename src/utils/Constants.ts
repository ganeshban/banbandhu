export const JANMA = "जन्म";
export const MITI = "मिती";
export const PARIWAR = "परिवार";
export const BIBARAN = "बिवरण";
export const UMER = "उमेर";
export const LINGA = " लिगं";
export const SANTAN = "सन्तान";
export const KO = "काे";
export const MA = "मा";
export const PATI_PATNI = " पति/पत्नि";
export const AAMA_BUBA = "आमा/बावु";
export const KHOJNUHOS = "खाेज्नुहाेस";
export const MA_HERNE = MA + " हेर्ने";
export const NAAM = "नाम";
export const BATA = "बाट";
export const SADASYA = "सदस्य";
export const SABAI_JANA = "सबैजना";
export const BAAL_BACHCHA = "बाल/बच्चा";
export const DEKHAIYAKO = "देखाइएकाे";
export const MAHILA = "महिला";
export const PURUS = "पुरूष";
export const BIWAHA = "बिवाह";

export const RANK1 = "पहिलाे";
export const RANK2 = "दाेस्राे";
export const RANK3 = "तेश्राे";
export const RANK4 = "चाैंथाे";
export const RANK5 = "पांचाै";
export const RANK6 = "छाैंठाै";
export const RANK7 = "साताैं";
export const RANK8 = "आठाैं";
export const RANK9 = "नबाैं";
export const RANK10 = "दशाैे";
export const RANK11 = "एघाराैं";
export const RANK12 = "बाह्राैं";
export const RANK13 = "तेराैं";
export const RANK14 = "चाैंधाैं";
export const RANK15 = "पन्ध्राैं";



export const MRITU_BHAISAKEKO = "मृत्यु भइसकेकाे";
export const BYAKTIGAT_BIBARAN = "व्यात्तिगत " + BIBARAN;
export const JANMA_MITI = JANMA + MITI;
export const SWARGARAN_MITI = "स्वर्गहरण " + MITI;
export const JANMA_STHAN = JANMA + " स्थान";
export const BHAYAKO_VETIYANA = " भयकाे काेहि पनि भेटिएन ।";
export const KHOJNE_Q_TEXT = `${NAAM}, ${JANMA_MITI}, ${AAMA_BUBA}${KO} ${NAAM}, ${JANMA_STHAN} ${BATA} ${KHOJNUHOS} ।`;
export const KO_PARIWARIK_BIBARAN = `${KO}, पारिवारिक ${BIBARAN}`;
export const PUNA_KHOJNUHOS = `पुन ${KHOJNUHOS}`;

export function getMerriageNumber(r: number) {

    switch (r) {
        case 1: return `${RANK1} ${BIWAHA}`;
        case 2: return `${RANK2} ${BIWAHA}`;
        case 3: return `${RANK3} ${BIWAHA}`;
        case 4: return `${RANK4} ${BIWAHA}`;
        case 5: return `${RANK5} ${BIWAHA}`;
        case 6: return `${RANK6} ${BIWAHA}`;
        case 7: return `${RANK7} ${BIWAHA}`;
        case 8: return `${RANK8} ${BIWAHA}`;
        case 9: return `${RANK9} ${BIWAHA}`;
        case 10: return `${RANK10} ${BIWAHA}`;
        case 11: return `${RANK11} ${BIWAHA}`;
        case 12: return `${RANK12} ${BIWAHA}`;
        case 13: return `${RANK13} ${BIWAHA}`;
        case 14: return `${RANK14} ${BIWAHA}`;
        case 15: return `${RANK15} ${BIWAHA}`;
        default: return "";
    }
};

export function engToNepNumber(n: number) {
    const t = n.toString();
    let x = "";
    for (let index = 0; index < t.length; index++) {
        x += engToNep(t.charAt(index));

    }
    return x;
}
function engToNep(n: String) {
    switch (n) {
        case "0": return ")";
        case "1": return "!";
        case "2": return "@";
        case "3": return "#";
        case "4": return "$";
        case "5": return "%";
        case "6": return "^";
        case "7": return "&";
        case "8": return "*";
        case "9": return "(";
        default: return "";
    }
}