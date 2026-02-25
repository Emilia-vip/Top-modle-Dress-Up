//brevbärare som är bra på att hämta info från servern  
import axios from "axios";

//programmet startar 
 function StartupRoutine() {
  //vi skapar en tom låda 
   async function Test() {}
   //ropar på den tomma lådan  
   Test();

   axios
   //vi säger till axios gå till huset Hej
   //vem //vart 
     .get("http://hej.com")
     //Här använder vi promises. Det fungerar som en kö
     //vad 
     .then((response) => {
      //om brevbäraren kommer med paketet ropa u detta i loggen
       console.log("Här är then");
     })
     //när axios är klar med den första springrundan kör den en till 
     .then(() => axios.get("http."))
     .then((response) => {
       console.log("Här är then");
     })
     //Detta är som att stänga dörren efter sig. Det spelar ingen roll om brevbäraren hittade paketen eller om han ramlade på vägen 
     // Finally körs alltid oavsett vad. Det är ett sätt att säga "Nu är jag helt färdig!"
     .finally(() => console.log("FInally"));
 }

