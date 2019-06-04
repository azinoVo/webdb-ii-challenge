const knex = require('knex');
const router = require('express').Router();

const knexConfig = {
    client: 'sqlite3', // the sqlite3 database driver
    useNullAsDefault: true, // needed when working with SQLite
    connection: {
      // relative to the root folder
      filename: './data/lambda.db3', // path to the database file
      // if the database does not exist an empty one with this name will be created
    },
  };
  
const db = knex(knexConfig);

// routes have root of /api/zoos
// database named zoos
//---------------------------------------------------------------------------------//

router.post('/', (req, res) => {

    db('zoos', 'id')
    .insert(req.body)
    .then(ids => {

        const [id] = ids; // capture the ID from ids which is an array

        db('zoos') // get the newly added post from database with that new id
        .where({id})
        .first()
        .then(zoo => {
            res.status(200).json(zoo);
        });
    })
    .catch(err => {
        res.status(500).json(err);
    })


});


//---------------------------------------------------------------------------------//

router.get('/', (req, res) => {

    db('zoos')
    .then(zoo => {
        res.status(200).json(zoo);
    })
    .catch(err => {
        res.status(404).json(err);
    })
});

//---------------------------------------------------------------------------------//

router.put('/:id', (req, res) => {

    db('zoos')
    .where({id: req.params.id})
    .update(req.body)
    .then(count => {
        if (count > 0) {
            // return the count or the newly updated from database
            db('zoos')
            .where({id: req.params.id})
            .first()
            .then(animal => {
                res.status(200).json({animal})
            })
        } else {
            res.status(500).json({message: "Zoo Animal not found!"})
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })

});


//---------------------------------------------------------------------------------//

router.delete('/:id', (req, res) => {
    
    db('zoos')
    .where({id: req.params.id})
    .del()
    .then(count => {
        if (count > 0) {
            res.status(200).json({message: "Destruction Imminent."})
        } else {
            res.status(404).json({message: "Animal not found!"})
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
});

//---------------------------------------------------------------------------------//

// Middleware
//

function checkProjectID (req, res, next) {
   
}

//---------------------------------------------------------------------------------//

module.exports = router;