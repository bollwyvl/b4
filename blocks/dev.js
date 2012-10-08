(function(b4){
b4.library.dev = {};

var dev = b4.block()
    .generator("JavaScript")
    .category("Developer")
    .namespace("dev_")
    .colour("yellow")
    .nextStatement(true)
    .previousStatement(true);

b4.library.dev.debug = dev.clone("debugger")
        .tooltip("halts execution of a program, so you can inspect it")
        .appendTitle('launch debugger')
        .code("debugger")
        .done();

b4.library.dev.console_log = dev.clone("console_log")
    .tooltip("prints information to the developer console")
    .appendTitle('print to developer console')
    .appendTitle(
        b4.fields.text("ITEMS")
            .init("document, b4")
    )
    .code("console.log(<%= $.title('ITEMS') %>)")
    .done();
        
})(b4);