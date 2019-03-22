var state = {
	settingsWindowOpen: false,
	currentTab: 0,
	colorAutoDetectOn: false,
	overlayElement: document.getElementById("overlay"),
	toggleOverLay: function(val){
		this.overlayElement.style.visibility = val ? "visible":"hidden";
		console.log(this.overlayElement.style.visibility);
	}
};

var internalTilesSet = new Set();

var modalDialogs = {

};

function fillTilesSet(userData){
	for(section of userData.sections){
		internalTilesSet.add(section);
	}
	updateUI(internalTilesSet);
}

//updates UI reflecting tiles data structure changes


function initSysVars(){
	let _viewPortWidth = document.documentElement.clientWidth;
	let _viewPortHeight = document.documentElement.clientHeight;
	return{
		getViewPortWidth(){
			return _viewPortWidth;
		},
		getViewPortHeight(){
			return _viewPortHeight;
		},
	};
}
const _sysVars = initSysVars();
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
	//addTileContextMenuTest();
	fillTilesSet(userData);
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
/*
function addTileContextMenuTest(){
	let vkTile = document.getElementById("hurr");
	vkTile.addEventListener("contextmenu", function(e){
		e.preventDefault();
		generateContextMenu(vkTile.id);
		alert("context menu here");
		return false;
	}, false);
}
*/

//example user data
var userData = {
	sections: [
		{sectionName: "NEWS",
		sectionId: 1,
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
									sectionId: 2,
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
																sectionId: 3,
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



function updateUI(sectionSet){
	for(section of sectionSet){
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
	let sectionHeaderManagementEnclosure = document.createElement("div");
	sectionHeaderManagementEnclosure.className = "sectionHeaderManagementEnclosure";
	let sectionHeaderManagement = document.createElement("div");
	sectionHeaderManagement.className = "sectionHeaderManagement";
	let sectionHeaderManagementEdit = document.createElement("div");
	sectionHeaderManagementEdit.className = "sectionHeaderManagementEdit";
	let sectionHeaderManagementEditAnchor = document.createElement("img");
	sectionHeaderManagementEditAnchor.setAttribute("src", "img/edit.png");
	let sectionHeaderManagementRem = document.createElement("div");
	sectionHeaderManagementRem.className = "sectionHeaderManagementRem";
	let sectionHeaderManagementRemAnchor = document.createElement("img");
	sectionHeaderManagementRemAnchor.setAttribute("src", "img/delete.png");

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
		linkTileAnchorInnerDiv.setAttribute("sectionId", sectionItemObj.sectionId);
		linkTileAnchorInnerDiv.setAttribute("tileId", 100);
		linkTileAnchor.appendChild(linkTileAnchorInnerDiv);
		linkTilesSection.appendChild(linkTileAnchor);
	}

	let linkTileAnchorAddNew = generateAnchor("#");
	let linkTileAnchorAddNewInnerDiv = document.createElement("div");
	linkTileAnchorAddNewInnerDiv.className = "linkTile addNew";
	linkTileAnchorAddNewInnerDiv.setAttribute("sectionId", sectionItemObj.sectionId);
	linkTileAnchorAddNewInnerDiv.setAttribute("tileId", null);

	linkTileAnchorAddNewInnerDiv.style.color = "black";
	linkTileAnchorAddNewInnerDiv.style.backgroundColor = "white";
	linkTileAnchorAddNew.appendChild(linkTileAnchorAddNewInnerDiv);
	linkTilesSection.appendChild(linkTileAnchorAddNew);
	sectionHeaderManagementEdit.appendChild(sectionHeaderManagementEditAnchor);
	sectionHeaderManagementRem.appendChild(sectionHeaderManagementRemAnchor);
	sectionHeaderManagement.appendChild(sectionHeaderManagementEdit);
	sectionHeaderManagement.appendChild(sectionHeaderManagementRem);
	sectionHeaderManagementEnclosure.appendChild(sectionHeaderManagement);
	sectionHeaderRow.appendChild(sectionHeaderName);
	sectionHeaderRow.appendChild(sectionHeaderManagementEnclosure);
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

	let a = document.getElementsByClassName("addNew");
	for(e of a){
		e.addEventListener("click", function(){
			generateAddEditTileWindow(e.getAttribute("sectionid"), e.getAttribute("tileid"))
		});
	}
	state.overlayElement.addEventListener("click", function(){state.toggleOverLay(false)});
	/*
	let s = document.getElementById("colorAutoID");
	s.addEventListener("click", function(){
				toggleColorLock(state.colorAutoDetectOn)
		state.colorAutoDetectOn = !state.colorAutoDetectOn;
	});*/
}

function generateContextMenu(id){

}

function generateAddEditTileWindow(sectionId, tileId){
	if(tileId == "null"){
		let tileEditWindow = document.createElement("div");
		tileEditWindow.className = "tileEditWindow";
		let header = document.createElement("div");
		header.innerHTML = "Add new tile";
		let formRowUrl = document.createElement("div");
		formRowUrl.className = "form-row";
		let formRowUrlLabel = document.createElement("label");
		formRowUrlLabel.innerHTML = "url:"
		let formRowUrlInput = document.createElement("input");
		formRowUrlInput.setAttribute("type", "text");
		formRowUrlInput.setAttribute("name", "url");

		let formRowName = document.createElement("div");
		formRowUrl.className = "form-row";
		let formRowNameLabel = document.createElement("label");
		formRowNameLabel.innerHTML = "name:"
		let formRowNameInput = document.createElement("input");
		formRowNameInput.setAttribute("type", "text");
		formRowNameInput.setAttribute("name", "name");


		let iconCustomizationSection = document.createElement("div");
		iconCustomizationSection.className = "iconCustomizationSection";
		let linkTilesSectionIconPreview = document.createElement("div");
		linkTilesSectionIconPreview.className = "linkTilesSection iconPreview";
		let linkTilesSectionIconPreviewInnerDiv = document.createElement("div");
		linkTilesSectionIconPreviewInnerDiv.innerHTML = "Preview";
		let fullTitleAnchor = generateAnchor("https://vk.com/feed");
		let linkTileEditMode = generateDiv("linkTile editMode", "", "hurr");
		let colorPickerSection = generateDiv("colorPickerSection","","");
		let colorAutodetect = generateDiv("color-autodetect", "", "")
		let colorAutodetectLabel = document.createElement("label");
		colorAutodetectLabel.setAttribute("for","colorAutoID");
		colorAutodetectLabel.innerHTML = "autodetect color:";
		let colorAutodetectInput = document.createElement("input");
		colorAutodetectInput.id = "colorAutoID";
		colorAutodetectInput.setAttribute("type", "checkbox");
		colorAutodetectInput.setAttribute("name", "colorAuto");

		let colorPicker = generateDiv("color-form", "", "");
		let colorPickerLabel = generateLabel("colorPickerInput", "colorPickerInputLabel", "background:");
		let colorPickerInput = generateInput("color", "colorBg", "#45688E", "colorPickerInput");

		let colorPicker_1 = generateDiv("color-form", "", "");
		let colorPickerLabel_1 = generateLabel("colorPickerInput", "colorPickerInputLabel", "foreground:");
		let colorPickerInput_1 = generateInput("color", "colorFg", "#000000", "colorPickerInput");

		let actionButtonsDiv = document.createElement("div");
		actionButtonsDiv.className = "actionButtons";

		let actionButtonOk = generateButton("OK");
		let actionButtonCancel = generateButton("Cancel");

		fullTitleAnchor.appendChild(linkTileEditMode);
		linkTilesSectionIconPreview.appendChild(linkTilesSectionIconPreviewInnerDiv);
		linkTilesSectionIconPreview.appendChild(fullTitleAnchor);

		colorAutodetect.appendChild(colorAutodetectLabel);
		colorAutodetect.appendChild(colorAutodetectInput);
		colorPicker.appendChild(colorPickerLabel);
		colorPicker.appendChild(colorPickerInput);
		colorPicker_1.appendChild(colorPickerLabel_1);
		colorPicker_1.appendChild(colorPickerInput_1);
		colorPickerSection.appendChild(colorAutodetect);
		colorPickerSection.appendChild(colorPicker);
		colorPickerSection.appendChild(colorPicker_1);
		iconCustomizationSection.appendChild(linkTilesSectionIconPreview);
		iconCustomizationSection.appendChild(colorPickerSection);

		actionButtonsDiv.appendChild(actionButtonOk);
		actionButtonsDiv.appendChild(actionButtonCancel);

		tileEditWindow.appendChild(header);
		formRowUrl.appendChild(formRowUrlLabel);
		formRowUrl.appendChild(formRowUrlInput);
		formRowName.appendChild(formRowNameLabel);
		formRowName.appendChild(formRowNameInput);

		tileEditWindow.appendChild(formRowUrl);

		tileEditWindow.appendChild(formRowName);
		tileEditWindow.appendChild(iconCustomizationSection);
		tileEditWindow.appendChild(actionButtonsDiv);
		document.body.appendChild(tileEditWindow);
		state.toggleOverLay(true);
		state.overlayElement.style.zIndex = 0;
		tileEditWindow.style.zIndex = 5;
		let windowTopOffset = _sysVars.getViewPortHeight()/2 - 250/2+"px";
		tileEditWindow.style.top = windowTopOffset;
		let windowLeftOffset = _sysVars.getViewPortWidth()/2+"px";
		tileEditWindow.style.top = windowTopOffset;

	}
	else{

	}
}


function generateTile(sectionItem){
	let linkTileAnchor = document.createElement("a");
	linkTileAnchor.setAttribute("href", sectionItem.sectionItemUrl);
	linkTileAnchor.setAttribute("target", "_blank");
	let linkTileAnchorInnerDiv = document.createElement("div");
	linkTileAnchorInnerDiv.style.color = sectionItem.sectionItemColors[0];
	linkTileAnchorInnerDiv.style.backgroundColor = sectionItem.sectionItemColors[1];
	linkTileAnchorInnerDiv.className = "linkTile";
	linkTileAnchorInnerDiv.innerHTML = sectionItem.sectionItemNameShort;
	linkTileAnchorInnerDiv.setAttribute("sectionId", sectionItemObj.sectionId);
	linkTileAnchorInnerDiv.setAttribute("tileId", 100);
	linkTileAnchor.appendChild(linkTileAnchorInnerDiv);
	linkTilesSection.appendChild(linkTileAnchor);
}

function generateButton(_innerHTML){
	let button = document.createElement("button");
	button.innerHTML = _innerHTML;
	return button;
}

function generateInput(_type, _name, _value, _className){
	let input = document.createElement("input");
	input.className = _className;
	input.setAttribute("type", _type);
	input.setAttribute("name", _name);
	input.setAttribute("value", _value);
	return input;
}

function generateLabel(_for, _className, _innerHTML){
	let label = document.createElement("label");
	label.className = _className;
	label.setAttribute("for",_for);
	label.innerHTML = _innerHTML;
	return label;
}

function generateDiv(className, innerHTML, id){
	let div = document.createElement("div");
	div.className = className;
	div.innerHTML = innerHTML;
	div.id = id;
	return div;
}

function generateAnchor(href){
	let linkAnchorTag = document.createElement("a");
	linkAnchorTag.setAttribute("href",href);
	return linkAnchorTag;
}


function addNewTile(sectionId, url, name, colorBg, colorFg){
	addUI();

	//addBackEnd();
}
function removeTile(sectionId, tileId){

}


function autoSetColor(url){

}
