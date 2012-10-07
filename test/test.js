// I like djangostache-style
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

var test_mold1 = b4.block()
    .generator("JavaScript")
    .helpUrlTemplate("https://github.com/mbostock/d3/wiki/{{ block.id() }}")
    .namespace("d3_")
    .category("selections")
    .colour("red");
    
var test_block1 = test_mold1.clone("bar");
    
var test_mold2 = b4.block()
    .generator("Python")
    .helpUrlTemplate("http://pythonpaste.org/script/{{ block.colour() }}/")
    .namespace("paster_")
    .category("deployment")
    .colour(12);
    
var test_block2 = test_mold2.clone("foo")
    .namespace("woop_")
    .category("DOOP")
    .tooltip("ooh, shiny")
    .colour("yellow")
    .previousStatement(true)
    .nextStatement("String");

function run(){
	console.log("molds");
    _([
        "generator", "helpUrlTemplate", "namespace", "colour",
        "category", "id", "namespace", "category", "helpUrl", "tooltip", 
        "colour", "previousStatement", "nextStatement"
    ]).map(function(prop){
        console.log(prop, ">>>", test_mold1[prop](), test_mold2[prop]())
    })

	console.log("BLOCKS");
    _([
        "id", "namespace", "category", "helpUrl", "tooltip", "colour",
        "previousStatement", "nextStatement"
    ]).map(function(prop){
        console.log(prop, ">>>", test_block1[prop](), test_block2[prop]())
    })
    
    test_block1.done();
    test_block2.done();
}

run();