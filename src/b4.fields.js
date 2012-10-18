/*jshint unused:false */
(function(b4, Blockly){
"use strict";
    var undef = b4.undef,
        DEBUG = b4.DEBUG;
/*
    this.appendInput('from', Blockly.INPUT_VALUE, 'PARENT', Selection);
*/

b4.fields.text = function(value){
    var field = function(blockly_scope){
            var _field =  new Blockly.FieldTextInput(field.init());
            return _field;
        },
        my = {
            _init: undefined,
            _id: undefined
        };
    /*
    field id in this scope (block)
    */
    field.id = function(value){
        if(undef(value)) return my._id;
        my._id = value;
        return field;
    };
    
    /*
    the initial value for a field
    */
    field.init = function(value){
        if(undef(value)) return my._init;
        my._init = value;
        return field;
    };

    /*
    field id in this scope (block)
    */
    field.title = function(value){
        if(undef(value)) return my._title;
        my._title = value;
        return field;
    };

    /*
    field id in this scope (block)
    */
    field.output = function(value){
        if(undef(value)) return my._output;
        my._output = value;
        return field;
    };
    
    return field.id(value || "");
};

/*
    var dropdown = new Blockly.FieldDropdown([['world', 'WORLD'], ['computer', 'CPU']]);
*/
b4.fields.choices = function(value){
    var field = function(blockly_scope){
            var _field =  new Blockly.FieldDropdown(field.init());
            return _field;
        },
        my = {
            _init: undefined,
            _id: undefined,
            _title: "choose",
            _shape: undefined
        };
    
    // TODO: make this less magic
    field.shape = function(){return "INPUT_VALUE";};    
    
    /*
    field id in this scope (block)
    */
    field.id = function(value){
        if(undef(value)) return my._id;
        my._id = value;
        return field;
    };
    
    /*
    the initial value for a field
    */
    field.init = function(value){
        if(undef(value)) return my._init;
        my._init = value;
        return field;
    };

    /*
    field id in this scope (block)
    */
    field.title = function(value){
        if(undef(value)) return my._title;
        my._title = value;
        return field;
    };

    /*
    field id in this scope (block)
    */
    field.output = function(value){
        if(undef(value)) return my._output;
        my._output = value;
        return field;
    };
    
    return field.id(value || "");
};

b4.fields.variable = function(value){
    var field = function(blockly_scope){
            var _field =  new Blockly.FieldVariable(field.init());
            return _field;
        },
        my = {
            _init: undefined,
            _id: undefined
        };
    
    field.variable = true;
    
    /*
    field id in this scope (block)
    */
    field.id = function(value){
        if(undef(value)) return my._id;
        my._id = value;
        return field;
    };
    
    /*
    the initial value for a field
    */
    field.init = function(value){
        if(undef(value)) return my._init;
        my._init = value;
        return field;
    };
    
    return field.id(value || "");
};

b4.input = function(value){
    var field = function(blockly_scope){
            return field;
        },
        my = {
            _id: undefined,
            _title: undefined,
            _output: undefined,
            _shape: undefined
        };

    /*
    field id in this scope (block)
    */
    field.id = function(value){
        if(undef(value)) return my._id;
        my._id = value;
        return field;
    };

    /*
    field id in this scope (block)
    */
    field.shape = function(value){
        if(undef(value)) return my._shape;
        my._shape = value;
        return field;
    };

    /*
    field id in this scope (block)
    */
    field.nextStatement = function(value){
        if(undef(value)) return my._shape === value;
        my._shape = value ? "NEXT_STATEMENT" : my._shape;
        return field;
    };
    /*
    field id in this scope (block)
    */
    field.inputValue = function(value){
        if(undef(value)) return my._shape === value;
        my._shape = value ? "INPUT_VALUE" : my._shape;
        return field;
    };
    /*
    field id in this scope (block)
    */
    field.dummyValue = function(value){
        if(undef(value)) return my._shape === value;
        my._shape = value ? "DUMMY_VALUE" : my._shape;
        return field;
    };

    /*
    field id in this scope (block)
    */
    field.title = function(value){
        if(undef(value)) return my._title;
        my._title = value;
        return field;
    };
    


    /*
    field id in this scope (block)
    */
    field.output = function(value){
        if(undef(value)) return my._output;
        my._output = value;
        return field;
    };
    
    return field.id(value || "");
};
})(b4, Blockly);