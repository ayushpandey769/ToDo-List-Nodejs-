import mongoose,{Schema} from "mongoose";



const taskSchema = new Schema({
    taskName: {
        type: String,
        required: true,
        unique: true
    },
    taskDescription: {
        type: String
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
        timestamps: true
    }
)


export const Task = mongoose.model('Task', taskSchema)