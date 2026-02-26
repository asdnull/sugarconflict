//This file is shared by the create thumbnail nwjs script

//Called when the spine has successfully loaded, passing in the spine player as the first argument
//Put any modifications you need to do to the spines here
function modifySpine(player)
{
  //Set blendmode for all slots to 0, which is normal blending
  //Some scenes' slots have blendmode set to 2, which is 'Multiply', which causes incorrect rendering, so set it to 0 to fix it.
  //Maybe the rendering still isn't perfect in some cases, but it will have to do.
  //Blending controls how the slot attachment's pixels are combined with the pixels below
  //0: normal    //don't fix
  //1: additive  //don't fix
  //2: multiply  //fix
  //3: screen    //fix
  /*
  for(var i in player.skeleton.slots)
  {
    
    //if(player.skeleton.slots[i].data.blendMode===1)
    //{
    //	console.log("blendmode: additive");
    //}
    //else if(player.skeleton.slots[i].data.blendMode===2)
    //{
    //	console.log("blendmode: multiply");
    //}
    //else if(player.skeleton.slots[i].data.blendMode===3)
    //{
    //	console.log("blendmode: screen");
    //}
  }
  */
  


  let attachmentsNames=new Set();
  //attachmentsNames.add("M/MM");
  //attachmentsNames.add("SP/mmm");

  for(let j=0; j<player.skeleton.skin.attachments.length; j++)
  {
    let attachments=player.skeleton.skin.attachments[j];
    for(let k in attachments)
    {
      let attachment=attachments[k];
      if(attachmentsNames.has(attachment.path))
      {
        player.skeleton.skin.removeAttachment(j, attachment.name);
        player.skeleton.slots[j].setAttachment(null);
      }
    }
  }

  for(let i in player.skeleton.slots)
  {  
    /*
    if(player.skeleton.slots[i].data.blendMode!==0)
    {
      console.log(filename+" : "+i+" : "+player.skeleton.slots[i].data.name+" : "+player.skeleton.slots[i].data.blendMode);
    }
    */

    //Scene: 
    /*
    if(player.skeleton.slots[i].data.name==="Eff_Light_not_m")
    {
      player.skeleton.slots[i].data.blendMode=0;
    }
    else if(player.skeleton.slots[i].data.name==="Eff_shadow_not_m")
    {
      player.skeleton.slots[i].data.blendMode=0;
    }
    */
  }
}