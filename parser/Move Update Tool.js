<table style="table-layout: fixed;"><tr><td>
<button onclick="myFunction()" class="featured-button" style="width: 100%">Update Me!</button></td><td>
<button onclick="showEverything()" class="featured-button" style="width: 100%">Show Everything</button></td></table>

<div id="demo">Loading....</div>


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script>


var content = [], apk = {}, dl = {}, check = {}, checkpass = {}, checkts = {};

var JSONcount = 0, JSONtotal = 11, everything = false;



$(document).ready(function(){
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/Move.json", function(data){
		content = data["entries"];
JSONcheck();
	});
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/TeamSkill.json", function(data){
		teamskill = data["entries"];
JSONcheck();
	});
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/TeamSkillCondition.json", function(data){
		teamskillcondition = data["entries"];
JSONcheck();
	});
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/TeamSkillEffect.json", function(data){
		teamskilleffect = data["entries"];
JSONcheck();
	});
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/TeamSkillGrowth.json", function(data){
		teamskillgrowth = data["entries"];
JSONcheck();
	});

	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/MoveAndPassiveSkillDigit.json", function(data){
		movepassivedigit = data["entries"];
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

	// The below no longer works as the latest update introduced bad JSON formatting, see above for fix.
	// $.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/lsd_dl.json", function(data){
		// data = data.responseText.replace(/\\\[/g,"[").replace(/\\\]/g,"]");
		// dl = data;
		// JSONcheck();
	// });

	$.getJSON("https://gamepress.gg/pokemonmasters/checksum-moves?_format=json", function(data){
		for(var i = 0; i < data.length; i++)
		{
		check[data[i]["field_mn"]] = data[i];
		}
		JSONcheck();
	});	

	$.getJSON("https://gamepress.gg/pokemonmasters/checksum-sync-moves?_format=json", function(data){
		for(var i = 0; i < data.length; i++)
		{
		check[data[i]["field_sync_move_id"]] = data[i];
		}
		JSONcheck();
	});	
	
	var currTime = new Date().getTime();
	
	$.getJSON("https://gamepress.gg/json-list?_format=json&game_tid=1021&" + currTime, function(data){
		for(var i = 0; i < data.length; i++){
			var curr = data[i];
			if(data[i].title == "Passive Skill Checksum"){
				$.getJSON(curr.url, function(data){
					for(var j = 0; j < data.length; j++)
					{
					checkpass[data[j]["field_passive_skill_id"]] = data[j];
					}
					JSONcheck();
				});
			}
		}
	});
	
	$.getJSON("https://gamepress.gg/pokemonmasters/checksum-teamskill?_format=json", function(data){
		for(var i = 0; i < data.length; i++)
		{
		checkts[data[i]["field_team_skill_id"]] = data[i];
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
	  
	var output = "Done! Open tabs to see further instructions.";
	
	// ================
	// Pokemon Moves / Sync Moves / Unity Moves
	// ================
	
	var pokemonMoves = [], syncMoves = [], unityMoves = [];
	
	for (var i = 0; i< content.length - 1; i++) {
	
	var current = {};
	
	current["MoveID"] = content[i]["MoveID"];
	current["Title"] = dl["move_name_en.lsd"][current["MoveID"]]

if( current["Title"] ) { current["Title"] = current["Title"].replace(/\n/g, ' '); }
else { current["Title"] = "Unknown Move " + current["MoveID"]; }



	current["Additional Effect"] = dl["move_description_en.lsd"][current["MoveID"]];
	
	// Added 2/24/2021 - Handling of Name:MoveDescriptionPartsIdTags!
	var etext = current["Additional Effect"];
	
	// 3/29/2022 Overhaul: Handling of Move Description Parts "Name:MoveDescriptionPartsIdTag Idx='######'"
	// 1) First piece together all individual MoveDescriptionPartsIdTag strings.
	// 2) Split by all occurrences of [...], and use MoveAndPassiveSkillDigit as needed to fill in each [] occurence as listed below:
	// 2a) [Digit:#digit ?Idx='#' ] -> Replace with an integer from MoveAndPassiveSkillDigit
	// 2b) [EN:Qty S='rank' P='ranks' ] -> if the preceding digit value is greater than one, use P, else use S
	// 2c) [Name:ReferencedMessageTag ?Idx='#' ] -> Replace with value from MoveAndPassiveSkillDigit, which references a string in dl["tag_name_with_prepositions_en.lsd"] 
	
	if (etext) {
	
		//  First split by the move part string, note will need to remove stuff "999991' ] ....." within each split
		var eparts = etext.split("[Name:MoveDescriptionPartsIdTag Idx='");
		
		// Only process further if there are actually parts that require processing! Length will be 1 if no [Name:MoveDescriptionParts are in the description.
		
		// 1) Piece together individual MoveDescriptionPartsIdTag strings.
		if (eparts.length > 1) {
			for (var el = 1; el < eparts.length; el++) {
				// Pull out the Idx number
				var epidx = eparts[el].replace(/' ].*/,"");
				
				// Replace with the actual description part
				etext = etext.replace("[Name:MoveDescriptionPartsIdTag Idx='" + epidx + "' ]",dl["move_description_parts_en.lsd"][epidx]);
			}
		}
		
		// 2) Split by [ occurrences
		var efrag = etext.split("[");
		
		// Only process further if there are [ occurrences! Three known kinds have been seen.
		if (efrag.length > 1) {
			// Pull out the movepassivedigit entry for this move.
			var digitentry = movepassivedigit.find(a => a.MoveID == current["MoveID"]);
			var digitvals = [];
			if (digitentry) {
				var dkeys = Object.keys(digitentry);
				for (var k = 1; k < dkeys.length; k++) {
					digitvals[k-1] = digitentry[dkeys[k]]; 
				}
			}
			// digitvals holds an array of the individual movepassivedigit values.
			
			var digitcount = 0; // Every time a MoveAndPassiveSkillDigit entry is used, increment.
			for (var ef = 1; ef < efrag.length; ef++) {
				// Process each fragment!
				var fragtype = efrag[ef].replace(/:.*/g,""); // Types: Name, Digit, EN
				var fragidx = efrag[ef].indexOf("Idx='") > -1 ? parseInt(efrag[ef].replace(/.*Idx='/,"").replace(/' ].*/,"")) : 0; // Pulls out the Idx number for the frag if it exists, else populate with "".
				var parval = digitvals[fragidx*2 + 1];
				var thisfrag = "[" + efrag[ef].replace(/ ].*/," ]");
				
				switch (fragtype) {
					case "Digit":
						etext = etext.replace(thisfrag,parval);
					break;
					
					case "EN":
						// EN: uses "Ref='#'" instead of "Idx='#'", so will redefine parval based on this value.
						var fragref = efrag[ef].indexOf("Ref='") > -1 ? parseInt(efrag[ef].replace(/.*Ref='/,"").replace(/' ].*/,"")) : 0;
						parval = parval = digitvals[fragref*2 + 1];
						// Get the singular and plural versions from string [EN:Qty S='rank' P='ranks' ]
						var ensingle = thisfrag.split("S='")[1].replace(/'.*/,"");
						var enplural = thisfrag.split("P='")[1].replace(/'.*/,"");
						var enout = parval > 1 ? enplural : ensingle;
						
						etext = etext.replace(thisfrag,enout);
					break;
					
					case "Name":
						etext = etext.replace(thisfrag,dl["tag_name_with_prepositions_en.lsd"][parval]);
					break;
					default:
					// Do nothing if not currently handled
					console.log("Unhandled Fragment Type: " + fragtype + "; Move ID: " + current["MoveID"]);
				}
			}
		}
	}
	
	// OLD CODE, DELETE IF IRRELEVANT
	// ===============================
	// var frag = "Name:MoveDescriptionPartsIdTag Idx";
	// if (etext) {
		// if (etext.indexOf(frag) > -1) {
			// while ( etext.indexOf(frag) > -1 ) {
				// mdId = etext.substring(etext.indexOf(frag)+36,etext.indexOf("'",etext.indexOf(frag)+36));
				// etext = etext.replace(mdId,dl["move_description_parts_en.lsd"][mdId]).replace("[Name:MoveDescriptionPartsIdTag Idx='","").replace("' ]","");
			// }
		// }
		// // Added 6/28/2021 - Handling of embedded [Digit] text
		// var df = "[Digit:";
		// if (etext.indexOf(df) > -1) {
			// digitentry = movepassivedigit.find(a => a.MoveID == current["MoveID"]);
			// digitsplit = etext.split(/(?=\[Digit)/g); // Splits array into occurrences of "[Digit" string, first string does not have one.
			// for (var di = 1; di < digitsplit.length; di++) {
				// // Get the parameter ref value, from [Digit:1digit Idx='1  <= the 1 is the parameter reference value
				// // 2/23/2022 - value changed to 2* Idx value instead of +1, exception for Sync Moves?
				// parval = (parseInt(digitsplit[di].substring(digitsplit[di].indexOf("Idx='")+5,digitsplit[di].indexOf("Idx='")+7))+1)*2;
				// if (!parval) { 
					// parval = 2; // Will be 2 if not otherwise specified
				// }
				// etext = etext.replace(/\[Digit:.digits? I?d?x?=?'?.\]?/,digitentry["Value" + parval]);
			// }
		// }
		// // Remove any instances of [EN:Qty Ref='2' S='rank' P='ranks ? \]?  or ' ?]?'
		// if (etext.indexOf("[EN:Qty") > -1) {
			// ensplit = etext.split(/(?=\[EN:)/g);
			// for (var ei = 1; ei < ensplit.length; ei++) {
				// // First get reference
				// refval = parseInt(ensplit[ei].substring(ensplit[ei].indexOf("y Ref='")+7,ensplit[ei].indexOf("y Ref='")+9))+1;
				// if (!refval) {
					// refval = 1;
				// }
				// // Get the S='TEXT' Text value
				// enqtytext = ensplit[ei].substring(ensplit[ei].indexOf("S=")+3,ensplit[ei].indexOf("'",ensplit[ei].indexOf("S=")+3));
				// if (digitentry["Value" + refval] > 1) {
					// enqtytext += "s";
				// }
				// etext = etext.replace(/\[EN:Qty ?R?e?f?=?'?.?'? ?S='....' P='....s/,enqtytext);
			// }
		// }
		// etext = etext.replace(/' ]/g,"");
	// }
	
	// END OLD CODE
	// ===============================
	// ===============================
	
	
    current["Additional Effect"] = etext;
	
	current["Move Category"] = content[i]["Category"];
	current["Move User"] = content[i]["User"];
	current["Type"] = content[i]["Type"];
if(current["Type"] == "NoType") { delete current["Type"]; }
	current["Move Target"] = content[i]["Target"];
	current["Move Cost"] = content[i]["Drain"];
	current["Accuracy"] = content[i]["Accuracy"];
	current["Move Uses"] = content[i]["Use"];
	
	var power = parseInt(content[i]["Power"]);
	
	current["PowerLv1"] = Math.floor(power);
	current["PowerLv2"] = Math.floor(power * 1.05);
	current["PowerLv3"] = Math.floor(power * 1.1);
	current["PowerLv4"] = Math.floor(power * 1.15);
	current["PowerLv5"] = Math.floor(power * 1.2);
	
	current["Move Tag ID"] = content[i]["Tag"];
	if(current["Move Tag ID"] == "none") { delete current["Move Tag ID"]; }
	
		current.checksum = checksum(serialize(current));
		if(check[current["MoveID"]]) { var cs = check[current["MoveID"]]["field_checksum"]; }
	if(check[current["MoveID"]]) { current.title = check[current["MoveID"]]["url"].replace(/"/g, "'"); }

		if(everything || current.checksum != cs ) {
			// Added Group == 6 as Buddy Moves
		if ( content[i]["Group"] == "Regular" || content[i]["Group"] == 5 || content[i]["Group"] == 6 ) {
			pokemonMoves.push(current);
		} else if ( content[i]["Group"] == "Unity" ) {
			unityMoves.push(current);
		} else if ( content[i]["Group"] == "Sync" ) {
			syncMoves.push(current);
		}
	}

	
	}
		 
	
	var pokemonMovesCSV = object2CSV(pokemonMoves);
	var syncMovesCSV = object2CSV(syncMoves);
	var unityMovesCSV = object2CSV(unityMoves);
	
	document.getElementById("regular").innerHTML = pokemonMovesCSV;
	document.getElementById("sync").innerHTML = syncMovesCSV;
	document.getElementById("unity").innerHTML = unityMovesCSV;

	
	// document.getElementById("regular").innerHTML = JSON.stringify(pokemonMoves);
	// document.getElementById("sync").innerHTML = JSON.stringify(syncMoves);
	// document.getElementById("unity").innerHTML = JSON.stringify(unityMoves);
	document.getElementById("demo").innerHTML = JSON.stringify(output);


	//Generate urls
	var urls = "<h3>Pokemon Moves<\/h3><table><tbody>";
	for (var i = 0; i < pokemonMoves.length; i++) {
		if(check[pokemonMoves[i]["MoveID"]]) { urls = urls + "<tr><td>" + check[pokemonMoves[i]["MoveID"]].url + "<\/td><\/tr>"; }
	}
	urls = urls + "<\/tbody><\/table>";
	var urls = urls +  "<h3>Sync Moves<\/h3><table><tbody>";
	for (var i = 0; i < syncMoves.length; i++) {
		if(check[syncMoves[i]["MoveID"]]) { urls = urls + "<tr><td>" + check[syncMoves[i]["MoveID"]].url + "<\/td><\/tr>"; }
	}
	urls = urls + "<\/tbody><\/table>";
	var urls = urls +  "<h3>Unity Moves<\/h3><table><tbody>";
	for (var i = 0; i < unityMoves.length; i++) {
		if(check[unityMoves[i]["MoveID"]]) { urls = urls + "<tr><td>" + check[unityMoves[i]["MoveID"]].url + "<\/td><\/tr>"; }
	}
	urls = urls + "<\/tbody><\/table>";

	document.getElementById("urls").innerHTML = urls;
	
	// END OF MOVES
	
	// ===============
	// Passive Skills
	// ============
	
	var passiveSkills = [];
	
	var allpassids = Object.keys(dl["passive_skill_name_en.lsd"]);
	
	for (var i = 0; i < allpassids.length; i++ ) {
		current = {};
		
		currpass = allpassids[i];
		
		if ( currpass !== "_end" ) {
		
			current["PassiveID"] = currpass;
			// 6/28/2021 Passive Name reference has been updated!
			pname = dl["passive_skill_name_en.lsd"][currpass];
			if (pname) {
				if (pname.indexOf("[Name:PassiveSkillNameParts Idx='") > -1){
					// Some passives have [Name:PassiveSkillNameParts Idx="######"] as a reference to the name
					psplit = pname.split(/(?=\[Name:PassiveSkillNameParts)/g);
					for (pi = 0; pi < psplit.length; pi++) {
						pIdx = psplit[pi].substring(psplit[pi].indexOf("'")+1,psplit[pi].indexOf("'",psplit[pi].indexOf("'")+1));
						temppart = dl["passive_skill_name_parts_en.lsd"][pIdx];
						pisplit = temppart.split(/(?=\[Name:PassiveSkillNameDigit)/g);
						// Need to replace the instances of [Name:PassiveSkillNameDigit] as well
						for (pii = 0; pii < pisplit.length; pii++) {
							temppart = temppart.replace(/\[Name:PassiveSkillNameDigit ?\]/,parseInt(currpass) - parseInt(pIdx));
						}
						pname = temppart;
					}
				}
			}
			current["PassiveName"] = pname;
			
			// 6/28/2021 Additional update for Passive Description as well
			ptext = dl["passive_skill_description_en.lsd"][currpass];
			if (ptext){
				
				// 3/29/2022 Overhaul: Handling of Passive Description Parts "Name:PassiveSkillDescriptionPartsIdTag Idx='######'"
				// 1) First piece together all individual PassiveSkillDescriptionPartsIdTag strings.
				// 2) Split by all occurrences of [...], and use MoveAndPassiveSkillDigit as needed to fill in each [] occurence as listed below:
				// 2a) [Digit:#digit ?Idx='#' ] -> Replace with an integer from MoveAndPassiveSkillDigit
				// 2b) [EN:Qty S='rank' P='ranks' ] -> if the preceding digit value is greater than one, use P, else use S
				// 2c) [Name:ReferencedMessageTag ?Idx='#' ] -> Replace with value from MoveAndPassiveSkillDigit, which references a string in dl["tag_name_with_prepositions_en.lsd"] 
			
				//  First split by the move part string, note will need to remove stuff "999991' ] ....." within each split
				var pparts = ptext.split("[Name:PassiveSkillDescriptionPartsIdTag Idx='");
				
				// 1) Piece together individual MoveDescriptionPartsIdTag strings.
				if (pparts.length > 1) {
					for (var el = 1; el < pparts.length; el++) {
						// Pull out the Idx number
						var epidx = pparts[el].replace(/' ].*/,"");
						
						// Replace with the actual description part
						ptext = ptext.replace("[Name:PassiveSkillDescriptionPartsIdTag Idx='" + epidx + "' ]",dl["passive_skill_description_parts_en.lsd"][epidx]);
					}
				}
				
				// 2) Split by [ occurrences
				var pfrag = ptext.split("[");
				
				// Only process further if there are [ occurrences! Three known kinds have been seen.
				if (pfrag.length > 1) {
					// Pull out the movepassivedigit entry for this move.
					var digitentry = movepassivedigit.find(a => a.MoveID == currpass);
					var digitvals = [];
					if (digitentry) {
						var dkeys = Object.keys(digitentry);
						for (var k = 1; k < dkeys.length; k++) {
							digitvals[k-1] = digitentry[dkeys[k]]; 
						}
					}
					// digitvals holds an array of the individual movepassivedigit values.
					
					var digitcount = 0; // Every time a MoveAndPassiveSkillDigit entry is used, increment.
					for (var ef = 1; ef < pfrag.length; ef++) {
						// Process each fragment!
						var fragtype = pfrag[ef].replace(/:.*/g,""); // Types: Name, Digit, EN
						var fragidx = pfrag[ef].indexOf("Idx='") > -1 ? parseInt(pfrag[ef].replace(/.*Idx='/,"").replace(/' ].*/,"")) : 0; // Pulls out the Idx number for the frag if it exists, else populate with "".
						var parval = digitvals[fragidx*2 + 1];
						var thisfrag = "[" + pfrag[ef].replace(/ ].*/," ]");
						
						switch (fragtype) {
							case "Digit":
								ptext = ptext.replace(thisfrag,parval);
							break;
							
							case "EN":
								// EN: uses "Ref='#'" instead of "Idx='#'", so will redefine parval based on this value.
								var fragref = pfrag[ef].indexOf("Ref='") > -1 ? parseInt(pfrag[ef].replace(/.*Ref='/,"").replace(/' ].*/,"")) : 0;
								parval = parval = digitvals[fragref*2 + 1];
								// Get the singular and plural versions from string [EN:Qty S='rank' P='ranks' ]
								var ensingle = thisfrag.split("S='")[1].replace(/'.*/,"");
								var enplural = thisfrag.split("P='")[1].replace(/'.*/,"");
								var enout = parval > 1 ? enplural : ensingle;
								
								ptext = ptext.replace(thisfrag,enout);
							break;
							
							case "Name":
								ptext = ptext.replace(thisfrag,dl["tag_name_with_prepositions_en.lsd"][parval]);
							break;
							default:
							// Do nothing if not currently handled
							console.log("Unhandled Fragment Type: " + fragtype + "; Move ID: " + current["MoveID"]);
						}
					}
				}
				
				// OLD CODE, DELETE IF IRRELEVANT
				// ===============================
				// if (ptext.indexOf("[Name:PassiveSkillDescriptionPartsIdTag") > -1){
					// psplit = ptext.split(/(?=\[Name:PassiveSkillDescriptionPartsIdTag)/g);
					// for (pi = 0; pi < psplit.length; pi++) {
						// pIdx = psplit[pi].substring(psplit[pi].indexOf("'")+1,psplit[pi].indexOf("'",psplit[pi].indexOf("'")+1));
						// temppart = dl["passive_skill_description_parts_en.lsd"][pIdx];
						// //pisplit = temppart.split(/(?=\[Name:
						// //for (pii = 0; pii
						// ptext = ptext.replace(psplit[pi].trim(),temppart);
					// }
				// }
				// // Added 3/15/2022 - Handling of embedded [Name:ReferencedMessageTag Idx='2' ] text
				// var df = "[Name:ReferencedMessageTag";
				// if (ptext.indexOf(df) > -1) {
					// digitentry = movepassivedigit.find(a => a.MoveID == currpass);
					// digitsplit = ptext.split(/(?=\[Name:ReferencedMessageTag)/g); // Splits for [Name:ReferencedMessageTag string
					// for (var di = 1; di < digitsplit.length; di++) {
						// parval = (parseInt(digitsplit[di].substring(digitsplit[di].indexOf("Idx='")+5,digitsplit[di].indexOf("Idx='")+7))+1)*2;
						// if (!parval) {
							// parval = 2;
						// }
						// var replaceText = "";
						// replaceText = dl["tag_name_with_prepositions_en.lsd"][digitentry["Value" + parval]];
						// ptext = ptext.replace(/\[Name:ReferencedMessageTag I?d?x?=?'?.\]?/,replaceText);
					// }
				// }
				
				// // Added 6/28/2021 - Handling of embedded [Digit] text
				// var df = "[Digit:";
				// if (ptext.indexOf(df) > -1) {
					// digitentry = movepassivedigit.find(a => a.MoveID == currpass);
					// digitsplit = ptext.split(/(?=\[Digit)/g); // Splits array into occurrences of "[Digit" string, first string does not have one.
					// for (var di = 1; di < digitsplit.length; di++) {
						// // Get the parameter ref value, from [Digit:1digit Idx='1  <= the 1 is the parameter reference value
						// parval = (parseInt(digitsplit[di].substring(digitsplit[di].indexOf("Idx='")+5,digitsplit[di].indexOf("Idx='")+7))+1)*2;
						// if (!parval) { 
							// parval = 2; // Will be 2 if not otherwise specified
						// }
						// var replaceText = digitentry["Value" + parval];
						// // !!!!!!!!!!!! Really bad fix: For currpass==28010801, parval == 12 for Kalos Flag Bearer final digit
						// if (currpass == "28010801" && parval == 12) {
							// replaceText = 26;
						// }
						
						// ptext = ptext.replace(/\[Digit:.digits? I?d?x?=?'?.\]?/,replaceText);
						
					// }
				// }
				// // Remove any instances of [EN:Qty Ref='2' S='rank' P='ranks ? \]?  or ' ?]?'
				// if (ptext.indexOf("[EN:Qty") > -1) {
					// ensplit = ptext.split(/(?=\[EN:)/g);
					// for (var ei = 1; ei < ensplit.length; ei++) {
						// // First get reference
						// refval = parseInt(ensplit[ei].substring(ensplit[ei].indexOf("y Ref='")+7,ensplit[ei].indexOf("y Ref='")+9))+1;
						// if (!refval) {
							// refval = 1;
						// }
						// // Get the S='TEXT' Text value
						// enqtytext = ensplit[ei].substring(ensplit[ei].indexOf("S=")+3,ensplit[ei].indexOf("'",ensplit[ei].indexOf("S=")+3));
						// if (digitentry["Value" + refval] > 1) {
							// enqtytext += "s";
						// }
						// ptext = ptext.replace(/\[EN:Qty ?R?e?f?=?'?.?'? ?S='....' P='....s/,enqtytext);
					// }
				// }
				// ptext = ptext.replace(/' ]/g,"");
				// END OLD CODE
				// ===============================
				// ===============================
			
			}
			current["PassiveDescript"] = ptext;
			
			current.checksum = checksum(serialize(current));
			
			var cs = "";
			if (checkpass[current["PassiveID"]]) {
				cs = checkpass[current["PassiveID"]]["field_checksum"];
			}
			
			// Populate output
			if(everything || current.checksum != cs ) {
				passiveSkills.push(current);
			}
		}
	}
	
	// Display final results
	var passiveSkillsCSV = object2CSV(passiveSkills);
	document.getElementById("passive").innerHTML = passiveSkillsCSV;

	// END OF MOVES
	
	// ===============
	// Team Skills
	// ============
	
	var teamSkills = [];
	
	var allteamskillids = Object.keys(dl["team_skill_name_en.lsd"]);
	
	for (var i = 0; i < allteamskillids.length; i++) {
		current = {};
		
		currts = allteamskillids[i];
		
		if ( currts !== "_end" ) {
			
			current["TeamSkillID"] = currts;
			current["TeamSkillName"] = dl["team_skill_name_en.lsd"][currts];
			
			// -----
			// Get Team Skill condition
			// -----
			// Condition is in teamskillcondition object
			var condentry = teamskillcondition.filter(obj => { return obj.teamskillId === parseInt(currts) });
			current["TeamSkillCondition"] = dl["team_skill_condition_en.lsd"][condentry[0].teamskillconditionId];
			
			// -----
			// Get Team Skill Effect
			// -----
			// Output value as "Increase STAT for TARGET by [Value].<br>- Lv1: +##<br>- Lv2: +##<br>- Lv3: +##<br>- ETC
			
			// Effect is in teamskilleffect object; NOTE can have more than one effect!
			var effectentry = teamskilleffect.filter(obj => { return obj.teamskillId === parseInt(currts) });
			
			tempeffect = "";
			
			for (var ee = 0; ee < effectentry.length; ee++) {
				// Add a delimiter for a second effect.
				if (ee > 0) { tempeffect += "&lt;br&gt;&lt;br&gt;"; }
				
				effectid = effectentry[ee].teamskilleffectId;
				growthid = effectentry[ee].u4;
				
				// Write effect main info
				tempeffect += dl["team_skill_effect_en.lsd"][effectid];
				
				// Get all values for each growth level, up to 4 levels per atm.
				growthentry = teamskillgrowth.filter( obj => {return obj.teamskillGrowthid === growthid });
				
				// Put in a "- Lv1: +##" for each value of each level for the Team Skill and a <br> beforehand.
				for (var elv = 0; elv < growthentry.length; elv++) {
					tempeffect += "&lt;br&gt;- Lv" + growthentry[elv].teamskillLv + ": +" + growthentry[elv].teamskillValue;
				}
				
				tempeffect = tempeffect.replace(/\[(.+?)\]/g,"[Value]"); // Replace everything between [...] with [Value]
			}
			
			current["TeamSkillEffect"] = tempeffect;
			
			// -----
			// Get Team Skill Tag
			// -----
			
			var tagentry = teamskill.filter(obj => { return obj.teamskillId === parseInt(currts) });
			current["TeamSkillTag"] = dl["team_skill_tag_en.lsd"][tagentry[0].teamskillTag];
			
			// Checksum
			
			current.checksum = checksum(serialize(current));
			
			var cs = "";
			if (checkts[current["TeamSkillID"]]) {
				cs = checkts[current["TeamSkillID"]]["field_checksum"];
			}
			
			// Populate output
			if(everything || current.checksum != cs ) {
				teamSkills.push(current);
			}
			
		}
	}
	
	// Display final results
	var teamSkillsCSV = object2CSV(teamSkills);
	document.getElementById("teamskill").innerHTML = teamSkillsCSV;
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


	
	

function checksum(s)
{
  var chk = 0x12345678;
  var len = s.length;
  for (var i = 0; i < len; i++) {
      chk += (s.charCodeAt(i) * (i + 1));
  }

  return (chk & 0xffffffff).toString(16);
}

//converts Javscript Object to CSV
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
	
	for (var i = 0; i < output.length; i++){
		if (i == 0) {
			tdisp = tdisp + output[0] + "<br>";
		}
		else {
			tdisp = tdisp + output[i];
		}
	}
	return tdisp;
}


</script>
