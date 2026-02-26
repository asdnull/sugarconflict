// Select a scene
// calls loadSceneViewer()
// calls prepareScene()
// calls preloadSceneResources()
// calls loadSceneResources()
// once all resources have loaded calls startScene()
// if a resource failed to load errors.

var scene = {
	id:0,
	//If the scene has animations in it or not, can be "1" or "0"
	//This is also set based on user preference, if the user has animations turned off, this will be "0", even for an animated scene
	animated:"0",
	script: [],
	commands:[],
	commandsActive:0,
	translated:false,
	language:"Japanese",
	translator:"None",
	processingGroup:false,
	mode: 0,
	index:0,
	actors:[],
	skippableAnimation:true,
	animatingElement:false,
	animatedElements:[],
	jsAnimatedElements:[],
	requestAnimationElements:[],
	requestAnimationScaleAsync:[],
	waitingStartTime:0,
	waitingDuration:0,
	waitingTimeElapsed:null,
	waitingTimer:null,
	movingActor:false,
	waitIndex:0,
	//voiceDur:0,
	voicedLine:false,
	waiting:false,
	bgmFade:0,
	nextAuto:0,
	nextSkip:0,
	type:"",
	choice:false,
	newBacklogItem:true,
	backlogOpen:false,
	textBoxHidden:false,
	labels:{},
	textBuffer:[],
	pauseIdx:0,
	outActors:[],
	//jumpIndexes:[],
	//otogiFlashed:false,
	//otogiFlashDur:0,
	alt:{
		flash:false,
		bg:false
	},
	empty:{
		bgs:false,
		textBox:false
	},
	fill:{
		textBox:false
	},
	elements:{

	},
	ctx:{

	},
	current:{
		bgmintro: new Audio(),
		bgm: new Audio(),
		//voice: new Audio(),
		voice: new AudioGroup("voice"),
		//bgVoice: new Audio(),
		//se: new Audio(),
		//bgSe: new Audio(),
		bgVoice: new AudioGroup("bgVoice"),
		se: new AudioGroup("se"),
		bgSe: new AudioGroup("bgSe"),
		//backlogVoice: new Audio(),
		backlogVoice: new AudioGroup("backlogVoice"),
		video: null,
		spineAnimation: null,
		animation: null,
		animationPlaybackSpeed: 1.0
	},
	prev:{
		bgm: new Audio(),
		voice: new Audio(),
		se: new Audio(),
	},
	/*
	transition:{
		startTime:0,
		nextDraw:0,
	},
	*/
	story:{
		id:0,
		section:"S01",
		part:"A",
		type:"chapter"
	},
	zoom:{
		scale: 1.0,
		posX: 0,
		posY: 0
	}
}

function prepareScene()
{
	//If the scene has animations in it or not, can be "1" or "0"
	scene.animated = sceneData[scene.id].SCRIPTS.PART1.ANIMATED;
	//If the user has animations turned off, then we should not play animations, even if the scene has them
	//This check is only done once here at the start of the scene, a user cannot change between animated on/off while the scene is currently playing
	if(!prefs.spineAnimation.on)
	{
		scene.animated="0";
	}

	//scene.jumpIndexes = [];
	scene.textBuffer = [];
	scene.pauseIdx = 0;
	if(scene.type == H_RPGX || scene.type == STORY_RPGX)
	{
		preSceneSetup();
		preloadSceneResources(scene.script);
		//createCanvases(scene.script);
	}
	scene.index = 0;
}

function preSceneSetup(){
	let pauses = 0;
	let lastPause = 0;
	let lastcmd = "";
	for(let[i, cmd] of scene.script.entries())
	{
		let match = cmd.match(/<(.*?)>(.*)/);

		/*
		if(cmd.startsWith("<TRANSITION>"))
		{
			let data = cmd.split(">")[1];
			let mask = data.split(",")[0].trim() + "_" + data.split(",")[1].trim();
			if(!maskData[mask]){
				main.elements.loadingFile.innerText = "Decompressing transition mask " + mask;
				decompressMask(mask);
			}
		}
		*/
		//else if (cmd.startsWith("<LABEL>"))
		if (cmd.startsWith("<LABEL>"))
		{
		  	let data = cmd.split(">")[1];
		  	scene.labels[data] = i;
	  }
		//} else if (cmd.indexOf("<") == -1){
		//Text events has no command, but the text may include a <param=PlayerName> tag to replace with the user's name
		else if (match===null || match.index!==0)
		{
			if(scene.textBuffer[pauses] == undefined){
				scene.textBuffer[pauses] = cmd+"<br />";
			} else {
				scene.textBuffer[pauses] += cmd+"<br />";
			}
			
		}
		/*
		else if ((cmd.includes("<EV>") || cmd.includes("<SELECT>")) && scene.jumpIndexes.slice(-1)[0] != lastPause)
		{
			scene.jumpIndexes.push(lastPause);
		}
		*/
		else if (cmd.includes("<PAUSE>"))
		{
			// continues to the next index as long as there's something in
			// that index
			// stays with the same index if there isn't due to a double <PAUSE>
			if(typeof(scene.textBuffer[pauses]) != "undefined"){
				pauses++;
			}
			lastPause = i;
		}
	}
}

function startScene()
{
	buildSceneViewer();
	main.view.current = SCENE_VIEWER;
	main.view.prev = SCENE_VIEWER;

	//console.log(scene.type);

	switchView();
	if(tlTools.active){
		loadTlTools([...scene.script]);
	}

	/*
	if(prefs.scene.straightToAction && (scene.type == H_RPGX))
	{
		jumpToAction(false);
	}
	else
	{
		if(prefs.scene.auto.start){
			toggleSceneAutoMode();
		}
		processSceneCommand();	
	}
	*/
	if(prefs.scene.auto.start){
		toggleSceneAutoMode();
	}
	processSceneCommand();	
}

function endScene()
{
	scene.current.bgm.pause();
	//scene.current.voice.pause();
	scene.current.voice.pauseAllRemoveAllAudio();
	//scene.current.bgVoice.pause();
	//scene.current.bgSe.pause();
	//scene.current.se.pause();
	scene.current.bgVoice.pauseAllRemoveAllAudio();
	scene.current.bgSe.pauseAllRemoveAllAudio();
	scene.current.se.pauseAllRemoveAllAudio();	

	//Stop playing video, if still running
	if(scene.current.video!==null){
		scene.current.video.pause();
		scene.current.video.onended = null;
	}
	scene.current.video = null;

	//Stop playing animation, if still running
	if(scene.alt.bg){
		stopAnimationIfExist(scene.elements.background);
	} else {
		stopAnimationIfExist(scene.elements.backgroundAlt);
	}

	//Stop playing async animations (requestAnimation), if still running
	for(let element of scene.requestAnimationScaleAsync)
	{
		cancelAnimationFrame(element.requestID);
		element.requestID=null;
	}
	scene.requestAnimationScaleAsync = [];

	//
	scene.current.animation=null;
	scene.current.animationPlaybackSpeed=1.0;

	scene.current.spineAnimation=null;
	//
	main.pause.voice = false;
	main.pause.bgVoice = false;
	main.pause.bgSe = false;
	main.pause.bgm = false;
	main.pause.se = false;

	main.view.current = SCENE_SELECT;
	main.view.prev = SCENE_SELECT;

	switchView();

	toggleOffSceneAutoMode();

	//scene.mode = 0;
	clearTimeout(input.touch.heldScene);
	//clearTimeout(scene.nextAuto);
	clearTimeout(scene.nextSkip);
	scene.actors = [];
	scene.alt.flash = false;
	scene.alt.bg = false;
	scene.skippableAnimation = true;
	scene.animatingElement = false;
	scene.index = 0;
	scene.paused = false;
	scene.processingGroup = false;
	scene.translated = false;
	scene.choice = false;
	scene.newBacklogItem = true;
	scene.backlogOpen = false;
	scene.textBoxHidden = false;
	scene.textBuffer = [];
	scene.pauseIdx = 0;
	scene.commands = [];
	scene.commandsActive = 0;
	scene.story.id = 0;
	scene.story.part = "A";
	scene.story.section = "S01";
	scene.story.type = "chapter";
	//scene.jumpIndexes = [];
	scene.outActors = [];
	scene.zoom={
		scale: 1.0,
		posX: 0,
		posY: 0
	};

	//console.log("Ending scene: "+(new Date().toTimeString()));

	//Clean up any eventual spine viewers
	//Remove spine players from the "preloading" container element
	emptySpinePreload();

	//scene.fill.textBox = false;
	sceneEventCleanup();
	killChildren(main.elements.viewer);
	emptyTempPreload();
	//emptyCanvasHold();

	if(tlTools.active){
		tlTools.elements.wrap.style.display = "none";
	}

	if(preload.failed){
		fileErrorPopup();
		preload.failed = false;
		preload.failedPaths = [];
	}

	loadSceneSelect();
}

function sceneEventCleanup()
{
	//Cancel waiting event, if one is active
	if(scene.waitingTimer!==null)
	{
		clearTimeout(scene.waitingTimer);
		scene.waitingTimer=null;		
		scene.waiting=false;
	}

	//If a current video exist and it has an "onended" event on it because of a "VIDEO_PLAY,wait" command
	//then remove the event and set the video to the last frame
	if(scene.current.video!==null && scene.current.video.onended!==null)
	{
		scene.current.video.onended=null;
		//This line would call the "onended" event if we didn't set it to null previously
		scene.current.video.currentTime=scene.current.video.duration;
	}

	//Remove CSS animations and empty the animated elements array
	for(let element of scene.animatedElements){
		//End the animation and call a callback if one was set when the animation gets removed
		removeAnimation(element);
	}
	scene.animatedElements = [];

	//Immediately finish JS animations, if any
	for(let element of scene.jsAnimatedElements) {
		//Setting the currentTime to the final duration will cause the JS animation to be set to it's final state
		//We can't call finish() because that would call the "finish" event callback asynchronously and we don't want that
		element.animInstance.currentTime = element.animInstance.effect.getTiming().duration;
		//This writes the current (Finished) values of the animation to the inline style attribute
		//So that we can remove the animation later but still have the element have the final animation values we want
		element.animInstance.commitStyles();
		//We can cancel the animation now after we have commited it's final values in the inline style property
		element.animInstance.cancel();
		element.animInstance=null;
	}
	scene.jsAnimatedElements = [];

	//Immediately finish any request animations, if any
	for(let element of scene.requestAnimationElements) {

		//Sets the element to it's final animation values
		element.reqAnimFinish();

		cancelAnimationFrame(element.requestID);
		element.requestID=null;		
	}
	scene.requestAnimationElements = [];

	//
	if(scene.empty.bgs){
		for (let child of scene.elements.backImages.children){
			killChildren(child)
		}
		scene.empty.bgs = false;
	}

	/*
	if(scene.transition.nextDraw > 0){
		cancelTransition(scene.transition.vis);
	}
	*/

	if(scene.movingActor){
		for(let actor of scene.actors){
			if(actor != null){
				cancelActorMovement(actor);
			}
		}
		scene.movingActor = false;
	}

	for(let idx of scene.outActors){
		scene.elements.actors.removeChild(scene.actors[idx]);
		delete scene.actors[idx];
	}
	scene.outActors = [];

	if(scene.newBacklogItem){
		scene.elements.backlogItem = document.createElement("div");
		scene.elements.backLogItemText = document.createElement("div");
		scene.elements.backLogItemName = document.createElement("div");
		scene.elements.backLogItemVoice = document.createElement("div");
		//The voice(s) paths to play on the backlog
		scene.elements.backLogItemVoice.paths=[];

		scene.elements.backlogItem.classList = "scene-backlog-item text-stroke";
		scene.elements.backLogItemText.classList = "scene-backlog-item-text";
		scene.elements.backLogItemName.classList = "scene-backlog-item-name";
		scene.elements.backLogItemVoice.classList = "scene-backlog-item-voice";

		scene.newBacklogItem = false;
	}
}

function processSceneCommand()
{
	/*
	if(main.view.current != SCENE_VIEWER){
		return;
	}
	*/

	if(tlTools.jumping){
		if(tlTools.jumpTo <= scene.index){
			tlTools.jumping = false;
			scene.skippableAnimation = true;

			if(tlTools.active){
				let block = document.activeElement.closest(".text-block")
				scene.elements.namePlate.innerText = block.getElementsByClassName("text-block-name")[0].value;
				scene.elements.textBoxText.innerText = block.getElementsByClassName("text-block-text")[0].value;
				return
			}
		}
	}

	sceneEventCleanup();
	let cmd;
	if(scene.index == scene.script.length){
		// Some scripts are missing the SCENARIO_END tag
		cmd = "<SCENARIO_END>";
	} else {
		cmd = scene.script[scene.index];
	}
	let tag = cmd.substr(1, cmd.lastIndexOf(">") -1);
	if(tag == "GROUP"){
		//console.log("Scene index group: "+scene.index+" tag: "+tag);
		scene.processingGroup = true;
		scene.index++;
		processSceneCommand();
	} else if(tag == "/GROUP"){
		//console.log("Scene index /group: "+scene.index+" tag: "+tag);
		scene.processingGroup = false;
		scene.index++;
		runSceneCommands();
	} else if(scene.processingGroup){
		scene.commands.push(cmd);
		scene.index++;
		processSceneCommand();
	} else {
		scene.commands.push(cmd);
		scene.index++;
		runSceneCommands();
	}
}

function progressScene()
{
	if(main.view.current != SCENE_VIEWER){
		return;
	}
	clearTimeout(scene.nextSkip);
	clearTimeout(scene.nextAuto);
	//if(scene.voicedLine && prefs.scene.cutVoice && !scene.current.voice.paused){
	if(scene.voicedLine && prefs.scene.cutVoice){
		//scene.current.voice.pause();
		scene.current.voice.pauseAllAudio();
	}
	scene.paused = false;
	scene.animatingElement = false;
	scene.waiting = false;
	scene.skippableAnimation = true;
	scene.voicedLine = false;
	//scene.voiceDur = 0;
	scene.elements.textBoxIcon.style.display = "none";
	scene.commands = [];
	scene.commandsActive = 0;

	processSceneCommand();
}

function buildSceneViewer(){
	// Event Listeners can get left behind and that can become a problem
	// so we just kill the viewer and rebuild it every time we need it.
	scene.elements.mainWrapper = document.createElement("div");

	scene.elements.backImages = document.createElement("div");
	//scene.elements.transition = document.createElement("canvas");
	//scene.elements.mask = document.createElement("canvas");
	//scene.elements.masked = document.createElement("canvas");
	scene.elements.background = document.createElement("div");
	scene.elements.backgroundAlt = document.createElement("div");
	scene.elements.videoWrapper = document.createElement("div");
	scene.elements.spineWrapper = document.createElement("div");
	scene.elements.spineImage = document.createElement("div");
	scene.elements.spine = document.createElement("div");
	scene.elements.flash = document.createElement("div");
	scene.elements.flashAlt = document.createElement("div");
	scene.elements.actors = document.createElement("div");
	scene.elements.textBox = document.createElement("div");
	scene.elements.textBoxBackground = document.createElement("div");

	scene.elements.namePlateContainer = document.createElement("div");
	scene.elements.namePlateBackground = document.createElement("div");

	scene.elements.namePlateWrapper = document.createElement("div");
	scene.elements.namePlateLeft = document.createElement("div");
	scene.elements.namePlate = document.createElement("div");
	scene.elements.namePlateRight = document.createElement("div");
	scene.elements.charIcon = document.createElement("div");
	scene.elements.textBoxStroke = document.createElement("div");
	scene.elements.textBoxText = document.createElement("div");
	scene.elements.textBoxIcon = document.createElement("div");
	scene.elements.autoInd = document.createElement("div");
	scene.elements.autoIndImg = document.createElement("div");
	scene.elements.autoIndDot = document.createElement("div");
	scene.elements.choiceBoxWrapper = document.createElement("div");
	scene.elements.choiceBox = document.createElement("div");
	scene.elements.backlog = document.createElement("div");
	scene.elements.backlogClose = document.createElement("div");

	scene.elements.spineOverlays = document.createElement("div");

	scene.elements.whiteOverlay = document.createElement("div");
	scene.elements.blackOverlay = document.createElement("div");
	scene.elements.colorOverlay = document.createElement("div");

	scene.elements.textBoxBelowPadding = document.createElement("div");

	scene.elements.mainWrapper.classList = "viewer-main-class main-wrapper";
	scene.elements.backImages.classList = "viewer-main-class viewer-back-images";
	//scene.elements.transition.classList = "viewer-main-class viewer-transition";
	//scene.elements.mask.classList = "viewer-main-class hidden viewer-mask";
	//scene.elements.masked.classList = "viewer-main-class hidden viewer-masked";
	scene.elements.background.classList = "viewer-main-class viewer-large-image";
	scene.elements.backgroundAlt.classList = "viewer-main-class viewer-large-image";
	scene.elements.videoWrapper.classList = "viewer-main-class viewer-video";
	scene.elements.spineWrapper.classList = "viewer-main-class viewer-spine-wrapper";
	scene.elements.spineImage.classList = "viewer-main-class viewer-spine-image";
	scene.elements.spine.classList = "viewer-main-class viewer-spine";
	scene.elements.flash.classList = "viewer-main-class viewer-flash";
	scene.elements.flashAlt.classList = "viewer-main-class viewer-flash-alt";
	scene.elements.actors.classList = "viewer-main-class viewer-actors";
	//scene.elements.textBox.classList = "text-box scene-text text-stroke no-select";
	scene.elements.textBox.classList = "text-box scene-text no-select";
	if(prefs.scene.textStroke) {
		scene.elements.textBox.classList.add("center-stroke");
	}

	scene.elements.textBoxBackground.classList = "text-box-background";
	
	//Start the name-plate-container element of as hidden
	//scene.elements.namePlateContainer.classList = "name-plate-container hide";
	scene.elements.namePlateContainer.classList = "name-plate-container";
	scene.elements.namePlateBackground.classList = "name-plate-background";

	scene.elements.namePlateWrapper.classList = "name-plate-wrapper";
	scene.elements.namePlateLeft.classList = "name-plate-left";
	scene.elements.namePlate.classList = "name-plate";
	scene.elements.namePlateRight.classList = "name-plate-right";
	scene.elements.charIcon.classList = "character-icon";
	scene.elements.textBoxStroke.classList = "text-box-text text-back";
	scene.elements.textBoxText.classList = "text-box-text text-front";
	scene.elements.textBoxIcon.classList = "text-box-icon";
	scene.elements.autoInd.classList = "text-box-auto-ind";
	scene.elements.autoIndImg.classList = "text-box-auto-ind-img";
	scene.elements.autoIndDot.classList = "text-box-auto-ind-dot";

	scene.elements.choiceBoxWrapper.id = "scene-choice-box-wrapper";
	scene.elements.choiceBox.id = "scene-choice-box";
	scene.elements.backlog.id = "scene-backlog";
	scene.elements.backlogClose.id = "scene-backlog-close";

	scene.elements.spineOverlays.id = "spine-overlays";

	scene.elements.whiteOverlay.id = "white-overlay";
	scene.elements.blackOverlay.id = "black-overlay";
	scene.elements.colorOverlay.id = "color-overlay";
	
	scene.elements.textBoxBelowPadding.id = "text-box-below-padding";
	//scene.elements.spine.id="spine-player";

	scene.elements.whiteOverlay.style.opacity = 0;
	scene.elements.blackOverlay.style.opacity = 0;
	scene.elements.colorOverlay.style.opacity = 0;

	//scene.elements.transition.style.zIndex = "7"
	//scene.elements.mask.style.zIndex = "-10";
	//scene.elements.masked.style.zIndex =  "-10";
	scene.elements.mainWrapper.style.zIndex = "6";
	scene.elements.background.style.zIndex = "2";
	scene.elements.backgroundAlt.style.zIndex = "1";
	scene.elements.flash.style.zIndex = "5"
	scene.elements.flashAlt.style.zIndex = "6"
	scene.elements.actors.style.zIndex = "4";
	//scene.elements.textBox.style.zIndex = "9"
	//The text box should be below the backlog, so 8 is better than 9
	scene.elements.textBox.style.zIndex = "8"
	scene.elements.backlog.style.zIndex = "8";
	scene.elements.videoWrapper.style.zIndex = "3";
	scene.elements.spineWrapper.style.zIndex = "3";
	
	scene.elements.spine.style.zIndex = "2";
	scene.elements.spineImage.style.zIndex = "1";

	//scene.elements.spine.style.width="960px";
	//scene.elements.spine.style.height="640px";

	//scene.elements.transition.width = 1280;
	//scene.elements.transition.height = 720;

	//scene.elements.mask.width = 1280;
	//scene.elements.mask.height = 720;
	//scene.elements.masked.width = 1280;
	//scene.elements.masked.height = 720;

	//scene.elements.autoInd.innerHTML = "Auto";

	if(scene.translated || tlTools.active){
		scene.elements.textBoxText.style.fontSize = "24px";
		scene.elements.textBoxText.style.fontFamily = "var(--eng-font)";
		scene.elements.textBoxText.style.lineHeight = "28px";
	}

	let dot1 = scene.elements.autoIndDot;
	let dot2 = scene.elements.autoIndDot.cloneNode(true);
	let dot3 = scene.elements.autoIndDot.cloneNode(true);
	dot1.classList.add("auto-dot-1");
	dot2.classList.add("auto-dot-2");
	dot3.classList.add("auto-dot-3");

	main.elements.viewer.appendChild(scene.elements.mainWrapper);
	scene.elements.mainWrapper.appendChild(scene.elements.backImages);
	//main.elements.viewer.appendChild(scene.elements.backImages);
	//scene.elements.backImages.appendChild(scene.elements.transition);
	scene.elements.backImages.appendChild(scene.elements.backgroundAlt);
	scene.elements.backImages.appendChild(scene.elements.background);
	scene.elements.backImages.appendChild(scene.elements.videoWrapper);
	scene.elements.backImages.appendChild(scene.elements.spineWrapper);
	//scene.elements.backImages.appendChild(scene.elements.actors);
	scene.elements.spineWrapper.appendChild(scene.elements.spine);
	scene.elements.spineWrapper.appendChild(scene.elements.spineImage);

	//scene.elements.backImages.appendChild(scene.elements.mask);
	//scene.elements.backImages.appendChild(scene.elements.masked);

	/*
	main.elements.viewer.appendChild(scene.elements.flashAlt);
	main.elements.viewer.appendChild(scene.elements.flash);
	main.elements.viewer.appendChild(scene.elements.actors);
	*/
	scene.elements.mainWrapper.appendChild(scene.elements.flashAlt);
	scene.elements.mainWrapper.appendChild(scene.elements.flash);
	scene.elements.mainWrapper.appendChild(scene.elements.actors);

	main.elements.viewer.appendChild(scene.elements.textBox);
	scene.elements.textBox.appendChild(scene.elements.textBoxBackground);
	scene.elements.textBox.appendChild(scene.elements.charIcon);
	
	//scene.elements.namePlateWrapper.appendChild(scene.elements.namePlateLeft);
	//scene.elements.namePlateWrapper.appendChild(scene.elements.namePlate);
	//scene.elements.namePlateWrapper.appendChild(scene.elements.namePlateRight);
	scene.elements.namePlateContainer.appendChild(scene.elements.namePlateLeft);
	scene.elements.namePlateContainer.appendChild(scene.elements.namePlateWrapper);
	scene.elements.namePlateContainer.appendChild(scene.elements.namePlateRight);

	scene.elements.namePlateWrapper.appendChild(scene.elements.namePlateBackground);
	scene.elements.namePlateWrapper.appendChild(scene.elements.namePlate);
	//

	//scene.elements.textBox.appendChild(scene.elements.namePlateWrapper);
	scene.elements.textBox.appendChild(scene.elements.namePlateContainer);

	scene.elements.textBox.appendChild(scene.elements.textBoxStroke);
	scene.elements.textBox.appendChild(scene.elements.textBoxText);
	scene.elements.textBox.appendChild(scene.elements.textBoxIcon);
	scene.elements.textBox.appendChild(scene.elements.autoInd);
	scene.elements.autoInd.appendChild(scene.elements.autoIndImg);
	scene.elements.autoInd.appendChild(dot1);
	scene.elements.autoInd.appendChild(dot2);
	scene.elements.autoInd.appendChild(dot3);
	main.elements.viewer.appendChild(scene.elements.choiceBoxWrapper);
	scene.elements.choiceBoxWrapper.appendChild(scene.elements.choiceBox);
	//main.elements.viewer.appendChild(scene.elements.choiceBox);
	main.elements.viewer.appendChild(scene.elements.backlog);
	scene.elements.backlog.appendChild(scene.elements.backlogClose)

	main.elements.viewer.appendChild(scene.elements.spineOverlays);

	main.elements.viewer.appendChild(scene.elements.whiteOverlay);
	main.elements.viewer.appendChild(scene.elements.blackOverlay);
	main.elements.viewer.appendChild(scene.elements.colorOverlay);

	main.elements.viewer.appendChild(scene.elements.textBoxBelowPadding);

	//scene.ctx.transition = scene.elements.transition.getContext("2d");

	//scene.ctx.mask = scene.elements.mask.getContext("2d");
	//scene.ctx.masked = scene.elements.masked.getContext("2d");

	scene.elements.backlogClose.addEventListener("click", function(e){
		e.stopPropagation();
		toggleOffBacklog();
	},false)
}

async function runSceneCommands(){
	if(main.view.current != SCENE_VIEWER){
		return;
	}
	for(let command of scene.commands){
		//let tag = command.substr(1, command.lastIndexOf(">") -1);
		//let tag = command.substr(command.indexOf("<") + 1, command.indexOf(">") - (command.indexOf("<") + 1));
		let tag="";
		let data="";
		//<param=PlayerName> can be the first thing in a text, so don't match any commands at the beginning that includes "="
		let match = command.match(/<([^=]*?)>(.*)/);
		//if(match!==null && match[1]==='param=PlayerName')
		//{
		//	debugger;
		//}
		//console.log(match);
		//A command must start at the beginning, so if no command is found or a command is found in the middle of the string, set the command to be empty
		if(match!==null && match.index===0){
			tag = match[1];
			data = match[2];
		}
		else{
			data = command;
		}

		//See if a scene has animations be checking: "scene.animated", which can be: "1" or "0"

		//console.log(tag);
		//let data = command.includes(">") ? command.split(">")[1] : command;
		//console.log(data);


		switch(tag){

			//Fix so it also zooms regular background/cg images + regular actors
			case "ZOOM":

				let zoomScale = Number(data.split(",")[0]);
				let zoomDuration = Number(data.split(",")[1]);
				let posX = Number(data.split(",")[2]);
				let posY = Number(data.split(",")[3]);

				//Set global variables that will later be used when creating an actor etc
				scene.zoom.scale=zoomScale;
				//scene.zoom.posX=-1*posX;
				scene.zoom.posX=posX;
				scene.zoom.posY=posY;

				//If there currently are async zoom animations that haven't finished yet, cancel them and set them to their final values first
				for(let element of scene.requestAnimationScaleAsync)
				{
					//Sets the element to it's final animation values
					element.reqAnimFinish();

					cancelAnimationFrame(element.requestID);
					element.requestID=null;
					element.reqAnimCallback=null;
				}
				scene.requestAnimationScaleAsync = [];

				//Scale and translate the main scene container, this will scale the background images
				//scene.elements.backImages.style.transform="translate("+scene.zoom.posX+"px, "+scene.zoom.posY+"px) scale("+scene.zoom.scale+")";

				//Scale all actors on screen, if there are any yet
				//Actors are also scaled when they are created incase the zoom commands occurs before the actor has entered the scene yet
				/*
				for(let i in scene.actors)
				{
					//Scale the character
					scene.actors[i].spinePlayer.skeleton.scaleX=scene.zoom.scale;
					scene.actors[i].spinePlayer.skeleton.scaleY=scene.zoom.scale;

					//Translate the character
					//scene.actors[i].spinePlayer.skeleton.x=posX;
					//scene.actors[i].spinePlayer.skeleton.y=posY;
				}
				*/
				//Find all elements that need to be scaled/translated
				let elements=[];

				//Find all relevant spines
				for(let i in preload.spines)
				{
					//If the spine is an spine actor or a spine scene (Spine CG), scale and translate it
					if(preload.spines[i].classList.contains("spine-actor") || preload.spines[i].classList.contains("spine-scene"))
					{
						elements.push(preload.spines[i]);
					}
				}

				//Animate the scale/move during duration in ms
				if(zoomDuration>0)
				{
					//scaleElementsAnimation() sets: scene.skippableAnimation = false;
					scaleElementsAnimation(elements, zoomScale, zoomDuration, posX*2, posY*2);
				}
				//Scale/move immediately
				else
				{
					for(let i=0; i<elements.length; i++)
					{
						//Scale and translate all relevant spines
						if(elements[i].classList.contains("spine-actor") || elements[i].classList.contains("spine-scene"))
						{
							elements[i].spinePlayer.skeleton.scaleX=scene.zoom.scale;
							elements[i].spinePlayer.skeleton.scaleY=scene.zoom.scale;
		
							//Since the spine origin is in the center? these values should be doubled
							elements[i].spinePlayer.skeleton.x=scene.zoom.posX*2;
							elements[i].spinePlayer.skeleton.y=scene.zoom.posY*2;
						}
					}
				}

				break;
				
			//Fix so it also zooms regular background/cg images + regular actors
			case "ZOOM_ASYNC":

				let zoomScale1 = Number(data.split(",")[0]);
				let zoomDuration1 = Number(data.split(",")[1]);
				let posX1 = Number(data.split(",")[2]);
				let posY1 = Number(data.split(",")[3]);

				//zoomDuration should not be 0 or less in the async "zoom" event variant, the sync version should be used then
				if(zoomDuration1<=0) {
					console.error("zoomDuration was 0 or less in event: ZOOM_ASYNC, was: "+zoomDuration1);
				}

				//Set global variables that will later be used when creating an actor etc
				scene.zoom.scale=zoomScale1;
				//scene.zoom.posX=-1*posX;
				scene.zoom.posX=posX1;
				scene.zoom.posY=posY1;

				//If there currently are async zoom animations that haven't finished yet, cancel them and set them to their final values first
				for(let element of scene.requestAnimationScaleAsync)
				{
					//Sets the element to it's final animation values
					element.reqAnimFinish();

					cancelAnimationFrame(element.requestID);
					element.requestID=null;
					element.reqAnimCallback=null;
				}
				scene.requestAnimationScaleAsync = [];

				//Scale and translate the main scene container, this will scale the background images
				//scene.elements.backImages.style.transform="translate("+scene.zoom.posX+"px, "+scene.zoom.posY+"px) scale("+scene.zoom.scale+")";

				//Scale all actors on screen, if there are any yet
				//Actors are also scaled when they are created incase the zoom commands occurs before the actor has entered the scene yet
				/*
				for(let i in scene.actors)
				{
					//Scale the character
					scene.actors[i].spinePlayer.skeleton.scaleX=scene.zoom.scale;
					scene.actors[i].spinePlayer.skeleton.scaleY=scene.zoom.scale;

					//Translate the character
					//scene.actors[i].spinePlayer.skeleton.x=posX;
					//scene.actors[i].spinePlayer.skeleton.y=posY;
				}
				*/
				//Find all elements that need to be scaled/translated
				let elements1=[];

				//Find all relevant spines
				for(let i in preload.spines)
				{
					//If the spine is an spine actor or a spine scene (Spine CG), scale and translate it
					if(preload.spines[i].classList.contains("spine-actor") || preload.spines[i].classList.contains("spine-scene"))
					{
						elements1.push(preload.spines[i]);
					}
				}

				//Animate the scale/move during duration in ms asynchronously
				scaleElementsAnimationAsync(elements1, zoomScale1, zoomDuration1, posX1*2, posY1*2);

			  break;
			
			//Only used by the preloader
			case "SPINE":

				/*
			  //Load spine and display it on screen
			  //Should be called every time new spine base files are used
				//If the scene has animations in it, but the user has animations turned off, ignore this command
				if(scene.animated==="0")
				{
					break;
				}

				//spineName is the Spine's unique filename
				let spineName = data.split(",")[0].trim();
				//the *.skel filename
				let skelFilename1 = data.split(",")[1].trim();
				//the *.atlas filename
				let atlasFilename1 = data.split(",")[2].trim();
				//animation name
				let animationName1 = data.split(",")[3].trim();
				//images used in the *.atlas file, seperated by pipe "|"
				//Ex: "character1.png|character2.png|character3.png"
				let atlasImages1 = data.split(",")[4].trim();
				let atlasImages=atlasImages1.split("|");
				let viewportType = data.split(",")[5].trim();
				//The skeleton's filetype (*.skel or *.json)
				let skelType = data.split(",")[6].trim();

				//Switch container elements
				let parentElement = scene.alt.bg ? scene.elements.backgroundAlt : scene.elements.background;

				//If a spine player already exist here, then put it back in the pre-loading container
				let spinePlayerItem=parentElement.querySelector(".spine-player-item");
				if(spinePlayerItem!==null)
				{
					main.elements.spineViewersHoldElem.appendChild(spinePlayerItem);
				}
				//Clear previous EV canvases, if any
				parentElement.innerHTML="";

				//Spine player div container element
				//console.log(scene.elements.spine);
				//Save the active current spine, since other spine commands after, like: "SPINE_PLAY", will act on that
				//preload.currentSpine=spineName;
				//Get already preloaded spine player element and add it to the scene spine container element
				//scene.elements.spine.appendChild(preload.spines[spineName]);
				parentElement.appendChild(preload.spines[spineName]);

				//Bring current canvas to the top
				parentElement.style.zIndex = "2";
				if(scene.alt.bg){
					scene.elements.background.style.zIndex = "1";
				} else {
					scene.elements.backgroundAlt.style.zIndex = "1";
				}

				//Show it instantly
				parentElement.style.opacity = "1";

				scene.alt.bg = !scene.alt.bg;
				*/
							
				break;

			//Play specific spine animation, and if it should be played once or loop continously
			//Non-blocking, weither it's looping or not
			case "SPINE_PLAY":
				//If the scene has animations in it, but the user has animations turned off, ignore this command
				/*
				if(scene.animated==="0")
				{
					break;
				}
				*/

				//spineName is the Spine's unique filename
				let spineName1 = data.split(",")[0].trim();
				//Fade type: "IN" or "NONE"
				let transitionType = data.split(",")[1].trim();
				//Speed in ms to transition or 0 for instantaneous display
				let transitionSpeed = Number(data.split(",")[2]);
				//Ex: spine_play,Wait,true,
				//animationName can be the empty string ""
				//in that case it means to remove the current animation, if any, from the specified animation track
				let animationName = data.split(",")[3].trim();
				//Default track: 0
				let animationTrack = Number(data.split(",")[4]);
				//To loop or just play the animation once
				let playState = data.split(",")[5].trim();
				playState = (playState==="true") ? true: false;
				//To start the new animation in a paused state, or just play it normally
				let startPaused = data.split(",")[6].trim();
				startPaused = (startPaused==="true") ? true: false;

				//If actors are still on the screen when a SPINE_PLAY event happens, then hide them
				//To fix bad scripts
				for(let j in scene.actors)
				{
					if(scene.actors[j].style.opacity==="1")
					{
						scene.actors[j].style.opacity="0";
					}
				}

				//The currently displayed element
				let displayedElement = scene.alt.bg ? scene.elements.background : scene.elements.backgroundAlt;

				//If the spine already exists in the current element then we don't need to add it or switch elements, just play the new animation
				//If the current element doesn't already contain this spine, then we add it to the back element then switch it to the front
				let spinePlayerItem=displayedElement.querySelector(".spine-player-item");
				if(spinePlayerItem===null || spinePlayerItem!==preload.spines[spineName1])
				{
					//Switch container elements
					//The background element that we use to load the new spine into and then switch to the front
					let parentElement = scene.alt.bg ? scene.elements.backgroundAlt : scene.elements.background;

					//If a spine player already exist here, then put it back in the pre-loading container
					spinePlayerItem=parentElement.querySelector(".spine-player-item");
					if(spinePlayerItem!==null)
					{
						main.elements.spineViewersHoldElem.appendChild(spinePlayerItem);
					}
					//Clear previous EV canvases, if any
					parentElement.innerHTML="";

					//Spine player div container element
					//console.log(scene.elements.spine);
					//Save the active current spine, since other spine commands after, like: "SPINE_PLAY", will act on that
					//preload.currentSpine=spineName;
					//Get already preloaded spine player element and add it to the scene spine container element
					//scene.elements.spine.appendChild(preload.spines[spineName]);
					parentElement.appendChild(preload.spines[spineName1]);

					//Bring current canvas to the top
					parentElement.style.zIndex = "2";
					if(scene.alt.bg){
						scene.elements.background.style.zIndex = "1";
					} else {
						scene.elements.backgroundAlt.style.zIndex = "1";
					}

					//Fadein/show spine
					if(transitionType==="IN")
					{
						animateElement(parentElement, transitionSpeed, "fade-in", function(){
							stopAnimationIfExist(displayedElement);
						});

						scene.skippableAnimation = false;
					}
					else if(transitionType==="NONE")
					{
						parentElement.style.opacity = "1";
						stopAnimationIfExist(displayedElement);
					}
					else
					{
						console.error("Unrecognized SPINE_PLAY transition type: "+transitionType);
					}

					//Show it instantly
					//parentElement.style.opacity = "1";

					scene.alt.bg = !scene.alt.bg;
					//
				}

				scene.current.spineAnimation=preload.spines[spineName1];

				//preload.spines[preload.currentSpine].spinePlayer.play();
				//preload.spines[preload.currentSpine].spinePlayer.skeleton.setToSetupPose();

				//Since we pause the animation that runs initially when preloading the spine, we must unpause it here first before calling setAnimation()
				preload.spines[spineName1].spinePlayer.paused=startPaused;
				//Set spine animation speed, 1.0 is the default speed
				preload.spines[spineName1].spinePlayer.setSpeed(prefs.viewer.animationSpeed / 100);

				//Animations can be changed when the player is paused, so the first frame of the new animation will still be displayed, which is what we want to happen
				//preload.spines[preload.currentSpine].spinePlayer.setAnimation(animationName, playState); 
				//"false" to set the animation to play once, "true" to set it to loop forever
				//We can play multiple animations at once on different tracks

				//Play animation on specified animation track
				//preload.spines[spineName1].spinePlayer.setViewport(animationName);
				preload.spines[spineName1].spinePlayer.animationState.setAnimation(animationTrack, animationName, playState);
				//We need to call calculateAnimationViewport() here otherwise the new animation won't be displayed if the animation is currently paused

				//calculateAnimationViewport(animationName) is the function definition in spine: 3.7, 3.8
				//for spine: 4.0, 4.1 the definition instead is: 
				//calculateAnimationViewport(animation, viewport)
				
				/*
				let version=preload.spines[spineName1].spinePlayer.skeleton.data.version;
				let versionParts=version.split(".");
				let mainVersion=Number(versionParts[0]+"."+versionParts[1]);

				if(mainVersion===3.7 || mainVersion===3.8)
				{
					preload.spines[spineName1].spinePlayer.calculateAnimationViewport(animationName);
				}
				else if(mainVersion===4.0 || mainVersion===4.1)
				{
					let viewport1=structuredClone(preload.spines[spineName1].viewport);
					preload.spines[spineName1].spinePlayer.calculateAnimationViewport(preload.spines[spineName1].spinePlayer.skeleton.data.findAnimation(animationName), viewport1);
				}
				else
				{
					console.error("Unrecognized spine version, was: "+version+", perhaps it's too new?");
				}
				*/
			
				//We need to call calculateAnimationViewport() here otherwise the new animation won't be displayed if the animation is currently paused
				//This seems to work correctly in testing
				
				//Are these uncommented lines below only needed for spine >= 4.0 or not at all needed anymore? 
				/*
				let viewport1=structuredClone(preload.spines[spineName1].viewport);

				let spinePlayer1=preload.spines[spineName1].spinePlayer;
				spinePlayer1.calculateAnimationViewport(spinePlayer1.skeleton.data.findAnimation(animationName), viewport1);
				*/

				break;

			//Remove the current animation from the specified animation track
			//The spine is already assumed to be added and displayed in the scene
			case "SPINE_STOP":

				//spineName is the Spine's unique filename
				let spineName2 = data.split(",")[0].trim();
				//Default track: 0, arguably you should never stop track: 0, only other tracks like: 1, 2 etc
				let animationTrack2 = Number(data.split(",")[1]);
				let mixDuration = Number(data.split(",")[2]);

				//addEmptyAnimation(int trackIndex, float mixDuration, float delay)
				//clearTrack(int trackIndex)
				preload.spines[spineName2].spinePlayer.animationState.setEmptyAnimation(animationTrack2, mixDuration);

			  break;

			//Add the spine overlay and play the specified animation
			case "SPINE_OVERLAY_PLAY":

				//spineName is the Spine's unique filename
				let spineName111 = data.split(",")[0].trim();
				//Ex: spine_play,Wait,true,
				let animationName111 = data.split(",")[1].trim();
				//Default track: 0
				let animationTrack111 = Number(data.split(",")[2]);
				//To loop or just play the animation once
				let playState111 = data.split(",")[3].trim();
				playState111 = (playState111==="true") ? true: false;

				//Get already preloaded spine player element and add it to the scene spine container element
				scene.elements.spineOverlays.appendChild(preload.spines[spineName111]);

				//Since we pause the animation that runs initially when preloading the spine, we must unpause it here first before calling setAnimation()
				preload.spines[spineName111].spinePlayer.paused=false;
				//Set spine animation speed, 1.0 is the default speed
				preload.spines[spineName111].spinePlayer.setSpeed(0.8);
				//Calling setAnimation() resets the new animation to the start again
				preload.spines[spineName111].spinePlayer.animationState.setAnimation(animationTrack111, animationName111, playState111);

				break;
				
			//Remove the spine overlay and stop any animations playing
			case "SPINE_OVERLAY_REMOVE":

				//spineName is the Spine's unique filename
				let spineName1111 = data.split(",")[0].trim();

				//Pause the animation
				preload.spines[spineName1111].spinePlayer.paused=true;
				//Removes all animations from all tracks (still leaves the "skeleton" in the current phase of the animation)
				preload.spines[spineName1111].spinePlayer.animationState.clearTracks();

				//Add the spine overlay back to the preload wrapper element
				main.elements.spineViewersHoldElem.appendChild(preload.spines[spineName1111]);

			  break;

			//FIX
			//Change spine skin
			case "SPINE_SKIN":

				//spineName is the Spine's unique filename
				let spineName11 = data.split(",")[0].trim();
				//Ex: FS
				let skinName = data.split(",")[1].trim();

				//Change skin
				preload.spines[spineName11].spinePlayer.skeleton.setSkinByName(skinName);
				//Must be called after otherwise the skin change isn't visible
				preload.spines[spineName11].spinePlayer.skeleton.setToSetupPose();

				break;
			/*
			case "SPINE_EFFECT":
				//Ex: spine_effect,7,
				let effectNr = Number(data.split(",")[0]);

				break;
			*/
			/*
			case "SPINE_WAIT":
				//If the scene has animations in it, but the user has animations turned off, ignore this command
				if(scene.animated==="0")
				{
					break;
				}

				//Ex: spine_wait,0.5,
				let duration11 = Number(data.split(",")[0]);

				break;
			*/

			//Adds and display a regular image in front of the spine animation
			case "SPINE_IMAGE":
				//If the scene has animations in it, but the user has animations turned off, ignore this command
				if(scene.animated==="0")
				{
					break;
				}

				//Ex: spine_image,hscene_r18/r18_123501_001,,
				let imagefile11 = data.split(",")[0].trim();

				//Clear any previous canvases, if any
				killChildren(scene.elements.spineImage);
				//Add a new one
				let clone1 = cloneCanvas(preload.canvas[imagefile11]);
				scene.elements.spineImage.appendChild(clone1);

				//Bring spine image element to front and spine animation player element to back
				scene.elements.spineImage.style.zIndex = "2";
				scene.elements.spine.style.zIndex = "1";

				break;

			//Add/change the character with a fade in
			case "SPINE_ACTOR":

			  //0, 1, 2 etc
				let spineActorIndex = Number(data.split(",")[0]);
				//Base spine filename, ex: 'ch_1003001_m0'
				let spineActorFilename = data.split(",")[1].trim();
				//Skin to use, ex: 'face4'. May be the empty string
				let spineActorSkin = data.split(",")[2].trim();
				//Animation to use, ex: 'wait'. May be the empty string
				let spineActorAnimation = data.split(",")[3].trim();
				//Not used right now
				let spineActorSubAnim = data.split(",")[4].trim();
				//Default track: 0
				let spineActorAnimationTrack = Number(data.split(",")[5]);
				//Duration to fade in
				let spineActorFadeDuration = Number(data.split(",")[6]);
				//Actor position. May be the empty string
				let spineActorPos = data.split(",")[7].trim();
				//How much to scale the actor, 1 being normal size
				let spineActorScale = Number(data.split(",")[8]);
				//The skeleton's filetype (*.skel or *.json)
				let spineActorskelType = data.split(",")[9].trim();

				//
				let spineActorID=spineActorFilename+"__"+spineActorIndex;
				/*
				//To loop or just play the animation once
				let spineActorPlayState = data.split(",")[6].trim();
				spineActorPlayState = (spineActorPlayState==="true") ? true: false;
				//To start the new animation in a paused state, or just play it normally
				let spineActorStartPaused = data.split(",")[6].trim();
				spineActorStartPaused = (spineActorStartPaused==="true") ? true: false;
				*/

				//let spineActorPos = data.split(",")[5].trim();
				//let spineActorPos2 = data.split(",")[6].trim();
				//let spineActorMoving = data.split(",")[7].trim();
				//let spineActorTiming = data.split(",")[8].trim();
				//let spineActorDuration = Number(data.split(",")[9]);

				//If this index has already been used but is now being used with a new spine filename, then replace the spine at this index with the new one
				if(scene.actors[spineActorIndex] && (scene.actors[spineActorIndex].baseFilename !== spineActorFilename))
				{
					//Add the old character spine viewer element back to the preload wrapper element first before it gets replaced
					scene.actors[spineActorIndex].spinePlayer.paused=true;
					main.elements.spineViewersHoldElem.appendChild(scene.actors[spineActorIndex]);
				}

				//If the character has been previously hidden, then show it again
				if(scene.actors[spineActorIndex] && (scene.actors[spineActorIndex].baseFilename === spineActorFilename) && (scene.actors[spineActorIndex].style.opacity==="0"))
				{
					if(spineActorFadeDuration > 0)
					{
						animateElement(scene.actors[spineActorIndex], spineActorFadeDuration, "fade-in", true, "linear");
						scene.skippableAnimation = false;
					}
					else
					{
						scene.actors[spineActorIndex].style.opacity="1";
					}
				}

				if(!scene.actors[spineActorIndex] || (scene.actors[spineActorIndex] && (scene.actors[spineActorIndex].baseFilename !== spineActorFilename)))
				{
					//Should I have the spine actors in the same array as h-scene spines?
					scene.actors[spineActorIndex]=preload.spines[spineActorID];
					//It's initially hidden
					scene.actors[spineActorIndex].style.opacity="0";
					//Set default position
					scene.actors[spineActorIndex].style.top="0px";
					scene.actors[spineActorIndex].style.left="0px";
					//Get already preloaded spine player element and add it to the scene actors container element
					scene.elements.actors.appendChild(scene.actors[spineActorIndex]);
					//Since we pause the animation that runs initially when preloading the spine, we must unpause it here first before calling setAnimation()
					//scene.actors[spineActorIndex].spinePlayer.paused=startPaused;
					scene.actors[spineActorIndex].spinePlayer.paused=false;				
					//Fade it in
					if(spineActorFadeDuration > 0)
					{
						animateElement(scene.actors[spineActorIndex], spineActorFadeDuration, "fade-in", true, "linear");
						scene.skippableAnimation = false;
					}
					else
					{
						scene.actors[spineActorIndex].style.opacity="1";
					}
				}

				//If position is passed, set it
				if(spineActorPos!=="")
				{
					//Spine actor position should be rewritten so it moves the character within the spine player, and not the canvas element
					//Because otherwise cutting of the image can occur during both positioning and scaling
					setActorPosition(scene.actors[spineActorIndex], spineActorPos);
				}

				//If an animation is set, play it
				if(spineActorAnimation!=="")
				{
				  //Animations can be changed when the player is paused, so the first frame of the new animation will still be displayed, which is what we want to happen
					scene.actors[spineActorIndex].spinePlayer.setAnimation(spineActorAnimation, true); 
					
					//We need to call calculateAnimationViewport() here otherwise the new animation won't be displayed if the animation is currently paused
					//This seems to work correctly in testing

					//Is this line below only necessary in spine > 4.0 or is it not necessary anymore?
					//let viewport111=structuredClone(scene.actors[spineActorIndex].viewport);

					//Translate the character, if necessary
					//spinePlayer11.skeleton.x=scene.zoom.posX;
					//spinePlayer11.skeleton.y=scene.zoom.posY;
	
					//Is this line below only necessary in spine > 4.0 or is it not necessary anymore?
					//spinePlayer11.calculateAnimationViewport(spinePlayer11.skeleton.data.findAnimation(spineActorAnimation), viewport111);
				}


				//Scale the character, 1.0 is default scale
				let spinePlayer11=scene.actors[spineActorIndex].spinePlayer;

				//Scale the character, if necessary. 
				//Apply any global zoom value that has been set by a <ZOOM> command before this event
				//OLD CODE
				//spinePlayer11.skeleton.scaleX=spineActorScale*scene.zoom.scale;
				//spinePlayer11.skeleton.scaleY=spineActorScale*scene.zoom.scale;
				//Since all the spines preloaded for the scene gets scaled when a 'ZOOM' command occurs, we only need to scale it with the actor's specific scale
				spinePlayer11.skeleton.scaleX=spinePlayer11.skeleton.scaleX*spineActorScale;
				spinePlayer11.skeleton.scaleY=spinePlayer11.skeleton.scaleY*spineActorScale;

				//If a skin is set, change it
				if(spineActorSkin!=="")
				{
					scene.actors[spineActorIndex].spinePlayer.skeleton.setSkinByName(spineActorSkin);
					//Needs to be called to fix some old attachments still being displayed
					scene.actors[spineActorIndex].spinePlayer.skeleton.setSlotsToSetupPose();
					//Is this necessary to call?
					scene.actors[spineActorIndex].spinePlayer.animationState.apply(scene.actors[spineActorIndex].spinePlayer.skeleton);
				}

			break;

			//Hide the character, instantly or with a fade out
			case "SPINE_ACTOR_OUT":

			  //0, 1, 2 etc
				let spineActorIndex1 = Number(data.split(",")[0]);
				//Duration to fade out
				let spineActorFadeDuration1 = Number(data.split(",")[1]);

				//If the character is already hidden, do nothing. To catch weird commands in script that shouldn't be there
				if(scene.actors[spineActorIndex1].style.opacity==="0") {
					break;
				}

				//scene.actors[spineActorIndex1].style.opacity="0";
				if(spineActorFadeDuration1 > 0)
				{
					animateElement(scene.actors[spineActorIndex1], spineActorFadeDuration1, "fade-out", true, "linear");
					scene.skippableAnimation = false;
				}
				else
				{
					scene.actors[spineActorIndex1].style.opacity="0";
				}

				break;

			//Add/change animation for a spine actor that has already been added
			case "SPINE_ACTOR_PLAY":

				//0, 1, 2 etc
				let spineActIndex = Number(data.split(",")[0]);
				//Animation to use, ex: 'wait'. May be the empty string
				let spineActAnimation = data.split(",")[1].trim();
				//Default track: 0
				let spineActAnimationTrack = Number(data.split(",")[2]);
				//To loop or just play the animation once
				let spineActplayState = data.split(",")[3].trim();
				spineActplayState = (spineActplayState==="true") ? true: false;
				//How much to scale the actor, 1 being normal size
				//let spineActScale = Number(data.split(",")[4]);

				if(!scene.actors[spineActIndex]) {
					console.error("Error, spine actor does not exist at index: "+spineActIndex);
				}

				let spinePlayer111=scene.actors[spineActIndex].spinePlayer;
				//Animations can be changed when the player is paused, so the first frame of the new animation will still be displayed, which is what we want to happen
				//spinePlayer111.setAnimation(spineActAnimation, true); 
				//spineActplayState: false to set the animation to play once, true to set it to loop forever
				spinePlayer111.animationState.setAnimation(spineActAnimationTrack, spineActAnimation, spineActplayState);
				
				//Scale the character, if necessary. 
				//Apply any global zoom value that has been set by a <ZOOM> command before this event
				//spinePlayer11.skeleton.scaleX=spineActScale*scene.zoom.scale;
				//spinePlayer11.skeleton.scaleY=spineActScale*scene.zoom.scale;

			  break;

			//Move spine actor with transition
			case "SPINE_ACTOR_MOVE":

				let spineActorIndex11 = Number(data.split(",")[0]);
				let spineActorPositionX = Number(data.split(",")[1]);
				let spineActorPositionY = Number(data.split(",")[2]);
				let spineActorDuration = Number(data.split(",")[3]);
				let spineActorRelativePos = data.split(",")[4].trim();
				spineActorRelativePos = (spineActorRelativePos==="TRUE") ? true: false;

				//Move spine actor animation should be rewritten so it moves the character within the spine player, and not the canvas element
				//Because otherwise cutting of the image can occur during both positioning and scaling
				moveActorAnimation(scene.actors[spineActorIndex11], spineActorPositionX, spineActorPositionY, spineActorDuration, spineActorRelativePos);

				break;

			case "ACTOR_SHAKE":

				let actorIndex = Number(data.split(",")[0]);
				let actorPosX = Number(data.split(",")[1]);
				let actorPosY = Number(data.split(",")[2]);
				let actorDuration = Number(data.split(",")[3]);

				shakeActorAnimation(scene.actors[actorIndex], actorPosX, actorPosY, actorDuration);

			  break;
			/*
			case "ACTOR":
				let actorIdx = Number(data.split(",")[0]);
				let actor = data.split(",")[1].trim();
				let actorPos = data.split(",")[2].trim();
				let actorPos2 = data.split(",")[3].trim();
				let actorMoving = data.split(",")[4].trim();
				let actorTiming = data.split(",")[5].trim();
				let actorDur = Number(data.split(",")[6]);

				if(!scene.actors[actorIdx])
				{
					scene.actors[actorIdx] = createActor(actor, actorPos2);
					scene.elements.actors.appendChild(scene.actors[actorIdx]);
				}

				if(actorMoving == "IN")
				{
					scene.actors[actorIdx].style.backgroundImage = "url('" + createImagePath(actor) + "')";
					setActorPosition(scene.actors[actorIdx], actorPos2);
					animateElement(scene.actors[actorIdx], actorDur, "fade-in", true, actorTiming);
					scene.skippableAnimation = false;
				}
				else if(actorMoving == "OUT")
				{
					if(scene.actors[actorIdx].style.opacity == "1")
					{
						animateElement(scene.actors[actorIdx], actorDur, "fade-out", true, actorTiming);
						scene.skippableAnimation = false;
					}
				}
				else if(actorMoving == "NONE" && actorDur > 0)
				{
					let matchIdx = scene.index;
					scene.actors[actorIdx].style.opacity = "1";
					scene.actors[actorIdx].style.backgroundImage = "url('" + createImagePath(actor) + "')";
					scene.actors[actorIdx].style.transition = actorTiming + " " + actorDur + "ms";
					//console.log(scene.actors[actorIdx].style.transition);

					setActorPosition(scene.actors[actorIdx], actorPos2);
					scene.skippableAnimation = false;
					scene.movingActor = true;
					let timeout = setTimeout(function() {
						if(matchIdx == scene.index)
						{
							scene.skippableAnimation = true;
							scene.animatingElement = false;
							progressScene();
						}
					}, actorDur);
				}
				else if(actorMoving == "NONE")
				{
					scene.actors[actorIdx].style.backgroundImage = "url('" + createImagePath(actor) + "')";
				}
				else
				{
					console.log("Unknown actor movement: " + actorMoving);
				}
			break;
			*/
			
			//Add actor, possible merged with a sprite image too
			case "ACTOR":
			  let dataParts=data.split(",");

				//Base actor image date
				let actorIdx = Number(dataParts[0]);
				let actorFilename = dataParts[1].trim();
				let actorPos = dataParts[2].trim();
				let actorPos2 = dataParts[3].trim();
				let actorMoving = dataParts[4].trim();
				let actorTiming = dataParts[5].trim();
				let actorDur = Number(dataParts[6]);
				let actorScale = Number(dataParts[7]);
				
				//An id as text/number representing the image file used for the actor.
				//If an actor is just 1 image, the id could just be: "1"
				//If an actor is required to be merged with a sprite image cut from a sprite sheet to be complete, the id should represent the final merged image, ex: "06" or "layer4"
				let actorImageId = dataParts[8].trim();

				if(!scene.actors[actorIdx])
				{
					scene.actors[actorIdx] = createActorWithSprite(actorImageId);
					scene.elements.actors.appendChild(scene.actors[actorIdx]);
				}			

				if(actorMoving == "IN")
				{
					scene.actors[actorIdx] = replaceActorWithSprite(actorImageId, scene.actors[actorIdx]);
					setActorScale(scene.actors[actorIdx], actorScale);

					setActorPositionX(scene.actors[actorIdx], actorPos2, actorScale);
					setActorPositionY(scene.actors[actorIdx], actorPos2, actorScale);

					animateElement(scene.actors[actorIdx], actorDur, "fade-in", true, actorTiming);
					scene.skippableAnimation = false;
				}
				else if(actorMoving == "NONE")
				{
					scene.actors[actorIdx] = replaceActorWithSprite(actorImageId, scene.actors[actorIdx]);
					setActorScale(scene.actors[actorIdx], actorScale);

					setActorPositionX(scene.actors[actorIdx], actorPos2, actorScale);
					setActorPositionY(scene.actors[actorIdx], actorPos2, actorScale);

					scene.actors[actorIdx].style.opacity="1";
				}
				else
				{
					console.log("Unknown actor movement: " + actorMoving);
				}
			break;

			//Hide/fade out actor then delete it from the: scene.actors list
			case "ACTOR_OUT":
				let actorOutIdx = Number(data.split(",")[0]);
				let actorOutPos = data.split(",")[1].trim();
				let actorOutTiming = data.split(",")[2].trim();
				let actorOutDur = Number(data.split(",")[3]);

				if(actorOutDur > 0)
				{
					animateElement(scene.actors[actorOutIdx], actorOutDur, "fade-out", true, actorOutTiming);
					scene.skippableAnimation = false;
				}
				else
				{
					scene.actors[actorOutIdx].style.opacity="0";
				}

				scene.outActors.push(actorOutIdx);
			break;

			case "ACTOR_FRONT":
				for(let actor of scene.actors){
					if(actor != null){
						actor.style.zIndex = "1";
					}
				}
				scene.actors[data].style.zIndex = "2";
			break

			case "ACTOR_PRIORITY":
				let actorArrIdx = data.split(",")[0];
				let actorPriority = data.split(",")[1].trim();

				scene.actors[actorArrIdx].style.zIndex = String(actorPriority);	
			break;

			case "SCREEN_SHAKE":

			  //Type, ie: "horizontal", "vertical", or "all"
				let shakeType = data.split(",")[0].trim();
				//Shake strength, ex: 0.1, 0.2 etc. Should not be 0.
				let shakeEffect = Number(data.split(",")[1]);
				let shakeDuration = Number(data.split(",")[2]);

				if(shakeEffect<=0.0) {
					console.error("shakeEffect in SCREEN_SHAKE not a valid value, was: "+shakeEffect);
				}

				let shakeAnimation="";
				switch(shakeType)
				{
					case "horizontal":
						
						shakeAnimation="quake-horizontal-scene";
						break;
					case "vertical":

						shakeAnimation="quake-vertical-scene";
						break;
					case "all":
				
						shakeAnimation="quake-overall-scene";
						break;
					default:
					  console.error("shakeType in SCREEN_SHAKE was not a recognized value, was: "+shakeType);
					  break;
				}

				//
				document.documentElement.style.setProperty("--quakeStrength", shakeEffect);

				animateElement(scene.elements.mainWrapper, shakeDuration, shakeAnimation, true, "steps(1)");
				scene.skippableAnimation = false;

			  break;

			case "VIDEO_PLAY":
				let filename1 = data.split(",")[0].trim();
				//loop, once or wait (wait means to wait until the video ends, then run the next command in the scene, ie it's blocking until it ends)
				let playbackType = data.split(",")[1].trim();
				//playbackSpeed: default is 1.0
				let playbackSpeed = Number(data.split(",")[2]);

				//If actors are still on the screen when a VIDEO_PLAY event happens, then hide them
				//To fix bad scripts
				for(let j in scene.actors)
				{
					if(scene.actors[j].style.opacity==="1")
					{
						scene.actors[j].style.opacity="0";
					}
				}

				//If a video exist already, then stop it and remove it first
				if(scene.current.video!==null)
				{
					scene.current.video.pause();
					//scene.current.video.currentTime=0;

					// Put the video back in the preload wrapper again and give it back it's preload class, because why not
					scene.current.video.classList="tempPreloadVideo";
					preload.tempElem.appendChild(scene.current.video);
				}

				//let video = document.createElement("video");
				//video.classList = "viewer-main-class viewer-video";
				let video = preload.temp[filename1];
				scene.current.video=video;

				//Set a new class, this also removes the "tempPreloadVideo" preloading class that would otherwise hide this video from displaying
				video.classList="video-item";

				video.currentTime=0;
				//Default playbackspeed is: 1.0
				video.playbackRate=playbackSpeed * (prefs.viewer.animationSpeed / 100);
				
				switch(playbackType)
				{
					case "loop":

						video.loop=true;
						break;
					case "once":

						video.loop=false;
						break;
					case "wait":

						video.loop=false;

						scene.skippableAnimation=false;
						let sceneIndex=scene.index;

						video.onended=function videoEndedListener(event){
							video.onended=null;
							//console.log("Video 'ended' event")

							if(scene.index == sceneIndex)
							{
							  scene.skippableAnimation=true;
								processSceneCommand();
							}
						};

						break;			
				}

				// This moves the preloaded video from the parent "preload-temp-elem" div, but that's fine
				scene.elements.videoWrapper.appendChild(video);

				video.play().catch(() => console.log("Failed to play video, this is probably normal if you are skipping fast"));
			break;
			case "VIDEO_STOP":

				if(scene.current.video!==null)
				{
					scene.current.video.pause();
					//scene.current.video.currentTime=0;

					// Put the video back in the preload wrapper again and give it back it's preload class, because why not
					scene.current.video.classList="tempPreloadVideo";
					preload.tempElem.appendChild(scene.current.video);

					scene.current.video=null;
				}
				/*
				let currentVideo=scene.elements.videoWrapper.querySelector("video");
				if(currentVideo)
				{
					currentVideo.pause();
					currentVideo.currentTime=0;

					// Put the video back in the preload wrapper again and give it back it's preload class, because why not
					currentVideo.classList="tempPreloadVideo";
					preload.tempElem.appendChild(currentVideo);
				}
				*/
			break;
			//Animation with image sprite files
			//Ex: <ANIM>10025004_output,1,40,3,2
			case "ANIM":

				let baseFilename = data.split(",")[0].trim(); 
				let fileStartIndex = Number(data.split(",")[1]);
				let numberOfParts = Number(data.split(",")[2]);
				let rows = Number(data.split(",")[3]);
				let columns = Number(data.split(",")[4]);

				let partsPerFile=rows*columns;

				let currentColumn=0;
				let currentFileIndex=fileStartIndex;

				//Animation image dimensions are: 2048x1728
				//Animation part dimensions are: 1024x576
				//1024x576 times 1.25 then becomes the original resolution: 1280x720, but the canvas drawImage api does the scaling for us
				//Find out the frame width and height by dividing the original image into equal parts based on the number of rows and columns
				let frameWidth=preload.temp[baseFilename+currentFileIndex].width / columns;
				let frameHeight=preload.temp[baseFilename+currentFileIndex].height / rows;

				//Switch background holders and bring the new one to the front
				let parentElement1 = scene.alt.bg ? scene.elements.backgroundAlt : scene.elements.background;
				
				//If a spine player already exist here, then put it back in the pre-loading container
				let spinePlayerItem1111=parentElement1.querySelector(".spine-player-item");
				if(spinePlayerItem1111!==null)
				{
					main.elements.spineViewersHoldElem.appendChild(spinePlayerItem1111);
				}

				scene.current.spineAnimation=null;

				//Remove all children from the background holder, if any
				killChildren(parentElement1);

				//If the old background holder has a canvas animation as a child, stop the animation immediately. 
				//We should not fade in a new animation over an old one that is currently running, that would look horrible
				parentElement1.style.zIndex = "2";
				if(scene.alt.bg){
					scene.elements.background.style.zIndex = "1";
					stopAnimationIfExist(scene.elements.background);
				} else {
					scene.elements.backgroundAlt.style.zIndex = "1";
					stopAnimationIfExist(scene.elements.backgroundAlt);
				}
					
				scene.alt.bg = !scene.alt.bg
				//bgElem.style.backgroundImage = "url('" + createImagePath(bgImg) + "')";

				//After old animations have been stopped, if any, fade in the currently running animation
				animateElement(parentElement1, 200, "fade-in", true);
				scene.skippableAnimation = false;
				//parentElement.style.opacity = "1";

				//Add a new canvas inside the background holder
				let animationCanvas=document.createElement("canvas");
				animationCanvas.classList.add("animation-canvas");

				animationCanvas.width=config.scene.width;
				animationCanvas.height=config.scene.height;

				parentElement1.appendChild(animationCanvas);

				//Save the playback speed on the element so that we can change it later if necessary
				//This effects the speed at which the element animates
				//animationCanvas.playbackSpeed=1.0;
				scene.current.animation=animationCanvas;

				//Show the first frame immediately, then set a timer to run indefinitely to loop the animation
				let ctx1 = animationCanvas.getContext("2d");
				ctx1.drawImage(preload.temp[baseFilename+currentFileIndex], 0, 0, frameWidth, frameHeight, 0, 0, config.scene.width, config.scene.height);

				//console.log("Drawing: File: "+(baseFilename+currentFileIndex)+", X: 0, Y: 0");

				//let startTime=null;
				let previousTime=null;

				//j starts from 1 since we have already drawn the first frame, since the first time requestAnimationFrame() executes,
				//the time difference will always be 0, so it won't render anything
				let j=1;
				//Save the interval id so that we can kill the animation later when a new event overrides it
				animationCanvas.intervalID=requestAnimationFrame(function step(timestamp){

					if(previousTime===null){
						previousTime=timestamp;
					}

					//Run it at X fps (config.scene.animationFrameTime between frames) by default. The speed is affected by the current animation speed set by ANIM_SPEED event and the players animation speed setting
					if((timestamp - previousTime) > Number.parseInt(config.scene.animationFrameTime / (scene.current.animationPlaybackSpeed * (prefs.viewer.animationSpeed / 100))))
					{
						//When we reach the end of the parts to animate, start over again from the beginning
						if(j===numberOfParts)
						{
							j=0;
							currentColumn=0;
							currentFileIndex=fileStartIndex;
						}

						//Change column when it has gone through all the rows, except on the first frame
						if((j !== 0) && (j % rows === 0))
						{
							currentColumn++;
						}
						//Don't update file index on the first frame
						if((j !== 0) && (j % partsPerFile === 0))
						{
							currentFileIndex++;
							//Reset column to 0 again on new file
							currentColumn=0;
						}				

						let bgPosX=frameWidth * currentColumn;
						let bgPosY=frameHeight * (j % rows);
			
						//Draw frame onto canvas
						//Set filename, changes when every frame of the file has been drawn
						//console.log("Drawing: File: "+(baseFilename+currentFileIndex)+", X: "+bgPosX+", Y: "+bgPosY);
						ctx1.drawImage(preload.temp[baseFilename+currentFileIndex], bgPosX, bgPosY, frameWidth, frameHeight, 0, 0, config.scene.width, config.scene.height);

						j++;
						//console.log("Running, timestamp: "+timestamp);

						previousTime=timestamp;
					}

					animationCanvas.intervalID=requestAnimationFrame(step);
					
				//}, 16ms); //60 frames per second  //Too fast
				//}, 33ms); //30 frames per second  //Too slow
			  });  //20ms //50 frames per second, //just right

				break;

			//Change the playback rate of the current animation, 1.0 is normal speed
			case "ANIM_SPEED":

				let animSpeed = Number(data.split(",")[0]);
				scene.current.animationPlaybackSpeed=animSpeed;

			break;

			case "BG":
				let bgImg = data.split(",")[0].trim();
				let bgMoving = data.split(",")[1].trim();
				let bgDur = Number(data.split(",")[2]);
				//Ex: 1.0
				let bgScale = Number(data.split(",")[3]);
				//Ex: 300 (in pixels), default is: 0
				let bgPosX  = Number(data.split(",")[4]);
				let bgPosY  = Number(data.split(",")[5]);
				
				let bgElem = scene.alt.bg ? scene.elements.backgroundAlt : scene.elements.background;
				let bgOldElem = scene.alt.bg ? scene.elements.background : scene.elements.backgroundAlt;

				//Seems to be the default value for when it's not specified.
				if(isNaN(bgDur)) {
					bgDur = 1000;
				}

				//If a spine player already exist here, then put it back in the pre-loading container
				let spinePlayerItem111=bgElem.querySelector(".spine-player-item");
				if(spinePlayerItem111!==null)
				{
					main.elements.spineViewersHoldElem.appendChild(spinePlayerItem111);
				}

				scene.current.spineAnimation=null;

				//Kill EV canvas image, if any
				killChildren(bgElem);

				if(bgImg.toLowerCase() == "black")
				{
					scene.elements.background.style.backgroundImage = "";
					scene.elements.backgroundAlt.style.backgroundImage = "";
					
					stopAnimationIfExist(bgOldElem);
					break;
				}
				//Actual image
				else
				{
					bgElem.style.zIndex = "2";
					if(scene.alt.bg){
						scene.elements.background.style.zIndex = "1";
					} else {
						scene.elements.backgroundAlt.style.zIndex = "1";
					}
					scene.alt.bg = !scene.alt.bg

					//Reset the values that might still be there from previous background images on the reused bg element
					bgElem.style.backgroundSize="";
					bgElem.style.backgroundPositionX="";
					bgElem.style.backgroundPositionY="";

					//Scale the background from it's default values, if scale is different from 1.0
					//Since we use calc(), the default background size css value must always be a percentage, ex: "100%"
					//Also because we use the bg size for calculations later for X and Y positions, it is preferible if bg size is in percentage
					let currentBgSize=getComputedStyle(bgElem).backgroundSize;
					if(!currentBgSize.endsWith("%")) {
						console.error("The background element's css background size must be a percentage, but was: "+currentBgSize);
					}
					bgElem.style.backgroundSize="calc("+currentBgSize+" * "+bgScale+")";

					//Position the background on the X scale
					let currentBgSizeAsNumber=parseFloat(currentBgSize)/100;
					
					let currentBgPosX=getComputedStyle(bgElem).backgroundPositionX;
					if(Number.isNaN(parseFloat(currentBgPosX))) {
						console.error("The background element's css background position X is not a length or a percentage, but was: "+currentBgPosX);
					}
					bgElem.style.backgroundPositionX="calc("+currentBgPosX+" + ("+bgPosX+"px / ("+currentBgSizeAsNumber+" * "+bgScale+")))";

					//Position the background on the Y scale
					let currentBgPosY=getComputedStyle(bgElem).backgroundPositionY;
					if(Number.isNaN(parseFloat(currentBgPosY))) {
						console.error("The background element's css background position Y is not a length or a percentage, but was: "+currentBgPosY);
					}
					bgElem.style.backgroundPositionY="calc("+currentBgPosY+" + ("+bgPosY+"px / ("+currentBgSizeAsNumber+" * "+bgScale+")))";

					//Set background image
					bgElem.style.backgroundImage = "url('" + createBgImagePath(bgImg) + "')";
				}

				//if(bgMoving != "NONE" && !scene.script[scene.index].includes("<TRANSITION>"))
				if(bgMoving==="IN")
				{
					//animateElement(bgElem, bgDur, "fade-in", true);
					animateElement(bgElem, bgDur, "fade-in", function(){
						stopAnimationIfExist(bgOldElem);
					});

					scene.skippableAnimation = false;
				}
				else if(bgMoving==="NONE")
				{
					bgElem.style.opacity = "1";

					stopAnimationIfExist(bgOldElem);
				}
				else
				{
					console.error("Unrecognized BG transition type: "+bgMoving);
				}

			break
			case "BG_OUT":

				if(scene.alt.bg)
				{
					//stopAnimationIfExist(scene.elements.backgroundAlt);
					scene.elements.backgroundAlt.style.background = "";
					killChildren(scene.elements.backgroundAlt);

					//If duration is 0, complete it immediately //Addition
					if(data==="0")
					{
						scene.elements.background.style.opacity=0;
						stopAnimationIfExist(scene.elements.background);
					}
					else
					{
						//If the background has already been hidden, do nothing, otherwise the "fade-out" will cause the background to be shown again during the fade out
						if(scene.elements.background.style.opacity!=="0")
						{
							//animateElement(scene.elements.background, data, "fade-out", true);
							animateElement(scene.elements.background, data, "fade-out", function(){
								stopAnimationIfExist(scene.elements.background);
							});
							scene.skippableAnimation = false;
						}
					}
				}
				else
				{
					//stopAnimationIfExist(scene.elements.background);

					scene.elements.background.style.background = "";
					killChildren(scene.elements.background);

					//If duration is 0, complete it immediately //Addition
					if(data==="0")
					{
						scene.elements.backgroundAlt.style.opacity=0;
						stopAnimationIfExist(scene.elements.backgroundAlt);
					}
					else
					{
						//If the background has already been hidden, do nothing, otherwise the "fade-out" will cause the background to be shown again during the fade out
						if(scene.elements.backgroundAlt.style.opacity!=="0")
						{
							//animateElement(scene.elements.backgroundAlt, data, "fade-out", true);
							animateElement(scene.elements.backgroundAlt, data, "fade-out", function(){
								stopAnimationIfExist(scene.elements.backgroundAlt);
							});

							scene.skippableAnimation = false;
						}
					}
				}
				scene.empty.bgs = true;
				
			break;

			case "BG_VOICE":

			  //The index to put the audio at, since several audios can exist and play at the same time
				let bgVoiceIndex = Number(data.split(",")[0]);
				let bgVoicefilename=data.split(",")[1].trim();
				//The volume to play the bg voice at, can be lower than 1 (100%)
				let bgVoiceVolume=Number(data.split(",")[2]);

				//Pause any previous audio that exist then set the new audio
				scene.current.bgVoice.pauseAndSetAudio(bgVoiceIndex, constructBgVoiceAudioPath(bgVoicefilename, scene.id));
				
				//Set's the audio's base volume, every volume change to the audio will be multiplied by it's base volume
				scene.current.bgVoice.setBaseVolume(bgVoiceIndex, bgVoiceVolume);
				scene.current.bgVoice.setVolume(bgVoiceIndex, prefs.audio.bgVoiceVolume / 100);
				scene.current.bgVoice.setLoop(bgVoiceIndex, true);
				scene.current.bgVoice.playAudio(bgVoiceIndex);

				//
				/*
				scene.current.bgVoice.pause();

				//Load the audio but don't wait for it to load, so we don't have any race conditions with "await" and the rest of the viewer
				//If you want to load the audio completely before playing then create a preloader for it instead of using "await"
				loadAudioNow(constructBgVoiceAudioPath(bgVoicefilename, scene.id), "bgvoice");
				//await loadAudioNow(constructBgVoiceAudioPath(bgVoicefilename, scene.id), "bgvoice");

				scene.current.bgVoice = preload.audio.bgvoice;
				scene.current.bgVoice.loop = true;
				scene.current.bgVoice.volume = prefs.audio.bgVoiceVolume / 100;
				scene.current.bgVoice.play().catch(() => console.log("Failed to play audio, this is probably normal"));
				*/

			break;

			case "BG_VOICE_STOP":

				let bgVoiceIndex1 = Number(data.split(",")[0]);

				scene.current.bgVoice.setVolume(bgVoiceIndex1, 0);
				scene.current.bgVoice.pauseAudio(bgVoiceIndex1);
				//scene.current.bgVoice.volume = 0;
				//scene.current.bgVoice.pause();
			break;

			case "BG_SE_PLAY":

				//The index to put the audio at, since several audios can exist and play at the same time
				let bgSeIndex = Number(data.split(",")[0]);
				let bgSeFilename=data.split(",")[1].trim();
				//The volume to play the bg se at, can be lower than 1 (100%)
				let bgSeVolume=Number(data.split(",")[2]);

				//Pause any previous audio that exist then set the new audio
				scene.current.bgSe.pauseAndSetAudio(bgSeIndex, constructBgSeAudioPath(bgSeFilename, scene.id));
				
				//Set's the audio's base volume, every volume change to the audio will be multiplied by it's base volume
				scene.current.bgSe.setBaseVolume(bgSeIndex, bgSeVolume);
				scene.current.bgSe.setVolume(bgSeIndex, prefs.audio.bgSeVolume / 100);
				scene.current.bgSe.setLoop(bgSeIndex, true);
				scene.current.bgSe.playAudio(bgSeIndex);
				//
				/*
				scene.current.bgSe.pause();

				//Load the audio but don't wait for it to load, so we don't have any race conditions with "await" and the rest of the viewer
				//If you want to load the audio completely before playing then create a preloader for it instead of using "await"
				loadAudioNow(constructBgSeAudioPath(bgSeFilename, scene.id), "bgse");
				//await loadAudioNow(constructBgSeAudioPath(bgSeFilename, scene.id), "bgse");

				scene.current.bgSe = preload.audio.bgse;
				scene.current.bgSe.loop = true;
				scene.current.bgSe.volume = prefs.audio.bgSeVolume / 100;
				scene.current.bgSe.play().catch(() => console.log("Failed to play audio, this is probably normal"));
				*/

			break;

			case "BG_SE_STOP":

				let bgSeIndex1 = Number(data.split(",")[0]);

				scene.current.bgSe.setVolume(bgSeIndex1, 0);
				scene.current.bgSe.pauseAudio(bgSeIndex1);
				//scene.current.bgSe.volume = 0;
				//scene.current.bgSe.pause();
			break;

			case "BGM_PLAY":

				let loopFilename=data.split(",")[0].trim();
				let bgmFade = Number(data.split(",")[1].trim());
				//introFilename: The filename of an intro file, or if no intro file should be played it will be the empty string
				let introFilename = data.split(",")[2].trim();

				clearInterval(scene.bgmFade);
				scene.current.bgm.pause();

				//Load the audio but don't wait for it to load, so we don't have any race conditions with "await" and the rest of the viewer
				//If you want to load the audio completely before playing then create a preloader for it instead of using "await"
				loadAudioNow(constructBGMAudioPath(loopFilename), "bgm");
				//await loadAudioNow(constructBGMAudioPath(loopFilename), "bgm");

				//No intro file, then just play the main bgm and loop it forever
				if(introFilename==="")
				{
					scene.current.bgm = preload.audio.bgm;
					scene.current.bgm.loop = true;
				}
				//If intro file exist, play that first, then the main bgm and loop it when the intro finishes
				else
				{
					//Remove previously attached "ended" listener, if any
					preload.audio.bgmintro.removeEventListener("ended", introEndedListener);

					//Load the audio but don't wait for it to load, so we don't have any race conditions with "await" and the rest of the viewer
					//If you want to load the audio completely before playing then create a preloader for it instead of using "await"
					loadAudioNow(constructBGMAudioPath(introFilename), "bgmintro");
					//await loadAudioNow(constructBGMAudioPath(introFilename), "bgmintro");

					scene.current.bgm = preload.audio.bgmintro;
					scene.current.bgm.loop = false;

					//When the intro bgm finishes playing (and is in a paused state), then play the main bgm and loop it forever
					scene.current.bgm.addEventListener("ended", introEndedListener, {
						"once": true
					});
				}			

				scene.current.bgm.volume = prefs.audio.bgmVolume / 100;
				scene.current.bgm.play().catch(() => console.log("Failed to play audio, this is probably normal"));

				if((prefs.audio.bgmVolume > 0) && (bgmFade > 0))
				{
					scene.current.bgm.volume = 0;
					scene.bgmFade = setInterval(function(){
						if(scene.current.bgm.volume >= prefs.audio.bgmVolume / 100){
							scene.current.bgm.volume = prefs.audio.bgmVolume / 100;
							clearInterval(scene.bgmFade);
						} else {
							let bgmInc = Math.round(((prefs.audio.bgmVolume / 100) / (bgmFade / 100)) * 1000) / 1000;
							// Make sure volume doesn't go over 100%
							scene.current.bgm.volume + bgmInc > prefs.audio.bgmVolume / 100 ? scene.current.bgm.volume = prefs.audio.bgmVolume / 100 : scene.current.bgm.volume += bgmInc;
						}
					}, 100);
				}

			break;
			case "BGM_STOP":
				let bgmFade1 = Number(data.split(",")[0].trim());

				clearInterval(scene.bgmFade);

				//if(scene.current.bgm.volume > 0 && !scene.current.bgm.paused)
				if((scene.current.bgm.volume > 0) && !scene.current.bgm.paused && (bgmFade1 > 0))
				{
					scene.bgmFade = setInterval(function(){
						if(scene.current.bgm.volume > 0)
						{
							//let bgmDec = Math.round(((prefs.audio.bgmVolume / 100) / (data / 100)) * 1000) / 1000;
							let bgmDec = Math.round(((prefs.audio.bgmVolume / 100) / (bgmFade1 / 100)) * 1000) / 1000;
							scene.current.bgm.volume - bgmDec < 0 ? scene.current.bgm.volume = 0 : scene.current.bgm.volume -= bgmDec;
						}
						else
						{
							scene.current.bgm.volume = 0;
							scene.current.bgm.pause();

							clearInterval(scene.bgmFade);
						}
					}, 100);
				}
				else
				{
					scene.current.bgm.volume = 0;
					scene.current.bgm.pause();
				}
			break;
			case "DEBUG_STOP":
				// 2019/09/12 Appears in Scene 0053_2, just here to stop it
				// logging to console, probably just something that wasn't
				// removed when they were trying to get the scene to work
				// properly
			break;
			case "EFFECT_FLASH":
				if(tlTools.jumping){
					break;
				}
				let flashColor = data.split(",")[0].trim();
				let flashDur = data.split(",")[1].trim();
				let flashElem = scene.alt.flash ? scene.elements.flashAlt : scene.elements.flash;

				// CSS animations need a bit of time to reset so when
				// consecuitive flashes occur the second one won't play.
				// To fix this we just alternate the flash element and
				// by the time it's needed again it will have reset.
				flashElem.style.zIndex = "6";
				if(scene.alt.flash){
					scene.elements.flash.style.zIndex = "5";
				} else {
					scene.elements.flashAlt.style.zIndex = "5";
				}
				scene.alt.flash = !scene.alt.flash;

				flashElem.style.backgroundColor = flashColor;
				animateElement(flashElem, flashDur, "fade-out", true);
			break;
			case "EFFECT_QUAKE":
				if(tlTools.jumping){
					break;
				}
				let quakeAxis = data.split(",")[0].trim();
				let quakeStrength = data.split(",")[1].trim();
				let quakeDur = data.split(",")[2].trim();
				document.documentElement.style.setProperty("--quakeStrength", quakeStrength);
				if(quakeAxis == "HORIZONTAL"){
					animateElement(scene.elements.actors, quakeDur, "quake-horizontal-actor", true, "steps(1)");
					animateElement(scene.elements.backImages, quakeDur, "quake-horizontal-scene", true, "steps(1)");
					scene.skippableAnimation = false;
				} else if(quakeAxis == "VERTICAL"){
					animateElement(scene.elements.actors, quakeDur, "quake-vertical-actor", true, "steps(1)");
					animateElement(scene.elements.backImages, quakeDur, "quake-vertical-scene", true, "steps(1)");
					scene.skippableAnimation = false;
				} else if(quakeAxis == "OVERALL"){
					animateElement(scene.elements.backImages, quakeDur, "quake-overall-scene", true, "steps(1)");
					scene.skippableAnimation = false;
				} else {
					console.log("Unknown quake axis: " + quakeAxis + " needs to be added.")
				}
			break;
			case "EV":

				//If the scene has animations in it, don't run regular EV commands, so ignore this command
				//if(scene.animated==="1")
				//{
			  //  console.log("Scene has animations");
				//	break;
				//}

				let evFilename = data.split(",")[0].trim();
				let evMoving = data.split(",")[1].trim();
				let evDur = Number(data.split(",")[2]);
				//If an EV event has a filename2 arg that is not the empty string, then we should merge the first filename with the second filename
				//Since this is then a canvas that has been created from 2 images that have been merged together in the preloader
				let evFilename2 = data.split(",")[3].trim();

				let evName=evFilename;
				if(evFilename2!=="")
				{
					evName+="|"+evFilename2;
				}
				//

				let parentElem = scene.alt.bg ? scene.elements.backgroundAlt : scene.elements.background;
				let oldParentElem = scene.alt.bg ? scene.elements.background : scene.elements.backgroundAlt;
				
				//If a spine player already exist here, then put it back in the pre-loading container
				let spinePlayerItem1=parentElem.querySelector(".spine-player-item");
				if(spinePlayerItem1!==null)
				{
					main.elements.spineViewersHoldElem.appendChild(spinePlayerItem1);
				}

				scene.current.spineAnimation=null;

				//Clear previous EV canvases, if any
				parentElem.innerHTML="";
				//killChildren(parentElem);

				let clone = cloneCanvas(preload.canvas[evName]);
				parentElem.appendChild(clone);

				// Bring current canvas to the top
				parentElem.style.zIndex = "2";
				if(scene.alt.bg){
					scene.elements.background.style.zIndex = "1";
				} else {
					scene.elements.backgroundAlt.style.zIndex = "1";
				}
				scene.alt.bg = !scene.alt.bg;

				// Animate canvas
				if(evMoving==="IN")
				{
					//animateElement(parentElem, evDur, "fade-in", true);
					animateElement(parentElem, evDur, "fade-in", function(){
						stopAnimationIfExist(oldParentElem);
					});

					scene.skippableAnimation = false;
				}
				else if(evMoving==="OUT")
				{
					animateElement(parentElem, evDur, "fade-out", true);
					scene.skippableAnimation = false;
				}
				else if(evMoving==="NONE")
				{
					parentElem.style.opacity = "1";
					stopAnimationIfExist(oldParentElem);
				}
				else
				{
					console.error("Unrecognized EV transition type: "+evMoving);
				}

				break;
				
			//Remove all BG, EV and SPINE containers that are or have been displayed
			//This basically puts the viewer back in a state where nothing has been displayed yet, resembling the start of the scene
			case "BG_REMOVE_ALL":

				//Remove any SPINE animations, and put them back in the pre-loading container
				let spinePlayerItem11=scene.elements.background.querySelector(".spine-player-item");
				if(spinePlayerItem11!==null)
				{
					main.elements.spineViewersHoldElem.appendChild(spinePlayerItem11);
				}
				spinePlayerItem11=scene.elements.backgroundAlt.querySelector(".spine-player-item");
				if(spinePlayerItem11!==null)
				{
					main.elements.spineViewersHoldElem.appendChild(spinePlayerItem11);
				}

				scene.current.spineAnimation=null;

			  //Remove EV images, note that these images are canvas clones of the pre-loaded images, so they still exist in the preload array
				scene.elements.background.innerHTML="";
				scene.elements.backgroundAlt.innerHTML="";
				//Remove BG images
				scene.elements.background.style.backgroundImage="none";
				scene.elements.backgroundAlt.style.backgroundImage="none";
				//Remove all SPINE images, note that these images are canvas clones of the pre-loaded images, so they still exist
				//scene.elements.spineImage.innerHTML="";
				//Remove all SPINE animation, note that references to them still exist in the: preload.spines array
				//scene.elements.spine.innerHTML="";
				//preload.currentSpine=null;
				
			break;

			//Fade in white or black overlay, but do nothing else /Addition
			case "FADE_IN":

			  /*
				//If the scene has animations in it, don't run regular FADE_IN commands, so ignore this command
				if(scene.animated==="1")
				{
					break;
				}
				*/

				let evColor1 = data.split(",")[0].trim();
				let evDur1 = Number(data.split(",")[1]);

				//White overlay
				if(evColor1==="white"){
					animateElement(scene.elements.whiteOverlay, evDur1, "fade-out", true);
				}
				//Black overlay
				else{
					animateElement(scene.elements.blackOverlay, evDur1, "fade-out", true);
				}
				scene.skippableAnimation = false;

				break;
			//Fade in white or black overlay, but do nothing else
			//Used by scenes with animations
			case "FADE_IN2":

			  /*
				//If the scene doesn't have animations in it, ignore this
				if(scene.animated==="0")
				{
					break;
				}
				*/
				let evColor11 = data.split(",")[0].trim();
				let evDur11 = Number(data.split(",")[1]);
				//evStartOpacity11: usually: 1
				let evStartOpacity11 = Number(data.split(",")[2]); //from 0 to 1
				//evEndOpacity11: usually: 0
				let evEndOpacity11 = Number(data.split(",")[3]);   //from 0 to 1

				//White overlay
				if(evColor11==="white"){
					//animateElement(scene.elements.whiteOverlay, evDur11, "fade-out", true);
					//fadeAnimation() also sets: scene.skippableAnimation = false;
					fadeAnimation(scene.elements.whiteOverlay, evStartOpacity11, evEndOpacity11, evDur11);
				}
				//Black overlay
				else{
					//animateElement(scene.elements.blackOverlay, evDur11, "fade-out", true);
					//fadeAnimation() also sets: scene.skippableAnimation = false;
					fadeAnimation(scene.elements.blackOverlay, evStartOpacity11, evEndOpacity11, evDur11);
				}
				//scene.skippableAnimation = false;

				break;
			//Fade out white or black overlay, but do nothing else //Addition
			case "FADE_OUT":

			  /*
				//If the scene has animations in it, don't run regular FADE_OUT commands, so ignore this command
				if(scene.animated==="1")
				{
					break;
				}
				*/

				let evColor2 = data.split(",")[0].trim();
				let evDur2 = Number(data.split(",")[1]);

				//White overlay
				if(evColor2==="white"){
					//If it is already faded out for some reason, do nothing
					if(scene.elements.whiteOverlay.style.opacity==="0") {
						break;
					}
					animateElement(scene.elements.whiteOverlay, evDur2, "fade-in", true);
				}
				//Black overlay
				else{
					//If it is already faded out for some reason, do nothing
					if(scene.elements.blackOverlay.style.opacity==="0") {
						break;
					}
					animateElement(scene.elements.blackOverlay, evDur2, "fade-in", true);
				}
				scene.skippableAnimation = false;

				break;
			//Fade out white or black overlay, but do nothing else
			//Used by scenes with animations
			case "FADE_OUT2":

			  /*
				//If the scene doesn't have animations in it, ignore this
				if(scene.animated==="0")
				{
					break;
				}
				*/

				let evColor22 = data.split(",")[0].trim();
				let evDur22 = Number(data.split(",")[1]); //in ms
				//evStartOpacity22: usually: 0
				let evStartOpacity22 = Number(data.split(",")[2]); //from 0 to 1
				//evEndOpacity22: usually: 1
				let evEndOpacity22 = Number(data.split(",")[3]);   //from 0 to 1

				//White overlay
				if(evColor22==="white"){
					/*
					//If it is already faded out for some reason, do nothing
					if(scene.elements.whiteOverlay.style.opacity==="1") {
						break;
					}
					*/
					//animateElement(scene.elements.whiteOverlay, evDur22, "fade-in", true);
					//fadeAnimation() also sets: scene.skippableAnimation = false;
					fadeAnimation(scene.elements.whiteOverlay, evStartOpacity22, evEndOpacity22, evDur22);
				}
				//Black overlay
				else{
					/*
					//If it is already faded out for some reason, do nothing
					if(scene.elements.blackOverlay.style.opacity==="1") {
						break;
					}
					*/
					//animateElement(scene.elements.blackOverlay, evDur22, "fade-in", true);
					//fadeAnimation() also sets: scene.skippableAnimation = false;
					fadeAnimation(scene.elements.blackOverlay, evStartOpacity22, evEndOpacity22, evDur22);
				}
				//scene.skippableAnimation = false;

				break;

			//Fade in from a specific color over the screen
			//evColor111: Should be a color hex value, ex: "#000000"
			case "FADE_IN_COLOR":

				let evColor111 = data.split(",")[0].trim();
				let evDur111 = Number(data.split(",")[1]);

				scene.elements.colorOverlay.style.backgroundColor=evColor111;

				animateElement(scene.elements.colorOverlay, evDur111, "fade-out", true);
				scene.skippableAnimation = false;

				break;
			
			//Fade out to a specific color over the screen
			//evColor222: Should be a color hex value, ex: "#000000"
			case "FADE_OUT_COLOR":

				let evColor222 = data.split(",")[0].trim();
				let evDur222 = Number(data.split(",")[1]);

				scene.elements.colorOverlay.style.backgroundColor=evColor222;

				animateElement(scene.elements.colorOverlay, evDur222, "fade-in", true);
				scene.skippableAnimation = false;

				break;

			case "EV_OUT":
				if(scene.alt.bg)
				{
					killChildren(scene.elements.backgroundAlt);
					//If duration is 0, complete it immediately //Addition
					if(data==="0")
					{
						scene.elements.background.style.opacity=0;
					}
					else
					{
						//If the background has already been hidden, do nothing, otherwise the "fade-out" will cause the background to be shown again during the fade out
						if(scene.elements.background.style.opacity!=="0")
						{
							animateElement(scene.elements.background, data, "fade-out", true);
							scene.skippableAnimation = false;
						}
					}
				}
				else
				{
					killChildren(scene.elements.background);
					//If duration is 0, complete it immediately //Addition
					if(data==="0")
					{
						scene.elements.backgroundAlt.style.opacity=0;
					}
					else
					{
						//If the background has already been hidden, do nothing, otherwise the "fade-out" will cause the background to be shown again during the fade out
						if(scene.elements.backgroundAlt.style.opacity!=="0")
						{
							animateElement(scene.elements.backgroundAlt, data, "fade-out", true);
							scene.skippableAnimation = false;
						}
					}
				}
				scene.empty.bgs = true;
			break;
			case "FADE":
				// <FADE>IN, BLACK, 500
				// 2019/09/12 Only used in Scene 0058_2, fades in from a colour
				// It's right at the start of the scene the EV is called
				// before it and has a 3s fade in time, so what happens in the
				// game is you get a 3s fade in and then it flicks back to
				// black just to fade back in 0.5s later, seems like a mistake.
			break;
			case "JUMP":
				scene.index = scene.labels[data];
			break;
			case "LABEL":
				// handled on load
			break;
			case "NAME_PLATE":
				let npText = prefs.scene.tlName ? translateName(data) : data;
				if(scene.empty.textBox){
					scene.elements.textBoxStroke.innerHTML = "";
					scene.elements.textBoxText.innerHTML = "";
					scene.empty.textBox = false;
				}
				
				//Player's name
				//if npText is just '{UserName}', then it's the players name. Replace it with the users name.
				if(npText==='{UserName}'){
					npText=prefs.viewer.playerName;
				}
				
				//If the name is the empty string "" (ie: no name) then hide the name box, if you never want to hide the name box then just comment this out
				/*
				if(npText==="") {
					scene.elements.namePlateContainer.classList.add("hide");
				}
				else {
					scene.elements.namePlateContainer.classList.remove("hide");
				}
				*/

				scene.elements.namePlate.innerHTML = npText;
			break;
			case "PAUSE":
				//debugger;
				if(!scene.script[scene.index].startsWith("<PAUSE>"))
				{
					scene.paused = true;
					scene.empty.textBox = true;

					// Only add text when text has been passed in the script
					// Causes desync in Chapter 027 S02B otherwise
					/*
					if(scene.fill.textBox){
						addRPGXText();
						// Browser reflow is baaaaaaaaaaaaaad
						if(!tlTools.active){
							addToBackLog();
						}
					}
					*/

					if(scene.mode === 1){
						//Auto Mode
						//console.log("automode initiated");
						sceneAutoMode();
					} else if (scene.mode === 2){
						//Skip Mode
						scene.nextSkip = setTimeout(function() {
							progressScene();
						}, prefs.scene.skipDelay);
					}
				}
			break;
			case "SCENARIO_END":

				if(tlTools.active){
					// reset instead of stick because although
					// scene.index -= 5 would put us back to the last PAUSE
					// before the scenario end stuff there's always the
					// possibility that someday a script will have an extra
					// command and - 5 won't cut it then boom infinite loop
					// and if the browsers shit it'll crash instead of error
					restartViewer();
				}
				else if(prefs.scene.playNext)
				{
					if(scene.type == H_RPGX && sceneData[scene.id].nextScene != null){
						clearViewer();
						scene.id = sceneData[scene.id].nextScene
						let part = sceneData[scene.id].SCRIPTS.PART1;
						findTl(part);
						prepareScene();
					} else if(scene.type == STORY_RPGX){
						clearViewer();
						//id, section, part, type
						if(scene.story.part == "A" && scene.story.type != "mini2"){
							scene.story.part = "B";
						} else if((scene.story.section == "S05" && (scene.story.type == "chapter" || scene.story.type == "story")) || (scene.story.section == "S01" && (scene.story.type != "chapter" && scene.story.type != "story"))){
							scene.story.id++;
							if(scene.story.id < chapterOrder.length){
								scene.story.part = "A";
								scene.story.section = "S01";
								scene.story.type = storyData[chapterOrder[scene.story.id]].type;
							} else {
								endScene();
								return;
							}
						} else {
							scene.story.part = "A";
							scene.story.section = "S0" + (Number(scene.story.section.substr(2)) + 1);
						}
						let part = storyData[chapterOrder[scene.story.id]].SECTIONS[scene.story.section][scene.story.part];
						findTl(part);
						prepareScene();
					} else if(prefs.scene.nextRandom){
						clearViewer();
						chooseScene(main.sceneList[Math.floor(Math.random() * main.sceneList.length)]);
					} else {
						endScene();
					}
				}
				else
				{
					endScene();
				}
				//When the scene has ended we return so we don't start processing more scene commands
				return;
			break;

			case "SE_PLAY":
				/*
				if(tlTools.jumping){
					break;
				}
				*/

				//The index to put the audio at, since several audios can exist and play at the same time
				let seIndex = Number(data.split(",")[0]);
				let seFilename = data.split(",")[1].trim();
				//To loop the SE or only play through it once, can be: "TRUE" or "FALSE"
				let seLoop = data.split(",")[2].trim();
				seLoop = (seLoop==="TRUE") ? true: false;
				//The volume to play the se at, can be lower than 1 (100%)
				let seVolume=Number(data.split(",")[3]);
				//Delay in seconds to begin playback, 0.0 meaning no delay
				let seDelay=Number(data.split(",")[4]);
				//Convert it from sec to ms
				seDelay=seDelay*1000;

				//Pause any previous audio that exist then set the new audio
				scene.current.se.pauseAndSetAudio(seIndex, constructSEAudioPath(seFilename));

				//Set's the audio's base volume, every volume change to the audio will be multiplied by it's base volume
				scene.current.se.setBaseVolume(seIndex, seVolume);
				scene.current.se.setVolume(seIndex, prefs.audio.seVolume / 100);
				scene.current.se.setLoop(seIndex, seLoop);

				//If a delay is set, use it. Otherwise play the audio instantly
				if(seDelay!==0)
				{
					scene.current.se.setAudioDelay(seIndex, seDelay);
					//scene.current.se.playAudio(seIndex);
				}
				/*
				else
				{
					scene.current.se.playAudio(seIndex);
				}
				*/
				scene.current.se.playAudio(seIndex);
				/*
				scene.current.se.pause();

				//Loads the new SE src in: preload.audio.se
				//Load the audio but don't wait for it to load, so we don't have any race conditions with "await" and the rest of the viewer
				//If you want to load the audio completely before playing then create a preloader for it instead of using "await"
				loadAudioNow(constructSEAudioPath(seFilename), "se");
				//await loadAudioNow(constructSEAudioPath(seFilename), "se");

				//Sets scene.current.se as: preload.audio.se and stuff
				switchAudio("se", scene.current.se, scene.prev.se, preload.audio.se);

				scene.current.se.loop=seLoop;
				scene.current.se.volume = prefs.audio.seVolume / 100;
				scene.current.se.play().catch(() => console.log("Failed to play audio, this is probably normal"));
				*/
			break;

			//Change SE volume
			case "SE_VOLUME":

				//The index of the audio
				let seIndex11=Number(data.split(",")[0]);
				//The volume to set the SE at, can be lower than 1 (100%)
				let seVolume11=Number(data.split(",")[1]);

				//Set's the audio's base volume, every volume change to the audio will be multiplied by it's base volume
				scene.current.se.setBaseVolume(seIndex11, seVolume11);
				scene.current.se.setVolume(seIndex11, prefs.audio.seVolume / 100);

			  break;

			//Stop playing SE, instantaneous or fade out to silence then stop
			case "SE_STOP":
				/*
				if(tlTools.jumping){
					break;
				}
				*/
				let seIndex1 = Number(data.split(",")[0]);
				let seDuration1 = Number(data.split(",")[1]);

				if(seDuration1 > 0.0)
				{
					scene.current.se.fadeOut(seIndex1, seDuration1);
				}
				else
				{
					scene.current.se.pauseAudio(seIndex1);
				}
				
			break;

			//Select commands have been modified, so that the command begins with <SELECT> then the text and label comes after, seperated by comma.
			//This assumes there are no commas in the label, which there probably isn't
			//Ex: SELECT>そのまま射精,LABEL1
			case "SELECT":
				//let txt = command.split("<SELECT>")[0];
				//let label = command.split("<SELECT>")[1];
				let txt = data.split(",")[0];
				let label = data.split(",")[1];
				//scene.mode = 0;
				toggleOffSceneAutoMode();
				scene.choice = true;
				displayChoice();
				let optBtn = document.createElement("div");
				optBtn.classList = "scene-choice-btn text-stroke";
				//optBtn.innerText = txt;
				optBtn.innerHTML='<div class="scene-choice-btn-mid">'+txt+'</div>';
				optBtn.setAttribute("label", label);

				optBtn.addEventListener("click", function(event){

					//Addition
					event.stopPropagation();

					hideChoice();
					scene.index = scene.labels[this.getAttribute("label")];
					scene.choice = false;
					/*
					if(prefs.scene.straightToAction)
					{
						jumpToAction(false);
					}
					else
					{
						progressScene();
					}
					*/
					progressScene();
				}, false);

				scene.elements.choiceBox.appendChild(optBtn);
				if(scene.script[scene.index].includes("<SELECT>")){
					progressScene();
				}
			break;

			/*
			case "TRANSITION":
				let transMask = data.split(",")[0].trim();
				let transDir = data.split(",")[1].trim();
				let transLength = data.split(",")[2].trim();
				let filename = transMask + "_" + transDir;

				scene.transition.vis = transDir == "OUT" ? "hidden" : "initial";

				canvasFromViewer();
				scene.transition.mask = maskData[filename];
				scene.skippableAnimation = false;
				scene.animatingElement = true;
				scene.transition.startTime = Date.now();
				scene.transition.nextDraw = 0;
				clearInterval(scene.transition.interval);
				scene.transition.interval = setInterval(function(){
					let elapsed = Date.now() - scene.transition.startTime;
					if(elapsed < transLength){
						animateTransition(transDir, transLength);
					} else {
						cancelTransition(scene.transition.vis)
						progressScene();
					}
				}, 1000 / 60);
			break;
			*/

			case "TXT_CLEAR":
				// Used in Chapter 11-5-B, it's done by default anyway.
			break;
			case "UI_DISP":
				if(!prefs.scene.textBoxUnder){
					let uiDispMode = data.split(",")[0].trim();
					let uiDispDur = data.split(",")[1].trim();
					if(uiDispMode == "ON")
					{
						if(uiDispDur==="0"){
							scene.elements.textBox.style.opacity = "1";
						}	else {
							animateElement(scene.elements.textBox, uiDispDur, "fade-in", true);
						}
					}
					else if(uiDispMode == "OFF")
					{
						if(uiDispDur==="0"){
							scene.elements.textBox.style.opacity = "0";
						}	else {
							animateElement(scene.elements.textBox, uiDispDur, "fade-out", true);
						}
					}
				}
				break;
				
			//Display an icon in the textbox of the character who is speaking
			//Cuts out the specific sprite from the sprite sheet image file to use
			//If the current icon should be removed, if any, the iconImage argument will be the empty string
			case "CHAR_ICON":

					let iconImage=data.split(",")[0].trim();
					let iconColumn=Number(data.split(",")[1]);
					let iconRow=Number(data.split(",")[2]);
					let iconIndex=Number(data.split(",")[3]);
					//Indexes are defined starting from 1, but we use it as starting from 0 here
					iconIndex=iconIndex-1;
					//console.log("image: "+iconImage+" column: "+iconColumn+" row: "+iconRow+" index: "+iconIndex);

					//Remove the old icon, if any
					scene.elements.charIcon.innerHTML="";

					if(iconImage!=="")
					{
						let spriteSheetImage=preload.temp[iconImage];

						let spriteWidth=spriteSheetImage.naturalWidth / iconColumn;
						let spriteHeight=spriteSheetImage.naturalHeight / iconRow;
	
						let indexY=Math.floor(iconIndex / iconColumn);
						let indexX=iconIndex % iconColumn;
		
						let spriteX=indexX * spriteWidth;
						let spriteY=indexY * spriteHeight;
	
						//let iconImageFilepath=constructCharIconPath(iconImage, scene.id);
						let spriteCanvas=createSpriteCanvas(spriteSheetImage, spriteX, spriteY, spriteWidth, spriteHeight);
						scene.elements.charIcon.appendChild(spriteCanvas);
					}
				break;

			//Haven't tested this with Audio group yet, but should work
			//Play a voice stand-alone, ie it does not get added to the backlog nor should it be followed by a name or message event
			case "VOICE_SINGLE_PLAY":

				let singleVoiceIndex = Number(data.split(",")[0]);
				let singleVoiceFilename = data.split(",")[1].trim();

				//Pause any previous audio that exist at this index then add the new preloaded audio
				scene.current.voice.pauseAndAddAudio(singleVoiceIndex, preload.temp[singleVoiceFilename]);

				//Set's the audio's base volume, every volume change to the audio will be multiplied by it's base volume
				scene.current.voice.setBaseVolume(singleVoiceIndex, 1);
				scene.current.voice.setVolume(singleVoiceIndex, prefs.audio.voiceVolume / 100);
				scene.current.voice.setLoop(singleVoiceIndex, false);

				scene.current.voice.playAudio(singleVoiceIndex);
				//OLD CODE
				/*
				scene.current.voice.pause();

				//Voice audio is already preloaded, so use that voice file
				preload.audio.voice = preload.temp[singleVoiceFilename];

				switchAudio("voice", scene.current.voice, scene.prev.voice, preload.audio.voice);
				scene.current.voice.volume = prefs.audio.voiceVolume / 100;
				scene.current.voice.play().catch(() => console.log("Failed to play audio, this is probably normal"));
				*/

				break;
				
			//Play a voice, and prepare to add it to the backlog, should be followed be a message event, optionally a NAME event in between
			case "VOICE_PLAY":
				/*
				if(tlTools.jumping){
					break;
				}
				*/
				//The index to put the audio at, since several audios can exist and play at the same time
				let voiceIndex = Number(data.split(",")[0]);
				let voiceFilename = data.split(",")[1].trim();

				scene.voicedLine=true;
				/*
				//OLD CODE
				scene.current.voice.pause();
				//Load the audio but don't wait for it to load, so we don't have any race conditions with "await" and the rest of the viewer
				//If you want to load the audio completely before playing then create a preloader for it instead of using "await"
				//loadAudioNow(constructVoiceAudioPath(data.trim(), scene.id), "voice");
				//await loadAudioNow(constructVoiceAudioPath(data.trim(), scene.id), "voice");

				//Voice audio is already preloaded, so use that voice file
				preload.audio.voice = preload.temp[data.trim()];

				switchAudio("voice", scene.current.voice, scene.prev.voice, preload.audio.voice);
				// scene.current.voice = preload.temp[data.trim()];
				scene.current.voice.volume = prefs.audio.voiceVolume / 100;
				scene.current.voice.play().catch(() => console.log("Failed to play audio, this is probably normal"));
				//scene.voiceDur = Math.round(scene.current.voice.duration * 1000);
				scene.elements.backLogItemVoice.setAttribute("voice", data.trim());
				scene.elements.backLogItemVoice.setAttribute("path", scene.current.voice.src);
				*/

				/////////////////////////////////////////////////////////////////////////////////////////

				//Voice audio is already preloaded, so use that voice file
				//preload.audio.voice = preload.temp[voiceFilename];
				//switchAudio("voice", scene.current.voice, scene.prev.voice, preload.audio.voice);

				//Pause any previous audio that exist at this index then add the new preloaded audio
				scene.current.voice.pauseAndAddAudio(voiceIndex, preload.temp[voiceFilename]);

				//Set's the audio's base volume, every volume change to the audio will be multiplied by it's base volume
				scene.current.voice.setBaseVolume(voiceIndex, 1);
				scene.current.voice.setVolume(voiceIndex, prefs.audio.voiceVolume / 100);
				scene.current.voice.setLoop(voiceIndex, false);

				scene.current.voice.playAudio(voiceIndex);
				//scene.elements.backLogItemVoice.setAttribute("voice", voiceFilename);
				//scene.elements.backLogItemVoice.setAttribute("path", scene.current.voice.src);
				//The index of the audio voice in the group here on the backlog doesn't really matter, so just push it on the array
				scene.elements.backLogItemVoice.paths.push(constructVoiceAudioPath(voiceFilename, scene.id));

				break;

			//Stops playing the voice at the specified index, and then removes it from the current voice audios.
			case "VOICE_STOP":
				/*
				if(tlTools.jumping){
					break;
				}
				*/
				let voiceIndex1 = Number(data.split(",")[0]);
				//let voiceDuration1 = Number(data.split(",")[1]);

				/*
				if(seDuration1 > 0.0)
				{
					scene.current.se.fadeOut(seIndex1, seDuration1);
				}
				else
				{
					scene.current.se.pauseAudio(seIndex1);
				}
				*/
				scene.current.voice.pauseAndRemoveAudio(voiceIndex1);
				
			break;
					
			case "WAIT":

			  /*
				//If the scene has animations in it, don't run regular WAIT commands, so ignore this command
				if(scene.animated==="1")
				{
					break;
				}
				*/

				if(tlTools.jumping){
					break;
				}
				let waitingDuration=Number(data);

				scene.waitIndex = scene.index;
				scene.waiting = true;

				scene.waitingStartTime=Date.now();
				scene.waitingDuration=waitingDuration;

				scene.waitingTimer=setTimeout(function() {

					if(scene.waitIndex == scene.index)
					{
						scene.waiting=false;
						scene.waitingTimer=null;

						processSceneCommand();
					}
				}, waitingDuration);

				break;

			//Treat spine_wait the same as a regular wait command
			case "SPINE_WAIT":
			case "WAIT2":

					/*
					//If the scene doesn't have animations in it, ignore this
					if(scene.animated==="0")
					{
						break;
					}
					*/
	
					/*
					if(tlTools.jumping){
						break;
					}
					*/
					let waitingDuration1=Number(data);

					scene.waitIndex = scene.index;
					scene.waiting = true;

					scene.waitingStartTime=Date.now();
					scene.waitingDuration=waitingDuration1;

					scene.waitingTimer=setTimeout(function() {

						if((scene.waitIndex == scene.index))
						{
							scene.waiting=false;
							scene.waitingTimer=null;

							processSceneCommand();
						}
					}, waitingDuration1);
	
				break;
			case "": //Doesn't have a tag so most likely scene text.
				if(scene.empty.textBox){
					scene.elements.textBoxStroke.innerHTML = "";
					scene.elements.textBoxText.innerHTML = "";
					scene.empty.textBox = false;
				}
				// For when there are multiple legit pauses without any text
				//scene.fill.textBox = true;

				//Add the text directly, addition
				addText(data);

				if(!tlTools.active){
					addToBackLog();
				}

				if(prefs.scene.copyText && !tlTools.jumping){
					toClipboard();
				}
				//scene.elements.textBoxIcon.style.display = "inherit";

			break;
			default:
				console.error("<" + tag + ">" + " hasn't been added yet");
			break;
		}
	}
	scene.commands = [];
	// If the scene's not paused, not animating, not waiting and the animations
	// skippable OR if we're skipping and not paused
	if((!scene.paused && !scene.animatingElement && scene.skippableAnimation && !scene.waiting && !scene.choice) || (scene.mode == 2 && !scene.paused) || tlTools.jumping){
		processSceneCommand();
	}
}

function addText(txt)
{
	//let txt = scene.textBuffer[scene.pauseIdx];

	//Replace <param=PlayerName> with the players name from settings, if any exist
	//txt = txt.replace(/<param=PlayerName>/g, prefs.viewer.playerName);
	//Replace hearts (♥) with red ones, if any exist.
	//txt = txt.replace(/♥/g, '<span style="color:#dd2e44;">♥</span>');
	//Replace '\n' with line breaks
	//txt = txt.replace(/\\n/g, '<br />');

	//Replace emoji=heart04 with heart symbol (♥)
	//txt = txt.replace(/\[emoji=heart04\]/g, '♥');

	//Convert manual \n linebreaks to <br />
	txt = txt.replace(/\n/g, '<br />');
	//txt = txt.replace(/\[br\]/g, '<br />');

	/*
	//Replace all ruby annotations, if any, ex: [ruby=・・・・・]そのつもり[/ruby], ex: [ruby=うち]流星[/ruby]
	let matches=[...txt.matchAll(/\[ruby=(.*?)\](.*?)\[\/ruby\]/g)];
	for(let i=0; i<matches.length; i++)
	{
		let match=matches[i];
		let replacement="<ruby>"+match[2]+"<rt>"+match[1]+"</rt>"+"</ruby>";
		txt=txt.replace(match[0], replacement);
	}
	*/
	/*
	let match=txt.match(/\[ruby=(.*?)\](.*?)\[\/ruby\]/);
	if(match!==null) {
		console.log(match);
		let newText=txt.slice(0, match.index)+"<ruby>"+match[2]+"<rt>"+match[1]+"</rt>"+"</ruby>"+txt.slice(match.index+match[0].length);
		txt=newText;
		console.log(txt);
	}
	*/

	if(scene.translated){
		//scene.elements.textBoxText.innerHTML = txt;
	}
	else
	{
		if(prefs.scene.furigana){
			if(txt.includes("（")){
				let furi = txt.split("（")[1].split("）")[0];
				let word = furigana.get(furi);
				if(word !== undefined){
					txt = txt.replace(`（${furi}）`, "");
					txt = txt.replace(word, `<ruby>${word}<rt>${furi}</rt></ruby>`);
				}
			}
		}
		//scene.elements.textBoxText.innerHTML = txt;
	}

	//Remove any leading/trailing line breaks
	txt = txt.replace(/^\s*(?:<br\s*\/?\s*>)+|(?:<br\s*\/?\s*>)+\s*$/gi, "");
	//Add text to text box
	//Also duplicate the text in the text box stroke element, which strokes the text with a center stroke
	//then the text is also added infront of it again to hide the inner stroke, resulting in only an outer stroke
	scene.elements.textBoxStroke.innerHTML = txt;
	scene.elements.textBoxText.innerHTML = txt;

	scene.pauseIdx++;
	//scene.fill.textBox = false;
}

function toClipboard()
{
	navigator.clipboard.writeText(scene.elements.textBoxText.innerText.replace(/\n/g, "")).then(function(){
		console.log("Wrote to clipboard");
	}, function(){
		console.log("Failed to write to clipboard");
	});
}

function clearViewer(){
	scene.current.bgm.pause();
	//scene.current.voice.pause();
	scene.current.voice.pauseAllRemoveAllAudio();

	//scene.current.bgVoice.pause();
	//scene.current.bgSe.pause();
	//scene.current.se.pause();
	scene.current.bgVoice.pauseAllRemoveAllAudio();
	scene.current.bgSe.pauseAllRemoveAllAudio();
	scene.current.se.pauseAllRemoveAllAudio();

	//Stop playing video, if still running
	if(scene.current.video!==null){
		scene.current.video.pause();
		scene.current.video.onended = null;
	}
	scene.current.video = null;

	//Stop playing animation, if still running
	if(scene.alt.bg){
		stopAnimationIfExist(scene.elements.background);
	} else {
		stopAnimationIfExist(scene.elements.backgroundAlt);
	}

	//Stop playing async animations (requestAnimation), if still running
	for(let element of scene.requestAnimationScaleAsync)
	{
		cancelAnimationFrame(element.requestID);
		element.requestID=null;
	}
	scene.requestAnimationScaleAsync = [];

	//
	scene.current.animation=null;
	scene.current.animationPlaybackSpeed=1.0;

	scene.current.spineAnimation=null;

	main.view.current = SCENE_SELECT;
	main.view.prev = SCENE_SELECT;

	toggleOffSceneAutoMode();

	//scene.mode = 0;
	clearTimeout(input.touch.heldScene);
	//clearTimeout(scene.nextAuto);
	clearTimeout(scene.nextSkip);
	scene.actors = [];
	scene.alt.flash = false;
	scene.alt.bg = false;
	scene.skippableAnimation = true;
	scene.animatingElement = false;
	scene.index = 0;
	scene.paused = false;
	scene.processingGroup = false;
	scene.choice = false;
	scene.newBacklogItem = true;
	scene.backlogOpen = false;
	scene.textBoxHidden = false;
	scene.zoom={
		scale: 1.0,
		posX: 0,
		posY: 0
	};
	scene.commands = [];
	scene.commandsActive = 0;
	scene.textBuffer = [];
	scene.pauseIdx = 0;
	sceneEventCleanup();
	killChildren(main.elements.viewer);
	emptyTempPreload();
}

function findTl(part){
	let translations = part.TRANSLATIONS;
	if(translations != null && prefs.scene.eng){
		for(let translation of translations){
			if(translation.LANGUAGE == scene.language && translation.TRANSLATOR == scene.translator){
				scene.script = translation.SCRIPT;
			} else if(translation.LANGUAGE == scene.language){
				scene.script = translation.SCRIPT;
			} else {
				scene.script = part.SCRIPT;
			}
		}
	} else {
		scene.script = part.SCRIPT;
		scene.translated = false;
	}
}

function addToBackLog()
{
	scene.elements.backLogItemText.innerHTML = scene.elements.textBoxText.innerHTML;
	scene.elements.backLogItemName.innerHTML = scene.elements.namePlate.innerHTML;

	if(scene.voicedLine)
	{
		scene.elements.backLogItemVoice.addEventListener("click", function(e){
			e.stopPropagation();
			//scene.current.voice.pause();
			//scene.current.voice.currentTime = 0;
			scene.current.voice.pauseAllAudio();
			scene.current.voice.seekAllAudio(0);

			//scene.current.backlogVoice.pause();
			//scene.current.backlogVoice.currentTime = 0;
			scene.current.backlogVoice.pauseAllRemoveAllAudio();

			//loadBacklogVoice(this.getAttribute("path"))
			//scene.current.backlogVoice.volume = prefs.audio.voiceVolume / 100;
			//scene.current.backlogVoice.play().catch(() => console.log("Failed to play audio, this is probably normal"));

			//Load all the voices that have been specified on that backlog, 1 or more
			for(let i=0; i<this.paths.length; i++)
			{
				let voiceFilepath=this.paths[i];
				scene.current.backlogVoice.pauseAndSetAudio(i, voiceFilepath);
			}

			//Set's the audio's base volume, every volume change to the audio will be multiplied by it's base volume
			scene.current.backlogVoice.setVolumeAllAudio(prefs.audio.voiceVolume / 100);
			scene.current.backlogVoice.playAllAudio();
		},false);
		scene.elements.backlogItem.appendChild(scene.elements.backLogItemVoice);
	}

	scene.elements.backlogItem.appendChild(scene.elements.backLogItemName);
	scene.elements.backlogItem.appendChild(scene.elements.backLogItemText);
	scene.elements.backlog.appendChild(scene.elements.backlogItem);

	// scrollIntoView() scrolls the whole page if it's scrollable
	// so just set scrollTop instead
	//scene.elements.backlog.scrollTop = scene.elements.backlog.scrollHeight - 720;
	scene.elements.backlog.scrollTop = scene.elements.backlog.scrollHeight - config.scene.height;

	scene.newBacklogItem = true;
}

function displayChoice(){
	scene.elements.choiceBox.style.visibility = "initial";
	//scene.elements.choiceBox.style.zIndex = "20";
	scene.elements.choiceBox.style.zIndex = "8"; //Change
}

function hideChoice(){
	scene.elements.choiceBox.style.visibility = "hidden";
	scene.elements.choiceBox.style.zIndex = "-10";
	killChildren(scene.elements.choiceBox);
}

function restartViewer(){
	scene.index = 0;
	scene.current.bgm.pause();
	//scene.current.voice.pause();
	scene.current.voice.pauseAllRemoveAllAudio();

	//scene.current.bgVoice.pause();
	//scene.current.bgSe.pause();
	//scene.current.se.pause();
	scene.current.bgVoice.pauseAllRemoveAllAudio();
	scene.current.bgSe.pauseAllRemoveAllAudio();
	scene.current.se.pauseAllRemoveAllAudio();

	if(scene.current.video!==null){
		scene.current.video.pause();
		scene.current.video.onended = null;
	}
	scene.current.video = null;

	//Stop playing animation, if still running
	if(scene.alt.bg){
		stopAnimationIfExist(scene.elements.background);
	} else {
		stopAnimationIfExist(scene.elements.backgroundAlt);
	}

	//Stop playing async animations (requestAnimation), if still running
	for(let element of scene.requestAnimationScaleAsync)
	{
		cancelAnimationFrame(element.requestID);
		element.requestID=null;
	}
	scene.requestAnimationScaleAsync = [];

	//
	scene.current.animation=null;
	scene.current.animationPlaybackSpeed=1.0;

	scene.current.spineAnimation=null;

	toggleOffSceneAutoMode();

	//scene.mode = 0;
	clearTimeout(input.touch.heldScene);
	//clearTimeout(scene.nextAuto);
	clearTimeout(scene.nextSkip);
	scene.actors = [];
	scene.alt.flash = false;
	scene.alt.bg = false;
	scene.skippableAnimation = true;
	scene.animatingElement = false;
	scene.paused = false;
	scene.processingGroup = false;
	scene.choice = false;
	scene.backlogOpen = false;
	scene.textBoxHidden = false;
	scene.zoom={
		scale: 1.0,
		posX: 0,
		posY: 0
	};
	scene.pauseIdx = 0;
	sceneEventCleanup();
	killChildren(main.elements.viewer);
	buildSceneViewer();
}

function sceneAutoMode()
{
	let sceneAutoWait;
	if(scene.voicedLine)
	{
		// If the scene's voiced and auto mode waits for a voiced line to
		// finish before continuing set the wait time to the remaining time
		// of the voiced line + a small delay
		// otherwise set the wait time to the amount of characters in the text
		// box divided by the CPS set in prefs + a small delay

		//If the voice failed to preload for whatever reason, scene.current.voice.duration will be NaN, so do this for safety sake
		//let voiceDuration=Number.isNaN(scene.current.voice.duration) ? 0 : scene.current.voice.duration;
		//sceneAutoWait=prefs.scene.auto.waitVoice ? Math.round((voiceDuration - scene.current.voice.currentTime) * 1000) + prefs.scene.autoDelay : Math.ceil((scene.elements.textBoxText.innerHTML.replace(/<br>/g, "").length / prefs.scene.auto.cps) * 1000) + prefs.scene.autoDelay;
		let audioIndex=scene.current.voice.getIndexOfAudioWithLongestDuration();
		let voiceDuration=(audioIndex===null) ? 0 : scene.current.voice.audios[audioIndex].duration;
		sceneAutoWait=prefs.scene.auto.waitVoice ? Math.round((voiceDuration - scene.current.voice.audios[audioIndex].currentTime) * 1000) + prefs.scene.autoDelay : Math.ceil((scene.elements.textBoxText.innerHTML.replace(/<br>/g, "").length / prefs.scene.auto.cps) * 1000) + prefs.scene.autoDelay;
	}
	else
	{
		// (current text / CPS) + auto line delay
		sceneAutoWait = Math.ceil((scene.elements.textBoxText.innerHTML.replace(/<br>/g, "").length / prefs.scene.auto.cps) * 1000) + prefs.scene.autoDelay;
	}

	scene.nextAuto = setTimeout(function(){
			progressScene();
	}, sceneAutoWait);
}

//CSS animations
function animateElement(elem, dur, animName, listen, timing = "linear")
{
	//Clears the style.animation value, which will cause the animation to stop
	//When an animation is removed the element returns to it's normal non-animated values
	//So if the element had opacity: 0 before the animation, and the animation gets stopped at 0.5 opacity, the element will return to opacity 0 immediately
	//Also call a callback if one was set to run when the animation gets removed
	removeAnimation(elem);
	//Start the new animation, the properties that are animated are defined in the keyframes
	elem.style.animation = dur + "ms " + timing + " running " + animName;
	scene.animatingElement = true;
	//This should set the property (being animated) to the state that it should have when the animation is completed
	//So if the animation gets interrupted (removed) it will then have the value that the final state of the animation would have given it anyway
	elem.style.cssText += applyAnimationValues(animName);
	scene.animatedElements.push(elem);
	//If listen is true, it will add a listener to the "animationend" event that will progress the scene when the animation is finished,
	//if we are still on the same index as when the animation started
	//listen can also be a callback function that then will be called first
	if(listen){
		addAnimationListener(elem, scene.index, listen);
	}
}

//Add CSS animation listener
function addAnimationListener(elem, index, listen){
	// Add a single use event listener to the animated element.
	// If scene.index is equal to the index it was when it was created
	// run the next command.
	// else do nothing as the element was part of a group or the user's
	// skipping. e.g. on 0036 two Felicias fade in at the same time both will
	// fire but only one will run

	//If listen is a callback function, then call it when the animation is removed (either it finished naturally or it got interrupted halfway)
	if(typeof listen === "function")
	{
		elem.animationEndCallback=listen;
	}

	elem.addEventListener("animationend", function waitForAnimationEnd(){

		if((scene.index == index))
		{
			removeAnimation(elem);
			scene.animatedElements.splice(scene.animatedElements.indexOf(elem), 1);
			scene.skippableAnimation = true;
			scene.animatingElement = false;
			processSceneCommand();
		}
	}, {once:true, capture:true});
}

//Remove CSS animation
function removeAnimation(elem)
{
	//If a callback function was set to run when the animaiton was finished, then run it now instead
	if(elem.animationEndCallback)
	{
		//console.log("Running callback function");
		elem.animationEndCallback();
		elem.animationEndCallback=null;
	}

	// CSS doesn't let you replay the same animation so we reset it like this.
	elem.style.animation = "none";
	elem.offsetHeight;
	elem.style.animation = null;
}

function applyAnimationValues(animName){
	switch(animName){
		case "glow":
			return "box-shadow: 0 0 20px #fff;"
		break;
		case "fade-in":
		case "fade-in-alt":
			return "opacity: 1;"
		break;
		case "fade-out":
		case "fade-out-alt":
			return "opacity: 0;"
		break;
		case "icon-bob":
			return "bottom: 26px;"
		break
		case "overlay-movement":
			return "color: #fff;"
		break;
		case "quake-vertical-actor":
		case "quake-vertical-scene":
			return "top: 0px;"
		break;
		case "quake-horizontal-actor":
		case "quake-horizontal-scene":
			return "left: 0px;"
		break;
		case "quake-overall-scene":
			return "top: 0px; left: 0px;"
		break;
		case "move-actor":
			return "left: " + document.documentElement.style.setProperty("--quakeStrength", quakeStrength);
		break;
		default:
		break;
	}
}

/*
function createActor(fn, pos)
{
	let actorContainer = document.createElement("div");
	actorContainer.classList = "actor";
	actorContainer.style.backgroundImage = "url('" + preload.temp[fn].src + "')";

	setActorPosition(actorContainer, pos);
	actorContainer.style.transition = "linear 0s";
	return actorContainer;
}
*/

//Async version of the scale/translate elements animation
function scaleElementsAnimationAsync(elements, endScale, duration, endPosX, endPosY)
{
	if(duration<=0) {
		console.error("scaleElementsAnimationAsync() duration was 0 or less");
	}
	
	scene.requestAnimationScaleAsync=elements;

	for(let i=0; i<elements.length; i++)
	{
		let element=elements[i];

		if(element.classList.contains("spine-actor") || element.classList.contains("spine-scene"))
		{
			let spinePlayer=element.spinePlayer;

			let startScale=spinePlayer.skeleton.scaleX;
			//let currentScale=spinePlayer.skeleton.scaleY;
			let scaleDiff=endScale-startScale;

			//Since the spine origin is in the center? these values should be doubled //spinePlayer.skeleton.x=scene.zoom.posX*2;
			let startPosX=spinePlayer.skeleton.x;
			let startPosY=spinePlayer.skeleton.y;

			let posXDiff=endPosX-startPosX;
			let posYDiff=endPosY-startPosY;

			element.elapsedTime=0;
			element.startTime=document.timeline.currentTime;

			//Set a function on the element which will be run if the animation needs to be finished immediately
			//Ie, this function should set the element to it's final animated values.
			element.reqAnimFinish=function(){

				spinePlayer.skeleton.scaleX=endScale;
				spinePlayer.skeleton.scaleY=endScale;

				spinePlayer.skeleton.x=endPosX;
				spinePlayer.skeleton.y=endPosY;
			};

			//Save the requestAnimation callback on the element so that later if the animation gets canceled, we can resume it again by calling the saved callback
			element.reqAnimCallback=function step(timestamp){

				let timeElapsed=timestamp - element.startTime;
				let rangeVal=timeElapsed / duration;

				//If we have reached the end of the animation duration, set it so it updates to its final value for the last time
				if(timeElapsed>=duration) {
					rangeVal=1;
				}

				//Update values
				let scale=startScale + (scaleDiff * rangeVal);

				spinePlayer.skeleton.scaleX=scale;
				spinePlayer.skeleton.scaleY=scale;
			
				//Since the spine origin is in the center? these values should be doubled //spinePlayer.skeleton.x=scene.zoom.posX*2;
				let posX=startPosX + (posXDiff * rangeVal);
				let posY=startPosY + (posYDiff * rangeVal);

				spinePlayer.skeleton.x=parseInt(posX);
				spinePlayer.skeleton.y=parseInt(posY);

				//If we are not finished, call it again
				if(rangeVal!==1)
				{
					element.requestID=requestAnimationFrame(step);
				}
				//If we have reached the end of the animation duration and the element has it's final values set, don't call it anymore
				else
				{
					element.requestID=null;
					element.reqAnimCallback=null;

					//Remove the element from the array when the animation is finished
					scene.requestAnimationScaleAsync.splice(i, 1);
				}
			};

			//Animate and update the values every frame, until: "duration" in ms has passed
			//Save the request id so that we can kill the animation later
			element.requestID=requestAnimationFrame(element.reqAnimCallback);
	  }
  }
}

//Fix so that it also can scale other elements than spines
//Scale and translate all elements passed for time specified in: duration
//elements: array of html elements
//endScale: 1.0 is the default, negative values will reverse the image and should not be used unless intentional
//duration: in ms, should never be 0 or less
//endPosX: int (positive or negative position)
//endPosY: int (positive or negative position)
function scaleElementsAnimation(elements, endScale, duration, endPosX, endPosY)
{
	if(duration<=0) {
		console.error("scaleElementsAnimation() duration was 0 or less");
	}
	
	scene.skippableAnimation = false;

	let sceneIndex=scene.index;

	scene.requestAnimationElements=elements;
	//let nrOfElements=elements.length;
	let animationsComplete=0;

	for(let i=0; i<elements.length; i++)
	{
		let element=elements[i];

		if(element.classList.contains("spine-actor") || element.classList.contains("spine-scene"))
		{
			let spinePlayer=element.spinePlayer;

			let startScale=spinePlayer.skeleton.scaleX;
			//let currentScale=spinePlayer.skeleton.scaleY;
			let scaleDiff=endScale-startScale;

			//Since the spine origin is in the center? these values should be doubled //spinePlayer.skeleton.x=scene.zoom.posX*2;
			let startPosX=spinePlayer.skeleton.x;
			let startPosY=spinePlayer.skeleton.y;

			let posXDiff=endPosX-startPosX;
			let posYDiff=endPosY-startPosY;

			element.elapsedTime=0;
			element.startTime=document.timeline.currentTime;

			//Set a function on the element which will be run if the animation needs to be finished immediately
			//Ie, this function should set the element to it's final animated values.
			element.reqAnimFinish=function(){

				spinePlayer.skeleton.scaleX=endScale;
				spinePlayer.skeleton.scaleY=endScale;

				spinePlayer.skeleton.x=endPosX;
				spinePlayer.skeleton.y=endPosY;
			};

			//Save the requestAnimation callback on the element so that later if the animation gets canceled, we can resume it again by calling the saved callback
			element.reqAnimCallback=function step(timestamp){

				let timeElapsed=timestamp - element.startTime;
				let rangeVal=timeElapsed / duration;

				//If we have reached the end of the animation duration, set it so it updates to its final value for the last time
				if(timeElapsed>=duration) {
					rangeVal=1;
				}

				//Update values
				let scale=startScale + (scaleDiff * rangeVal);

				spinePlayer.skeleton.scaleX=scale;
				spinePlayer.skeleton.scaleY=scale;
			
				//Since the spine origin is in the center? these values should be doubled //spinePlayer.skeleton.x=scene.zoom.posX*2;
				let posX=startPosX + (posXDiff * rangeVal);
				let posY=startPosY + (posYDiff * rangeVal);

				spinePlayer.skeleton.x=parseInt(posX);
				spinePlayer.skeleton.y=parseInt(posY);

				//If we are not finished, call it again
				if(rangeVal!==1)
				{
					element.requestID=requestAnimationFrame(step);
				}
				//If we have reached the end of the animation duration and the element has it's final values set, don't call it anymore
				else
				{
					animationsComplete++;
					element.requestID=null;
					element.reqAnimCallback=null;

					if(animationsComplete === elements.length)
					{
						//Kind of pointless to check: scene.index === sceneIndex, since if this isn't true anymore the requestAnimationFrame() should have already been canceled
						if(scene.index === sceneIndex)
						{
							scene.requestAnimationElements=[];
							scene.skippableAnimation = true;

							processSceneCommand();
						}
					}
				}
			};

			//Animate and update the values every frame, until: "duration" in ms has passed
			//Save the request id so that we can kill the animation later
			element.requestID=requestAnimationFrame(element.reqAnimCallback);
	  }
  }
}

//Currently used to fade in/out overlays
//elem: element to fade
//duration: in ms
//startOpacity: from: 0 to 1
function fadeAnimation(elem, startOpacity, endOpacity, duration)
{
	let keyFrames=[
		//From
		{ 
			"opacity": startOpacity
		},
		//To
		{
			"opacity": endOpacity
		}
	];

	//Javascript animation
	let animInstance=elem.animate(keyFrames, {
		duration: duration, 
		iterations: 1,
		easing: "linear",
		fill: "forwards"
	});

	//
	elem.animInstance=animInstance;

	let sceneIndex=scene.index;
	scene.skippableAnimation = false;
	//
	scene.jsAnimatedElements.push(elem);

	animInstance.onfinish = function(event) {

		//console.log("finish event!");
		if(scene.index === sceneIndex)
		{
			//This writes the current (Finished) values of the animation to the inline style attribute
			//So that we can remove the animation later but still have the element have the final animation values we want
			animInstance.commitStyles();
			//We can cancel the animation now after we have commited it's final values in the inline style property
			animInstance.cancel();
			elem.animInstance=null;

			scene.jsAnimatedElements.splice(scene.jsAnimatedElements.indexOf(elem), 1);
			scene.skippableAnimation = true;
			processSceneCommand();
		}
	};
}

function shakeActorAnimation(actor, posX, posY, duration)
{
	//actor.spinePlayer.paused=true;
	//duration=8000;
	//posX=100;
	//posY=100;

	//Relative position shake
	let left=(parseInt(actor.style.left)-posX)+"px";
	let right=(parseInt(actor.style.left)+posX)+"px";
	let top=(parseInt(actor.style.top)-posY)+"px";
	let bottom=(parseInt(actor.style.top)+posY)+"px";
	let midX=actor.style.left;
	let midY=actor.style.top;

	/*
	console.log(actor.style.left);
	console.log(actor.style.top);
	console.log("pos x: "+posX);
	console.log("pox y: "+posY);
	*/

	let keyFrames=[
		//Keyframes
		{ 
			"left": midX,
			"top": midY
		},
		//Event group
		{ 
			"left": left,
			"top": top
		},
		{
			"left": right,
			"top": midY
		},
		{
			"left": left,
			"top": bottom
		},
		{
			"left": midX,
			"top": top
		},
		{
			"left": left,
			"top": midY
		},
		{
			"left": right,
			"top": bottom
		},
		//Event group
		{ 
			"left": left,
			"top": top
		},
		{
			"left": right,
			"top": midY
		},
		{
			"left": left,
			"top": bottom
		},
		{
			"left": midX,
			"top": top
		},
		{
			"left": left,
			"top": midY
		},
		{
			"left": right,
			"top": bottom
		},
		{
			"left": midX,
			"top": midY
		}
	];

	//Javascript animation
	let animInstance=actor.animate(keyFrames, {
		duration: duration,
		iterations: 1,
		//easing: "linear",
		//If you want to animate in distinct keyframe steps instead of smoothly interpolate it,
		//you can use "steps" easing with the number of steps being the number of keyframes without the start and end step, and using "jump-both"
		easing: "steps("+(keyFrames.length-2)+", jump-both)",
		fill: "forwards"
	});

	//
	actor.animInstance=animInstance;

	let sceneIndex=scene.index;
	scene.skippableAnimation = false;
	//
	scene.jsAnimatedElements.push(actor);

	animInstance.onfinish = function(event) {

		//console.log("finish event!");
		if(scene.index === sceneIndex)
		{
			//This writes the current (Finished) values of the animation to the inline style attribute
			//So that we can remove the animation later but still have the element have the final animation values we want
			animInstance.commitStyles();
			//We can cancel the animation now after we have commited it's final values in the inline style property
			animInstance.cancel();
			actor.animInstance=null;

			scene.jsAnimatedElements.splice(scene.jsAnimatedElements.indexOf(actor), 1);
			scene.skippableAnimation = true;
			processSceneCommand();
		}
	};
}

function moveActorAnimation(actor, posX, posY, duration, relative)
{
	//posX="-500";
	//duration=3000;

	//Relative position
	if(relative)
	{
		posX=(parseInt(actor.style.left)+posX)+"px";
		posY=(parseInt(actor.style.top)-posY)+"px";
	}
	//Absolute position
	else
	{
		posX=posX+"px";
		posY=(-1*posY)+"px";
	}

	/*
	console.log(actor.style.left);
	console.log(actor.style.top);
	console.log("pos x: "+posX);
	console.log("pox y: "+posY);
	*/

	let keyFrames=[
		//From
		{ 
			"left": actor.style.left,
			"top": actor.style.top
		},
		//To
		{
			"left": posX,
			"top": posY
		}
	];

	//Javascript animation
	let animInstance=actor.animate(keyFrames, {
		duration: duration,
		iterations: 1,
		easing: "linear",
		fill: "forwards"
	});

	//
	actor.animInstance=animInstance;

	let sceneIndex=scene.index;
	scene.skippableAnimation = false;
	//
	scene.jsAnimatedElements.push(actor);

	animInstance.onfinish = function(event) {

		//console.log("finish event!");
		if(scene.index === sceneIndex)
		{
			//This writes the current (Finished) values of the animation to the inline style attribute
			//So that we can remove the animation later but still have the element have the final animation values we want
			animInstance.commitStyles();
			//We can cancel the animation now after we have commited it's final values in the inline style property
			animInstance.cancel();
			actor.animInstance=null;

			scene.jsAnimatedElements.splice(scene.jsAnimatedElements.indexOf(actor), 1);
			scene.skippableAnimation = true;
			processSceneCommand();
		}
	};
}

/*
function removeActorAnimation()
{
	//Setting "transition-property" to "none" will cause the "transitionend" event not to be fired anymore
	actor.style.transitionProperty="none";
	actor.style.transitionDuration="";
	actor.style.transitionTimingFunction="";
}
*/

/*
function moveActorTransition(actor, posX, posY, duration)
{
	posX=posX+"px";
	posY=posY+"px";

	actor.style.transitionProperty="left, top";
	actor.style.transitionDuration=duration+"ms";
	actor.style.transitionTimingFunction="linear";

	actor.style.left=posX;
	actor.style.top=posY;

	let sceneIndex=scene.index;
	scene.skippableAnimation = false;
	//
	scene.transitionedElements.push(actor);

	actor.ontransitionend = function(event) {

		if(scene.index === sceneIndex)
		{
			removeActorTransition(actor);

			scene.transitionedElements.splice(scene.transitionedElements.indexOf(actor), 1);
			scene.skippableAnimation = true;
			processSceneCommand();
		}
		//console.log("Moving ended");
	};
}
*/

/*
function removeActorTransition(actor)
{
	//Setting "transition-property" to "none" will cause the "transitionend" event not to be fired anymore
	actor.style.transitionProperty="none";
	actor.style.transitionDuration="";
	actor.style.transitionTimingFunction="";
}
*/

//Set actor X or Y position, or both
//pos:
//ex: x=120
//ex: y=150
//ex: x=120|y=150
function setActorPosition(actor, pos)
{
	//console.log(actor);
	//console.log(pos);
	//actor.style.top="0px";

	switch(pos)
	{
		/*
		case "RIGHT":
			actor.style.left = "120px";
		break;
		case "LEFT":
			actor.style.left = "-440px";
		break;
		case "CENTER":
			//Game is 1280x760, and sprites are always 1024x1024. (1280-1024)/2=128px on each side
			actor.style.left = "128px";
			//actor.style.left = "0px";
		break;
		*/
		default:

			var entries=pos.split("|");
			for(let i=0; i<entries.length; i++)
			{
				var parts=entries[i].split("=");
				if(parts[0]==='x')
				{
					let left=0;
					/*
					if(actor.style.left!=="")
					{
						left=parseInt(actor.style.left);
					}
					*/
					var move_x=(+parts[1]);
					actor.style.left = left+move_x+"px";
				}
				else if(parts[0]==='y')
				{
					let top=0;
					/*
					if(actor.style.top!=="")
					{
						top=parseInt(actor.style.top);
					}
					*/
					var move_y=(+parts[1]);
					actor.style.top = top+move_y+"px";
				}
			}

		  break;
	}
}


function createActorWithSprite(actorImageId, pos)
{
	let actorCanvas=cloneCanvas(preload.actorCanvas[actorImageId]);
	actorCanvas.classList.add("actor");

	return actorCanvas;
}

//Replaces: currentActorCanvas in the DOM with a clone of it that has the new image sprite drawn on it
function replaceActorWithSprite(actorImageId, currentActorCanvas)
{
	//Clone the current canvase's values, but will not clone it's current drawn image
	let newActorCanvas=currentActorCanvas.cloneNode();

	//let actorCanvas=cloneCanvasWithValues(currentActorCanvas);

	let ctx=newActorCanvas.getContext("2d");
	ctx.drawImage(preload.actorCanvas[actorImageId], 0, 0);

	//Replace the current actor canvas in the DOM with the new one
	currentActorCanvas.replaceWith(newActorCanvas);

	return newActorCanvas;
}

function setActorPositionX(actor, pos, scale)
{
	//let currentWidth=parseFloat(getComputedStyle(actor).width);
	//currentWidth=Math.round(currentWidth);

	switch(pos)
	{
		case "RIGHT":
			//FIX!
			if(scale===undefined) {
				actor.style.left = "0px";
			}

			if(scale===1)	{
				actor.style.left = "95px";
			}
			else if(scale===0.65){
				actor.style.left = "380px";
			}

		  break;
		case "LEFT":
			//FIX!
			if(scale===undefined) {
				actor.style.left = "0px";
			}

			if(scale===1)	{
				actor.style.left = "-585px";
			}
			else if(scale===0.65){
				actor.style.left = "-300px";
			}

		  break;
		case "CENTER":
			//Game size is 1136x640, and actors are always 1024x740
			//(1136-1024)/2=56px on each side
			if(scale===undefined) {
				actor.style.left = "0px";
			}

			if(scale===1)	{
				actor.style.left = "56px";
			}
			else if(scale===0.65){
				actor.style.left = "56px";
			}

		  break;
		default:
			var parts=pos.split("=");
			if(parts[0]==='x')
			{
				var left=parseInt(actor.style.left);
				
				var move_x=-1*(+parts[1]);
				actor.style.left = left+move_x+"px";
			}

		  break;
	}
}

function setActorPositionY(actor, pos, scale)
{
	if(scale===undefined) {
		actor.style.top = "0px";
	}

	if(scale===1)
	{
		actor.style.top = "0px";
	}
	else if(scale===0.65)
	{
		actor.style.top = "0px";
	}

	//let currentHeight=parseFloat(getComputedStyle(actor).height);
	//currentHeight=Math.round(currentHeight);

	//actor.style.top = (((640 - parseInt(currentHeight))/2)+offsetY)+"px"; 
}

function setActorScale(actor, scale)
{
	let originalWidth=actor.width;
	//let originalHeight=actor.height;

	//Since the canvas will scale proportionately, we only need to change the width and the height will be automatically scaled too
	actor.style.width=Math.round(originalWidth*scale)+"px";
}

function cancelActorMovement(actor){
	actor.style.transition = "none";
}

/*
function canvasFromViewer()
{
	if(tlTools.jumping){
		return;
	}
	let bg = scene.alt.bg ? scene.elements.background : scene.elements.backgroundAlt;
	if(bg.children.length > 0){
		let evc = bg.children[0]
		scene.ctx.masked.drawImage(evc, 0, 0);
	} else {
		if(bg.style.opacity != "0"){
			let src = bg.style.backgroundImage.split('"')[1];
			let image = new Image();
			image.onload = function(){
				scene.ctx.masked.drawImage(image, 160, 0, 960, 720, 0, 0, 960, 720);
			}
			image.src = src;
		}
	}
	let drawOrder = []
	for(let actor of scene.actors){
		if(actor == null){
			continue;
		}
		if(actor.style.opacity == "1" && (actor.style.zIndex == "2" || actor.style.zIndex == "")){
			drawOrder.unshift(actor);
		} else if(actor.style.opacity == "1" && actor.style.zIndex == "3"){
			drawOrder.push(actor);
		}
	}
	for(let actor of drawOrder){
		let left = actor.offsetLeft + 160;
		let src = actor.style.backgroundImage.split('"')[1];
		let image = new Image();
		image.onload = function(){
			//scene.ctx.masked.drawImage(image, 160, 40, 960, 720, left, 20, 960, 720);
			scene.ctx.masked.drawImage(image, 0, 0, null, null, 0, 240, null, null);
		}
		image.src = src;
	}
}
*/

function cloneCanvas(toClone)
{
	let clone = document.createElement("canvas");
	let ctx = clone.getContext("2d");

	clone.height = toClone.height;
	clone.width = toClone.width;

	ctx.drawImage(toClone, 0, 0);

	return clone;
}

function createSpriteCanvas(imgEl, x, y, width, height)
{
	let spriteCanvas = document.createElement("canvas");
	let ctx = spriteCanvas.getContext("2d");

	spriteCanvas.width = width;
	spriteCanvas.height = height;

	ctx.drawImage(imgEl, x, y, width, height, 0, 0, width, height);

	return spriteCanvas;
}


/*
function animateTransition(dir, length)
{
	if(tlTools.jumping){
		return;
	}
	let elapsed = Date.now() - scene.transition.startTime;
	if(elapsed >= scene.transition.nextDraw){
		sceneElemVis("hidden");
		// copy the mask instead of referencing it since it needs to be reused
		let maskData = new ImageData(new Uint8ClampedArray(scene.transition.mask.data),scene.transition.mask.width,scene.transition.mask.height);
		let data = maskData.data
		let mod = Math.round((255 / length) * elapsed);
		let gco;
		if(dir == "IN"){
			gco = "source-in";
			for(let i = 0; i < data.length; i += 4){
				data[i+3] = data[i+3] - mod <= 0 ? 255 : 0;
			}
		} else if(dir == "OUT"){
			gco = "source-out";
			for(let i = 0; i < data.length; i += 4){
				data[i+3] = data[i+3] + mod >= 255 ? 255 : 0;
			}
		} else {
			console.log("Unknown Transition Direction")
		}
		scene.ctx.transition.fillStyle = "#000000";
		scene.ctx.transition.fillRect(0, 0, 1280, 720);
		scene.ctx.transition.globalCompositeOperation = "source-over";
		scene.ctx.transition.putImageData(maskData, 0, 0);
		scene.ctx.transition.globalCompositeOperation = gco;
		scene.ctx.transition.drawImage(scene.elements.masked, 0, 0);
		// 1000 / Target Frame Rate
		scene.transition.nextDraw += 16;
	}
}
*/

function sceneElemVis(vis){
	scene.elements.background.style.visibility = vis;
	scene.elements.backgroundAlt.style.visibility = vis;
	scene.elements.actors.style.visibility = vis;
}

/*
function cancelTransition(vis)
{
	clearInterval(scene.transition.interval);
	sceneElemVis(vis);
	scene.ctx.transition.clearRect(0, 0, 1280, 720);
	scene.skippableAnimation = true;
	scene.animatingElement = false;
	scene.transition.nextDraw = 0;
	scene.transition.startTime = 0;
}
*/

function normalWidth(string){
	return string.replace(/[\uff01-\uff5e]/g, function(ch){
		return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
	});
}

function translateName(name){
	let append = "";
	if(/[ａ-ｚＡ-Ｚ０-９？]/.test(name)){
		let idx = /[ａ-ｚＡ-Ｚ０-９？]/.exec(name).index;
		append = " " + normalWidth(name.substr(idx));
		name = name.substr(0, idx);
	} else if(/[a-zA-Z0-9]/.test(name)){
		// Some names don't use full width for some reason
		// Seperated because I expect it to fuck up some day
		let idx = /[a-zA-Z0-9]/.exec(name).index;
		append = " " + name.substr(idx);
		name = name.substr(0, idx);
	}
	name = name.trim();
	if(translatedNames.get(name)){
		return translatedNames.get(name) + append;
	} else {
		return name + append;
	}
}

/*
function confirmActorId(img, id)
{
	let identifier = getIdentifier(img);
	console.log(identifier)
	if(scene.actors[id]){
		if(identifier == getIdentifier(scene.actors[id].style.backgroundImage.split("char/")[1].split(".png")[0])){
			console.log("Correct actor Id");
			return id;
		}
	}
	for(let actor of scene.actors){
		if(identifier == getIdentifier(actor.style.backgroundImage.split("char/")[1].split(".png")[0])){
			console.log("Actor found, Id incorrect, setting to: " + scene.actors.indexOf(actor));
			return scene.actors.indexOf(actor);
		}
	}
	for(let i = 0; i<scene.actors.length + 1; i++){
		if(scene.actors[i] == null){
			console.log("Actor not found, Id taken, setting to: " + i);
			return i;
		}
	}

	function getIdentifier(img){
		let identifier = img.split("_")[0];
		if(identifier == "chr"){
			identifier = img.split("_")[1].substr(0,5);
		} else if(identifier == "ts"){
			identifier = img.split("_")[1].substr(0,4);
		}
		return identifier;
	}
}
*/

function switchAudio(type, aNew, aOld, aPre)
{
	type = type.toLowerCase();
	scene.current[type] = aPre;
	scene.prev[type] = aNew;
	preload.audio[type] = aOld;
}

function introEndedListener(event)
{
	//console.log("Intro ended, file: "+scene.current.bgm.src);

	//Shoudn't really happen, put if the intro is still fading in, then clear it
	clearInterval(scene.bgmFade);

	scene.current.bgm = preload.audio.bgm;
	scene.current.bgm.loop = true;

	scene.current.bgm.volume = prefs.audio.bgmVolume / 100;
	scene.current.bgm.play().catch(() => console.log("Failed to play audio, this is probably normal"));
}

//If the parent background holder has an animation canvas as a child with a running animation, stop the animation
function stopAnimationIfExist(parentElement)
{
	let animationCanvas=parentElement.querySelector(".animation-canvas");
	if((animationCanvas!==null) && (animationCanvas.intervalID!==null))
	{
		//clearInterval(animationCanvas.intervalID);
		cancelAnimationFrame(animationCanvas.intervalID);
		animationCanvas.intervalID=null;
	}
}



