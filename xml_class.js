define(["require", "exports"], function (require, exports) {
    alert('teste');
    var xmlclass2 = (function () {
        function xmlclass2() {
            this.nome = 'abc';
        }
        xmlclass2.prototype.avisar = function () {
            alert("meu nome \u00E9 " + this.nome);
        };
        return xmlclass2;
    })();
    exports.xmlclass2 = xmlclass2;
});
