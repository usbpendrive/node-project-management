const { GraphQLScalarType } = require('graphql')
const moment = require('moment')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Team } = require('./models')

const JWT_SECRET = process.env.JWT_SECRET

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())]
}

const avatarColors = [
    "D81B60","F06292","F48FB1","FFB74D","FF9800","F57C00","00897B","4DB6AC","80CBC4",
    "80DEEA","4DD0E1","00ACC1","9FA8DA","7986CB","3949AB","8E24AA","BA68C8","CE93D8"
]

const resolvers = {
    Query: {
        test(_, args, context) {
            return 'Hello World!'
        }
    },
    Mutation: {
        async captureEmail (_, { email }) {
            const isEmailTaken = await User.findOne({email})
            if (isEmailTaken) {
                throw new Error('This email is already taken')
            }
            const user = await User.create({
                email,
                role: 'Owner',
                status: 'Pending'
            })
            return user
        },
        async signup (_, { id, firstname, lastname, password }) {
            const user = await User.findById(id)
            const common = {
                firstname,
                lastname,
                name: `${firstname} ${lastname}`,
                avatarColors: randomChoice(avatarColors),
                password: await bcrypt.hash(password, 10),
                status: 'Active'
            }
            if (user.role === 'Owner') {
                const team = await Team.create({
                    name: `${common.name}'s Team`
                })
                user.set({
                    ...common,
                    team: team.id,
                    jobTitle: 'CEO/Owner/Founder'
                })
            } else {
                user.set(common)
            }
            await user.save()
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET)
            return { token, user }
        },
        async login (_, { email, password } ) {}
    },
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue: (value) => moment(value).toDate(),
        serialize: (value) => value.getTime(),
        parseLiteral: (ast) => ast
    })
}

module.exports = resolvers