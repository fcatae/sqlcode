var DataTransform = (function () {
    function DataTransform(format) {
        var columns = format.map(function (elem) {
            var isAliasSpecified = (elem.length > 1 && typeof elem[1] == 'string');
            var namePosition = (isAliasSpecified) ? 1 : 0;
            var transformPosition = (isAliasSpecified) ? 2 : 1;  
            return {
                index: -1,
                alias: elem[0],
                name: elem[namePosition],
                transform: (elem.length >= transformPosition) && elem.slice(transformPosition)
            };
        });
        this._transform = columns;
    }
    DataTransform.prototype.attach = function (header) {
        var indexedHeader = {};
        var columns = this._transform;
        header.map(function (elem, i) {
            indexedHeader[elem.name] = i;
        });
        columns.map(function (elem) {
            var idx = indexedHeader[elem.name];
            elem.index = (idx != null) ? idx : -1;
        });
    };
    DataTransform.prototype.get = function (i) {
        return this._transform[i];
    };
    Object.defineProperty(DataTransform.prototype, "length", {
        get: function () {
            return this._transform.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTransform.prototype, "allColumns", {
        get: function () {
            return this._transform.map(function (elem) {
                return elem.name;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTransform.prototype, "activeColumns", {
        get: function () {
            return this._transform.filter(function (e) { return e.index != -1; }).map(function (e) { return e.name; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTransform.prototype, "missingColumns", {
        get: function () {
            return this._transform.filter(function (e) { return e.index == -1; }).map(function (e) { return e.name; });
        },
        enumerable: true,
        configurable: true
    });
    return DataTransform;
})();
function create(format) {
    return new DataTransform(format);
}
exports.create = create;
