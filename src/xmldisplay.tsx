declare var React: any;
declare var ReactDOM: any;

function addSecontds(date, seconds) {
    return new Date(date.getTime() + seconds*1000);
}
function getStartTime(endtime, miliseconds) {
    return new Date(endtime.getTime() - miliseconds);
}

function dateParse(dateWithTimezone) {
    var dparser = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)\.(\d\d\d)Z/;
    var tokens = dateWithTimezone.match(dparser);
    
    return new Date(Date.UTC(tokens[1],tokens[2],tokens[3],tokens[4],tokens[5],tokens[6],tokens[7]));
}


var Evento = React.createClass({
    render: function() {
        var id = this.props.id; 
        var timestamp = dateParse(this.props.timestamp).toLocaleString();
        var start = getStartTime(dateParse(this.props.timestamp), this.props.data.duration/1000).toLocaleTimeString();
        var name = this.props.name;
        var duration = (this.props.data.duration) ? (this.props.data.duration/1000000).toFixed(1) : '';
        var cpu_time = (this.props.data.cpu_time) ? (this.props.data.cpu_time/1000000).toFixed(1) : '';
        var physical_reads = (this.props.data.physical_reads) ? this.props.data.physical_reads : '';
        var writes = (this.props.data.writes) ? this.props.data.writes : '';
        var statement = this.props.data.statement || this.props.data.batch_text;
        
        var data = JSON.stringify(this.props.data);
        return <tr>
                <td>{id}</td>
                <td>{start}</td>
                <td>{timestamp}</td>
                <td>{name}</td>
                <td>{duration}</td>
                <td>{cpu_time}</td>
                <td>{physical_reads}</td>
                <td>{writes}</td>
                <td>{statement}</td>                
                <td>{data}</td></tr>;
    }    
});

var EventoWait = React.createClass({
    render: function() {
        var id = this.props.id; 
        var timestamp = dateParse(this.props.timestamp).toLocaleString();
        var start = getStartTime(dateParse(this.props.timestamp), this.props.data.duration/1000).toLocaleTimeString();
        var name = this.props.name;
        var duration = (this.props.data.duration) ? (this.props.data.duration/1000000).toFixed(1) : '';
        var cpu_time = (this.props.data.cpu_time) ? (this.props.data.cpu_time/1000000).toFixed(1) : '';
        var physical_reads = (this.props.data.physical_reads) ? this.props.data.physical_reads : '';
        var writes = (this.props.data.writes) ? this.props.data.writes : '';
        var statement = this.props.data.statement || this.props.data.batch_text;
        
        var data = JSON.stringify(this.props.data);
        return <tr>
                <td>{id}</td>
                <td>{start}</td>
                <td>{timestamp}</td>
                <td>{name}</td>
                <td>{duration}</td>
                <td>{statement}</td>                
                <td>{data}</td></tr>;
    }    
});

var App = React.createClass({
    render: function() {
        var events = this.props.data.events;
        var eventos = events.map(function(el,i) {
            
            // if(el.name != 'rpc_completed' && 
            //     el.name != 'sql_batch_completed' && 
            //     el.name != 'attention')
            //     return null;
            // 
            return <EventoWait key={i} id={i} name={el.name} timestamp={el.timestamp} data={el.data}>Evento</EventoWait>
        });
        
        return <table className="table"><tbody>
        {eventos}</tbody></table>;  
    }    
});

var ReportAttention = React.createClass({
    render: function() {
        var events = this.props.data.events;
        var eventos = events.map(function(el,i) {
            
            if(el.name != 'attention') 
                 return null;

            return <Evento key={i} id={i} name={el.name} timestamp={el.timestamp} data={el.data}></Evento>
        });
        
        return <table className="table"><tbody>
        {eventos}</tbody></table>;      }
});

var ReportDuration = React.createClass({
    render: function() {
        return <h1>Duration</h1>;
    }
});

var ReportWaitInfo = React.createClass({
    render: function() {
        return <h1>WaitInfo</h1>;
    }
});

// disfavor app
function renderXmlDisplay(selector, data) {
    ReactDOM.render(<App data={data}></App>,
        document.querySelector(selector)
    )
}