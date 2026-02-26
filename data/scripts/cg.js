var cgViewer = {
	imgQ:[],
	//spines:null,
	//currentSpine:0,
	//currentSpineAnimation:0,
	sceneQ:[],
	index:0,
	slideshow:false,
	scene:"0000",
	rpgx:true,
	alt:false,
	elements:{

	},
	cgItems: []
}

/*
function displaySpineCG()
{	
	let currentSpine=cgViewer.spines[cgViewer.currentSpine].spine;
	let currentSpineAnim=cgViewer.spines[cgViewer.currentSpine]['animations'][cgViewer.currentSpineAnimation];

	//
	let cgElement = cgViewer.alt ? cgViewer.elements.cgAlt : cgViewer.elements.cg;

	//Remove any old spine players, if any
	for(let child of cgElement.children)
	{
		if(child.baseFilename!==currentSpine)
		{
			//main.elements.spineViewersHoldElem.appendChild(child);
			//Remove it completely both from the DOM and the preloaded array: preload.spines 
			cgElement.removeChild(child);

			//Need to call dispose() so it stops calling requestAnimationFrame() again and so that the already queued frame just returnes doing nothing
			preload.spines[child.baseFilename].spinePlayer.dispose();
			preload.spines[child.baseFilename].spinePlayer.context.canvas=null;
			//Need to clear the the drawing context stored in context.gl so that we don't get the warnings "to many active contexts" anymore
			preload.spines[child.baseFilename].spinePlayer.context.gl=null;
			preload.spines[child.baseFilename].spinePlayer=null;

			delete preload.spines[child.baseFilename];
		}
  }

	cgElement.appendChild(preload.spines[currentSpine]);
	//preload.spines[cgViewer.currentSpine].style.visibility = "initial";

	preload.spines[currentSpine].spinePlayer.paused=false;

	//If "Mix effect" is "ON" in the "CG" settings, then add a short mix time between the animations
	if(prefs.cg.fadeEffect) {
		preload.spines[currentSpine].spinePlayer.animationState.data.defaultMix=0.1;
	}

	//Animations can be changed when the player is paused, so the first frame of the new animation will still be displayed, which is what we want to happen
	preload.spines[currentSpine].spinePlayer.setAnimation(currentSpineAnim, true); 

	//
	let viewport1=structuredClone(preload.spines[currentSpine].viewport);

	let spinePlayer1=preload.spines[currentSpine].spinePlayer;
	//spinePlayer1.calculateAnimationViewport(spinePlayer1.skeleton.data.findAnimation(animationName), preload.spines[preload.currentSpine].viewport);
	spinePlayer1.calculateAnimationViewport(spinePlayer1.skeleton.data.findAnimation(currentSpineAnim), viewport1);
}
*/

/*
function setNextSpineCG()
{
	if(cgViewer.spines===null)
	{
		let script=sceneData[cgViewer.scene].SCRIPTS["PART1"].SCRIPT;

		cgViewer.spines=getSpineAnimations(script);

		preloadSpinePlayers(script, function callback(){
			displaySpineCG();
		});

		return;
	}
	else
	{
		cgViewer.currentSpineAnimation++;
	}	

	//Get the next spines animations
	if(cgViewer.currentSpineAnimation >= cgViewer.spines[cgViewer.currentSpine]['animations'].length)
	{
		cgViewer.currentSpineAnimation=0;
		cgViewer.currentSpine++;
		//Get next scene if no more spines to go through
		if(cgViewer.currentSpine >= cgViewer.spines.length)
		{
			cgViewer.scene = cgViewer.sceneQ.indexOf(cgViewer.scene) != cgViewer.sceneQ.length - 1 ? cgViewer.sceneQ[cgViewer.sceneQ.indexOf(cgViewer.scene) + 1] : cgViewer.sceneQ[0];
			//cgViewer.index = 0;
			
			//Spine player preloading
			scene.id = cgViewer.scene;
			scene.animated = sceneData[cgViewer.scene].SCRIPTS["PART1"].ANIMATED;
		
			let script=sceneData[cgViewer.scene].SCRIPTS["PART1"].SCRIPT;

			cgViewer.currentSpine=0;
			cgViewer.spines=getSpineAnimations(script);
		
			preloadSpinePlayers(script, function callback(){
				displaySpineCG();
			});

			return;
		}
	}

	displaySpineCG();
}
*/

/*
function setPrevSpineCG()
{
	
//	if(cgViewer.spines===null)
	//{
	//	let script=sceneData[cgViewer.scene].SCRIPTS["PART1"].SCRIPT;

	//	cgViewer.spines=getSpineAnimations(script);

	//	preloadSpinePlayers(script, function callback(){
	//		displaySpineCG();
	//	});

	//	return;
//	}
	//else
	//{
	//	cgViewer.currentSpineAnimation++;
	//}	
	
	cgViewer.currentSpineAnimation--;

	//Get the next spines animations
	if(cgViewer.currentSpineAnimation < 0)
	{
		//cgViewer.currentSpineAnimation=0;
		cgViewer.currentSpine--;
		//Get next scene if no more spines to go through
		if(cgViewer.currentSpine < 0)
		{
			cgViewer.scene = cgViewer.sceneQ.indexOf(cgViewer.scene) != 0 ? cgViewer.sceneQ[cgViewer.sceneQ.indexOf(cgViewer.scene) - 1] : cgViewer.sceneQ[cgViewer.sceneQ.length - 1];
			//cgViewer.index = 0;
			
			//Spine player preloading
			scene.id = cgViewer.scene;
			scene.animated = sceneData[cgViewer.scene].SCRIPTS["PART1"].ANIMATED;
		
			let script=sceneData[cgViewer.scene].SCRIPTS["PART1"].SCRIPT;

			cgViewer.spines=getSpineAnimations(script);

			cgViewer.currentSpine=cgViewer.spines.length-1;
			cgViewer.currentSpineAnimation=cgViewer.spines[cgViewer.currentSpine]['animations'].length-1;
		
			preloadSpinePlayers(script, function callback(){
				displaySpineCG();
			});

			return;
		}
		else
		{
			cgViewer.currentSpineAnimation=cgViewer.spines[cgViewer.currentSpine]['animations'].length-1;
		}
	}

	displaySpineCG();
}
*/

function preloadCgItems(sceneScript, callback)
{
  //Preloads canvases, that are used by ex: "EV" and "SPINE_IMAGE" events
  createCanvases(sceneScript, function (){

		//cgViewer.spines=getSpineAnimations(sceneScript);
		preloadSpinePlayers(sceneScript, function (){

			preloadVideos(sceneScript, function (){
				callback();
			});
		});	
	});
}

function setCgItems(direction)
{
	//If cgViewer.cgItems hasn't been initialized yet (like when the CG viewer first starts), get the current scenes CG items
	if(cgViewer.cgItems.length===0) {
		cgViewer.index=0;
		cgViewer.cgItems=getCGsFromScene(cgViewer.scene);

		//Preload all CG items for the current scene
		preloadCgItems(sceneData[cgViewer.scene].SCRIPTS["PART1"].SCRIPT, function (){

			displayCG();

			if(cgViewer.slideshow){
				slideshowMode();
			}
			mainInteractionEnabled(true);
		});

		return;
	}

	//
	if(direction==="next")
	{
		if(cgViewer.index >= cgViewer.cgItems.length)
		{
			cgViewer.scene=cgViewer.sceneQ.indexOf(cgViewer.scene) != cgViewer.sceneQ.length - 1 ? cgViewer.sceneQ[cgViewer.sceneQ.indexOf(cgViewer.scene) + 1] : cgViewer.sceneQ[0];
			
			//Spine player preloading
			scene.id=cgViewer.scene;
			scene.animated=sceneData[cgViewer.scene].SCRIPTS["PART1"].ANIMATED;
			//cgViewer.currentSpine=0;
			//cgViewer.spines=getSpineAnimations(script);

			let oldCgItems=cgViewer.cgItems;
			cgViewer.cgItems=getCGsFromScene(cgViewer.scene);
			cgViewer.index=0;

			//Cancel the slideshow, if it's currently active
			cancelSlideshowTimer();

			//Make the viewer non-interactive until preloading is done
			mainInteractionEnabled(false);

	  	//Preload all CG items for the current scene
		  preloadCgItems(sceneData[cgViewer.scene].SCRIPTS["PART1"].SCRIPT, function (){

				//Remove the old preloaded spine items from the previous scene
				//NOTE! if the new scene uses the same spines as the old scene this will obvously break the CG viewer, but that shouldn't happen in practice
				removeOldSpinePreload(oldCgItems);
				scene.current.spineAnimation=null;

				//Display the new item
				displayCG();

				if(cgViewer.slideshow){
					slideshowMode();
				}
				mainInteractionEnabled(true);
			});

			return;
		}
	}
	else if(direction==="prev")
	{
		if(cgViewer.index < 0)
		{
			cgViewer.scene=cgViewer.sceneQ.indexOf(cgViewer.scene) != 0 ? cgViewer.sceneQ[cgViewer.sceneQ.indexOf(cgViewer.scene) - 1] : cgViewer.sceneQ[cgViewer.sceneQ.length - 1];
			
			//Spine player preloading
			scene.id=cgViewer.scene;
			scene.animated=sceneData[cgViewer.scene].SCRIPTS["PART1"].ANIMATED;
			//cgViewer.currentSpine=0;
			//cgViewer.spines=getSpineAnimations(script);

			let oldCgItems=cgViewer.cgItems;
			cgViewer.cgItems=getCGsFromScene(cgViewer.scene);
			cgViewer.index=cgViewer.cgItems.length-1;

			//Cancel the slideshow, if it's currently active
			cancelSlideshowTimer();

			//Make the viewer non-interactive until preloading is done
			mainInteractionEnabled(false);

	  	//Preload all CG items for the current scene
		  preloadCgItems(sceneData[cgViewer.scene].SCRIPTS["PART1"].SCRIPT, function (){

				//Remove the old preloaded spine items from the previous scene
				//NOTE! if the new scene uses the same spines as the old scene this will obviously break the CG viewer, but that shouldn't happen in practice
				removeOldSpinePreload(oldCgItems);
				scene.current.spineAnimation=null;
				
				//Display the new item
				displayCG();

				if(cgViewer.slideshow){
					slideshowMode();
				}
				mainInteractionEnabled(true);
			});
			
			return;
		}
	}

	displayCG();
}

function displayVideoCG(cgItem)
{
	let filename=cgItem.filename;

	let cgElement = cgViewer.alt ? cgViewer.elements.cgAlt : cgViewer.elements.cg;

	//Remove old items, if any
	for(let child of cgElement.children)
	{
		//Remove old EV images, if any
		if(child.classList.contains("tempPreloadImage"))
		{
			child.style.visibility = "hidden";
			main.elements.canvasHoldElem.append(child);
		}
		//Remove old spine players, if any
		else if(child.spinePlayer!==undefined)
		{
			main.elements.spineViewersHoldElem.appendChild(child);
		}
		//Remove old videos, if any
		else if(child.classList.contains("video-item"))
		{
			child.pause();

			child.classList="tempPreloadVideo";
			preload.tempElem.appendChild(child);
		}
	}
	cgElement.style.background = "";
	scene.current.spineAnimation = null;

	//Add the video to the CG element
	cgElement.appendChild(preload.temp[filename]);
	preload.temp[filename].classList="video-item";

	//Reset and play video
	preload.temp[filename].currentTime=0;
	preload.temp[filename].playbackRate = prefs.viewer.animationSpeed / 100;
	preload.temp[filename].loop=true;
	preload.temp[filename].play().catch(() => console.log("Failed to play video, this is probably normal if you are changing them too fast"));
}

function displayEvCgItem(cgItem)
{
	let filename=cgItem.filename;

	let cgElement = cgViewer.alt ? cgViewer.elements.cgAlt : cgViewer.elements.cg;
	//let curCG = cgViewer.imgQ[cgViewer.index];

	//Remove old items, if any
	for(let child of cgElement.children)
	{
		//Remove old EV images, if any
		if(child.classList.contains("tempPreloadImage"))
		{
			child.style.visibility = "hidden";
			main.elements.canvasHoldElem.append(child);
		}
		//Remove old spine players, if any
		else if(child.spinePlayer!==undefined)
		{
			main.elements.spineViewersHoldElem.appendChild(child);
		}
		//Remove old videos, if any
		else if(child.classList.contains("video-item"))
		{
			child.pause();

			child.classList="tempPreloadVideo";
			preload.tempElem.appendChild(child);
		}
	}
	cgElement.style.background = "";

	cgElement.appendChild(preload.canvas[filename]);
	preload.canvas[filename].style.visibility = "initial";

	scene.current.spineAnimation = null;
}

function displaySpineCG(cgItem)
{
	let currentSpine=cgItem.filename;
	let currentSpineAnim=cgItem.animation;

	//
	let cgElement = cgViewer.alt ? cgViewer.elements.cgAlt : cgViewer.elements.cg;

	//Remove old items, if any
	for(let child of cgElement.children)
	{
		//Remove old EV images, if any
		if(child.classList.contains("tempPreloadImage"))
		{
			child.style.visibility = "hidden";
			main.elements.canvasHoldElem.append(child);
		}
		//Remove old spine players, if any
		else if(child.spinePlayer!==undefined)
		{
			if(child.baseFilename!==currentSpine)
			{
				main.elements.spineViewersHoldElem.appendChild(child);
			}
		}
		//Remove old videos, if any
		else if(child.classList.contains("video-item"))
		{
			child.pause();

			child.classList="tempPreloadVideo";
			preload.tempElem.appendChild(child);
		}
	}
	cgElement.style.background = "";

	//
	cgElement.appendChild(preload.spines[currentSpine]);
	//preload.spines[cgViewer.currentSpine].style.visibility = "initial";
	scene.current.spineAnimation=preload.spines[currentSpine];

	preload.spines[currentSpine].spinePlayer.paused=false;

	//If "Mix effect" is "ON" in the "CG" settings, then add a short mix time between the animations
	if(prefs.cg.fadeEffect) {
		preload.spines[currentSpine].spinePlayer.animationState.data.defaultMix=0.1;
	}

	//Set spine animation speed, 1.0 is the default speed
	preload.spines[currentSpine].spinePlayer.setSpeed(prefs.viewer.animationSpeed / 100);

	//Animations can be changed when the player is paused, so the first frame of the new animation will still be displayed, which is what we want to happen
	preload.spines[currentSpine].spinePlayer.setAnimation(currentSpineAnim, true); 

	//
	/*
	let viewport1=structuredClone(preload.spines[currentSpine].viewport);

	let spinePlayer1=preload.spines[currentSpine].spinePlayer;
	spinePlayer1.calculateAnimationViewport(spinePlayer1.skeleton.data.findAnimation(currentSpineAnim), viewport1);
	*/
	//We need to call calculateAnimationViewport() here otherwise the new animation won't be displayed if the animation is currently paused
	//preload.spines[currentSpine].spinePlayer.calculateAnimationViewport(animationName);
}

function displayCG()
{
	//cgViewer.cgItems=getCGsFromScene(cgViewer.scene);
	let cgItem=cgViewer.cgItems[cgViewer.index];
	//debugger;

	if(cgItem.event==="EV")
	{
		displayEvCgItem(cgItem);
	}
	else if(cgItem.event==="SPINE")
	{
		displaySpineCG(cgItem);
	}
	else if(cgItem.event==="VIDEO")
	{
		displayVideoCG(cgItem);
	}
	else
	{
		console.error("Error, unknown event: "+cgItem.event);
	}
}


function startCGViewMode(id)
{
	buildCGViewer();

	main.elements.viewer.style.zIndex = "1"
	main.elements.viewer.style.opacity = "1";
	
	main.view.current = CG_VIEWER;
	main.view.prev = CG_VIEWER;

	switchView();

	//An array with all the names of the scenes 
	//Used to select which scene to display CGs from next/prev when done with the current scene (can be shuffled for a random next scene)
	cgViewer.sceneQ = Array.from(main.sceneList); 

	//To shuffle the scene list or not, for a random next/prev scene
	if(prefs.cg.shuffleScene){
		shuffle(cgViewer.sceneQ);
	}

	scene.type = CG_RPGX;

	cgViewer.scene = id;
	//That the scene is a RPGX scene, pretty useless
	cgViewer.rpgx = sceneData[cgViewer.scene].rpgx;

	cgViewer.index = 0;
	cgViewer.slideshow = prefs.cg.slideshow;
	if(cgViewer.slideshow){
		main.elements.foot.mode.innerHTML = "Mode: Slide";
		//slideshowMode();
	}
	main.elements.foot.auto.innerHTML = "";
	main.elements.foot.skip.innerHTML = "Play Scene";

	scene.id = id;
	scene.animated = sceneData[cgViewer.scene].SCRIPTS["PART1"].ANIMATED;

	//Make the viewer non-interactive until the transition and the subsequent preloading is done
	mainInteractionEnabled(false);

	//When the scene viewer has faded in completely to black, start preloading cg items
	main.elements.viewer.ontransitionend=function(){

		main.elements.viewer.ontransitionend=null;
	  //Get all CG items for all types in the current scene (currently 'EV' and 'SPINE_PLAY' events) and preloads them first
  	setCgItems("next");
	};

	//cgViewer.cgItems=getCGsFromScene(cgViewer.scene);
	//displayCG();

	//nextCG();
	/*
	let script=sceneData[cgViewer.scene].SCRIPTS["PART1"].SCRIPT;

	//Get all spine animations used in the scene script
	//cgViewer.spineAnimations=getSpineAnimations(script);

	//When done pre-loading spine players
	//Spine players are put in main.elements.spineViewersHoldElem
	//And are in the array: preload.spines[imagefile]
	preloadSpinePlayers(script, function callback(){

		setCurrentCGSpine();
	});
	*/

	/*
	preload.spines[imagefile] = document.createElement("div");
	preload.spines[imagefile].classList="spine-player-item";
	preload.spines[imagefile].id="spine-player_"+imagefile;
	//Save the base filename used in the spine player
	preload.spines[imagefile].baseFilename=imagefile;

	//Add the spine viewer element the preload wrapper element
	main.elements.spineViewersHoldElem.appendChild(preload.spines[imagefile]);
	*/

	/*
	//////////////
	//fillImgQ()
	//Gets the images used in the scene to the array: cgViewer.imgQ
	let data = sceneData[cgViewer.scene].SCRIPTS[part];
	cgViewer.imgQ.push.apply(cgViewer.imgQ, data.images);

	//preloadCGs()
	//Just preloads all the images to the array: preload.canvas[canvas.id] = canvas;
	for(let image of cgViewer.imgQ)
	{
		preloadCG(image, cgViewer.scene);
	}
	  //preloadCG()
	  //Create canvas from image filename
	  createCanvas([image]);

	    //createCanvas()
			//Creates a canvas and draws the image from image filename to it after it's been loaded
			//Then puts the canvas file in: preload.canvas[canvas.id] //canvas.id = image filename
				drawImage(canvas, files[0]);
			}
			main.elements.canvasHoldElem.append(canvas);

			canvas.classList.add("tempPreloadImage");
			preload.canvas[canvas.id] = canvas;

	//displayCG()
	//Hide and puts previous CGs back to the pre-loader container element
	for (let child of cgElem.children)
	{
		child.style.visibility = "hidden";
		main.elements.canvasHoldElem.append(child);
	}
	//Append the new Image to the container element
	cgElem.appendChild(preload.canvas[curCG]);
	preload.canvas[curCG].style.visibility = "initial";
  */
  ////////////

	//OLD
	//fillImgQ();
	//preloadCGs();
	//displayCG();
}

function exitCGViewMode()
{
	main.elements.foot.mode.value = "Mode: CG";
	toggleOffSlideShow()
	cgViewer.imgQ = [];

	emptySpinePreload();
	scene.current.spineAnimation=null;
	//cgViewer.spines=null;
	//cgViewer.currentSpine=0;
	//cgViewer.currentSpineAnimation=0;

	cgViewer.index=0;
	cgViewer.cgItems=[];

	killChildren(main.elements.viewer);
	emptyTempPreload();

	//Switch to scene select view
	//loadSceneSelect();
}

function buildCGViewer(){
	cgViewer.elements.cg = document.createElement("div");
	cgViewer.elements.cgAlt = document.createElement("div");
	cgViewer.elements.cg.classList = "viewer-main-class viewer-large-image";
	cgViewer.elements.cgAlt.classList = "viewer-main-class viewer-large-image";
	main.elements.viewer.appendChild(cgViewer.elements.cg);
	main.elements.viewer.appendChild(cgViewer.elements.cgAlt);
}

/*
function nextCGScene()
{
	if(prefs.cg.randomScene || prefs.cg.randomImg){
		cgViewer.scene = cgViewer.sceneQ[Math.floor(Math.random() * cgViewer.sceneQ.length)];
	} else {
		cgViewer.scene = cgViewer.sceneQ.indexOf(cgViewer.scene) != cgViewer.sceneQ.length - 1 ? cgViewer.sceneQ[cgViewer.sceneQ.indexOf(cgViewer.scene) + 1] : cgViewer.sceneQ[0];
	}

	cgViewer.index = 0;
	emptyTempPreload();
	cgViewer.imgQ = [];
	cgViewer.rpgx = sceneData[cgViewer.scene].rpgx;
	scene.type = cgViewer.rpgx ? CG_RPGX : CG_TABA;
	
	
	//Spine player preloading
	//scene.id = cgViewer.scene;
	//scene.animated = sceneData[cgViewer.scene].SCRIPTS["PART1"].ANIMATED;

	//let script=sceneData[cgViewer.scene].SCRIPTS["PART1"].SCRIPT;

	//preloadSpinePlayers(script, function callback(){
	//	displaySpineCG();
	//});
	

	fillImgQ();
	preloadCGs();
}
*/

/*
function prevCGScene()
{
	if(prefs.cg.randomScene || prefs.cg.randomImg){
		cgViewer.scene = cgViewer.sceneQ[Math.floor(Math.random() * cgViewer.sceneQ.length)];
	} else {
		cgViewer.scene = cgViewer.sceneQ.indexOf(cgViewer.scene) != 0 ? cgViewer.sceneQ[cgViewer.sceneQ.indexOf(cgViewer.scene) - 1] : cgViewer.sceneQ[cgViewer.sceneQ.length - 1];
	}

	emptyTempPreload();
	cgViewer.imgQ = [];
	cgViewer.rpgx = sceneData[cgViewer.scene].rpgx;
	scene.type = cgViewer.rpgx ? CG_RPGX : CG_TABA;
	
	//Spine player preloading
	//scene.id = cgViewer.scene;
	//scene.animated = sceneData[cgViewer.scene].SCRIPTS["PART1"].ANIMATED;

	//let script=sceneData[cgViewer.scene].SCRIPTS["PART1"].SCRIPT;

	//preloadSpinePlayers(script, function callback(){
	//	displaySpineCG();
	//});

	fillImgQ();
	preloadCGs();
}
*/

function nextCG()
{
	cgViewer.index++;
	setCgItems("next");
	//setNextSpineCG();
}

function prevCG()
{
	cgViewer.index--;
	setCgItems("prev");
	//setPrevSpineCG();
}

/*
function nextCG()
{
	if(prefs.cg.randomImg){
		nextCGScene();
	} else if(cgViewer.index >= cgViewer.imgQ.length - 1){
		nextCGScene();
		cgViewer.index = 0;
	} else {
		cgViewer.index++;
	}
	displayCG();
}
*/

/*
function prevCG()
{
	if(prefs.cg.randomImg){
		prevCGScene();
	} else if(cgViewer.index <= 0){
		prevCGScene();
		cgViewer.index = cgViewer.imgQ.length - 1;
	} else {
		cgViewer.index--;
	}
	displayCG();
}
*/

/*
function fillImgQ()
{
	for(let part in sceneData[cgViewer.scene].SCRIPTS){
		let data = sceneData[cgViewer.scene].SCRIPTS[part];
		cgViewer.imgQ.push.apply(cgViewer.imgQ, data.images);
	}
}
*/

/*
function preloadCGs()
{
	for(let image of cgViewer.imgQ)
	{
		preloadCG(image, cgViewer.scene);
	}
}
*/

/*
function preloadCG(image, id)
{
	let scene = sceneData[id];

	for(let part in scene.SCRIPTS)
	{
		let data = scene.SCRIPTS[part];
		//data.images hold all the "EV" images in the script, so that image gets preloaded here
		if(data.images.includes(image))
		{
			createCanvas([image]);
			break;
		}
	}
}
*/

//function displayCG()
//{
	/*
	let cgElem = cgViewer.alt ? cgViewer.elements.cgAlt : cgViewer.elements.cg;
	let curCG = cgViewer.imgQ[cgViewer.index];

	for (let child of cgElem.children){
		child.style.visibility = "hidden";
		main.elements.canvasHoldElem.append(child);
	}
	cgElem.style.background = "";

	cgElem.appendChild(preload.canvas[curCG]);
	preload.canvas[curCG].style.visibility = "initial";
  */

  /*
	if(cgViewer.rpgx)
	{
		cgElem.appendChild(preload.canvas[curCG]);
		preload.canvas[curCG].style.visibility = "initial";
	}
	else
	{
		if(cgViewer.scene[0] == "c"){
			cgElem.style.background = "black url('" + curCG + "') no-repeat center";
		} else if (cgViewer.scene.includes("HAR")){
			let ext = curCG.substr(curCG.lastIndexOf(".")  + 1);
			if(ext == "webm"){
				let vid = document.createElement("video");
				vid.width = 1280;
				vid.height = 720;
				vid.loop = true;
				vid.src = curCG;
				vid.classList = "viewer-main-class viewer-video";
				cgElem.appendChild(vid);
				vid.load();
				vid.play();
			} else {
				cgElem.style.background = "black url('" + curCG + "') no-repeat center/1280px 720px";
			}
		} else if (cgViewer.scene.includes("OTOGI")){
			let vid = document.createElement("video");
			vid.width = 1402;
			vid.height = 898;
			vid.loop = true;
			vid.src = curCG;
			vid.style.width = "1402px";
			vid.style.height = "898px";
			vid.style.left = "-140px";
			vid.style.top = "-118px";
			vid.classList = "viewer-main-class viewer-video";
			cgElem.appendChild(vid);
			vid.load();
			vid.play();
		}
	}
	*/

	/*
	if(prefs.cg.fadeEffect)
	{
		animateElement(cgElem, 1000, "fade-in", false);

		cgElem.style.zIndex = "2";
		if(cgViewer.alt)
		{
			cgViewer.elements.cg.style.zIndex = "1";
			removeAnimation(cgViewer.elements.cg);
		}
		else
		{
			cgViewer.elements.cgAlt.style.zIndex = "1";
			removeAnimation(cgViewer.elements.cgAlt);
		}
		cgViewer.alt = !cgViewer.alt;
	}
	*/
//}

function slideshowMode()
{
	cgViewer.nextSlide = setTimeout(function(){

		nextCG();
		//If cgViewer.nextSlide is null then the slideshow has been programmatically canceled in nextCG(), so don't schedule it again
		if(cgViewer.nextSlide!==null) {
			slideshowMode();
		}
	}, prefs.cg.slideshowWait);
}

/*
function slideshowMode()
{
	console.log("firing");
	cgViewer.nextSlide = setTimeout(function(){

		nextCG();
		if(cgViewer.slideshow){
			nextCG();
			slideshowMode();
		}
	}, prefs.cg.slideshowWait);
}
*/

function cancelSlideshowTimer()
{
	clearTimeout(cgViewer.nextSlide);
	cgViewer.nextSlide=null;
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function getCGsFromScene(sceneID)
{
	let allItems=[];
	
	let videoItems=new Set();
	let evItems=new Set();

	let spines = new Map();
	let currentSpine=null;

	let script=sceneData[sceneID].SCRIPTS["PART1"].SCRIPT;

	for(let command of script)
	{
		/*
		if(command.startsWith("<SPINE>"))
		{			
			let arguments1=command.substr(command.lastIndexOf(">") + 1).split(",");
			let spineFilename=arguments1[0];

			currentSpine=spineFilename;

			if(!spines.has(spineFilename)) {
				spines.set(spineFilename, new Set());
			}				
		}
		*/
		if(command.startsWith("<SPINE_PLAY>"))
		{
			/*
			if(currentSpine===null) {
				console.error("Error, curentSpine is null, a SPINE command should always precede a SPINE_PLAY command");
			}
			*/
			let arguments1=command.substr(command.lastIndexOf(">") + 1).split(",");

			let spineFilename=arguments1[0];
			let animationName=arguments1[3];

			if(!spines.has(spineFilename)) {
				spines.set(spineFilename, new Set());
			}		

			let spineAnimations=spines.get(spineFilename);

			if(!spineAnimations.has(animationName)) {
				spineAnimations.add(animationName);

				allItems.push({
					event: "SPINE",
					filename: spineFilename,
					animation: animationName
				});
			}
		}
		else if(command.startsWith("<EV>"))
		{
			let arguments1=command.substr(command.lastIndexOf(">") + 1).split(",");
			let evFilename=arguments1[0];
			let evFilename2=arguments1[3];
			let fullFilename="";

			if(evFilename2)
			{
				fullFilename=evFilename+"|"+evFilename2;
			}
			else
			{
				fullFilename=evFilename;
			}

			//Get all unique EV events
			if(!evItems.has(fullFilename)) {
				evItems.add(fullFilename);

				allItems.push({
					event: "EV",
					filename: fullFilename
				});
			}
		}
		else if(command.startsWith("<VIDEO_PLAY>"))
		{
			let arguments1=command.substr(command.lastIndexOf(">") + 1).split(",");
			let videoFilename=arguments1[0];

			//Get all unique VIDEO_PLAY events
			if(!videoItems.has(videoFilename)) {
				videoItems.add(videoFilename);

				allItems.push({
					event: "VIDEO",
					filename: videoFilename
				});
			}
		}
	}

	return allItems;
}