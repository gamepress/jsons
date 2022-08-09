<div id="demo">Loading....</div>
<hr>
<div id="output"></div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script>


var content = [];

var apk = {}, dl = {}, trainerBase = {}, monster = {}, monsterBase = {}, check = {}, evolution = [], variation = [];

var JSONcount = 0, JSONtotal = 9, everything = false;


$(document).ready(function(){
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/Trainer.json", function(data){
		content = data["entries"];
		JSONcheck();
	});
	

	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/lsd_apk.json", function(data){
		apk = data;
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


	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/TrainerBase.json", function(data){
		for(var i = 0; i < data["entries"].length; i++) {
		trainerBase[data["entries"][i]["trainerBaseId"]] = data["entries"][i];
		}
		JSONcheck();
	});	

	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/Monster.json", function(data){
		for(var i = 0; i < data["entries"].length; i++) {
		monster[data["entries"][i]["trainerId"]] = data["entries"][i];
		}
		JSONcheck();
	});	

	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/MonsterBase.json", function(data){
		for(var i = 0; i < data["entries"].length; i++) {
		monsterBase[data["entries"][i]["monsterNameId"]] = data["entries"][i]["monsterId"];
		}
		JSONcheck();
	});	
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/MonsterEvolution.json", function(data){
		evolution = data["entries"];
		JSONcheck();
	});	

	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/MonsterVariation.json", function(data){
		variation = data["entries"];
		JSONcheck();
	});	

	
	$.getJSON("https://gamepress.gg/pokemonmasters/checksum-trainer?_format=json", function(data){
		for(var i = 0; i < data.length; i++)
		{
		check[data[i]["field_trainer_base_id"]] = data[i];
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


   
function myFunction() {
	  
	var output = [];
	var allbaseid = [];

	for (var i = 0; i < content.length - 1; i++) {
		var current = {};
		
		
		var base = trainerBase[content[i]["trainerBaseId"]];
		
		var baseid = base["trainerBaseId"];
		
		
		if (allbaseid.includes(baseid)) {
			// SKIP THIS ONE IF THE TRAINER ALREADY EXISTS!
		}
		else {
			allbaseid.push(baseid);
			
			if (apk["trainer_name_en.lsd"][base["trainerNameId"]]) {
				current["Title"] = apk["trainer_name_en.lsd"][base["trainerNameId"]];
				// Special Cases
				switch (baseid) {
					case "10011700":
					current["Title"] = "Kukui (Royal Mask)";
					break;
					default:
				}
			}
			else if (base["ActorKeywordId"] == "hero") {
				current["Title"] = "Player";
			}
			else {
				current["Title"] = "";
			}


			current["trainerId"] = content[i]["trainerId"];
			current["Trainer ID"] = base["ActorKeywordId"];
			current["Trainer Base ID"] = baseid; // 6/3/2021 Adding import for Trainer Base ID
			current["Gender"] = base["Gender"];
			current["Trainer Description"] = apk["trainer_description_en.lsd"][content[i]["characterId"]];

			if( current["Trainer Description"] ) { 
			current["Trainer Description"]  = current["Trainer Description"].replace(/\n/g," "); }
			
			current["Base Potential"] = content[i]["rarity"];
			
			//todo: associate release with recruit method
			current["Release"] = content[i]["release"];
			
			// 6/3/2021 - Removing Sync Pokemon ref from Trainer page: will instead hold it in Pokemon Page so paragraphs will not be needed, less sensible to continually have to add cardinality each time a new pair is added.
			// current["Sync Pokemon ID" + "__" + "0"] = current["trainerId"] + "-" + [monster[content[i]["trainerId"]]["monsterId"]];
			
			var nids = 1;
			
			// //add in evolutions, if any
			// for(var j = 0; j < evolution.length; j++ ) {
				// if(evolution[j]["characterId"] == content[i]["characterId"]) {
					// var tempID = current["trainerId"] + "-" + monster[evolution[j]["trainerIdNext"]]["monsterId"];
				// current["Sync Pokemon ID" + "__" + nids] = tempID;
				// nids++;
				// }
			// }
			
			// //add in variations, if any
			// for(var j = 0; j < variation.length; j++ ) {
				// if(variation[j]["trainerId"] == content[i]["trainerId"]) {
					// var tempID = current["trainerId"] + "-" + monsterBase[variation[j]["monsterNameId"]];
				// current["Sync Pokemon ID" + "__" + nids] = tempID;
				// nids++;
				// }
			// }		
			
			//compare with site checksum, if different, show.
			current.checksum = checksum(serialize(current));
			if(check[current["Trainer Base ID"]]) { var cs = check[current["Trainer Base ID"]]["field_checksum"]; }
			if(check[current["Trainer Base ID"]]) { current.Title = check[current["Trainer Base ID"]]["url"].replace(/"/g, "'"); }
			if(everything || current.checksum != cs ) {
			if(current.trainerId != "28000020000" ) { output.push(current); } }
		}
	 }
	  
	  var demo = "Done! Showing just the latest changes. Click Show Everything to show all data!";
	document.getElementById("demo").innerHTML = demo;
	
	var outputcsv = object2CSV(output);
	document.getElementById("output").innerHTML = outputcsv;
	
	// document.getElementById("output").innerHTML = JSON.stringify(output);	
	
	
	var images = "title,icon,portrait,battle,stamp 1,stamp 2,stamp 3<br>";
	
	for( var i = 0; i < output.length; i++) {
	
	images = images + output[i]["Title"] + ",";
	images = images + output[i]["Trainer ID"] + "_128.ktx.png,";
	images = images + output[i]["Trainer ID"] + "_256_battle.ktx.png,";
	images = images + output[i]["Trainer ID"] + "_256.ktx.png,";
	images = images + output[i]["Trainer ID"] + "_st_1001_128.ktx.png,";
	images = images + output[i]["Trainer ID"] + "_st_1002_128.ktx.png,";
	images = images + output[i]["Trainer ID"] + "_st_1003_128.ktx.png,";
	images = images + "<br>";
	}
	
	
	document.getElementById("images").innerHTML = images;	


	//Generate urls
	var urls = "<table><tbody>";
	for (var i = 0; i < output.length; i++) {
		if(check[output[i]["trainerId"]]) { urls = urls + "<tr><td>" + check[output[i]["trainerId"]].url + "<\/td><\/tr>"; }
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
