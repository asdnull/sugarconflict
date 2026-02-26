chapterOrder = [];
storySelect = {
	id:0,
	section:"S01",
	type:"chapter",
	part:"A",
	elements:{

	}
}

function initStorySelect(){
	storySelect.elements.section = document.getElementById("story-select-section-select");
	storySelect.elements.part = document.getElementById("story-select-section-single");
	storySelect.elements.title = document.getElementById("story-select-chapter-title");
	storySelect.elements.subtitle = document.getElementById("story-select-section-title");
	storySelect.elements.epilogue = document.getElementById("story-select-section-epilogue");
	hideElem(storySelect.elements.part);
	buildStorySelect();

	if(document.getElementById("story-select-chapter-choices").children.length > 0){
		setChapterChoice(document.getElementById("story-select-chapter-choices").children[0]);
	}
}


function buildStorySelect()
{
	let chapterChoice = document.getElementById("story-select-chapter-choices");
	for(chapter of chapterOrder){
		if(chapter == null){
			continue;
		}
		chapter = storyData[chapter];
		let base = document.createElement("div");
		base.classList += "chapter-choice text-stroke no-select";
		if(chapter.type == "chapter"){
			let chapNameElem = document.createElement("div");
			chapNameElem.classList += "chapter-choice-name"
			chapNameElem.innerText = chapter.japName
			let chapNoElem = document.createElement("div");
			chapNoElem.classList += "chapter-choice-no"
			chapNoElem.innerText = chapter.chapter
			base.append(chapNameElem);
			base.append(chapNoElem);
			base.classList.add("chapter-choice-main");
		} else {
			base.style.backgroundImage = 'url("Story/banner/' + chapter.banner + '")'; 
		}
		base.setAttribute("storyId", chapter.id);
		base.setAttribute("storyType", chapter.type);
		chapterChoice.append(base);
	}
}


function getSelectedStoryData(){
	return storyData[chapterOrder[storySelect.id]];
}

function getSelectedStoryScripts(){
	return storyData[chapterOrder[storySelect.id]].SECTIONS[storySelect.section][storySelect.part];
}

function setChapterChoice(elem){
	for(let e of document.getElementsByClassName("chapter-choice-main-selected")){
		e.classList.remove("chapter-choice-main-selected");
	}
	for(let e of document.getElementsByClassName("chapter-choice-event-selected")){
		e.classList.remove("chapter-choice-event-selected");
	}
	if(elem.classList.contains("chapter-choice-main")){
		elem.classList.add("chapter-choice-main-selected");
	} else {
		elem.classList.add("chapter-choice-event-selected");
	}
	storySelect.type = elem.getAttribute("storytype");
	storySelect.id = elem.getAttribute("storyid");
	storySelect.section = "S01";
	storySelect.elements.title.innerText = getSelectedStoryData().japName;
	switchStoryMenu()
}

function setChapterSection(elem){
	storySelect.section = elem.getAttribute("section");
	storySelect.elements.subtitle.innerText = "SECTION " + storySelect.section.substr(1);
	unhideElem(storySelect.elements.part);
	unhideElem(storySelect.elements.epilogue);
	hideElem(storySelect.elements.section);
}

function setChapterPart(elem){
	storySelect.part = elem.getAttribute("part");
	scene.story.part = storySelect.part;
	scene.story.section = storySelect.section;
	scene.story.id = storySelect.id;
	scene.story.type = storySelect.type;
	let part = getSelectedStoryScripts();
	if(prefs.scene.eng && part.TRANSLATIONS != null){
		let tls = part.TRANSLATIONS;
		if(tls.length > 1){
			buildTLChoiceBoxStory(tls);
		} else {
			scene.script = tls[0].SCRIPT;
			scene.translated = true;
			scene.translator = tls[0].TRANSLATOR;
			scene.language = tls[0].LANGUAGE;
			scene.type = STORY_RPGX;
			loadSceneViewer();
		}
	} else {
		scene.script = part.SCRIPT;
		scene.type = STORY_RPGX;
		loadSceneViewer();
	}
}

function tlSelectStory(idx){
	killChildren(main.elements.tlChoiceBox);
	let choice = getSelectedStoryScripts().TRANSLATIONS[idx];
	scene.script = choice.SCRIPT;
	scene.translated = true;
	scene.translator = choice.TRANSLATOR;
	scene.language = choice.LANGUAGE;
	if(main.view.current == CG_VIEWER){
		exitCGViewMode();
	}
	scene.type = STORY_RPGX;
	loadSceneViewer();
}

function buildTLChoiceBoxStory(choices){
	killChildren(main.elements.tlChoiceBox);
	let btnClose = document.createElement("div");
	btnClose.classList = "tl-choice-close";
	main.elements.tlChoiceBox.appendChild(btnClose);
	btnClose.addEventListener("click", closeTLChoiceBox);
	let idx = 0;
	for(choice of choices){
		createTLChoiceStory(choice.LANGUAGE, choice.TRANSLATOR, idx);
		idx++
	}
	main.elements.tlChoiceBox.style.zIndex = "100";
	main.elements.tlChoiceBox.style.visibility = "initial";
}

function createTLChoiceStory(lang, tl, idx){
	let btn = document.createElement("div");
	btn.classList = "styled-btn";
	btn.style.fontSize = "18px";
	btn.innerText = lang + " - " + tl;
	main.elements.tlChoiceBox.appendChild(btn);
	btn.setAttribute("tlidx", idx);
	btn.addEventListener("click", function(){
		tlSelectStory(this.getAttribute("tlidx"));
	},false);
}

function switchStoryMenu(){
	switch(storySelect.type){
		case "chapter":
		case "story":
			hideElem(storySelect.elements.part);
			unhideElem(storySelect.elements.section);
		break
		case "raid":
		case "map":
		case "mini":
			storySelect.elements.subtitle.innerText = "SECTION 01";
			unhideElem(storySelect.elements.part);
			unhideElem(storySelect.elements.epilogue);
			hideElem(storySelect.elements.section);
		break;
		case "mini2":
			storySelect.elements.subtitle.innerText = "SECTION 01";
			unhideElem(storySelect.elements.part);
			hideElem(storySelect.elements.section);
			hideElem(storySelect.elements.epilogue);
		default:
			console.log("error")
		break;
	}
}

function hideElem(elem){
	elem.style.visibility = "hidden";
}

function unhideElem(elem){
	elem.style.visibility = "inherit";
}

STORY = {
	/*
	CHAPTER001:{
		japName:"反乱",
		engName:"",
		type:"chapter",
		chapter:1,
		id:0
	},
	CHAPTER002:{
		japName:"独立遊撃隊",
		engName:"",
		type:"chapter",
		chapter:2,
		id:1
	}
	*/
};