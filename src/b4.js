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

(function (Blockly) {
// probably `document`
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
convenience functions
*/
function undef(value){
    return _.isUndefined(value);
}

/*
    global namespace
*/
var b4 = function(){ return b4; };


/*
create a new block, taking the above configuration into account

instead of incrementally building up all of the bits, wait until the
`done()` is called.
*/
b4.block = function(value){
    var my = {
            _parent: undefined,
            _id: undefined,
            _namespace: undefined,
            _language: undefined,
            _generator: undefined,
            _category: undefined,
            _help_url_template: undefined,
            _help_url: undefined,
            _tooltip: undefined,
            _output: undefined,
            _colour: undefined,
            _previous_statement: undefined,
            _next_statement: undefined,
            _inline: undefined,
            _titles: undefined,
            _blocks: undefined
        },
        block = function(){};

    /*
    common task of inheriting value from parent
    */

    function _inherit(var_name, api_name, setter_callback){
        block[api_name] = function(value){
            if(undef(value)){
                if(undef(my[var_name])){
                    if(undef(my._parent)){
                        return undefined;
                    }else{
                        return my._parent[api_name]();
                    }
                }else{
                    return my[var_name];
                }
            }else{
                if(undef(setter_callback)){
                    my[var_name] = value;
                    return block;
                }else{
                    var ret = setter_callback(value);
                    return undef(ret) ? block : ret;
                }
            }
        };
    }

    /*
    make a new block from this block, using this block for defaults

    fills the role of mold
    */
    block.clone = function(value){
        var new_block = b4.block(value);
        return new_block.parent(block);
    };

    /*
    set this block's parent block
    */
    block.parent = function(value){
        if(undef(value)) return my._parent;
        my._parent = value;
        return block;
    };

    /*
    where the block will be installed in the global (arg!) namespace

    not inherited!
    */
    block.id = function(value){
        if(undef(value)){
            return undef(my._id) ? block : my._id;
        }

        my._id = value;
        return block;
    };

    /*
    the blockly generator

    Set the (computer) language generator. Probably one of:

    - JavaScript
    - Python
    - Dart
    */
    _inherit("_generator", "generator");

    /*
    the internationalized blockly block builder

    Set the (human) language generator. Probably one of:

    - en
    - zh
    - de

    TODO: how do you specify more than one of these bad boys? magic paths FAIL
    */
    _inherit("_language", "language");

    /*
    the namespace into which this block should be installed... you'll
    probably want to set this on the configuration...
    */
    _inherit("_namespace", "namespace");

    /*
    the display category
    */
    _inherit("_category", "category");

    /*
    the help url template, following [underscore.template][tmpl] convention

    [tmpl]: http://documentcloud.github.com/underscore/#template
    */
    _inherit("_help_url_template", "helpUrlTemplate");

    /*
    the help url. If not specified explicitly, will use the template
    from the configuration.
    */
    block.helpUrl = function(value){
        var tmpl;
        if(undef(value)){
            if(!undef(my._help_url)){
                return my._help_url;
            }else{
                tmpl = block.helpUrlTemplate();
                return _.template(tmpl || "", block, {"variable": "block"});
            }
        }
        my._help_url = value;
        return my._help_url;
    };

    /*
    set the mouseover tooltip
    */
    _inherit("_tooltip", "tooltip");

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
    _inherit("_output", "output");

    /*
    the color currently being used for new blocks
    */

    _inherit("_colour", "colour", function(value){
        if(_.isNumber(value)){
            // accept Hue as `Number`...
            my._colour = value;
        }else{
            // ...or any CSS value
            my._colour = Color(value).hue();
        }
    });

    /*
    whether the statement has a notch above for a previous statement.

    provide true just to get the block.

    provide a list of statement types to limit the blocks to which
    this one can be attached

    see the convenience function below to set both statements at once

    TODO: HOW IS THIS DEFINED?

    TODO: I think this accepts lists?
    */

    _inherit("_previous_statement", "previousStatement");

    /*
    whether the statement has a notch below for a next statement.

    provide a list of statement types to limit which blocks can
    connect after this one

    see the convenience function below to set both statements at once

    TODO: HOW IS THIS DEFINED?

    TODO: I think this accepts lists?
    */
    _inherit("_next_statement", "nextStatement");

    block.title = function(value){
        // getter
        if(undef(value)){
            // no parent
            if(undef(my._parent)){
                return undef(my._title) ? [] : my._title;
            //with parent
            }else{
                // this is probably not right
                var title_list = my._parent.title().slice();
                if(!undef(my._title)){
                    title_list = title_list.concat(my._title);
                }
                return title_list;
            }
        // setter
        }else{
            my._title = value;
            return block;
        }
    };

    /*
        Add something to the title row

        Otherwise, list the titles
    */
    block.appendTitle = function(value){
        my._title.push({
            value: value,
            var_name: var_name
        });
        return block;
    };

    /*
    whether inputs should be displayed inline
    */
    _inherit("_inline", "inputsInline");

    /*
    write the block to the generator and language!

    NOTE TO SELF:
    be careful to capture all of the scoped bits at time
    of installation, don't evaluate after the fact: this should
    prevent creep of values into way late in the game.
    */
    block.done = function(){
        // everyone use this namespaced-name
        var full_name = [
            block.namespace() ? block.namespace() : "",
            block.id()
        ].join("");

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
            inputsInline: block.inputsInline()
        };

        Blockly.Language[full_name] = {
            category: block.category(),
            helpUrl: block.helpUrl(),
            init: function(){
                var that = this;
                _.map(cfg, function(val, func){
                    if(undef(val)){ return; }

                    switch(func){
                        case "setOutput":
                        case "setPreviousStatement":
                        case "setNextStatement":
                            if(val !== true && val !== false){
                                that[func](true, val);
                                break;
                            }
                        default:
                            that[func](val);
                    }
                });
            }
        };

        // this is the trickiest bit, to avoid scope leakage
        Blockly.Generator.get(block.generator())[full_name] = function(){
            return [code, order];
        };

        return block;
    };

    // this is the end
    return block.id(value);
};

// install it!
root.b4 = b4;
})(Blockly);