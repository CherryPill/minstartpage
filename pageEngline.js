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


function SectionItem(_sectionItemName, _sectionItemNameShort, _sectionItemUrl, _sectionItemColors){
	this.sectionItemName = _sectionItemName;
	this.sectionItemNameShort = _sectionItemNameShort;
	this.sectionItemUrl = _sectionItemUrl;
	this.sectionItemColors = _sectionItemColors;
}

var tempSectionStore = {
	currentSectionId: 0,
};

var tempAddTileStore = {
	actualUrl: "",
	actualShortName: "",
};

var modalDialogs = {

};



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
//full name (autosuggestion, url, short display name on tile)
var webAppSuggestions = {
	"vkontakte": ["vk","https://vk.com"],
	"facebook": ["fb","https://facebook.com"],
	"instagram": ["ig","https://instagram.com"],
	"telegram": ["tg","https://web.telegram.org/"],
	"google": ["go","https://google.com"],
	"yahoo": ["yh","https://yahoo.com"],
	"ars technica": ["at","https://arstechnica.com"],
	"myanimelist": ["ma","https://myanimelist.net"],
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
		sectionId: 3,
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
																sectionId: 11,
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
	linkTilesSection.id = sectionItemObj.sectionId;
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
	for(var i=0; i < a.length; i++){
		a[i].addEventListener("click", generateAddEditTileWindow.bind(this, a[i].getAttribute("sectionid"),
	a[i].getAttribute("tileid")), false);
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
	console.log("in add tile window "+sectionId);
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
		formRowUrlInput.id = "formInputFieldUrl";
		let formRowName = document.createElement("div");
		formRowUrl.className = "form-row";
		let formRowNameLabel = document.createElement("label");
		formRowNameLabel.innerHTML = "name:"
		let formRowNameInput = document.createElement("input");
		formRowNameInput.setAttribute("type", "text");
		formRowNameInput.setAttribute("name", "name");
		formRowNameInput.id = "formInputFieldName";


		let iconCustomizationSection = document.createElement("div");
		iconCustomizationSection.className = "iconCustomizationSection";
		let linkTilesSectionIconPreview = document.createElement("div");
		linkTilesSectionIconPreview.className = "linkTilesSection iconPreview";
		let linkTilesSectionIconPreviewInnerDiv = document.createElement("div");
		linkTilesSectionIconPreviewInnerDiv.innerHTML = "Preview";
		let fullTitleAnchor = generateAnchor("https://vk.com/feed");
		let linkTileEditMode = generateDiv("linkTile editMode", "", "iconPreviewDiv");
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
		let colorPickerInput = generateInput("color", "colorBg", "#45688E", "colorPickerInput", "formInputFieldColorBg");

		let colorPicker_1 = generateDiv("color-form", "", "");
		let colorPickerLabel_1 = generateLabel("colorPickerInput", "colorPickerInputLabel", "foreground:", "formInputFieldColorFg");
		let colorPickerInput_1 = generateInput("color", "colorFg", "#000000", "colorPickerInput");

		let actionButtonsDiv = document.createElement("div");
		actionButtonsDiv.className = "actionButtons";

		let actionButtonOk = generateButton("OK");
		actionButtonOk.addEventListener("click", addNewTile);
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
		let windowTopOffset = _sysVars.getViewPortHeight()/2 - 247/2 + "px";
		tileEditWindow.style.top = windowTopOffset;
		let windowLeftOffset = _sysVars.getViewPortWidth()/2 - 522/2 +"px";
		tileEditWindow.style.left = windowLeftOffset;
		tempSectionStore.currentSectionId = sectionId;
		autocomplete(document.getElementById("formInputFieldName"), webAppSuggestions);
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
	//addUI();
	//createSectionItem(enteredData);
	console.log("add");
	//addBackEnd();
	updateUI();
}
function createSectionItem(enteredData){
	let targetSectionDiv = document.getElementById(tempSectionStore.currentSectionId);
	console.log(tempSectionStore.currentSectionId);
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

//add new tile
function addUI(enteredData){

}
function getFormData(){
	let fieldUrl = document.getElementById("formInputFieldUrl").value;
	let fieldName = document.getElementById("formInputFieldName").value;
	let fieldColorBg = document.getElementById("formInputFieldName").value;
	let fieldColorFg = document.getElementById("formInputFieldName").value;
	return new SectionItem(fieldUrl, fieldName, fieldColorBg, fieldColorFg);
}

function removeTile(sectionId, tileId){

}


function autoSetColor(url){

}
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
			var previewIconTextElement = document.getElementById("iconPreviewDiv");
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (webApp in webAppSuggestions) {
        /*check if the item starts with the same letters as the text field value:*/
        if (webApp.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("div");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + webApp.substr(0, val.length) + "</strong>";
          b.innerHTML += webApp.substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + webAppSuggestions[webApp][0] + "'>";
					previewIconTextElement.innerHTML = webAppSuggestions[webApp][0];
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
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
