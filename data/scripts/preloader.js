var toPreload = new Set();
var preloadIter;
var preload = {
	paths: new Set(),
	files: new Set(),
	temp:{

	},
	perm:{

	},
	canvas:{

	},
	actorCanvas:{

	},
	//currentSpine: null,
	spines: {},
	failed: false,
	failedPaths: [],
	loaded: 0,
	audio:{
		voice: new Audio(),
		bgvoice: new Audio(),
		bgm: new Audio(),
		bgmintro: new Audio(),
		se: new Audio(),
		bgse: new Audio()
	},
  preloading: false
}

//make scene uninteractable until load

function initPreload(){
	preload.permElem = document.getElementById("preload-perm-elem");
	preload.tempElem = document.getElementById("preload-temp-elem");
}

function preloadSceneResources(script){

	for(let command of script)
	{
		let fn;
		let src;
		switch(command.substr(1, command.lastIndexOf(">") -1))
		{
			case "BG":
				//let arguments1 = command.substr(command.lastIndexOf(">") +1).split(",");
				//console.log(command);
				//console.log(arguments1);
				fn = command.substr(command.lastIndexOf(">") +1, command.indexOf(",") - (command.lastIndexOf(">") +1)).trim();
				if(fn == "black" || fn == "white"){
					continue;
				}
				src = createBgImagePath(fn);
				preload.paths.add(src);
			break;
			case "EV":
				let arguments11 = command.substr(command.lastIndexOf(">") +1).split(",");
				//console.log(command);
				//console.log(arguments1);
				fn = command.substr(command.lastIndexOf(">") +1, command.indexOf(",") - (command.lastIndexOf(">") +1)).trim();
				if(fn == "black" || fn == "white"){
					continue;
				}
				src = createImagePath(fn);
				preload.paths.add(src);
				//If a second image filename exist, that should later be merged together with the first filename, then preload that image file too
				if(arguments11[3]!=="")
				{
					src = createImagePath(arguments11[3]);
					preload.paths.add(src);
				}
			break;
			/*
			case "ACTOR":
				fn = command.substr(command.indexOf(",") + 1, command.substr(command.indexOf(",") + 1).indexOf(",")).trim();
				src = createImagePath(fn);
				preload.paths.add(src);
			break;
			*/
			case "ACTOR":
				//Preload base actor image
				let commandParts=command.split(",");

				let filename = commandParts[1].trim();
				src = createActorImagePath(filename);
				preload.paths.add(src);

				//Preload actor sprite image to merge, if any exist in the command
				if(commandParts[9]!==undefined)
				{
					let spriteFilename = commandParts[9].trim();
					src = createActorImagePath(spriteFilename);
					preload.paths.add(src);
				}

			break;
			case "ANIM":
				let arguments111 = command.substr(command.lastIndexOf(">") +1).split(",");

				let baseFilename = arguments111[0].trim(); 
				let fileStartIndex = Number(arguments111[1]);
				let numberOfParts = Number(arguments111[2]);
				let rows = Number(arguments111[3]);
				let columns = Number(arguments111[4]);

				let partsPerFile=rows*columns;

				let currentFileIndex=fileStartIndex;
			
				//Preload all the images used in the animation, and every image may contain several frames
				for(let k=0; k < numberOfParts; k++)
				{
					if(k % partsPerFile === 0)
					{
						let src1 = createAnimationImagePath(baseFilename+currentFileIndex);
						preload.paths.add(src1);
	
						currentFileIndex++;
					}	
				}
			break;
			case "VOICE_PLAY":
				// src = constructVoiceAudioPath(command.substr(command.lastIndexOf(">") +1).trim(), scene.id);
			break;
			case "BGM_PLAY":
				// src = constructBGMAudioPath(command.substr(command.lastIndexOf(">") +1, command.indexOf(",") - (command.lastIndexOf(">") +1)).trim());
			break;
			case "SE_PLAY":
				// src = constructSEAudioPath(command.substr(command.lastIndexOf(">") +1).trim());
			break;
			case "VIDEO_PLAY":
				//fn = command.substr(command.lastIndexOf(">") +1, command.indexOf(",") - (command.lastIndexOf(">") +1)).trim();
				//src = createVideoPath(fn);
				//preload.paths.add(src);
			break;
			//Create spine player container element
			case "SPINE":
				//imagefile1 = command.substr(command.lastIndexOf(">") +1, command.indexOf(",") - (command.lastIndexOf(">") +1)).trim();
			break;
			case "CHAR_ICON":
				fn = command.substr(command.lastIndexOf(">") +1, command.indexOf(",") - (command.lastIndexOf(">") +1)).trim();
				//The filename in the event CHAR_ICON may be the empty string (meaning to remove the current character icon, if any) so check for that here and ignore it
				if(fn!=="")
				{
					src = createImagePath(fn);
					preload.paths.add(src);
				}
			break;

			default:

			break;
		}
	}

	//Currently only preloads voices
	//voices being preloaded is also a prerequisite for auto mode to work on voice lines, since auto mode needs to know the voice files duration
	//Perhaps a more sophisticated preloading of voices like only preloading the next voice files in line is more memory efficient, but this works for now
	preloadAudio(script, function callback(){

		//Preloads canvases, that are used by ex: "EV" and "SPINE_IMAGE" events
		createCanvases(script, function callback(){

			//When done preloading spine players
			preloadSpinePlayers(script, function callback(){

				//Preload spine overlays
				preloadSpineOverlays(script, function callback(){

					//Preload videos
					preloadVideos(script, function callback(){

						//When done preloading character spine players, continue preloading of other resources
						preloadCharacterSpinePlayers(script, function callback(){

							preload.paths.delete(undefined);
							preload.iter = preload.paths.values();
							//Preloads 'ACTOR', 'EV', 'BG', 'VIDEO_PLAY (<img>) (the stuff that's defined above)
							fileLoader(loadSceneResources);
						});
					});
			  });
		  });
		});
	});
}

function preloadVideos(script, callback)
{
	let videoData = getCommandData(script, "<VIDEO_PLAY>", 0);
	//Get unique videos
	eventVideoData = new Set(videoData);

	let totalItems=eventVideoData.size;
	let totalDone=0;

	if(totalItems===0) {
		callback();
		return;
	}

	for(let videoFilename of eventVideoData)
	{
		let path = createVideoPath(videoFilename);
		loadVideo(path, "tempPreloadVideo", false, function callback2(){

			totalDone++;
	
			//Preloading finished
			if(totalItems===totalDone)
			{
				callback();
			}
		});
	}
}

//Preload audio files used in the current scene
//Currently only preloads voice audio files
function preloadAudio(script, callback)
{
	//let voiceData = getCommandData(script, "<VOICE_PLAY>");
	let voiceData = getCommandData(script, "<VOICE_PLAY>", 1);
	let voiceSingleData = getCommandData(script, "<VOICE_SINGLE_PLAY>");
	let allVoiceData=voiceData.concat(voiceSingleData);

	let promises=[];
	
	for(let i=0; i<allVoiceData.length; i++)
	{
		let filename=allVoiceData[i].trim();
		let promise=loadAudioPromise(filename);

		promises.push(promise);
	}

	//If all audio files succeded in loading, continue
	Promise.all(promises).then(function(valuesArray) {

		//console.log("All audio loaded successfully!");
		callback();
	//If any of the audio files failed to load, log error and stop
	}).catch((error) => {

		console.error(error);
	});		
}

function loadAudioPromise(filename)
{
	return new Promise(function(resolve, reject) {

		let audio=new Audio();
		let fullFilename=constructVoiceAudioPath(filename, scene.id);
			
		audio.addEventListener("canplaythrough", function(){
	
			preload.temp[filename]=audio;
			resolve();
			//preload.loaded++;
			//updateProgress();
			//callback();
		}, {once:true});
	
		audio.addEventListener("error", function(){
	
			errorLoading(fullFilename);
			reject("error loading audio: "+fullFilename);
			//callback();
		}, {once:true});
	
		audio.src=fullFilename;
	});
}

//Preload character spine players used in the current scene
//Calls: callback() when done preloading
function preloadCharacterSpinePlayers(script, callback)
{
	/*
	//If the scene is not animated or the user has animations turned off, don't preload any spine players and just move on
	if(scene.animated==="0")
	{
		callback();
		return;
	}
	*/

	//Get all spine commands in the scene
	var spineData = getCommandData(script, "<SPINE_ACTOR>", null);

	//If there are no spine players, call the callback immediately
	if(spineData.length===0) {
		callback();
		return;
	}
	
	//Set preloading to true to catch race conditions
	preload.preloading=true;

	var preloadedSpineViewers=0;
	//var spineDataSet = new Set();
	//var spineDataInfo={};
	var spineDataMap=new Map();

	//Get unique actor spines, where unique is a filename + index combo
	for(let i=0; i<spineData.length; i++)
	{
		let index=Number(spineData[i].split(",")[0]);
		let filename=spineData[i].split(",")[1];

		let ID=filename+"__"+index;
		spineDataMap.set(ID, spineData[i]);
	}
	
	/*
  var viewports={
		"0":{
			transitionTime: 0,
			x: 0,
			//y: -120
			y: -120,
			width: 640,
			height: 360,
			padLeft: "100%",
			padRight: "0%",
			padTop: "-100%",
			padBottom: "0%"
		}
	};
	*/
	
	//We double the viewport here from 1280x720 to: 2560x1440 so that the character doesn't get clipped when it needs to be moved in the X or Y direction
  var viewports={
		"0":{
			transitionTime: 0,
			x: 0, 
			//y: 540,
			y: 900,
			width: 1920,
			height: 1080,
			padLeft: "100%",
			padRight: "0%",
			padTop: "-100%",
			padBottom: "0%"
		}
	};

	//for(let i=0; i<spineData.length; i++)
	//{
	for(let [key, value] of spineDataMap)
	{
		var arguments1=value.split(",");
		//var arguments1=spineData[i].split(",");

	  //Loop through all unique spine commands and create a spine player for each
		//for(let imagefile of spineDataSet)

		//Actor index
		let spineActorIndex=arguments1[0];
		//Spine filename
		let spineActorFilename=arguments1[1]; //imagefile1
		//let spineActorSkin=arguments1[2];
		//let spineActorAnimation=arguments1[3];
		//Not currently used
		//let spineActorSubAnim=arguments1[4];
		//let spineActorFadeDuration=arguments1[5];
		//let spineActorPos=arguments1[6];
		//How much to scale the actor, 1 being normal size, 1.8 being larger
		let spineActorScale = Number(arguments1[8]);
		//The skeleton's filetype (*.skel or *.json)
		let skelType = arguments1[9];

		//The viewport to use, default is "0"
		//let spineAnimType1=arguments1[3]; //"0", "5" or "-4"
		//let spineAnimType1="0";

		//spineDataInfo[spineActorFilename]={
		//	"spineAnimType":spineAnimType1
		//};

		//spineDataSet.add(spineActorFilename);

		//let spineAnimType=spineDataInfo[spineActorFilename]['spineAnimType'];
		let spineAnimType="0";
		//Create a unique ID, so that you can have multiple actors on at the same time that uses the same base spine files, but different indexes
		let spineActorID=spineActorFilename+"__"+spineActorIndex;

		//console.log("Animation type: "+spineAnimType);

		preload.spines[spineActorID] = document.createElement("div");
		preload.spines[spineActorID].classList="spine-player-item spine-actor";
		preload.spines[spineActorID].id="spine-player_"+spineActorID;
		//Save the base filename used in the spine player
		preload.spines[spineActorID].baseFilename=spineActorFilename;
		//Save the viewport used
		preload.spines[spineActorID].viewport=viewports[spineAnimType];

		//let currentViewport=Object.assign({}, viewports[spineAnimType]);
		let currentViewport=structuredClone(viewports[spineAnimType]);

		//Add the spine viewer element the preload wrapper element
		main.elements.spineViewersHoldElem.appendChild(preload.spines[spineActorID]);

		let spinesPath="scenes/"+scene.id+"/spines/";
		//let skeletonJsonPath=spinesPath+"spine"+spineActorID+".json";
		//let skeletonPath=spinesPath+spineActorID+".skel";

		//Spine's skel filetype, skel (binary) or json
		let skeletonPath="";
		let skeletonJsonPath="";
		if(skelType==="skel") {
			skeletonPath=spinesPath+spineActorFilename+"."+config.format.spine.skeleton;
		}
		else{
			skeletonJsonPath=spinesPath+spineActorFilename+"."+config.format.spine.skeletonJson;
		}
		let atlasPath=spinesPath+spineActorFilename+".atlas";

		//Documentation
		//https://github.com/EsotericSoftware/spine-runtimes/tree/3.8/spine-ts/spine-player
		//https://esotericsoftware.com/spine-player
		//https://esotericsoftware.com/spine-api-reference

		//Creates a new spine player. The debugRender option enables rendering of viewports and padding for debugging purposes.
		preload.spines[spineActorID].spinePlayer = new spine.SpinePlayer("spine-player_"+spineActorID, {
			jsonUrl: skeletonJsonPath, //skelUrl or jsonUrl should be set, but not both. A falsy value can be set to specify that it is empty
			skelUrl: skeletonPath,     //skelUrl or jsonUrl should be set, but not both. A falsy value can be set to specify that it is empty
			atlasUrl: atlasPath,
			//animation: "Wait",
			premultipliedAlpha: true,
			backgroundColor: "#00000000",
			//backgroundColor: "#000000",
			alpha: true,
			//alpha: false,
			//defaultMix: when switching between two animations, the player will mix the animations for X seconds, displaying a smooth transition
			//instantaniously swith is: 0
			//defaultMix: 1,
			defaultMix: 0.3,
			showLoading: false,
			viewport: currentViewport,
			/*
			debug: {
				bones: true, 
				regions: true,
				meshes: true,
				bounds: true,
				paths: true,
				clipping: true,
				points: true,
				hulls: true
			},
			*/
			showControls: false,
			//We must wait until the skeleton and atlas files have been loaded successfully before doing any setAnimation() calls
			//So we wait until loaded before we continue
			success: (player) => {

				//Put any modifications you need to do to the spine in this function
				//Defined in: "data/spine.js"
				//modifySpine(player);

				//Set blendmode for all slots to 0, which is normal blending
				//Some scenes' slots have blendmode set to 2, which is 'Multiply', which causes incorrect rendering, so set it to 0 to fix it.
				//Maybe the rendering still isn't perfect in some cases, but it will have to do.
				//Blending controls how the slot attachment's pixels are combined with the pixels below
				//Probably only needed for scenes of type 1, but oh well
				//for(var i in player.skeleton.slots)
				//{
					/*
					if((player.skeleton.slots[i].data.blendMode===2) || (player.skeleton.slots[i].data.blendMode===3))
					{
						player.skeleton.slots[i].data.blendMode=0;
					}
					*/
					//player.skeleton.slots[i].data.blendMode=0;
				//}

				/*
				//On scenes of type 0, hide the mosaic since it looks bad
				if((spineAnimType==="0") || (spineAnimType==="-4"))
				{
					for(var j in player.skeleton.slots)
					{
						if(player.skeleton.slots[j].data.name==="MaskMosaic1")
						{
							player.skeleton.slots[j].color.a=0;
							player.skeleton.slots[j].data.color.a=0;

							break;
						}
					}
				}
				*/

				//Pause the animation initially
				//Must be unpaused before when calling setAnimation() later
				player.paused=true;

				//scene.spinePlayer.setAnimation("Wait", true);
				preloadedSpineViewers++;
				if(preloadedSpineViewers >= spineDataMap.size)
				{
					preload.preloading=false;
					callback();
				}
			}
			/*, 
			error: function (player, reason) {
				console.error("spinePlayer: "+spineActorID+" failed to load, reason: ");
				console.error(reason);
			}
			*/
		});
	}
}

//Preload spine overlays used in the current scene
//Calls: callback() when done preloading
function preloadSpineOverlays(script, callback)
{
	//Get all spine overlay commands in the scene
	//'<SPINE_OVERLAY_PLAY>'.$spineOverlayFilename.','.$animationName.','.$playState;
	var spineData = getCommandData(script, "<SPINE_OVERLAY_PLAY>", null);

	//console.log(spineData);
  //debugger;

	//If there are no spine overlays used, call the callback immediately
	if(spineData.length===0) {
		callback();
		return;
	}

	//Set preloading to true to catch race conditions
	preload.preloading=true;

	var preloadedSpineViewers=0;
	var spineDataMap=new Map();

	//Get unique spines
	for(let i=0; i<spineData.length; i++)
	{
		let filename=spineData[i].split(",")[0];
		spineDataMap.set(filename, spineData[i]);
	}

  var viewports={
		"0":{
			transitionTime: 0,
			x: 0,
			y: 0,
			width: 640,
			height: 360,
			padLeft: "100%",
			padRight: "0%",
			padTop: "-100%",
			padBottom: "0%"
		}
	};

	//Loop through all spine overlay commands and create a spine player for each unique one
	for(let [key, value] of spineDataMap)
	{
		let arguments1=value.split(",");
		let filename=arguments1[0];

		//Spine overlay unique filename
		//let filename=name;
		//the *.json/*.skel skeleton filename
		var skelFilename1 = filename;
		//the *.atlas filename
		var atlasFilename1 = filename;
		//animation name
		//let animationName1 = "blink_once";
		//images used in the *.atlas file, seperated by pipe "|"
		//Ex: "character1.png|character2.png|character3.png"
		//let atlasImages1 = "blink.png";
		var spineAnimType = "0";
		//The skeleton's filetype (*.skel or *.json)
		var skelType = "json";

		preload.spines[filename] = document.createElement("div");
		preload.spines[filename].classList="spine-player-item spine-overlay";
		preload.spines[filename].id="spine-player_"+filename;
		//Save the base filename used in the spine player
		preload.spines[filename].baseFilename=filename;
		//Save the viewport used
		preload.spines[filename].viewport=viewports[spineAnimType];

		let currentViewport=Object.assign({}, viewports[spineAnimType]);

		//Add the spine viewer element the preload wrapper element
		main.elements.spineViewersHoldElem.appendChild(preload.spines[filename]);

		//The specific spine overlay must exist in this folder
		let spinesPath="data/spines/";

		//Spine's skel filetype, skel (binary) or json
		let skeletonPath="";
		let skeletonJsonPath="";
		if(skelType==="skel") {
			skeletonPath=spinesPath+skelFilename1+"."+config.format.spine.skeleton;
		}
		else{
			skeletonJsonPath=spinesPath+skelFilename1+"."+config.format.spine.skeletonJson;
		}
		let atlasPath=spinesPath+atlasFilename1+"."+config.format.spine.atlas;

		//Creates a new spine player. The debugRender option enables rendering of viewports and padding for debugging purposes.
		preload.spines[filename].spinePlayer = new spine.SpinePlayer("spine-player_"+filename, {
			jsonUrl: skeletonJsonPath, //skelUrl or jsonUrl should be set, but not both. A falsy value can be set to specify that it is empty
			skelUrl: skeletonPath,     //skelUrl or jsonUrl should be set, but not both. A falsy value can be set to specify that it is empty
			atlasUrl: atlasPath,
			//animation: "Wait",
			premultipliedAlpha: true,
			backgroundColor: "#00000000",
			//backgroundColor: "#000000",
			//alpha: false,
			alpha: true,
			//defaultMix: when switching between two animations, the player will mix the animations for X seconds, displaying a smooth transition
			//defaultMix: 1,
			defaultMix: 0,
			showLoading: false,
			viewport: currentViewport,
			//preserveDrawingBuffer: true,
			/*
			debug: {
				bones: true, 
				regions: true,
				meshes: true,
				bounds: true,
				paths: true,
				clipping: true,
				points: true,
				hulls: true
			},
			*/
			showControls: false,
			//We must wait until the skeleton and atlas files have been loaded successfully before doing any setAnimation() calls
			//So we wait until loaded before we continue
			success: (player) => {

				//Put any modifications you need to do to the spine in this function
				//Defined in: "data/spine.js"
				//modifySpine(player);
				/*
				player.setSpeed(0);
				//grab the first animation's name in the spine, then play it
				player.play();
				player.setAnimation(player.skeleton.data.animations[0].name, true);
				player.stopRendering();
				*/

				//Pause the animation initially
				//Must be unpaused before when calling setAnimation() later
				player.paused=true;

				//scene.spinePlayer.setAnimation("Wait", true);
				preloadedSpineViewers++;
				if(preloadedSpineViewers >= spineDataMap.size)
				{
					preload.preloading=false;
					callback();
				}
			}
			/*, 
			error: function (player, reason) {
				console.error("spinePlayer: "+filename+" failed to load, reason: ");
				console.error(reason);
			}
			*/
		});
	}
}

//Preload spine players used in the current scene
//Calls: callback() when done preloading
function preloadSpinePlayers(script, callback)
{
	/*
	//If the scene is not animated or the user has animations turned off, don't preload any spine players and just move on
	if(scene.animated==="0")
	{
		callback();
		return;
	}
	*/

	//Get all spine commands in the scene
	var spineData = getCommandData(script, "<SPINE>", null);

	//If there are no spine players, call the callback immediately
	if(spineData.length===0) {
		callback();
		return;
	}

	//Set preloading to true to catch race conditions
	preload.preloading=true;

	var preloadedSpineViewers=0;
	//var spineDataSet=new Set();
	var spineDataMap=new Map();

	//Get unique spines
	for(let i=0; i<spineData.length; i++)
	{
		let filename=spineData[i].split(",")[0];
		spineDataMap.set(filename, spineData[i]);
	}

  var viewports={
		"0":{
			transitionTime: 0,
			x: 0,
			y: 0,
			width: 1280,
			height: 720,
			padLeft: "100%",
			padRight: "0%",
			padTop: "-100%",
			padBottom: "0%"
		}
	};

	/*
	for(let i=0; i<spineData.length; i++)
	{
		var arguments1=spineData[i].split(",");

		//Spine filename
		let imagefile1=arguments1[0];
		//Not used
		let nrOfSpriteFiles1=arguments1[1];
		//Not used
		let arg2=arguments1[2];
		//The viewport to use, default is "0"
		let spineAnimType1=arguments1[3]; //"0", "5" or "-4"

		spineDataInfo[imagefile1]={
			"spineAnimType":spineAnimType1
		};

		spineDataSet.add(imagefile1);
	}
	*/

	//Loop through all unique spine commands and create a spine player for each
	//for(let imagefile of spineDataSet)
	//{
	
	//Loop through all spine commands and create a spine player for each unique one
	//for(let i=0; i<spineData.length; i++)
	for(let [key, value] of spineDataMap)
	{
		var arguments1=value.split(",");

		//Spine unique filename
		let filename=arguments1[0];
		//the *.json/*.skel skeleton filename
		let skelFilename1 = arguments1[1];
		//the *.atlas filename
		let atlasFilename1 = arguments1[2];
		//animation name
		let animationName1 = arguments1[3];
		//images used in the *.atlas file, seperated by pipe "|"
		//Ex: "character1.png|character2.png|character3.png"
		let atlasImages1 = arguments1[4];
		let viewportType = arguments1[5];
		//The skeleton's filetype (*.skel or *.json)
		let skelType = arguments1[6];

		//Split the image filenames into an array and add the file extension
		let atlasImages=atlasImages1.split("|");
		atlasImages=atlasImages.map(function(item) {
			return item+="."+config.format.spine.image;
		});
		
		let spineAnimType=viewportType;
		//let spineAnimType="0";
		//let spineAnimType=spineDataInfo[imagefile]['spineAnimType'];

		//console.log("Animation type: "+spineAnimType);

		preload.spines[filename] = document.createElement("div");
		preload.spines[filename].classList="spine-player-item spine-scene";
		preload.spines[filename].id="spine-player_"+filename;
		//Save the base filename used in the spine player
		preload.spines[filename].baseFilename=filename;
		//Save the viewport used
		preload.spines[filename].viewport=viewports[spineAnimType];

		let currentViewport=Object.assign({}, viewports[spineAnimType]);

		//Add the spine viewer element the preload wrapper element
		main.elements.spineViewersHoldElem.appendChild(preload.spines[filename]);

		let spinesPath="scenes/"+scene.id+"/spines/";

		//Spine's skel filetype, skel (binary) or json
		let skeletonPath="";
		let skeletonJsonPath="";
		if(skelType==="skel") {
			skeletonPath=spinesPath+skelFilename1+"."+config.format.spine.skeleton;
		}
		else{
			skeletonJsonPath=spinesPath+skelFilename1+"."+config.format.spine.skeletonJson;
		}
		let atlasPath=spinesPath+atlasFilename1+"."+config.format.spine.atlas;

		/*
		//let skeletonJsonPath=spinesPath+"spine"+imagefile+".json";
		let skeletonPath=spinesPath+filename+".skel";
		let atlasPath=spinesPath+filename+".atlas";
		*/

		//Documentation
		//https://github.com/EsotericSoftware/spine-runtimes/tree/3.8/spine-ts/spine-player
		//https://esotericsoftware.com/spine-player
		//https://esotericsoftware.com/spine-api-reference

		//Creates a new spine player. The debugRender option enables rendering of viewports and padding for debugging purposes.
		preload.spines[filename].spinePlayer = new spine.SpinePlayer("spine-player_"+filename, {
			jsonUrl: skeletonJsonPath, //skelUrl or jsonUrl should be set, but not both. A falsy value can be set to specify that it is empty
			skelUrl: skeletonPath,     //skelUrl or jsonUrl should be set, but not both. A falsy value can be set to specify that it is empty
			atlasUrl: atlasPath,
			//animation: "Wait",
			premultipliedAlpha: true,
			//backgroundColor: "#00000000",
			backgroundColor: "#000000",
			alpha: false,
			//defaultMix: when switching between two animations, the player will mix the animations for X seconds, displaying a smooth transition
			//switches are done instantaniously in FKG
			//defaultMix: 1,
			defaultMix: 0,
			showLoading: false,
			viewport: currentViewport,
			//preserveDrawingBuffer: true,
			/*
			debug: {
				bones: true, 
				regions: true,
				meshes: true,
				bounds: true,
				paths: true,
				clipping: true,
				points: true,
				hulls: true
			},
			*/
			showControls: false,
			//We must wait until the skeleton and atlas files have been loaded successfully before doing any setAnimation() calls
			//So we wait until loaded before we continue
			success: (player) => {

				//Put any modifications you need to do to the spine in this function
				//Defined in: "data/spine.js"
				modifySpine(player);
				/*
				player.setSpeed(0);
				//grab the first animation's name in the spine, then play it
				player.play();
				player.setAnimation(player.skeleton.data.animations[0].name, true);
				player.stopRendering();
				*/

				//Pause the animation initially
				//Must be unpaused before when calling setAnimation() later
				player.paused=true;

				//scene.spinePlayer.setAnimation("Wait", true);
				preloadedSpineViewers++;
				if(preloadedSpineViewers >= spineDataMap.size)
				{
					preload.preloading=false;
					callback();
				}
			}
			/*, 
			error: function (player, reason) {
				console.error("spinePlayer: "+filename+" failed to load, reason: ");
				console.error(reason);
			}
			*/
		});
	}
}

function loadSceneResources()
{
	let path = preload.iter.next().value;
	if(path == null || path == undefined)
	{
		if(preload.failed)
		{
			mainInteractionEnabled(true);
			fileErrorPopup();
			return;
		}

		// I don't know why filenames doesn't work and paths does
		// for RPGX but I also don't care enough to find out.
		//if(preload.paths.size == Object.keys(preload.temp).length ){
		cleanupPreload();
		//Preload actor canvases, this is done synchronously
		createActorCanvases(scene.script);
		mainInteractionEnabled(true);

		startScene();

		return;
		//}
		//return;
	}

	main.elements.loadingFile.innerText = path;
	let fn = path.substr(path.lastIndexOf("/") + 1, path.lastIndexOf(".") - path.lastIndexOf("/") - 1);
	if(preload.temp[fn]){
		loadSceneResources();
		return;
	}
	let ext = path.substr(path.lastIndexOf(".")  + 1);

	if(ext == "png" || ext == "jpg" || ext == "webp")
	{
		loadImage(path, "tempPreloadImage", false, loadSceneResources);
	}
	else if(ext == "ogg" || ext == "mp3" || ext == "m4a")
	{
		//loadAudio(path, false, loadSceneResources);
	}
	else if(ext == "webm" || ext == "mp4")
	{
		loadVideo(path, "tempPreloadVideo", false, loadSceneResources);
	}
	else
	{
		console.error("Error, unsupported filextension: "+ext);
	}
}

function cleanupPreload()
{
	preload.paths = new Set();
	preload.files = new Set();
	preload.failed = false;
	preload.failedPaths = [];
	preload.loaded = 0;

	//After the preloading is done at the start of the viewer
	//hide the 2 loading progress bars, since they only work at the start of the viewer,
	//but not when using the setting "Loading screen" "on" when loading scenes
	main.elements.loadingFile.style.visibility = "hidden";
	main.elements.loadingBar.style.visibility = "hidden";

	main.elements.loadingWrap.style.visibility = "hidden";
}

function createActorCanvases(script)
{
	let evData = getCommandData(script, "<ACTOR>", null);
	let actorSet=new Set();

	for(let ev of evData)
	{
		let actorParts=ev.split(",");
		let filename=actorParts[1].trim();
		let actorImageId=actorParts[8].trim();

		//If the actor image, potentially merged, has already been added, do nothing
		if(actorSet.has(actorImageId)) {
			continue;
		}
		actorSet.add(actorImageId);

		let actorImage=preload.temp[filename];
		let actorCanvas=document.createElement("canvas");
		//actorCanvas.classList.add("actor");
		actorCanvas.classList.add("tempPreloadImage");
		actorCanvas.width=actorImage.naturalWidth;
		actorCanvas.height=actorImage.naturalHeight;

		//canvas.id = actorImageId;
		let actorCtx = actorCanvas.getContext("2d");

		//Draw base actor image
		actorCtx.drawImage(actorImage, 0, 0);

		//If a sprite image exist in the event, then merge that with the base image too
		if(actorParts[9]!==undefined)
		{
			let spriteFilename=actorParts[9].trim();
			let spriteX=Number(actorParts[10].trim());
			let spriteY=Number(actorParts[11].trim());
			let spriteWidth=Number(actorParts[12].trim());
			let spriteHeight=Number(actorParts[13].trim());
			let dstX=Number(actorParts[14].trim());
			let dstY=Number(actorParts[15].trim());
			let dstWidth=Number(actorParts[16].trim());  //If you want to scale the sprite image, otherwise specify the same width as spriteWidth
			let dstHeight=Number(actorParts[17].trim()); //If you want to scale the sprite image, otherwise specify the same height as spriteHeight

			//Draw actor sprite image ontop of the base actor image ,at the coordinates specified
			let actorSpriteImage=preload.temp[spriteFilename];
			actorCtx.drawImage(actorSpriteImage, spriteX, spriteY, spriteWidth, spriteHeight, dstX, dstY, dstWidth, dstHeight);
		}

		preload.actorCanvas[actorImageId]=actorCanvas;
		main.elements.actorCanvasHoldElem.append(actorCanvas);
  } 
}

//Preloads canvases, that are used by: "EV" "SPINE_IMAGE" and "CHAR_ICON" events
//Preloads images from the place in createImagePath(), which currently is the "images" folder 
function createCanvases(script, callback)
{
	let evData = getCommandData(script, "<EV>", 0, 3);
	let spineImageData = getCommandData(script, "<SPINE_IMAGE>", 0);
	//Character icon images to display in the textbox when the character talks
	//let charIconData = getCommandData(script, "<CHAR_ICON>", 0);

	//Merge the arrays
	//let eventImgData=evData.concat(spineImageData, charIconData);
	let eventImgData=evData.concat(spineImageData);
	eventImgData = new Set(eventImgData);

	//Since CHAR_ICON's filename may be the empty string (meaning to remove the current icon, if any)
	//we need to remove the empty string value here from the set
	//eventImgData.delete("");

	let totalItems=eventImgData.size;
	let totalDone=0;

	if(totalItems===0) {
		callback();
		return;
	}

	for(let ev of eventImgData)
	{
		//If the command had 2 arguments with valid names, then they are merged together with a pipe "|" so split them up again into 2 names
		//If it only hade 1 argument, we can still use this since it will just return the same string in the first index of the array
		//This is assuming no names ever include pipes "|", which they shouldn't since this is checked in the backend
		let nameParts=ev.split("|");
		//console.log(nameParts);
		createCanvas(nameParts, function callback2(){

			totalDone++;

			//Preloading finished
			if(totalItems===totalDone)
			{
				callback();
			}
		});
	}
}

//Create a single canvas if passed 1 image, or if passed 2 images merge them together
function createCanvas(files, callback)
{
	//let name = files[files.length - 1];
	let canvas = document.createElement("canvas");
	//canvas.id = name;

	//The height and width of the scene image
	//canvas.height = 720;
	//canvas.width = 1280;
	canvas.height = config.scene.height; 
	canvas.width = config.scene.width;

	main.elements.canvasHoldElem.append(canvas);

	if(files.length == 2)
	{
		canvas.id = files[0]+"|"+files[1];

		drawImage(canvas, files[0], function(){
			drawImage(canvas, files[1], callback);
		});
	}
	else
	{
		canvas.id = files[0];

		drawImage(canvas, files[0], callback);
	}
	canvas.classList.add("tempPreloadImage");
	preload.canvas[canvas.id] = canvas;
}

function drawImage(canvas, file, callback=null)
{
	let ctx = canvas.getContext("2d");

	if(file==="black")
	{
		ctx.fillStyle = "black";
	  //The height and width of the scene image
		ctx.fillRect(0, 0, config.scene.width, config.scene.height);

		if(callback != null){
			callback();
		}
	}
	else if(file==="white")
	{
		ctx.fillStyle = "white";
	  //The height and width of the scene image
		ctx.fillRect(0, 0, config.scene.width, config.scene.height);

		if(callback != null){
			callback();
		}
	}
	else
	{
		let path=createImagePath(file);

		let imgPath=path;
		let imgBasePath=sceneImageData[imgPath];

		//If the EV image has a path defined in the global variable "sceneImageData" (defined in the file: data/scripts/data/sceneImageData.js) 
		//where it's value is a path to the image's base image then first render the base image and then render the original image on top of it
		//Currently used as an optimization technique for EV images
		if(imgBasePath!==undefined && imgBasePath!==null)
		{
			imgPath=imgBasePath;
		}

		let image = new Image();
		image.onload = function(){

			//All background images are scaled by config.scene.imageScale (which currently is 1.33), then they should be centered on the screen
			//<EV> images
			//let sourceWidth = Math.ceil(config.scene.width / config.scene.imageScale);
			//let sourceHeight = Math.ceil(config.scene.height / config.scene.imageScale);

			//All the images (BGs and EVs) should be scaled down proportionally until they become: 1280x720
			let sourceWidth=image.width;
			let sourceHeight=image.height;

			//let xPos=parseInt((image.width-sourceWidth)/2);
			//let yPos=parseInt((image.height-sourceHeight)/2);
			let xPos=0;
			let yPos=0;

		  //The height and width of the scene image
			//963 x 1.33 = 1,280.79
			//542 x 1.33 = 720.86
			ctx.drawImage(image, xPos, yPos, sourceWidth, sourceHeight, 0, 0, config.scene.width, config.scene.height);

			//If a base image exist, then after drawing that draw the original image on top of it
			if(imgBasePath!==undefined && imgBasePath!==null)
			{
				let image2 = new Image();
				image2.onload = function(){
					//All the images (BGs and EVs) should be scaled down proportionally until they become: 1280x720
					let sourceWidth=image2.width;
					let sourceHeight=image2.height;
		
					//let xPos=parseInt((image.width-sourceWidth)/2);
					//let yPos=parseInt((image.height-sourceHeight)/2);
					let xPos=0;
					let yPos=0;
		
					//The height and width of the scene image
					ctx.drawImage(image2, xPos, yPos, sourceWidth, sourceHeight, 0, 0, config.scene.width, config.scene.height);

					//When done call callback, if any
					if(callback != null){
						callback();
					}
				}
				image2.src = path;
			}
			else
			{
				//When done call callback, if any
				if(callback != null){
					callback();
				}
			}
		}
		image.src = imgPath;
	}
}

function createImagePath(file)
{
	if(scene.type == H_RPGX || scene.type == CG_RPGX)
	{
		let id = scene.type == H_RPGX ? scene.id : cgViewer.scene;
		return "./scenes/" + id + "/images/" + file + "." + config.format.image.ev;
	}
	/*
	else if(scene.type == STORY_RPGX)
	{
		if(/[a-z]+_[a-z][0-9][0-9][0-9][a-z]/.test(file) || file.startsWith("chr_") || file.startsWith("ex_")){
			return "./Story/char/" + file + ".png";
		} else if(file.startsWith("ef") || file.startsWith("nc") || file.startsWith("chrnc")){
			return "./Story/bg/" + file + ".png";
		} else if(file.startsWith("stv")){
			return "./Story/ev/" + file + ".png";
		}
	}
	*/
}

function createAnimationImagePath(file)
{
	let id = scene.type == H_RPGX ? scene.id : cgViewer.scene;
	return "./scenes/" + id + "/animations/" + file + "." + config.format.image.animation;
}

function createActorImagePath(file)
{
	let id = scene.type == H_RPGX ? scene.id : cgViewer.scene;
  return "./scenes/" + id + "/images/" + file + "." + config.format.image.character;
}

function createBgImagePath(file)
{
	let id = scene.type == H_RPGX ? scene.id : cgViewer.scene;
	return "./scenes/" + id + "/images/" + file + "." + config.format.image.bg;
}

function createVideoPath(file)
{
	if(scene.type == H_RPGX || scene.type == CG_RPGX)
	{
		let id = scene.type == H_RPGX ? scene.id : cgViewer.scene;
		return "./scenes/" + id + "/videos/" + file + "." + config.format.video;
	}
}

//Gets all SPINE_PLAY animations in the scene script, grouped by their SPINE base file
function getSpineAnimations(script)
{
	let spines = new Map();
	let currentAnimations = null;
	let currentSpine=null;
	for(let cmd of script)
	{
		if(cmd.startsWith("<SPINE>"))
		{
			let spineFilename=cmd.substr(cmd.lastIndexOf(">") + 1).split(",")[0];
			if(currentSpine!==spineFilename)
			{
				currentSpine=spineFilename;
				if(!spines.has(currentSpine))
				{
					currentAnimations=new Set();
					spines.set(currentSpine, currentAnimations);
				}
			}
		}
		else if(cmd.startsWith("<SPINE_PLAY>"))
		{
			let spineAnimation=cmd.substr(cmd.lastIndexOf(">") + 1).split(",")[0];
			currentAnimations.add(spineAnimation);
		}
	}
	
	let data=[];
	spines.forEach(function(value, key) {
		data.push({
			"spine":key,
			"animations":[...value]
		});
	});

	return data;
}

function getCommandData(script, tag, idx=null, idx2=null)
{
	let data = [];
	for(let cmd of script)
	{
		if(cmd.startsWith(tag))
		{
			//If passed 2 arguments to get, then merge those names together with a pipe "|"" between
			if((idx != null) && (idx2 != null))
			{
				let arguments1=cmd.substr(cmd.lastIndexOf(">") + 1).split(",");
				if(arguments1[idx2]!=="")
				{
					data.push(arguments1[idx]+"|"+arguments1[idx2]);
				}
				else
				{
					data.push(arguments1[idx]);
				}
			}
			else if(idx != null)
			{
				data.push(cmd.substr(cmd.lastIndexOf(">") + 1).split(",")[idx]);
			}
			else
			{
				data.push(cmd.substr(cmd.lastIndexOf(">") + 1));
			}
		}
	}
	return data;
}

function constructThumbnailPath(src, id)
{
	return "./scenes/" + id + "/" + src + "." + config.format.image.thumbnail;
}
function constructImagePath(src, id)
{
	return "./scenes/" + id + "/images/" + src + "." + config.format.image.ev;
}
function constructBgImagePath(src, id)
{
	return "./scenes/" + id + "/images/" + src + "." + config.format.image.bg;
}
function constructCharIconPath(src, id)
{
	return "./scenes/" + id + "/images/" + src + "." + config.format.image.charIcon;
}
function constructVoiceAudioPath(src, id)
{
	return "./scenes/" + id + "/voices/" + src + "." + config.format.audio.voice;
}

function constructBGMAudioPath(src)
{
	return "./data/audio/bgm/" + src + "." + config.format.audio.bgm;
}

function constructBgVoiceAudioPath(src, id)
{
	return "./scenes/" + id + "/bgvoices/" + src + "." + config.format.audio.bgVoice;
}

function constructBgSeAudioPath(src)
{
	return "./data/audio/bgse/" + src + "." + config.format.audio.bgSe;
}

function constructSEAudioPath(src)
{
	return "./data/audio/se/" + src + "." + config.format.audio.se;
}

function emptyTempPreload()
{
	preload.actorCanvas = {};
	preload.canvas = {};
	preload.temp = {};
	preload.paths = new Set();
	preload.files = new Set();
	killChildren(document.getElementById("preload-temp-elem"));
	killChildren(main.elements.canvasHoldElem);
	killChildren(main.elements.actorCanvasHoldElem);
}

function emptySpinePreload()
{
	killChildren(main.elements.spineViewersHoldElem);

	//preload.currentSpine=null;
	for(var i in preload.spines)
	{
		//preload.spines[i].spinePlayer.stopRendering();
		//Need to call dispose() so it stops calling requestAnimationFrame() again and so that the already queued frame just returns doing nothing
		preload.spines[i].spinePlayer.dispose();
		preload.spines[i].spinePlayer.context.canvas=null;
		//Need to clear the the drawing context stored in context.gl so that we don't get the warnings "to many active contexts" anymore
		preload.spines[i].spinePlayer.context.gl=null;
		
		preload.spines[i].spinePlayer=null;
	}
	preload.spines={};
}

//Remove all old preloaded spines in the CG viewer
function removeOldSpinePreload(cgItems)
{
	let spinesRemoved={};
	
	for(let i=0; i<cgItems.length; i++)
	{
		if(cgItems[i].event==="SPINE")
		{
			let filename=cgItems[i].filename;

			if(spinesRemoved[filename]===undefined)
			{
				spinesRemoved[filename]=1;

				//Remove the spine from the DOM whether it's in the main.elements.spineViewersHoldElem element or the main.elements.viewer element
				preload.spines[filename].remove();
	
				preload.spines[filename].spinePlayer.dispose();
				preload.spines[filename].spinePlayer.context.canvas=null;
				//Need to clear the the drawing context stored in context.gl so that we don't get the warnings "to many active contexts" anymore
				preload.spines[filename].spinePlayer.context.gl=null;
				preload.spines[filename].spinePlayer=null;
	
				delete preload.spines[filename];
			}
		}
	}
}

function permPreload(paths)
{
	preload.paths = new Set(paths);
	preload.paths.delete(undefined);
	preload.iter = preload.paths.values();
	//When permPreload is called at the start of the viewer the start loading screen is already displayed so this is pointless
	//displayLoadScreen();

	/*
	setTimeout(function(){

		loadPermFiles();
	}, 5000);
	*/
	loadPermFiles();
}

function loadPermFiles()
{
	let path = preload.iter.next().value;
	if(path == null || path == undefined){
		if(preload.failed){
			switchFromStartToSceneSelect();
			fileErrorPopup();
	  	mainInteractionEnabled(true);
			return;
		} else {
			switchFromStartToSceneSelect();
			cleanupPreload();
			//Viewer is now interactable again
	  	mainInteractionEnabled(true);
			return;
		}
	}
	main.elements.loadingFile.innerText = path;
	let fn = path.substr(path.lastIndexOf("/") + 1, path.lastIndexOf(".") - path.lastIndexOf("/") - 1);
	if(preload.temp[fn]){
		loadPermFiles();
		return;
	}
	loadImage(path, "permPreloadImage", true, loadPermFiles);
}

function errorLoading(path){
	preload.failed = true;
	preload.failedPaths.push(path);
}

function fileErrorPopup(){
	main.elements.loadingError.style.visibility = "initial";
	main.elements.loadingErrorMsg.value = "The following files could not be loaded:\n"
	for(let error of preload.failedPaths){
		main.elements.loadingErrorMsg.value += "    " + error + "\n";
	}
}

function closeError(){
	main.elements.loadingError.style.visibility = "hidden";
	main.elements.loadingErrorMsg.value = "";
	cleanupPreload();
	endScene();
}

function fileLoader(loadFunction){
	for(let i = 0; i < prefs.viewer.fileLoaders; i++){
		loadFunction();
	}
}

function updateProgress(){
	main.elements.loadingProgress.style.width = ((preload.loaded / preload.paths.size) * 100) + "%";
}

function loadImage(path, className, perm, callback)
{
	let img = new Image();
	let fn = path.substr(path.lastIndexOf("/") + 1, path.lastIndexOf(".") - path.lastIndexOf("/") - 1);
	img.className = className;
	img.addEventListener("load", function(){
		if(perm){
			preload.perm[fn] = img;
			preload.permElem.append(img);
		} else {
			preload.temp[fn] = img;
			preload.tempElem.append(img);
		}
		preload.loaded++;
		updateProgress();
		callback();
	}, {once:true});
	img.addEventListener("error", function(){
		errorLoading(path);
		callback();
	}, {once:true})
	img.src = path;
}

function loadVideo(path, className, perm, callback)
{
	let vid = document.createElement("video");
	vid.width = config.scene.width;
	vid.height = config.scene.height;
	vid.controls=false;
	//vid.loop=true;
	vid.preload="auto";

	let fn = path.substr(path.lastIndexOf("/") + 1, path.lastIndexOf(".") - path.lastIndexOf("/") - 1);
	vid.className = className;
	vid.setAttribute("video_filename", fn);	
	
	vid.addEventListener("canplay", function(){
		if(perm){
			preload.perm[fn] = vid;
			preload.permElem.append(vid);
		} else {
			//console.log("Done");
			preload.temp[fn] = vid;
			preload.tempElem.append(vid);
		}
		preload.loaded++;
		updateProgress();
		callback();
	}, {once:true});
	vid.addEventListener("error", function(){
		errorLoading(path);
		callback();
	}, {once:true})
	vid.src = path;
}

function loadAudio(path, perm, callback)
{
	let audio = new Audio();
	let fn = path.substr(path.lastIndexOf("/") + 1, path.lastIndexOf(".") - path.lastIndexOf("/") - 1);
	audio.addEventListener("canplay", function(){
		if(perm){
			preload.perm[fn] = audio;
		} else {
			preload.temp[fn] = audio;
		}
		preload.loaded++;
		updateProgress();
		callback();
	}, {once:true});
	audio.addEventListener("error", function(){
		errorLoading(path);
		callback();
	}, {once:true});
	audio.src = path;
}

async function loadAudioNow(path, type){

	//console.log("Loading audio of type: "+type+" path: "+path);

	let o = preload.audio[type.toLowerCase()];
	o.src = "";
	try{
		await promiseFile(path, o);
	} catch(e){
		console.log("Audio Load Error");
	}

	function promiseFile(path, obj){
		return new Promise((resolve, reject) => {
			let audio = obj;
			audio.oncanplaythrough = () => {
				return resolve();
			};
			audio.onerror = (e) => {
				//deleteElement(elem);
				errorLoading(path);
				reject();
			};
			audio.src = path;
		});
	}
}

/*
async function loadBacklogVoice(path){
	scene.current.backlogVoice.src = "";
	try{
		await promiseFile(path);
	} catch(e){
		console.log("Backlog Audio Load Error");
	}

	function promiseFile(path){
		return new Promise((resolve, reject) => {
			let audio = scene.current.backlogVoice;
			audio.oncanplaythrough = () => resolve();
			audio.onerror = () => {
				//deleteElement(elem);
				reject()
			};
			audio.src = path;
		});
	}
}
*/

//When done preloading in the start screen we then switch to the scene select screen
function switchFromStartToSceneSelect()
{
	main.view.current=SCENE_SELECT; //SCENE_SELECT = 1;
	main.view.prev=SCENE_SELECT;

	switchView();

	main.elements.header.style.visibility="visible";
	main.elements.footer.style.visibility="visible";
}

//Preload all fonts defined in: config.preload.perm.fonts, may be 0 or more
//Calls: callback() when done preloading
function preloadFonts(callback)
{
	//If no fonts to preload
	if(config.preload.perm.fonts.length === 0) {
		callback();
		return;
	}

	for(let i=0; i<config.preload.perm.fonts.length; i++)
	{
		let fontFamily=config.preload.perm.fonts[i]['fontFamily'];
		let filename=config.preload.perm.fonts[i]['filename'];

		let customFont=new FontFace(fontFamily, 'url(data/fonts/'+filename+')', {

		});
	
		//Definition isn't valid, try next font
		if(customFont.status!=="unloaded") {
			continue;
		}
	
		//Add to the document.fonts (FontFaceSet)
		//Must be added in order for the font to be used for rendering text
		document.fonts.add(customFont);
	
		//Load the font, this is what actually causes the browser to preload the font
		customFont.load();
	}

	//Wait until all the fonts are loaded
	//This also waits for fonts to be included from css: @font-face rules, but the fonts defined there will not be preloaded
	//Even if the fonts fail to load this will still be called
	document.fonts.ready.then(function onFulfilled(value){

		/*
		let iterator=document.fonts.values();
		console.log(iterator);
		//Gives a list of all custom fonts from @font-face rules defined here in javascript or in CSS in style.css
		//The preloaded fonts should have: status = "loaded" if they have been preloaded correctly, they will have: status = "unloaded" otherwise
		for(let j=0; j<iterator.size; j++)
		{
			let fontItem = iterator.next();
			console.log(fontItem);
			if(fontItem.value.status==="error") {
				console.error("FontFace name: "+fontFace.family+", failed to preload with status: "+fontFace.status);
			}
		}
		*/
		callback();
	});
}
