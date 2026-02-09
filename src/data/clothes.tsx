// IMPORTERA BASDOCKOR
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
import top3light from '../assets/lightskin/top/Beige-cardigan.png';
import top4light from '../assets/lightskin/top/Beige-Top.png';
import top5light from '../assets/lightskin/top/Black-Top.png';
import top6light from '../assets/lightskin/top/Blue-Top.png';
import top7light from '../assets/lightskin/top/Red-Top.png';
import bottom1light from '../assets/lightskin/bottom/black-pants.png';
import bottom2light from '../assets/lightskin/bottom/Brown-SuitPants.png';
import bottom3light from '../assets/lightskin/bottom/Green-SuitPants.png';
import bottom4light from '../assets/lightskin/bottom/beige-skirt.png';
import bottom5light from '../assets/lightskin/bottom/Beige-skirt-belt.png';
import bottom6light from '../assets/lightskin/bottom/Black-Pants.png';


const TOPSDARK = [
    {
        id: 'Upper-Body-Dark',
        name: 'Upper body',
        image: dollDarkUpper
    },
    {
        id: 'Top1Dark',
        name: 'Beige blazer and red top',
        image: top1dark
    },
    {
        id: 'Top2Dark',
        name: 'Blue blazer beige top',
        image: top2dark
    },
    {
        id: 'Top3Dark',
        name: 'Beige cardigan',
        image: top3dark
    },
    {
        id: 'Top4Dark',
        name: 'Beige top',
        image: top4dark
    },
    {
        id: 'Top5Dark',
        name: 'Black top',
        image: top5dark
    },
    {
        id: 'Top6Dark',
        name: 'Blue top',
        image: top6dark
    },
    {
        id: 'Top7Dark',
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
        id: 'Bottom1Dark',
        name: 'Black suit pants wide',
        image: bottom1dark
    },
    {
        id: 'Bottom2Dark',
        name: 'Brown suit pants',
        image: bottom2dark
    },
    {
        id: 'Bottom3Dark',
        name: 'Green suit pants',
        image: bottom3dark
    },
    {
        id: 'Bottom4Dark',
        name: 'Beige skirt',
        image: bottom4dark
    },
    {
        id: 'Bottom5Dark',
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
        id: 'Top1Light',
        name: 'Beige blazer and red top',
        image: top1light
    },
    {
        id: 'Top2Light',
        name: 'Blue blazer beige top',
        image: top2light
    },
    {
        id: 'Top3Light',
        name: 'Beige cardigan',
        image: top3light
    },
    {
        id: 'Top4Light',
        name: 'Beige top',
        image: top4light
    },
    {
        id: 'Top5Light',
        name: 'Black top',
        image: top5light
    },
    {
        id: 'Top6Light',
        name: 'Black top',
        image: top6light
    },
    {
        id: 'Top7Light',
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
        id: 'Bottom1Light',
        name: 'Black suit pants wide',
        image: bottom1light
    },
    {
        id: 'Bottom2Light',
        name: 'Brown suit pants',
        image: bottom2light
    },
    {
        id: 'Bottom3Light',
        name: 'Green suit pants',
        image: bottom3light
    },
    {
        id: 'Bottom3Light',
        name: 'Beige skirt',
        image: bottom4light
    },
    {
        id: 'Bottom4Light',
        name: 'Beige skirt with belt',
        image: bottom5light
    },
    {
        id: 'Bottom5Light',
        name: 'Black suit pants',
        image: bottom6light
    },
    
]

export const tops = { dark: TOPSDARK, light: TOPSLIGHT };
export const bottoms = { dark: BOTTOMSDARK, light: BOTTOMSLIGHT };


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
