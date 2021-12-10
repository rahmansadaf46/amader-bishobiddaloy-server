const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.${process.env.DB_CODE}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
//mongodb+srv://Abir:<password>@cluster0.czzkl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('item'));
app.use(fileUpload());

const port = 4200;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const orderCollection = client.db(`${process.env.DB_FILE}`).collection("allOrder");
    const foodCollection = client.db(`${process.env.DB_FILE}`).collection("allFood");
    const itemCollection = client.db(`${process.env.DB_FILE}`).collection("allBook");
    const questionCollection = client.db(`${process.env.DB_FILE}`).collection("allQuestion");
    const teacherCollection = client.db(`${process.env.DB_FILE}`).collection("allTeacher");
    const opinionCollection = client.db(`${process.env.DB_FILE}`).collection("allOpinion");
    const appointmentCollection = client.db(`${process.env.DB_FILE}`).collection("allAppointment");
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        console.log(order);
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    // app.post('/addFood', (req, res) => {
    //     const file = req.files.file;
    //     const image = req.files.file.name;
    //     const title = req.body.title;
    //     const price = req.body.price;
    //     const category = req.body.category;
    //     const description = req.body.description;
    //     const shortDescription = req.body.shortDescription;

    //     file.mv(`${__dirname}/food/${file.name}`,err=>{
    //         if(err){
    //             return res.status(500).send({msg:'Failed to upload Image'});
    //         }
    //     })

    //     foodCollection.insertOne({ title, price, category, description, shortDescription, image })
    //         .then(result => {
    //             res.send(result.insertedCount > 0);
    //         })
    // })
    // app.get('/foods', (req, res) => {
    //     foodCollection.find({})
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //         })
    // })
    // app.delete('/delete/:id', (req, res) => {
    //     console.log(req.params.id);
    //     studentCollection.deleteOne({ _id: ObjectId(req.params.id) })
    //         .then((result) => {
    //             res.send(result.deletedCount > 0);
    //             console.log(res);
    //         })
    // })

    app.get('/allOrder', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // app.get('/students/:department/:roll', (req, res) => {
    //     studentCollection.find({ roll: req.params.roll, department: req.params.department })
    //         .toArray((err, documents) => {
    //             res.send(documents[0]);
    //         })
    // })

    // app.post('/studentsByRoll', (req, res) => {
    //     const roll = req.body;
    //     studentCollection.find({ roll: roll.roll })
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //         })
    // })

    app.patch('/updateOrder/:id', (req, res) => {
        orderCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: {
                    finalData: req.body
                },
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })

    app.patch('/updateAmount/:id', (req, res) => {
        orderCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: {
                    finalData: req.body
                },
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })

    //for book
    app.post('/addItem', (req, res) => {
        const file = req.files.file;
        const image = req.files.file.name;
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;
        const shortDescription = req.body.shortDescription;

        file.mv(`${__dirname}/item/${file.name}`, err => {
            if (err) {
                return res.status(500).send({ msg: 'Failed to upload Image' });
            }
        })

        itemCollection.insertOne({ title, price, description, shortDescription, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })


    app.get('/items', (req, res) => {
        itemCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    //for questions 

    app.post('/addQuestion', (req, res) => {
        const data = req.body;
        // console.log(req)
        questionCollection.insertOne({ data })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/questions', (req, res) => {
        questionCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.get('/question/:id', (req, res) => {
        questionCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    app.delete('/deleteQuestion/:id', (req, res) => {
        console.log(req.params.id);
        questionCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
                console.log(res);
            })
    })
    app.patch('/updateQuestion/:id', (req, res) => {
        questionCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: {
                    data: req.body
                },
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })


    //for teacher
    app.post('/addTeacher', (req, res) => {
        // const data = req.body
        const category = req.body.category;
        const designation = req.body.designation;
        const status = req.body.status;
        const subject = req.body.subject;
        const teacherName = req.body.teacherName;
        const workingPlace = req.body.workingPlace;
        // console.log(req)
        teacherCollection.insertOne({ category, designation, status, subject, teacherName, workingPlace })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })


    app.get('/teachers', (req, res) => {
        teacherCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.get('/teacher/:id', (req, res) => {
        teacherCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    app.delete('/deleteTeacher/:id', (req, res) => {
        console.log(req.params.id);
        teacherCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
                console.log(res);
            })
    })
    app.patch('/updateTeacher/:id', (req, res) => {
        teacherCollection.updateOne({ _id: ObjectId(req.params.id) },
        // const category = req.body.category;
        // const designation = req.body.designation;
        // const status = req.body.status;
        // const subject = req.body.subject;
        // const teacherName = req.body.teacherName;
        // const workingPlace = req.body.workingPlace;
            {
                $set: {
                    category: req.body.category,
                    designation: req.body.designation,
                    status: req.body.status,
                    subject: req.body.subject,
                    teacherName: req.body.teacherName,
                    workingPlace: req.body.workingPlace,
                    // console.log(req)
                    // approvedData: req.body.approvedData
                },
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })


    //for opinion
    app.post('/addOpinion', (req, res) => {
        const data = req.body;
        // console.log(req)
        opinionCollection.insertOne({ data })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/opinions', (req, res) => {
        opinionCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    //for appointment
    app.post('/addAppointment', (req, res) => {
        // const data = req.body
        const email = req.body.email;
        const teacher = req.body.teacher;
        const status = req.body.status;
        // console.log(req)
        const approvedData = {};
        appointmentCollection.insertOne({ email, teacher, status, approvedData })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/appointments', (req, res) => {
        appointmentCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.patch('/updateAppointment/:id', (req, res) => {
        appointmentCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: {
                    email: req.body.email,
                    teacher: req.body.teacher,
                    status: req.body.status,
                    // console.log(req)
                    approvedData: req.body.approvedData
                },
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })
});


app.listen(process.env.PORT || port)