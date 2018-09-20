/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
		
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //alert('Received Device Ready Event');
        //alert('calling setup push');
		app.initFrame();
        app.setupPush();
    },
    setupPush: function() {
        //console.log('calling push init');
		try{
        var push = PushNotification.init({
            "android": {
                "senderID": "278576349838"
            },
            "browser": {
				
			},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true,
		"clearBadge": true
            },
            "windows": {}
        });
		
        push.on('registration', function(data) {
        	if (app.oldRegId !== data.registrationId) {
				app.setDeviceId(data.registrationId);
            }
        });

        push.on('error', function(e) {
            //alert("push error = " + e.message);
			//app.initFrame('');
        });

        push.on('notification', function(data) {
            //alert('notification event');
			app.win.executeScript({
				code: 'VHV.alert('+JSON.stringify(data.message)+');'
			});
			//alert(data.message);
            if(0) navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
       });
	   }
		catch(e)
		{
			alert(e.getMessage());
		}
    },
	initFrame: function()
	{
		app.oldRegId = localStorage.getItem('registrationId');
		window.open = cordova.InAppBrowser.open;
		try{
			document.getElementById('welcome-image').style.display = 'none';
			if(app.win) app.win.close();
			app.win = cordova.InAppBrowser.open('http://local.vitest.edu.vn/?page=Mobile.login&androidRegistrationId='+(app.oldRegId?app.oldRegId:'mobile'), '_blank', 'fullscreen=yes,location=no,zoom=no,status=no,toolbar=no,titlebar=no,disallowoverscroll=yes,allowInlineMediaPlayback=yes');
			app.win.show();
		}
		catch(e)
		{
			alert(e.getMessage());
		}
	},
	setDeviceId: function(deviceId)
	{
		localStorage.setItem('registrationId', deviceId);
		setTimeout(function(){
			app.initFrame();
		}, 100);
	}
};
