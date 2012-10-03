// yeah, so big Blockly is actually a huge pain to work with
Blockly = (function(){
    var mockly = {
        "DUMMY_INPUT": 2,
        "INPUT_VALUE": 3,
        "NEXT_STATEMENT": 4,
    };
    
    mockly.Language = {};
    
    mockly.Generator = (function(){
        var _lang = {},
            gen = {
                get: function(lang){
                    if(!_lang.hasOwnProperty(lang)){
                        console.log("STARTED", lang);
                        _lang[lang] = {};
                    }
                    console.log("GOT", lang);
                    return _lang[lang];
                }
            }
        return gen;
    })();
    
    return mockly;
})()