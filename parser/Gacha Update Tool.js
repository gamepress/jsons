<table style="table-layout: fixed;"><tr><td>
<button onclick="myFunction()" class="featured-button" style="width: 100%">Update Me!</button></td><td>
<button onclick="showEverything()" class="featured-button" style="width: 100%">Show Everything</button></td></table>

<div id="demo">Loading....</div>
<hr>
<div id="output"></div>




<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script>


var content = [];

var apk = {}, dl = {}, schedule = {}, banner = {}, eventBanner = {}, rate = {}, monster = {}, trainer = {}, pickup = {};

var JSONcount = 0, JSONtotal = 10, everything = false, check = {}, pokemon = {};

var names = {};

$(document).ready(function(){
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/Scout.json", function(data){
		content = data["entries"];
		JSONcheck();
	});
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/ScoutPickup.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		pickup[data["entries"][i]["eventId"]] = data["entries"][i];
		}
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
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/Schedule.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		schedule[data["entries"][i]["scheduleId"]] = data["entries"][i];
		}
		JSONcheck();
	});	
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/Banner.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		banner[data["entries"][i]["eventId"]] = data["entries"][i];
		}
		JSONcheck();
	});		
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/EventBanner.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		eventBanner[data["entries"][i]["eventId"]] = data["entries"][i];
		}
		JSONcheck();
	});	
	
	// $.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/ScoutUnitRate.json", function(data){
		// for(var i = 0; i < data["entries"].length - 1; i++)
		// {
		// if (!(rate[data["entries"][i].eventId])) { rate[data["entries"][i].eventId] = []; }
		// rate[data["entries"][i]["eventId"]].push(data["entries"][i]);
		// }
		// JSONcheck();

	// });	

	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/Trainer.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		trainer[data["entries"][i]["characterId"]] = data["entries"][i];
		}
		JSONcheck();
	});		


	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/Monster.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		monster[data["entries"][i]["trainerId"]] = data["entries"][i];
		}
		JSONcheck();
	});		



	$.getJSON("https://gamepress.gg/pokemonmasters/checksum-gacha?_format=json", function(data){
		for(var i = 0; i < data.length; i++)
		{
		check[data[i]["field_event_id"]] = data[i];
		}
		JSONcheck();
	});	

	$.getJSON("https://gamepress.gg/pokemonmasters/checksum-pokemon?_format=json", function(data){
		for(var i = 0; i < data.length; i++)
		{
		pokemon[data[i]["field_monsterid"]] = data[i];
		}
		JSONcheck();
	});	


});
	   
	   
function JSONcheck() {
JSONcount++;

if(JSONcount >= JSONtotal) { 

	for( x in trainer) {

	var trainerId, monsterId;

	trainerId = trainer[x].trainerId;

	if(monster[trainerId].monsterId) {
	monsterId = monster[trainerId].monsterId;
	if(pokemon[monsterId]) { names[x] = pokemon[monsterId].title; }}
	}
	myFunction(); }

}	   

function showEverything() {

	everything = !(everything);

	myFunction();

}


   
function myFunction() {
	  
	var output = [];

	for (var i = 0; i < content.length - 1; i++) {
	
	var current = {};
	eventId = content[i].eventId;
	
	current["Event ID"] = eventId;
	if(pickup[eventId]) { 
	current["Summonable Units Featured"] = names[pickup[eventId].characterId]; 
	current["Summon Info"] = dl["scout_pickup_description_en.lsd"][pickup[eventId].lotteryPickupDescriptionId]; 
	}
	
	if(!(current["Summon Info"])) { current["Summon Info"] = dl["scout_description_en.lsd"][eventId]; }

		
	current["EVENT START"] = new Date(parseInt(schedule[content[i].bannerId].startTime) * 1000).toISOString();
	current["EVENT START"] = current["EVENT START"].split(".")[0];
	current["EVENT END"] = new Date(parseInt(schedule[content[i].bannerId].endTime) * 1000).toISOString();
	current["EVENT END"] = current["EVENT END"].split(".")[0];
	
	

	
	if(banner[eventId]) {
	current["Banner ID"] = banner[eventId].bannerId;
	current["Title"] = dl["banner_text_en.lsd"][banner[eventId].bannerTextId];
	}
	else {
		current["Banner ID"] = content[i].bannerId;
	}
	
	if(!(current["Title"])) { current["Title"] = dl["scout_name_en.lsd"][eventId]; }
 
	current["Use New Format"] = 1;
	current["Summonable Units"] = "";
	
	// for(var j = 0; j < rate[eventId].length; j++) {
	// current["Summonable Units"] += names[rate[eventId][j].characterId];
	// current["Summonable Units"] += ": ";
	// current["Summonable Units"] += Math.round(parseInt(rate[eventId][j].dropRate) / 100000);
	// current["Summonable Units"] += ";";
	// }

	//compare with site checksum, if different, show.
	current.checksum = checksum(serialize(current));
	if(check[eventId]) { var cs = check[eventId]["field_checksum"]; }
if(check[eventId]) { current["Title"] = check[eventId]["url"].replace(/"/g, "'"); }
	if(everything || current.checksum != cs ) {
if(eventId != "release_201902_gacha1" && eventId != "tutorial_gacha1" && current["Title"]) { 
	output.push(current); } }

	}

	
	  var demo = "Done! Showing just the latest changes. Click Show Everything to show all data!";
	document.getElementById("demo").innerHTML = demo;
	
	var outputcsv = object2CSV(output);
	document.getElementById("output").innerHTML = outputcsv;
	
	// document.getElementById("output").innerHTML = JSON.stringify(output);	


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