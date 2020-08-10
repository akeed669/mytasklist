
exports.getDate= function (){

  const today=new Date();
  //var nday=today.getDay()
  const options = {
    weekday:"long",
    day:"numeric",
    month:"long"
  }

  return today.toLocaleDateString("en-US",options)

}

module.exports.getDay=getDay

function getDay(){

  const today=new Date();
  //var nday=today.getDay()
  const options = {
    weekday:"long",

  }

  return today.toLocaleDateString("en-US",options)
}
