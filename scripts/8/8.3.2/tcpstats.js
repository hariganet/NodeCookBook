var pcap = require('pcap'),
    tcp_tracker = new pcap.TCP_tracker(),
    pcap_session = pcap.createSession('', "tcp");

tcp_tracker.on('start', function (session) {
    console.log("Start of TCP session between " + session.src_name + " and " + session.dst_name);
});

tcp_tracker.on('end', function (session) {
    console.log("End of TCP session between " + session.src_name + " and " + session.dst_name);
});

pcap_session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet);
    tcp_tracker.track_packet(packet);
});



/*
var pcap = require("pcap"),
    pcap_session = pcap.createSession("", "tcp"),
    matcher = /safari/i;

console.log("Listening on " + pcap_session.device_name);

pcap_session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet),
        data = packet.link.ip.tcp.data;

    if (data && matcher.test(data.toString())) {
        console.log(pcap.print.packet(packet));
        console.log(data.toString());
    }
});


var pcap = require('pcap');
var pcapSession = pcap.createSession('', 'tcp');
var tcpTracker = new pcap.TCP_tracker();

tcpTracker.on('end', function (session) {
	console.log(session);
});

pcapSession.on('packet', function (packet) {
	tcpTracker.track_packet(pcap.decode.packet(packet));
});

*/