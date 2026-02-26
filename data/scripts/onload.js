
//Check if running with NWJS
if(window.nw !== undefined)
{
  //Maximize the window on startup
  let win = nw.Window.get();
  win.maximize();
}

window.onload = function() {

	window.onfocus = function() {
		if(!prefs.viewer.pauseOnFocusLoss){
			return;
		}

		pauseAudio(false);
		//If we are already in the options/controls or search screen, then the viewer is already paused so only pause audio
		if((main.view.current === OPTIONS_SCREEN) || (main.view.current === SEARCH_SCREEN)) {
			return;
		}		
		pauseViewer(false);
	};
	
	window.onblur = function() {
		/*
		main.pause.auto = false;
		main.pause.slideshow = false;
		main.pause.voice = false;
		main.pause.bgVoice = false;
		main.pause.bgSe = false;
		main.pause.bgm = false;
		main.pause.se = false;
		*/
		if(!prefs.viewer.pauseOnFocusLoss){
			return;
		}

		pauseAudio(true);
		//If we are already in the options/controls or search screen, then the viewer is already paused so only pause audio
		if((main.view.current === OPTIONS_SCREEN) || (main.view.current === SEARCH_SCREEN)) {
			return;
		}		
		pauseViewer(true);
	};

	//Output version number of viewer and it's release date
	console.log(config.release.name+" "+config.release.version+" - Release date: "+config.release.date);
	//console.log("DPI: "+window.devicePixelRatio);

	main.data.H_RPGX = true;

	main.elements.loadingWrap = document.getElementById("loading-wrap");
	main.elements.loadingBar = document.getElementById("loading-bar");
	main.elements.loadingFile = document.getElementById("loading-file");
	main.elements.loadingProgress = document.getElementById("loading-progress");
	main.elements.loadingError = document.getElementById("loading-error");
	main.elements.loadingErrorMsg = document.getElementById("loading-error-msg");
  main.elements.loadingErrorBtn = document.getElementById("loading-error-btn");
  
	main.elements.html = document.getElementsByTagName("html")[0];
	main.elements.viewer = document.getElementById("scene-viewer");
	main.elements.sceneSelect = document.getElementById("scene-select");
	main.elements.storySelect = document.getElementById("story-select");
	main.elements.cgWrapper = document.getElementById("cg-wrapper");
	main.elements.searchMenu = document.getElementById("search");
	main.elements.controlsMenu = document.getElementById("controls");
	main.elements.pageNumber = document.getElementById("page-number");
	main.elements.tlChoiceBox = document.getElementById("tl-choice-box");
	main.elements.canvasHoldElem = document.getElementById("canvas-hold");
	main.elements.actorCanvasHoldElem = document.getElementById("actor-canvas-hold");
	
	main.elements.spineViewersHoldElem = document.getElementById("spine-viewers-hold");
	main.elements.contents = document.getElementById("content");
	main.elements.header = document.getElementById("header");
	main.elements.footer = document.getElementById("footer");
	main.elements.head.controls = document.getElementById("controls-screen-btn");
	main.elements.head.options = document.getElementById("options-screen-btn");
	main.elements.head.search = document.getElementById("search-screen-btn");

	main.elements.head.prevPage = document.getElementById("prev-page");
	main.elements.head.nextPage = document.getElementById("next-page");
	main.elements.head.favourites = document.getElementById("favourites-toggle-btn");
  
	main.elements.foot.exit = document.getElementById("exit-btn");
	main.elements.foot.skip = document.getElementById("skip-btn");
	main.elements.foot.auto = document.getElementById("auto-btn");
  main.elements.foot.mode = document.getElementById("mode-btn");
  
	main.elements.alertBox = document.getElementById("alert-box");
	main.elements.alertMsg = document.getElementById("alert-msg");
	main.elements.alertOpts = document.getElementById("alert-opts");
	main.elements.tlNotice = document.getElementById("tl-mode-notice");
	//hideScrollBars();

  /*
	main.elements.viewer.addEventListener("transitionend", function(){
		if(main.elements.viewer.style.opacity < 1){
			main.elements.viewer.style.zIndex = "0";
		}
  }, true);
  */

  /*
  main.view=new Proxy(main.view, {

    get(target, prop, receiver) {
      console.log("Getting property: "+prop+" with value: "+target[prop]);
      return Reflect.get(...arguments);
    },
    set(obj, prop, value) {
      console.log("Setting property: "+prop+" with value: "+value);
      return Reflect.set(...arguments);
    }
  });
  */

	killChildren(main.elements.viewer);
	//checkData();
	initPreferences();
	initMeta();
	//initFiles();
	initUserInput();
	//mergeSceneData();
  initSearch();
  fillSceneList();
  constructSceneSelect();
  /*
	if(main.data.H_RPGX){
		fillSceneList();
		constructSceneSelect();
  }
  */
  /*
	if(main.data.STORY_RPGX){
		initStorySelect();
  }
  */
	initPreload();
	initTlTools();
	//createAutocompleteData();
  //setScreen();
  //loadSceneSelect();
	//switchView();
  checkScriptRecovery();

  //Preload all fonts defined in: config.preload.perm.fonts, may be 0 or more
  //As such custom fonts should not be defined in CSS @font-face rules in style.css anymore, but in config.js: config.preload.perm.fonts array
  //Calls: callback() when done preloading
  preloadFonts(function callback(){

    //Preloads the permanent files asynchronously
    //Calls: cleanupPreload() when done which sets the element "loading-wrap" style's "visibility" to "hidden"
    //Click events pass though an element with visibility hidden,
    //so this makes the underlying element "scene-select" interactable, enabling you to choose a scene
    let permPreloadUI=Array.from(config.preload.perm.images);
    for(let i = 0; i < permPreloadUI.length; i++){
      permPreloadUI[i] = "./data/ui/" + permPreloadUI[i] + "." + config.format.image.ui;
    }
    permPreload(permPreloadUI);
  });
};