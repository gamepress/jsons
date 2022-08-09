<div id="demo">Loading....</div>
<hr>
<div id="output"></div>


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script>


var content = [];


var output = [];

var apk = {}, dl = {}, itemSet = {}, deckItemParam = {}, costs = {}, check = {};

var JSONcount = 0, JSONtotal = 6, everything = false;



$(document).ready(function(){
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/DeckItem.json", function(data){
		content = data["entries"];
		JSONcheck();
	});
	

	var currdir = "https://raw.githubusercontent.com/gamepress/jsons/master/pm/lsd_dl.json";
	$.ajax({
		dataType: "text",
		url: currdir,
		success: function(data) {
			data = data.replace(/\\\[/g,"[").replace(/\\\]/g,"]");
			dl = JSON.parse(data);
			JSONcheck();
		}
	});
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/ItemSet.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		itemSet[data["entries"][i]["rewardId"]] = data["entries"][i];
		}
		JSONcheck();
	});	
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/DeckItemParam.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		deckItemParam[data["entries"][i]["deckItemParamId"]] = data["entries"][i];
		}
		JSONcheck();
	});		
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/DeckItemLvUp.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		if( !(costs[data["entries"][i]["itemId"]]) ) { costs[data["entries"][i]["itemId"]] = {}; }
		costs[data["entries"][i]["itemId"]][data["entries"][i]["nextLevel"]] = data["entries"][i];
		}
		JSONcheck();
	});	
	
	$.getJSON("https://gamepress.gg/pokemonmasters/checksum-item?_format=json", function(data){
		for(var i = 0; i < data.length; i++)
		{
		check[data[i]["field_item_id"]] = data[i];
		}
		JSONcheck();
	});	


});
	   
function JSONcheck() {
JSONcount++;

if(JSONcount >= JSONtotal) { myFunction(); }

}	   

function showEverything() {

everything = !(everything);

myFunction();

}


var stats = {
"HP": "HP",
"ATK": "Attack",
"DEF": "Defense",
"SPA": "Sp. Atk",
"SPD": "Sp. Def",
"SPE": "Speed"};

   
function myFunction() {
	  
	

	for (var i = 0; i < content.length - 1; i++) {
		var current = {};
		

		current = {...content[i]};
		
		current["Title"] = dl["deck_item_name_en.lsd"][current["itemId"]];
		current["Level 1 Level"] = 1;
		current["Level 1 Boost Stat"] = stats[deckItemParam[content[i].deckItemParamId]["Boost"]];
		current["Level 1 Boost QTY"] = parseInt(deckItemParam[content[i].deckItemParamId]["Lv1Boost"]);
		current["Level 1 Boost QTY Off Type"] = Math.floor(parseInt(current["Level 1 Boost QTY"]) / 2);
			
		
		var itemId = current["itemId"];
		
		
				
		//grab upgrade costs
		
		for(var y = 2; y <= 15; y++) {
		
		
		current["Level " + y + " Level"] = y;
		current["Level " + y + " Boost Stat"] = current["Level 1 Boost Stat"];
		current["Level " + y + " Boost QTY"] = parseInt(current["Level 1 Boost QTY"]) + ( y - 1) * parseInt(current.rarity);
		current["Level " + y + " Boost QTY Off Type"] = Math.floor(current["Level " + y + " Boost QTY"] / 2);
		
		var currentCost = {...itemSet[costs[itemId][y]["costRewardId"]]};
		
		for(z in currentCost) { if(currentCost[z] == 0) { delete currentCost[z]; } }
		
		current["Level " + Math.floor(y - 1) + " Costs"] = currentCost;
		
		//add coin cost
		current["Level " + Math.floor(y - 1) + " Costs"]["reward0"] = "40000000001";
		current["Level " + Math.floor(y - 1) + " Costs"]["reward0Qty"] = costs[itemId][y]["cost"];
		
		}
			
		
		

		//compare with site checksum, if different, show.
		current.checksum = checksum(serialize(current));
		if(check[current["itemId"]]) { var cs = check[current["itemId"]]["field_checksum"]; }
	if(check[current["itemId"]]) { current.Title = check[current["itemId"]]["url"].replace(/"/g, "'"); }
		if(everything || current.checksum != cs ) {
		output.push(current); }


	
	}
	
	  var demo = "Done! Showing just the latest changes. Click Show Everything to show all data!";
	document.getElementById("demo").innerHTML = demo;
	
	var outputcsv = object2CSV(output);
	document.getElementById("output").innerHTML = outputcsv;
	
	// document.getElementById("output").innerHTML = JSON.stringify(output);	

	//Generate urls
	var urls = "<table><tbody>";
	for (var i = 0; i < output.length; i++) {
		if(check[output[i]["itemId"]]) { urls = urls + "<tr><td>" + check[output[i]["itemId"]].url + "<\/td><\/tr>"; }
	}
	urls = urls + "<\/tbody><\/table>";
	document.getElementById("urls").innerHTML = urls;



}



function serialize(obj) {
  if (Array.isArray(obj)) {
    return JSON.stringify(obj.map(i => serialize(i)))
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj)
      .sort()
      .map(k => `${k}:${serialize(obj[k])}`)
      .join('|')
  }
 
  return obj
}

//converts Javscript Object to CSV
function object2CSV(input) {
	
	input = flattenOneLevel(input);
	
	var headers = [];
	var output = [headers];
	
	// Get full list of headers first
	
	for( x in input) {
		for (y in input[x]) {
			if (headers.indexOf(y) == -1) {
				headers.push(y);
			}
		}
	}
	
	// Populate data in headers

	for( x in input) {
	
	var current = [];
		
		for( y in input[x]) {
		
			//fill in data
			if (input[x][y] == "null" || input[x][y] == null ){
				current[headers.indexOf(y)] = "\"\"";
			}
			else {
				current[headers.indexOf(y)] = "\"" + input[x][y] + "\""; 
			}
		}
		
		output.push(current + "<br>");
	}
	
	var tdisp = "";
	
	for (var i = 0; i < output.length; i++) {
		if (i == 0) {
			tdisp = tdisp + output[0] + "<br>";
		}
		else {
			tdisp = tdisp + output[i];
		}
	}
	return tdisp;
}


function flattenOneLevel(ob) {
	var toReturn = [];
	
	var okeys = Object.keys(ob);
	for (var i = 0; i < okeys.length; i++) {
		toReturn[i] = flattenObject(ob[okeys[i]]);
	}
	
	return toReturn;
	
}

function flattenObject(ob) {
	var toReturn = {};
	
	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;
		
		if ((typeof ob[i]) == 'object' && ob[i] !== null) {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;
				
				toReturn[i + '__' + x] = flatObject[x];
			}
		}
		else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
}

	
	

function checksum(s)
{
  var chk = 0x12345678;
  var len = s.length;
  for (var i = 0; i < len; i++) {
      chk += (s.charCodeAt(i) * (i + 1));
  }

  return (chk & 0xffffffff).toString(16);
}



</script>
