(function (Blockly) {
// probably `document`
var root = this;

/*
global namespace
*/
var b4 = function(){ return b4; };

/*
convenience functions
*/
var undef = b4.undef = function(value){
    return _.isUndefined(value);
};


b4.VERSION = "0.1";

/*
namespaced piles of b4 block objects
*/
b4.library = b4.library || {};

b4.DEBUG = 0;

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
            _title: undefined,
            _blocks: undefined,
            _code: undefined,
            _code_order: undefined,
            _input: undefined
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
            return [
                block.namespace() || "",
                my._id || ""
            ].join("");
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
                var output = _.template(tmpl || "",
                    block,
                    {"variable": "block"}
                ); 
                return output;
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
        if(undef(my._title)){
            my._title = [];
        }
        var new_title;
        _.map(_.isArray(value) ? value : [value], function(value){
            new_title = value;
            // is this a "dumb" value?
            if(!_.isFunction(value)){
                new_title = function(blockly_scope){
                    return value;
                };
                new_title.id = function(){ return undefined; };
            }
            my._title.push(new_title);
        });
        return block;
    };
    
    
    block.input = function(value){
        // getter
        if(undef(value)){
            // no parent
            if(undef(my._input)){
                return undef(my._input) ? [] : my._input;
            //with parent
            }else{
                // this is probably not right
                var input_list = my._parent.input().slice();
                if(!undef(my._input)){
                    input_list = input_list.concat(my._input);
                }
                return input_list;
            }
        // setter
        }else{
            my._title = value;
            return block;
        }
    };
    
    block.appendInput = function(value){
        if(undef(my._input)){
            my._input = [];
        }
        var new_input;
        _.map(_.isArray(value) ? value : [value], function(value){
            new_input = value;
            // is this a "dumb" value?
            if(!_.isFunction(value)){
                new_input = function(blockly_scope){
                    return value;
                };
                new_input.id = function(){ return undefined; };
            }
            my._input.push(new_input);
        });
        return block;
    };
    
    /*
    the code that will be executed
    
    accepts the current flavor of [template][tmpl].
    */
    _inherit("_code", "code", function(value){
        my._code = _.isString(value) ? value : value.join("\n\t");
    });
    
    /*
    the join rules (as of 2012.10.07)
    
    Blockly.Python.ORDER_ATOMIC = 0;            // 0 "" ...
    Blockly.Python.ORDER_COLLECTION = 1;        // tuples, lists, dictionaries
    Blockly.Python.ORDER_STRING_CONVERSION = 1; // `expression...`
    Blockly.Python.ORDER_MEMBER = 2;            // . []
    Blockly.Python.ORDER_FUNCTION_CALL = 2;     // ()
    Blockly.Python.ORDER_EXPONENTIATION = 3;    // **
    Blockly.Python.ORDER_UNARY_SIGN = 4;        // + -
    Blockly.Python.ORDER_BITWISE_NOT = 4;       // ~
    Blockly.Python.ORDER_MULTIPLICATIVE = 5;    // * / // %
    Blockly.Python.ORDER_ADDITIVE = 6;          // + -
    Blockly.Python.ORDER_BITWISE_SHIFT = 7;     // << >>
    Blockly.Python.ORDER_BITWISE_AND = 8;       // &
    Blockly.Python.ORDER_BITWISE_XOR = 9;       // ^
    Blockly.Python.ORDER_BITWISE_OR = 10;       // |
    Blockly.Python.ORDER_RELATIONAL = 11;       // in, not in, is, is not,
                                                //     <, <=, >, >=, <>, !=, ==
    Blockly.Python.ORDER_LOGICAL_NOT = 12;      // not
    Blockly.Python.ORDER_LOGICAL_AND = 13;      // and
    Blockly.Python.ORDER_LOGICAL_OR = 14;       // or
    Blockly.Python.ORDER_CONDITIONAL = 15;      // if else
    Blockly.Python.ORDER_LAMBDA = 16;           // lambda
    Blockly.Python.ORDER_NONE = 99;             // (...)
    */
    _inherit("_code_order", "codeOrder");

        
    /* Generate the equivalent of:
    
            Blockly.JavaScript.d3_lambda = function() {
              var code = [
                'function(',
                this.getTitleValue('DATUM'),
                ',',
                this.getTitleValue('INDEX'),
                '){\n  ',
                Blockly.JavaScript.valueToCode(this, 'DO'),
                '\n  return ',
                Blockly.JavaScript.valueToCode(this, 'RETURN') || 'null',
                ';\n}'
              ].join('');
              return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
            };
            
    */   
    block.generateCode = function(blockly_scope, generator){
        var order = block.codeOrder(), 
            BG = Blockly.Generator.get(block.generator()),
                fake_block = function(){
                    var flock = function(attr){ return flock; };
            
                    flock.title = function(value){
                        return blockly_scope.getTitleValue(value);
                    };
            
                    flock.code = function(value, _default){
                        var code = BG.valueToCode(
                            blockly_scope,
                            value,
                            order
                        );
                        return undef(_default) ? code : _default;
                    };
            
                    return flock;
                };
        
            order = undef(order) ? generator.ORDER_ATOMIC : order;
        var code_and_order = [
            _.template(block.code(), fake_block(), {"variable": "$"}),
            order
        ];
        
        return code_and_order;
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
        /*
            set up language definition out in this scope, so that they
            don't get reevaluated later. that would be sad.
        */
        var BL = Blockly.Language,
            blid = block.id(),
            code,
            cfg = {
                setColour: block.colour(),
                setTooltip: block.tooltip(),
                setOutput: block.output(),
                setPreviousStatement: block.previousStatement(),
                setNextStatement: block.nextStatement(),
                setInputsInline: block.inputsInline()
            },
            title_list = block.title(),
            input_list = block.input();
        
        
        
        BL[blid] = {
            category: block.category(),
            helpUrl: block.helpUrl(),
            init: function(){
                var that = this,
                    dummy_input = that.appendDummyInput();
                    
                _.map(cfg, function(val, func){
                    if(undef(val)){ return; }
                    
                    var maybe_bool = _.contains([
                            "setPreviousStatement",
                            "setNextStatement",
                            "setOutput"
                        ], func);
                    
                    if(maybe_bool && (val !== true && val !== false)){
                        if(val.id && val.field){
                            that[func](true, val.id);
                        }else{
                            that[func](true, val);
                        }
                    }else{
                        that[func](val);
                    }
                });
                
                
                _.map(title_list, function(title_callback){
                    var title_item = title_callback(),
                        title_value = title_item.field ? title_item.field() : title_item
                        title_id = _.isFunction(title_callback.id) ? title_callback.id() : title_callback.id;
                    dummy_input.appendTitle(
                        title_value,
                        title_id
                    );
                });
                
                // set up input... probably needs recursion?
                // this.appendInput('from', Blockly.INPUT_VALUE, 'PARENT', Selection);
                _.map(input_list, function(input){
                    input = input();
                    var output = input.field.output(that),
                        shape_meth = {
                                    INPUT_VALUE: that.appendValueInput,
                                    DUMMY_VALUE: that.appendDummyInput,
                                    NEXT_STATEMENT: that.appendStatementInput
                            }[input.field.shape()],
                        
                        // calling, setting the type
                        blockly_input = shape_meth.call(that, output.id());
                        
                        console.log("\t\tappended", shape_meth.name, output.id());
                        
                        if(!undef(output)){
                            var input_id = _.isFunction(input.id) ? input.id() : input.id;
                            console.log("\t\tcheck", input_id);
                            blockly_input.setCheck(true,
                                input_id !== true ? input_id : undefined);
                        }
                        blockly_input.appendTitle(input.field.title());
                });
                
            }
        };
        
        // this is the trickiest bit, to avoid scope leakage
        var BG = Blockly.Generator.get(block.generator());
        
        BG[blid] = function(){
            code = block.generateCode(this, BG);
            return code;
        };

        return block;
    };

    // this is the end
    return block.id(value || "");
};

/*
Input superclass
*/
b4.fields = function(){};

// install it!
root.b4 = b4;
})(Blockly);