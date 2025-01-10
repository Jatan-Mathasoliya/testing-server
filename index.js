const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const uri = "mongodb+srv://jatancodinggita:wokfbfpILbWcq3vF@practisedata.mmwpr.mongodb.net/?retryWrites=true&w=majority&appName=Practisedata";
const dbName = "CodingGita";

// Middleware to parse JSON request bodies
app.use(express.json());

let db, students;

async function database() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("MongoDB Connected");

        db = client.db(dbName);
        students = db.collection("testing");

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

database();

app.get('/students', async (req, res) => {
    try {
        const allStudents = await students.find().toArray();
        res.status(200).json(allStudents);
    } catch (err) {
        res.status(500).send("Error fetching students: " + err.message);
    }
});

app.post('/student', async (req, res) => {
    try {
        const student = req.body;
        const result = await students.insertOne(student);
        res.status(200).send("Student Inserted");
    } catch (err) {
        res.status(400).send(err);
    }
});

app.put('/students/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const result = await students.replaceOne({ name: name }, req.body);
        res.status(201).send("User Updated");
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/student/:rollNumber', async (req, res) => {
    try {
        const rollNumber = parseInt(req.params.rollNumber);
        const result = await students.deleteOne({ "rollNumber":rollNumber });
        res.status(200).send("Student Deleted");
    } catch (err) {
        res.status(400).send(err);
    }
});
