const Listing=require("../models/listing.js")

module.exports.home=(req,res)=>{
    res.render("listings/home.ejs");
}

module.exports.index=async (req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index.ejs",{allListings})
}



module.exports.newForm=(req,res)=>{
    
    res.render("listings/newListing.ejs");
}

// module.exports.addNewListing=async(req,res)=>{
//     let url=req.file.path;
//     let filename=req.file.filename;
//     console.log(url,"..",filename);
//     let list= req.body.Listing;
//     const newlist=new Listing(list);
//     newlist.owner=req.user._id;

//     if (req.file) {
//       newlist.image = {
//         url: req.file.path,
//         filename: req.file.filename
//       };
//     console.log(url,"..",filename);

//     }
//     await newlist.save();
//     req.flash("success","New Listing Created!");
//     console.log(Listing);
//     res.redirect("/listings");
// }

module.exports.addNewListing = async (req, res) => {
  const list = req.body.Listing;
  const newlist = new Listing(list);

  newlist.owner = req.user._id;

  if (req.file) {
    newlist.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await newlist.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};



module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    // console.log("hello");
    // res.send(id);
    const data1= await Listing.findById(id).populate({path:"reviews",
        populate:{
            path:"author"
        }}
    )
    .populate("owner");

    // problem yehan se suru hua hai
    // if(!data1){
    //     req.flash("error","Listing does not exist.")
    //     res.redirect("/listings");
    // }
    
    
    res.render("listings/show.ejs", {data1});
    // console.log(data1);
}

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);
    console.log(list);
    if(!list){
        req.flash("error","Listing does not exist.")
        res.redirect("/listings");
    }

    let originalImageUrl=list.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    

    res.render("listings/edit.ejs",{list,originalImageUrl});
    
}


module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let  listing=await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    // new changing
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    
    req.flash("success","New Update Created!");
    
    res.redirect(`/listings/${id}`);

}

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    const del=await Listing.findByIdAndDelete(id);
    console.log( del);
    req.flash("success","Listing Deleted");

    console.log("data deleted");
    res.redirect("/listings")
}