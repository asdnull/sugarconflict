var main = {
	//allowCookies:checkCookie(),
	allowCookies:1,
	sceneList:[],
	view:{
		current:0, //Holds the current view. START_PAGE = 0;
		prev:0     //Holds the "main" view, so it can only be either: START_PAGE, SCENE_SELECT, SCENE_VIEWER or CG_VIEWER (never changes to OPTIONS_SCREEN or SEARCH_SCREEN)
	},
	elements:{
		head:{

		},
		foot:{

		},
		options:{

		}
	},
	data:{
		H_RPGX:false,
		STORY_RPGX:false
	},
	pause:{
		auto:false,
		slideshow:false,
		voice:false,
		bgm:false,
		bgVoice:false,
		bgSe:false,
		se:false
	},
	//If the viewer in general can be interacted with, starts as false
	//Setting this to false should cause most event listeners to do nothing
	//as this implies the viewer is currently in a state where doing so may cause problems
	interactable:false,
	paused:false,
	pausedAudio:false
};

/*
function setScreen(){
	if(main.data.H_RPGX)
	{
		main.elements.storySelect.style.display = "none";
	}
	else if(main.data.STORY_RPGX)
	{
		main.elements.storySelect.style.display = "initial"
	}
	loadSceneSelect();
}
*/

/*
function checkData(){
	main.data.H_RPGX = true;
	//Output version number of viewer
	console.log(config.release.name+" "+config.release.version+" - Release date: "+config.release.date);
}
*/

function stretchFrame(){
	if(prefs.scene.textBoxFullUnder){
		main.elements.contents.style.height = "901px"
		main.elements.contents.style.backgroundSize = "1002px 948px"
	} else {
		main.elements.contents.classList.add("stretch");
	}
}

function contractFrame(){
	main.elements.contents.classList.remove("stretch");
}

function killChildren(elem) {
	//AMERICA NO!
	while (elem.firstChild) {
		elem.removeChild(elem.firstChild);
	}
}

//Switches back to the scene select
function loadSceneSelect()
{
	mainInteractionEnabled(false);

	//When the scene viewer has faded out completely from black, bring the scene select back to the front to make it interactable again
	main.elements.viewer.ontransitionend=function(){

		main.elements.viewer.ontransitionend=null;
		main.elements.viewer.style.zIndex = "0";
		mainInteractionEnabled(true);
	};

	main.elements.viewer.style.opacity = "0";
	if(prefs.scene.textBoxUnder){
		contractFrame();
	}
	/*
	if(main.elements.storySelect.style.display == "initial"){
		main.view.current = STORY_SELECT;
	} else {
		main.view.current = SCENE_SELECT;
	}
	*/
	main.view.current = SCENE_SELECT;
	main.view.prev = SCENE_SELECT;

	switchView();
}

function switchSelectScreen(){
	if(main.view.current == SCENE_SELECT && main.data.STORY_RPGX)
	{
		main.elements.sceneSelect.style.display = "none"
		main.elements.storySelect.style.display = "initial"
		main.elements.foot.auto.innerHTML = "Select: Story";
		main.view.current = STORY_SELECT;
	}
	else if(main.view.current == STORY_SELECT && main.data.H_RPGX)
	{
		main.elements.sceneSelect.style.display = "initial"
		main.elements.storySelect.style.display = "none"
		main.elements.foot.auto.innerHTML = "Select: Scene";
		main.view.current = SCENE_SELECT;
	}
	switchView();
}

//Switches to the scene viewer
function loadSceneViewer()
{
	displayLoadScreen();
	closeTLChoiceBox();

	//
	mainInteractionEnabled(false);

	//When the scene viewer has faded in completely (since the scene viewer starts as black, this fades to black) start preparing the scene
	//If a transiton duraton is set (on opacity) then wait until the viewer has faded to black before continuing loading the scene
	//Unless the viewer has the setting "Loading screen" on, then start loading immediately since the loading screen is already shown with the call to: displayLoadScreen()
	//If main.elements.viewer.style.opacity === 1 then we are already in the scene viewer element (ie, we are in the CG viewer currently), so don't transition in that case
	if((window.getComputedStyle(main.elements.viewer).getPropertyValue("transition-duration")!=="0s") && !prefs.viewer.loadingScreen && (main.elements.viewer.style.opacity!=="1"))
	{
		main.elements.viewer.ontransitionend=function(event) {

			main.elements.viewer.ontransitionend=null;
			//prepareScene() is asynchronous since it eventually calls preloadSceneResources();
			prepareScene();
		};
	}
	//Or load the scene immediately
	else
	{
		//prepareScene() is asynchronous since it eventually calls preloadSceneResources();
		prepareScene();
	}

	main.elements.viewer.style.zIndex = "1"
	main.elements.viewer.style.opacity = "1";
	if(prefs.scene.textBoxUnder){
		stretchFrame();
	}
}

function displayLoadScreen(){
	if(prefs.viewer.loadingScreen){
		main.elements.loadingWrap.style.visibility = "initial";
	}
}

function isArray(obj) {
	if (typeof obj === "object" && obj.constructor === Array) {
		return true;
	} else {
		return false;
	}
}

//Creates what scene select works off of
function fillSceneList(){
	for(key of Object.keys(sceneData)){
		if(sceneData[key].SCRIPT){
			main.sceneList.push(key)
		} else if(sceneData[key].SCRIPTS.PART1.SCRIPT){
			main.sceneList.push(key)
		}
	}
}

//If the main events should be able to run or not
//also aplies styles to show that the buttons no longer can be interacted with
//status: true/false
function mainInteractionEnabled(status)
{
	if(status===true)
	{
		//Header buttons
		main.elements.head.controls.classList.remove("disabled-btn");
		main.elements.head.options.classList.remove("disabled-btn");
		main.elements.head.search.classList.remove("disabled-btn");
		main.elements.head.favourites.classList.remove("disabled-btn");
		main.elements.head.prevPage.classList.remove("disabled-btn");
		main.elements.head.nextPage.classList.remove("disabled-btn");

		main.elements.pageNumber.removeAttribute("disabled", "disabled");

		//Footer buttons
		main.elements.foot.exit.classList.remove("disabled-btn");
		main.elements.foot.skip.classList.remove("disabled-btn");
		main.elements.foot.auto.classList.remove("disabled-btn");
		main.elements.foot.mode.classList.remove("disabled-btn");
	}
	else
	{
		//Header buttons
		main.elements.head.controls.classList.add("disabled-btn");
		main.elements.head.options.classList.add("disabled-btn");
		main.elements.head.search.classList.add("disabled-btn");
		main.elements.head.favourites.classList.add("disabled-btn");
		main.elements.head.prevPage.classList.add("disabled-btn");
		main.elements.head.nextPage.classList.add("disabled-btn");

		main.elements.pageNumber.setAttribute("disabled", "disabled");

		//Footer buttons
		main.elements.foot.exit.classList.add("disabled-btn");
		main.elements.foot.skip.classList.add("disabled-btn");
		main.elements.foot.auto.classList.add("disabled-btn");
		main.elements.foot.mode.classList.add("disabled-btn");
	}
	main.interactable=status;
}

//To pause or unpause the viewer
//The viewer being paused means that in ex a scene no new events should be processed
//and that current events if any (ex FADE transitions) should be immediately paused
//Animations should stop playing in "CG mode" etc
//At the very least, anything that on completion will start processing the next event in line needs to be stopped
//status: true/false
function pauseViewer(status)
{
	if(status===true)
	{
		//
		main.pause.auto = false;
		main.pause.slideshow = false;

		//Waiting event, if active
		if(scene.waitingTimer!==null)
		{
			clearTimeout(scene.waitingTimer);
			scene.waitingTimer=null;
			scene.waiting=false;

			scene.waitingTimeElapsed=Date.now() - scene.waitingStartTime;
			scene.waitingDuration=scene.waitingDuration - scene.waitingTimeElapsed;
		}

		//Animations (CSS)
		//Pause all active animations (if any) at their current state so that the "animationend" event won't fire later since the animation is paused
		for(let element of scene.animatedElements)
		{
			element.style.animationPlayState = "paused";
		}

		//Animations (JS)
		for(let element of scene.jsAnimatedElements)
		{
			element.animInstance.pause();
		}

		//Animations (requestAnimation)
		for(let element of scene.requestAnimationElements)
		{
			//Save the time the animation has already been running so we can continue later where we left of
			element.elapsedTime = document.timeline.currentTime - element.startTime;

			cancelAnimationFrame(element.requestID);
			element.requestID=null;
		}

		//Async animations (requestAnimation)
		for(let element of scene.requestAnimationScaleAsync)
		{
			//Save the time the animation has already been running so we can continue later where we left of
			element.elapsedTime = document.timeline.currentTime - element.startTime;

			cancelAnimationFrame(element.requestID);
			element.requestID=null;
		}

		//Spine (current spine scene)
		if(scene.current.spineAnimation!==null && scene.current.spineAnimation.spinePlayer.paused===false)
		{
			scene.current.spineAnimation.forcePause=true;
			scene.current.spineAnimation.spinePlayer.paused=true;
		}

		//Videos (Since a video could be of the "wait" type, that will advance to the next command when the video finishes playing once)
		if(scene.current.video!==null)
		{
			scene.current.video.pause();
		}

		//Text auto mode
		if(scene.mode == 1){
			main.pause.auto = true;
			toggleOffSceneAutoMode();
		}
		
		//Only used in the CG viewer
		if(cgViewer.slideshow){
			main.pause.slideshow = true;
			toggleOffSlideShow();
		}

		//toggleOffSceneSkipping();
	}
	else
	{
		//Waiting event, if it used to be active before the pause
		if(scene.waitingTimeElapsed!==null)
		{
			scene.waitingTimer=setTimeout(function(){

				if(scene.waitIndex == scene.index)
				{
					scene.waiting=false;
					scene.waitingTimer=null;

					processSceneCommand();
				}
			}, scene.waitingDuration);

			scene.waiting=true;
			scene.waitingTimeElapsed=null;
			scene.waitingStartTime=Date.now();
		}

		//Animations (CSS)
		//Resume all paused animations (if any) from their current state again
		for(let element of scene.animatedElements)
		{
			element.style.animationPlayState = "running";
		}

		//Animations (JS)
		for(let element of scene.jsAnimatedElements)
		{
			element.animInstance.play();
		}

		//Animations (requestAnimation)
		for(let element of scene.requestAnimationElements)
		{
			//If the animation hasn't finished yet, call it again, starting from the point we paused it at before
			if(element.reqAnimCallback!==null) {

				element.startTime = document.timeline.currentTime - element.elapsedTime;
				element.requestID=requestAnimationFrame(element.reqAnimCallback);
			}
		}

		//Async animations (requestAnimation)
		for(let element of scene.requestAnimationScaleAsync)
		{
			//If the animation hasn't finished yet, call it again, starting from the point we paused it at before
			//scene.requestAnimationScaleAsync only includes animations that haven't finished yet
			element.startTime = document.timeline.currentTime - element.elapsedTime;
			element.requestID=requestAnimationFrame(element.reqAnimCallback);
		}

		//Spine (current spine scene)
		if(scene.current.spineAnimation!==null && scene.current.spineAnimation.forcePause)
		{
			scene.current.spineAnimation.forcePause=false;
			scene.current.spineAnimation.spinePlayer.paused=false;
		}

		//Videos (Since a video could be of the "wait" type, that will advance to the next command when the video finishes playing once)
		if(scene.current.video!==null)
		{
			//If the video is looping, then always play it again
			if(scene.current.video.loop)
			{
				scene.current.video.play();
			}
		  //If the video should only be played once, then play it again if it hasn't reached the end, otherwise do nothing
			else if(scene.current.video.currentTime < scene.current.video.duration)
			{
				scene.current.video.play();
			}
		}

		//Text auto mode
		if(main.pause.auto){
			toggleSceneAutoMode();
		}
		
		//Only used in the CG viewer
		if(main.pause.slideshow){
			toggleSlideShow();
		}
	}

	main.paused=status;
}

//Pause/unpause audio
//status: true/false
function pauseAudio(status)
{
	if(status===true)
	{
		main.pause.voice = false;
		main.pause.bgVoice = false;
		main.pause.bgSe = false;
		main.pause.bgm = false;
		main.pause.se = false;

		//Audio
		if(!scene.current.bgm.paused){
			main.pause.bgm = true;
			scene.current.bgm.pause();
		}
		/*
		if(!scene.current.voice.paused){
			main.pause.voice = true;
			scene.current.voice.pause();
		}
		*/
		if(scene.current.voice.forcePauseAllAudio()){
			main.pause.voice = true;
		}

		if(scene.current.bgVoice.forcePauseAllAudio()){
			main.pause.bgVoice = true;
		}
		if(scene.current.bgSe.forcePauseAllAudio()){
			main.pause.bgSe = true;
		}
		if(scene.current.se.forcePauseAllAudio()){
			main.pause.se = true;
		}
		/*
		if(!scene.current.bgVoice.paused){
			main.pause.bgVoice = true;
			scene.current.bgVoice.pause();
		}
		if(!scene.current.bgSe.paused){
			main.pause.bgSe = true;
			scene.current.bgSe.pause();
		}
		if(!scene.current.se.paused){
			main.pause.se = true;
			scene.current.se.pause();
		}
		*/
	}
	else
	{
		//Audio
		//It's possible that when the window recieves focus again that the BGM has already ended (ie BGM_STOP with a fade duration)
		//But since the bgm's volume will then be 0 it's not a problem even if we play() it again since it's not audible
		if(main.pause.bgm){
			scene.current.bgm.play();
		}
		if(main.pause.voice){
			//scene.current.voice.play();
			scene.current.voice.playAllForcePausedAudio();
		}
		if(main.pause.bgVoice){
			//scene.current.bgVoice.play();
			scene.current.bgVoice.playAllForcePausedAudio();
		}
		if(main.pause.bgSe){
			//scene.current.bgSe.play();
			scene.current.bgSe.playAllForcePausedAudio();
		}
		if(main.pause.se){
			//scene.current.se.play();
			scene.current.se.playAllForcePausedAudio();
		}
	}

	main.pausedAudio=status;
}

/*
function checkCookie(){
    var cookieEnabled = navigator.cookieEnabled;
    if (!cookieEnabled){ 
        document.cookie = "testcookie";
        cookieEnabled = document.cookie.indexOf("testcookie")!=-1;
    }
    return cookieEnabled;
}
*/

/*
function hideScrollBars () 
{
  let inner = document.createElement('p');
  inner.style.width = "100%";
  inner.style.height = "200px";

  let outer = document.createElement('div');
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild (inner);

  document.body.appendChild (outer);
  let w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  let w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;

  document.body.removeChild (outer);

  document.documentElement.style.setProperty("--scrollbar-width", (w1 - w2) + "px");
};
*/

/*
function sendAlert(msg, options){
	main.elements.alertBox.visibility = "initial";
	main.elements.alertMsg.innerHTML = msg;
	for(let opt of options){
		let btn = document.createElement("div")
		btn.classList = "alert-btn";
		btn.innerHTML = opt[0];
		btn.addEventListener("click", opt[1], false);
		main.elements.alertOpts.appendChild(btn);
	}
}
*/