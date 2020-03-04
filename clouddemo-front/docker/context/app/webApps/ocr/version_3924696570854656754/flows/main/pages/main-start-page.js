define([], function() {
  'use strict';

  var PageModule = function PageModule() {};

  PageModule.prototype.parseUploadedFile = function(fileSet){
    if (fileSet.files.length > 0)
      return fileSet.files[0].name;
    return "";
  }

  PageModule.prototype.setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    if (cvalue == null) {
      cvalue = "";
    }
    d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  PageModule.prototype.getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  PageModule.prototype.genToken = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }  

  PageModule.prototype.checkCookies = function () {
    var token = PageModule.prototype.getCookie("clouddemo.v2.token");
    if (token === "") {
      token = PageModule.prototype.genToken();
      PageModule.prototype.setCookie("clouddemo.v2.token", token, 365);
    }
    return token;  
  }
  
  PageModule.prototype.filenameToJson = function (filename) {
    var senddata = {};
    senddata["data"] = {};
    senddata["data"]["resourceName"] = filename;
    var sendjson = JSON.stringify(senddata);                            
    return sendjson;
  }
  
  return PageModule;
});
