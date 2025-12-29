// IMPORTERA BASDOCKOR
//import dollDarkUpper from '../assets/character/character-dark-upperbody.png';
import dollDarkUpper from '../assets/character/Character-upper-body.png';
import dollDarkLower from '../assets/character/Character-lower-body.png';
import dollLightUpper from '../assets/character/Light-doll-upper-body.png';
import dollLightLower from '../assets/character/Light-doll-lower-body.png';

// IMPORTERA KLÄDER 
import top1dark from '../assets/darkskin/top/Beige-Blazer-Red-Top.png';
import top2dark from '../assets/darkskin/top/Blue-Blazer-Beige-Top.png';
import top3dark from '../assets/darkskin/top/Beige-cardigan.png';
import top4dark from '../assets/darkskin/top/Beige-Top.png';
import top5dark from '../assets/darkskin/top/Black-Top.png';
import top6dark from '../assets/darkskin/top/Blue-Top.png';
import top7dark from '../assets/darkskin/top/Red-Top.png';
import bottom1dark from '../assets/darkskin/bottom/Black-SuitPants.png';
import bottom2dark from '../assets/darkskin/bottom/Brown-SuitPants.png';
import bottom3dark from '../assets/darkskin/bottom/Green-SuitPants.png';
import bottom4dark from '../assets/darkskin/bottom/Beige-Skirt.png';
import bottom5dark from '../assets/darkskin/bottom/Beige-skirt-belt.png';



import top1light from '../assets/lightskin/top/Beige-Blazer-Red-Top.png';
import top2light from '../assets/lightskin/top/Blue-Blazer-Beige-Top.png';
import top3light from '../assets/lightskin/top/Beige-Cardigan.png';
import top4light from '../assets/lightskin/top/Beige-Top.png';
import top5light from '../assets/lightskin/top/Black-Top.png';
import top6light from '../assets/lightskin/top/Blue-Top.png';
import top7light from '../assets/lightskin/top/Red-Top.png';
import bottom1light from '../assets/lightskin/bottom/Black-SuitPants.png';
import bottom2light from '../assets/lightskin/bottom/Brown-SuitPants.png';
import bottom3light from '../assets/lightskin/bottom/Green-SuitPants.png';
import bottom4light from '../assets/lightskin/bottom/Beige-Skirt.png';
import bottom5light from '../assets/lightskin/bottom/Beige-skirt-belt.png';
import bottom6light from '../assets/lightskin/bottom/Black-Pants.png';


const TOPSDARK = [
    {
        id: 'Upper-Body-Dark',
        name: 'Upper body',
        image: dollDarkUpper
    },
    {
        id: 'top-1dark',
        name: 'Beige blazer and red top',
        image: top1dark
    },
    {
        id: 'top-2dark',
        name: 'Blue blazer beige top',
        image: top2dark
    },
    {
        id: 'top-3dark',
        name: 'Beige cardigan',
        image: top3dark
    },
    {
        id: 'top-4dark',
        name: 'Beige top',
        image: top4dark
    },
    {
        id: 'top-5dark',
        name: 'Black top',
        image: top5dark
    },
    {
        id: 'top-6dark',
        name: 'Blue top',
        image: top6dark
    },
    {
        id: 'top-7dark',
        name: 'Red top',
        image: top7dark
    },

]

const BOTTOMSDARK = [
    {
        id: 'Lower-Body-Dark',
        name: 'Lower body',
        image: dollDarkLower
    },
    {
        id: 'bottom-1dark',
        name: 'Black suit pants wide',
        image: bottom1dark
    },
    {
        id: 'bottom-2dark',
        name: 'Brown suit pants',
        image: bottom2dark
    },
    {
        id: 'bottom-3dark',
        name: 'Green suit pants',
        image: bottom3dark
    },
    {
        id: 'bottom-4dark',
        name: 'Beige skirt',
        image: bottom4dark
    },
    {
        id: 'bottom-5dark',
        name: 'Beige skirt with belt ',
        image: bottom5dark
    },
]


const TOPSLIGHT = [
    {
        id: 'Upper-Body-Light',
        name: 'Upper body',
        image: dollLightUpper
    },
    {
        id: 'top-1light',
        name: 'Beige blazer and red top',
        image: top1light
    },
    {
        id: 'top-2light',
        name: 'Blue blazer beige top',
        image: top2light
    },
    {
        id: 'top-3light',
        name: 'Beige cardigan',
        image: top3light
    },
    {
        id: 'top-4light',
        name: 'Beige top',
        image: top4light
    },
    {
        id: 'top-5light',
        name: 'Black top',
        image: top5light
    },
    {
        id: 'top-6light',
        name: 'Blue top',
        image: top6light
    },
    {
        id: 'top-7light',
        name: 'Red top',
        image: top7light
    },
]

const BOTTOMSLIGHT = [
    {
        id: 'Lower-Body-Light',
        name: 'Lower body',
        image: dollLightLower
    },
    {
        id: 'bottom-1light',
        name: 'Black suit pants wide',
        image: bottom1light
    },
    {
        id: 'bottom-2light',
        name: 'Brown suit pants',
        image: bottom2light
    },
    {
        id: 'bottom-3light',
        name: 'Green suit pants',
        image: bottom3light
    },
    {
        id: 'bottom-4light',
        name: 'Beige skirt',
        image: bottom4light
    },
    {
        id: 'bottom-5light',
        name: 'Beige skirt with belt',
        image: bottom5light
    },
    {
        id: 'bottom-6light',
        name: 'Black suit pants',
        image: bottom6light
    },
    
]

export const tops = { dark: TOPSDARK, light: TOPSLIGHT };
export const bottoms = { dark: BOTTOMSDARK, light: BOTTOMSLIGHT };

// Exportera datat i en struktur som är enkel att använda i App/GamePage
export function fetchClothingData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        tops: { dark: TOPSDARK, light: TOPSLIGHT },
        bottoms: { dark: BOTTOMSDARK, light: BOTTOMSLIGHT },
      });
    }, 500);
  });
};
