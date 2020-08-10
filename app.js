const express=require("express");
const parser=require("body-parser");
//const https=require("https");
const datemodule=require(__dirname+"/superdate.js")
const app=express();
const mongoose = require('mongoose');
const _ = require('lodash');

app.use(parser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("kpublic"))

//mongoose.connect("mongodb://localhost:27017/listDB",{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.connect("mongodb+srv://admin-akeed:akeed123@cluster0.9nfil.mongodb.net/listDB",{ useNewUrlParser: true,useUnifiedTopology: true });

mongoose.set('useFindAndModify', false);;

const theDay=datemodule.getDate()

const itemSchema={
  name:{
    type:String,
    required:[true, "Needs a name!"]
  }
}

const Entry=mongoose.model("Entry",itemSchema);

const entry1=new Entry({
  name:"Make bed"
})

const entry2=new Entry({
  name:"Make tea"
})

const entry3=new Entry({
  name:"Go to work"
})

let defaultItems=[entry1,entry2,entry3]

const listSchema={
  name:String,
  listItems:[itemSchema]
}

const CustomList=mongoose.model("customList",listSchema);

app.get("/about", function(req,res){
  res.render("about");
})

app.get("/",function(req,res){

  //const theDay=datemodule.getDate()
  Entry.find({},function(err,theEntries){

    if(theEntries.length===0){

      Entry.insertMany(defaultItems,function(err){
        if(err){
          console.log(err)
        }else{
          console.log("Successfully inserted!")
        }
      });

    }
    res.render("lists",{listHeading:"Primary",listDate:theDay, newListItems:theEntries});
  })
  //res.sendFile(__dirname+"/signup.html")
})

app.get("/:desire",function(req,res){

  const listName2=req.params.desire;

  const listName=_.capitalize(listName2);

  CustomList.findOne({name:listName},function(err,matchingList){

    if(!matchingList){
      const customList1=new CustomList({
        name:listName,
        listItems:defaultItems
      });

      customList1.save();
      //res.render("lists",{listHeading:listName, listTitle:theDay, newListItems:defaultItems});
      res.redirect("/"+listName);


    }else{
      res.render("lists",{listHeading:matchingList.name, listDate:theDay, newListItems:matchingList.listItems});
    }

  });

})


app.post("/",function(req,res){

  const itemName=req.body.lItem;
  const selectedList=req.body.xlist;

  const addNew=new Entry({
    name:itemName
  });


  if(selectedList==="Primary"){
    addNew.save();
    res.redirect("/");
  }
  else{

    CustomList.findOne({name:selectedList},function(err,foundList){

      foundList.listItems.push(addNew);
      foundList.save();
      res.redirect("/"+selectedList);

    })
  }
});

app.post("/delete",function(req,res){

  const selectedList=req.body.listheader;

  const itemToDelete = req.body.myBox;

  // Entry.deleteOne({_id:itemToDelete},function(err){
  //   if(err){console.log(err)}
  // })

  if(selectedList==="Primary"){
    Entry.findByIdAndRemove(itemToDelete,function(err){
      if(!err){
        res.redirect("/")
      }
    });
  }else{
    CustomList.findOneAndUpdate({name:selectedList},{$pull:{listItems:{_id:itemToDelete}}},function(err,foundList){
      if(!err){
        foundList.save();
        res.redirect("/"+selectedList);
      }
    });
  }
});

app.listen(process.env.PORT || 3000,function(){
  console.log("listening on port 3000...")
})
