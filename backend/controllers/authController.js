const prisma = require('../database'); //import prisma client
const bcrypt = require('bcryptjs'); //import bcrypt for password hashing

async function registerUser(req, res) {
    try{
        const{firstName, lastName, gender, dateOfBirth, phone, email, password} = req.body;

        // Basic validation
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({error: 'Semua field kena isi woi!'});
        }

        //validate date
        let dob = null;
        if(dateOfBirth) {
            const d = new Date(dateOfBirth);
            if(isNaN(d.getTime())){
                return res.status(400).json({error: 'Tarikh lahir salah format oi!'});
            }
            dob = d;
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create user with Prisma
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                gender: gender || null,
                dateOfBirth: dob,
                phone: phone || null,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true
            }
        });

        return res.status(201).json({message: 'User dah registered yey!🥳', user: newUser});
    
    } catch (error) {
        if(error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return res.status(400).json({error: 'Email ni dah ada orang pakai!'});
        }
        console.error('Registration error:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
}
module.exports = {registerUser};