function addSecontds(date, seconds) {
    return new Date(date.getTime() + seconds * 1000);
}
function getStartTime(endtime, miliseconds) {
    return new Date(endtime.getTime() - miliseconds);
}
function dateParse(dateWithTimezone) {
    var dparser = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)\.(\d\d\d)Z/;
    var tokens = dateWithTimezone.match(dparser);
    return new Date(Date.UTC(tokens[1], tokens[2], tokens[3], tokens[4], tokens[5], tokens[6], tokens[7]));
}
var Evento = React.createClass({
    render: function () {
        var id = this.props.id;
        var timestamp = dateParse(this.props.timestamp).toLocaleString();
        var start = getStartTime(dateParse(this.props.timestamp), this.props.data.duration / 1000).toLocaleTimeString();
        var name = this.props.name;
        var duration = (this.props.data.duration) ? (this.props.data.duration / 1000000).toFixed(1) : '';
        var cpu_time = (this.props.data.cpu_time) ? (this.props.data.cpu_time / 1000000).toFixed(1) : '';
        var physical_reads = (this.props.data.physical_reads) ? this.props.data.physical_reads : '';
        var writes = (this.props.data.writes) ? this.props.data.writes : '';
        var statement = this.props.data.statement || this.props.data.batch_text;
        var data = JSON.stringify(this.props.data);
        return React.createElement("tr", null, React.createElement("td", null, id), React.createElement("td", null, start), React.createElement("td", null, timestamp), React.createElement("td", null, name), React.createElement("td", null, duration), React.createElement("td", null, cpu_time), React.createElement("td", null, physical_reads), React.createElement("td", null, writes), React.createElement("td", null, statement), React.createElement("td", null, data));
    }
});
var EventoWait = React.createClass({
    render: function () {
        var id = this.props.id;
        var timestamp = dateParse(this.props.timestamp).toLocaleString();
        var start = getStartTime(dateParse(this.props.timestamp), this.props.data.duration / 1000).toLocaleTimeString();
        var name = this.props.name;
        var duration = (this.props.data.duration) ? (this.props.data.duration / 1000000).toFixed(1) : '';
        var cpu_time = (this.props.data.cpu_time) ? (this.props.data.cpu_time / 1000000).toFixed(1) : '';
        var physical_reads = (this.props.data.physical_reads) ? this.props.data.physical_reads : '';
        var writes = (this.props.data.writes) ? this.props.data.writes : '';
        var statement = this.props.data.statement || this.props.data.batch_text;
        var data = JSON.stringify(this.props.data);
        return React.createElement("tr", null, React.createElement("td", null, id), React.createElement("td", null, start), React.createElement("td", null, timestamp), React.createElement("td", null, name), React.createElement("td", null, duration), React.createElement("td", null, statement), React.createElement("td", null, data));
    }
});
var App = React.createClass({
    render: function () {
        var events = this.props.data.events;
        var eventos = events.map(function (el, i) {
            // if(el.name != 'rpc_completed' && 
            //     el.name != 'sql_batch_completed' && 
            //     el.name != 'attention')
            //     return null;
            // 
            return React.createElement(EventoWait, {"key": i, "id": i, "name": el.name, "timestamp": el.timestamp, "data": el.data}, "Evento");
        });
        return React.createElement("table", {"className": "table"}, React.createElement("tbody", null, eventos));
    }
});
var ReportAttention = React.createClass({
    render: function () {
        return React.createElement("h1", null, "Attention");
    }
});
var ReportDuration = React.createClass({
    render: function () {
        return React.createElement("h1", null, "Duration");
    }
});
var ReportWaitInfo = React.createClass({
    render: function () {
        return React.createElement("h1", null, "WaitInfo");
    }
});
// disfavor app
function renderXmlDisplay(selector, data) {
    ReactDOM.render(React.createElement(App, {"data": data}), document.querySelector(selector));
}
