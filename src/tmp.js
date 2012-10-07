/*
Stuff extracted from b4.block and not yet integrated
*/
    /* 
        create a new block, taking the above configuration into account
        
        instead of incrementally building up all of the bits, wait until the 
        `done()` is called.
    */
        /*
            `value` gets used all the way at the bottom!
        */
        var blk = function(value){
            if(!_.isUndefined(value)){ blk.name(value); }
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