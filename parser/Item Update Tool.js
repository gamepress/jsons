<div id="demo">Loading....</div>
<hr>
<div id="output"></div>

<script src="https://cdn.rawgit.com/dcodeIO/protobuf.js/6.8.8/dist/protobuf.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script>


var content = [];

var apk = {}, dl = {}, param = {}, check = {};

var DeckItem = {}, DeckItemLvUpItem = {}, OtherItem = {}, TrainingItem = {}, EventExchangeItem = {}, BreakThroughItem = {}, BadgeItem = {}, VillaItem = {}, PotentialItem = {}, MoveLevelUpItem = {}, TreatItem = {};

var JSONcount = 0, JSONtotal = 13, everything = false;


$(document).ready(function(){
	
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
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/DeckItem.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		DeckItem[data["entries"][i]["itemId"]] = data["entries"][i];
		}
		JSONcheck();
	});	

	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/DeckItemLvUpItem.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		DeckItemLvUpItem[data["entries"][i]["itemId"]] = data["entries"][i];
		}
		JSONcheck();
	});	

	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/OtherItem.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		OtherItem[data["entries"][i]["itemId"]] = data["entries"][i];
		}
		JSONcheck();
	});	

	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/TrainingItem.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		TrainingItem[data["entries"][i]["itemId"]] = data["entries"][i];
		}
		JSONcheck();
	});	
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/EventExchangeItem.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		EventExchangeItem[data["entries"][i]["itemId"]] = data["entries"][i];
		}
		JSONcheck();
	});	
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/BreakThroughItem.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		BreakThroughItem[data["entries"][i]["itemId"]] = data["entries"][i];
		}
		JSONcheck();
	});	
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/BadgeItem.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		BadgeItem[data["entries"][i]["itemId"]] = data["entries"][i];
		}
		JSONcheck();
	});	
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/VillaItem.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		VillaItem[data["entries"][i]["itemId"]] = data["entries"][i];
		}
		JSONcheck();
	});	
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/PotentialItem.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		PotentialItem[data["entries"][i]["itemId"]] = data["entries"][i];
		}
		JSONcheck();
	});	
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/MoveLevelUpItem.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		MoveLevelUpItem[data["entries"][i]["itemId"]] = data["entries"][i];
		}
		JSONcheck();
	});	
	
	$.getJSON("https://raw.githubusercontent.com/gamepress/jsons/master/pm/TreatItem.json", function(data){
		for(var i = 0; i < data["entries"].length - 1; i++)
		{
		TreatItem[data["entries"][i]["itemId"]] = data["entries"][i];
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

var content = {};
   
function myFunction() {
	  
	var output = {};

	getItem(DeckItem, "deck_item_name_en.lsd", "deck_item_description_en.lsd", "Gears");
	getItem(DeckItemLvUpItem, "deck_item_lvup_item_name_en.lsd", "deck_item_lvup_item_description_en.lsd", "Gear Level-Up Item");
	getItem(OtherItem, "other_item_name_en.lsd", "other_item_description_en.lsd", "Gems");
	getItem(TrainingItem, "training_item_name_en.lsd", "training_item_description_en.lsd", "Trainer Build Up Item");
	getItem(EventExchangeItem, "event_item_name_en.lsd", "event_item_description_en.lsd", "Exchange Item");
	getItem(BreakThroughItem, "breakthrough_item_name_en.lsd", "breakthrough_item_description_en.lsd", "Breakthrough Item");
	getItem(BadgeItem, "bardge_item_name_en.lsd", "breakthrough_item_description_en.lsd", "Badge");
	getItem(VillaItem, "villa_item_name_en.lsd", "villa_item_description_en.lsd", "Battle Villa");
	getItem(PotentialItem, "potential_item_name_en.lsd", "potential_item_description_en.lsd", "Potential");
	getItem(MoveLevelUpItem, "move_levelup_item_name_en.lsd", "move_levelup_item_description_en.lsd", "Move Level Up Item");
	getItem(TreatItem, "treat_item_name_en.lsd", "treat_item_description_en.lsd", "Treat");
	

	
	
	for(x in content) {
		
	if( !(check[x]) || everything ) { output[x] = content[x]; } }

	
	  
	  var demo = "Done! Showing just the latest changes. Click Show Everything to show all data!";
	document.getElementById("demo").innerHTML = demo;

	generateTable(object2Array(output));


}

//converts Javscript Object to CSV
function object2Array(input) {
	
	var headers = [];
	var output = [headers];

	for( x in input) {
	
	var current = [];
		
		for( y in input[x]) {
		
		//initiate the array by filling in the first row and headers	
		if( output.length == 1) {
			headers.push(y);
			current.push(input[x][y]);
		}
		
		else {
			
			//if cna'tr find column header, add new column for it
			if( headers.indexOf(y) == -1 ) { 	headers.push(y); 		}
			
			//fill in data
			current[headers.indexOf(y)] = input[x][y]; 
		}
		}
		
		output.push(current);
	}
	
	
	return output;
}



function getItem(items, nameLSD, descriptionLSD, itemType) {

	for(x in items) {
		if(!content[x]) { content[x] = {}; }
		
		content[x] = items[x];
		content[x].itemType = itemType;
		content[x].itemName = dl[nameLSD][items[x].itemId];
		
		// IF the type of item is a MoveLevelUpItem, then the name is stored differently.
		
		switch (nameLSD) {
			case "move_levelup_item_name_en.lsd":
				var tempid = parseInt(items[x].itemId) - 570000000000 + 1;
				content[x].itemName = dl[nameLSD][tempid];
				break;
			default:
		}
		
		
		// Apparently, u5 stores the value
		var tempdesc = dl[descriptionLSD][items[x].descriptionId];
		if (tempdesc) {
			if (tempdesc.indexOf("[Digit:3digits ]") > -1) {
				tempdesc = tempdesc.replace(/\[Digit:3digits \]/g,items[x].u5)
			}
		}
		content[x].itemDescription = tempdesc;
		
		
	}
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

	
function generateTable(input) {
	var text = "";
	
	for(var j = 0; j < input.length; j++) {
		text += '"' + input[j].join('","') + '"<br>';
	}


	document.getElementById("demo").innerHTML = text;
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