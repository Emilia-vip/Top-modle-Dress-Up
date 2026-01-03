import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import runway from "../assets/runway,new.png";

function HomePage() {
  const { logout } = useContext(AuthContext);

  return (
     <div
  className="min-h-screen w-full flex items-center justify-center
             bg-cover bg-center md:bg-no-repeat md:bg-bottom px-2 py-4 md:px-0 md:py-0"
  style={{
    backgroundImage: `url(${runway})`,
    backgroundSize: "cover",
  }}
>
      <div
        className="rounded-xl md:rounded-2xl shadow-2xl shadow-black p-4 md:p-10 w-full max-w-3xl flex flex-col gap-3 md:gap-5 mt-4 md:mt-20"
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.4)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Titel */}
        <h1 className="text-base md:text-2xl lg:text-6xl font-light ml-45 mr-10 text-white mb-2 md:mb-4 mt-2 md:mt-8 font-italiana">
          Top model
        </h1>
        <h2 className=" text-white lg:text-2xl ml-95 absolute mt-22 font-italiana"> Dress Up </h2>

        
       <div className="mt-10"></div>
        <p className="text-gray-200 leading-relaxed mb-3 md:mb-6 text-xs md:text-base">
          Let your imagination run wild and create your own unique outfits by mixing and matching clothes. 
          The game is designed for anyone who loves fashion, styling, or just wants to have fun while designing unique looks.
        </p>

        {/* Sektion: Hur fungerar spelet */}
        <h2 className="text-sm md:text-xl lg:text-2xl font-light text-white mb-2 md:mb-4"> How does the game work?</h2>

        <div className="space-y-2 md:space-y-4 text-gray-200 text-xs md:text-base">

          <div>
            <h3 className="text-xs md:text-lg lg:text-xl font-medium text-white">Choose a character</h3>
            <p className="leading-relaxed">
              Select the model you want to style in the game.
            </p>
          </div>

          <div>
            <h3 className="text-xs md:text-lg lg:text-xl font-medium text-white"> Explore the wardrobe</h3>
            <p className="leading-relaxed">
             Browse through tops and bottoms. Each category contains a variety of outfits to choose from.
            </p>
          </div>

          <div>
            <h3 className="text-xs md:text-xl font-medium text-white">Scroll through to dress up</h3>
            <p className="leading-relaxed">
              Browse the clothing items to put them on your model. You can change and adjust as much as you like until you find the perfect style.
            </p>
          </div>

          <div>
            <h3 className="text-xs md:text-xl font-medium text-white">Save your look</h3>
            <p className="leading-relaxed">
              Once you’re happy, you can save your outfit or start over to create an entirely new style. 
              You can later find your creations on your profile page.
            </p>
          </div>

          <div>
            <h3 className="text-xs md:text-xl font-medium text-white">Rate other models</h3>
            <p className="leading-relaxed">
            After creating the perfect look, it’s ready to be rated by other users. 
            You can also rate other users’ outfits by giving them 1–5 stars. 
            </p>
          </div>

          <div>
            <h3 className="text-xs md:text-xl font-medium text-white">Let your creativity flow</h3>
            <p className="leading-relaxed">
              Let your creativity flow and see what unique styles you can create!
            </p>
          </div>

        </div>

       
        </div>
      </div>
  );
}

export default HomePage;
