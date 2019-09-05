var state = {
    userSearchedAnything: false,
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

const imageResources = {
    IMG_REM_ICON: "img/delete.png",
    IMG_EDIT_ICON: "img/edit.png",
    IMG_CONF_ICON: "",
};

var userSettings = {};

const SETTINGS_VALUES = {
    SEARCH_BOX_ENABLED_BOOL: "searchBoxEnabledBool",
    CLOCK_ENABLED_BOOL: "clockEnabledBool",
    SEARCH_HISTORY_ENABLED_BOOL: "searchHistoryEnabledBool",
    CLOCK_SET_PATTERN_STR: "clockSetPatternStr",
    DEFAULT_SEARCH_ENGINE_INT: "defaultSearchEngineInt"
};

const textResources = {
    text: [["%a", "Abbreviated weekday name", "Thu"],
        ["%A", "Full weekday name", "Thursday"],
        ["%b", "Abbreviated month name", "Aug"],
        ["%B", "Full month name", "August"],
        ["%c", "Date and time representation", "Thu Aug 23 14:55:02 2001"],
        ["%C", "Year divided by 100 and truncated to integer (00-99)", "20"],
        ["%d", "Day of the month, zero-padded (01-31)", "23"],
        ["%D", "Short MM/DD/YY date", "08/23/01"],
        ["%e", "Day of the month, space-padded (1-31)", "23"],
        ["%F", "Short YYYY-MM-DD date", "2001-08-23"],
        ["%g", "Week-based year, last two digits (00-99)", "01"],
        ["%G", "Week-based year", "2001"],
        ["%h", "Abbreviated month name", "Aug"],
        ["%H", "Hour in 24h format (00-23)", "14"],
        ["%I", "Hour in 12h format (01-12)", "02"],
        ["%j", "Day of the year (001-366)", "235"],
        ["%m", "Month as a decimal number (01-12)", "08"],
        ["%M", "Minute (00-59)", "55"],
        ["%p", "AM or PM designation", "PM"],
        ["%r", "12-hour clock time *", "02:55:02 pm"],
        ["%R", "24-hour HH:MM time, equivalent to %H:%M", "14:55"],
        ["%S", "Second (00-61)", "02"],
        ["%T", "ISO 8601 time format (HH:MM:SS)", "14:55:02"],
        ["%u", "ISO 8601 weekday as number with Monday as 1 (1-7)", "4"],
        ["%U", "Week number with the first Sunday as the first day of week one (00-53)", "33"],
        ["%V", "ISO 8601 week number (01-53)", "34"],
        ["%w", "Weekday as a decimal number with Sunday as 0 (0-6)", "4"],
        ["%W", "Week number with the first Monday as the first day of week one (00-53)", "34"],
        ["%x", "Date representation", "08/23/01"],
        ["%X", "Time representation", "14:55:02"],
        ["%y", "Year, last two digits (00-99)", "01"],
        ["%Y", "Year", "2001"],
        ["%z", "ISO 8601 offset from UTC in timezone", "+100"],
        ["%Z", "Timezone name or abbreviation", "UTC"]
    ]
};

var userData;

var userSearchHistory = {
    searchList: []
};

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

function SysVars() {
    this._viewPortWidth = document.documentElement.clientWidth;
    this._viewPortHeight = document.documentElement.clientHeight;
    this.getViewPortWidth = function () {
        return this._viewPortWidth;
    };
    this.getViewPortHeight = function () {
        return this._viewPortHeight;
    };
}

const _sysVars = new SysVars();

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
    formError: function (errorType, fieldName) {
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
    let searchEngineOptionsDropDownHtml =
        document.getElementById("searchOptionsDropDown");
    for (let i = 0; i < searchEngines.engineOptions.length; i++) {
        searchEngineOptionsDropDownHtml.appendChild(
            ControlBuilder.build({
                    tag: "a",
                    href: "#",
                    attribs: {
                        s_id: i
                    },
                    innerHTML: searchEngines.engineOptions[i],
                    event: {
                        name: "click",
                        handler: function (e) {
                            setSearchLink(e);
                        }
                    },
                },
            )
        );
    }
    setSearchLink(null, userSettings.defaultSearchEngineInt);
}

//to do save selected search engine right away
function setSearchLink(e, def) {
    let chosenLink;
    e === null
        ?
        chosenLink = document
            .querySelectorAll("div#searchOptionsDropDown a").item(def)
        :
        chosenLink = e.target;
    let l = document.querySelectorAll("div#searchOptionsDropDown a");
    console.log(def);
    let html = document.getElementById("searchEngineChooseButton");
    html.innerHTML = chosenLink.innerHTML;
    let htmlElementFormLink = document.getElementById("searchForm");
    let htmlElementSearchField = document.getElementById("searchInputField");
    if (chosenLink.id == searchEngines.engineOptionsEnum.Yandex) {
        htmlElementSearchField.setAttribute("name", "text");
    }
    htmlElementFormLink.setAttribute("action",
        searchEngines.engineLinks[chosenLink.getAttribute("s_id")]);
}

function toggleComponentVisibility(componentId, val) {
    let component = document.getElementById(componentId);
    component.style.display = val ? "block" : "none";
}

function fetchSearchHistory() {
    if (userSearchHistory.searchList.length !== 0) {
        let historyHtmlElement = document.getElementById("userSearchHistoryList");
        toggleComponentVisibility("searchHistory", true);
        for (let searchItem of userSearchHistory.searchList) {
            let searchItemElement = ControlBuilder.build({
                tag: "li",
                attribs: {
                    id: searchItem.searchId
                }
            });
            searchItemElement.appendChild(
                ControlBuilder.build({
                    tag: "a",
                    target: "_blank",
                    href: searchItem.searchUrl,
                    innerHTML: searchItem.searchText
                })
            );
            searchItemElement.appendChild(
                ControlBuilder.build({
                    tag: "span",
                    className: "userSearchHistoryListTimeStamp",
                    innerHTML: constructSearchHistoryTimeStamp(searchItem)
                }));
            let searchItemElementManagementEnclosure = ControlBuilder.build(
                {tag: "span", className: "historyManagementRem"}
            );

            let searchItemElementManagementRemIcon = ControlBuilder.build({
                tag: "img",
                title: "Delete this search",
                attribs: {
                    src: imageResources.IMG_REM_ICON
                },
                event: {
                    name: "click",
                    handler: function () {
                        let itemIdToDelete = this.parentNode.parentNode.id;
                        let parent = document.getElementById("userSearchHistoryList");
                        parent.removeChild(this.parentNode.parentNode);
                        for (let s = 0; s < userSearchHistory.searchList.length; s++) {
                            if (userSearchHistory.searchList[s].searchId === itemIdToDelete) {
                                userSearchHistory.searchList.splice(s, 1);
                            }
                        }
                        if (userSearchHistory.searchList.length === 0) {
                            toggleComponentVisibility("searchHistory", false)
                        }
                    },
                    capture: false
                }
            });
            searchItemElementManagementEnclosure.appendChild(searchItemElementManagementRemIcon);
            searchItemElement.appendChild(searchItemElementManagementEnclosure);
            historyHtmlElement.appendChild(searchItemElement);
        }
    } else {
        toggleComponentVisibility("searchHistory", false);
    }
}

function initStartPage(mode) {

    fetchSearchHistory();
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
    generateSearchEngineOptions();
    initTimeScript();
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
    let settingsWindowTitle = ControlBuilder.build({tag: "div", innerHTML: "Settings", id: "modalWindowTitle"});
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
            let showSearchBox = createFormRow(
                "",
                "Search box enabled: ",
                controlTypes.REGULAR_INPUT,
                {
                    id: "generalInput",
                    type: "checkbox",
                    name: "input",
                }, "change",
                function () {
                    saveSettings(SETTINGS_VALUES.SEARCH_BOX_ENABLED_BOOL, this.checked);
                });
            let showSearchBoxMainDiv = showSearchBox.mainDiv;
            let showSearchBoxInput = showSearchBox.input;
            userSettings.searchBoxEnabledBool ? showSearchBoxInput.checked = true : "";
            actualTabContentWrapper.appendChild(showSearchBoxMainDiv);

            let showHistoryBox = createFormRow(
                "",
                "Show search history: ",
                controlTypes.REGULAR_INPUT,
                {
                    id: "generalInput",
                    type: "checkbox",
                    name: "input",
                }, "change",
                function () {
                    saveSettings(SETTINGS_VALUES.SEARCH_HISTORY_ENABLED_BOOL, this.checked);
                });
            let showHistoryMainDiv = showHistoryBox.mainDiv;
            let showHistoryInput = showHistoryBox.input;
            userSettings.searchHistoryEnabledBool ? showHistoryInput.checked = true : "";
            actualTabContentWrapper.appendChild(showHistoryMainDiv);
            let formRowEnclosure = ControlBuilder.build({tag: "div", className: "form-row"});

            let defSearchEngineLabel = ControlBuilder.build({
                tag: "label",
                innerHTML: "Default search engine: "
            });

            formRowEnclosure.appendChild(defSearchEngineLabel);
            let enclosingSelectTag = ControlBuilder.build({tag: "select"});
            for (let i = 0; i < searchEngines.engineOptions.length; i++) {
                enclosingSelectTag.options[enclosingSelectTag.options.length] = new Option(
                    searchEngines.engineOptions[i], searchEngines.engineOptions[i]);
            }
            console.log(enclosingSelectTag.selectedIndex);
            enclosingSelectTag.options.selectedIndex = userSettings.defaultSearchEngineInt;
            enclosingSelectTag.addEventListener("change",
                function () {
                    saveSettings(SETTINGS_VALUES.DEFAULT_SEARCH_ENGINE_INT,
                        enclosingSelectTag.options.selectedIndex);
                    setSearchLink(null, userSettings.defaultSearchEngineInt);
                }
                , false);
            formRowEnclosure.appendChild(enclosingSelectTag);
            actualTabContentWrapper.appendChild(formRowEnclosure);
            break;
        }
        case "Clock": {
            let clockElement = createFormRow("", "Clock enabled: ",
                controlTypes.REGULAR_INPUT, {
                    type: "checkbox",
                    name: "clockEnabled",
                }, "change", function () {
                    toggleComponentDisabled("dateFormatComponent", this.checked);
                    saveSettings(SETTINGS_VALUES.CLOCK_ENABLED_BOOL, this.checked);
                });
            let clockElementMainDiv = clockElement.mainDiv;
            let clockElementInput = clockElement.input;
            userSettings.clockEnabledBool ? clockElementInput.checked = true : "";
            actualTabContentWrapper.appendChild(clockElementMainDiv);

            let clockDateFormat =
                createFormRow("", "Date format: ",
                    controlTypes.REGULAR_INPUT,
                    {
                        type: "text",
                        name: "input",
                    });
            let clockDateFormatLabelMainDiv = clockDateFormat.mainDiv;
            clockDateFormatLabelMainDiv.id = "dateFormatComponent";
            clockDateFormat.input.style.width = "400px";
            clockDateFormat.input.value = userSettings.clockPatternStr;
            actualTabContentWrapper.appendChild(clockDateFormatLabelMainDiv);
            let timePatternSaveButton = ControlBuilder.build({
                tag: "button",
                id: "saveTimePattern",
                innerHTML: "Apply",
                event: {
                    name: "click",
                    handler: function () {
                        userSettings.clockPatternStr = clockDateFormat.input.value;
                        _state.patternLoaded = false;
                        _state.currentPattern = userSettings.clockPatternStr;
                    },
                    capture: false
                }
            });
            clockDateFormatLabelMainDiv.appendChild(timePatternSaveButton);
            let clockHelpElement = ControlBuilder.build({tag: "div", id: "timeHelp"})
            constructHelp(clockHelpElement);
            actualTabContentWrapper.appendChild(
                clockHelpElement
            );
            break;
        }
        case "About": {
            actualTabContentWrapper.appendChild(
                ControlBuilder.build({
                    tag: "div", innerHTML:
                        `Currently running within ${navigator.userAgent}
                        on ${navigator.platform}<br />
                        You are currently ${navigator.onLine ? 'online' : 'offline'}`
                })
            );
            break;
        }
    }
    return actualTabContentWrapper;
}


function toggleComponentDisabled(id, val) {
    let targetElement = document.getElementById(id);
    console.log(id);
    targetElement.childNodes.forEach(e => e.disabled = !val);
}

function saveSettings(setting, value) {
    userSettings[setting] = value;
    updateUI();
}

function constructHelp(parent) {
    let table = ControlBuilder.build({tag: "table", className: "transparentTable"});
    for (let item of textResources.text) {
        let row = ControlBuilder.build({tag: "tr"});
        let childTdArray = [];
        for (let innerItem of item) {
            childTdArray.push(ControlBuilder.build({
                tag: "td",
                innerHTML: innerItem
            }));
        }
        chainAppend(row, childTdArray);
        table.appendChild(row);
    }
    parent.appendChild(table);
}


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
    userSettings.clockEnabledBool = true;
    userSettings.defaultSearchEngineInt = 1;
    userSettings.searchBoxEnabledBool = true;
    userSettings.searchHistoryEnabledBool = true;
    userSettings.clockPatternStr = "%A, %B %Y | %H:%M:%S";
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
    if (userSettings !== null && userSettings !== undefined) {
        console.log();
        toggleComponentVisibility("clock", userSettings.clockEnabledBool);
        toggleComponentVisibility("search", userSettings.searchBoxEnabledBool);
        console.log(userSettings.searchHistoryEnabledBool);
        toggleComponentVisibility("searchHistory",
            state.userSearchedAnything ? userSettings.searchHistoryEnabledBool : false);
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
            src: imageResources.IMG_EDIT_ICON
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
            src: imageResources.IMG_REM_ICON
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
    document.getElementById("initSearchButton")
        .addEventListener("click",
            function () {
                this.parentNode.parentNode.submit();
                userSettings.searchHistoryEnabledBool ? recordUserSearch() : null;
                document.getElementById("searchInputField").value = "";
            },
            false);
}

function recordUserSearch() {
    state.userSearchedAnything = true;
    let userSearchText = document.getElementById("searchInputField").value;
    userSearchHistory.searchList.push({
        searchText: userSearchText,
        searchUrl: constructUrl(),
        searchTimestamp: constructTimestamp(),
        searchId: UUIDGeneration.getUUID()
    });
    toggleComponentVisibility("searchHistory", true);
    updateSearchHistory();
}

function removeSearchHistory() {
    let targetHistoryDiv = document.getElementById("userSearchHistoryList");
    targetHistoryDiv.innerHTML = "";
}


function updateSearchHistory() {
    removeSearchHistory();
    fetchSearchHistory();

}

function constructUrl() {
    let searchFormUrl = document
        .getElementById("searchForm")
        .getAttribute("action");
    let searchInputField = document
        .getElementById("searchInputField")
        .getAttribute("name");

    let searchInputFieldVal = document.getElementById("searchInputField").value;
    console.log(searchInputField);
    return searchFormUrl + "?" + searchInputField + "=" + searchInputFieldVal;
}

function constructTimestamp() {
    return {
        actualDateCreated: new Date(),
    }
}

//returns the number of days that have passed up until today
function getDaysAgoWithinMonth(dateCreated) {
    let dateNow = new Date();
    console.log(dateNow.getDate() - dateCreated.getDate());
    if (dateNow.getFullYear() === dateCreated.getFullYear() &&
        dateNow.getMonth() === dateCreated.getMonth()) {
        return dateNow.getDate() - dateCreated.getDate();
    } else {
        return 2;
    }

}

function constructSearchHistoryTimeStamp(searchItem) {
    let daysElapsed = getDaysAgoWithinMonth(searchItem.searchTimestamp.actualDateCreated);
    if (daysElapsed < 1) {
        return "Today @ " + searchItem.searchTimestamp.actualDateCreated.toLocaleString(
            "en-us", {hour: "2-digit", minute: "2-digit"});
    } else {
        if (daysElapsed === 1) {
            return "Yesterday @ " + searchItem.searchTimestamp.actualDateCreated.toLocaleString(
                "en-us", {hour: "2-digit", minute: "2-digit"});
        } else if (daysElapsed > 1) {
            return searchItem.searchTimestamp.actualDateCreated.toLocaleString("en-us",
                {weekday: "short", day: "2-digit", month: "short", year: "numeric"}) + " @ " +
                searchItem.searchTimestamp.actualDateCreated.toLocaleString("en-us", {
                    hour: "2-digit", minute: "2-digit"
                });
        }
    }
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
    let tileEditWindow = ControlBuilder.build({
        tag: "div",
        className: "tileEditWindow modalWindow"
    });
    let header = ControlBuilder.build({
        tag: "div",
        innerHTML: "Add new tile",
        id: "modalWindowTitle"
    });
    let formRowsEnclosure = ControlBuilder.build({tag: "div", id: "formRowsEnclosure"});
    let formRowUrl = createFormRow("", "",
        controlTypes.REGULAR_INPUT,
        {
            id: "formInputFieldUrl",
            type: "text",
            name: "url",
            value: sItem.sectionItemUrl,
            placeholder: "url"
        });

    let formRowName = createFormRow("", "",
        controlTypes.REGULAR_INPUT,
        {
            id: "formInputFieldName",
            type: "text",
            name: "name",
            value: sItem.sectionItemName,
            placeholder: "name"
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
        innerHTML: "AA",
        className: "linkTile editMode",
        id: "iconPreviewDiv"
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
            type: "color", "name": "colorBg",
            value: sItem.sectionItemColors[0],
            id: "formInputFieldColorBg",
            class: "colorPickerInput"
        },
        "input",
        () => {
            linkTileEditMode.style.backgroundColor = this.value;
        });

    let formColorPickerFg = createFormRow("colorPickerInputLabel",
        "foreground:",
        controlTypes.REGULAR_INPUT,
        {
            type: "color", "name": "colorFg",
            value: sItem.sectionItemColors[1],
            id: "formInputFieldColorFg",
            class: "colorPickerInput"
        },
        "input",
        () => {
            linkTileEditMode.style.color = this.value;
        });
    let formRowColorAutoDetect = createFormRow("",
        "autodetect color:",
        controlTypes.REGULAR_INPUT,
        {
            id: "colorAutoID",
            type: "checkbox",
            name: "colorAuto",
            value: sItem.sectionItemName,
            style: "width: 20px; height: 20px;"
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
    colorAutodetect.appendChild(formRowColorAutoDetect.mainDiv);
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
    console.log(tileId);
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
    console.log(
        `tabname: ${tabName}`
    );
    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tabLinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }

    let selectedTab = document.querySelector(
        `div#all_tabs div[tab_type=${tabName}`
    );
    // Show the current tab
    selectedTab.style.display = "block";
    evt.currentTarget.className += " active";
}

/*{
    tag: "label",
        text: "label text"
}
//array of required controls*/
function createFormRowNew(controls) {

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
            if (!isNested(control[prop])) {
                e[prop] = control[prop];
            }
        }
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

function isNested(o) {
    return o === "attribs" || o === "event";
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function activateDropDown() {
    document.getElementById("searchOptionsDropDown")
        .classList
        .toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName("availableDropDownOptions");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};