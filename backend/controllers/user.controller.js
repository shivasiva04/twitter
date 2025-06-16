import User from '../models/user.model.js'
import Notification from '../models/notification.model.js'
import bcrypt, { genSalt } from 'bcryptjs';

export const getProfile = async(req,res)=>{
    try{
        const {username} = req.params;
        const user = await User.findOne({username})

        if(!user){
            return res.status(500).json({error: "user not found"})
        }
        res.status(200).json(user);

    }
    catch(error){
        console.log(`error in get user profile controller:${error}`)
        res.status(500).json({error: "internal server error"})
    }
}

export const followUnFollowUser = async(req,res)=>{
    try{
        const {id} = req.params;
        const userToModify = await User.findById({_id:id})
        const currentUser = await User.findById({_id:req.user._id})

        if(id === req.user._id){
            return res.status(400).json({error:"you can't follow yourself"})
        }

        if(!userToModify || !currentUser){
            return res.status(404).json({error :"user not found"})
        }

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            await User.findByIdAndUpdate({_id:req.user._id}, {$pull :{following:id}})
            await User.findByIdAndUpdate({_id:id}, {$pull :{followers: req.user._id}})
            res.status(200).json({message : "unfollow successfully"})
        }
        else{
            await User.findByIdAndUpdate({_id:req.user._id}, {$push :{following:id}})
            await User.findByIdAndUpdate({_id:id}, {$push :{followers: req.user._id}})

            //send notification
            const newNotification = new Notification({
                type : "follow",
                from : req.user._id,
                to : userToModify._id
            })
            await newNotification.save();
            res.status(200).json({message : "Follow successfully"})
        }


    }
    catch(error){
        console.log(`error in followUnFollow: ${error}`)
        res.status(500).json({error: "error in FollowUnFollow"})

    }
}

export const getSuggestedUsers = async(req,res)=>{
    try{
        // getMyId
    const userId = req.user._id;
    // remove password in myId
    const userFollowedByMe = await User.findById({_id:userId}).select("-password")
    // remove my account in suggested list
    const users = await User.aggregate([
        {
        $match:{
            _id:{$ne: userId}
        }
    },{
        $sample: {
            size:10
        }
    }
])
    
    // filter remove users who all are following by me
    const filteredUser = users.filter((user)=> !userFollowedByMe.following.includes(user._id))
   // slice show only 4 users 
    const suggestedUsers = filteredUser.slice(0,4);
   //suggested users account remove password 
    suggestedUsers.forEach((user)=>(user.password = null))
   // show suggested list
    console.log(suggestedUsers)
    res.status(200).json(suggestedUsers)
    }
    catch(error){
        console.log(`error in suggestedUser : ${error}`);
        res.status(500).json({error : "error in suggestedUser"})
}
}   

export const updateUser = async(req,res)=>{
    try{
        const userId = req.user._id;
        let user = await User.findById({_id:userId})
        let {username,fullname,password,email,currentPassword,newPassword,bio,link} = req.body;
        let {profileImg,coverImg}=req.body;

        if(!user){
            return res.status(400).json({error:"user not found"})

        }

        if((!currentPassword && newPassword) || (!newPassword && currentPassword)){
            return res.status(400).json({error:"user not found"})
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword,user.password);
            if(!isMatch){
                return res.status(400).json({error:"current userPassword wrong"})
            }
            if(isMatch<6){
                return res.status(400).json({error:"password very week less than 6 char"})

            }
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword,salt);
        }
 

            if(profileImg){
                if(user.profileImg){
                    await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);  
                }
                const uploadResponse = await cloudinary.uploader.upload(profileImg)
                profileImg = uploadResponse.secure_url;
            }

            if(coverImg){
                if(user.coverImg){
                    await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);  
                }
                const uploadResponse = await cloudinary.uploader.upload(coverImg)
                coverImg = uploadResponse.secure_url;
            }

            user.email = email || user.email
            user.fullname = fullname || user.fullname
            user.link = link || user.link
            user.bio = bio || user.bio
            user.password = password || user.password
            user.username = username || user.username
            user.profileImg = profileImg || user.profileImg
            user.coverImg = coverImg || user.coverImg

           user =  await user.save()
           user.password = null;

           return res.status(200).json(user);
        
    }
    catch(error){
        console.log(`error in update ${error}`)
        res.status(200).json({error: "error in update"})
    }

}


