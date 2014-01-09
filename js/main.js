function SNMP(ip) {
    var snmp = require("snmp");
    this.session = new snmp.Session({ host: ip, port: 161, community: 'public', timeouts: [1000, 2000] });
};

$(function(){
    //CPU Graph
    var cpuinfo = 0;
    var taskTick = true;
    var timeTicket = true;
    //SNMP operation
    var snmpobject = new SNMP(ip);

    var findOID = function(mibvalue, oid, value)
    {
        console.log(mibvalue.name);
        console.log(mibvalue.oid);
        console.log(oid);
        if(mibvalue.oid == oid)
            $("#op-resp").append('<tr><td>' + mibvalue.name + '</td><td>' + value + '</td></tr>');
        for (var j in mibvalue.children) {
            if (mibvalue.children[j] != null) {
                return findOID(mibvalue.children[j], oid, value);
            }
        }
    };

    var respFill = function(snmpobject, oid, value)
    {
        if( oid == "1,3,6,1,3,1,2,0" && $('#chart').length === 0){
            var htmlstring = '<div id=\"chart\" style=\"height:200px;width:400px;"></div>';
            $("#op-resp").append('<tr><td>' + oid + '</td><td>' + htmlstring + '</td></tr>');
            //findOID(mib.mib2, oid.toString().replace(/,/g, '.').slice(0,-2), htmlstring);
            var option = {
                animationDuration: 200,
                toolbox: {
                    show : false
                },
                xAxis : [
                    {
                        type : 'category',
                        data : (function(){
                            var res = [];
                            var len = 50;
                            while (len--) {
                                res.push(len);
                            }
                            return res;
                        })()
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter: '{value}%'
                        },
                        splitArea : {show : true},
                        min : 0,
                        max : 100

                    }
                ],
                series : [
                    {
                        type:'line',
                        smooth: true,
                        symbol: "none",
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    shadowColor : 'rgba(0,0,0,0.4)'
                                }
                            }
                        },
                        data:(function(){
                            var res = [];
                            var len = 50;
                            while (len--) {
                                res.push(0);
                            }
                            return res;
                        })()
                    }
                ]
            };
            var myChart = echarts.init(document.getElementById('chart'));
            function taskRefresh() {
                snmpobject.session.get({oid: ".1.3.6.1.3.1.2.0"}, function(err, resp){
                    if(err)
                        console.log("Failed!");
                    else{
                        cpuinfo = resp[0].value;
                        console.log(resp[0].value);
                        if(taskTick)
                            taskTick = setTimeout(taskRefresh, 200);
                    }
                });
            };
            taskTick = true;
            taskRefresh();
            var lastData = 51;
            //var axisData;
            timeTicket = setInterval(function(){
                lastData += Math.random() * ((Math.round(Math.random() * 10) % 2) == 0 ? 1 : -1);
                lastData = lastData.toFixed(1) - 0;
                //axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
                // 动态数据接口 addData
                myChart.addData([
                    [
                        0,        // 系列索引
                        cpuinfo, // 新增数据
                        true,     // 新增数据是否从队列头部插入
                        false     // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
                    ]
                ]);
            }, 1000);
            myChart.setOption(option);
            $('#chart').click(function(){
                taskTick = false;
                $(this).parent().parent().remove();
                clearInterval(timeTicket);
            })
        }
        else {
            //findOID(mib.mib2, oid.toString().replace(/,/g, '.').slice(0,-2), value);
            $("#op-resp").append('<tr><td>' + oid + '</td><td>' + value + '</td></tr>');
        }
    };

    $("#op-get").click(function(){
        var oid = $("#oid").val();
        $("#current-state").text('Loading...');
        snmpobject.session.get({oid: oid}, function(err, resp){
            if(err)
                console.log("Failed!");
            else
                respFill(snmpobject, resp[0].oid, resp[0].value);
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
                respFill(snmpobject, resp[0].oid, resp[0].value);
                $("#oid").val('.' + resp[0].oid.toString().split(',')
                    .filter(function (s) { return s.length > 0; })
                    .map(function (s) { return parseInt(s, 10); }).toString().replace(/,/g, '.'));
                $("#main-content").scrollTop(100000);
                $("#current-state").text('Ready to operate...')
            }
        })
    });
    $("#op-getsubtree").click(function(){
        var oid = $("#oid").val().slice(0, -4);
        $("#current-state").text('Loading...');
        snmpobject.session.getSubtree({oid: oid}, function(err, resp){
            if(err)
                console.log("Failed!");
            else {
                resp.forEach(function (vb) {
                    respFill(snmpobject, vb.oid, vb.value);
                    $("#main-content").scrollTop(100000);
                });
                $("#current-state").text('Ready to operate...')
            }
        })
    });
    $("#op-set").click(function(){
        var oid = $("#oid").val();
        var setvalue = $("#setvalue").val();
        $("#cunrrent-state").text('Loading...');
        snmpobject.session.set({oid: oid, value: setvalue, type: 2, community: 'private'}, function(err, resp){
            if(err)
                console.log("Failed!");
            else {
                $("#current-state").text('Set is done')
            }
        })
    });
});
