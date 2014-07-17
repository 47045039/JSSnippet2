/**
 * Created by mts on 14-7-17.
 */

var dns = require('dns');

var serialNumber = 1;
function cbk() {
  var time = new Date().getTime();
  var serial = serialNumber++;
  return function() { // lookup回调参数为(err, address, family),resole回调参数为(err, address)
    console.log('第' + serial + '次查询,用时: ' + (new Date().getTime() - time), ' 结果:', arguments);
  }
}

dns.lookup('www.togic.com', 4, cbk());
dns.resolve('www.togic.com', 'A', cbk());
dns.resolve('togic.com', 'MX', cbk());
dns.resolve('togic.com', 'NS', cbk());
dns.resolve('sso_login.togic.com', 'CNAME', cbk());
dns.resolve('sso_login.togic.cn', 'CNAME', cbk());