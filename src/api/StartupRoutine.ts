import axios from "axios";

export function StartupRoutine() {
  // Exempel på intern async-funktion
  async function Test() {
    console.log("Test-funktion körs");
  }
  Test();

  axios
    .get("http://hej.com")
    .then(() => {
      console.log("Här är then 1");
      return axios.get("http."); // Ogiltig URL → går till catch
    })
    .then(() => {
      console.log("Här är then 2");
    })
    .catch((error) => {
      console.error("Ett fel uppstod i promise-kedjan:", error);
    })
    .finally(() => console.log("Finally"));
}

