import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
		type: String,
		required: [true, "Name is required"]
	},
	email:{
		type: String,
		required: [true, "Email is required"],
		unique: [true, "Email already taken"],
		lowercase: true,
		trim: true
	},
	password:{
		type: String,
		required: [true, "Password is required"],
		minLength: [8, "Password must be at least 8 characters long"]
	}
	// Right here I dont know what else to add to our database.
	/*
	cartItems:[
		{	
			quantity:{
				type: Number,
				default: 1
			},
			product:{
				type: mongoose.Schema.Types.ObjectID,
				ref:"Product"
			}

		}
	],
	role:{
		type: String,
		enum: ["customer", "admin"],
		default: "customer"
	}
	*/
}, 
{
	timestamps: true	// createAt, updatedAt
}	
);


// Before we save our user, we run this function to hash the password
userSchema.pre("save", async function (next) {
	if(!this.isModified("password")) return next();

	try	{
		const salt = await bcrypt.genSalt(10);												// Hashing turns input from user to a VERY different value that cannot be irreversable.
		this.password = await bcrypt.hash(this.password, salt);				// Easy to compute, so if the password file gets corrupted, hackers wont be able to find out passwords.
		next()
	} catch (error){
		next(error)
	}
	
});

// Method to compare password.
userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;