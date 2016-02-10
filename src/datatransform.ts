declare var exports: any;

interface ColumnItem {
    index: number,
    name: string,
    alias: string,
    transform: Array<any>    
}

class DataTransform {
    
    _transform: Array<ColumnItem>;
    
    constructor(format) {
        var columns = format.map(function(elem) {
           return {
               index: -1,
               alias: elem[0],
               name: (elem.length > 1 && typeof elem[1] == 'string') ? elem[1] : elem[0],
               transform: elem[1] && elem.slice(1)
           } 
        });
        
        this._transform = columns;
    }
    
    attach(header) {
        var indexedHeader = {};
        var columns = this._transform;
         
        columns.map(function(elem,i) {
            indexedHeader[elem.name] = i;
        });
        
        columns.map(function(elem) {
            var idx = indexedHeader[elem.name];
            
            elem.index = (idx) ? idx.index : -1; 
        })
    }
    
    get(i: number) {
        return this._transform[i];    
    }
    
    
    
    get length() {
        return this._transform.length;
    }

    get allColumns() {
        return this._transform.map(function(elem) {
           return elem.name;                
        });
    }
    
    get activeColumns() {
        return this._transform.filter(e => e.index !=-1).map( e => e.name);
    }
        
    get missingColumns() {
        return this._transform.filter(e => e.index ==-1).map( e => e.name);
    }
}

function create(format) {
    return new DataTransform(format);    
}

exports.create = create;