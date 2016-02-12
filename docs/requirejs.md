AMD
====

Começa incluindo o require.js com o entry-point:

    <script data-main="main" src="require.js"></script>

Os módulos podem ser definidos seguindo o modelo AMD:

    define(["dependency"],function(dep) {
        // exports
        return { 
            sum: function(a,b) { return a+ b }
            };
    });

A primeira parte é composta pela definição da dependência.

    define(['jquery'], function($) { ...
    
Dentro do módulo, definimos o objeto e exportamos:

    return {...}    
    
O chamador das dependências (main.js) deve usar a sintaxe:

    requirejs(["number", "math"], function(number, math) {
    ...    
    });


CommonJS e UMD?
================

https://github.com/substack/browserify-handbook
