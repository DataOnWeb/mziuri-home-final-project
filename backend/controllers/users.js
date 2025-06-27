import jwt from 'jsonwebtoken';
import Users from '../models/Users.js';
import bcrypt from 'bcrypt'
import mailSender from '../utils/mailSender.js';

export const loginUser = async (req, res) => {
    try {
        const { usernameOrPassword, password, rememberMe } = req.body;
        const isEmail = usernameOrPassword.includes('@');

        let user;
        if (isEmail) {
            user = await Users.findOne({ email: usernameOrPassword });
        } else {
            user = await Users.findOne({ username: usernameOrPassword });
        }
        
        if (!user) {
            return res.status(404).json({ err: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password + process.env.BCRYPT_PEPPER, user.password)

        if(!isPasswordValid) {
            return res.json({ err: 'Invalid username or password' });
        }


        const tokenExpiration = rememberMe ? '30d' : '1d';
        const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: tokenExpiration });
        
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: cookieMaxAge,
            sameSite: 'strict' 
        });

        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,

        };

        res.status(200).json({ data: userResponse });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getToken = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json({ err: 'Please login now!' });

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) return res.status(400).json({ msg: 'Please login now!' });
            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};




export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ err: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await Users.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ err: 'User not found' });
    }

    res.status(200).json({ data: user });
  } catch (err) {
    res.status(401).json({ err: 'Invalid token' });
  }
};

export const getUser = async (req, res) => {
  try {
    const token = req.cookies.token; 
    if (!token) return res.status(401).json({ err: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userData = await Users.findById(decoded.id).select('-password');
    
    res.status(200).json({ data: userData });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const usernameExists = await Users.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ err: 'Username is already in use' });
        }

        const emailExists = await Users.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ err: 'Email is already in use' });
        }

        const isEmail = email.includes('@')
        if(!isEmail) {
            return res.status(400).json({err:'Email should contain @'})
        }

        const hashedPassword = await bcrypt.hash(password + process.env.BCRYPT_PEPPER,11)

        const newUser = new Users({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save()

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict'
        });


        const userResponse = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        };

        res.status(201).json({ data: userResponse });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export const forgotPasswordUser = async (req, res) => {
    try {
        const { email } = req.body;

        let user = await Users.findOne({ email: email });
        if(!user) {
            return res.status(400).json({msg: "Email is incorrect!"})
        }

        const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });
        const url = `https://pronia-app.onrender.com/reset-password/${access_token}`  

        await mailSender(process.env.MAIL_SENDER_EMAIL, email, url)

        res.status(200).json({msg: "Check your email for further instructions"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

export const resetPasswordUser = async (req, res) => {
    try {
        const {password, confirm_password} = req.body;
        const token = req.header('Authorization');

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        const hashedPassword = await bcrypt.hash(password + process.env.BCRYPT_PEPPER, 11)

        await Users.findOneAndUpdate({_id: userId}, {
            password: hashedPassword
        })

        res.status(200).json({msg: "Password successfully changed!"})
    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: err.message})
    }
}


export const updateUser = async (req, res) => {
  try {
    console.log('Backend: Received update request:', req.body);
    
    const { username, email, currentPassword, newPassword } = req.body;
    

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email !== user.email) {
      const emailExists = await Users.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(409).json({ message: 'Email is already in use' });
      }
    }


    const updateData = {
      username,
      email
    };
    if (newPassword && currentPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword + process.env.BCRYPT_PEPPER, 
        user.password
      );
      
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }


      const hashedNewPassword = await bcrypt.hash(
        newPassword + process.env.BCRYPT_PEPPER, 
        11
      );
      
      updateData.password = hashedNewPassword;
    }

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    console.log('Backend: User updated successfully:', updatedUser);

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: updatedUser
    });
    
  } catch (error) {
    console.error('Backend: Update error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to update profile' 
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const token = req.cookies.token;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = decoded.id;

      const user = await Users.findById(userId);
      const existingItemIndex = user.cart.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingItemIndex >= 0) {
        user.cart[existingItemIndex].quantity += quantity;
      } else {
        user.cart.push({ productId, quantity });
      }

      await user.save();
      
      return res.status(200).json({ 
        success: true, 
        message: 'Product added to cart',
        cart: user.cart
      });
    } else {
      const cartItem = {
        productId,
        quantity,
        addedAt: new Date()
      };
      
      return res.status(200).json({ 
        success: true, 
        message: 'Product added to session cart',
        cartItem,
        isGuest: true
      });
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params; 
    const userId = req.user.id;

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ err: 'User not found' });
    }

    user.cart = user.cart.filter(
      item => item.productId.toString() !== productId
    );

    await user.save();
    
    const updatedUser = await Users.findById(userId).populate('cart.productId');
    res.status(200).json({ 
      success: true, 
      message: 'Product removed from cart',
      cart: updatedUser.cart
    });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ err: err.message });
  }
};
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ err: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const updatedUser = await Users.findOneAndUpdate(
      {
        _id: decoded.id,
        'cart.productId': productId
      },
      {
        $set: { 'cart.$.quantity': quantity }
      },
      { new: true, runValidators: true }
    ).populate('cart.productId');

    if (!updatedUser) {
      return res.status(404).json({ err: 'Item not found in cart' });
    }

    res.status(200).json({
      success: true,
      cart: updatedUser.cart
    });

  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ 
      success: false,
      err: 'Server error while updating cart' 
    });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ err: 'User not found' });
    }

    const exists = user.wishlist.some(item => 
      item.productId.toString() === productId
    );

    if (exists) {
      return res.status(400).json({ 
        success: false,
        message: 'Product already in wishlist' 
      });
    }

    user.wishlist.push({ productId });
    await user.save();

    const updatedUser = await Users.findById(userId).populate('wishlist.productId');
    
    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist: updatedUser.wishlist
    });
    
  } catch (err) {
    console.error('Wishlist error:', err);
    res.status(500).json({ 
      success: false,
      err: err.message 
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params; 
    const userId = req.user.id;

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ err: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(
      item => item.productId.toString() !== productId
    );

    await user.save();
    

    const updatedUser = await Users.findById(userId).populate('wishlist.productId');
    res.status(200).json({ 
      success: true, 
      message: 'Product removed from wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    res.status(500).json({ err: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId).populate('cart.productId');
    
    res.status(200).json({ 
      success: true, 
      cart: user.cart 
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};


export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId).populate('wishlist.productId');
    
    res.status(200).json({ 
      success: true, 
      wishlist: user.wishlist 
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};