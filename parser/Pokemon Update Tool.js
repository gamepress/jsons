<div id="demo">Loading....</div>
<hr>
<div id="output"></div>


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script>


var content = [], apk = {}, dl = {}, monsterName = {}, monsterBase = {}, trainerBase = {}, trainer = {}, monsterEvolution = {}, monsterVariation = {}, check = {}, trainerentries = [];

var JSONcount = 0, JSONtotal = 9, everything = false;


$(document).ready(function(){
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/Monster.json", function(data){
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
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/Trainer.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		trainer[data["entries"][i]["trainerId"]] = data["entries"][i];
		
		}
		trainerentries = data["entries"]
		JSONcheck();
	});		

	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/TrainerBase.json", function(data){
		for(var i = 0; i < data["entries"].length; i++) {
		trainerBase[data["entries"][i]["trainerBaseId"]] = data["entries"][i];
		}
		JSONcheck();
	});	

	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/MonsterBase.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
			if (monsterName[data["entries"][i]["monsterNameId"]]) {
			}
			else {
			monsterName[data["entries"][i]["monsterNameId"]] = data["entries"][i]["monsterNameRefId"];
			}
		monsterBase[data["entries"][i]["monsterId"]] = data["entries"][i];
		}
		JSONcheck();

	});	
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/MonsterEvolution.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		monsterEvolution[data["entries"][i]["trainerIdNext"]] = data["entries"][i]["characterId"];
		}
		JSONcheck();

	});		

	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/MonsterVariation.json", function(data){
		monsterVariation = data["entries"];
		// 8/9/2022 Update: The same trainer ID can have multiple variation entries, so using trainer ID as an identifier is no longer possible.
		
		// for(var i = 0; i < data["entries"].length - 1; i++)
		// {
		// monsterVariation[data["entries"][i]["trainerId"]] = data["entries"][i];
		// }
		JSONcheck();

	});		
	
	
	$.getJSON("https://gamepress.gg/pokemonmasters/checksum-pokemon?_format=json", function(data){
		for(var i = 0; i < data.length; i++)
		{
		check[data[i]["field_trainermonsterid"]] = data[i];
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
	 
var demo = "Done! Showing just the latest changes. Click Show Everything to show all data!";
	var output = [];
	var levelCap = [1, 100, 105, 110, 115, 120];
	var moveCheck = ["move1Id","move2Id","move3Id","move4Id","move5Id","move6Id","passive1Id","passive2Id","passive3Id","passive4Id","passive5Id","gigaMove1Id","gigaMove2Id","u30"];
	
	


	for ( var i = 0; i < content.length - 1; i++)	{
	current = {}, variant = {};
	var hideoutput = false;
	
	// 3/29/2022 Fix for duplicate Giovanni: Remove old Giovanni (without Mega Mewtwo Sync move)
	if ( content[i]["trainerId"] == "20140000000") {
		hideoutput = true;
	}
	
	if( trainer[content[i]["trainerId"]] ) {
		var current = {...content[i], ...trainer[content[i]["trainerId"]]};
	} 
	else if (monsterEvolution[content[i]["trainerId"]]){
		var current = {...content[i], ...trainer[10000000000 + parseInt(monsterEvolution[content[i]["trainerId"]])]};
	}
	// 12/21/2021 Added - Pulling Giovanni's trainer data correctly for Mega Mewtwo
	else if (monsterVariation.find(a => a.trainerId == content[i]["trainerId"]) ) {
		var current = {...content[i], ...trainer[parseInt(content[i]["trainerId"]) - 1] };
	}
	
	// 3/29/2021 Updated How Trainer ID is obtained from Evolution Stages.
	if (!current["trainerBaseId"]) {
		$.extend(current, trainerentries.filter(x => x.characterId == monsterEvolution[content[i].trainerId])[0]);
	}
	
	
	// 3/1/2021 Added a Monsterjson Trainer ID pull to get the correct MonsterVariation ID.
	var currVariantTrainerId = content[i].trainerId; // Not output
	
	current["MonsterTrainerID"] = current["trainerId"] + "-" + current["monsterId"];
	
	current["Natural Max Level"] = levelCap[current.rarity];
	
	current["hpMax"] = calcStats(current.hpValues, levelCap[current.rarity]);
	current["atkMax"] = calcStats(current.atkValues, levelCap[current.rarity]);
	current["defMax"] = calcStats(current.defValues, levelCap[current.rarity]);
	current["spaMax"] = calcStats(current.spaValues, levelCap[current.rarity]);
	current["spdMax"] = calcStats(current.spdValues, levelCap[current.rarity]);
	current["speMax"] = calcStats(current.speValues, levelCap[current.rarity]);
	
	current["Max Bulk"] = current["hpMax"] / 2.75 + current["spdMax"] + current["defMax"];
	current["Max Bulk Floored"] = Math.floor(current["hpMax"] / 2.75 + current["spdMax"] + current["defMax"]);
	
	
	// Note that some new Pokemon do not have their name in the monster_name_en.lsd file. Sometimes value 1 has to be subtracted to obtain the name (???) - 7/29/2020 NorseFTX
	// UPDATE 6/28/2022: MonsterBase now has the correct monster Name ID reference.
	var tempMonsterRef = null;
	if (monsterBase[current.monsterId]) {
		tempMonsterRef = monsterBase[current.monsterId]["monsterNameRefId"];
	}
	
	if (dl["monster_name_en.lsd"][tempMonsterRef]) {
 	 current["Pokemon"] = dl["monster_name_en.lsd"][tempMonsterRef];
	}
	else {
	 console.log("MonsterID " + current.monsterId + " not found. (i:" + i + ")");
	}
	
	// 9/28/2020 Special Case for Mimikyu forms
	switch (current.monsterId) {
		case "20081911":
		current["Pokemon"] += " (Disguised Form)";
		break;
		default:
	}
	
	// Undefined trainers default to "Player" for now.
	if (apk["trainer_name_en.lsd"][trainerBase[current.trainerBaseId]["trainerNameId"]]) {
		var trainerName = apk["trainer_name_en.lsd"][trainerBase[current.trainerBaseId]["trainerNameId"]];
	}
	else {
		var trainerName = "Player";
	}
	current["Title"] = trainerName + " & " + current["Pokemon"];
	
	// Add role if an Egg pokemon
	if (current.rarity == 1) {
		switch (current.role) {
			case "Tech":
			current["Title"] = trainerName + " & " + current["Pokemon"] + " (Tech)";
			break;
			case "Support":
			current["Title"] = trainerName + " & " + current["Pokemon"] + " (Support)";
			break;
			case "StrikeSpecial":
			case "StrikePhysical":
			current["Title"] = trainerName + " & " + current["Pokemon"] + " (Strike)";
			break;
			default:
		}
	}
	

  current["Pokemon Description"] =  dl["monster_description_en.lsd"][current.monsterId];
   if (monsterBase[current.monsterId]) {
	current["Gender"] = monsterBase[current.monsterId]["Gender"];
	current["IconID"] = monsterBase[current.monsterId]["monsterNameId"]; 
   
	

	// Requires a special case for passives! Have found more recently that "special" pokemon specific passives can be found in the MonsterBase.json file. u12 will sometimes hold this value.
	// u12 in MonsterBase.json file is generally only filled in for stance change / sync change pairs, such as Wikstrom and Oak. - NorseFTX 2/18/2020
	var hasSPassive = false;
	if (monsterBase[current.monsterId].u12 > 0) {
		hasSPassive = true;
	}
	
		
	// Checking whether each move exists
	for ( j = 0; j < moveCheck.length; j++) {
		switch (moveCheck[j]) {
			case "move1Id":
			if (current["newMove1Id"] > -1) {
				current[moveCheck[j]] = current["newMove1Id"];
			}
			break;
			case "move2Id":
			if (current["newMove2Id"] > -1) {
				current[moveCheck[j]] = current["newMove2Id"];
			}
			break;
			case "move3Id":
			if (current["newMove3Id"] > -1) {
				current[moveCheck[j]] = current["newMove3Id"];
			}
			break;
			case "move4Id":
			if (current["newMove4Id"] > -1) {
				current[moveCheck[j]] = current["newMove4Id"];
			}
			break;
			default:
		}
		if (current[moveCheck[j]] == 0) { 
			if (moveCheck[j].startsWith("passive") && hasSPassive) {
				current[moveCheck[j]] = monsterBase[current.monsterId].u12;
				hasSPassive = false;
			}
			else {
				delete current[moveCheck[j]]; 
			}
		}
	}
	}
	
	// MAX Move check through Variants
	// 8/9/2022 First loading for monsterVariation json entries with matching trainer ID
	var currVarEntry = monsterVariation.filter(a => a.trainerId == currVariantTrainerId);
	
	// Note that if it's a Gigantamax pokemon, it should be the first entry...hopefully. 
	if(currVarEntry[0] && currVarEntry[0].gigaMove1Id > -1) {
		//deep copy
		for(x in current) {
			if( typeof current[x] == "object" ) { 
				variant[x] = [...current[x]]; 
			}
			else { 
				variant[x] = current[x]; 
			}
		}
		for ( j = 0; j < moveCheck.length; j++) {
			if (currVarEntry[0][moveCheck[j]] != -1 && currVarEntry[0][moveCheck[j]] != 0 && currVarEntry[0][moveCheck[j]]) 
			{
				variant[moveCheck[j]] = currVarEntry[0][moveCheck[j]];
			}
		}
		if (variant["gigaMove1Id"]) {
			current["gigaMove1Id"] = variant["gigaMove1Id"];
			current["gigaMove2Id"] = variant["gigaMove2Id"];
			if (variant["u30"] > 0) {
				current["gigaMove3Id"] = variant["u30"];
			}
		}
	}
	
	// 3/2/2021 for May & Marshtomp, Swampert, Mega Swampert, the first move should be Muddy Water (330)
	switch (currVariantTrainerId) {
		case "20126000001":
		case "20126000002":
			current["move1Id"] = 330;
			break;
		default:
	}
	
	
	// 9/14/2021 Moved to after variant information in case Max Moves need to be addded to the current version.
	//compare with site checksum, if different, show.
	current.checksum = checksum(serialize(current));
	
	if(check[current["MonsterTrainerID"]]) { var cs = check[current["MonsterTrainerID"]]["field_checksum"]; }
	if(check[current["MonsterTrainerID"]]) { current.Title = check[current["MonsterTrainerID"]]["url"].replace(/"/g, "'"); }
	
	// 11/26/2020 Added - Lacking trainer Base ID means Pokemon will be excluded - missing stats and info. Are these placeholder Sync Pairs / data...?
	// 11/1/2021 Added - Also suppress output if type does not exist (such as for Mega Mewtwo Y)
		if( everything || ( current.checksum != cs && current.trainerBaseId && current.type && !hideoutput ) ) {
	output.push(current); }

	// =======================
	// Variation (Mega, Max, Alt Forme) Handling
	// =======================
	// 3/1/2021 Original first condition was "monsterVariation[current["trainerId"]]", but this reference does not hold for Mega forms for a second or third evolution. Changed to currVariantTrainerId.
	
	if(currVarEntry[0] && current["monsterId"] !== 20086211) {

	// 20086211: Gladion & Silvally - Listed as an exception as we don't want to output all 20 variants of Silvally as separate entries.
	// 2008900081: Leon & Eternatus ? Gigantamax form?, no new data yet, must be placeholder.
	
		// Create a deep copy of the original base Pokemon
		// for(x in current) {
		// if( typeof current[x] == "object" ) { variant[x] = [...current[x]]; }
		// else { variant[x] = current[x]; }
		// }
		

		// currVarEntry is an array of objects - Multiple variants are possible.
		for (var vi = 0; vi < currVarEntry.length; vi++) {
			
			var variant = jQuery.extend(true, {}, current);

			variant["monsterId"] = monsterName[currVarEntry[vi].monsterNameId]; 
			
			if (dl["monster_name_en.lsd"][variant.monsterId]) {
				variant["Pokemon"] = dl["monster_name_en.lsd"][variant.monsterId];
			}
			// For second evolution, may need -1
			else if (dl["monster_name_en.lsd"][variant.monsterId - 1]) {
				variant["Pokemon"] = dl["monster_name_en.lsd"][variant.monsterId - 1];
			}
			// For Shiny, may need -1000000
			else if (dl["monster_name_en.lsd"][variant.monsterId - 1000000]) {
				variant["Pokemon"] = dl["monster_name_en.lsd"][variant.monsterId - 1000000];
			}
			// Exception for Silvally
			else if (variant.monsterId == 20086228) {
				variant["Pokemon"] = dl["monster_name_en.lsd"][20086211];
			}
			else {
				variant["Pokemon"] = dl["monster_name_en.lsd"][variant.monsterId];
			}
			
			// 9/28/2020 Special Case for Mimikyu
			switch (variant.monsterId) {
				case "20081911":
				variant["Pokemon"] += " (Disguised Form)";
				break;
				case "20081912":
				variant["Pokemon"] += " (Busted Form)";
				break;
				default:
			}
			

			
			variant["Title"] = trainerName + " & " + variant["Pokemon"];
			 variant["Pokemon Description"] =  dl["monster_description_en.lsd"][variant.monsterId];
			 variant["MonsterTrainerID"] = current["trainerId"] + "-" + variant["monsterId"];
			 // 8/9/2022 - Special MonsterTrainerID fix for Steven & Deoxys' 4 variant forms
			 if (current["trainerId"] == 20090100000) {
				variant["MonsterTrainerID"] += "-" + vi;
			 }
			 variant["IconID"] = currVarEntry[vi]["monsterNameId"]; 
			
			for ( j = 0; j < moveCheck.length; j++) {
				// 3/15/2022 : Passive 3 = u17; Passive 4 = u18
				// First check if the matching name exists
				var moveField = "";
				switch (moveCheck[j]) {
					case "passive3Id":
						moveField = "u17";
					break;
					case "passive4Id":
						moveField = "u18";
					break;
					default:
						moveField = moveCheck[j];
				}
				if (currVarEntry[vi][moveField] > 0) 
				{
					variant[moveCheck[j]] = currVarEntry[vi][moveField];
				}
			}
			
			// 7/28/2021 Gigantamax/MAX move handling:
			// If variant["gigaMove1Id"] exists, need to:
			// 1) Set Variable to suppress output.
			
			if (variant["gigaMove1Id"]) {
				hideoutput = true;
			}
			
			// Additional fix for variant 3rd Passive (u17): If u17 exists, put into passive3Id
			if (currVarEntry[vi]["u17"] > 0) {
				variant["passive3Id"] = currVarEntry[vi]["u17"];
			}
			
			if( currVarEntry[vi]["atkScale"] != 100 ) {
			for(j=0; j< variant.atkValues.length; j++) { variant.atkValues[j] = (variant.atkValues[j] * currVarEntry[vi]["atkScale"] / 100); }
			variant.atkMax = Math.floor(calcStats(variant.atkValues, levelCap[variant.rarity]));
			for(j=0; j< variant.atkValues.length; j++) { variant.atkValues[j] = Math.floor(variant.atkValues[j]); }
			}
			if( currVarEntry[vi]["defcale"] != 100 ) {
			for(j=0; j< variant.defValues.length; j++) { variant.defValues[j] = (variant.defValues[j] * currVarEntry[vi]["defScale"] / 100); }
			variant.defMax = Math.floor(calcStats(variant.defValues, levelCap[variant.rarity]));
			for(j=0; j< variant.defValues.length; j++) { variant.defValues[j] = Math.floor(variant.defValues[j]); }
			}
			if( currVarEntry[vi]["spaScale"] != 100 ) {
			for(j=0; j< variant.spaValues.length; j++) { variant.spaValues[j] = (variant.spaValues[j] * currVarEntry[vi]["spaScale"] / 100); }
			variant.spaMax = Math.floor(calcStats(variant.spaValues, levelCap[variant.rarity]));
			for(j=0; j< variant.spaValues.length; j++) { variant.spaValues[j] = Math.floor(variant.spaValues[j]); }
			}
			if( currVarEntry[vi]["spdScale"] != 100 ) {
			for(j=0; j< variant.spdValues.length; j++) { variant.spdValues[j] = (variant.spdValues[j] * currVarEntry[vi]["spdScale"] / 100); }
			variant.spdMax = Math.floor(calcStats(variant.spdValues, levelCap[variant.rarity]));
			for(j=0; j< variant.spdValues.length; j++) { variant.spdValues[j] = Math.floor(variant.spdValues[j]); }
			}
			if( currVarEntry[vi]["speScale"] != 100 ) {
			for(j=0; j< variant.speValues.length; j++) { variant.speValues[j] = (variant.speValues[j] * currVarEntry[vi]["speScale"] / 100); }
			variant.speMax = Math.floor(calcStats(variant.speValues, levelCap[variant.rarity]));
			for(j=0; j< variant.speValues.length; j++) { variant.speValues[j] = Math.floor(variant.speValues[j]); }
			}
			
			variant["Max Bulk"] = variant["hpMax"] / 2.75 + variant["spdMax"] + variant["defMax"];
			variant["Max Bulk Floored"] = Math.floor(variant["hpMax"] / 2.75 + variant["spdMax"] + variant["defMax"]);
			

			//compare with site checksum, if different, show.
			variant.checksum = checksum(serialize(variant));
			
			// Suppress output (temporarily: 7/28/2021, for Eternatus Gigantamax form) if no Pokemon Name available
			// 11/1/2021 Added - Also suppress output if type does not exist (such as for Mega Mewtwo Y)
			// 12/21/2021 Type suppression removed, variant handling added.
			if (variant["Pokemon"] && !hideoutput ) { // && variant["type"]) {
			
				if(check[variant["MonsterTrainerID"]]) { var cs = check[variant["MonsterTrainerID"]]["field_checksum"]; }
				if(check[variant["MonsterTrainerID"]]) { variant.Title = check[variant["MonsterTrainerID"]]["url"].replace(/"/g, "'"); }
				if(everything || variant.checksum != cs ) {
				output.push(variant); }
			
			}
		}

	}
	

		
	}
	
	
	
	  
	document.getElementById("demo").innerHTML = demo;
	
	var outputcsv = object2CSV(output);
	document.getElementById("output").innerHTML = outputcsv;
	
	// document.getElementById("output").innerHTML = JSON.stringify(output);	
	
	// var images = "enemyId,image<br>";
	
	// for(var i = 0; i < output.length - 1; i++) {
	// images = images + output[i]["monsterId"] + "," + content[i]["monsterId"] + "_256.ktx.png<br>";
	// }
	
	// document.getElementById("images").innerHTML = JSON.stringify(images);
	
	//Generate urls
	
	var urls = "<table><tbody>";
	
	for (var i = 0; i < output.length; i++) {
		if(check[output[i].MonsterTrainerID]) { urls = urls + "<tr><td>" + check[output[i].MonsterTrainerID].url + "<\/td><\/tr>"; }
	}
	
	urls = urls + "<\/tbody><\/table>";
	
	document.getElementById("urls").innerHTML = urls;
	
}







function calcStats(statsArray, currentLevel) {

var breakPoints = [0, 30, 45, 100, 120];
var stats, high = 1, low = 0;

for( var i= 0; i < breakPoints.length; i++) {

if(parseInt(currentLevel) > breakPoints[i]) { 
low = i; 
high = i + 1; 
}


}
if (statsArray) {

stats = Math.floor( statsArray[low] + ( statsArray[high] - statsArray[low] )  * ( parseInt(currentLevel) - breakPoints[low] ) / ( breakPoints[high] - breakPoints[low] ) );

}


return stats;

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
