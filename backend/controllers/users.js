import Users from '../models/users.js';
import ChatRooms from '../models/chatRooms.js';
import {hashPassword, comparePassword} from '../utils/bcrypt.js'
import {sendResetPasswordMail, sendContactMail} from '../utils/mailSender.js'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, city, password, gender, favoriteGenre, favoriteInstrument, date } = req.body;
        
        const hashedPassword = await hashPassword(password)
        
        const newUser = new Users({
            fullName: fullName,
            email: email,
            city: city,
            password: hashedPassword,
            gender: gender,
            favoriteGenre: favoriteGenre,
            favoriteInstrument: favoriteInstrument,
            date: date,
            // media: media,
        });
        
        await newUser.save()
        
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });
        
        const userObj = newUser.toObject();
        delete userObj.password;
        
        return res.status(201).json({ data: userObj });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err: "Something went wrong" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ err: 'Invalid email or password' });
        }

        const isPasswordValid = await comparePassword(password, user.password)
        if(!isPasswordValid) {
            return res.status(400).json({ err: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json({ data: userObj });
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }
};

export const logoutUser = (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ data: 'User has logged out' });
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }
};

export const getToken = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json({ err: 'Please login now!' });

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) return res.status(400).json({ msg: 'Please login now!' });
            return res.status(200).json({ data: token });
        });
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }
    
};

export const getUser = async (req, res) => {
    try {
        const token = req.header('Authorization');

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        console.log(userId)

        const userData = await Users.findById(userId)
            .select('-password')

        // console.log(userData)

        return res.status(200).json({ data: userData });
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }
};

export const forgotPasswordUser = async (req, res) => {
    try {
        const { email } = req.body;

        let user = await Users.findOne({ email: email });
        if(!user) {
            return res.status(400).json({err: "Email is incorrect!"})
        }

        const access_token = jwt.sign({ id: user._id }, process.env.JWT_RESET_PASS_SECRET_KEY, { expiresIn: '15m' });
        const url = `http://localhost:5173/reset-password/${access_token}`  

        await sendResetPasswordMail(email, url)

        return res.status(200).json({ data: "Check your email for further instructions" })
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }

}

export const resetPasswordUser = async (req, res) => {
    try {
        const { password } = req.body;
        const token = req.header('Authorization');

        const decoded = jwt.verify(token, process.env.JWT_RESET_PASS_SECRET_KEY);
        const userId = decoded.id;

        const hashedPassword = await hashPassword(password)

        await Users.findOneAndUpdate({_id: userId}, {
            password: hashedPassword
        })

        return res.status(200).json({ data: "Password successfully changed!" })
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }

}

export const contact = async (req, res) => {
    try {
        const { email, subject, message } = req.body;
        await sendContactMail(email, subject, message)
        return res.status(200).json({ data: "Email has sent!" })
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }

}

export const updateUser = async (req, res) => {
  try {
    const { _id, fullName, email, city, gender, favoriteGenre, favoriteInstrument, date, password } = req.body;

    // Validate user exists
    const user = await Users.findById(_id);
    if (!user) {
      return res.status(404).json({ err: 'User not found' });
    }

    const updatedData = {
      fullName,
      email,
      city,
      gender,
      favoriteGenre,
      favoriteInstrument,
      date
    };

    // If password is provided and confirmed, hash and include it
    if (password) {
      updatedData.password = await hashPassword(password);
    }

    const updatedUser = await Users.findByIdAndUpdate(_id, updatedData, {
      new: true,
      select: '-password', // exclude password from response
    });

    return res.status(200).json({ data: updatedUser });
  } catch (err) {
    return res.status(500).json({ err: 'Failed to update user' });
  }
};

export const discover = async (req, res) => {
    try {
        const { userId } = req.params

        const user = await Users.findById(userId);

        const exclude = [];//[...user.likedUsers, ...user.dislikedUsers, user._id];
        const usersToShow = await Users.aggregate([
            { $match: { _id: { $nin: exclude } } },
            { $sample: { size: 1 } } // get one random user
        ]);

        return res.status(200).json({ data: usersToShow[0] })
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }
}

export const like = async (req, res) => {
    try {
        const { userId } = req.body; // user who is liking
        const { targetId } = req.params; // user who is being liked

        // if (userId === targetId) return res.status(400).json({ err: "Cannot like yourself" });

        const user = await Users.findById(userId);
        const targetUser = await Users.findById(targetId);

        console.log(targetUser.likedUsers, userId, targetUser.likedUsers.includes(userId))

        // if (!user || !targetUser) return res.status(404).json({ err: "User not found" });

        // if (user.likedUsers.includes(targetId)) return res.status(400).json({ err: "Already liked" });

        user.likedUsers.push(targetId);

        // Check for match
        const isMatch = targetUser.likedUsers.includes(userId);
        if (isMatch) {
            user.matches.push(targetId);
            targetUser.matches.push(userId);

            await targetUser.save(); // save target because matches updated

            //find or create chatroom
            let chatRoom = await ChatRooms.findOne({
                participants: { $all: [userId, targetId] }
            });

            if (!chatRoom) {
                chatRoom = new ChatRooms({ participants: [userId, targetId] });
                await chatRoom.save();
            }
        }

        await user.save();

        const responseData = {
            message: isMatch ? "It's a match!" : "Liked",
            isMatch: isMatch
        }

        return res.status(200).json({ data: responseData })
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }
}

export const dislike = async (req, res) => {
    try {
        const { userId } = req.body; // user who is disliking
        const { targetId } = req.params; // user who is being disliked

        // if (userId === targetId) return res.status(400).json({ err: "Cannot dislike yourself" });

        const user = await Users.findById(userId);
        const targetUser = await Users.findById(targetId);

        // if (!user || !targetUser) return res.status(404).json({ err: "User not found" });

        // if (user.dislikedUsers.includes(targetId)) return res.status(400).json({ err: "Already disliked" });

        user.dislikedUsers.push(targetId);
        await user.save();

        return res.status(200).json({ data: 'Disliked' })
    } catch (err) {
        return res.status(500).json({ err: "Something went wrong" });
    }
}