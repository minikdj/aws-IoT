/*
 * Copyright 2010-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

//node.js deps

//npm deps

//app deps
const deviceModule = require('..').device;
const cmdLineProcess = require('./lib/cmdline');

//begin module

function processTest(args) {
   //
   // The device module exports an MQTT instance, which will attempt
   // to connect to the AWS IoT endpoint configured in the arguments.
   // Once connected, it will emit events which our application can
   // handle.
   //

   const device = deviceModule({
      keyPath: args.privateKey,
      certPath: args.clientCert, 
      caPath: args.caCert,
      clientId: args.clientId,
      region: args.region,
      baseReconnectTimeMs: args.baseReconnectTimeMs,
      keepalive: args.keepAlive,
      protocol: args.Protocol,
      port: args.Port,
      host: "a2l9mv2eyo2tba-ats.iot.us-east-2.amazonaws.com",
      debug: args.Debug
   });

   var timeout;
   var count = 0;
   const minimumDelay = 250;
/*
   if (args.testMode === 1) {
      device.subscribe('topic_1');
   } else {
      device.subscribe('topic_2');
   }
   if ((Math.max(args.delay, minimumDelay)) !== args.delay) {
      console.log('substituting ' + minimumDelay + 'ms delay for ' + args.delay + 'ms...');
   }
*/
   timeout = setInterval(function() {
      	count++;
        
	var date = new Date();
	
	device.publish('iot/garden', JSON.stringify({
           	GardenID : 0,
		humidity : Math.round(Math.random() * 100),
		light : Math.round(Math.random() * 2000),
		'soil moisture': Math.round(Math.random() * 5000),
		temperature : Math.round(Math.random() * 110),
		timestamp : date.getTime() 
         }));
     	device.publish('iot/garden', JSON.stringify({
           	GardenID : 2,
		humidity : Math.round(Math.random() * 100),
		light : Math.round(Math.random() * 2000),
		'soil moisture': Math.round(Math.random() * 5000),
		temperature : Math.round(Math.random() * 110),
		timestamp : date.getTime() 
         }));
 
   }, Math.max(args.delay, minimumDelay)); // clip to minimum

   //
   // Do a simple publish/subscribe demo based on the test-mode passed
   // in the command line arguments.  If test-mode is 1, subscribe to
   // 'topic_1' and publish to 'topic_2'; otherwise vice versa.  Publish
   // a message every four seconds.
   //
   device
      .on('connect', function() {
         console.log('connect');
      });
   device
      .on('close', function() {
         console.log('close');
      });
   device
      .on('reconnect', function() {
         console.log('reconnect');
      });
   device
      .on('offline', function() {
         console.log('offline');
      });
   device
      .on('error', function(error) {
         console.log('error', error);
      });
   device
      .on('message', function(topic, payload) {
         console.log('message', topic, payload.toString());
      });

}

module.exports = cmdLineProcess;

if (require.main === module) {
   cmdLineProcess('connect to the AWS IoT service and publish/subscribe to topics using MQTT, test modes 1-2',
      process.argv.slice(2), processTest);
}
