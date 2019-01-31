var state = {
	settingsWindowOpen: false,
	currentTab: 0
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
	vk: ["#45688E", "color"],
	fb: ["color", "color"],
	ig: ["color", "color"],
	tg: ["color", "color"],
	sc: ["color", "color"],
	ggl: ["color", "color"],
	yh: ["color", "color"],
	at: ["color", "color"],
	mal: ["color", "color"],
	rdt: ["color", "color"],
	wp: ["color", "color"],
	yt: ["color", "color"],
	bd: ["color", "color"],
	az: ["color", "color"],
	tw: ["color", "color"]
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
	tw: "tw"
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

function generateContextMenu(id){

}
