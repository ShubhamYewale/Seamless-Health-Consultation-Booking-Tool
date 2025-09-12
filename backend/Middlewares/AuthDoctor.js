import jwt from 'jsonwebtoken'

const AuthDoctor = async(req,res,next)=>{

    try{
        const {dtoken} = req.headers;
        // console.log("we are in auth doctor",dtoken);
        // console.log("we are in auth doctor 2",req.headers);

        if(!dtoken)
        {
            return res.json({success:false , message:"not authorized login"});
        }

        const token_decode = jwt.verify(dtoken , process.env.JWT_SECRET);
        req.body.docId = token_decode.id;

        next()
    }
    catch(err)
    {            
        console.log(err);
        res.json({success:false , message:err.message});
    }
}

export default AuthDoctor