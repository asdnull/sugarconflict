var prefs = {
	scene:{
		eng:false,
		skipAnim:false,
		textBoxUnder:false,
		textBoxFullUnder:false,
		cutVoice:false,
		copyText:false,
		skipDelay:100,
		autoDelay:500,
		stretchTABA:false,
		furigana:false,
		tlName:false,
		nextRandom:false,
		auto:{
			waitVoice:true,
			cps:30,
			start:false
		},
		textBox:{
			textFont:"Default",
			nameBoxOpacity:100,
			textBoxOpacity:50
		},
		playNext:false,
		textStroke:false
	},
	cg:{
		//randomScene:false,
		//randomImg:false,
		shuffleScene:false,
		slideshow:false,
		slideshowWait:3000,
		fadeEffect:false,
	},
	select:{
		columns:4,
		rows:4,
		favourites:[],
		mode:0,
		iddisp:false,
	},
	audio:{
		voiceVolume:80,
		bgVoiceVolume:50,
		seVolume:60,
		bgSeVolume:50,
		bgmVolume:30
	},
	touch:{
		on:false
	},
	spineAnimation:{
		on:true
	},
	viewer:{
		scale:100,
		fileLoaders:1,
		loadingScreen:false,
		pauseOnFocusLoss:true,
		animationSpeed:100,
		playerName:"ルーファス",
	}
}

var opts = {
	scene:{

		auto:{

		},
		textBox: {

		}
	},
	cg:{

	},
	select:{

	},
	audio:{

	},
	touch:{

	},
	spineAnimation:{

	},
	viewer:{

	}
}

function initPreferences()
{
	opts.scene.eng = document.getElementsByName("scene-eng");
	opts.scene.skipAnim = document.getElementsByName("scene-skip-anim");
	opts.scene.textBoxUnder = document.getElementsByName("scene-text-box-under");
	opts.scene.cutVoice = document.getElementsByName("scene-cut-voice");
	opts.scene.copyText = document.getElementsByName("copy-text");
	opts.scene.tlName = document.getElementsByName("tl-names");
	opts.scene.playNext = document.getElementsByName("play-next");
	opts.scene.textStroke = document.getElementsByName("text-stroke");
	
	opts.scene.auto.waitVoice = document.getElementsByName("scene-auto-voice");
	opts.scene.auto.cps = document.getElementsByName("scene-auto-cps")[0];
	opts.scene.auto.start = document.getElementsByName("scene-start-auto");

	opts.scene.textBox.textFont = document.getElementById("select-text-font");
	opts.scene.textBox.nameBoxOpacityRange = document.getElementsByName("name-box-opacity-range")[0];
	opts.scene.textBox.nameBoxOpacityNumber = document.getElementsByName("name-box-opacity-number")[0];
	opts.scene.textBox.textBoxOpacityRange = document.getElementsByName("text-box-opacity-range")[0];
	opts.scene.textBox.textBoxOpacityNumber = document.getElementsByName("text-box-opacity-number")[0];

	//opts.cg.randomScene = document.getElementsByName("cg-random-scene");
	//opts.cg.randomImg = document.getElementsByName("cg-random-img");
	opts.cg.shuffleScene = document.getElementsByName("cg-shuffle-scene");
	opts.cg.slideshow = document.getElementsByName("cg-slideshow");
	opts.cg.slideshowWait = document.getElementsByName("cg-slide-wait")[0];
	opts.cg.fadeEffect = document.getElementsByName("cg-fade-effect");
	opts.select.columns = document.getElementsByName("select-columns")[0];
	opts.select.rows = document.getElementsByName("select-rows")[0];
	opts.audio.bgmRange = document.getElementsByName("audio-bgm-range")[0];
	opts.audio.bgmNumber = document.getElementsByName("audio-bgm-number")[0];

	opts.audio.bgVoiceRange = document.getElementsByName("audio-bg-voice-range")[0];
	opts.audio.bgVoiceNumber = document.getElementsByName("audio-bg-voice-number")[0];

	opts.audio.bgSeRange = document.getElementsByName("audio-bg-se-range")[0];
	opts.audio.bgSeNumber = document.getElementsByName("audio-bg-se-number")[0];

	opts.audio.seRange = document.getElementsByName("audio-se-range")[0];
	opts.audio.seNumber = document.getElementsByName("audio-se-number")[0];
	opts.audio.voiceRange = document.getElementsByName("audio-voice-range")[0];
	opts.audio.voiceNumber = document.getElementsByName("audio-voice-number")[0];

	//opts.touch.on = document.getElementsByName("touch-support");

	//opts.spineAnimation.on = document.getElementsByName("spine-animation");
	opts.viewer.scaleRange = document.getElementsByName("viewer-scale-range")[0];
	opts.viewer.scaleNumber = document.getElementsByName("viewer-scale-number")[0];
	opts.viewer.fileLoaders = document.getElementsByName("viewer-file-loaders")[0];
	opts.viewer.loadingScreen = document.getElementsByName("viewer-loading-screen");
	opts.viewer.pauseOnFocusLoss = document.getElementsByName("pause-on-focus-loss");
	opts.viewer.playerName = document.getElementsByName("player-name")[0];

	opts.viewer.animationSpeedRange = document.getElementsByName("animation-speed-range")[0];
	opts.viewer.animationSpeedNumber = document.getElementsByName("animation-speed-number")[0];

	opts.save = document.getElementById("option-save");
	opts.reset = document.getElementById("option-reset");
	opts.cancel = document.getElementById("option-cancel");
	opts.menu = document.getElementById("options");

	if(main.allowCookies){
		loadPreferences();
	}
	setOptionValues();
	setVarValues();

	addOptionEventListeners();
	setScale();

	//Use the custom select library on the: select-text-font select element
	//We use a custom library since there is no way that I know of to programmatically "open" a select element,
	//in the same way it would be naturally opened when clicking on it
	opts.scene.textBox.textFont.choicesInstance=new Choices(opts.scene.textBox.textFont, {
		allowHTML: false,
		searchEnabled: false,
		itemSelectText: "",
		shouldSort: false
	});
}

function setScale(){
	document.documentElement.style.setProperty("--viewerScale", prefs.viewer.scale / 100);
	// Scale still applies even if it's at 1.0 and will destroy fine details
	if(prefs.viewer.scale == 100){
		main.elements.html.classList.remove("page-scale");
	} else {
		main.elements.html.classList.add("page-scale");
	}
}

function removeLocalStorage(name){
	localStorage.removeItem(config.namePrefix+name);
}

function getLocalStorage(name){
	return localStorage.getItem(config.namePrefix+name);
}

function fromLocalStorage(name){
	return JSON.parse(localStorage.getItem(config.namePrefix+name));
}

function toLocalStorage(name, value){
	localStorage.setItem(config.namePrefix+name, JSON.stringify(value));
}

function loadPreferences(){
	if(!main.allowCookies){
		return;
	}
	prefs.select.columns = getLocalStorage("columns")!==null ? fromLocalStorage("columns") : 4;
	prefs.select.rows = getLocalStorage("rows")!==null ? fromLocalStorage("rows") : 4;
	prefs.scene.eng = getLocalStorage("engScripts")!==null ? fromLocalStorage("engScripts") : false;
	prefs.scene.skipAnim = getLocalStorage("skipAnimations")!==null ? fromLocalStorage("skipAnimations") : false;
	prefs.scene.textBoxUnder = getLocalStorage("textBoxUnder")!==null ? fromLocalStorage("textBoxUnder") : false;
	prefs.scene.textBoxFullUnder = getLocalStorage("textBoxFullUnder")!==null ? fromLocalStorage("textBoxFullUnder") : false;
	prefs.audio.bgmVolume = getLocalStorage("bgmVolume")!==null ? fromLocalStorage("bgmVolume") : 30;

	prefs.audio.bgVoiceVolume = getLocalStorage("bgVoiceVolume")!==null ? fromLocalStorage("bgVoiceVolume") : 50;

	prefs.audio.bgSeVolume = getLocalStorage("bgSeVolume")!==null ? fromLocalStorage("bgSeVolume") : 50;

	prefs.audio.seVolume = getLocalStorage("seVolume")!==null ? fromLocalStorage("seVolume") : 60;
	prefs.audio.voiceVolume = getLocalStorage("voiceVolume")!==null ? fromLocalStorage("voiceVolume") : 80;
	prefs.scene.auto.waitVoice = getLocalStorage("sceneAutoWaitVoice")!==null ? fromLocalStorage("sceneAutoWaitVoice") : true;
	prefs.scene.cutVoice = getLocalStorage("sceneCutVoice")!==null ? fromLocalStorage("sceneCutVoice") : false;
	prefs.scene.copyText = getLocalStorage("copyText")!==null ? fromLocalStorage("copyText") : false;
	prefs.scene.auto.cps = getLocalStorage("sceneAutoCPS")!==null ? fromLocalStorage("sceneAutoCPS") : 30;
	prefs.scene.auto.start = getLocalStorage("sceneStartAuto")!==null ? fromLocalStorage("sceneStartAuto") : false;
	prefs.select.favourites = getLocalStorage("favourites")!==null ? fromLocalStorage("favourites") : [];
	//prefs.cg.randomScene = getLocalStorage("cgViewRandom")!==null ? fromLocalStorage("cgViewRandom") : false;
	prefs.cg.shuffleScene = getLocalStorage("cgViewShuffle")!==null ? fromLocalStorage("cgViewShuffle") : false;
	//prefs.cg.randomImg = getLocalStorage("cgViewRandomImg")!==null ? fromLocalStorage("cgViewRandomImg") : false;
	prefs.cg.slideshow = getLocalStorage("cgViewSlideShow")!==null ? fromLocalStorage("cgViewSlideShow") : false;

	//prefs.touch.on = getLocalStorage("touchSupport")!==null ? fromLocalStorage("touchSupport") : false;

	//prefs.spineAnimation.on = getLocalStorage("spineAnimation")!==null ? fromLocalStorage("spineAnimation") : true;
	prefs.cg.slideshowWait = getLocalStorage("cgViewSlideShowWait")!==null ? fromLocalStorage("cgViewSlideShowWait") : 3000;
	prefs.select.mode = getLocalStorage("sceneViewMode")!==null ? fromLocalStorage("sceneViewMode") : true;
	prefs.scene.tlName = getLocalStorage("tlName")!==null ? fromLocalStorage("tlName") : false;
	prefs.scene.playNext = getLocalStorage("playNext")!==null ? fromLocalStorage("playNext") : false;
	prefs.scene.textStroke = getLocalStorage("textStroke")!==null ? fromLocalStorage("textStroke") : false;

	prefs.cg.fadeEffect = getLocalStorage("cgFadeEffect")!==null ? fromLocalStorage("cgFadeEffect") : false;
	prefs.viewer.scale = getLocalStorage("viewerScale")!==null ? fromLocalStorage("viewerScale") : 100;
	prefs.viewer.fileLoaders = getLocalStorage("fileLoaders")!==null ? fromLocalStorage("fileLoaders") : 1;
	prefs.viewer.loadingScreen = getLocalStorage("loadingScreen")!==null ? fromLocalStorage("loadingScreen") : false;
	prefs.viewer.pauseOnFocusLoss = getLocalStorage("pauseOnFocusLoss")!==null ? fromLocalStorage("pauseOnFocusLoss") : true;
	prefs.viewer.playerName = getLocalStorage("playerName")!==null ? fromLocalStorage("playerName") : 'ルーファス';

	prefs.viewer.animationSpeed = getLocalStorage("animationSpeed")!==null ? fromLocalStorage("animationSpeed") : 100;

	// Hidden
	prefs.scene.furigana = getLocalStorage("sceneFurigana")!==null ? fromLocalStorage("sceneFurigana") : false;
	prefs.scene.stretchTABA = getLocalStorage("stretchTABA")!==null ? fromLocalStorage("stretchTABA") : false;
	prefs.select.iddisp = getLocalStorage("iddisp")!==null ? fromLocalStorage("iddisp") : false;
	
	// Text box
	prefs.scene.textBox.nameBoxOpacity = getLocalStorage("nameBoxOpacity")!==null ? fromLocalStorage("nameBoxOpacity") : 100;
	prefs.scene.textBox.textBoxOpacity = getLocalStorage("textBoxOpacity")!==null ? fromLocalStorage("textBoxOpacity") : 50;

	// TL Tools
	tlTools.save.auto.active = getLocalStorage("autoSave")!==null ? fromLocalStorage("autoSave") : true;
	tlTools.save.auto.timer = getLocalStorage("autoSaveTimer")!==null ? fromLocalStorage("autoSaveTimer") : 30;
}

function setVarValues()
{
	document.documentElement.style.setProperty("--name-plate-opacity", prefs.scene.textBox.nameBoxOpacity / 100);
	document.documentElement.style.setProperty("--text-box-opacity", prefs.scene.textBox.textBoxOpacity / 100);
}

function setOptionValues(){
	opts.audio.bgmRange.value = prefs.audio.bgmVolume;

	opts.audio.bgVoiceRange.value = prefs.audio.bgVoiceVolume;
	opts.audio.bgSeRange.value = prefs.audio.bgSeVolume;

	opts.audio.seRange.value = prefs.audio.seVolume;
	opts.audio.voiceRange.value = prefs.audio.voiceVolume;
	opts.audio.bgmNumber.value = prefs.audio.bgmVolume;

	opts.audio.bgVoiceNumber.value = prefs.audio.bgVoiceVolume;
	opts.audio.bgSeNumber.value = prefs.audio.bgSeVolume;

	opts.audio.seNumber.value = prefs.audio.seVolume;
	opts.audio.voiceNumber.value = prefs.audio.voiceVolume;
	opts.select.columns.value = prefs.select.columns;
	opts.select.rows.value = prefs.select.rows;
	opts.scene.auto.cps.value = prefs.scene.auto.cps;
	opts.cg.slideshowWait.value = prefs.cg.slideshowWait;
	opts.viewer.scaleRange.value = prefs.viewer.scale;
	opts.viewer.scaleNumber.value = prefs.viewer.scale;
	opts.viewer.fileLoaders.value = prefs.viewer.fileLoaders;
	opts.viewer.playerName.value = prefs.viewer.playerName;

	opts.viewer.animationSpeedRange.value = prefs.viewer.animationSpeed;
	opts.viewer.animationSpeedNumber.value = prefs.viewer.animationSpeed;

	opts.scene.textBox.nameBoxOpacityRange.value = prefs.scene.textBox.nameBoxOpacity;
	opts.scene.textBox.nameBoxOpacityNumber.value = prefs.scene.textBox.nameBoxOpacity;
	opts.scene.textBox.textBoxOpacityRange.value = prefs.scene.textBox.textBoxOpacity;
	opts.scene.textBox.textBoxOpacityNumber.value = prefs.scene.textBox.textBoxOpacity;

	//opts.viewer.animSpeedRange.value  = prefs.viewer.animationSpeed;
	//opts.viewer.animSpeedNumber.value = prefs.viewer.animationSpeed;

	if(prefs.scene.eng){
		opts.scene.eng[0].checked = true;
	} else {
		opts.scene.eng[1].checked = true;
	}
	if(prefs.scene.skipAnim){
		opts.scene.skipAnim[0].checked = true;
	} else {
		opts.scene.skipAnim[1].checked = true;
	}
	if(prefs.scene.textBoxUnder){
		opts.scene.textBoxUnder[0].checked = true;
	} else {
		opts.scene.textBoxUnder[1].checked = true;
	}
	if(prefs.scene.auto.waitVoice){
		opts.scene.auto.waitVoice[0].checked = true;
	} else {
		opts.scene.auto.waitVoice[1].checked = true;
	}
	if(prefs.scene.cutVoice){
		opts.scene.cutVoice[0].checked = true;
	} else {
		opts.scene.cutVoice[1].checked = true;
	}
	if(prefs.scene.copyText){
		opts.scene.copyText[0].checked = true;
	} else {
		opts.scene.copyText[1].checked = true;
	}
	if(prefs.scene.auto.start){
		opts.scene.auto.start[0].checked = true;
	} else {
		opts.scene.auto.start[1].checked = true;
	}
	/*
	if(prefs.cg.randomScene){
		opts.cg.randomScene[0].checked = true;
	} else {
		opts.cg.randomScene[1].checked = true;
	}
	*/
	if(prefs.cg.shuffleScene){
		opts.cg.shuffleScene[0].checked = true;
	} else {
		opts.cg.shuffleScene[1].checked = true;
	}
	/*
	if(prefs.cg.randomImg){
		opts.cg.randomImg[0].checked = true;
	} else {
		opts.cg.randomImg[1].checked = true;
	}
	*/
	if(prefs.cg.slideshow){
		opts.cg.slideshow[0].checked = true;
	} else {
		opts.cg.slideshow[1].checked = true;
	}
	/*
	if(prefs.touch.on){
		opts.touch.on[0].checked = true;
	} else {
		opts.touch.on[1].checked = true;
	}
	*/
	/*
	if(prefs.spineAnimation.on){
		opts.spineAnimation.on[0].checked = true;
	} else {
		opts.spineAnimation.on[1].checked = true;
	}
	*/
	if(prefs.scene.tlName){
		opts.scene.tlName[0].checked = true;
	} else {
		opts.scene.tlName[1].checked = true;
	}
	if(prefs.scene.playNext){
		opts.scene.playNext[0].checked = true;
	} else {
		opts.scene.playNext[1].checked = true;
	}

	if(prefs.scene.textStroke){
		opts.scene.textStroke[0].checked = true;
	} else {
		opts.scene.textStroke[1].checked = true;
	}

	if(prefs.cg.fadeEffect){
		opts.cg.fadeEffect[0].checked = true;
	} else {
		opts.cg.fadeEffect[1].checked = true;
	}
	if(prefs.viewer.loadingScreen){
		opts.viewer.loadingScreen[0].checked = true;
	} else {
		opts.viewer.loadingScreen[1].checked = true;
	}
	if(prefs.viewer.pauseOnFocusLoss){
		opts.viewer.pauseOnFocusLoss[0].checked = true;
	} else {
		opts.viewer.pauseOnFocusLoss[1].checked = true;
	}

}

function addOptionEventListeners(){

	//input
	opts.scene.textBox.nameBoxOpacityRange.addEventListener("input", function(){
		opts.scene.textBox.nameBoxOpacityNumber.value = opts.scene.textBox.nameBoxOpacityRange.value;
		document.documentElement.style.setProperty("--name-plate-opacity", Number(opts.scene.textBox.nameBoxOpacityRange.value) / 100);
	},true);
	opts.scene.textBox.nameBoxOpacityNumber.addEventListener("input", function(){
		opts.scene.textBox.nameBoxOpacityRange.value = opts.scene.textBox.nameBoxOpacityNumber.value;
		document.documentElement.style.setProperty("--name-plate-opacity", Number(opts.scene.textBox.nameBoxOpacityRange.value) / 100);
	},true);

	//change
	opts.scene.textBox.nameBoxOpacityRange.addEventListener("change", function(){
		if(opts.scene.textBox.nameBoxOpacityRange.value > 100){
			opts.scene.textBox.nameBoxOpacityRange.value = 100;
		} else if(opts.scene.textBox.nameBoxOpacityRange.value < 0){
			opts.scene.textBox.nameBoxOpacityRange.value = 0;
		}
		opts.scene.textBox.nameBoxOpacityNumber.value = opts.scene.textBox.nameBoxOpacityRange.value;
	},true);
	opts.scene.textBox.nameBoxOpacityNumber.addEventListener("change", function(){
		if(opts.scene.textBox.nameBoxOpacityNumber.value > 100){
			opts.scene.textBox.nameBoxOpacityNumber.value = 100;
		} else if(opts.scene.textBox.nameBoxOpacityNumber.value < 0){
			opts.scene.textBox.nameBoxOpacityNumber.value = 0;
		}
		opts.scene.textBox.nameBoxOpacityRange.value = opts.scene.textBox.nameBoxOpacityNumber.value;
	},true);

	//input
	opts.scene.textBox.textBoxOpacityRange.addEventListener("input", function(){
		opts.scene.textBox.textBoxOpacityNumber.value = opts.scene.textBox.textBoxOpacityRange.value;
		document.documentElement.style.setProperty("--text-box-opacity", Number(opts.scene.textBox.textBoxOpacityRange.value) / 100);
	},true);
	opts.scene.textBox.textBoxOpacityNumber.addEventListener("input", function(){
		opts.scene.textBox.textBoxOpacityRange.value = opts.scene.textBox.textBoxOpacityNumber.value;
		document.documentElement.style.setProperty("--text-box-opacity", Number(opts.scene.textBox.textBoxOpacityRange.value) / 100);
	},true);

	//change
	opts.scene.textBox.textBoxOpacityRange.addEventListener("change", function(){
		if(opts.scene.textBox.textBoxOpacityRange.value > 100){
			opts.scene.textBox.textBoxOpacityRange.value = 100;
		} else if(opts.scene.textBox.textBoxOpacityRange.value < 0){
			opts.scene.textBox.textBoxOpacityRange.value = 0;
		}
		opts.scene.textBox.textBoxOpacityNumber.value = opts.scene.textBox.textBoxOpacityRange.value;
	},true);
	opts.scene.textBox.textBoxOpacityNumber.addEventListener("change", function(){
		if(opts.scene.textBox.textBoxOpacityNumber.value > 100){
			opts.scene.textBox.textBoxOpacityNumber.value = 100;
		} else if(opts.scene.textBox.textBoxOpacityNumber.value < 0){
			opts.scene.textBox.textBoxOpacityNumber.value = 0;
		}
		opts.scene.textBox.textBoxOpacityRange.value = opts.scene.textBox.textBoxOpacityNumber.value;
	},true);

	//
	opts.audio.bgmRange.addEventListener("input", function(){
		opts.audio.bgmNumber.value = opts.audio.bgmRange.value;
		scene.current.bgm.volume = Number(opts.audio.bgmRange.value) / 100;
	},true);
	opts.audio.bgmNumber.addEventListener("input", function(){
		opts.audio.bgmRange.value = opts.audio.bgmNumber.value;
		scene.current.bgm.volume = Number(opts.audio.bgmRange.value) / 100;
	},true);

	opts.audio.bgVoiceRange.addEventListener("input", function(){
		opts.audio.bgVoiceNumber.value = opts.audio.bgVoiceRange.value;
		//scene.current.bgVoice.volume = Number(opts.audio.bgVoiceRange.value) / 100;
		scene.current.bgVoice.setVolumeAllAudio(Number(opts.audio.bgVoiceRange.value) / 100);
	},true);
	opts.audio.bgVoiceNumber.addEventListener("input", function(){
		opts.audio.bgVoiceRange.value = opts.audio.bgVoiceNumber.value;
		//scene.current.bgVoice.volume = Number(opts.audio.bgVoiceRange.value) / 100;
		scene.current.bgVoice.setVolumeAllAudio(Number(opts.audio.bgVoiceRange.value) / 100);
	},true);

	opts.audio.bgSeRange.addEventListener("input", function(){
		opts.audio.bgSeNumber.value = opts.audio.bgSeRange.value;
		//scene.current.bgSe.volume = Number(opts.audio.bgSeRange.value) / 100;
		scene.current.bgSe.setVolumeAllAudio(Number(opts.audio.bgSeRange.value) / 100);
	},true);
	opts.audio.bgSeNumber.addEventListener("input", function(){
		opts.audio.bgSeRange.value = opts.audio.bgSeNumber.value;
		//scene.current.bgSe.volume = Number(opts.audio.bgSeRange.value) / 100;
		scene.current.bgSe.setVolumeAllAudio(Number(opts.audio.bgSeRange.value) / 100);
	},true);

	opts.audio.seRange.addEventListener("input", function(){
		opts.audio.seNumber.value = opts.audio.seRange.value;
		//scene.current.se.volume = Number(opts.audio.seRange.value) / 100;
		scene.current.se.setVolumeAllAudio(Number(opts.audio.seRange.value) / 100);
	},true);
	opts.audio.seNumber.addEventListener("input", function(){
		opts.audio.seRange.value = opts.audio.seNumber.value;
		//scene.current.se.volume = Number(opts.audio.seRange.value) / 100;
		scene.current.se.setVolumeAllAudio(Number(opts.audio.seRange.value) / 100);
	},true);

	opts.audio.voiceRange.addEventListener("input", function(){
		opts.audio.voiceNumber.value = opts.audio.voiceRange.value;
		//scene.current.voice.volume = Number(opts.audio.voiceRange.value) / 100;
		scene.current.voice.setVolumeAllAudio(Number(opts.audio.voiceRange.value) / 100);
	},true);
	opts.audio.voiceNumber.addEventListener("input", function(){
		opts.audio.voiceRange.value = opts.audio.voiceNumber.value;
		//scene.current.voice.volume = Number(opts.audio.voiceRange.value) / 100;
		scene.current.voice.setVolumeAllAudio(Number(opts.audio.voiceRange.value) / 100);
	},true);

	//change
	opts.audio.bgmRange.addEventListener("change", function(){
		if(opts.audio.bgmRange.value > 100){
			opts.audio.bgmRange.value = 100;
		} else if(opts.audio.bgmRange.value < 0){
			opts.audio.bgmRange.value = 0;
		}
		opts.audio.bgmNumber.value = opts.audio.bgmRange.value;
	},true);
	opts.audio.bgmNumber.addEventListener("change", function(){
		if(opts.audio.bgmNumber.value > 100){
			opts.audio.bgmNumber.value = 100;
		} else if(opts.audio.bgmNumber.value < 0){
			opts.audio.bgmNumber.value = 0;
		}
		opts.audio.bgmRange.value = opts.audio.bgmNumber.value;
	},true);

	//bg voice change event
	opts.audio.bgVoiceRange.addEventListener("change", function(){
		if(opts.audio.bgVoiceRange.value > 100){
			opts.audio.bgVoiceRange.value = 100;
		} else if(opts.audio.bgVoiceRange.value < 0){
			opts.audio.bgVoiceRange.value = 0;
		}
		opts.audio.bgVoiceNumber.value = opts.audio.bgVoiceRange.value;
	},true);
	opts.audio.bgVoiceNumber.addEventListener("change", function(){
		if(opts.audio.bgVoiceNumber.value > 100){
			opts.audio.bgVoiceNumber.value = 100;
		} else if(opts.audio.bgVoiceNumber.value < 0){
			opts.audio.bgVoiceNumber.value = 0;
		}
		opts.audio.bgVoiceRange.value = opts.audio.bgVoiceNumber.value;
	},true);

	//bg se change event
	opts.audio.bgSeRange.addEventListener("change", function(){
		if(opts.audio.bgSeRange.value > 100){
			opts.audio.bgSeRange.value = 100;
		} else if(opts.audio.bgSeRange.value < 0){
			opts.audio.bgSeRange.value = 0;
		}
		opts.audio.bgSeNumber.value = opts.audio.bgSeRange.value;
	},true);
	opts.audio.bgSeNumber.addEventListener("change", function(){
		if(opts.audio.bgSeNumber.value > 100){
			opts.audio.bgSeNumber.value = 100;
		} else if(opts.audio.bgSeNumber.value < 0){
			opts.audio.bgSeNumber.value = 0;
		}
		opts.audio.bgSeRange.value = opts.audio.bgSeNumber.value;
	},true);

	opts.audio.seRange.addEventListener("change", function(){
		if(opts.audio.seRange.value > 100){
			opts.audio.seRange.value = 100;
		} else if(opts.audio.seRange.value < 0){
			opts.audio.seRange.value = 0;
		}
		opts.audio.seNumber.value = opts.audio.seRange.value;
	},true);
	opts.audio.seNumber.addEventListener("change", function(){
		if(opts.audio.seNumber.value > 100){
			opts.audio.seNumber.value = 100;
		} else if(opts.audio.seNumber.value < 0){
			opts.audio.seNumber.value = 0;
		}
		opts.audio.seRange.value = opts.audio.seNumber.value;
	},true);
		opts.audio.voiceRange.addEventListener("change", function(){
		if(opts.audio.voiceRange.value > 100){
			opts.audio.voiceRange.value = 100;
		} else if(opts.audio.voiceRange.value < 0){
			opts.audio.voiceRange.value = 0;
		}
		opts.audio.voiceNumber.value = opts.audio.voiceRange.value;
	},true);
	opts.audio.voiceNumber.addEventListener("change", function(){
		if(opts.audio.voiceNumber.value > 100){
			opts.audio.voiceNumber.value = 100;
		} else if(opts.audio.voiceNumber.value < 0){
			opts.audio.voiceNumber.value = 0;
		}
		opts.audio.voiceRange.value = opts.audio.voiceNumber.value;
	},true);

	opts.viewer.scaleRange.addEventListener("input", function(){
		opts.viewer.scaleNumber.value = opts.viewer.scaleRange.value;
	},true);
	opts.viewer.scaleNumber.addEventListener("input", function(){
		opts.viewer.scaleRange.value = opts.viewer.scaleNumber.value;
	},true);

	opts.viewer.scaleRange.addEventListener("change", function(){
		if(opts.viewer.scaleRange.value > 200){
			opts.viewer.scaleRange.value = 200;
		} else if(opts.viewer.scaleRange.value < 50){
			opts.viewer.scaleRange.value = 50;
		}
		opts.viewer.scaleNumber.value = opts.viewer.scaleRange.value;
	},true);
	opts.viewer.scaleNumber.addEventListener("change", function(){
		if(opts.viewer.scaleNumber.value > 200){
			opts.viewer.scaleNumber.value = 200;
		} else if(opts.viewer.scaleNumber.value < 50){
			opts.viewer.scaleNumber.value = 50;
		}
		opts.viewer.scaleRange.value = opts.viewer.scaleNumber.value;
	},true);

	//
	opts.viewer.animationSpeedRange.addEventListener("input", function(){
		opts.viewer.animationSpeedNumber.value = opts.viewer.animationSpeedRange.value;
		if(scene.current.spineAnimation!==null) {
			scene.current.spineAnimation.spinePlayer.setSpeed(Number(opts.viewer.animationSpeedRange.value) / 100);
		}
	},true);
	opts.viewer.animationSpeedNumber.addEventListener("input", function(){
		opts.viewer.animationSpeedRange.value = opts.viewer.animationSpeedNumber.value;
		if(scene.current.spineAnimation!==null) {
			scene.current.spineAnimation.spinePlayer.setSpeed(Number(opts.viewer.animationSpeedRange.value) / 100);
		}
	},true);

	opts.viewer.animationSpeedRange.addEventListener("change", function(){
		if(opts.viewer.animationSpeedRange.value > 300){
			opts.viewer.animationSpeedRange.value = 300;
		} else if(opts.viewer.animationSpeedRange.value < 50){
			opts.viewer.animationSpeedRange.value = 50;
		}
		opts.viewer.animationSpeedNumber.value = opts.viewer.animationSpeedRange.value;
	},true);
	opts.viewer.animationSpeedNumber.addEventListener("change", function(){
		if(opts.viewer.animationSpeedNumber.value > 300){
			opts.viewer.animationSpeedNumber.value = 300;
		} else if(opts.viewer.animationSpeedNumber.value < 50){
			opts.viewer.animationSpeedNumber.value = 50;
		}
		opts.viewer.animationSpeedRange.value = opts.viewer.animationSpeedNumber.value;
	},true);

	//Text stroke on/off change
	opts.scene.textStroke[0].addEventListener("change", function(){
		if(opts.scene.textStroke[0].checked){
			if(scene.elements.textBox!==undefined){
				scene.elements.textBox.classList.add("center-stroke");
			}
		}
		else{
			if(scene.elements.textBox!==undefined){
				scene.elements.textBox.classList.remove("center-stroke");
			}
		}
	},true);
	opts.scene.textStroke[1].addEventListener("change", function(){
		if(opts.scene.textStroke[1].checked){
			if(scene.elements.textBox!==undefined){
				scene.elements.textBox.classList.remove("center-stroke");
			}
		}
		else{
			if(scene.elements.textBox!==undefined){
				scene.elements.textBox.classList.add("center-stroke");
			}
		}
	},true);

	opts.save.addEventListener("click", function(){
		checkChanges();
		savePreferences();
		opts.menu.style.display = "none";
		//
		main.view.current = main.view.prev;

		pauseViewer(false);
	}, true);

	opts.reset.addEventListener("click", defaultPreferences, true);

	opts.cancel.addEventListener("click", function(){
		scene.current.bgm.volume = prefs.audio.bgmVolume / 100;
		//scene.current.bgVoice.volume = prefs.audio.bgVoiceVolume / 100;
		//scene.current.bgSe.volume = prefs.audio.bgSeVolume / 100;
		//scene.current.se.volume = prefs.audio.seVolume / 100;
		scene.current.bgVoice.setVolumeAllAudio(prefs.audio.bgVoiceVolume / 100);
		scene.current.bgSe.setVolumeAllAudio(prefs.audio.bgSeVolume / 100);
		scene.current.se.setVolumeAllAudio(prefs.audio.seVolume / 100);
		//scene.current.voice.volume = prefs.audio.voiceVolume / 100;
		scene.current.voice.setVolumeAllAudio(prefs.audio.voiceVolume / 100);

		if(scene.current.spineAnimation!==null) {
			scene.current.spineAnimation.spinePlayer.setSpeed(prefs.viewer.animationSpeed / 100);
		}

		if(prefs.scene.textStroke) {
			if(scene.elements.textBox!==undefined) {
				scene.elements.textBox.classList.add("center-stroke");
			}
		}
		else {
			if(scene.elements.textBox!==undefined) {
				scene.elements.textBox.classList.remove("center-stroke");
			}
		}

		setOptionValues();
		setVarValues();

		opts.menu.style.display = "none";
		//
		main.view.current = main.view.prev;

		pauseViewer(false);
	}, true);

	//When showing the dropdown (on click) using the custom event "showDropdown" of the Choices select library
	opts.scene.textBox.textFont.addEventListener("showDropdown", function populateFonts(event){

		populateLocalFonts(this, populateFonts);
	});

	//When selecting an item from the select box, change the font of the text box, or reset it to the default
	opts.scene.textBox.textFont.addEventListener("choice", function populateFonts(event){

		//console.log(event.detail.choice.value);
		if(event.detail.choice.value==="Default")
		{
			document.documentElement.style.removeProperty("--font-text");
			document.documentElement.style.removeProperty("--font-name");
		}
		else
		{
			document.documentElement.style.setProperty("--font-text", event.detail.choice.value);
			document.documentElement.style.setProperty("--font-name", event.detail.choice.value);
		}
	});
}

function checkChanges(){
	if(Number(opts.select.columns.value) != prefs.select.columns || Number(opts.select.rows.value) != prefs.select.rows){
		prefs.select.columns = Number(opts.select.columns.value);
		prefs.select.rows = Number(opts.select.rows.value);
		realignSceneSelect();
		constructSceneSelect();
	}
	//2 = SCENE_VIEWER
	if(!prefs.scene.textBoxUnder && opts.scene.textBoxUnder[0].checked && main.view.prev == 2)
	{
		if(scene.backlogOpen) {
			unhideElem(scene.elements.textBox);
		}

		stretchFrame();
	}
	else if(prefs.scene.textBoxUnder && !opts.scene.textBoxUnder[0].checked && main.view.prev == 2)
	{
		if(scene.backlogOpen) {
			hideElem(scene.elements.textBox);
		}

		contractFrame();
	}
}

function realignSceneSelect()
{
	let cursorActive=document.getElementsByClassName("cursor-active");
	if(cursorActive.length === 0)	{
		sceneSelect.page = 0;
		sceneSelect.cursor = 0;
	}
	else
	{
		let curScene = cursorActive[0].getAttribute("sceneId");
		let idx = main.sceneList.indexOf(curScene);
		if(idx > -1){
			let pp = prefs.select.columns * prefs.select.rows;
			sceneSelect.page = Math.floor(idx / pp);
			sceneSelect.cursor = idx % pp;
		} else {
			sceneSelect.page = 0;
			sceneSelect.cursor = 0;
		}
	}
}

function defaultPreferences(){

	if(prefs.scene.textBoxUnder && opts.scene.textBoxUnder[0].checked && main.view.prev == 2)
	{
		if(scene.backlogOpen) {
			hideElem(scene.elements.textBox);
		}

		contractFrame();
	}

	// Select
	prefs.select.columns = 4;
	prefs.select.rows = 4;
	prefs.select.mode = true;
	// Select - Hidden
	prefs.select.iddisp = false;

	// Scene
	prefs.scene.eng = false;
	prefs.scene.skipAnim = false;
	prefs.scene.textBoxUnder = false;
	prefs.scene.textBoxFullUnder = false;
	prefs.scene.cutVoice = false;
	prefs.scene.copyText = false;
	prefs.scene.tlName = false;
	prefs.scene.playNext = false;
	prefs.scene.textStroke = false;

	// Scene - Auto
	prefs.scene.auto.cps = 30;
	prefs.scene.auto.waitVoice = true;
	prefs.scene.auto.start = false;
	// Scene - Hidden
	prefs.scene.furigana = false;
	prefs.scene.stretchTABA = false;
	prefs.scene.skipDelay = 100;
	prefs.scene.autoDelay = 500;

	// CG
	//prefs.cg.randomImg = false;
	prefs.cg.shuffleScene = false;
	//prefs.cg.randomScene = false;
	prefs.cg.slideshow = false;
	prefs.cg.slideshowWait = 3000;
	prefs.cg.fadeEffect = false;

	// Audio
	prefs.audio.bgmVolume = 30;
	prefs.audio.bgVoiceVolume = 50;
	prefs.audio.bgSeVolume = 50;
	prefs.audio.seVolume = 60;
	prefs.audio.voiceVolume = 80;

	// Text box
	prefs.scene.textBox.nameBoxOpacity = 100;
	prefs.scene.textBox.textBoxOpacity = 50;

	//Touch
	//prefs.touch.on = false;

	//Spine animation
	prefs.spineAnimation.on = true;

	// Misc
	prefs.viewer.scale = 100;
	prefs.viewer.fileLoaders = 1;
	prefs.viewer.loadingScreen = false;
	prefs.viewer.pauseOnFocusLoss = true;
	prefs.viewer.playerName = "ルーファス";

	prefs.viewer.animationSpeed = 100;

	setOptionValues();
	setVarValues();

	checkChanges();
	savePreferences();
	constructSceneSelect();
}

function savePreferences()
{
	prefs.select.columns = Number(opts.select.columns.value) > 0 ? Number(opts.select.columns.value) : prefs.select.columns;
	prefs.select.rows = Number(opts.select.rows.value) > 0 ? Number(opts.select.rows.value) : prefs.select.rows;
	prefs.scene.eng = opts.scene.eng[0].checked;
	prefs.scene.skipAnim = opts.scene.skipAnim[0].checked;
	prefs.scene.textBoxUnder = opts.scene.textBoxUnder[0].checked;
	prefs.audio.bgmVolume = Number(opts.audio.bgmRange.value);
	prefs.audio.bgVoiceVolume = Number(opts.audio.bgVoiceRange.value);
	prefs.audio.bgSeVolume = Number(opts.audio.bgSeRange.value);
	prefs.audio.seVolume = Number(opts.audio.seRange.value);
	prefs.audio.voiceVolume = Number(opts.audio.voiceRange.value);
	prefs.scene.auto.waitVoice = opts.scene.auto.waitVoice[0].checked;
	prefs.scene.cutVoice = opts.scene.cutVoice[0].checked;
	prefs.scene.copyText = opts.scene.copyText[0].checked;
	prefs.scene.auto.cps = Number(opts.scene.auto.cps.value) > 0 ? Number(opts.scene.auto.cps.value) : prefs.scene.auto.cps;
	prefs.scene.auto.start = opts.scene.auto.start[0].checked;
	//prefs.cg.randomScene = opts.cg.randomScene[0].checked;
	prefs.cg.shuffleScene = opts.cg.shuffleScene[0].checked;
	//prefs.cg.randomImg = opts.cg.randomImg[0].checked;
	prefs.cg.slideshow = opts.cg.slideshow[0].checked;
	prefs.cg.slideshowWait = Number(opts.cg.slideshowWait.value) > 0 ? Number(opts.cg.slideshowWait.value) : prefs.scene.auto.cps;

	prefs.scene.textBox.nameBoxOpacity = Number(opts.scene.textBox.nameBoxOpacityRange.value);
	prefs.scene.textBox.textBoxOpacity = Number(opts.scene.textBox.textBoxOpacityRange.value);

	//prefs.touch.on = opts.touch.on[0].checked;

	//prefs.spineAnimation.on = opts.spineAnimation.on[0].checked;
	prefs.scene.tlName = opts.scene.tlName[0].checked;
	prefs.scene.playNext = opts.scene.playNext[0].checked;
	prefs.scene.textStroke = opts.scene.textStroke[0].checked;

	prefs.cg.fadeEffect = opts.cg.fadeEffect[0].checked;
	prefs.viewer.scale = Number(opts.viewer.scaleRange.value);
	prefs.viewer.fileLoaders = Number(opts.viewer.fileLoaders.value) > 0 ? Number(opts.viewer.fileLoaders.value) : prefs.viewer.fileLoaders;
	prefs.viewer.loadingScreen = opts.viewer.loadingScreen[0].checked;
	prefs.viewer.pauseOnFocusLoss = opts.viewer.pauseOnFocusLoss[0].checked;
	prefs.viewer.playerName = opts.viewer.playerName.value;

	//prefs.viewer.animationSpeed = opts.viewer.animSpeedRange.value;
	prefs.viewer.animationSpeed = Number(opts.viewer.animationSpeedRange.value); 

	setScale();

	if(!main.allowCookies){
		return;
	}

	//console.log(prefs.select.columns);
	//console.log(prefs.audio.bgSeVolume);
	toLocalStorage("columns", prefs.select.columns);
	toLocalStorage("rows", prefs.select.rows);
	toLocalStorage("engScripts", prefs.scene.eng);
	toLocalStorage("skipAnimations", prefs.scene.skipAnim);
	toLocalStorage("textBoxUnder", prefs.scene.textBoxUnder);
	toLocalStorage("textBoxFullUnder", prefs.scene.textBoxFullUnder);
	toLocalStorage("bgmVolume", prefs.audio.bgmVolume);
	toLocalStorage("bgVoiceVolume", prefs.audio.bgVoiceVolume);
	toLocalStorage("bgSeVolume", prefs.audio.bgSeVolume);
	toLocalStorage("seVolume", prefs.audio.seVolume);
	toLocalStorage("voiceVolume", prefs.audio.voiceVolume);
	toLocalStorage("sceneAutoWaitVoice", prefs.scene.auto.waitVoice);
	toLocalStorage("sceneCutVoice", prefs.scene.cutVoice);
	toLocalStorage("copyText", prefs.scene.copyText);
	toLocalStorage("sceneAutoCPS", prefs.scene.auto.cps);
	toLocalStorage("sceneStartAuto", prefs.scene.auto.start);
	//toLocalStorage("cgViewRandom", prefs.cg.randomScene);
	toLocalStorage("cgViewShuffle", prefs.cg.shuffleScene);
	//toLocalStorage("cgViewRandomImg", prefs.cg.randomImg);
	toLocalStorage("cgViewSlideShow", prefs.cg.slideshow);
	toLocalStorage("cgViewSlideShowWait", prefs.cg.slideshowWait);

	//toLocalStorage("touchSupport", prefs.touch.on);

	//toLocalStorage("spineAnimation", prefs.spineAnimation.on);
	toLocalStorage("tlName", prefs.scene.tlName);
	toLocalStorage("playNext", prefs.scene.playNext);
	toLocalStorage("textStroke", prefs.scene.textStroke);

	toLocalStorage("cgFadeEffect", prefs.cg.fadeEffect);
	toLocalStorage("sceneFurigana", prefs.scene.furigana);
	toLocalStorage("stretchTABA", prefs.scene.stretchTABA);
	toLocalStorage("viewerScale", prefs.viewer.scale);
	toLocalStorage("fileLoaders", prefs.viewer.fileLoaders);
	toLocalStorage("loadingScreen", prefs.viewer.loadingScreen);
	toLocalStorage("pauseOnFocusLoss", prefs.viewer.pauseOnFocusLoss);
	toLocalStorage("playerName", prefs.viewer.playerName);

	toLocalStorage("animationSpeed", prefs.viewer.animationSpeed);
	toLocalStorage("iddisp", prefs.select.iddisp);

	toLocalStorage("nameBoxOpacity", prefs.scene.textBox.nameBoxOpacity);
	toLocalStorage("textBoxOpacity", prefs.scene.textBox.textBoxOpacity);
}

//Should only be called from an event listener, like "click"
//Populates the select item on "click" with the local fonts if permission is given, then shows the dropdown again if necessary
async function populateLocalFonts(selectElement, eventListener)
{
	//If the select element has already been populated with the local fonts, do nothing
	if(selectElement.populated) {
		return;
	}

	//If queryLocalFonts isn't implemented in the browser (currently only experimental in chrome), then do nothing
	if(!window.queryLocalFonts) {
		return;
	}

	//Set selectElement.awaiting to true while we wait for the await to return
	//incase this function gets called again before the previous await has returned
	if(!selectElement.awaiting) {
		selectElement.awaiting=true;
	}
	else {
		return;
	}

	//Requires permission from the user if using chrome, but not with NWJS
	let availableFonts=await window.queryLocalFonts().catch(function (error) {
		console.log("queryLocalFonts failed, reason: "+error);
	});

	//If the permission was denied or queryLocalFonts() failed it returns an empty array or undefined, so do nothing
	if(availableFonts===undefined || availableFonts.length===0) {
		selectElement.awaiting=false;
		return;
	}

	let options=[
		{
		  value: "Default",
			label: "Default"
		}
	];
	for(let fontData of availableFonts)
	{
		options.push({
			value: fontData.fullName,
			label: fontData.fullName
		});
		//console.log(fontData.postscriptName);
		//console.log(fontData.fullName);
		//console.log(fontData.family);
		//console.log(fontData.style);
	}

	//Replace all previous select options with the new ones
	selectElement.choicesInstance.setChoices(
		options,
		'value',
		'label',
		true,
	);

	selectElement.populated=true;
	//After populating the select, show the dropdown
	selectElement.choicesInstance.showDropdown();

	selectElement.awaiting=false;
}