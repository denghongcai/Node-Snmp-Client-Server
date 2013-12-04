function SNMP(ip) {
	var snmp = require("snmp-native");
	this.session = new snmp.Session({ host: ip, port: 161, community: 'public', timeouts: [1000, 2000] });
};

$(function(){
	//SNMP operation
	var snmpobject = new SNMP(ip);
	$("#op-get").click(function(){
		var oid = $("#oid").val();
		$("#current-state").text('Loading...');
		snmpobject.session.get({oid: oid}, function(err, resp){
			if(err)
				console.log("Failed!");
			else
				$("#op-resp").append('<tr><td>' + resp[0].oid + '</td><td>' + resp[0].value + '</td></tr>');
			$("#main-content").scrollTop(100000);
			$("#current-state").text('Ready to operate...')
		})
	});
	$("#op-getnext").click(function(){
		var oid = $("#oid").val();
		$("#current-state").text('Loading...');
		snmpobject.session.getNext({oid: oid}, function(err, resp){
			if(err)
				console.log("Failed!");
			else {
				$("#op-resp").append('<tr><td>' + resp[0].oid + '</td><td>' + resp[0].value + '</td></tr>');
				$("#oid").val('.' + resp[0].oid.toString().split(',')
					.filter(function (s) { return s.length > 0; })
					.map(function (s) { return parseInt(s, 10); }).toString().replace(/,/g, '.'));
				$("#main-content").scrollTop(100000);
				$("#current-state").text('Ready to operate...')
			}
		})
	});
	$("#op-getsubtree").click(function(){
		var oid = $("#oid").val();
		$("#current-state").text('Loading...');
		snmpobject.session.getSubtree({oid: oid}, function(err, resp){
			if(err)
				console.log("Failed!");
			else {
				resp.forEach(function (vb) {
            		$("#op-resp").append('<tr><td>' + vb.oid + '</td><td>' + vb.value + '</td></tr>');
					$("#main-content").scrollTop(100000);
        		});
				$("#current-state").text('Ready to operate...')
			}
		})
	});
});