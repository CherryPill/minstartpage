var state = {
	settingsWindowOpen: false,
	currentTab: 0,
	colorAutoDetectOn: false,
};

var searchEngines = {
	engineOptions: new Array("Google", "Bing", "Yahoo"),
	engineLinks: new Array("https://www.google.by/search",
					"https://www.bing.com/search",
					"https://search.yahoo.com/search",
)
};
//bk and fg
var webAppColors = {
	vk: ["#45688E", "#FFFFFF"],
	fb: ["#3C5A99", "#FFFFFF"],
	ig: ["#E1306C", "#FFFFFF"],
	tg: ["#0088cc", "#FFFFFF"],
	sc: ["color", "color"],
	ggl: ["color", "color"],
	yh: ["#410093", "#FFFFFF"],
	at: ["color", "color"],
	mal: ["color", "color"],
	rdt: ["color", "color"],
	wp: ["color", "color"],
	yt: ["color", "color"],
	bd: ["color", "color"],
	az: ["color", "color"],
	tw: ["color", "color"],
};
//twitch, netflix, mail.ru, ph, xv, imdb, ebay, linkedin,
var webAppShortNames = {
	vk: "vk",
	fb: "fb",
	ig: "ig",
	tg: "tg",
	sc: "sc",
	ggl: "gl",
	yh: "yh",
	at: "at",
	mal: "ml",
	rdt: "rd",
	wp: "wp",
	yt: "yt",
	bd: "bd",
	az: "az",
	tw: "tw",
};

function generateSearchEngineOptions(){
	let htmlElement = document.getElementById("searchOptions");
	for(i = 0; i<searchEngines.engineOptions.length; i++){
		htmlElement.options[htmlElement.options.length] = new Option(
			searchEngines.engineOptions[i]+" Search",searchEngines.engineOptions[i]);
	}
	htmlElement.options.selectedIndex = 0;
	htmlElement.addEventListener("change", setSearchLink);
}

function setSearchLink(){
	let htmlElementOptions = document.getElementById("searchOptions");
	let htmlElementFormLink = document.getElementById("searchForm");
	htmlElementFormLink.setAttribute("action", searchEngines.engineLinks[htmlElementOptions.options.selectedIndex]);
}

function initStartPage(){
	generateSearchEngineOptions();
	initTimeScript();
	addTileContextMenuTest();
	prepareUI(userData);
	addEventListeners();
}

function toggleSettingsMenu(){
	let parent = document.getElementById("docBody");
	if(state.settingsWindowOpen){
		let settingsWindow = document.getElementById("settingsWindow");
		parent.removeChild(settingsWindow);
	}
	else{
		let settingsWindow = document.createElement("div");
		settingsWindow.id = "settingsWindow";
		var settingsWindowContents = createSettingsContents(settingsWindow);
		parent.appendChild(settingsWindow);
	}
	state.settingsWindowOpen = !state.settingsWindowOpen;
}

function createSettingsContents(parent){
	let settingsWindowTitle = document.createElement("h3");
	settingsWindowTitle.id = "settingsWindowTitle";
	settingsWindowTitle.innerHTML = "Settings";
	parent.appendChild(settingsWindowTitle);

}
function addTileContextMenuTest(){
	let vkTile = document.getElementById("hurr");
	vkTile.addEventListener("contextmenu", function(e){
		e.preventDefault();
		generateContextMenu(vkTile.id);
		alert("context menu here");
		return false;
	}, false);
}

//example user data
var userData = {
	sections: [
		{sectionName: "NEWS",
		sectionItems: [{sectionItemName: "stackoverflow",
									sectionItemNameShort: "so",
									sectionItemUrl: "stackoverflow.com",
								  sectionItemColors: ["#000", "#FF8C00"]},{
										sectionItemName: "myanimelist",
																	sectionItemNameShort: "ma",
																	sectionItemUrl: "myanimelist.net",
																	sectionItemColors: ["white", "blue"]
									}]},
									{sectionName: "WORK",
									sectionItems: [{sectionItemName: "stackoverflow",
																sectionItemNameShort: "so",
																sectionItemUrl: "stackoverflow.com",
															 sectionItemColors: ["#fff", "#000"] },{
																	sectionItemName: "tutby",
																								sectionItemNameShort: "tu",
																								sectionItemUrl: "tut.by",
																								sectionItemColors: ["#fff", "#000"]
																}]},
																{sectionName: "SOCIAL",
																sectionItems: [{sectionItemName: "vkontakte",
																							sectionItemNameShort: "vk",
																							sectionItemUrl: "vkontakte.com",
																						sectionItemColors: ["#fff", "#000"] },{
																								sectionItemName: "facebook",
																															sectionItemNameShort: "fb",
																															sectionItemUrl: "facebook.com",
																															sectionItemColors: ["#fff", "#000"]
																							}]},
		],
};



function prepareUI(userData){
	for(section of userData.sections){
		createSection(section);
	}
}

function createSection(sectionItemObj){

	let mainArea = document.getElementById("mainArea");
	let mainAreaRow = document.createElement("div");
	mainAreaRow.className = "b";
	let sectionHeaderRow = document.createElement("div");
	sectionHeaderRow.className = "sectionHeaderRow";
	let sectionHeaderName = document.createElement("div");
	sectionHeaderName.className = "sectionHeaderName";
	sectionHeaderName.innerHTML = sectionItemObj.sectionName;
	let sectionHeaderManagement = document.createElement("div");
	sectionHeaderManagement.className = "sectionHeaderManagement";
	let sectionHeaderManagementEdit = document.createElement("div");
	sectionHeaderManagementEdit.className = "sectionHeaderManagementEdit";
	let sectionHeaderManagementEditAnchor = document.createElement("a");
	sectionHeaderManagementEditAnchor.innerHTML = "e";
	let sectionHeaderManagementRem = document.createElement("div");
	sectionHeaderManagementRem.className = "sectionHeaderManagementRem";
	let sectionHeaderManagementRemAnchor = document.createElement("a");
	sectionHeaderManagementRemAnchor.innerHTML = "r";

	let linkTilesSection = document.createElement("div");
	linkTilesSection.className = "linkTilesSection";
	for(sectionItem of section.sectionItems){
		let linkTileAnchor = document.createElement("a");
		linkTileAnchor.setAttribute("href", sectionItem.sectionItemUrl);
		linkTileAnchor.setAttribute("target", "_blank");
		let linkTileAnchorInnerDiv = document.createElement("div");
		linkTileAnchorInnerDiv.style.color = sectionItem.sectionItemColors[0];
		linkTileAnchorInnerDiv.style.backgroundColor = sectionItem.sectionItemColors[1];
		linkTileAnchorInnerDiv.className = "linkTile";
		linkTileAnchorInnerDiv.innerHTML = sectionItem.sectionItemNameShort;
		linkTileAnchor.appendChild(linkTileAnchorInnerDiv);
		linkTilesSection.appendChild(linkTileAnchor);
	}
	let linkTileAnchorAddNew = document.createElement("a");
	linkTileAnchorAddNew.setAttribute("href","#");
	let linkTileAnchorAddNewInnerDiv = document.createElement("div");
	linkTileAnchorAddNewInnerDiv.className = "linkTile addNew";
	linkTileAnchorAddNewInnerDiv.style.color = "black";
	linkTileAnchorAddNewInnerDiv.style.backgroundColor = "white";
	linkTileAnchorAddNew.appendChild(linkTileAnchorAddNewInnerDiv);
	linkTilesSection.appendChild(linkTileAnchorAddNew);
	sectionHeaderManagementEdit.appendChild(sectionHeaderManagementEditAnchor);
	sectionHeaderManagementRem.appendChild(sectionHeaderManagementRemAnchor);
	sectionHeaderManagement.appendChild(sectionHeaderManagementEdit);
	sectionHeaderManagement.appendChild(sectionHeaderManagementRem);
	sectionHeaderRow.appendChild(sectionHeaderName);
	sectionHeaderRow.appendChild(sectionHeaderManagement);
	mainAreaRow.appendChild(sectionHeaderRow);
	mainAreaRow.appendChild(linkTilesSection);
	mainArea.appendChild(mainAreaRow);
}

function toggleColorLock(_state_){
	let colorInputs = document.getElementsByClassName("colorPickerInput");
	let colorInputLabels = document.getElementsByClassName("colorPickerInputLabel");
	console.log(colorInputLabels);
	let labelColor, labelBkColor;
	if(_state_){
		labelBkColor = "#fff";
	}
	else{
		labelBkColor = "#ccc";

	}
	for(cil of colorInputLabels){
		cil.style.backgroundColor = labelBkColor;
	}
	for(ci of colorInputs){
		ci.disabled = !_state_;
	}
}

function addEventListeners(){
	let s = document.getElementById("colorAutoID");
	s.addEventListener("click", function(){
				toggleColorLock(state.colorAutoDetectOn)
		state.colorAutoDetectOn = !state.colorAutoDetectOn;
	});
	//let section = document.getElementById()
}

function generateContextMenu(id){

}

function autoSetColor(url){

}
