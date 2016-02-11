declare var exports: any;

interface ColumnItem {
    index: number,
    name: string,
    alias: string,
    transform: Array<any>,
    minsize: number    
}

function formatText(val,minsize) {
    var text = val.toString();
    const SPACE = ' ';
    if(text.length > minsize) {
        return text.substr(0,minsize);
    }
    return text + SPACE.repeat(minsize - text.length)
}

function formatTextSeparator(minsize) {
    const SEPARATOR = '-';
    return  SEPARATOR.repeat(minsize)
}

class DataTransform {
    
    _columnSeparator = " ";
    
    _transform: Array<ColumnItem>;
    
    constructor(format) {
        var columns = format.map(function(elem,i) {
           var isAliasSpecified = (elem.length > 1 && typeof elem[1] == 'string');
           var namePosition = (isAliasSpecified) ? 1 : 0;
           var transformPosition = (isAliasSpecified) ? 2 : 1;
           var columnItem = {
               index: i,
               alias: elem[0],
               name: elem[namePosition],
               transform: (elem.length>=transformPosition) && elem.slice(transformPosition),
               minsize: 0
           };
           var lastValue = null;
           
           if( columnItem.transform != null && columnItem.transform.length > 0 ) {
               lastValue = columnItem.transform.pop();
               (columnItem.transform.length == 0) && (columnItem.transform = null);              
           }
           columnItem.minsize = ( lastValue != null && typeof lastValue == 'number' ) ? lastValue : columnItem.alias.length;
           
           return columnItem;
        });
        
        this._transform = columns;
    }
    
    attach(header) {
        var indexedHeader = {};
        var columns = this._transform;
         
        header.map(function(elem,i) {
            indexedHeader[elem.name] = i;
        });
        
        columns.map(function(elem) {
            var position = indexedHeader[elem.name];
            
            elem.index = (position != null) ? position : -1; 
        })
    }
    
    printHeader() {
        var columns = this._transform;
        
        var result = columns.map(function(elem) {
            return formatText(elem.alias, elem.minsize);
        })  
        
        return result.join(this._columnSeparator);      
    }
    printSeparator() {
        var columns = this._transform;
        
        var result = columns.map(function(elem) {
            return formatTextSeparator(elem.minsize);
        });
        
        return result.join(this._columnSeparator);    
    }    
    printRow() {
        
        var args = Array.prototype.slice.call(arguments);
        
        var columns = this._transform;
        
        var result = args.map(function(val,i) {
            
            var transform = columns[i].transform;
            
            if(transform && transform[0]){
                val = transform[0](val);  
            }  
            
            return formatText(val, columns[i].minsize);
        })  
        
        return result.join(this._columnSeparator);      
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

function formatd2(n) {
    return ('00' + n).substr(-2);
}
function convertDate(d) {
    return `${d.getFullYear()}-${formatd2(d.getMonth())}-${formatd2(d.getDate())} ${formatd2(d.getHours())}:${formatd2(d.getMinutes())}:${formatd2(d.getSeconds())}`;
}
function dateParse(dateWithTimezone) {
    var dparser = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)\.(\d\d\d)Z/;
    var tokens = dateWithTimezone.match(dparser);
    
    return new Date(Date.UTC(tokens[1],tokens[2],tokens[3],tokens[4],tokens[5],tokens[6],tokens[7]));
}

function toDateTimeYMD(val) {
    var dateWithTimezone = val.toString();
    var dparser = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)\.(\d\d\d)Z/;
    var tokens = dateWithTimezone.match(dparser);
    
    return convertDate(new Date(Date.UTC(tokens[1],tokens[2],tokens[3],tokens[4],tokens[5],tokens[6],tokens[7])));
    //return new Date(Date.UTC(tokens[1],tokens[2],tokens[3],tokens[4],tokens[5],tokens[6],tokens[7]));
}

function toNumberFixed(fixed,n) {
    return n.toFixed(fixed);
}

exports.create = create;
exports.toDateTimeYMD = toDateTimeYMD;
exports.toNumberFixed = toNumberFixed;