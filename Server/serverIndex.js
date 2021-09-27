const express = require("express")

const app = express()

const mysql = require('mysql')

const cors = require('cors')

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'nepal9860',
    database: 'contactsystem'
})

app.post('/create', (req, res) => {
    console.log("req.body",req.body);
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const phoneNumber = req.body.phoneNumber

    db.query("INSERT INTO contact (FirstName,LastName,Email,PhoneNumber) VALUES (?,?,?,?)",
    [firstName,lastName,email,phoneNumber ], (err, result) => {
        if(err) {
            console.log(err);
        }else {
            res.send("Value Inserted")
        }
    })
})

app.get('/contacts', (req, res) => {
    db.query("SELECT * FROM contact", (err, result) => {
        console.log("result",result);
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})

app.put('/update',(req,res) => {
    console.log("req",req);
    const id = req.body.id
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const phoneNumber = req.body.phoneNumber
    db.query("UPDATE contact SET FirstName = ?, LastName = ?, Email = ?, PhoneNumber = ? WHERE id = ?",[
        firstName,lastName,email,phoneNumber,id],(err,result) => {
            if(err){
                console.log(err);
            }else{
                res.send(result)
            }
        })
})

app.delete('/delete/:id', (req, res) => {
    console.log("req",req);
    const id = req.params.id
    db.query("DELETE FROM contact Where id = ?",id, (err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
})

app.listen(3001, () => {
    console.log("Hello");
})