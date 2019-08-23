var state = {
    settingsWindowOpen: false,
    contextMenuOpen: false,
    currentTab: 0,
    colorAutoDetectOn: false,
    overlayElement: document.getElementById("overlay"),
    sectionAreaElement: document.getElementById("sectionArea"),
    modalOverlayOn: false,
    editSectionOn: false,
    toggleOverLay: function (val) {
        this.overlayElement.style.visibility = val ? "visible" : "hidden";
        this.modalOverlayOn = !this.modalOverlayOn;
    },
    toggleSectionAreaVisibility: function (val) {
        this.sectionAreaElement.style.display = val ? "block" : "none";
    },
    errorRaised: false,
};

const scriptStartModes = {
    PROD: 1,
    DEV: 0,
};

var userData;

const controlTypes = {
    REGULAR_INPUT: "input",
    DROP_DOWN_LIST: "select",
};

const UUIDGeneration = {
    GENERATE: 0,
    NO_GENERATE: 1,
    getUUID: function getUUID() {
        var d = new Date().getTime();
        if (Date.now) {
            d = Date.now(); //high-precision timer
        }
        var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
};

const utilStrings = {
    settingsWindowTabNames: ["General", "Clock", "About"],
};

function UserData() {
    this.sections = [];
}

function SectionItem(
    _sectionItemUrl,
    _sectionItemName,
    _sectionItemNameShort,
    _sectionItemColorsBg,
    _sectionItemColorsFg,
    _sectionUUID) {
    this.sectionItemColors = new Array(2);
    this.sectionItemId = _sectionUUID;
    if (arguments.length === 0) {
        this.sectionItemName = "";
        this.sectionItemNameShort = "";
        this.sectionItemUrl = "";
        this.sectionItemColors[0] = "#45688E";
        this.sectionItemColors[1] = "#FFFFFF";
    } else {
        this.sectionItemName = _sectionItemName;
        this.sectionItemNameShort = _sectionItemNameShort;
        this.sectionItemUrl = _sectionItemUrl;
        this.sectionItemColors[0] = _sectionItemColorsBg;
        this.sectionItemColors[1] = _sectionItemColorsFg;
    }
}

function Section(_name) {
    this.sectionName = _name;
    this.sectionId = UUIDGeneration.getUUID();
    this.sectionItems = [];
}

var tempSectionStore = {
    currentSectionId: 0,
    currentSectionName: "",
};

function initSysVars() {
    let _viewPortWidth = document.documentElement.clientWidth;
    let _viewPortHeight = document.documentElement.clientHeight;
    return {
        getViewPortWidth() {
            return _viewPortWidth;
        },
        getViewPortHeight() {
            return _viewPortHeight;
        },
    };
}

const _sysVars = initSysVars();

const searchEngines = {
    engineOptionsEnum: {
        Google: 0,
        Bing: 1,
        Yahoo: 2,
        Yandex: 3,
    },
    engineOptions: ["Google", "Bing", "Yahoo", "Yandex"],
    engineLinks: ["https://www.google.by/search",
        "https://www.bing.com/search",
        "https://search.yahoo.com/search",
        "https://yandex.ru/search"]
};

//url: [bg, fg]
const webAppColors = {
    "https://vk.com/": ["#45688E", "#FFFFFF"],
    "https://facebook.com/": ["#3C5A99", "#FFFFFF"],
    "https://instagram.com/": ["#E1306C", "#FFFFFF"],
    "https://web.telegram.org/": ["#0088cc", "#FFFFFF"],
    "https://yahoo.com/": ["#410093", "#FFFFFF"],
};

//name: [short, url]
const webAppSuggestions = {
    "vkontakte": ["vk", "https://vk.com/"],
    "facebook": ["fb", "https://facebook.com/"],
    "instagram": ["ig", "https://instagram.com/"],
    "telegram": ["tg", "https://web.telegram.org/"],
    "google": ["go", "https://google.com/"],
    "yahoo": ["yh", "https://yahoo.com/"],
    "ars technica": ["at", "https://arstechnica.com/"],
    "myanimelist": ["ma", "https://myanimelist.net/"],
};


var ValidationError = {
    formError: (errorType, fieldName) => {
        let messagePostFix = "";
        switch (errorType) {
            case ValidationError.EmptyString: {
                messagePostFix = " can't be empty";
                break;
            }
            case ValidationError.StringTooLong: {
                messagePostFix = " is too long";
                break;
            }
            case ValidationError.InvalidSymbols: {
                messagePostFix = " contains invalid symbols";
                break;
            }
        }
        return fieldName + messagePostFix;
    },
    EmptyString: "String is empty",
    StringTooLong: "String is too long",
    InvalidSymbols: "String contains invalid symbols",
    NoError: "No error",
};

function validate(inputFieldValue, inputFieldName) {
    let allErrors = [];
    if (inputFieldValue === "") {
        allErrors.push(ValidationError.formError(ValidationError.EmptyString,
            inputFieldName));
    } else {
        if (inputFieldValue.length > 50) {
            allErrors.push(ValidationError.formError(ValidationError.StringTooLong,
                inputFieldName));
        }
    }
    return allErrors;
}

function generateSearchEngineOptions() {
    let htmlElement = document.getElementById("searchOptions");
    for (let i = 0; i < searchEngines.engineOptions.length; i++) {
        htmlElement.options[htmlElement.options.length] = new Option(
            searchEngines.engineOptions[i] + " Search", searchEngines.engineOptions[i]);
    }
    htmlElement.options.selectedIndex = 0;
    htmlElement.addEventListener("change", setSearchLink);
}

function setSearchLink() {
    let htmlElementOptions = document.getElementById("searchOptions");
    let htmlElementFormLink = document.getElementById("searchForm");
    let htmlElementSearchField = document.getElementById("searchInputField");
    if (htmlElementOptions.options.selectedIndex === searchEngines.engineOptionsEnum.Yandex) {
        htmlElementSearchField.setAttribute("name", "text");
    }
    htmlElementFormLink.setAttribute("action",
        searchEngines.engineLinks[htmlElementOptions.options.selectedIndex]);
}

function initStartPage(mode) {
    generateSearchEngineOptions();
    initTimeScript(mode);
    switch (mode) {
        case scriptStartModes.DEV: {
            fillMockUserData();
            break;
        }
        case scriptStartModes.PROD: {
            fillLocalStorageUserData();
            break;
        }
    }
    updateUI();
    addEventListeners();
}

function openSettingsMenu() {
    let parent = document.getElementById("docBody");
    let settingsWindow = ControlBuilder.build({tag: "div", id: "settingsWindow", className: "modalWindow"});
    createSettingsContents(settingsWindow);
    parent.appendChild(settingsWindow);
    state.toggleOverLay(true);
    document.querySelectorAll("button[defaultopen = true]")[0].click();
}

function createSettingsContents(parent) {
    let settingsWindowTitle = ControlBuilder.build({tag: "div", innerHTML: "Settings", id: "settingsTitle"});
    let settingsWindowNavBar = ControlBuilder.build({tag: "div", className: "tab"});
    let settingsWindowMainContent = ControlBuilder.build({tag: "div", id: "all_tabs"});

    let settingsWindowControlButtonOK = ControlBuilder.build({tag: "button"});
    let settingsWindowControlButtonCancel = ControlBuilder.build({tag: "button"});

    for (let tabHeader of utilStrings.settingsWindowTabNames) {
        let tabLink = ControlBuilder.build(
            {
                tag: "button",
                id: tabHeader,
                innerHTML: tabHeader,
                className: "tabLinks",
                event: {
                    name: "click",
                    handler: function (e) {
                        openSettingsTab(e, tabLink.id);
                    },
                    capture: false
                },
                attribs: {
                    defaultopen: tabHeader === "General"
                }
            }
        );
        settingsWindowNavBar.appendChild(tabLink);
        let actualTabContent = ControlBuilder.build({
            tag: "div",
            className: "tabcontent",
            attribs: {"tab_type": tabHeader}
        });
        let generatedTabContent = generateSettingsTabForms(tabHeader);
        actualTabContent.appendChild(generatedTabContent);
        settingsWindowMainContent.appendChild(actualTabContent);
    }
    chainAppend(parent, [settingsWindowTitle, settingsWindowNavBar, settingsWindowMainContent])
}

function generateSettingsTabForms(tabType) {
    let actualTabContentWrapper = ControlBuilder.build({
        tag: "div",
        className: "innerDiv"
    });
    switch (tabType) {
        case "General": {
            actualTabContentWrapper.appendChild(createFormRow(
                "",
                "Search box enabled: ",
                controlTypes.REGULAR_INPUT,
                {
                    "id": "generalInput",
                    "type": "checkbox",
                    "name": "input"
                }).mainDiv);
            actualTabContentWrapper.appendChild(createFormRow(
                "",
                "Default search engine: ",
                controlTypes.REGULAR_INPUT,
                {
                    "id": "generalInput",
                    "type": "text",
                    "name": "input"
                }).mainDiv);
            break;
        }
        case "Clock": {
            actualTabContentWrapper.appendChild(
                createFormRow("", "Clock enabled: ",
                    controlTypes.REGULAR_INPUT, {
                        "type": "checkbox",
                        "name": "clockEnabled",
                        "checked": "checked"
                    }).mainDiv
            );
            actualTabContentWrapper.appendChild(
                createFormRow("", "Date format: ",
                    controlTypes.REGULAR_INPUT,
                    {
                        "type": "text",
                        "name": "input"
                    }).mainDiv);

            break;
        }
        case "About": {
            actualTabContentWrapper.appendChild(
                ControlBuilder.build({
                    tag: "div", innerHTML:
                        `Currently running within ${navigator.userAgent}
            on ${navigator.platform}<br /> 
            You are currently${navigator.onLine ? ' online' : ' offline'}`
                })
            );
            break;
        }
    }
    return actualTabContentWrapper;
}


var userSettings = {
    clockEnabled: false,
    clockFormat: "",
};

function fillMockUserData() {
    //mock user data
    userData = {
        sections: [
            {
                sectionName: "NEWS",
                sectionId: 3,
                sectionItems: [{
                    sectionItemName: "stackoverflow",
                    sectionItemNameShort: "so",
                    sectionItemUrl: "stackoverflow.com",
                    sectionItemColors: ["#FF8C00", "#000"],
                    sectionItemId: "b202656a-ce7c-4f66-acb2-6b11f5981382"
                },
                    {
                        sectionItemName: "myanimelist",
                        sectionItemNameShort: "ma",
                        sectionItemUrl: "http://myanimelist.net/",
                        sectionItemColors: ["#0000ff", "#ffffff"],
                        sectionItemId: "a202656a-ce7c-4f66-a2b2-6b11f4981382",
                    }]
            },
            {
                sectionName: "WORK",
                sectionId: 2,
                sectionItems: [{
                    sectionItemName: "stackoverflow",
                    sectionItemNameShort: "so",
                    sectionItemUrl: "stackoverflow.com",
                    sectionItemColors: ["#000", "#fff"],
                    sectionItemId: "93e4d3e0-0e23-4d02-a76d-02943409d2eb",
                },
                    {
                        sectionItemName: "tutby",
                        sectionItemNameShort: "tu",
                        sectionItemUrl: "tut.by",
                        sectionItemColors: ["#000", "#fff"],
                        sectionItemId: "4a96aac6-5443-43eb-85fe-78aba85dd325",
                    }]
            },
            {
                sectionName: "SOCIAL",
                sectionId: 11,
                sectionItems: [{
                    sectionItemName: "vkontakte",
                    sectionItemNameShort: "vk",
                    sectionItemUrl: "vkontakte.com",
                    sectionItemColors: ["#000", "#fff"],
                    sectionItemId: "55b4f740-2f34-45d8-b426-51e40d0c44ef"
                },
                ]
            },
        ],
    };
}

function fillLocalStorageUserData() {
    let res = JSON.parse(localStorage.getItem("savedUserData"));
    if (res != null) {
        userData = res;
    } else {
        userData = new UserData();
    }
}

function removeSections() {
    let targetSectionDiv = document.getElementsByClassName("b");
    for (let d of targetSectionDiv) {
        d.innerHTML = "";
    }
}

function updateUI() {
    removeSections();
    if (userData.sections.length === 0) {
        state.toggleSectionAreaVisibility(false);
    } else {
        for (let section of userData.sections) {
            createSection(section);
        }
    }
    addEventListenersDynamic();
}

function createSection(sectionItemObj) {
    let mainArea = document.getElementById("mainArea");
    let mainAreaRow = ControlBuilder.build({tag: "div", className: "b", id: sectionItemObj.sectionId});
    let sectionHeaderRow = ControlBuilder.build({tag: "div", className: "sectionHeaderRow"});
    let sectionHeaderName = ControlBuilder.build({
        tag: "div",
        className: "sectionHeaderName",
        innerHTML: sectionItemObj.sectionName
    });

    let sectionHeaderManagementEnclosure = ControlBuilder.build({
        tag: "div",
        className: "sectionHeaderManagementEnclosure"
    });
    let sectionHeaderManagement = ControlBuilder.build({tag: "div", className: "sectionHeaderManagement"});

    let sectionHeaderManagementEdit = ControlBuilder.build({
        tag: "div",
        className: "sectionHeaderManagementEdit",
        id: "sectionHeaderManagementEdit",
        event: {
            name: "click",
            handler: function (e) {
                editSection(sectionItemObj.sectionId);
                e.stopPropagation();
            }
        }
    });
    let sectionHeaderManagementEditAnchor = ControlBuilder.build({
        tag: "img",
        attribs: {
            src: "img/edit.png"
        }
    });

    let sectionHeaderManagementRem = ControlBuilder.build({
        tag: "div",
        className: "sectionHeaderManagementRem",
        event: {
            name: "click",
            handler: function () {
                removeSection(sectionItemObj.sectionId)
            },
        }
    });
    let sectionHeaderManagementRemAnchor = ControlBuilder.build({
        tag: "img",
        attribs: {
            src: "img/delete.png"
        }
    });
    let linkTilesSection = ControlBuilder.build({
        tag: "div",
        className: "linkTilesSection", id: sectionItemObj.sectionId
    });

    for (let sectionItem of sectionItemObj.sectionItems) {

        let linkTileAnchor = ControlBuilder.build({
            tag: "a",
            attribs: {
                href: sectionItem.sectionItemUrl,
                target: "_blank"
            }
        });
        let linkTileAnchorInnerDiv = ControlBuilder.build({
                tag: "div",
                className: "linkTile", innerHTML: sectionItem.sectionItemNameShort,
                id: sectionItem.sectionItemId,
                attribs: {
                    sectionId: sectionItemObj.sectionId
                }
            },
        );
        linkTileAnchorInnerDiv.style.color = sectionItem.sectionItemColors[1];
        linkTileAnchorInnerDiv.style.backgroundColor = sectionItem.sectionItemColors[0];
        linkTileAnchor.appendChild(linkTileAnchorInnerDiv);
        linkTilesSection.appendChild(linkTileAnchor);
    }
    //put it into a function
    let linkTileAnchorAddNew = ControlBuilder.build({
        tag: "a",
        attribs: {
            href: "#"
        }
    });
    let linkTileAnchorAddNewInnerDiv = ControlBuilder.build({
        tag: "div",
        className: "linkTile addNew", id: null,
        attribs: {
            sectionId: sectionItemObj.sectionId
        }
    });
    linkTileAnchorAddNewInnerDiv.style.color = "black";
    linkTileAnchorAddNewInnerDiv.style.backgroundColor = "white";
    linkTileAnchorAddNew.appendChild(linkTileAnchorAddNewInnerDiv);
    linkTilesSection.appendChild(linkTileAnchorAddNew);
    sectionHeaderManagementEdit.appendChild(sectionHeaderManagementEditAnchor);
    sectionHeaderManagementRem.appendChild(sectionHeaderManagementRemAnchor);
    chainAppend(sectionHeaderManagement, [sectionHeaderManagementEdit, sectionHeaderManagementRem]);
    sectionHeaderManagementEnclosure.appendChild(sectionHeaderManagement);
    chainAppend(sectionHeaderRow, [sectionHeaderName, sectionHeaderManagementEnclosure]);
    chainAppend(mainAreaRow, [sectionHeaderRow, linkTilesSection]);
    mainArea.appendChild(mainAreaRow);
}

function chainAppend(parent, allChildren) {
    for (let child of allChildren) {
        parent.appendChild(child);
    }
}

function toggleColorLock(_state_) {
    let colorInputs = document.getElementsByClassName("colorPickerInput");
    let colorInputLabels = document.getElementsByClassName("colorPickerInputLabel");
    let reqOpacity = _state_ ? 1.0 : 0.5;
    for (let cil of colorInputLabels) {
        cil.style.opacity = reqOpacity;
    }
    for (let ci of colorInputs) {
        ci.disabled = !_state_;
    }
}

function addEventListenersDynamic() {
    let a = document.getElementsByClassName("addNew");
    for (let i = 0; i < a.length; i++) {
        if (!~a[i].className.indexOf("addNewSection")) {
            a[i].addEventListener("click",
                generateAddEditTileWindow.bind(this, a[i].getAttribute("sectionid"),
                    a[i].id, false));
        }
    }
    let allCurrentTiles = document.getElementsByClassName("linkTile");
    for (var i = 0; i < allCurrentTiles.length; i++) {
        allCurrentTiles[i].addEventListener("contextmenu",
            function (e) {
                e.preventDefault();
                if (!state.contextMenuOpen) {
                    state.contextMenuOpen = true;
                    generateContextMenu(this.id, e.clientX, e.clientY, this.getAttribute("sectionId"));
                }
                return false;
            }, false);
    }
}

function addEventListeners() {
    //global even listener for contextmenu and section editing input
    document.body.addEventListener("click", function (e) {
        let a = document.getElementsByClassName("contextMenu");

        if (!(a[0] === undefined)) {
            if (e.target.id === "contextMenuEdit") {
                generateAddEditTileWindow(a[0].getAttribute("sectionid"), a[0].id);
            } else if (e.target.id === "contextMenuDelete") {
                removeTile(a[0].id);
            }
            a[0].parentNode.removeChild(a[0]);
        } else if (state.editSectionOn) {
            console.log(state.editSectionOn);
            if (!(e.target.id === "editName")) {
                let b = document.getElementById("editName");
                changeSectionHeaderName(b.value, b.parentNode.parentNode.parentNode.id);
                b.parentNode.innerHTML = b.value;
                state.editSectionOn = false;
            }
        }
    });

    state.overlayElement.addEventListener("click", dismissModalWindow);
    document.addEventListener("keydown", function (k) {
        if (k.keyCode == 27 && state.overlayElement) {
            console.log("engaged");
            dismissModalWindow();
        }
    });

    let sectionCreationButton = document.getElementsByClassName("addNewSection");
    sectionCreationButton[0].addEventListener("click", function (e) {
        addNewSection();
        e.preventDefault();
    });
    window.onunload = window.onbeforeunload = () => {
        localStorage.setItem("savedUserData", JSON.stringify(userData));
    };
    document.body.addEventListener("click", () => state.contextMenuOpen = false, false);
}

function dismissModalWindow() {
    let activeModalWindow = document.getElementsByClassName("modalWindow");
    if (activeModalWindow != null) {
        state.toggleOverLay(false);
        document.body.removeChild(activeModalWindow[0]);
    }
}

function createWindowControls(sectionId, sItem, tileId) {
    console.log(sItem);
    let tileEditWindow = ControlBuilder.build({tag: "div", className: "tileEditWindow modalWindow"});
    let header = ControlBuilder.build({tag: "div", innerHTML: "Add new tile"});
    let formRowsEnclosure = ControlBuilder.build({tag: "div", id: "formRowsEnclosure"});
    let formRowUrl = createFormRow("", "url:",
        controlTypes.REGULAR_INPUT,
        {
            "id": "formInputFieldUrl",
            "type": "text",
            "name": "url",
            "value": sItem.sectionItemUrl,
            "disabled": ""
        });

    let formRowName = createFormRow("", "name:",
        controlTypes.REGULAR_INPUT,
        {
            "id": "formInputFieldName",
            "type": "text",
            "name": "name",
            "value": sItem.sectionItemName
        });

    let addWindowContentWrapper = ControlBuilder.build({
        tag: "div",
        className: "wrap",
        attribs: {
            style: "display: flex; flex-direction: row;"
        }
    });
    let iconPreviewSection = ControlBuilder.build({tag: "div", className: "iconPreviewSection"});
    let linkTilesSectionIconPreview = ControlBuilder.build({tag: "div", className: "linkTilesSection iconPreview"});
    let linkTilesSectionIconPreviewInnerDiv = ControlBuilder.build({tag: "div", className: "Preview"});
    let fullTitleAnchor = ControlBuilder.build({tag: "a", attribs: {href: "https://vk.com/feed"}});
    let linkTileEditMode = ControlBuilder.build({
        tag: "div",
        innerHTML: "AA", className: "linkTile editMode", id: "iconPreviewDiv"
    });
    linkTileEditMode.style.backgroundColor = sItem.sectionItemColors[0];
    linkTileEditMode.style.color = sItem.sectionItemColors[1];

    let colorPickerSection = ControlBuilder.build({tag: "div", className: "colorPickerSection"});
    let colorAutodetect = ControlBuilder.build({tag: "div", className: "color-autodetect"});

    let formColorPickerBg = createFormRow(
        "colorPickerInputLabel",
        "background:",
        controlTypes.REGULAR_INPUT,
        {
            "type": "color", "name": "colorBg",
            "value": sItem.sectionItemColors[0],
            "id": "formInputFieldColorBg",
            "class": "colorPickerInput"
        },
        "input",
        () => {
            linkTileEditMode.style.backgroundColor = this.value;
        });

    let formColorPickerFg = createFormRow("colorPickerInputLabel",
        "foreground:",
        controlTypes.REGULAR_INPUT,
        {
            "type": "color", "name": "colorFg",
            "value": sItem.sectionItemColors[1],
            "id": "formInputFieldColorFg",
            "class": "colorPickerInput"
        },
        "input",
        () => {
            linkTileEditMode.style.color = this.value;
        });
    let formRowColorAutoDetect = createFormRow("",
        "autodetect color:",
        controlTypes.REGULAR_INPUT,
        {
            "id": "colorAutoID",
            "type": "checkbox",
            "name": "colorAuto",
            "value": sItem.sectionItemName,
            "style": "width: 20px; height: 20px;"
        }, "click",
        () => {
            toggleColorLock(state.colorAutoDetectOn)
            state.colorAutoDetectOn = !state.colorAutoDetectOn;
            if (state.colorAutoDetectOn) {
                detectAndApplyColors(formColorPickerBg.input,
                    formColorPickerFg.input,
                    formRowUrl.input,
                    linkTileEditMode);
            }
        });
    let actionButtonsDiv = ControlBuilder.build({tag: "div", className: "actionButtons"});
    let actionButtonOk = ControlBuilder.build({
        tag: "button",
        innerHTML: "OK",
        event: {
            name: "click",
            handler: tileId === "null" ?
                addNewTile :
                function () {
                    editTile(tileId)
                }
        }
    });

    let actionButtonCancel = ControlBuilder.build({
        tag: "button",
        innerHTML: "Cancel",
        event: {
            name: "click",
            handler: () => {
                dismissModalWindow();
            }
        }
    });
    fullTitleAnchor.appendChild(linkTileEditMode);
    chainAppend(linkTilesSectionIconPreview, [linkTilesSectionIconPreviewInnerDiv, fullTitleAnchor]);
    colorAutodetect.appendChild(formRowColorAutoDetect.mainDiv)
    chainAppend(colorPickerSection, [colorAutodetect, formColorPickerBg.mainDiv, formColorPickerFg.mainDiv]);
    chainAppend(iconPreviewSection, [linkTilesSectionIconPreview, colorPickerSection]);
    chainAppend(actionButtonsDiv, [actionButtonOk, actionButtonCancel]);
    tileEditWindow.appendChild(header);
    chainAppend(formRowsEnclosure, [formRowName.mainDiv, formRowUrl.mainDiv, colorPickerSection]);
    iconPreviewSection.appendChild(linkTilesSectionIconPreview);
    chainAppend(addWindowContentWrapper, [iconPreviewSection, formRowsEnclosure]);
    chainAppend(tileEditWindow, [addWindowContentWrapper, actionButtonsDiv]);
    document.body.appendChild(tileEditWindow);
    state.toggleOverLay(true);
    state.overlayElement.style.zIndex = "0";
    tileEditWindow.style.zIndex = "5";
    tileEditWindow.style.top =
        _sysVars.getViewPortHeight() / 2 -
        tileEditWindow.getBoundingClientRect().height
        / 2 + "px";
    ;
    tileEditWindow.style.left = _sysVars.getViewPortWidth() / 2 -
        tileEditWindow.getBoundingClientRect().width
        / 2 + "px";
    ;
    tempSectionStore.currentSectionId = sectionId;
    console.log(document.getElementById("formInputFieldName"));
    autocomplete(document.getElementById("formInputFieldName"), webAppSuggestions);
}

function generateAddEditTileWindow(sectionId, tileId) {
    var itemForForm;
    //add new title
    if (tileId === "null") {
        itemForForm = new SectionItem();
    } else {
        //edit existing tile
        //find tile id in userdata and fill the ui form accordingly
        for (let s = 0; s < userData.sections.length; s++) {
            for (let sectionItem = 0; sectionItem < userData.sections[s].sectionItems.length; sectionItem++) {
                if (userData.sections[s].sectionItems[sectionItem].sectionItemId == tileId) {
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

function addNewTile() {
    let enteredData = getFormData();
    if (!state.errorRaised) {
        for (let s = 0; s < userData.sections.length; s++) {
            if (userData.sections[s].sectionId == tempSectionStore.currentSectionId) {
                userData.sections[s].sectionItems.push(enteredData);
            }
        }
        updateUI();
        dismissModalWindow();
    }
}

function getFormData(tileId) {
    let fieldUrl = document.getElementById("formInputFieldUrl").value;
    let fieldName = document.getElementById("formInputFieldName").value;
    let foundFieldUrlErrors = validate(fieldUrl, "URL");
    let foundFieldNameErrors = validate(fieldUrl, "Tile name");
    let allCurrentFormErrors = foundFieldUrlErrors.concat(foundFieldNameErrors);
    if (allCurrentFormErrors.length > 0) {
        alert(formErrorString(allCurrentFormErrors));
        state.errorRaised = true;
    } else {
        let fieldNameShort = document.getElementById("iconPreviewDiv").innerHTML;
        let fieldColorBg = document.getElementById("formInputFieldColorBg").value;
        let fieldColorFg = document.getElementById("formInputFieldColorFg").value;
        let fieldUUID = null;
        if (tileId == null)
            fieldUUID = UUIDGeneration.getUUID();
        fieldUUID = tileId;
        state.errorRaised = false;
        return new SectionItem(fieldUrl, fieldName, fieldNameShort, fieldColorBg, fieldColorFg, fieldUUID);
    }
}

function generateContextMenu(tileId, coordX, coordY, sectionId) {
    if (tileId !== "null") {
        let contextMenuDiv = ControlBuilder.build({
            tag: "div",
            className: "contextMenu", id: tileId,
            attribs: {
                sectionId: sectionId
            }
        });
        let strArr = ["Edit tile", "Delete"];
        let olElement = ControlBuilder.build({tag: "ol"});
        let ulElement;
        for (let i = 0; i < strArr.length; i++) {
            ulElement = ControlBuilder.build({
                tag: "ul",
                innerHTML: strArr[i],
                className: "contextMenuSelection"
            });
            if (!i) {
                ulElement.id = "contextMenuEdit";
            } else {
                ulElement.className = "warning";
                ulElement.id = "contextMenuDelete";
            }
            olElement.appendChild(ulElement);
        }
        contextMenuDiv.appendChild(olElement);
        document.body.appendChild(contextMenuDiv);
        contextMenuDiv.style.top = (coordY + contextMenuDiv.offsetHeight / 2) + "px";
        contextMenuDiv.style.left = coordX + "px";
    }
}

function removeTile(tileId) {
    for (let s = 0; s < userData.sections.length; s++) {
        for (let sectionItem = 0; sectionItem < userData.sections[s].sectionItems.length; sectionItem++) {
            if (userData.sections[s].sectionItems[sectionItem].sectionItemId === tileId) {
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
function editTile(tileId) {
    let enteredData = getFormData(tileId);
    for (let s = 0; s < userData.sections.length; s++) {
        for (let sectionItem = 0; sectionItem < userData.sections[s].sectionItems.length; sectionItem++) {
            if (userData.sections[s].sectionItems[sectionItem].sectionItemId === tileId) {
                delete userData.sections[s].sectionItems[sectionItem];
                userData.sections[s].sectionItems[sectionItem] = enteredData;
            }
        }
    }
    let tileForDeletion = document.getElementById(tileId);
    tileForDeletion.parentNode.removeChild(tileForDeletion);
    updateUI();
    dismissModalWindow();
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

function alignAutocomplete(autocompleteElement) {
    let formInputFieldName = document.getElementById("formInputFieldName");
    let formInputFieldNameOffsets = getOffset(formInputFieldName);
    autocompleteElement.style.left = formInputFieldNameOffsets.left + "px";
    autocompleteElement.style.top = formInputFieldNameOffsets.top + 30 + "px";
    return autocompleteElement;
}

function autocomplete(inp, arr) {
    let currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        var previewIconTextElement = document.getElementById("iconPreviewDiv");
        var formUrlFieldDisabled = document.getElementById("formInputFieldUrl");
        var formInputFieldName = document.getElementById("formInputFieldName");
        closeAllLists();
        var formInputFieldToAttachTo = document.getElementById("formInputFieldName");
        if (!val) {
            return false;
        }
        currentFocus = -1;
        a = ControlBuilder.build({
            tag: "div",
            attribs: {
                id: this.id + "autocomplete-list",
                class: "autocomplete-items"
            }
        });

        this.parentNode.appendChild(a);
        let currentWebApp;
        for (let webApp in webAppSuggestions) {
            if (webApp.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                currentWebApp = webApp;
                let webAppText = "<strong>" + webApp.substr(0, val.length) + "</strong>";
                webAppText += webApp.substr(val.length);
                webAppText += "<input type='hidden' value='" + webAppSuggestions[webApp][0] + "'>";

                /*create a DIV element for each matching element:*/
                b = ControlBuilder.build({
                    tag: "div",
                    id: "autoCompleteDiv",
                    innerHTML: webAppText,
                    event: {
                        name: "click",
                        handler: function (e) {
                            formInputFieldName.value = currentWebApp;
                            if (state.colorAutoDetectOn) {
                                detectAndApplyColors(document.getElementById("formInputFieldColorBg"),
                                    document.getElementById("formInputFieldColorFg"),
                                    formUrlFieldDisabled,
                                    document.getElementById("iconPreviewDiv"));
                            }
                            closeAllLists();
                        }
                    }
                });
                previewIconTextElement.innerHTML = webAppSuggestions[webApp][0];
                formUrlFieldDisabled.value = webAppSuggestions[webApp][1];
                //fill out hidden with full name input with webAppName id
                a.appendChild(b);
                a = alignAutocomplete(a);
                document.body.appendChild(a);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode === 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 13) {
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
            if (elmnt !== x[i] && elmnt !== inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function detectAndApplyColors(formFieldBg, formFieldFg, formFieldUrl, iconPreviewDiv) {
    //get link and get icon elements
    let webappDetected = false;
    if (formFieldUrl.value !== "") {
        for (let link in webAppColors) {
            if (!webappDetected) {
                if (link === formFieldUrl.value) {
                    webappDetected = true;
                    iconPreviewDiv.style.backgroundColor = webAppColors[link][0];
                    iconPreviewDiv.style.color = webAppColors[link][1];
                }
            } else {
                break;
            }
        }
    }
}

function removeSection(sectionId) {
    for (let i = 0; i < userData.sections.length; i++) {
        if (userData.sections[i].sectionId === sectionId) {
            userData.sections.splice(i, 1);
        }
    }
    let sectionForDeletion = document.getElementById(sectionId);
    sectionForDeletion.parentNode.removeChild(sectionForDeletion);
    updateUI();
}

function editSection(sectionId) {
    state.editSectionOn = true;
    let sectionForEditing = document.getElementById(sectionId);
    let children = sectionForEditing.childNodes;
    let row = children[0];
    let actualChildren = row.childNodes;
    console.log(actualChildren);
    for (let c of actualChildren) {
        if (c.className === "sectionHeaderName") {
            let requiredInputWidth = c.offsetWidth;
            let requiredInputHeight = c.offsetHeight;
            tempSectionStore.currentSectionName = c.innerHTML;
            c.innerHTML = "";
            let editInput = ControlBuilder.build({
                tag: "input",
                className: "editSectionName",
                id: "editName",
                attribs: {
                    type: "text",
                    name: "editName",
                    value: tempSectionStore.currentSectionName
                }
            });
            editInput.style.width = requiredInputWidth + "px";
            editInput.style.height = requiredInputHeight - 15 + "px";
            c.appendChild(editInput);
        }
    }
}

function changeSectionHeaderName(v, id) {
    for (let section of userData.sections) {
        if (section.sectionId === id) {
            section.sectionName = v;
        }
    }
}

function formErrorString(foundErrors) {
    let UIErrorString = "";
    foundErrors.forEach(item => UIErrorString += item + "\n");
    return UIErrorString;
}

function addNewSection() {
    let sectionCreationInputField = document.getElementById("newSectionName");
    let foundErrors = validate(sectionCreationInputField.value, "Section name");
    if (foundErrors.length > 0) {
        alert(formErrorString(foundErrors));
    } else {
        state.toggleSectionAreaVisibility(true);
        let newSection = new Section(sectionCreationInputField.value);
        createSection(newSection);
        userData.sections.push(newSection);
        addEventListenersDynamic();
    }
}

function openSettingsTab(evt, tabName) {
    console.log(`tabname: ${tabName}`);
    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    let selectedTab = document.querySelector(`div#all_tabs div[tab_type=${tabName}`);
    // Show the current tab
    selectedTab.style.display = "block";
    evt.currentTarget.className += " active";
}

function createFormRow(labelClassName,
                       labelString,
                       controlType,
                       controlParams,
                       eventType,
                       eventHandler) {
    let mainDivElement = ControlBuilder.build({tag: "div", className: "form-row"});
    let formLabel = ControlBuilder.build({
        tag: "label",
        classname: "form-row-label " + labelClassName,
        innerHTML: labelString
    });
    let formInputOptions = {
        tag: controlType,
        className: "form-row-input",
        attribs: {}, event: {},
    };

    for (let param in controlParams) {
        formInputOptions.attribs[param] = controlParams[param];
    }

    if (controlParams.type === "text") {
        //formLabel.style.width = "50px";
    }
    if (controlParams.type === "color") {
        formLabel.style.width = "110px";
    }
    mainDivElement.appendChild(formLabel);

    if (eventType !== "") {
        formInputOptions.event.name = eventType;
        formInputOptions.event.handler = eventHandler;
    }
    let formInput = ControlBuilder.build(formInputOptions);
    mainDivElement.appendChild(formInput);
    return {
        mainDiv: mainDivElement,
        label: formLabel,
        input: formInput
    };
}

var ControlBuilder = {
    build: function (control) {
        let e = document.createElement(control.tag);
        for (let prop in control) {
            if (!isObject(control[prop])) {
                e[prop] = control[prop];
            }
        }
        control.innerHTML !== undefined ? e.innerHTML = control.innerHTML : "";
        control.className !== undefined ? e.className = control.className : "";
        control.id !== undefined ? e.id = control.id : "";
        if (control.attribs !== undefined) {
            for (let attrib in control.attribs) {
                e.setAttribute(attrib, control.attribs[attrib])
            }
        }
        if (control.event !== undefined) {
            if (control.event.capture === undefined) {
                e.addEventListener(control.event.name,
                    control.event.handler);
            } else {
                e.addEventListener(control.event.name,
                    control.event.handler,
                    control.event.capture);
            }
        }
        return e;
    }
};

function isObject(o) {
    return typeof o;
}