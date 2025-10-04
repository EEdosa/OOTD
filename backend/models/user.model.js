import mongoose from 'mongoose';

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

const User = mongoose.model("User", userSchema);

export default User;