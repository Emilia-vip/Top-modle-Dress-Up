// IMPORTERA BASDOCKOR
import dollDark from '../assets/character/character-dark.png';
import dollLight from '../assets/character/character-light.png';

// IMPORTERA KLÄDER 
import top1dark from '../assets/darkskin/top/beige-troja.png';
import top2dark from '../assets/darkskin/top/blueS-shirt.png';
import top3dark from '../assets/darkskin/top/pink-t-shirt.png';
import top4dark from '../assets/darkskin/top/stickad-tröjabeige.png';
import bottom1dark from '../assets/darkskin/bottom/black-pants&Shoes.png';
import bottom2dark from '../assets/darkskin/bottom/dark-jeans.png';
import bottom3dark from '../assets/darkskin/bottom/jeans-beige-shoes.png';
import bottom4dark from '../assets/darkskin/bottom/jeans-white-shoes.png';


import top1light from '../assets//lightskin/top/beige-crop-top.png';
import top2light from '../assets/lightskin/top/beige-sweatshirt.png';
import top3light from '../assets/lightskin/top/blue-skirt.png';
import top4light from '../assets/lightskin/top/pink-t-shirt.png';
import bottom1light from '../assets/lightskin/bottom/black-pants.png';
import bottom2light from '../assets/lightskin/bottom/dark-bootcut-jeans.png';
import bottom3light from '../assets/lightskin/bottom/jeans.png';
import bottom4light from '../assets/lightskin/bottom/jenas-blue.png';


const DOLLS = {
    dark: dollDark,
    light: dollLight
};


const TOPSDARK = [
    {
        id: 'top-1dark',
        name: 'beige shirt',
        image: top1dark
    },
    {
        id: 'top-2dark',
        name: 'blue shirt',
        image: top2dark
    },
    {
        id: 'top-3dark',
        name: 'pink t-shirt',
        image: top3dark
    },
    {
        id: 'top-4dark',
        name: 'beige knitted shirt',
        image: top4dark
    },

]

const BOTTOMSDARK = [
    {
        id: 'bottom-1dark',
        name: 'black pants',
        image: bottom1dark
    },
    {
        id: 'bottom-2dark',
        name: 'dark jeans',
        image: bottom2dark
    },
    {
        id: 'bottom-3dark',
        name: 'jenas ',
        image: bottom3dark
    },
    {
        id: 'bottom-4dark',
        name: 'jeans w shoes',
        image: bottom4dark
    },
]


const TOPSLIGHT = [
    {
        id: 'top-1light',
        name: 'crop top beige',
        image: top1light
    },
    {
        id: 'top-2light',
        name: 'swetshirt beige',
        image: top2light
    },
    {
        id: 'top-3light',
        name: 'shirt blue',
        image: top3light
    },
    {
        id: 'top-4light',
        name: 't-shirt pink',
        image: top4light
    },
]

const BOTTOMSLIGHT = [
    {
        id: 'bottom-1light',
        name: 'black pants',
        image: bottom1light
    },
    {
        id: 'bottom-2light',
        name: 'jenas bootcut dark',
        image: bottom2light
    },
    {
        id: 'bottom-3light',
        name: 'light jeans',
        image: bottom3light
    },
    {
        id: 'bottom-4light',
        name: 'jeans blue',
        image: bottom4light
    },
    
]
export const dolls = DOLLS;
export const tops = { dark: TOPSDARK, light: TOPSLIGHT };
export const bottoms = { dark: BOTTOMSDARK, light: BOTTOMSLIGHT };

// Exportera datat i en struktur som är enkel att använda i App/GamePage
export function fetchClothingData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        dolls: DOLLS,
        tops: { dark: TOPSDARK, light: TOPSLIGHT },
        bottoms: { dark: BOTTOMSDARK, light: BOTTOMSLIGHT },
      });
    }, 500);
  });
}


export default fetchClothingData;