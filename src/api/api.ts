import axios from "axios";


 function StartupRoutine() {
   async function Test() {}
   Test();

   axios
     .get("http://hej.com")
     .then((response) => {
       console.log("Här är then");
     })
     .then(() => axios.get("http."))
     .then((response) => {
       console.log("Här är then");
     })
     .finally(() => console.log("FInally"));
 }

