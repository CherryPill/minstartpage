var state = {
	settingsWindowOpen: false,
	currentTab: 0,
	colorAutoDetectOn: false,
	overlayElement: document.getElementById("overlay"),
	modalOverlayOn: false,
	editSectionOn: false,
	toggleOverLay: function(val){
		this.overlayElement.style.visibility = val ? "visible":"hidden";
		this.modalOverlayOn = !this.modalOverlayOn;
	}
};

var controlTypes = {
	REGULAR_INPUT: "input",
	DROP_DOWN_LIST: "select",
};

var UUIDGeneration = {
	GENERATE: 0,
	NO_GENERATE: 1,
	getUUID: function getUUID(){
		var d = new Date().getTime();
	    if(Date.now){
	        d = Date.now(); //high-precision timer
	    }
	    var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	}
};

var utilStrings = {
	settingsWindowTabNames: ["General", "Clock", "About"],
};

function SectionItem(
	_sectionItemUrl,
	_sectionItemName,
	_sectionItemNameShort,
	_sectionItemColorsBg,
	_sectionItemColorsFg,
	_sectionUUID){
		this.sectionItemColors = new Array(2);
		this.sectionItemId = _sectionUUID;
	if(arguments.length == 0){
		this.sectionItemName = "";
		this.sectionItemNameShort = "";
		this.sectionItemUrl = "";
		this.sectionItemColors[0] = "#45688E";
		this.sectionItemColors[1] = "000000";
	}
	else{
		this.sectionItemName = _sectionItemName;
		this.sectionItemNameShort = _sectionItemNameShort;
		this.sectionItemUrl = _sectionItemUrl;
		this.sectionItemColors[0] = _sectionItemColorsBg;
		this.sectionItemColors[1] = _sectionItemColorsFg;
	}
}

function Section(_name){
	this.sectionName = _name;
	this.sectionId = UUIDGeneration.getUUID();
	this.sectionItems = [];
}

var tempSectionStore = {
	currentSectionId: 0,
	currentSectionName: "",
};

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

//url: [bg, fg]
var webAppColors = {
	"https://vk.com/": ["#45688E", "#FFFFFF"],
	"https://facebook.com/": ["#3C5A99", "#FFFFFF"],
	"https://instagram.com/": ["#E1306C", "#FFFFFF"],
	"https://web.telegram.org/": ["#0088cc", "#FFFFFF"],
	"https://yahoo.com/": ["#410093", "#FFFFFF"],
};

//name: [short, url]
var webAppSuggestions = {
	"vkontakte": ["vk","https://vk.com/"],
	"facebook": ["fb","https://facebook.com/"],
	"instagram": ["ig","https://instagram.com/"],
	"telegram": ["tg","https://web.telegram.org/"],
	"google": ["go","https://google.com/"],
	"yahoo": ["yh","https://yahoo.com/"],
	"ars technica": ["at","https://arstechnica.com/"],
	"myanimelist": ["ma","https://myanimelist.net/"],
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
	updateUI();
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
	let settingsTab = document.createElement("div");
	settingsTab.className = "tab";
	for(tabHeader of utilStrings.settingsWindowTabNames){
		let tabLink = document.createElement("button");
		let actualTab = document.createElement("div");
		actualTab.id = tabHeader;
		actualTab.className = "tabContent";
		let actualTabContentWrapper = document.createElement("div");
		actualTabContentWrapper.className = "tabContentWrapper";
		actualTab.appendChild(actualTabContentWrapper);
		tabLink.className = tabHeader;
		tabLink.onclick = function(e){openSettingsTab(e, tabLink.className)};
		settingsTab.appendChild(tabLink);
		let actualTabContent = document.createElement("div");
		/*switch(){

		}*/
	}
	//for()
	parent.appendChild(settingsWindowTitle);

}

//mock user data
var userData = {
	sections: [
		{sectionName: "NEWS",
		sectionId: 3,
		sectionItems: [{sectionItemName: "stackoverflow",
						sectionItemNameShort: "so",
						sectionItemUrl: "stackoverflow.com",
						sectionItemColors: ["#FF8C00", "#000"],
						sectionItemId: "b202656a-ce7c-4f66-acb2-6b11f5981382"},
						{sectionItemName: "myanimelist",
						sectionItemNameShort: "ma",
						sectionItemUrl: "http://myanimelist.net/",
						sectionItemColors: ["#0000ff","#ffffff"],
						sectionItemId: "a202656a-ce7c-4f66-a2b2-6b11f4981382",}]},
		{sectionName: "WORK",
		sectionId: 2,
		sectionItems: [{sectionItemName: "stackoverflow",
						sectionItemNameShort: "so",
						sectionItemUrl: "stackoverflow.com",
						sectionItemColors: ["#000", "#fff"],
						sectionItemId: "93e4d3e0-0e23-4d02-a76d-02943409d2eb", },
						{sectionItemName: "tutby",
						sectionItemNameShort: "tu",
						sectionItemUrl: "tut.by",
						sectionItemColors: ["#000", "#fff"],
						sectionItemId: "4a96aac6-5443-43eb-85fe-78aba85dd325",}]},
		{sectionName: "SOCIAL",
		sectionId: 11,
		sectionItems: [{sectionItemName: "vkontakte",
						sectionItemNameShort: "vk",
						sectionItemUrl: "vkontakte.com",
						sectionItemColors: ["#000", "#fff"],
						sectionItemId: "55b4f740-2f34-45d8-b426-51e40d0c44ef" },
						]},
		],
};

function removeSections(){
	let targetSectionDiv = document.getElementsByClassName("b");
	for(d of targetSectionDiv){
		d.innerHTML = "";
	}
}

function updateUI(){
	removeSections();
	for(section of userData.sections){
		createSection(section);
	}
	addEventListenersDynamic();
}

function createSection(sectionItemObj){
	let mainArea = document.getElementById("mainArea");
	let mainAreaRow = document.createElement("div");
	mainAreaRow.className = "b";
	mainAreaRow.id = sectionItemObj.sectionId;
	let sectionHeaderRow = document.createElement("div");
	sectionHeaderRow.className = "sectionHeaderRow";
	//sectionHeaderRow.id = sectionItemObj.sectionId;
	let sectionHeaderName = document.createElement("div");
	sectionHeaderName.className = "sectionHeaderName";
	sectionHeaderName.innerHTML = sectionItemObj.sectionName;
	let sectionHeaderManagementEnclosure = document.createElement("div");
	sectionHeaderManagementEnclosure.className = "sectionHeaderManagementEnclosure";
	let sectionHeaderManagement = document.createElement("div");
	sectionHeaderManagement.className = "sectionHeaderManagement";
	let sectionHeaderManagementEdit = document.createElement("div");
	sectionHeaderManagementEdit.className = "sectionHeaderManagementEdit";
	sectionHeaderManagementEdit.id = "sectionHeaderManagementEdit";
	sectionHeaderManagementEdit.addEventListener("click", function(e){editSection(sectionItemObj.sectionId)
		e.stopPropagation();
	});

	let sectionHeaderManagementEditAnchor = document.createElement("img");
	sectionHeaderManagementEditAnchor.setAttribute("src", "img/edit.png");
	let sectionHeaderManagementRem = document.createElement("div");
	sectionHeaderManagementRem.className = "sectionHeaderManagementRem";
	sectionHeaderManagementRem.addEventListener("click", function(){removeSection(sectionItemObj.sectionId)});
	let sectionHeaderManagementRemAnchor = document.createElement("img");
	sectionHeaderManagementRemAnchor.setAttribute("src", "img/delete.png");
	let linkTilesSection = document.createElement("div");
	linkTilesSection.className = "linkTilesSection";
	linkTilesSection.id = sectionItemObj.sectionId;

	for(sectionItem of sectionItemObj.sectionItems){

		let linkTileAnchor = document.createElement("a");
		linkTileAnchor.setAttribute("href", sectionItem.sectionItemUrl);
		linkTileAnchor.setAttribute("target", "_blank");
		let linkTileAnchorInnerDiv = document.createElement("div");
		linkTileAnchorInnerDiv.style.color = sectionItem.sectionItemColors[1];
		linkTileAnchorInnerDiv.style.backgroundColor = sectionItem.sectionItemColors[0];
		linkTileAnchorInnerDiv.className = "linkTile";
		linkTileAnchorInnerDiv.innerHTML = sectionItem.sectionItemNameShort;
		linkTileAnchorInnerDiv.setAttribute("sectionId", sectionItemObj.sectionId);
		linkTileAnchorInnerDiv.id = sectionItem.sectionItemId;
		linkTileAnchor.appendChild(linkTileAnchorInnerDiv);
		linkTilesSection.appendChild(linkTileAnchor);
	}
	//put it into a function
	let linkTileAnchorAddNew = generateAnchor("#");
	let linkTileAnchorAddNewInnerDiv = document.createElement("div");
	linkTileAnchorAddNewInnerDiv.className = "linkTile addNew";
	linkTileAnchorAddNewInnerDiv.setAttribute("sectionId", sectionItemObj.sectionId);
	linkTileAnchorAddNewInnerDiv.id = null;

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
	let labelColor, reqOpacity;
	if(_state_){
		reqOpacity = 1.0;
	}
	else{
		reqOpacity = 0.5;
	}
	for(cil of colorInputLabels){
		cil.style.opacity = reqOpacity;
	}
	for(ci of colorInputs){
		ci.disabled = !_state_;
	}
}

function addEventListenersDynamic(){
	let a = document.getElementsByClassName("addNew");
		for(var i=0; i < a.length; i++){
			if(!~a[i].className.indexOf("addNewSection")){
				a[i].addEventListener("click",
					generateAddEditTileWindow.bind(this, a[i].getAttribute("sectionid"),
					a[i].id, false));
				}
		}
	let allCurrentTiles = document.getElementsByClassName("linkTile");
	for(var i=0; i < allCurrentTiles.length; i++){
		allCurrentTiles[i].addEventListener("contextmenu", function(e){
		e.preventDefault();
		generateContextMenu(this.id, e.clientX, e.clientY, this.getAttribute("sectionId"));
		//generateContextMenu.bind(this, this.getAttribute("tileid"));
		return false;}, false);
	}
}

function addEventListeners(){
	//global even listener for contextmenu and section editing input
	document.body.addEventListener("click", function(e){
		let a = document.getElementsByClassName("contextMenu");

		if(!(a[0] == undefined)){
			if(e.target.id == "contextMenuEdit"){
				generateAddEditTileWindow(a[0].getAttribute("sectionid"), a[0].id);
			}
			else if(e.target.id == "contextMenuDelete"){
				removeTile(a[0].id);
			}
			a[0].parentNode.removeChild(a[0]);
		}
		else if(state.editSectionOn){
			console.log(state.editSectionOn);
			if(!(e.target.id == "editName")){
				let b = document.getElementById("editName");
				changeSectionHeaderName(b.value,b.parentNode.parentNode.parentNode.id);
				b.parentNode.innerHTML = b.value;
				state.editSectionOn = false;
			}
		}
	});

	state.overlayElement.addEventListener("click", dismissAddDialog);
	document.addEventListener("keydown", function(k){
		if(k.keyCode == 27 && state.overlayElement){
			console.log("engaged");
			dismissAddDialog();
		}
	});

	let sectionCreationButton = document.getElementsByClassName("addNewSection");
	sectionCreationButton[0].addEventListener("click", function(e){addNewSection(); e.preventDefault()});
}

function dismissAddDialog(){
	state.toggleOverLay(false);
	let tileEditWindow = document.getElementsByClassName("tileEditWindow");
	document.body.removeChild(tileEditWindow[0]);
}

function createWindowControls(sectionId, sItem, tileId){
	console.log(sItem);
	let tileEditWindow = document.createElement("div");
	tileEditWindow.className = "tileEditWindow";
	let header = document.createElement("div");
	header.innerHTML = "Add new tile";
	let formRowsEnclosure = generateDiv("", "", "formRowsEnclosure");
	let formRowUrl = createFormRow("url",
		controlTypes.REGULAR_INPUT,
		{"id": "formInputFieldUrl",
		"type":"text",
		"name":"url",
		"value": sItem.sectionItemUrl,
		"disabled": ""});

	let formRowName = createFormRow("name",
		controlTypes.REGULAR_INPUT,
		{"id": "formInputFieldName",
		"type":"text",
		"name":"name",
		"value": sItem.sectionItemName});

	let addWindowContentWrapper = document.createElement("div");
	addWindowContentWrapper.className = "wrap";
	addWindowContentWrapper.setAttribute("style","display: flex; flex-direction: row;")
	let iconPreviewSection = document.createElement("div");
	iconPreviewSection.className = "iconPreviewSection";
	let linkTilesSectionIconPreview = document.createElement("div");
	linkTilesSectionIconPreview.className = "linkTilesSection iconPreview";
	let linkTilesSectionIconPreviewInnerDiv = document.createElement("div");
	linkTilesSectionIconPreviewInnerDiv.innerHTML = "Preview";
	let fullTitleAnchor = generateAnchor("https://vk.com/feed");
	let linkTileEditMode = generateDiv("linkTile editMode", "", "iconPreviewDiv");
	linkTileEditMode.innerHTML = sItem.sectionItemNameShort;
	linkTileEditMode.style.backgroundColor =  sItem.sectionItemColors[0];
	linkTileEditMode.style.color = sItem.sectionItemColors[1];

	let colorPickerSection = generateDiv("colorPickerSection","","");
	let colorAutodetect = generateDiv("color-autodetect", "", "");

	let formColorPickerBg = createFormRow("background",
		controlTypes.REGULAR_INPUT,
		{"type": "color", "name": "colorBg",
		"value":sItem.sectionItemColors[0],
		"id":"formInputFieldColorBg",
		"class":"colorPickerInput"},
		"input",
		() => {
			linkTileEditMode.style.backgroundColor = this.value;
		});

	let formColorPickerFg = createFormRow("foreground",
		controlTypes.REGULAR_INPUT,
		{"type": "color", "name": "colorFg",
		"value":sItem.sectionItemColors[1],
		"id":"formInputFieldColorFg",
		"class":"colorPickerInput"},
		"input",
		() => {
			linkTileEditMode.style.color = this.value;
		});
	let formRowColorAutoDetect = createFormRow("autodetect color:",
		controlTypes.REGULAR_INPUT,
		{"id": "colorAutoID",
		"type":"checkbox",
		"name":"colorAuto",
		"value": sItem.sectionItemName,
		"style":"width: 20px; height: 20px;"}, "click",
		() => {
			toggleColorLock(state.colorAutoDetectOn)
			state.colorAutoDetectOn = !state.colorAutoDetectOn;
			if(state.colorAutoDetectOn){
				detectAndApplyColors(formColorPickerBg.input,
					formColorPickerFg.input,
					formRowUrl.input,
					linkTileEditMode);
			}
		});
	let actionButtonsDiv = document.createElement("div");
	actionButtonsDiv.className = "actionButtons";
	let actionButtonOk = generateButton("OK");
	if(tileId == "null"){
		actionButtonOk.addEventListener("click", addNewTile);
	}
	else{
		actionButtonOk.addEventListener("click", function(){editTile(tileId)});
	}

	let actionButtonCancel = generateButton("Cancel");

	fullTitleAnchor.appendChild(linkTileEditMode);
	linkTilesSectionIconPreview.appendChild(linkTilesSectionIconPreviewInnerDiv);
	linkTilesSectionIconPreview.appendChild(fullTitleAnchor);

	colorAutodetect.appendChild(formRowColorAutoDetect.mainDiv)

	colorPickerSection.appendChild(colorAutodetect);
	colorPickerSection.appendChild(formColorPickerBg.mainDiv);

	colorPickerSection.appendChild(formColorPickerFg.mainDiv);
	iconPreviewSection.appendChild(linkTilesSectionIconPreview);
	iconPreviewSection.appendChild(colorPickerSection);

	actionButtonsDiv.appendChild(actionButtonOk);
	actionButtonsDiv.appendChild(actionButtonCancel);

	tileEditWindow.appendChild(header);

	formRowsEnclosure.appendChild(formRowName.mainDiv);
	formRowsEnclosure.appendChild(formRowUrl.mainDiv);
	formRowsEnclosure.appendChild(colorPickerSection);
	iconPreviewSection.appendChild(linkTilesSectionIconPreview);
	addWindowContentWrapper.appendChild(iconPreviewSection);
	addWindowContentWrapper.appendChild(formRowsEnclosure);
	tileEditWindow.appendChild(addWindowContentWrapper);

	//tileEditWindow.appendChild(formRowName.mainDiv);
	//tileEditWindow.appendChild(formRowUrl.mainDiv);
	//tileEditWindow.appendChild(iconCustomizationSection);
	tileEditWindow.appendChild(actionButtonsDiv);
	document.body.appendChild(tileEditWindow);
	state.toggleOverLay(true);
	state.overlayElement.style.zIndex = 0;
	tileEditWindow.style.zIndex = 5;
	let windowTopOffset = _sysVars.getViewPortHeight()/2 - 247/2 + "px";
	tileEditWindow.style.top = windowTopOffset;
	let windowLeftOffset = _sysVars.getViewPortWidth()/2 - 522/2 +"px";
	tileEditWindow.style.left = windowLeftOffset;
	tempSectionStore.currentSectionId = sectionId;
	autocomplete(document.getElementById("formInputFieldName"), webAppSuggestions);
}


function generateAddEditTileWindow(sectionId, tileId){
	var itemForForm;
	//add new title
	if(tileId == "null"){
		itemForForm = new SectionItem();
	}
	else{
		//edit existing tile
		//find tile id in userdata and fill the ui form accordingly
		for(let s = 0; s<userData.sections.length;s++){
			for(let sectionItem = 0;sectionItem<userData.sections[s].sectionItems.length;sectionItem++){
				if(userData.sections[s].sectionItems[sectionItem].sectionItemId == tileId){
					userData.sections[s].sectionItems[sectionItem];
					itemForForm = new SectionItem(userData.sections[s].sectionItems[sectionItem].sectionItemUrl,
					userData.sections[s].sectionItems[sectionItem].sectionItemName,
				userData.sections[s].sectionItems[sectionItem].sectionItemNameShort,
			userData.sections[s].sectionItems[sectionItem].sectionItemColors[0],
			userData.sections[s].sectionItems[sectionItem].sectionItemColors[1]
		);
				}
			}
		}
	}
	console.log(itemForForm);
	createWindowControls(sectionId, itemForForm, tileId);
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

function generateInput(_type, _name, _value, _className, _id){
	let input = document.createElement("input");
	input.className = _className;
	input.setAttribute("type", _type);
	input.setAttribute("name", _name);
	input.setAttribute("value", _value);
	input.id = _id;
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

function addNewTile(){
	let enteredData = getFormData();

	for(let s = 0; s<userData.sections.length;s++){
		if(userData.sections[s].sectionId == tempSectionStore.currentSectionId){
			userData.sections[s].sectionItems.push(enteredData);
		}
	}
	//createSectionItem(enteredData);
	updateUI();
	dismissAddDialog();
}
function createSectionItem(enteredData){
	let targetSectionDiv = document.getElementById(tempSectionStore.currentSectionId);
	//console.log(tempSectionStore.currentSectionId);
	let linkTileAnchor = document.createElement("a");
	linkTileAnchor.setAttribute("href", enteredData.sectionItemUrl);
	linkTileAnchor.setAttribute("target", "_blank");
	let linkTileAnchorInnerDiv = document.createElement("div");
	linkTileAnchorInnerDiv.style.color = sectionItem.sectionItemColors[0];
	linkTileAnchorInnerDiv.style.backgroundColor = enteredData.sectionItemColors[1];
	linkTileAnchorInnerDiv.className = "linkTile";
	linkTileAnchorInnerDiv.innerHTML = enteredData.sectionItemNameShort;
	linkTileAnchorInnerDiv.setAttribute("sectionId", tempSectionStore.currentSectionId);
	linkTileAnchorInnerDiv.setAttribute("tileId", 100);
	linkTileAnchor.appendChild(linkTileAnchorInnerDiv);
	targetSectionDiv.appendChild(linkTileAnchor);
}

function getFormData(tileId){
	let fieldUrl = document.getElementById("formInputFieldUrl").value;
	let fieldName = document.getElementById("formInputFieldName").value;
	let fieldNameShort = document.getElementById("iconPreviewDiv").innerHTML;
	let fieldColorBg = document.getElementById("formInputFieldColorBg").value;
	let fieldColorFg = document.getElementById("formInputFieldColorFg").value;
	let fieldUUID = null;
	if(tileId == null)
		fieldUUID = UUIDGeneration.getUUID();
	fieldUUID = tileId;
	return new SectionItem(fieldUrl, fieldName, fieldNameShort, fieldColorBg, fieldColorFg, fieldUUID);
}

function generateContextMenu(tileId, coordX, coordY, sectionId){
	if(tileId != "null"){
		let contextMenuDiv = document.createElement("div");
		contextMenuDiv.className = "contextMenu";
		contextMenuDiv.id = tileId;
		contextMenuDiv.setAttribute("sectionid", sectionId);
		let strArr = ["Edit tile", "Delete"];
		let olElement = document.createElement("ol");
		for(let i = 0;i<strArr.length;i++){
			ulElement = document.createElement("ul");
			ulElement.innerHTML = strArr[i];
			ulElement.className = "contextMenuSelection";
			if(!i){
				ulElement.id = "contextMenuEdit";
			}
			else{
				ulElement.className = "warning";
				ulElement.id = "contextMenuDelete";
			}
			olElement.appendChild(ulElement);
		}
		contextMenuDiv.appendChild(olElement);
		document.body.appendChild(contextMenuDiv);
		contextMenuDiv.style.top = (coordY + contextMenuDiv.offsetHeight/2) + "px";
		contextMenuDiv.style.left = coordX + "px";
	}
}

function removeTile(tileId){
	for(let s = 0; s<userData.sections.length;s++){
		for(let sectionItem = 0;sectionItem<userData.sections[s].sectionItems.length;sectionItem++){
			if(userData.sections[s].sectionItems[sectionItem].sectionItemId == tileId){
				userData.sections[s].sectionItems.splice(sectionItem, 1);
			}
		}
	}
	let tileForDeletion = document.getElementById(tileId);
	tileForDeletion.parentNode.removeChild(tileForDeletion);
	updateUI();
	//console.log(userData);
}

//delete at index and copy the new object
function editTile(tileId){
	let enteredData = getFormData(tileId);
	for(let s = 0; s<userData.sections.length;s++){
		for(let sectionItem = 0;sectionItem<userData.sections[s].sectionItems.length;sectionItem++){
			if(userData.sections[s].sectionItems[sectionItem].sectionItemId == tileId){
				delete userData.sections[s].sectionItems[sectionItem];
				userData.sections[s].sectionItems[sectionItem] = enteredData;
			}
		}
	}
	let tileForDeletion = document.getElementById(tileId);
	tileForDeletion.parentNode.removeChild(tileForDeletion);
	updateUI();
	dismissAddDialog();
}

function autocomplete(inp, arr) {
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
			var previewIconTextElement = document.getElementById("iconPreviewDiv");
			var formUrlFieldDisabled = document.getElementById("formInputFieldUrl");
			var formInputFieldName = document.getElementById("formInputFieldName");
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");

      this.parentNode.appendChild(a);
			let currentWebApp;
      for (webApp in webAppSuggestions) {
        if (webApp.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
					currentWebApp = webApp;
          /*create a DIV element for each matching element:*/
          b = document.createElement("div");
          b.innerHTML = "<strong>" + webApp.substr(0, val.length) + "</strong>";
          b.innerHTML += webApp.substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + webAppSuggestions[webApp][0] + "'>";
					previewIconTextElement.innerHTML = webAppSuggestions[webApp][0];
					formUrlFieldDisabled.value = webAppSuggestions[webApp][1];

					//fill out hidden with full name input with webAppName id
              b.addEventListener("click", function(e) {
								formInputFieldName.value = currentWebApp;
								if(state.colorAutoDetectOn){
									detectAndApplyColors(formUrlFieldDisabled, previewIconTextElement);
								}
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

function detectAndApplyColors(formFieldBg, formFieldFg, formFieldUrl, iconPreviewDiv){
	//get link and get icon elements
	if(formFieldUrl.value != ""){
		for(let link in webAppColors){
			if(link === formFieldUrl.value){
				webappDetected = true;
				iconPreviewDiv.style.backgroundColor = webAppColors[link][0];
				iconPreviewDiv.style.color = webAppColors[link][1];
			}
		}
	}
}

function removeSection(sectionId){
	for(let i = 0;i<userData.sections.length;i++){
		if(userData.sections[i].sectionId == sectionId){
			userData.sections.splice(i, 1);
		}
	}
	let sectionForDeletion = document.getElementById(sectionId);
	sectionForDeletion.parentNode.removeChild(sectionForDeletion);
	updateUI();
}

function editSection(sectionId){
	state.editSectionOn = true;
	let sectionForEditing = document.getElementById(sectionId);
	let children = sectionForEditing.childNodes;
	let row = children[0];
	let actuaChildren = row.childNodes;
	console.log(actuaChildren);
	for(c of actuaChildren){
		if(c.className == "sectionHeaderName"){
			let requiredInputWidth = c.offsetWidth;
			let requiredInputHeight = c.offsetHeight;
			console.log(requiredInputWidth)
			tempSectionStore.currentSectionName = c.innerHTML;
			c.innerHTML = "";
			let editInput = generateInput("text", "editName", tempSectionStore.currentSectionName, "editSectionName", "editName");
			editInput.style.width = requiredInputWidth + "px";
			editInput.style.height = requiredInputHeight - 15 + "px";
			c.appendChild(editInput);
		}
	}
}

function changeSectionHeaderName(v, id){
	for(section of userData.sections){
		if(section.sectionId == id){
			section.sectionName = v;
		}
	}
}

function addNewSection(){
	let sectionCreationForm = document.getElementById("newSectionName");
	let newSection = new Section(sectionCreationForm.value);
	createSection(newSection);
	userData.sections.push(newSection);
	addEventListenersDynamic();
}


function openSettingsTab(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

function createFormRow(labelString, controlType, controlParams, eventType, eventHandler){
	let mainDivElement = document.createElement("div");
	mainDivElement.className = "form-row";
	let formLabel = document.createElement("label");
	formLabel.className = "form-row-label";
	formLabel.innerHTML = labelString;
	let formInput = document.createElement(controlType);
	for(param in controlParams){
		formInput.setAttribute(param, controlParams[param]);
	}
	mainDivElement.appendChild(formLabel);
	mainDivElement.appendChild(formInput);
	if(eventType != ""){
		formInput.addEventListener(eventType, eventHandler);
	}
	return {mainDiv: mainDivElement,
			label: formLabel,
			input: formInput};
}

document.getElementById("defaultOpen").click();
