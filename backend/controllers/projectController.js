import joi from 'joi';
import Project from '../models/index.js'


const globalSearch = async (req, res) => {
    const page = parseInt(req.query.page) || 1;  // default to page 1
    const pageSize = parseInt(req.query.pageSize) || 10;  // default to 10 items per page

    try {
        const skip = (page - 1) * pageSize;

        const query = {};
        
        if (req.query.title) {
            query.title = { $regex: new RegExp(req.query.title, 'i') };
        }

        const searchResults = await Project.find(query)
            .skip(skip)
            .limit(pageSize);

        if (searchResults.length === 0) {
            return res.status(404).send({ data: { error: true, message: 'No matching projects found' } });
        }

        res.send({ data: searchResults });
    } catch (error) {
        return res.status(500).send({ data: { error: true, message: 'Server error' } });
    }
};

const createProject =  async (req, res) => {

    // validate type 
    const project = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })

    // validation
    const { error, value } = project.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)


    // insert data 
    try {
        const data = await new Project(value).save()
        res.send({ data: { title: data.title, description: data.description, updatedAt: data.updatedAt, _id: data._id } })

    } catch (e) {
        if (e.code === 11000) {
            return res.status(422).send({ data: { error: true, message: 'title must be unique' } })
        } else {
            return res.status(500).send({ data: { error: true, message: 'server error' } })
        }
    }


}

const addTodo = async (req, res) => {
    // validate type 
    const project = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })

    // // validation
    const { error, value } = project.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)

    Project.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { ...value }, { upsert: true }, (error, data) => {
        if (error) {
            res.send(error)
        } else {
            res.send(data)
        }
    })

}

  export  {globalSearch,createProject,addTodo}