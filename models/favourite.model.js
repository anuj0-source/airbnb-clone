const {ObjectId}=require("mongodb");
const {getDb}=require("../utils/database");

module.exports = class Fav {

    static async addToFav(id) {
        try {
            const db = getDb();

            await db.collection('homes').updateOne(
                { _id: new ObjectId(id) },
                { $set: { favourite: true } }
            );

            await db.collection('favourites').insertOne({
                homeId: id
            });

            return "Saved to wishlist ❤️";
        } catch (err) {
            console.log(err);
            return "Something went wrong ⚠️";
        }
    }

    static async fetchFav() {
        try {
            const db=getDb();

            let favouriteHomes=await db.collection('homes').find({favourite: true}).toArray();

            return favouriteHomes;
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
            
            const db=getDb();

            await db.collection('homes').updateOne({_id: new ObjectId(id)},{$set: {favourite:false}});

            await db.collection('favourites').deleteOne({homeId: id});

            return "Removed from wishlist 🗑️";

        } catch (err) {
            return "Something went wrong ⚠️";
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