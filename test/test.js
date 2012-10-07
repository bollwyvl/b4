var test_mold = b4.mold()
    .generate("JavaScript")
    .helpUrlPattern("https://github.com/mbostock/d3/wiki/%(id)s")
    .namespace("d3_")
    .category("selections")
    .colour("red");
    
var test_block1 = test_mold.block("bar");
    
var test_mold2 = b4.mold()
    .generate("Python")
    .helpUrlPattern("http://pythonpaste.org/script/")
    .namespace("paster_")
    .category("deployment")
    .colour(12);
    
var test_block2 = test_mold2.block("foo")
    .namespace("woop_")
    .category("DOOP")
    .tooltip("ooh, shiny")
    .colour("yellow")
    .previousStatement(true)
    .nextStatement("String");

function run(){
    _([
        "generate", "helpUrlPattern", "namespace", "colour", "blocks",
        "category"
    ]).map(function(prop){
        console.log(prop, ">>>", test_mold[prop](), test_mold2[prop]())
    })

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