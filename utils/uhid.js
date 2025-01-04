const bcrypt=require('bcrypt');

const unique_UHID=async()=>{
    const timeStamp=Date.now().toString();
    const saltRounds=10;

    let uhid=await bcrypt.hash(timeStamp,saltRounds);
    uhid=uhid.replace(/\W/g,'');//finds all non alphanumeric character(\W) and removes them
    console.log(uhid);
    return `PAT${uhid}`;
}

module.exports=unique_UHID;


