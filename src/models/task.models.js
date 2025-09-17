import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


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

taskSchema.plugin(mongooseAggregatePaginate)

export const Task = mongoose.model('Task', taskSchema)