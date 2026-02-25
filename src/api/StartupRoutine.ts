//detta är som ett skyddsnät ifall brevbäraren ramlar längst vägen.
import axios from "axios";

//funktion som gör en snabb kontroll innan det stora arbetet börjar.
export function StartupRoutine() {
  //vi skapar en hjälpreda som ropar det som står i consolen 
  //eftrsom det är async körs den i sin egen takt utan att stoppa resten av koden.
  async function Test() {
    console.log("Test-funktion körs");
  }
  Test();

  axios
    .get("http://hej.com")
    .then((response) => {
      console.log("Här är then 1");
      return axios.get("http."); // Ogiltig URL → går till catch
    })
    .then((response) => {
      console.log("Här är then 2");
    })
    .catch((error) => {
      console.error("Ett fel uppstod i promise-kedjan:", error);
    })
    .finally(() => console.log("Finally"));
}

