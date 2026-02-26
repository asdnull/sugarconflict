//AudioGroup class
//Stores one or more audios and lets you do operations on them at the same time
//type: The type all audios in the group belong too
function AudioGroup(type)
{
  if(!new Set(["bgm", "bgVoice", "bgSe", "se", "voice", "backlogVoice"]).has(type)) {
    console.error("The audio group's type was not a valid value, was: "+type);
  }

  this.audios={};
  this.type=type;
}

AudioGroup.prototype.pauseAndAddAudio=async function(index, audioElement) {

  //If an audio already exist at this index, then pause it first and remove any delay timeout before throwing it away
  if(this.audios[index]!==undefined) {
    clearTimeout(this.audios[index].delay.timeoutID);
    clearInterval(this.audios[index].fadeOut.intervalID);
    clearInterval(this.audios[index].fadeIn.intervalID);
    this.audios[index].pause();
  }

  //Should be an audio element
  if(!audioElement instanceof HTMLAudioElement) {
    console.error("The audioElement added to the audio group was not a real HTMLAudioElement");
  }
  //'src' should already exist
  if(audioElement.src==="") {
    console.error("The audio element added to the audio group does not have a 'src' value");
  }

  //Add the already existing audio element (preferably should have already been preloaded)
	this.audios[index]=audioElement;
  this.audios[index].forcePause=false;
  this.audios[index].baseVolume=1.0;

  this.audios[index].delay={};
  this.audios[index].delay.timeoutID=null;
  this.audios[index].delay.duration=null;
  this.audios[index].delay.startTime=null;

  this.audios[index].fadeOut={};
  this.audios[index].fadeOut.intervalID=null;
  this.audios[index].fadeOut.duration=null;
  this.audios[index].fadeOut.startTime=null;
  this.audios[index].fadeOut.startVolume=null;

  this.audios[index].fadeIn={};
  this.audios[index].fadeIn.intervalID=null;
  this.audios[index].fadeIn.duration=null;
  this.audios[index].fadeIn.startTime=null;
  this.audios[index].fadeIn.startVolume=null;
};

AudioGroup.prototype.pauseAndSetAudio=async function(index, filepath) {

  //If an audio already exist at this index, then pause it first and remove any delay timeout before throwing it away
  if(this.audios[index]!==undefined) {
    clearTimeout(this.audios[index].delay.timeoutID);
    clearInterval(this.audios[index].fadeOut.intervalID);
    clearInterval(this.audios[index].fadeIn.intervalID);
    this.audios[index].pause();
  }

  //Create new audio and load the audio file asynchronously in: filepath
	this.audios[index]=new Audio();
  this.audios[index].src="";
  this.audios[index].forcePause=false;
  this.audios[index].baseVolume=1.0;

  this.audios[index].delay={};
  this.audios[index].delay.timeoutID=null;
  this.audios[index].delay.duration=null;
  this.audios[index].delay.startTime=null;

  this.audios[index].fadeOut={};
  this.audios[index].fadeOut.intervalID=null;
  this.audios[index].fadeOut.duration=null;
  this.audios[index].fadeOut.startTime=null;
  this.audios[index].fadeOut.startVolume=null;

  this.audios[index].fadeIn={};
  this.audios[index].fadeIn.intervalID=null;
  this.audios[index].fadeIn.duration=null;
  this.audios[index].fadeIn.startTime=null;
  this.audios[index].fadeIn.startVolume=null;
  
	try{
		await this.promiseFile(filepath, this.audios[index]);
	} catch(e){
		console.error("Audio Load Error for filepath: "+filepath);
	}
};

AudioGroup.prototype.pauseAndRemoveAudio=async function(index) {

  //If an audio already exist at this index, then pause it first and remove any delay timeout before throwing it away
  if(this.audios[index]!==undefined) {
    clearTimeout(this.audios[index].delay.timeoutID);
    clearInterval(this.audios[index].fadeOut.intervalID);
    clearInterval(this.audios[index].fadeIn.intervalID);
    this.audios[index].pause();
  }

	delete this.audios[index];
};


AudioGroup.prototype.promiseFile=function(filepath, audio) {

  return new Promise((resolve, reject) => {

    audio.oncanplaythrough = () => {
      return resolve();
    };
    audio.onerror = (e) => {
      //errorLoading(filepath);
      reject();
    };
    audio.src = filepath;
  });
};

//Set a delay for the audio specified in ms, so it only starts playing after that time
AudioGroup.prototype.setAudioDelay=function(index, delay) {

  if(this.audios[index]===undefined) {
    console.error("No audio exist in the audio group for index: "+index);
    return;
  }

  //If the delay isn't positive, don't set any delay
  if(delay<=0) {
    return;
  }

  //Save the time to delay to the audio
  this.audios[index].delay.duration=delay;
};

AudioGroup.prototype.playAudio=function(index, playForcePaused=false) {

  if(this.audios[index]===undefined) {
    console.error("No audio exist in the audio group for index: "+index);
    return;
  }

  if(playForcePaused && !this.audios[index].forcePause) {
    return;
  }
  this.audios[index].forcePause=false;

  //If a delay duration has been set, then delay the start to play
  if(this.audios[index].delay.duration!==null && this.audios[index].delay.duration>0)
  {
    //Save the time to delay to the audio + save the current time so we later can determine how long we currently have spent waiting
    this.audios[index].delay.startTime=Date.now();

    let that=this;
    this.audios[index].delay.timeoutID=setTimeout(function(){

      that.audios[index].delay.timeoutID=null;
      that.audios[index].delay.duration=null;
      that.audios[index].delay.startTime=null;

      that.audios[index].play().catch(() => console.log("Failed to play audio, this is probably normal"));
    }, this.audios[index].delay.duration);
  }
  //If a fade out duration has been set, then fade it out again
  else if(this.audios[index].fadeOut.duration!==null && this.audios[index].fadeOut.duration>0)
  {
    this.fadeOut(index, this.audios[index].fadeOut.duration, this.audios[index].fadeOut.startVolume);
  }
  //Otherwise play it immediately
  else
  {
    this.audios[index].play().catch(() => console.log("Failed to play audio, this is probably normal"));
  }
};

//Returns true if the audio was currently playing when it was paused (or waiting on a delay to play), false otherwise
AudioGroup.prototype.pauseAudio=function(index, forcePause=false) {

  if(this.audios[index]===undefined) {
    //console.error("No audio exist in the audio group for index: "+index);
    return;
  }

  let paused=false;

  //If the audio is currently waiting to be played, clear the current delay timeout and save the elapsed time spent waiting
  if(this.audios[index].delay.timeoutID!==null)
  {
    //The time that has elapsed since it started waiting
    let elapsedTime=Date.now()-this.audios[index].delay.startTime;
    //console.log("Elapsed time: "+elapsedTime)
    //Update the delay duration with the time remaining to wait (once the waiting resumes again when it gets unpaused)
    this.audios[index].delay.duration=this.audios[index].delay.duration-elapsedTime;
    this.audios[index].delay.startTime=null;
    //console.log("Delay duration left: "+this.audios[index].delayDuration)

    clearTimeout(this.audios[index].delay.timeoutID);
    this.audios[index].delay.timeoutID=null;

    paused=true;
    this.audios[index].forcePause=forcePause;
  }
  //If the audio is currently fading in/out, clear the fade interval and save the elapsed time spent fading
  else if(this.audios[index].fadeOut.intervalID!==null)
  {
    //The time that has elapsed since it started fading
    let elapsedTime=Date.now()-this.audios[index].fadeOut.startTime;
    //Update the fade duration with the time remaining to fade (once the waiting resumes again when it gets unpaused)
    this.audios[index].fadeOut.duration=this.audios[index].fadeOut.duration-elapsedTime;
    this.audios[index].fadeOut.startTime=null;

    clearInterval(this.audios[index].fadeOut.intervalID);
    this.audios[index].fadeOut.intervalID=null;

    paused=true;
    this.audios[index].forcePause=forcePause;
  }

  //Otherwise, if the audio is currently playing, set that it has been manually paused before it finished playing
  if(!this.audios[index].paused)
  {
    paused=true;
    this.audios[index].forcePause=forcePause;
    this.audios[index].pause();
  }
  
  return paused;
};

//Set the audio's base volume (0.0 - 1.0)
//Every volume change to the audio will be multiplied by it's base volume
AudioGroup.prototype.setBaseVolume=function(index, volume) {

  if(this.audios[index]===undefined) {
    console.error("No audio exist in the audio group for index: "+index);
    return;
  }
  this.audios[index].baseVolume=volume;
};

AudioGroup.prototype.setVolume=function(index, volume) {

  if(this.audios[index]===undefined) {
    //console.error("No audio exist in the audio group for index: "+index);
    return;
  }
  this.audios[index].volume=this.audios[index].baseVolume * volume;
};

AudioGroup.prototype.setLoop=function(index, loop) {

  if(this.audios[index]===undefined) {
    console.error("No audio exist in the audio group for index: "+index);
    return;
  }
  this.audios[index].loop=loop;
};

AudioGroup.prototype.playAllAudio=function() {

  for(let index in this.audios)
  {
    if(Object.hasOwn(this.audios, index))
    {
      this.playAudio(index);
    }
  }  
};

//Returns true if any audio was paused while it was currently playing, false otherwise
AudioGroup.prototype.pauseAllAudio=function() {

  let anyAudioWasPaused=false;
  for(let index in this.audios)
  {
    if(Object.hasOwn(this.audios, index))
    {
      if(this.pauseAudio(index)) {
        anyAudioWasPaused=true;
      }
    }
  }

  return anyAudioWasPaused;
};

//Set the audio's current time to the value of: currentTime (seeking the audio to the new time)
AudioGroup.prototype.seekAudio=function(index, seekTime) {

  if(this.audios[index]===undefined) {
    console.error("No audio exist in the audio group for index: "+index);
    return;
  }
  this.audios[index].currentTime=seekTime;
};


AudioGroup.prototype.seekAllAudio=function(seekTime) {

  for(let index in this.audios)
  {
    if(Object.hasOwn(this.audios, index))
    {
      this.seekAudio(index, seekTime);
    }
  }
};

AudioGroup.prototype.setVolumeAllAudio=function(volume) {

  for(let index in this.audios)
  {
    if(Object.hasOwn(this.audios, index))
    {
      this.setVolume(index, volume);
    }
  }
};

AudioGroup.prototype.pauseAllRemoveAllAudio=function() {

  this.pauseAllAudio();
  this.audios={};
};

//Returns true if any audio was paused while it was currently playing, false otherwise
AudioGroup.prototype.forcePauseAllAudio=function() {

  let anyAudioWasPaused=false;
  for(let index in this.audios)
  {
    if(Object.hasOwn(this.audios, index))
    {
      if(this.pauseAudio(index, true)) {
        anyAudioWasPaused=true;
      }
    }
  }

  return anyAudioWasPaused;
};

//Play all audio that was paused before it finished playing
AudioGroup.prototype.playAllForcePausedAudio=function() {

  for(let index in this.audios)
  {
    if(Object.hasOwn(this.audios, index))
    {
      this.playAudio(index, true);
    }
  }  
};

//Get the index of the audio that has the longest duration of a single audio out of all the audios in the audio group
AudioGroup.prototype.getIndexOfAudioWithLongestDuration=function() {

  let longestDuration=0;
  let audioIndex=null;

  for(let index in this.audios)
  {
    if(Object.hasOwn(this.audios, index))
    {
      if(!Number.isNaN(this.audios[index].duration) && (this.audios[index].duration > longestDuration))
      {
        longestDuration=this.audios[index].duration;
        audioIndex=index;
      }
    }
  }

  return audioIndex;
};

//Fade out to silence
//duration: Fade out over X ms
AudioGroup.prototype.fadeOut=function(index, duration, startVolume=1.0) {

  if(this.audios[index]===undefined) {
    //console.error("No audio exist in the audio group for index: "+index);
    return;
  }

  //Duration cannot be 0 or less
  if(duration <= 0) {
    console.error("Duration was 0 or less in the audio group for index: "+index);
    return;
  }

  //Save the current time in ms so we later can determine how long
  let currentAudio=this.audios[index];
  currentAudio.fadeOut.startVolume=startVolume;
  currentAudio.fadeOut.duration=duration;
  currentAudio.fadeOut.startTime=Date.now();

  currentAudio.play().catch(() => console.log("Failed to play audio, this is probably normal"));

  var that=this;

  currentAudio.fadeOut.intervalID=setInterval(function(){

    let elapsedTime=Date.now()-currentAudio.fadeOut.startTime;
    let newVolume=(1.0-(elapsedTime/currentAudio.fadeOut.duration))*startVolume;
    currentAudio.fadeOut.startVolume=newVolume;

    if(newVolume <= 0.0)
    {
      currentAudio.fadeOut.startVolume=null;
      currentAudio.fadeOut.duration=null;

      that.setVolume(index, 0);
      currentAudio.pause();

      clearInterval(currentAudio.fadeOut.intervalID);
      currentAudio.fadeOut.intervalID=null;

      //If a delay was set but hasn't occured yet, cancel it
      if(currentAudio.delay.timeoutID!==null)
      {
        clearTimeout(currentAudio.delay.timeoutID);
        currentAudio.delay.timeoutID=null;
        currentAudio.delay.duration=null;
        currentAudio.delay.startTime=null;
      }
    }
    else
    {
      //console.log("Fading out, current time spent: "+elapsedTime+", volume multiplier: "+newVolume);
      that.setVolume(index, (prefs.audio[that.type+"Volume"] / 100) * newVolume);
    }
  }, 33);

};

//fadeIn() is untested, but probably works
//Fade in to full volume
//duration: Fade in over X ms
AudioGroup.prototype.fadeIn=function(index, duration, startVolume=0.0) {

  if(this.audios[index]===undefined) {
    //console.error("No audio exist in the audio group for index: "+index);
    return;
  }

  //Duration cannot be 0 or less
  if(duration <= 0) {
    console.error("Duration was 0 or less in the audio group for index: "+index);
    return;
  }

  //Save the current time in ms so we later can determine how long
  let currentAudio=this.audios[index];
  currentAudio.fadeIn.startVolume=startVolume;
  currentAudio.fadeIn.duration=duration;
  currentAudio.fadeIn.startTime=Date.now();
  //console.log("Total fade in duration: "+currentAudio.fadeIn.duration);

  //Play audio
  currentAudio.volume=startVolume;
  currentAudio.play().catch(() => console.log("Failed to play audio, this is probably normal"));

  var that=this;

  currentAudio.fadeIn.intervalID=setInterval(function(){

    let elapsedTime=Date.now()-currentAudio.fadeIn.startTime;
    let newVolume=startVolume+((elapsedTime/currentAudio.fadeIn.duration)*startVolume);
    currentAudio.fadeIn.startVolume=newVolume;

    if(newVolume >= 1.0)
    {
      //console.log("Fade in Done");
      currentAudio.fadeIn.startVolume=null;
      currentAudio.fadeIn.duration=null;

      that.setVolume(index, prefs.audio[that.type+"Volume"] / 100);

      clearInterval(currentAudio.fadeIn.intervalID);
      currentAudio.fadeIn.intervalID=null;
    }
    else
    {
      //console.log("Fading in, current time spent: "+elapsedTime+", volume multiplier: "+newVolume);
      that.setVolume(index, (prefs.audio[that.type+"Volume"] / 100) * newVolume);
    }
  }, 33);

};
