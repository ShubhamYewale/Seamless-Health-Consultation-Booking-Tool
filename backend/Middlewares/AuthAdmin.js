import jwt from 'jsonwebtoken'

const AuthAdmin = async(req,res,next)=>{

    try{
        const {atoken} = req.headers;

        if(!atoken)
        {
            return res.json({success:false , message:"not authorized login"})
        }

        const token_decode = jwt.verify(atoken , process.env.JWT_SECRET);

        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)
        {
            return res.json({success:false , message:"not authorized login"})
        }

        next()
    }
    catch(err)
    {
            
        console.log(err);
        res.json({success:false , message:err.message})
    }
}

export default AuthAdmin