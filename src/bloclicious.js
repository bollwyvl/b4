/*
Copyright 2012 Nicholas Bollweg

https://github.com/bollwyvl/bloclicious

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
 
(function(){
    /*
        probably `document`: don't think this would do anything on the server!
    */
    var root = this;
    
    /*
        I guess blockly needs this? I don't like it!
    */
    Blockly = Blockly ? Blockly : {};
    Blockly.Language = Blockly.Language ? Blockly.Language : {};
    
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
        types of slots (since they didn't name them)
    */
    var slot_types = {
        TITLE: "Title",
        INPUT: "Input"
    }
        
    /*
        Holds all of the goodies for this specific configuration.
        
        It seems like we may need to do some copies when things happen. For 
        example, if I...
        
        - set the `category`
        - make a bunch of blocks
        - change the `category`
        - make some more blocks
        - install everything
        
        ...then would everything get the second `category`? I think not. For 
        the time being, `allDone()` will do the job
    */
    var bls = function(){
            return bls;
        };
    
    /* 
    the blockly generator
    
    Set the (computer) language generator. Probably one of:

    - JavaScript
    - Python
    - Dart
    */
    var _generator,
        generate = bls.generate = function(value){
            if(_.isUndefined(value)){ return _generator; }
            _generator = Blockly.Generator.get(value);
            return bls;
        };
        
    /* 
    the internationalized blockly block builder
    
    Set the (human) language generator. Probably one of:

    - en
    - zh
    - de
    
    TODO: how do you specify more than one of these bad boys? magic paths FAIL
    */
    var _language,
        language = bls.language = function(value){
            if(_.isUndefined(value)){ return _language; }
            _language = Blockly.Language;
            return bls;
        };

        
    /*
    the help url pattern, following [sprintf][sprintf] convention, using named 
    arguments. Available named args:
    
    - `%(name)s`: the block name
    - `%(ns)s`: the configuration namespace
    
    [sprintf]: http://www.diveintojavascript.com/projects/javascript-sprintf
    
    */
    var _help_url_pattern,
        helpUrlPattern = bls.helpUrlPattern = function(url){
            if(_.isUndefined(value)){ return _help_url_prefix; }
            _help_url_pattern = url;
            return bls;
        };

    
    /*
        the category currently being worked in (will be grouped together)
    */
    var _category,
        category = bls.category = function(value){
            if(_.isUndefined(value)){ return _category; }
            _category = value;
            return bls;
        };

    
    /*
        the color currently being used for new blocks
    */
    var _colour,
        colour = bls.colour = function(value){
            if(_.isUndefined(value)){
                return _colour;
            }else if(_.isNumber(value)){
                // accept Hue as `Number`...
                _colour = value;
            }else{
                // ...or any CSS value
                _colour = color(value).hue();
            }
            return bls;
        };

    
    /*
        the namespace for new blockly blocks
    */
    var _namespace,
        namespace = bls.namespace = function(value){
            if(_.isUndefined(value)){ return _namespace; }
            _namespace = value;
            return bls;
        };

    /*
        hold the blocks, so that we can `allDone`, maybe?
    */
    var _blocks = {},
        blocks = bls.blocks = function(value){
            if(typeof value !== "undefined"){ return _blocks; }
            _blocks = value;
            return bls;
        };
    
    /* 
        create a new block, taking the above configuration into account
        
        instead of incrementally building up all of the bits, wait until the 
        `done()` is called.
    */
    var block = bls.block = function(value){
        /*
            `value` gets used all the way at the bottom!
        */
        var blk = function(value){
            if(!_.isUndefined(value)){ blk.name(value); }
            return blk;
        };
        
        /*
            write the block to the generator and language!
            
            NOTE TO SELF:
            be careful to capture all of the scoped bits at time
            of installation, don't evaluate after the fact: this should
            prevent creep of values into way late in the game.
        */
        var done = blk.done = function(){
            // everyone use this namespaced-name
            var full_name = (blk.namespace() ? blk.namespace() : "") 
                + blk.name();
            
            /*
                set up language definition out in this scope, so that they 
                don't get reevaluated later. that would be sad.
            */
            var cfg = {
                setColour: blk.colour(),
                setTooltip: blk.tooltip(),
                setOutput: blk.output(),
                setPreviousStatement: blk.previousStatement(),
                setNextStatement: blk.nextStatement(),
                inputsInline: blk.inputsInline(),
            }
            
            bls.language()[full_name] = {
                category: blk.category(),
                helpUrl: blk.helpUrl(),
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
            bls.generator()[full_name] = function(){
                return [code, order];
            }
            
            return blk;
        };
        
        /*
            where the block will be installed in the global (arg!) namespace
        */
        var _name,
            name = blk.name = function(value){
                if(_.isUndefined(value)){ return _name; }
                if(bls._blocks[_name]){ delete bls._blocks[_name]; }
                _name = value;
                bls._blocks[_name] = blk;
                return blk;
            };
        
        /*
            the namespace into which this block should be installed... you'll 
            probably want to set this on the configuration...
        */
        var _namespace,
            namespace = blk.namespace = function(value){
                if(_.isUndefined(value)){
                    if(_.isUndefined(_namespace)){
                        return bls.namespace();
                    }
                    return _namespace;
                }
                _namespace = value;
                return blk;
            };
        
        /*
            the display category
        */
        var _category,
            category = blk.category = function(value){
                if(_.isUndefined(value)){
                    if(_.isUndefined(_category)){
                        return bls.category();
                    }
                    return _category;
                }
                _category = value;
                return blk;
            };
            
        /*
            the help url. If not specified explicitly, will use the pattern 
            from the configuration.
        */
        var _help_url,
            helpUrl = blk.helpUrl = function(value){
                if(_.isUndefined(value)){
                    if(_.isUndefined(_help_url)){
                        return _.sprintf(bls.helpUrlPattern(), {
                            name: blk.name(),
                            ns: blk.namespace(),
                        });
                    }
                    return _help_url;
                }
                _help_url = value;
                return blk;
            };
            
        /*
            set the mouseover tooltip
        */
        var _tooltip,
            tooltip = blk.tooltip = function(value){
                if(_.isUndefined(value)){ return _tooltip; }
                _tooltip = value;
                return blk;
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
        var _output,
            output = blk.output = function(value){
                if(_.isUndefined(value)){ return _output; }
                _output = value;
                return blk;
            };
        
        /*
            convenience output methods for built-in types.
            
            if no value provided, returns whether the output is allowed.
        */
        _.map(blockly_types, function(type_name){
            blk["output"+type_name] = function(value){
                if(_.isUndefined(value)){
                    if(_.isArray(_output)){
                       return _.contains(_output, type_name);
                    }else{
                        return _output === true || _output === type_name;
                    }
                }
                if(value){
                    _output = type_name;
                }
                return blk;
            };
        });
        
        /*
            the color currently being used for new blocks
        */
        var _colour,
            colour = blk.colour = function(value){
                if(_.isUndefined(value)){
                    if(_.isUndefined(_colour)){
                        return bls.colour();
                    }
                    return _colour;            
                }else if(_.isNumber(value)){
                    // accept Hue as `Number`...
                    _colour = value;
                }else{
                    // ...or any CSS value
                    _colour = color(value).hue();
                }
                return blk;
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
        var _previous_statement,
            previousStatement = blk.previousStatement = function(value){
                if(_.isUndefined(value)){ return _previous_statement; }
                _previous_statement = value;
                return blk;
            };
            
        /*
            whether the statement has a notch below for a next statement.
            
            provide a list of statement types to limit which blocks can 
            connect after this one
            
            see the convenience function below to set both statements at once
            
            TODO: HOW IS THIS DEFINED?
            
            TODO: I think this accepts lists?
        */
        var _next_statement,
            nextStatement = blk.nextStatement = function(value){
                if(_.isUndefined(value)){ return _next_statement; }
                _next_statement = value;
                return blk;
            };
            
        var _statements,
            statements = blk.statements = function(prv, nxt){
                if(_.isUndefined(prv)){ return [
                    _previous_statement, _next_statement
                ]; }
                _previous_statement = prv;
                _next_statement = nxt;
            };
        
        /*
            The list of inputs
        */    
        var _titles = [];
        
        /*
            Add something to the title row
            
            Otherwise, list the titles
        */
        var appendTitle = blk.appendTitle = function(value, var_name){
            if(_.isUndefined(value)){ return _titles; }
            _titles.push({
                value: value,
                var_name: var_name
            });
            return blk;
        };
        
        /*
            whether inputs should be displayed inline
        */
        var _inline = false,
            inputsInline = blk.inputsInline = function(value){
                if(_.isUndefined(value)){ return _inline; }
                _inline = value;
                return blk;
            };
        
        /*
            The list of inputs, which are as complicated as the
            block itself, apparently (they can't have inputs, though)
        */  
        var _inputs = [];
        
        /*
            Add a right-aligned thing (usually an input)
            These are almost as complicated as blocks.
        */
        var appendInput = blk.input = function(value){
            var inpt = function(value){
                // TODO: lookup the input
                if(!_.isUndefined(value)){ inpt.name(value); }
                blk._inputs.push(inpt);
                return inpt;
            }
            
            /*
                the name of the variable... not sure what this means
            */
            
            var _name,
                name = inpt.name = function(value){
                    if(_.isUndefined(value)){ return _name; }
                    _name = value;
                    return inpt;
                };
            
            /* 
                the type of the input. one of:
                
                - Blockly.DUMMY_INPUT - Not an input, just a place for titles.
                - Blockly.INPUT_VALUE - A socket in which to plug a value 
                    block.
                - Blockly.NEXT_STATEMENT - A notch for a stack of statement 
                    blocks.
                    
                see convenience functions.
            */
            var _type,
                type = inpt.type = function(value){
                    if(!_.isUndefined(value)){ return _type; }
                    _type = value;
                    return inpt;
                };
            
            _(blockly_input_types).map(function(btype, fname){
                inpt["type"+fname] = function(value){
                    if(!_.isUndefined(value)){ return _type == btype; }
                    _type = btype;
                    return inpt;
                }
            });
            
            /* set the input
            var _input,
                input = inpt.input = function(value){
                    if(!_.isUndefined(value)){ return _check; }
                    _check = value;
                    return inpt;
                };
            
            /*
                returns the owning block
            */
            var block = inpt.block = function(){
                return blk;
            };
            
            // `value` is from way up at appendInput
            return inpt(value);
        }
        
        /*
            setMutator: yeah, this is going to be great
        */
        
        /*
            Woo! Scopetastic! `value` is from way up there!
        */
        return blk(value);
    }
    
    // install it!
    root.blocklicious = bls;
})();