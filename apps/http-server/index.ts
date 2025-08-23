import express from 'express'
import { prismaClient } from 'db/client'
import argon2 from 'argon2';

const app = express();
app.use(express.json());
const PORT = 3001;

app.get('/user', async (req, res) => {
    const { username, password } = req.body
    try{
        const user = await prismaClient.user.findFirst({
            where:{
                username
            }
        })
        const verifiedUser = await argon2.verify(user?.password!,password)
        if(verifiedUser){
        res.status(200).json({
            firstname: user?.firstname,
            lastname: user?.lastname
        })
        }else{
            res.status(403).json({
                error: "Password incorrect"
            })
        }
    }catch(e){
        console.log(e)
        res.status(403).json({
            error: e
        })
    }
})

app.post('/user', async (req, res) => {
    const { firstname, lastname, username, password } = req.body;
    if(!username || !password) {
        res.status(400).json({
            error: "Username or Password missing"
        })
    }
    const hashedPassword = await argon2.hash(password)
    try{
        await prismaClient.user.create({
            data:{
                firstname: firstname,
                lastname: lastname,
                username: username,
                password: hashedPassword
            }
        })
        res.status(200).json({
            message: 'User Created Successfully !'
        })
    }catch(e){
        res.status(500).json({
            error: e
        })
    }
})

app.get('/todos', async (req, res) => {
    const { username } = req.body;
    try{
    const user = await prismaClient.user.findFirst({
        where: {
            username
        }
    })
    const todos = await prismaClient.todo.findMany({
        where: {
            userId: user?.id
        }
    })
    res.status(200).json({
        todos
    })
    }catch(e){
        console.error(e);
        res.status(500).json({
            error: e
        })
    }
})

app.post('/todo', async (req, res) => {
    const { username, task, done } = req.body;
    try{
        const user = await prismaClient.user.findFirst({
            where: {
                username
            }
        })
        if(!user){
            res.status(404).json({
                message: "User not found !"
            })
        }
        await prismaClient.todo.create({
            data: {
                userId: user?.id!,
                task: task,
                done: done
            }
        })
        res.status(200).json({
            message: "Todo added!"
        })
    }catch(e){
        console.log(e);
        res.send(500).json({
            error: e
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})