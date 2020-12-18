import * as chroma from 'chroma.ts';
import * as tome from 'chromotome';
// import { params } from './params';


export function setupColorMachine(paletteName){
    var color_palettes = {};
    let chromotome_palettes = tome.getAll();
    for (let i = 0; i < chromotome_palettes.length; i++) {
      let key = chromotome_palettes[i].name;
      color_palettes[key] = new Object(chromotome_palettes[i].colors);
    }
    color_palettes = { ...color_palettes, ...chroma.brewer };
    // console.log('chroma.brewer',chroma.brewer)
    if(Array.isArray(paletteName)){
      return chroma.scale(paletteName);
    }else{
      if(paletteName in color_palettes)
        return chroma.scale(color_palettes[paletteName]);
      else
        return chroma.scale(['black','white']);
    }
}
