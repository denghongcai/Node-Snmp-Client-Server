function SNMP(ip) {
	var snmp = require("snmp-native");
	this.session = new snmp.Session({ host: ip, port: 161, community: 'public' });
};

$(function(){
	var snmpobject = new SNMP(ip);
	oid = prompt("Please enter oid");
	oid = '.' + oid;
	$("#op-get").click(function(){
		snmpobject.session.get({oid: oid}, function(err, resp){
			console.log(resp);
			if(err)
				console.log("Failed!");
			else
				$("#op-resp").text(resp[0].oid + ' = ' + resp[0].value + ' (' + resp[0].type + ')');
		})
	});
	$("#op-getnext").click(function(){
		snmpobject.session.getNext({oid: oid}, function(err, resp){
			console.log(resp);
			if(err)
				console.log("Failed!");
			else
				$("#op-resp").text(resp[0].oid + ' = ' + resp[0].value + ' (' + resp[0].type + ')');
		})
	});
	$("#op-getall").click(function(){
		snmpobject.session.get({oid: oid}, function(err, resp){
			console.log(resp);
			if(err)
				console.log("Failed!");
			else
				$("#op-resp").text(resp[0].oid + ' = ' + resp[0].value + ' (' + resp[0].type + ')');
		})
	});
});