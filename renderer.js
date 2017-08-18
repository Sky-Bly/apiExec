const {ipcRenderer} = require('electron')

var ourView = document.getElementById("view")
var historyBuffer = document.getElementById('requestForm')
var sessVal;
var extracted;
var data;
var toBeRemoved = []


//
// Set a listener for the input bar
//

document.getElementById("inputCommand").addEventListener("keyup", KeyPress)

//
// Begin application functions
//

function KeyPress(e) {

  var keyEvent = window.event? event : e ;
  if (keyEvent.keyCode == 13 ) { //ctrl+enter : send reply
      handleExecRequest()
    }
 }


 //
 // Our webview on load function, the idea is to get the cookie,
 // or to send data from the webview to main for processing
 // #todo
 //


onload = () => {
    const webview = document.querySelector('webview')

    const loadstart = () => {
	}
}

//
//  A function to login, it gets the input and creates a frame request against the login URL for WHM
//

function login(){
  var loggedIn = false
  const webview = document.querySelector('webview')
  document.getElementById('bounceload').style.visibility = "visible"
  ourView.style.height = "1px"
  ourView.style.width = "1px"
  var targetUser = 'user=' + document.getElementById('inp_i').value
  var targetPass = 'pass=' + document.getElementById('inp_a').value
  var ourURL = document.getElementById('inp_u').value + '/login/?' + targetUser + '&'  + targetPass
  var userAndHost = document.getElementById('inp_i').value + " @ " + document.getElementById('inp_u').value
  console.log(ourURL)
  ourView.style.visibility = "visible"
  ourView.loadURL(ourURL)
  ourView.style.visibility = "hidden"
    const loadstop = () => {
    if (loggedIn){
      return
    }

    ourView.style.visibility = "visible"
    if ( sessVal !== 'undefined') {
    sessVal = document.getElementsByTagName("webview")[0].getAttribute("src").split("/")[3].replace(/\//g, '')
    }
    extracted = /^.*:2087\/cpsess([0-9]{10})\/.*$/.exec(sessVal);

      var isNumber =  /^cpsess\d+$/.test(sessVal);
      console.log("isnumber:" + isNumber + " extract:" + sessVal )
      if (isNumber === true) {
        authSuccessNotify(userAndHost)
        serverList()
        serverSelection()
        var apicommds = document.getElementById('inputCommand')
        if (apicommds.value == "" || apicommds.value == "null"  )
        apicommds.value = "listaccts?api.version=1";
        loggedIn = true
      } else {
        authFailNotify(userAndHost)
        return
      }

    var our2URL = document.getElementById('inp_u').value + "/"  + sessVal + '/' + "json-api/version"
    console.log(our2URL)
    ourView.loadURL(our2URL)
    ourView.style.height = "545px"
    ourView.style.width = "790px"
    ourView.style.visibility = "hidden"
    return
  }
  if (loggedIn === true) {
    return
  } else {
  webview.addEventListener('did-stop-loading', loadstop)
    var loggedIn = false
 }
}

//
// This issues API commands using the session token that was obtained previously for the webframe
//

function sessionCommand(){
  makeVisible()
  apiFetchHide()
  window.setTimeout(function() {
  ourView.style.visibility = "visible"
  var apiQuery = document.getElementById("inputCommand").value
  sessVal = document.getElementsByTagName("webview")[0].getAttribute("src").split("/")[3].replace(/\//g, '')
  extracted = /^.*:2087\/cpsess([0-9]{10})\/.*$/.exec(sessVal);
  console.log("sessvalT=" + extracted + ":" + sessVal)
  var url2 = document.getElementById('inp_u').value + "/"  + sessVal + '/' + "json-api/" + apiQuery
  //console.log(url2)
  ourView.loadURL(url2)
  var userAndHost = document.getElementById('inp_i').value + "@" + document.getElementById('inp_u').value
  var old = historyBuffer.innerHTML
  var uniqueStamp = new Date().getTime();
  var currentdate = new Date();
  var datetime =   currentdate.getDate() + "/" +
                  + (currentdate.getMonth()+1)  + "/" +
                  + currentdate.getFullYear() + "@" +
                  + currentdate.getHours() + ":" +
                  + currentdate.getMinutes() + ":" +
                  + currentdate.getSeconds();
  historyBuffer.innerHTML = old  +
                          "\r\n<br><div class='buffed' >⋗ </div><a align=left title='" + datetime + "(" + userAndHost + ")" + "'onclick=\"rebuff(" + uniqueStamp + ")\" class=\"flat\" id=\"" + uniqueStamp + "\">" + apiQuery; + "</a>";
                          historyBuffer.scrollTop = historyBuffer.scrollHeight;
    }, 125);
}

//
// This lets us know we got in
//

function authSuccessNotify(userAndHost){
  var previousBuffer = historyBuffer.innerHTML
  var currentdate = new Date();
  var datetime =   currentdate.getDate() + "/" +
                  + (currentdate.getMonth()+1)  + "/" +
                  + currentdate.getFullYear() + "@" +
                  + currentdate.getHours() + ":" +
                  + currentdate.getMinutes() + ":" +
                  + currentdate.getSeconds();

  historyBuffer.innerHTML = previousBuffer  +
                           "\r\n<br>∴ <a title=" + datetime + " >"  + userAndHost + "<br>";
                           historyBuffer.scrollTop = historyBuffer.scrollHeight;

  document.getElementById('bounceload').style.visibility = "hidden"
  var notifications = document.getElementById("authSuccess")
  notifications.style.visibility = "visible"
  window.setTimeout(function() {
    notifications.style.visibility = "hidden"
  }, 3225);
}

//
// This lets us know we did not get in
//

function authFailNotify(userAndHost){
  var previousBuffer = historyBuffer.innerHTML
  var currentdate = new Date();
  var datetime =   currentdate.getDate() + "/" +
                  + (currentdate.getMonth()+1)  + "/" +
                  + currentdate.getFullYear() + "@" +
                  + currentdate.getHours() + ":" +
                  + currentdate.getMinutes() + ":" +
                  + currentdate.getSeconds();
  historyBuffer.innerHTML = previousBuffer  +
                           "\r\n<br>∴ <a title=" + datetime + " >" + "!!Authentication FAILED!! : " + userAndHost + "</a></br>";
                           historyBuffer.scrollTop = historyBuffer.scrollHeight;
  document.getElementById('bounceload').style.visibility = "hidden"
  var notifications = document.getElementById("authFail")
  notifications.style.visibility = "visible"
  window.setTimeout(function() {
    notifications.style.visibility = "hidden"
  }, 3225);
}

//
// We "rebuffer" the message in the input field, sent as (this.id) via onclick
//

function rebuff(e){
  var innerReplay = document.getElementById(e).innerText
  var apicommds = document.getElementById('inputCommand')
  apicommds.value = innerReplay
  apicommds.focus()
}

//
// This is designed for show/hide during initial login
//

function makeVisible(){
  var theview = document.getElementById("view")
  theview.style.visibility = "visible"
}

function makeHidden(){
  var theview = document.getElementById("view")
  theview.style.visibility = "hidden"
}

function apiFetchVisible(){
  var jsonArea = document.getElementById("jsonContent")
  jsonArea.style.visibility = "visible"
}

function apiFetchHide(){
  var jsonArea = document.getElementById("jsonContent")
  jsonArea.style.visibility = "hidden"
}


function apiFetch(){
  makeHidden()
  apiFetchVisible()
  var jsonArea = document.getElementById("jsonContent")
  const prettyjson = require('prettyjson')

 var baseUrl = document.getElementById('inp_u').value
 var JSONapiUrl = "/json-api/"
 var password = document.getElementById('inp_a').value
 var username = document.getElementById('inp_i').value
 var apicommd = document.getElementById('inputCommand').value

 var url = baseUrl + JSONapiUrl + apicommd
 var auth = username + ':' + password
 //listaccts?api.version=1';
 // The data we are going to send in our request


 var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}


 let outPut = fetch(url, {
    method: 'get',
    headers: {
     'Authorization': 'WHM: ' + username + ':' + password
    }
 }).then(response => {
         if (response.ok) {
           response.json()
      .then(json =>{

         var ppoptions = {
 	noColor:true,
 	alphabetizeKeys:    false
 	};

 	var pretty = prettyjson.render(json, ppoptions)
          jsonArea.innerHTML =  pretty
  var currentdate = new Date();
  var datetime =  (currentdate.getMonth()+1)  + "/" +
               + currentdate.getDate() + "/" +
               + currentdate.getFullYear() + "@" +
               + currentdate.getHours() + ":" +
               + currentdate.getMinutes() + ":" +
               + currentdate.getSeconds();
  var old = historyBuffer.innerHTML
  var userAndHost = document.getElementById('inp_i').value + "@" + document.getElementById('inp_u').value
  var uniqueStamp = new Date().getTime();
  historyBuffer.innerHTML = old  +
                            "\r\n<br><div class='buffed' >♦ </div><a align=left title='"+ datetime + "(" + userAndHost + ")" +  "' onclick=\"rebuff(" + uniqueStamp + ")\" class=\"flat\" id=\"" + uniqueStamp + "\">" + apicommd + "</a>";
                            historyBuffer.scrollTop = historyBuffer.scrollHeight;

      });
     }
 });

}
