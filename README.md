# b4: beatiful blockly block builder
A [d3](http://d3js.org/)-style API for building new [Blockly](http://code.google.com/p/blockly/) 
blocks.

## usage
I'm still a little fuzzy on how to really use Blockly in the general case 
(embedded as an embedded thing). I have started working on 
[blockd3](http://github.com/bollwyvl/blockd3), a d3-in-Blockly 
library, with an [editor](http://bollwyvl.github.com/blockd3/demo) forked from the Blockly [code editor](http://blockly-demo.appspot.com/blockly/demos/code/index.html).
So I guess you can check that out, and see what I did, and maybe it will help 
you.

## motivation
Blockly is great, but kind of ponderous to extend, putting the "Java" back 
into "JavaScript." Let us have an alternative form. How about a more  
pythonic/d3/underscore-like API?

~~~~~~~~~~{.js}
var D3_WIKI = "https://github.com/mbostock/d3/wiki/";

// set up a base configuration
var d3_mold = b4.block()
    .generator("JavaScript")
    .helpUrlTemplate(D3_WIKI)
    .namespace("")
    .colour("steelBlue"),
            
    // make a subconfiguration
    select_mold = d3_mold.clone()
        .namespace("d3_select")
        .category("d3 selection")
        .output(D3_TYPES.SELECTION)
        .helpUrlTemplate(D3_WIKI +"Selections#wiki-<%= block.id() %>");
            
select_mold.clone("")
    .tooltip("The first element that matches the selector")
    .appendTitle("select the first element that matches")
    .appendTitle(D3_TYPES.SELECTION.field)
    .code("d3.select('<%= $.title('SELECTOR') %>')")
    .done();
~~~~~~~~~~

# roadmap
- support full Blocky API
- test suite
  - will probably need to use PhantomJS to get this automated, which scares me