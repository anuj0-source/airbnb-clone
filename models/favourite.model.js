const path = require("path");
const fs = require("fs/promises");
const rootDir = path.dirname(require.main.filename);
const favFilePath = path.join(rootDir, "data", "favourite.json");
const homeFilePath = path.join(rootDir, "data", "home.json");
const Home = require("./home.model");


module.exports = class Fav {

    static async addToFav(id) {
        try {
            const homes = await Home.fetchAll();

            let fav = await Fav.fetchFav();

            const homeIndex = homes.findIndex(h => h.id == id);
            if (homeIndex === -1) return "Home not found ❌";

            // Mark as favourite in the main homes list
            homes[homeIndex].favourite = true;
            await fs.writeFile(homeFilePath, JSON.stringify(homes));

            // Add to favourites list (avoid duplicates)
            const alreadyExists = fav.some(h => h.id == id);
            if (!alreadyExists) {
                fav.push(homes[homeIndex]);
                await fs.writeFile(favFilePath, JSON.stringify(fav));
            }

            return "Saved to wishlist ❤️"

        }
        catch (err) {
            return "Something went wrong ⚠️"
        }
    }

    static async fetchFav() {
        try {
            let favList = await fs.readFile(favFilePath, "utf-8");

            favList = JSON.parse(favList);

            return favList;
        }
        catch (err) {
            return [];
        }
    }

    static async isExists(id) {

        try {
            const fav = await Fav.fetchFav();

            const ans = fav.some(h => h.id == id);

            return ans;
        }

        catch (err) {
            return err;
        }
    }

    static async removeFromFav(id) {
        try {
            let fav = await Fav.fetchFav();
            const homes = await Home.fetchAll();

            // remove from fav list
            fav = fav.filter(h => h.id != id);

            // find home index
            const homeIndex = homes.findIndex(h => h.id == id);

            if (homeIndex !== -1) {
                homes[homeIndex].favourite = false;
            }

            // update main homes file
            await fs.writeFile(homeFilePath, JSON.stringify(homes));

            // update fav file
            await fs.writeFile(favFilePath, JSON.stringify(fav));

            return "Removed from wishlist 🗑️";

        } catch (err) {
            return "Something went wrong ⚠️";
        }
    }

    static async updateFav(id){
        try{
            let favouriteList=await Fav.fetchFav();
            const updatedHome=await Home.fetch(id);

            favouriteList=favouriteList.map(home => home.id == id? updatedHome : home);

            await fs.writeFile(favFilePath, JSON.stringify(favouriteList));

        }catch(err){
            return err;
        }
    }

    static async delete(id){
        try{
            let favouriteList=await Fav.fetchFav();

            favouriteList=favouriteList.filter(home => home.id != id);

            await fs.writeFile(favFilePath, JSON.stringify(favouriteList));

        }catch(err){
            console.log("Failed to delete home from favourites!");
            return err;
        }
    }

};