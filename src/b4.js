/*
Copyright 2012 Nicholas Bollweg

https://github.com/bollwyvl/b4

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
 
(function(Blockly){
/*
    probably `document`: don't think this would do anything on the server!
*/
var root = this;

/*
    built-in types
    
    TODO: Magic types?
*/
var blockly_types = ["String", "Number", "Boolean", "Array"];

var blockly_input_types = {
    "Dummy": Blockly.DUMMY_INPUT,
    "Input": Blockly.INPUT_VALUE,
    "Next": Blockly.NEXT_STATEMENT
};

/*
    global namespace
*/
var b4 = function(){ return b4; };


/*
    Holds all of the goodies for this specific configuration.

    It seems like we may need to do some copies when things happen. 
    For example, if I...

    - set the `category`
    - make a bunch of blocks
    - change the `category`
    - make some more blocks
    - install everything

    ...then would everything get the second `category`? I think not. 
    For the time being, `allDone()` will do the job
*/
b4.mold = function(){
    var _generator,
        _help_url_pattern,
        _namespace,
        _language,
        _colour,
        _category,
        _blocks = {},
        // this is the mumbo-jumbo that gives us a fresh scope every time
        mold = function(){};
    /* 
    the blockly generator

    Set the (computer) language generator. Probably one of:

    - JavaScript
    - Python
    - Dart
    */
    mold.generate = function(value){
        if(_.isUndefined(value)) return _generator;
        _generator = value;
        return mold;
    };

    /*
    the help url pattern, following [sprintf][sprintf] convention, using named 
    arguments. Available named args:

    - `%(id)s`: the block id
    - `%(ns)s`: the configuration namespace

    [sprintf]: http://www.diveintojavascript.com/projects/javascript-sprintf

    */
    mold.helpUrlPattern = function(value){
        if(_.isUndefined(value)) return _help_url_pattern;
        _help_url_pattern = value;
        return mold;
    };


    /*
    the namespace for new blockly blocks
    */; 
    mold.namespace = function(value){
        if(_.isUndefined(value)) return _namespace;
        _namespace = value;
        return mold;
    };
    
    /* 
    the internationalized blockly block builder
    
    Set the (human) language generator. Probably one of:

    - en
    - zh
    - de
    
    TODO: how do you specify more than one of these bad boys? magic paths FAIL
    */
    mold.language = function(value){
        if(_.isUndefined(value)) return _language;
        _language = value;
        return mold;
    };
    
    /*
    the category currently being worked in (will be grouped together)
    */
    mold.category = function(value){
        if(_.isUndefined(value)) return _category;
        _category = value;
        return mold;
    };
    
        
    /*
    the color currently being used for new blocks
    */
    mold.colour = function(value){
        if(_.isUndefined(value)){
            return _colour;
        }else if(_.isNumber(value)){
            // accept Hue as `Number`...
            _colour = value;
        }else{
            // ...or any CSS value
            _colour = Color(value).hue();
        }
        return mold;
    };
    
    /*
    hold the blocks, so that we can `allDone`, maybe?
    */
    mold.blocks = function(value){
        if(_.isUndefined(value)) return _blocks;
        _blocks = value;
        return mold;
    };
    
    mold.block = function(value){
        if(_.isUndefined(value)){
            return b4.block.call(mold, "_auto_" + _(_blocks).keys().length);
        }else if(_.isString(value)){
            return b4.block.call(mold, value);
        }else{
            _blocks[value.id()] = value;
            return value;
        }
    }
    
    // this is the end
    return mold;
}

/* 
create a new block, taking the above configuration into account

instead of incrementally building up all of the bits, wait until the 
`done()` is called.
*/
b4.block = function(value){
    var mold = this,
        _id,
        _namespace,
        _category,
        _help_url,
        _tooltip,
        _output,
        _colour,
        _previous_statement,
        _next_statement,
        _inline,
        block = function(){};
    
    /*
    where the block will be installed in the global (arg!) namespace
    */
    block.id = function(value){
        if(_.isUndefined(value)) return _id;
        if(!_.isUndefined(_id)
            && mold._blocks[_id]){ delete mold._blocks[_id]; }
        _id = value;
        mold.block(block);
        return block;
    };
    
    /*
    the namespace into which this block should be installed... you'll 
    probably want to set this on the configuration...
    */
    block.namespace = function(value){
        if(_.isUndefined(value)){
            if(_.isUndefined(_namespace)){
                return mold.namespace();
            }
            return _namespace;
        }
        _namespace = value;
        return block;
    };
    
    /*
    the display category
    */
    block.category = function(value){
        if(_.isUndefined(value)){
            if(_.isUndefined(_category)){
                return mold.category();
            }
            return _category;
        }
        _category = value;
        return block;
    };
    
    /*
    the help url. If not specified explicitly, will use the pattern 
    from the configuration.
    */
    block.helpUrl = function(value){
        if(_.isUndefined(value)){
            if(_.isUndefined(_help_url)){
                return _.string.sprintf(mold.helpUrlPattern(), {
                    id: block.id(),
                    ns: block.namespace(),
                });
            }
            return _help_url;
        }
        _help_url = value;
        return block;
    };

    /*
    set the mouseover tooltip
    */
    block.tooltip = function(value){
        if(_.isUndefined(value)){ return _tooltip; }
        _tooltip = value;
        return block;
    };
    
    /*
    set the output for a block. 
    To not specify a type (but demand the output) pass
    
        true
    
    to specify a type, e.g.
    
        "Number"
    
    or a list of types
    
        ["Number", "String"]
    
    If no value provided, returns the list of allowed values.
    
    Also, see convenience methods.
    */
    block.output = function(value){
        if(_.isUndefined(value)){ return _output; }
        _output = value;
        return block;
    };
    
    /*
    the color currently being used for new blocks
    */
    block.colour = function(value){
        if(_.isUndefined(value)){
            if(_.isUndefined(_colour)){
                return mold.colour();
            }
            return _colour;            
        }else if(_.isNumber(value)){
            // accept Hue as `Number`...
            _colour = value;
        }else{
            // ...or any CSS value
            _colour = Color(value).hue();
        }
        return block;
    };
    
    /*
    whether the statement has a notch above for a previous statement.
    
    provide true just to get the block.
    
    provide a list of statement types to limit the blocks to which 
    this one can be attached
    
    see the convenience function below to set both statements at once
    
    TODO: HOW IS THIS DEFINED?
    
    TODO: I think this accepts lists?
    */
    block.previousStatement = function(value){
        if(_.isUndefined(value)){ return _previous_statement; }
        _previous_statement = value;
        return block;
    };
    
    /*
    whether the statement has a notch below for a next statement.
    
    provide a list of statement types to limit which blocks can 
    connect after this one
    
    see the convenience function below to set both statements at once
    
    TODO: HOW IS THIS DEFINED?
    
    TODO: I think this accepts lists?
    */
    block.nextStatement = function(value){
        if(_.isUndefined(value)){ return _next_statement; }
        _next_statement = value;
        return block;
    };

    /*
    whether inputs should be displayed inline
    */
    block.inputsInline = function(value){
        if(_.isUndefined(value)){ return _inline; }
        _inline = value;
        return blk;
    };
    
    /*
    write the block to the generator and language!
    
    NOTE TO SELF:
    be careful to capture all of the scoped bits at time
    of installation, don't evaluate after the fact: this should
    prevent creep of values into way late in the game.
    */
    block.done = function(){
        // everyone use this namespaced-name
        var full_name = (block.namespace() ? block.namespace() : "") 
            + block.id();
    
        /*
            set up language definition out in this scope, so that they 
            don't get reevaluated later. that would be sad.
        */
        var cfg = {
            setColour: block.colour(),
            setTooltip: block.tooltip(),
            setOutput: block.output(),
            setPreviousStatement: block.previousStatement(),
            setNextStatement: block.nextStatement(),
            inputsInline: block.inputsInline(),
        }
        
        Blockly.Language[full_name] = {
        //mold.language()[full_name] = {
            category: block.category(),
            helpUrl: block.helpUrl(),
            init: function(){
                var that = this;
                _.map(cfg, function(val, func){
                    if(_.isUndefined(val)){ return; }
                
                    switch(func){
                        case "setOutput":
                        case "setPreviousStatement":
                        case "setNextStatement":
                            if(val !== true && val !== false){
                                that[func](true, val); break;
                            }
                        default: that[func](val);
                    }
                });
            
                _.map(_titles, function(title){
                    if(slot.type == slot_types.TITLE){
                        this.appendTitle(slot.title);
                    }else if(slot.type == slot_types.INPUT){
                    
                    }
                })
            }
        };
    
        // this is the trickiest bit, to avoid scope leakage
        Blockly.Generator.get(mold.generate())[full_name] = function(){
            return [code, order];
        }
    
        return block;
    };
    
    // this is the end
    return block.id(value);
}

// install it!
root.b4 = b4;
})(Blockly);