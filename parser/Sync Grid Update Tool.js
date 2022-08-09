<div id="demo">Loading....</div>
<hr>
<div id="output"></div>


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script>

// Note: For testing purposes, Cyrus TrainerID = 10194000000

var content = [], apk = {}, dl = {}, monsterName = {}, monsterBase = {}, trainerBase = {}, trainer = {}, monsterEvolution = {}, monsterVariation = {}, check = {}, move = {};

var abilityjson = [], abilitypaneljson = [], abilityitemjson = [], abilityreleasecondition = []
;
var rootdir = "https://raw.githubusercontent.com/gamepress/jsons/master/pm/";

var JSONcount = 0, JSONtotal = 14, everything = false;


$(document).ready(function(){
	$.getJSON(rootdir + "Ability.json", function(data) {
		abilityjson = data["entries"];
		JSONcheck();
	});
	$.getJSON(rootdir + "AbilityPanel.json", function(data) {
		abilitypaneljson = data["entries"];
		JSONcheck();
	});
	$.getJSON(rootdir + "AbilityItem.json", function(data) {
		abilityitemjson = data["entries"];
		JSONcheck();
	});
	$.getJSON(rootdir + "AbilityReleaseCondition.json", function(data) {
		abilityreleaseconditionjson = data["entries"];
		JSONcheck();
	});
	$.getJSON(rootdir + "Monster.json", function(data){
		content = data["entries"];
		JSONcheck();
	});
	$.getJSON(rootdir + "Move.json", function(data){
		move = data["entries"];
		JSONcheck();
	});
	
 $.getJSON(rootdir + "lsd_apk.json", function(data){
		apk = data;
		JSONcheck();
	 });


	var currdir = rootdir + "lsd_dl.json";
	$.ajax({
		dataType: "text",
		url: currdir,
		success: function(data) {
			data = data.replace(/\\\[/g,"[").replace(/\\\]/g,"]");
			dl = JSON.parse(data);
			JSONcheck();
		}
	});
	
	$.getJSON(rootdir + "Trainer.json", function(data){
		trainer = data["entries"];
		JSONcheck();
	});		

	$.getJSON(rootdir + "TrainerBase.json", function(data){
		trainerBase = data["entries"];
		JSONcheck();
	});	

	$.getJSON(rootdir + "MonsterBase.json", function(data){
		monsterBase = data["entries"];
		JSONcheck();

	});	
	
	$.getJSON(rootdir + "MonsterEvolution.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		monsterEvolution[data["entries"][i]["trainerIdNext"]] = data["entries"][i]["characterId"];
		}
		JSONcheck();

	});		

	$.getJSON(rootdir + "MonsterVariation.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		monsterVariation[data["entries"][i]["trainerId"]] = data["entries"][i];
		}
		JSONcheck();

	});		
	
	// Prior dir: "https://gamepress.gg/pokemonmasters/sites/pokemonmasters/files/json/sync_grid_node_json.json?version=18"
	$.getJSON(jsons["sync_grid_node_json"], function(data){
		for(var i = 0; i < data.length; i++)
		{
			if (data[i]["field_checksum"].length > 0) {
			check[data[i]["title"][0].value] = data[i]["field_checksum"][0].value;
			}
		}
		JSONcheck();
	});	


});

function JSONcheck() {
	JSONcount++;
	document.getElementById("demo").innerHTML = "Loading.... (" + JSONcount + "/" + JSONtotal + ")";
	if(JSONcount >= JSONtotal) { myFunction(); }
}	   

function showEverything() {

everything = !(everything);

myFunction();

}

 
	   
function myFunction() {
	
// Output notes:
// 0) Sync Pair - from abilitypaneljson[x].trainerId => trainerjson[characterId == abilitypaneljson[x].trainerId].trainerBaseId => trainerbasejson[trainerBaseId].trainerNameId => dl["trainer_name_en.lsd"][trainerNameId] + " & " + trainerjson.trainerId => monsterjson[trainerId].monsterId => dl["monster_name_en.lsd"].monsterId
// 1) ID - from AbilityPanel.json > cellId (incrementing per trainerId)
// 2) Energy - abilitypaneljson[x].energyCost
// 3) Sync Orbs - abilitypaneljson[x].orbCost
// 4) Bonus Text - dl["ability_description_en.lsd"][abilityjson.abilityId == abilitypaneljson[x].abilityId]
//   > Take the above and replace the text between [Digit:5digits ] with abilityjson[x].value
//   > Replace [Name:Move ] with abilityjson[x].moveId > dl["move_name_en.lsd"]
//   > Replace [Name:AbilityDescription ] with abilityjson[x].passiveId > dl["passive_skill_name_en.lsd"]
// 5) Condition Text - May have multiple:
//   > Loop through the array abilitypanel[x].conditionIds[0 1 2 ...]
//   > Get object for abilityreleasecondition.conditionId == abilitypanel[x].conditionIds[i]
//   > Text = dl["ability_release_condition_en.lsd"][abilityreleasecondition.type]
//   > Replace text [Digit:1digit ]
//   > Replace text [Digit:2digits ]
//   > Replace text [Digit:3digits ] - Any of those three variants with abilityreleasecondition.parameter
//   > Repeat for each condition
// 6) Color - ??
//    abilityjson.type? : 
//    1 = Blue
//    2 = Blue
//    3 = Blue
//    4 = Blue
//    5 = Blue
//    6 = Blue
//    7 = Yellow
//    8 = Red
//    9 = Green OR Light Blue if abilityjson[].value == 25
//    10= Green
// 6.1) Symbol - Run case on Color 
//    Blue = Cube
//    Red/Yellow = Star
//    Green = Lookup MOVE > TYPE: move.find(a => a.MoveID == MOVEID).Type.
//    Rainbow = Begin *** Need to initialize this node manually in import!
//    Light Blue = Sync
// 7) X - from abilitypaneljson[x].x
// 8) Y - evaluate abilitypaneljson[x].y - abilitypaneljson[x].z

	 
var demo = "Done! Showing just the latest changes. Click Show Everything to show all data!";
	var output = [];
	var currSP = "";
	var currMTID = "";
	var nodect = 0;

	for ( var i = 0; i < abilitypaneljson.length - 1; i++)	{
		current = {};
		
		current["cellId"] = abilitypaneljson[i].cellId;
		
		// First pull Sync Pair name
		// 0) Sync Pair - from abilitypaneljson[x].trainerId => trainerjson[characterId == abilitypaneljson[x].trainerId].trainerBaseId => trainerbasejson[trainerBaseId].trainerNameId => dl["trainer_name_en.lsd"][trainerNameId] + " & " + trainerjson.trainerId => monsterjson[trainerId].monsterId => dl["monster_name_en.lsd"].monsterId
		cTrainer = trainer.find(x => x.characterId == abilitypaneljson[i].trainerId);
		
		cTrainerName = dl["trainer_name_en.lsd"][trainerBase.find(x => x.trainerBaseId == cTrainer.trainerBaseId).trainerNameId];
		if (!cTrainerName) {
			cTrainerName = "Player";
		}
		
		monsterid = content.find(x => x.trainerId == cTrainer.trainerId).monsterId;
		cPokemonName = "undefined";
		// 6/28/2022 - Added method of pulling Monster Name reference from MonsterBase.
		var tempMonsterRef = null;
		var basetemp = monsterBase.find(a => a.monsterId == monsterid);
		if (basetemp) {
			tempMonsterRef = basetemp["monsterNameRefId"];
		}
		
		if (dl["monster_name_en.lsd"][tempMonsterRef]) {
		 cPokemonName = dl["monster_name_en.lsd"][tempMonsterRef];
		}
		
		current["cSyncPair"] = cTrainerName + " & " + cPokemonName;
		current["cMonsterTrainerID"] = cTrainer.trainerId + "-" + monsterid;
		
		
		// Modify Sync Pair Name for certain cases - legacy names have First evolution form instead of third.
		switch (current["cSyncPair"]) {
			case "May & Mudkip":
			current["cSyncPair"] = "May & Swampert";
			break;
			case "Hilbert & Oshawott":
			current["cSyncPair"] = "Hilbert & Samurott";
			break;
			case "Phoebe & Dusclops":
			current["cSyncPair"] = "Phoebe & Dusknoir";
			break;
			case "Brendan & Treecko":
			current["cSyncPair"] = "Brendan & Sceptile";
			break;
			case "Olivia & Lycanroc":
			current["cSyncPair"] = "Olivia & Lycanroc (Midnight Form)";
			break;
			case "Ethan & Cyndaquil":
			current["cSyncPair"] = "Ethan & Typhlosion";
			break;
			case "Kris & Totodile":
			current["cSyncPair"] = "Kris & Feraligatr";
			break;
			case "Lyra & Chikorita":
			current["cSyncPair"] = "Lyra & Meganium";
			break;
			case "Steven & Sandslash":
			current["cSyncPair"] = "Steven & Sandslash (Alola Form)";
			break;
			case "Rosa & Snivy":
			current["cSyncPair"] = "Rosa & Serperior";
			break;
			case "Pryce & Seel":
			current["cSyncPair"] = "Pryce & Dewgong";
			break;
			case "Elio & Popplio":
			current["cSyncPair"] = "Elio & Primarina";
			break;
			case "Selene & Rowlet":
			current["cSyncPair"] = "Selene & Decidueye";
			break;
			
			case "Leaf & Venusaur":
			current["cSyncPair"] = "Sygna Suit Leaf & Venusaur";
			break;
			case "Blue & Blastoise":
			current["cSyncPair"] = "Sygna Suit Blue & Blastoise";
			break;
			case "Cynthia & Kommo-o":
			current["cSyncPair"] = "Sygna Suit Cynthia & Kommo-o";
			break;
			case "Grimsley & Sharpedo":
			current["cSyncPair"] = "Sygna Suit Grimsley & Sharpedo";
			break;
			case "Elesa & Rotom":
			current["cSyncPair"] = "Sygna Suit Elesa & Rotom";
			break;

			default:
		}
		
		// Start Node # at 1 each time a new Trainer's sync grid data starts.
		if (currSP !== current["cSyncPair"]) {
			nodect = 1;
			currSP = current["cSyncPair"];
			currMTID = current["cMonsterTrainerID"];
		}
		
		// 1) ID - from AbilityPanel.json > cellId (incrementing per trainerId)
		current["cGridID"] = currSP + "_" + nodect;
		current["cNum"] = nodect;
		nodect++;
		
		// 2) Energy - abilitypaneljson[x].energyCost
		current["cEnergy"] = abilitypaneljson[i].energyCost;
		
		// 3) Sync Orbs - abilitypaneljson[x].orbCost
		current["cSyncOrb"] = abilitypaneljson[i].orbCost;
		
		// 4) Bonus Text - dl["ability_description_en.lsd"][abilityjson.abilityId == abilitypaneljson[x].abilityId]
		//   > Take the above and replace the text between [Digit:5digits ] with abilityjson[x].value
		//   > Replace [Name:Move ] with abilityjson[x].moveId > dl["move_name_en.lsd"]
		//   > Replace [Name:AbilityDescription ] with abilityjson[x].passiveId > dl["passive_skill_name_en.lsd"]
		cAbility = abilityjson.find(x => x.abilityId == abilitypaneljson[i].abilityId);
		cBonus = dl["ability_description_en.lsd"][cAbility.type];
		
		cBonus = cBonus.replace(/\[Digit.*?\]/,cAbility.value);
		cBonus = cBonus.replace(/M?o?v?e?:?.?\[Name:Move.?\]/,dl["move_name_en.lsd"][cAbility.moveId] + ":");
		cBonus = cBonus.replace("::",":");
		cBonus = cBonus.replace("↑ ","");
		cBonus = cBonus.replace(/\[Name:AbilityDescription.?\]/,dl["passive_skill_name_en.lsd"][cAbility.passiveId]);
		
		// 6/29/2021 Added output for move and passive references for easier importing process.
		isSync = false;
		if (move.find(a => a.MoveID == cAbility.moveId)) {
			if (move.find(a => a.MoveID == cAbility.moveId).Group == "Sync") {
				isSync = true;
			}
			if (isSync) {
				current["cSyncMoveAffected"] = cAbility.moveId;
			}
			else {
				current["cMoveAffected"] = cAbility.moveId;
			}
		}
		if (cAbility.passiveId > 0) {
			current["cPassiveGranted"] = cAbility.passiveId;
		}
		
		// Adding STAT and BONUS output!
		if (cAbility.type < 7) {
			current["cStat"] = dl["ability_description_en.lsd"][cAbility.type].replace(/ \[D.*\]/,"");
		}
		else if (cAbility.type == 9) {
			current["cStat"] = "Power";
		}
		else if (cAbility.type == 10) {
			current["cStat"] = "Accuracy";
		}
		
		if (cAbility.value > 0) {
			current["cBonusValue"] = cAbility.value;
		}
		
		// 6/29/2021 Added: Replace passive parts "[Name:PassiveSkillNameParts Idx='13060200' ]" with correct number
		partsIdx = cBonus.substring(cBonus.indexOf("'")+1,cBonus.indexOf("'",cBonus.indexOf("'")+1));
		temppart = dl["passive_skill_name_parts_en.lsd"][partsIdx];
		if (temppart) {
			temppart = temppart.replace(/\[Name:PassiveSkillNameDigit ?\]/,parseInt(cAbility.passiveId) - parseInt(partsIdx));
			cBonus = cBonus.replace(/\[Name:PassiveSkillNameParts.*\]/,temppart);
		}
		
		current["cBonusText"] = cBonus;
		
		// 5) Condition Text - May have multiple:
		//   > Loop through the array abilitypanel[x].conditionIds[0 1 2 ...]
		//   > Get object for abilityreleasecondition.conditionId == abilitypanel[x].conditionIds[i]
		//   > Text = dl["ability_release_condition_en.lsd"][abilityreleasecondition.type]
		//   > Replace text [Digit:1digit ]
		//   > Replace text [Digit:2digits ]
		//   > Replace text [Digit:3digits ] - Any of those three variants with abilityreleasecondition.parameter
		//   > Repeat for each condition
		
		for (var ci = 0; ci < abilitypaneljson[i].conditionIds.length; ci++) {
			currCond = abilityreleaseconditionjson.find(x => x.conditionId == abilitypaneljson[i].conditionIds[ci]);
			cCond = dl["ability_release_condition_en.lsd"][currCond.type];
			
			cCond = cCond.replace(/\[Digit:.digits?.?\]/,currCond.parameter);
			if (currCond.type == 6) {
				current["cReqSyncLevel"] = currCond.parameter;
			}
			
			current["cCondition-" + ci] = cCond;
		}
		
		// 6) Color - ??
		//    abilityjson.type? : 
		//    1 = Blue
		//    2 = Blue
		//    3 = Blue
		//    4 = Blue
		//    5 = Blue
		//    6 = Blue
		//    7 = Yellow
		//    8 = Red
		//    9 = Green OR Light Blue if abilityjson[].value == 25
		//    10= Green
		
		cColor = "";
		
		switch (cAbility.type) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				cColor = "Blue";
				break;
			case 7:
				cColor = "Yellow";
				break;
			case 8:
				cColor = "Red";
				break;
			case 9:
				if (isSync) {
					cColor = "Light Blue";
				}
				else {
					cColor = "Green";
				}
				break;
			case 10:
				cColor = "Green";
				break;
			default:
		}
		
		current["cColor"] = cColor;
		
		// 6.1) Symbol - Run case on Color 
		//    Blue = Cube
		//    Red/Yellow = Star
		//    Green = Lookup MOVE > TYPE: move.find(a => a.MoveID == MOVEID).Type.
		//    Rainbow = Begin *** Need to initialize this node manually in import!
		//    Light Blue = Sync
		
		cSymbol = "";
		switch (cColor) {
			case "Blue":
				cSymbol = "Cube";
				break;
			case "Red":
			case "Yellow":
				cSymbol = "Star";
				break;
			case "Green":
				cSymbol = move.find(a => a.MoveID == cAbility.moveId).Type;
				break;
			case "Rainbow":
				cSymbol = "Begin";
				break;
			case "Light Blue":
				cSymbol = "Sync";
				break;
			default:
		}
		current["cSymbol"] = cSymbol;
		
		// 7) X - from abilitypaneljson[x].x
		current["cX"] = abilitypaneljson[i].x;

		// 8) Y - evaluate abilitypaneljson[x].y - abilitypaneljson[x].z
		current["cY"] = abilitypaneljson[i].y - abilitypaneljson[i].z;
		
		
		// ALL FIELDS DONE!
		// ==========================
		//compare with site checksum, if different, show.
		current.checksum = checksum(serialize(current));
		if(check[current["cGridID"]]) { 
			var cs = check[current["cGridID"]]; 
		}
		if(everything || current.checksum != cs ) {
			output.push(current); 
		}
		
		// 6/29/2021 Added population of Starting node when nodect is 49. Auto increment Nodect afterwards.
		if (nodect == 49) {
			current = {};
			current["cNum"] = nodect;
			current["cX"] = 0;
			current["cY"] = 0;
			current["cEnergy"] = 0;
			current["cSyncOrb"] = 0;
			current["cSymbol"] = "Begin";
			current["cColor"] = "Rainbow";
			current["cSyncPair"] = currSP;
			current["cGridID"] = currSP + "_" + nodect;
			current["cMonsterTrainerID"] = 

			nodect++;
		
			// ==========================
			// Repeat checksum test, if different, show.
			current.checksum = checksum(serialize(current));
			if(check[current["cGridID"]]) { 
				var cs = check[current["cGridID"]]; 
			}
			if(everything || current.checksum != cs ) {
				output.push(current); 
			}
		}
	}
	
	// Will want to remove all entries that have < 7 Sync Grid entries!
	// Also make sure NOT to remove entries from Trainers that already have grid data (so new edits / newly added nodes)
	
	// Get an array of just the sync pair names
	var pairnames = output.map(x => x.cSyncPair);
	
	// Get array of names already in database
	var databasenames = Object.keys(check);
	for (var j = 0; j < databasenames.length; j++) {
		databasenames[j] = databasenames[j].replace(/_.?.?.?/g,"");
	}
	
	//&& output[i].cGridID.replace(/.*?_/g,"") < 10
	var uniqnames = [...new Set(pairnames)];
	var remnames = [];
	for (var i = 0; i < uniqnames.length; i++ ){
		count = pairnames.reduce((n, x) => n + (x == uniqnames[i]), 0);
		if (count < 7 && databasenames.indexOf(uniqnames[i]) == -1) {
			remnames.push(uniqnames[i]);
		}
	}
	
	// Remove entries with less than 7 grid entries
	output = output.filter(x => !remnames.includes(x.cSyncPair));
	  
	  
	  
	  
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

stats = Math.floor( statsArray[low] + ( statsArray[high] - statsArray[low] )  * ( parseInt(currentLevel) - breakPoints[low] ) / ( breakPoints[high] - breakPoints[low] ) );


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