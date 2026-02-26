var sceneSelect = {
	page:0,
	cursor:0
}

function constructSceneSelect(){
	calculateCGSize();
	createSelections();
	fillSelections();
	setPageNumber();
	displayCursor();
}

function calculateCGSize()
{
	// The images are 4:3 without the black bars
	// 938 is the usable width we have
	// 702 is the usable height we have
	//
	// spacing = (((w/h) / 10) | 0) * 2;
	// 10 is just a number I chose and fit.
	// 2 is because we need to account for 2 cgs being next to eachother
	//
	// We could just do repeat(--columns, 1fr), repeat(--rows, 1fr)
	// but that would ruin the AR and I'm autistic.

	let baseWidth=1258;
	let baseHeight=702;
	
	/*
	let baseWidth=config.scene.width;
	let baseHeight=config.scene.height;
	*/

	/*
	let ARx = 4;
	let ARy = 3;
	*/
	/*
	let ARx = 16;
	let ARy = 9;
	*/

	let AR=null;
	//If the aspect ratio isn't set in the config, calculate it
	if((config.scene.arX===undefined) || (config.scene.arY===undefined))
	{
		AR=calculateAR(config.scene.width, config.scene.height);
	}
	else
	{
		AR={
			x: config.scene.arX,
			y: config.scene.arY
		};
	}
	
	let ARx = AR.x;
	let ARy = AR.y;

	let width = baseWidth / prefs.select.columns;
	let height = baseHeight / prefs.select.rows;
	let spacing = 1;
	if(width / ARx > height / ARy)
	{
		// Height has the highest ratio so base CGs off of that
		spacing = ((height / 10) | 0) * 2;
		height = (baseHeight - (spacing * (prefs.select.rows - 1))) / prefs.select.rows;
		//width = (4/3) * height;
		width = (ARx/ARy) * height;
	}
	else if(width / ARx < height / ARy)
	{
		// Width has the highest ratio so base the CGs off of that.
		spacing = ((width / 10) | 0) * 2;
		width = (baseWidth - (spacing * (prefs.select.columns - 1))) / prefs.select.columns;
		//height = (3/4) * width;
		height = (ARy/ARx) * width;
	}
	else
	{
		console.log("Something broke in calculateCGSize()");
		// Fall back to width because something broke or everythings equal
		spacing = ((width / 10) | 0) * 2;
		width = (938 - (spacing * (prefs.select.columns - 1))) / prefs.select.columns;
		height = (3/4) * width;
	}
	
	document.documentElement.style.setProperty("--cg-width", width + "px");
	document.documentElement.style.setProperty("--cg-height", height + "px");
	document.documentElement.style.setProperty("--cg-spacing", spacing + "px");
	document.documentElement.style.setProperty("--cg-columns", prefs.select.columns);
	document.documentElement.style.setProperty("--cg-rows", prefs.select.rows);
}

function createSelections(){
	let cgAmount = 0;
	if((prefs.select.rows * prefs.select.columns) * (sceneSelect.page + 1) > main.sceneList.length){
		//Reached the last page, cut off any excess elements.
		cgAmount = main.sceneList.length - (prefs.select.rows * prefs.select.columns) * (sceneSelect.page);
	} else {
		cgAmount = prefs.select.rows * prefs.select.columns;
	}
	killChildren(main.elements.cgWrapper);
	for(let i = 0; i < cgAmount; i++){
		let cgContainer = document.createElement("div");
		let faveInd = document.createElement("div");
		cgContainer.className = "cg-container";
		faveInd.className = "cg-fave-ind";

		main.elements.cgWrapper.appendChild(cgContainer);
		cgContainer.appendChild(faveInd);
	}
}

function fillSelections()
{
	sceneSelect.paths = new Set();
	for(let i = 0; i < main.elements.cgWrapper.children.length; i++)
	{
		let cgIdx = i + (sceneSelect.page * (prefs.select.rows * prefs.select.columns));
		let curWrapper = main.elements.cgWrapper.children[i];
		let fillScene = main.sceneList[cgIdx];

		//Since pairList isn't used anymore, this gets simplified
		let file = constructThumbnailPath(sceneData[fillScene].SCRIPTS.PART1.THUMBNAIL, fillScene);
		sceneSelect.paths.add({elem:curWrapper,path:file});
	
		let iddisp = document.createElement("div");
		iddisp.innerHTML = fillScene;
		iddisp.classList = "cg-id text-stroke"
		if(prefs.select.iddisp){
			iddisp.style.visibility = "visible";
		}
		curWrapper.appendChild(iddisp);
		
		curWrapper.setAttribute("sceneId", fillScene);
		if(sceneData[fillScene].favourite){
			curWrapper.getElementsByClassName("cg-fave-ind")[0].style.visibility = "visible";
		}
	}
	sceneSelect.iter = sceneSelect.paths.values();
	fileLoader(drawSelection);
}

function drawSelection(){
	let obj = sceneSelect.iter.next().value;
	if(obj == null || obj == undefined){
        return;
    }
    if(obj.path.split(".").slice(-1)[0] == "webm"){
    	let vid = document.createElement("video");
		vid.addEventListener("canplay", function(){
			vid.classList = "cg-video";
			obj.elem.appendChild(vid)
			drawSelection();
		}, {once:true});
		vid.addEventListener("error", function(){
			drawSelection();
		}, {once:true})
		vid.src = obj.path;
    } else {
    	let img = new Image();
		img.addEventListener("load", function(){
			obj.elem.style.backgroundImage = "url('" + obj.path + "')";
			drawSelection();
		}, {once:true});
		img.addEventListener("error", function(){
			drawSelection();
		}, {once:true})
		img.src = obj.path;
    }
    
    
}

function nextPage()
{
	if(sceneSelect.page >= Math.floor((main.sceneList.length - 1) / (prefs.select.rows * prefs.select.columns))){
		sceneSelect.page = 0;
	}

	else {
		sceneSelect.page++;
	}
	constructSceneSelect();
}

function prevPage()
{
	//If the sceneList is empty, say if you are filtering favourites but you have none
	if(main.sceneList.length === 0) {
		sceneSelect.page = 0;
	}
	else if(sceneSelect.page <= 0) {
		sceneSelect.page = Math.floor((main.sceneList.length - 1) / (prefs.select.rows * prefs.select.columns))
	} else {
		sceneSelect.page--;
	}
	constructSceneSelect();
}

function setPageNumber()
{
	//If we are filtering favourites, and you have none, then the sceneList will now be empty, so set the "number of pages" to 0 in both
	if(main.sceneList.length > 0)
	{
		main.elements.pageNumber.value = (sceneSelect.page + 1) + "/" + (Math.floor((main.sceneList.length - 1) / (prefs.select.rows * prefs.select.columns)) + 1);
	}
	else
	{
		main.elements.pageNumber.value = "0/0";
	}
}

function displayCursor()
{
	//If you for example filter favourites, and you have none, then: main.elements.cgWrapper will not have any children, so in that case do nothing
	if(main.elements.cgWrapper.children.length > 0)
	{
		if(sceneSelect.cursor >= main.elements.cgWrapper.children.length){
			sceneSelect.cursor = main.elements.cgWrapper.children.length - 1;
		}
		addCursorEffect();
	}
}

function addCursorEffect(){
	main.elements.cgWrapper.children[sceneSelect.cursor].classList.add("cursor-active");
}

function removeCursorEffect(){
	main.elements.cgWrapper.children[sceneSelect.cursor].classList.remove("cursor-active");
}

//Get the smallest fraction possible between partX and partY
function getSmallestFraction(partX, partY)
{
	let AR={
		x: 1,
		y: 1
	};

	if(partX===partY)
	{
		return AR;
	}

	let primeNumbers=[2, 3, 5, 7, 9, 11, 13, 17, 19, 23, 29];

	let currentX=partX;
	let currentY=partY;
	let currentIndex=0;

	while(true)
	{
		if(currentIndex >= primeNumbers.length)
		{
			console.error("Error, could not find the AR for the specified width and height");
			break;
		}
		else if((primeNumbers[currentIndex] > currentX) || (primeNumbers[currentIndex] > currentY))
		{
			AR.x=currentX;
			AR.y=currentY;

			return AR;
		}
		else if((Number.isInteger(currentX / primeNumbers[currentIndex])) && (Number.isInteger(currentY / primeNumbers[currentIndex])))
		{
			currentX=currentX / primeNumbers[currentIndex];
			currentY=currentY / primeNumbers[currentIndex];

			currentIndex=0;
		}
		else
		{
			currentIndex++;
		}
	}
}

//Get the aspect ratio of the image based on width and height, ex: 16:9 or 4:3
function calculateAR(width, height)
{
	let partX=null;
	let partY=null;

	if(height===width)
	{
		partX=1;
		partY=1;
	}
	else if(height>width)
	{
		let div=width/height;
		//Convert the decimal number to a fraction
		let decimals=div.toString().split(".")[1];
		partX=Number(decimals);
		partY=10**decimals.length;	
	}
	else
	{
		let div=height/width;
		//Convert the decimal number to a fraction
		let decimals=div.toString().split(".")[1];
		partY=Number(decimals);
		partX=10**decimals.length;	
	}
	
	//Simplify the fraction as much as possible
	return getSmallestFraction(partX, partY);
}
