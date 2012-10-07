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
var wiki = "https://github.com/mbostock/d3/wiki/",
    doc = {
        selections: wiki + "Selections#wiki-%(name)s",
    };

// set up a base configuration
var bls = b4.mold()
        .generate('JavaScript')
        .helpUrlPattern(wiki)
        .namespace('d3_'),
    // make a subconfiguration, but don't bring the blocks!
    sel = bls.copy()
        .helpUrlPattern(doc.selections)
        .category('d3 Selection')
        .color("red");

// make a block
sel.block("d3_select")
    .output(Selection)
    .tooltip('The first element that matches the selector')
    .appendTitle('select')
    .appendTitle(
        b3.input()
          .name("FOO")
          .type(b3.string)
    )
    .atomic("d3.select('%(text)')")

// close it off
sel.allDone();
~~~~~~~~~~

# roadmap
- support full Blocky API
- test suite
  - will probably need to use PhantomJS to get this automated, which scares me