/**
 * Copyright 2016 HARTING IT Software Development
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

/**
 Node-RED node with support for connecting to a Rserve serve and to evaluate expressions according to the R programming language.
 This project is based on the npm rserve-client project.

 @author <a href="mailto:oliver.beyer@HARTING.com">Oliver Beyer</a> (HARTING IT Cognitive Systems)
**/
module.exports = function(RED) {
    "use strict";
    var rserve = require('rserve-client');

    function RserveClient(config) {
        RED.nodes.createNode(this,config);
        this.host = config.host;  			// IP address of the Rserve server
        this.port = config.port;            // Port of the Rserve server
        this.label = config.label;          // Set the label of the node 
        var node = this;
		var expression = "";

        node.on("input", function(msg) {
			expression = msg.payload;
			rserve.connect(node.host, node.port, function(err, client) {
				if (err) {
        			node.error(RED._("Rserve server connection error"));
    			} else {
    				client.evaluate(expression, function(err, ans) {
						if (err) {
							node.error(RED._("Rserve server couldn't evaluate expression"));
						} else {
        					client.end();
							msg.payload = ans;
							node.send(msg);
						}
    				}); 
    			}   
			});
        });
    }
    RED.nodes.registerType("rserve",RserveClient);
}
