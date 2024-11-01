const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const Cloudant = require('@cloudant/cloudant');


// Initialize Cloudant connection with IAM authentication
async function dbCloudantConnect() {
    try {
        const cloudant = Cloudant({
 
            //formytest2025@gmail.com account:    
            plugins: { iamauth: { iamApiKey: 'ARfejs4I1STfK7wTgV65_1smpHr-lxfE9rT4PWkrtKe8' } }, // Replace with your IAM API key
            url: 'https://c5a8eb81-6135-4b41-a7a8-5b714c296bee-bluemix.cloudantnosqldb.appdomain.cloud', // Replace with your Cloudant URL

        });

        const db = cloudant.use('docregister');
        console.info('Connect success! Connected to DB');
        return db;
    } catch (err) {
        console.error('Connect failure: ' + err.message + ' for Cloudant DB');
        throw err;
    }
}

let db;
// console.log(bd)

(async () => {
    db = await dbCloudantConnect();
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.use(express.static('public'));

// Define a route to get all docregister with optional state and ID filters
app.get('/docregister/get', (req, res) => {
    const { state, id } = req.query;

    // Create a selector object based on query parameters
    const selector = {};
    if (state) {
        selector.state = state;
    }
    
    if (id) {
        selector.id = parseInt(id); // Filter by "id" with a value of 1
    }

    const queryOptions = {
        selector,
        limit: 10, // Limit the number of documents returned to 10
    };

    db.find(queryOptions, (err, body) => {
        if (err) {
            console.error('Error fetching docregister:', err);
            res.status(500).json({ error: 'An error occurred while fetching docregister.' });
        } else {
            // const dealerships = body.docs;
            // res.json(dealerships);


            const PREdocregister = body.docs;
            const PROdocregister =  {docregistered: PREdocregister}
            res.json(PROdocregister);
           
        }
    });
});




// *********************************POST Operation:


app.post('/docregister/add', async (req, res) => {
    const { id, 'first name': firstName, 'last name': lastName, 'cell phone': cellPhone, 'e-mail address': emailAddress } = req.body;

    if (!id || !firstName || !lastName || !cellPhone || !emailAddress) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const newDoc = {
        id,
        "first name": firstName,
        "last name": lastName,
        "cell phone": cellPhone,
        "e-mail address": emailAddress
    };

    try {
        const response = await db.insert(newDoc);
        res.status(201).json({ message: 'Document added successfully', response });
    } catch (err) {
        console.error('Error inserting document:', err);
        res.status(500).json({ error: 'An error occurred while adding the document.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port http://127.0.0.1:${port}`);
});


// To retrieve data stored in the database:

// http://127.0.0.1:4000/docregister/get

// http://127.0.0.1:4000/docregister/get?doc=1


// Note: At the first POST you do not need to define the columns, only the database name in Cloudant/Launch/create database
